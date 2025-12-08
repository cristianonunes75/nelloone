import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogoText } from "@/components/LogoText";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { 
  User, 
  FileText, 
  Map, 
  History, 
  CreditCard, 
  Settings, 
  LogOut,
  ArrowLeft,
  Save,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Clock,
  Lock,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { LanguageToggle } from "@/components/LanguageToggle";

// Import user translations
import enUser from "@/locales/en/user.json";
import ptUser from "@/locales/pt/user.json";

type TabType = "profile" | "tests" | "map" | "history" | "billing";

interface UserTest {
  id: string;
  test_id: string;
  status: "not_started" | "in_progress" | "completed";
  completed_at: string | null;
  result_data: any;
  test: {
    name: string;
    type: string;
    icon: string | null;
  };
}

const UserArea = () => {
  const { user, profile, signOut, userRoles } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  const t = language === "en" ? enUser : ptUser;
  const isAdmin = userRoles.includes("admin");
  
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [userTests, setUserTests] = useState<UserTest[]>([]);
  const [hasMap, setHasMap] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || user?.user_metadata?.full_name || "",
    phone: profile?.phone || user?.user_metadata?.phone || "",
    profession: profile?.profession || "",
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        phone: profile.phone || "",
        profession: profile.profession || "",
      });
    }
  }, [profile]);

  // Fetch user tests
  useEffect(() => {
    const fetchUserTests = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from("user_tests")
        .select(`
          id,
          test_id,
          status,
          completed_at,
          result_data,
          test:tests(name, type, icon)
        `)
        .eq("user_id", user.id)
        .order("completed_at", { ascending: false });
      
      if (!error && data) {
        setUserTests(data as any);
      }
    };
    
    fetchUserTests();
  }, [user]);

  // Check if user has generated map
  useEffect(() => {
    const checkMap = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from("mapa_essencia")
        .select("id")
        .eq("user_id", user.id)
        .single();
      
      setHasMap(!!data);
    };
    
    checkMap();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user?.id,
          full_name: formData.fullName,
          phone: formData.phone,
          profession: formData.profession,
        });

      if (error) throw error;

      toast({
        title: t.profile.success,
        description: t.profile.success_description,
      });
    } catch (error: any) {
      toast({
        title: t.profile.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate(language === "en" ? "/en" : "/");
  };

  const handleNavigation = (path: string) => {
    const basePath = language === "en" ? "/en" : language === "pt-pt" ? "/pt-pt" : "";
    const localizedPath = `${basePath}${path}`;
    navigate(localizedPath);
  };

  const completedTests = userTests.filter(t => t.status === "completed");
  const allTestsCompleted = completedTests.length >= 7;

  const sidebarItems = [
    { id: "profile" as TabType, label: t.sidebar.profile, icon: User },
    { id: "tests" as TabType, label: t.sidebar.my_tests, icon: FileText },
    { id: "map" as TabType, label: t.sidebar.map, icon: Map },
    { id: "history" as TabType, label: t.sidebar.history, icon: History },
    { id: "billing" as TabType, label: t.sidebar.billing, icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container px-4 py-3 flex items-center justify-between">
          <button onClick={() => handleNavigation("/")} className="focus:outline-none">
            <LogoText className="text-lg md:text-xl" variant="solid" />
          </button>
          
          <div className="flex items-center gap-3">
            <LanguageToggle variant="minimal" />
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground">
              <LogOut className="w-4 h-4 mr-2" strokeWidth={1.5} />
              <span className="hidden sm:inline">{t.sidebar.logout}</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6 md:py-10">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                    activeTab === item.id
                      ? "bg-ink/10 text-ink"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="w-4 h-4" strokeWidth={1.5} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">{t.profile.title}</h1>
                  <p className="text-muted-foreground mt-1">{t.profile.subtitle}</p>
                </div>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.profile.details}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">{t.profile.full_name}</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder={language === "en" ? "Your name" : "Seu nome"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">{t.profile.email}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">{t.profile.email_readonly}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t.profile.phone}</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder={language === "en" ? "(555) 123-4567" : "(11) 99999-9999"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profession">{t.profile.profession}</Label>
                        <Input
                          id="profession"
                          value={formData.profession}
                          onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                          placeholder={language === "en" ? "e.g., Engineer, Teacher..." : "Ex: Advogado, Médico..."}
                        />
                      </div>

                      <Separator className="my-4" />

                      <div className="space-y-2">
                        <Label>{t.profile.language}</Label>
                        <LanguageToggle />
                      </div>

                      {user?.created_at && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-muted-foreground">
                            {t.profile.created_at}: {format(new Date(user.created_at), language === "en" ? "MMMM d, yyyy" : "dd/MM/yyyy")}
                          </p>
                        </div>
                      )}

                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? t.profile.saving : t.profile.save_changes}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tests Tab */}
            {activeTab === "tests" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">{t.tests.title}</h1>
                  <p className="text-muted-foreground mt-1">{t.tests.subtitle}</p>
                </div>

                {userTests.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="py-12 text-center">
                      <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground mb-4">{t.tests.empty}</p>
                      <Button onClick={() => handleNavigation("/cliente")}>
                        {t.tests.start_journey}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {userTests.map((test) => (
                      <Card key={test.id} className="border-border/50 hover:border-border transition-colors">
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-ink/10 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-ink" />
                              </div>
                              <div>
                                <h3 className="font-medium">{test.test?.name}</h3>
                                {test.completed_at && (
                                  <p className="text-sm text-muted-foreground">
                                    {t.tests.completed_on} {format(new Date(test.completed_at), language === "en" ? "MMM d, yyyy" : "dd/MM/yyyy")}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={test.status === "completed" ? "default" : "secondary"}
                                className={cn(
                                  test.status === "completed" && "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                )}
                              >
                                {test.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                {test.status === "in_progress" && <Clock className="w-3 h-3 mr-1" />}
                                {t.tests.status[test.status]}
                              </Badge>
                              {test.status === "completed" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleNavigation(`/cliente/test-results/${test.id}`)}
                                >
                                  {t.tests.view_result}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Map Tab */}
            {activeTab === "map" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">{t.map.title}</h1>
                  <p className="text-muted-foreground mt-1">{t.map.subtitle}</p>
                </div>

                <Card className="border-border/50">
                  <CardContent className="py-8">
                    {hasMap ? (
                      <div className="text-center space-y-4">
                        <Map className="w-16 h-16 mx-auto text-ink" />
                        <p className="text-muted-foreground">{t.map.description}</p>
                        <div className="flex flex-wrap justify-center gap-3">
                          <Button onClick={() => handleNavigation("/codigo-essencia")}>
                            {t.map.view_map}
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            {t.map.export_pdf}
                          </Button>
                          <Button variant="outline">
                            <Share2 className="w-4 h-4 mr-2" />
                            {t.map.share}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                          <Lock className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{t.map.not_generated}</p>
                          <p className="text-sm text-muted-foreground mt-1">{t.map.complete_tests}</p>
                        </div>
                        <div className="flex justify-center gap-2">
                          <Badge variant="secondary">{completedTests.length}/7 {language === "en" ? "tests completed" : "testes concluídos"}</Badge>
                        </div>
                        {allTestsCompleted && (
                          <Button onClick={() => handleNavigation("/codigo-essencia")}>
                            {t.map.generate}
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">{t.history.title}</h1>
                  <p className="text-muted-foreground mt-1">{t.history.subtitle}</p>
                </div>

                {completedTests.length === 0 ? (
                  <Card className="border-border/50">
                    <CardContent className="py-12 text-center">
                      <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">{t.history.empty}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {completedTests.map((test) => (
                      <Card 
                        key={test.id} 
                        className="border-border/50 hover:border-border transition-colors cursor-pointer"
                        onClick={() => handleNavigation(`/cliente/test-results/${test.id}`)}
                      >
                        <CardContent className="py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{test.test?.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {test.completed_at && format(new Date(test.completed_at), language === "en" ? "MMMM d, yyyy" : "dd 'de' MMMM 'de' yyyy")}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm">
                              {t.history.view_details}
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === "billing" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-semibold">{t.billing.title}</h1>
                  <p className="text-muted-foreground mt-1">{t.billing.subtitle}</p>
                </div>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.billing.subscription}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <CreditCard className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground mb-4">{t.billing.no_subscription}</p>
                      <Button variant="outline" onClick={() => handleNavigation(language === "en" ? "/#precos" : "/#precos")}>
                        {language === "en" ? "View Plans" : "Ver Planos"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">{t.billing.invoices}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">{t.billing.no_invoices}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserArea;