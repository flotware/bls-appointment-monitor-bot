CREATE TYPE public.app_role AS ENUM ('owner', 'administrator', 'manager', 'team_member', 'viewer');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  agency_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Members can create own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Members can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
GRANT SELECT ON public.organization_memberships TO authenticated;
GRANT ALL ON public.organization_memberships TO service_role;
ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'team_member',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_org_access(_organization_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.organization_memberships m
    WHERE m.organization_id = _organization_id AND m.user_id = auth.uid()
  );
$$;
REVOKE ALL ON FUNCTION public.has_org_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_org_access(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.has_org_role(_organization_id uuid, _roles public.app_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles r
    WHERE r.organization_id = _organization_id AND r.user_id = auth.uid() AND r.role = ANY(_roles)
  );
$$;
REVOKE ALL ON FUNCTION public.has_org_role(uuid, public.app_role[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, public.app_role[]) TO authenticated;

CREATE POLICY "Organization members can read their workspace" ON public.organizations FOR SELECT TO authenticated USING (public.has_org_access(id));
CREATE POLICY "Owners and administrators can update their workspace" ON public.organizations FOR UPDATE TO authenticated USING (public.has_org_role(id, ARRAY['owner','administrator']::public.app_role[])) WITH CHECK (public.has_org_role(id, ARRAY['owner','administrator']::public.app_role[]));
CREATE POLICY "Organization members can read memberships" ON public.organization_memberships FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Organization members can read roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.applicants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  nationality text NOT NULL DEFAULT '',
  date_of_birth date,
  gender text NOT NULL DEFAULT '',
  passport_number text NOT NULL DEFAULT '',
  passport_issue_date date,
  passport_expiry_date date,
  residential_address text NOT NULL DEFAULT '',
  visa_category text NOT NULL DEFAULT '',
  appointment_category text NOT NULL DEFAULT '',
  group_name text NOT NULL DEFAULT 'Individual',
  status text NOT NULL DEFAULT 'incomplete' CHECK (status IN ('ready','incomplete','booked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applicants TO authenticated;
GRANT ALL ON public.applicants TO service_role;
ALTER TABLE public.applicants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read applicants" ON public.applicants FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add applicants" ON public.applicants FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id) AND created_by = auth.uid());
CREATE POLICY "Workspace members can update applicants" ON public.applicants FOR UPDATE TO authenticated USING (public.has_org_access(organization_id)) WITH CHECK (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can delete applicants" ON public.applicants FOR DELETE TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.appointment_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  centre text NOT NULL,
  postal_code text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  visa_category text NOT NULL DEFAULT '',
  appointment_type text NOT NULL DEFAULT '',
  applicant_count integer NOT NULL DEFAULT 1 CHECK (applicant_count > 0),
  slots_requested integer NOT NULL DEFAULT 1 CHECK (slots_requested > 0),
  preferred_date_from date,
  preferred_date_to date,
  preferred_time_from time,
  preferred_time_to time,
  flight_date date,
  flight_time time,
  departure_airport text NOT NULL DEFAULT '',
  destination_airport text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appointment_configurations TO authenticated;
GRANT ALL ON public.appointment_configurations TO service_role;
ALTER TABLE public.appointment_configurations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read appointment configurations" ON public.appointment_configurations FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add appointment configurations" ON public.appointment_configurations FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id) AND created_by = auth.uid());
CREATE POLICY "Workspace members can update appointment configurations" ON public.appointment_configurations FOR UPDATE TO authenticated USING (public.has_org_access(organization_id)) WITH CHECK (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can delete appointment configurations" ON public.appointment_configurations FOR DELETE TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.monitoring_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  configuration_id uuid NOT NULL REFERENCES public.appointment_configurations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL,
  status text NOT NULL DEFAULT 'stopped' CHECK (status IN ('queued','running','paused','stopped','error')),
  last_checked_at timestamptz,
  slots_detected integer NOT NULL DEFAULT 0 CHECK (slots_detected >= 0),
  last_error text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monitoring_tasks TO authenticated;
GRANT ALL ON public.monitoring_tasks TO service_role;
ALTER TABLE public.monitoring_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read monitoring tasks" ON public.monitoring_tasks FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add monitoring tasks" ON public.monitoring_tasks FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id) AND created_by = auth.uid());
CREATE POLICY "Workspace members can update monitoring tasks" ON public.monitoring_tasks FOR UPDATE TO authenticated USING (public.has_org_access(organization_id)) WITH CHECK (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can delete monitoring tasks" ON public.monitoring_tasks FOR DELETE TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.detected_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  configuration_id uuid NOT NULL REFERENCES public.appointment_configurations(id) ON DELETE CASCADE,
  monitoring_task_id uuid REFERENCES public.monitoring_tasks(id) ON DELETE SET NULL,
  applicant_label text NOT NULL DEFAULT '',
  centre text NOT NULL,
  slot_at timestamptz NOT NULL,
  detected_at timestamptz NOT NULL DEFAULT now(),
  review_status text NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending','confirmed','dismissed')),
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.detected_slots TO authenticated;
GRANT ALL ON public.detected_slots TO service_role;
ALTER TABLE public.detected_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read detected slots" ON public.detected_slots FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add detected slots" ON public.detected_slots FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can review detected slots" ON public.detected_slots FOR UPDATE TO authenticated USING (public.has_org_access(organization_id)) WITH CHECK (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can dismiss detected slots" ON public.detected_slots FOR DELETE TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id uuid,
  actor_label text NOT NULL DEFAULT '',
  category text NOT NULL CHECK (category IN ('monitoring','config','applicant','auth','system','notification','integration')),
  level text NOT NULL DEFAULT 'info' CHECK (level IN ('info','warning','error')),
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_logs TO authenticated;
GRANT ALL ON public.activity_logs TO service_role;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read activity logs" ON public.activity_logs FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add their own activity" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id) AND actor_id = auth.uid());

