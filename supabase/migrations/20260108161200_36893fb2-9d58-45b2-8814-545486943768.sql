-- Create admin permission levels enum
CREATE TYPE public.admin_permission_level AS ENUM ('super_admin', 'suporte', 'visualizador');

-- Create admin_permissions table to store granular admin permissions
CREATE TABLE public.admin_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    permission_level admin_permission_level NOT NULL DEFAULT 'visualizador',
    can_manage_users BOOLEAN DEFAULT false,
    can_manage_payments BOOLEAN DEFAULT false,
    can_manage_products BOOLEAN DEFAULT false,
    can_manage_settings BOOLEAN DEFAULT false,
    can_view_reports BOOLEAN DEFAULT true,
    can_send_notifications BOOLEAN DEFAULT false,
    can_delete_data BOOLEAN DEFAULT false,
    can_impersonate BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID REFERENCES auth.users(id),
    UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.admin_permissions ENABLE ROW LEVEL SECURITY;

-- Only super_admins can view/manage permissions
CREATE POLICY "Super admins can view all permissions"
ON public.admin_permissions
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_permissions ap
        WHERE ap.user_id = auth.uid() 
        AND ap.permission_level = 'super_admin'
    )
    OR user_id = auth.uid()
);

CREATE POLICY "Super admins can manage permissions"
ON public.admin_permissions
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.admin_permissions ap
        WHERE ap.user_id = auth.uid() 
        AND ap.permission_level = 'super_admin'
    )
);

-- Function to check admin permission level
CREATE OR REPLACE FUNCTION public.get_admin_permission_level(_user_id uuid)
RETURNS admin_permission_level
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT permission_level
    FROM public.admin_permissions
    WHERE user_id = _user_id
    LIMIT 1
$$;

-- Function to check specific permission
CREATE OR REPLACE FUNCTION public.has_admin_permission(_user_id uuid, _permission text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    perm_record RECORD;
BEGIN
    SELECT * INTO perm_record FROM public.admin_permissions WHERE user_id = _user_id;
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    -- Super admins have all permissions
    IF perm_record.permission_level = 'super_admin' THEN
        RETURN true;
    END IF;
    
    -- Check specific permission
    CASE _permission
        WHEN 'manage_users' THEN RETURN perm_record.can_manage_users;
        WHEN 'manage_payments' THEN RETURN perm_record.can_manage_payments;
        WHEN 'manage_products' THEN RETURN perm_record.can_manage_products;
        WHEN 'manage_settings' THEN RETURN perm_record.can_manage_settings;
        WHEN 'view_reports' THEN RETURN perm_record.can_view_reports;
        WHEN 'send_notifications' THEN RETURN perm_record.can_send_notifications;
        WHEN 'delete_data' THEN RETURN perm_record.can_delete_data;
        WHEN 'impersonate' THEN RETURN perm_record.can_impersonate;
        ELSE RETURN false;
    END CASE;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_admin_permissions_updated_at
BEFORE UPDATE ON public.admin_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for test_purchases (for real-time dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE public.test_purchases;

-- Enable realtime for user_tests
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tests;

-- Enable realtime for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;