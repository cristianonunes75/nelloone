import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "fotografo" | "cliente";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  userRoles: UserRole[];
  isLoading: boolean;
  signOut: () => Promise<void>;
  setActiveRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  userRoles: [],
  isLoading: true,
  signOut: async () => {},
  setActiveRole: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
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
              const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: true });

              if (error) throw error;
              
              const roles = (data || []).map((r: any) => r.role as UserRole);
              setUserRoles(roles);
              
              // Set primary role based on priority
              const primaryRole = roles.find(r => r === "admin") || 
                                 roles.find(r => r === "fotografo") || 
                                 roles[0] || "cliente";
              setUserRole(primaryRole);
            } catch (error) {
              console.error("Error fetching user roles:", error);
              setUserRoles(["cliente"]);
              setUserRole("cliente");
            }
          }, 0);
        } else {
          setUserRole(null);
          setUserRoles([]);
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
            const { data, error } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .order("created_at", { ascending: true });

            if (error) throw error;
            
            const roles = (data || []).map((r: any) => r.role as UserRole);
            setUserRoles(roles);
            
            // Set primary role based on priority
            const primaryRole = roles.find(r => r === "admin") || 
                               roles.find(r => r === "fotografo") || 
                               roles[0] || "cliente";
            setUserRole(primaryRole);
          } catch (error) {
            console.error("Error fetching user roles:", error);
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
    <AuthContext.Provider value={{ user, session, userRole, userRoles, isLoading, signOut, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
