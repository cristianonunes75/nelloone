import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "cliente";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  profession: string | null;
  avatar_url: string | null;
  // Journey tracking fields
  journey_status?: string;
  journey_total_tests?: number;
  journey_completed_tests?: number;
  journey_tests_status?: Record<string, string> | null;
  journey_started_at?: string | null;
  journey_completed_at?: string | null;
  codigo_essencia_unlocked?: boolean | null;
  ativacao_codigo_unlocked?: boolean | null;
  // Founder flag
  is_founder?: boolean | null;
  is_blocked?: boolean | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userRoles: UserRole[];
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  userRoles: [],
  profile: null,
  isLoading: true,
  signOut: async () => {},
  setActiveRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });

      if (rolesError) throw rolesError;
      
      const roles = (rolesData || []).map((r: any) => r.role as UserRole);
      setUserRoles(roles);
      
      // Prioritize admin role
      const primaryRole = roles.find(r => r === "admin") || roles[0] || "cliente";
      setUserRole(primaryRole as UserRole);

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!profileError && profileData) {
        // Cast profile data to Profile type, handling Json -> Record conversion
        setProfile({
          ...profileData,
          journey_tests_status: profileData.journey_tests_status as Record<string, string> | null,
        } as Profile);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserRoles(["cliente"]);
      setUserRole("cliente");
    }
  };

  useEffect(() => {
    let mounted = true;

    const hydrateSession = async () => {
      try {
        // Fail-safe: never keep the app stuck in loading forever
        const timeoutId = window.setTimeout(() => {
          if (!mounted) return;
          setIsLoading(false);
        }, 8000);

        const { data: { session } } = await supabase.auth.getSession();

        window.clearTimeout(timeoutId);
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error("Error hydrating session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Check for existing session first
    hydrateSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Use setTimeout to avoid deadlock
          setTimeout(async () => {
            if (!mounted) return;
            await fetchUserData(session.user.id);
          }, 0);
        } else {
          setUserRole(null);
          setUserRoles([]);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado",
        description: "Você saiu da sua conta com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao sair",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const setActiveRole = (role: UserRole) => {
    if (userRoles.includes(role)) {
      setUserRole(role);
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, session, userRole, userRoles, profile, isLoading, signOut, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
