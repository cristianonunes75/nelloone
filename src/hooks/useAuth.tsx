import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "fotografo" | "cliente";

interface Profile {
  id: string;
  full_name: string;
  phone: string | null;
  profession: string | null;
  avatar_url: string | null;
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

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user roles after state updates
        if (session?.user) {
          setTimeout(async () => {
            try {
              // Fetch roles
              const { data: rolesData, error: rolesError } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: true });

              if (rolesError) throw rolesError;
              
              const roles = (rolesData || []).map((r: any) => r.role as UserRole);
              setUserRoles(roles);
              
              const primaryRole = roles.find(r => r === "admin") || 
                                 roles.find(r => r === "fotografo") || 
                                 roles[0] || "cliente";
              setUserRole(primaryRole);

              // Fetch profile
              const { data: profileData, error: profileError } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", session.user.id)
                .single();

              if (!profileError && profileData) {
                setProfile(profileData);
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
              setUserRoles(["cliente"]);
              setUserRole("cliente");
            }
          }, 0);
        } else {
          setUserRole(null);
          setUserRoles([]);
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        setTimeout(async () => {
          try {
            const { data: rolesData, error: rolesError } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: true });

            if (rolesError) throw rolesError;
            
            const roles = (rolesData || []).map((r: any) => r.role as UserRole);
            setUserRoles(roles);
            
            const primaryRole = roles.find(r => r === "admin") || 
                               roles.find(r => r === "fotografo") || 
                               roles[0] || "cliente";
            setUserRole(primaryRole);

            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (!profileError && profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setUserRoles(["cliente"]);
            setUserRole("cliente");
          }
          setIsLoading(false);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
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
