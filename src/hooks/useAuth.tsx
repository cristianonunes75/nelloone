import { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type UserRole = "admin" | "fotografo" | "cliente";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: null,
  isLoading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        // Fetch user role after state updates
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from("user_roles")
                .select("role")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: true })
                .limit(1)
                .maybeSingle();

              if (error) throw error;
              setUserRole(data?.role as UserRole || "cliente");
            } catch (error) {
              console.error("Error fetching user role:", error);
              setUserRole("cliente");
            }
          }, 0);
        } else {
          setUserRole(null);
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
              .order("created_at", { ascending: true })
              .limit(1)
              .maybeSingle();

            if (error) throw error;
            setUserRole(data?.role as UserRole || "cliente");
          } catch (error) {
            console.error("Error fetching user role:", error);
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

  return (
    <AuthContext.Provider value={{ user, session, userRole, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