CREATE TABLE public.notification_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text NOT NULL CHECK (provider IN ('email','telegram','discord','whatsapp')),
  enabled boolean NOT NULL DEFAULT false,
  recipient text NOT NULL DEFAULT '',
  sender_name text NOT NULL DEFAULT '',
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, provider)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_preferences TO authenticated;
GRANT ALL ON public.notification_preferences TO service_role;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read notification preferences" ON public.notification_preferences FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Workspace members can add notification preferences" ON public.notification_preferences FOR INSERT TO authenticated WITH CHECK (public.has_org_access(organization_id) AND updated_by = auth.uid());
CREATE POLICY "Workspace members can update notification preferences" ON public.notification_preferences FOR UPDATE TO authenticated USING (public.has_org_access(organization_id)) WITH CHECK (public.has_org_access(organization_id) AND updated_by = auth.uid());
CREATE POLICY "Workspace members can delete notification preferences" ON public.notification_preferences FOR DELETE TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  provider text NOT NULL,
  recipient text NOT NULL DEFAULT '',
  event_type text NOT NULL,
  delivery_status text NOT NULL CHECK (delivery_status IN ('queued','sent','failed')),
  provider_message text NOT NULL DEFAULT '',
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notification_deliveries TO authenticated;
GRANT ALL ON public.notification_deliveries TO service_role;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read notification delivery history" ON public.notification_deliveries FOR SELECT TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.integration_health (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  integration text NOT NULL,
  connection_status text NOT NULL DEFAULT 'not_configured' CHECK (connection_status IN ('not_configured','unknown','connected','error')),
  last_success_at timestamptz,
  last_checked_at timestamptz,
  last_error text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, integration)
);
GRANT SELECT ON public.integration_health TO authenticated;
GRANT ALL ON public.integration_health TO service_role;
ALTER TABLE public.integration_health ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read integration health" ON public.integration_health FOR SELECT TO authenticated USING (public.has_org_access(organization_id));

CREATE TABLE public.workspace_preferences (
  organization_id uuid PRIMARY KEY REFERENCES public.organizations(id) ON DELETE CASCADE,
  require_manual_review boolean NOT NULL DEFAULT true,
  pause_after_consecutive_errors integer NOT NULL DEFAULT 5 CHECK (pause_after_consecutive_errors > 0),
  include_applicant_names_in_notifications boolean NOT NULL DEFAULT false,
  updated_by uuid NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.workspace_preferences TO authenticated;
GRANT ALL ON public.workspace_preferences TO service_role;
ALTER TABLE public.workspace_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Workspace members can read workspace preferences" ON public.workspace_preferences FOR SELECT TO authenticated USING (public.has_org_access(organization_id));
CREATE POLICY "Owners and administrators can create workspace preferences" ON public.workspace_preferences FOR INSERT TO authenticated WITH CHECK (public.has_org_role(organization_id, ARRAY['owner','administrator']::public.app_role[]) AND updated_by = auth.uid());
CREATE POLICY "Owners and administrators can update workspace preferences" ON public.workspace_preferences FOR UPDATE TO authenticated USING (public.has_org_role(organization_id, ARRAY['owner','administrator']::public.app_role[])) WITH CHECK (public.has_org_role(organization_id, ARRAY['owner','administrator']::public.app_role[]) AND updated_by = auth.uid());

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER organizations_set_updated_at BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER applicants_set_updated_at BEFORE UPDATE ON public.applicants FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER appointment_configurations_set_updated_at BEFORE UPDATE ON public.appointment_configurations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER monitoring_tasks_set_updated_at BEFORE UPDATE ON public.monitoring_tasks FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER notification_preferences_set_updated_at BEFORE UPDATE ON public.notification_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER integration_health_set_updated_at BEFORE UPDATE ON public.integration_health FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER workspace_preferences_set_updated_at BEFORE UPDATE ON public.workspace_preferences FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_organization_id uuid;
  profile_name text;
  agency text;
BEGIN
  profile_name := COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''), NULLIF(NEW.raw_user_meta_data ->> 'name', ''), '');
  agency := COALESCE(NULLIF(NEW.raw_user_meta_data ->> 'agency_name', ''), 'My workspace');
  INSERT INTO public.profiles (id, full_name, agency_name, phone)
  VALUES (NEW.id, profile_name, agency, COALESCE(NEW.raw_user_meta_data ->> 'phone', ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.organizations (name, owner_id) VALUES (agency, NEW.id) RETURNING id INTO new_organization_id;
  INSERT INTO public.organization_memberships (organization_id, user_id) VALUES (new_organization_id, NEW.id);
  INSERT INTO public.user_roles (organization_id, user_id, role) VALUES (new_organization_id, NEW.id, 'owner');
  INSERT INTO public.workspace_preferences (organization_id, updated_by) VALUES (new_organization_id, NEW.id);
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
CREATE TRIGGER on_auth_user_created_create_workspace AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
