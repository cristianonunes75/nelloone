import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Users,
  Brain,
  Target,
  ClipboardCheck,
  Mail,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Upload,
  FileText,
  TrendingUp,
  Award,
  Zap,
  Lock,
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  description: string | null;
  cultural_affinity_question: string | null;
  cultural_affinity_options: any;
  public_slug: string;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

type Step = "landing" | "form" | "upsell" | "consent" | "success";

export default function BusinessTalentPoolPublic() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>("landing");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    area_of_interest: "",
    city: "",
    lgpd_consent: false,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [resumeFilename, setResumeFilename] = useState<string | null>(null);

  // Check if returning from successful payment
  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    if (sessionId) {
      setStep("success");
    }
    const cancelled = searchParams.get("payment");
    if (cancelled === "cancelled") {
      toast.error("Pagamento cancelado. Voce pode tentar novamente.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (slug) fetchJob();
  }, [slug]);

  const fetchJob = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select(`*, company:companies(id, name, logo_url)`)
        .eq("public_slug", slug)
        .eq("status", "open")
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching talent pool:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile || !job) return;
    try {
      const fileExt = resumeFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${job.company.id}/${job.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage.from("resumes").upload(filePath, resumeFile);
      if (uploadError) {
        console.error("Resume upload error:", uploadError);
        return;
      }
      const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(filePath);
      setResumeUrl(urlData.publicUrl);
      setResumeFilename(resumeFile.name);
    } catch (err) {
      console.error("Resume upload failed:", err);
    }
  };

  const handleGoToUpsell = async () => {
    if (!formData.full_name || !formData.email) return;
    // Upload resume in background before moving to upsell
    if (resumeFile) await uploadResume();
    setStep("upsell");
  };

  const handleCheckout = async () => {
    if (!job || !formData.lgpd_consent) return;

    setSubmitting(true);
    try {
      const response = await supabase.functions.invoke("business-talent-pool-checkout", {
        body: {
          job_id: job.id,
          company_id: job.company.id,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || undefined,
          city: formData.city || undefined,
          area_of_interest: formData.area_of_interest || undefined,
          resume_url: resumeUrl || undefined,
          resume_filename: resumeFilename || undefined,
          slug: job.public_slug,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Erro ao iniciar pagamento");
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        throw new Error("URL de pagamento nao gerada");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Erro ao iniciar pagamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Not found
  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Banco de Talentos indisponivel</h2>
            <p className="text-muted-foreground text-center">
              Este banco de talentos pode ter sido encerrado ou o link esta incorreto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const companyName = job.company.name;
  const companyLogo = job.company.logo_url;

  // Success (after payment)
  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full"
        >
          <Card className="border-0 shadow-xl">
            <CardContent className="flex flex-col items-center justify-center py-12 px-8">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-3 text-center">Pagamento confirmado!</h2>
              <p className="text-muted-foreground text-center mb-6 leading-relaxed">
                Seu cadastro no banco de talentos da <strong>{companyName}</strong> foi realizado com sucesso.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 w-full mb-6">
                <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Proximo passo
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Enviamos um email com o link para iniciar sua avaliacao comportamental (DISC + Temperamentos).
                  Complete os testes para destacar seu perfil.
                </p>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Se nao receber o email em alguns minutos, verifique sua caixa de spam.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // ========== LANDING PAGE ==========
  if (step === "landing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="h-20 w-20 mx-auto rounded-2xl object-contain bg-white p-2 shadow-lg"
                />
              ) : (
                <div className="h-20 w-20 mx-auto rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Banco de Talentos
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="text-xl sm:text-2xl text-blue-100 font-medium mb-3"
            >
              {companyName}
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-blue-200 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              {job.description ||
                "Cadastre-se em nosso banco de talentos e destaque-se com seu perfil comportamental. Quando surgir uma oportunidade, voce sera o primeiro a ser chamado."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={() => setStep("form")}
                className="bg-white text-blue-700 hover:bg-blue-50 text-lg px-8 py-6 rounded-xl shadow-lg gap-2 font-semibold"
              >
                Quero me cadastrar
                <ArrowRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900">
            Como funciona?
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: ClipboardCheck,
                title: "1. Cadastre-se",
                desc: "Preencha seus dados e envie seu curriculo. Rapido e simples.",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Brain,
                title: "2. Faca a avaliacao",
                desc: "Complete os testes DISC e Temperamentos e descubra seu perfil profissional.",
                color: "bg-purple-100 text-purple-600",
              },
              {
                icon: Target,
                title: "3. Seja encontrado",
                desc: "Seu perfil fica visivel para a empresa. Quando surgir uma vaga compativel, voce e chamado.",
                color: "bg-green-100 text-green-600",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="pt-8 pb-6 px-6 text-center">
                    <div
                      className={`w-14 h-14 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <item.icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Why talent pool with behavioral assessment */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900">
              Por que empresas preferem candidatos com perfil mapeado?
            </h2>
            <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Candidatos que ja tem o perfil comportamental mapeado saem na frente no processo seletivo.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: TrendingUp,
                  title: "3x mais chances de ser chamado",
                  desc: "Empresas priorizam candidatos cujo perfil ja e conhecido. Voce pula a fila da triagem inicial.",
                },
                {
                  icon: Award,
                  title: "Metodologia usada por grandes empresas",
                  desc: "O teste DISC e utilizado por 75% das empresas Fortune 500 para entender o perfil de seus colaboradores.",
                },
                {
                  icon: Sparkles,
                  title: "Descubra seus pontos fortes",
                  desc: "Alem de se candidatar, voce recebe um mapa do seu estilo de trabalho, comunicacao e lideranca.",
                },
                {
                  icon: Zap,
                  title: "Processo mais rapido",
                  desc: "Com seu perfil pronto, a empresa nao precisa esperar semanas de testes. A contratacao e mais agil.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex gap-4 p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Pronto para se destacar?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Cadastre-se agora, mapeie seu perfil e esteja preparado para a proxima oportunidade.
          </p>
          <Button
            size="lg"
            onClick={() => setStep("form")}
            className="text-lg px-8 py-6 rounded-xl gap-2 font-semibold"
          >
            Cadastrar no Banco de Talentos
            <ArrowRight className="h-5 w-5" />
          </Button>
        </section>

        {/* Footer */}
        <footer className="border-t py-6 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a
              href="https://business.nello.one"
              className="underline hover:text-foreground"
              target="_blank"
              rel="noopener"
            >
              Nello Business
            </a>{" "}
            &mdash; Inteligencia comportamental para empresas
          </p>
        </footer>
      </div>
    );
  }

  // ========== FORM STEPS ==========
  const formSteps: Step[] = ["form", "upsell", "consent"];
  const currentStepIndex = formSteps.indexOf(step);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {companyLogo ? (
            <img src={companyLogo} alt={companyName} className="h-14 w-14 mx-auto rounded-xl object-contain mb-3" />
          ) : (
            <div className="h-14 w-14 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-3">
              <Building2 className="h-7 w-7 text-blue-600" />
            </div>
          )}
          <h1 className="text-xl font-bold mb-1">Banco de Talentos</h1>
          <p className="text-sm text-muted-foreground">{companyName}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {formSteps.map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 max-w-16 rounded-full transition-colors ${
                currentStepIndex >= i ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* ===== STEP: FORM ===== */}
            {step === "form" && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">Seus dados</h2>
                    <p className="text-sm text-muted-foreground">
                      Preencha as informacoes abaixo para se cadastrar.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.full_name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">WhatsApp</Label>
                      <Input
                        id="phone"
                        placeholder="(61) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Ex: Brasilia"
                        value={formData.city}
                        onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="area">Area de interesse</Label>
                      <Input
                        id="area"
                        placeholder="Ex: Atendimento, Administrativo, Louvor..."
                        value={formData.area_of_interest}
                        onChange={(e) => setFormData((prev) => ({ ...prev, area_of_interest: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Curriculo (opcional)</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                          className="max-w-xs mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-1">PDF ou DOC, maximo 5MB</p>
                      </div>
                      {resumeFile && (
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{resumeFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={() => setStep("landing")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                    <Button onClick={handleGoToUpsell} disabled={!formData.full_name || !formData.email}>
                      Continuar
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ===== STEP: UPSELL ===== */}
            {step === "upsell" && (
              <div className="space-y-6">
                {/* Main upsell card */}
                <Card className="border-0 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <Brain className="h-10 w-10 mx-auto mb-3 opacity-90" />
                    <h2 className="text-xl font-bold mb-1">Destaque seu perfil</h2>
                    <p className="text-blue-100 text-sm">
                      Candidatos com perfil mapeado tem 3x mais chances de serem chamados
                    </p>
                  </div>

                  <CardContent className="p-6 sm:p-8 space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Avaliacao Comportamental Completa</p>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">R$ 29</span>
                        <span className="text-xl font-bold">,90</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Pagamento unico</p>
                    </div>

                    {/* What's included */}
                    <div className="space-y-3">
                      {[
                        "Teste DISC completo — seu estilo de trabalho",
                        "Teste de Temperamentos — suas tendencias naturais",
                        "Perfil visivel para a empresa na hora de contratar",
                        "Prioridade quando surgir vaga compativel",
                        "Resultado instantaneo e confidencial",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social proof */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900 font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Metodologia DISC
                      </p>
                      <p className="text-xs text-amber-800 mt-1">
                        Utilizada por 75% das empresas Fortune 500 para entender o perfil comportamental de candidatos e colaboradores.
                      </p>
                    </div>

                    {/* What happens without */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium flex items-center gap-2 text-gray-700">
                        <Lock className="h-4 w-4" />
                        Sem a avaliacao
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Seu cadastro fica no banco, mas sem o perfil comportamental a empresa nao consegue fazer o match com as vagas. Candidatos com perfil mapeado sao sempre priorizados.
                      </p>
                    </div>

                    <Button
                      size="lg"
                      className="w-full text-base gap-2"
                      onClick={() => setStep("consent")}
                    >
                      <Sparkles className="h-5 w-5" />
                      Quero me destacar — R$ 29,90
                    </Button>
                  </CardContent>
                </Card>

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => setStep("form")}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            )}

            {/* ===== STEP: CONSENT + CHECKOUT ===== */}
            {step === "consent" && (
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-1 flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Confirmar e pagar
                    </h2>
                  </div>

                  {/* Order summary */}
                  <div className="bg-blue-50 rounded-xl p-5">
                    <h3 className="font-medium text-sm mb-3">Resumo</h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Avaliacao Comportamental (DISC + Temperamentos)</span>
                      <span className="font-semibold">R$ 29,90</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between items-center">
                      <span className="font-semibold text-sm">Total</span>
                      <span className="font-bold text-lg">R$ 29,90</span>
                    </div>
                  </div>

                  {/* Consent */}
                  <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
                    <p className="font-medium">Ao prosseguir, voce declara que:</p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Os dados fornecidos sao verdadeiros</li>
                      <li>
                        Autoriza o uso dos seus dados para processos seletivos da{" "}
                        <strong>{companyName}</strong>
                      </li>
                      <li>Entende que a avaliacao nao e diagnostico clinico</li>
                      <li>Entende que nao ha garantia de contratacao</li>
                      <li>Pode solicitar exclusao dos seus dados a qualquer momento</li>
                    </ul>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.lgpd_consent}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, lgpd_consent: checked === true }))
                      }
                    />
                    <Label htmlFor="consent" className="text-sm cursor-pointer leading-relaxed">
                      Li e concordo com os termos acima, e autorizo o uso dos meus dados conforme a LGPD.
                    </Label>
                  </div>

                  <Button
                    size="lg"
                    className="w-full text-base gap-2"
                    onClick={handleCheckout}
                    disabled={!formData.lgpd_consent || submitting}
                  >
                    {submitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Lock className="h-5 w-5" />
                    )}
                    {submitting ? "Redirecionando..." : "Pagar R$ 29,90"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Pagamento seguro via Stripe. Aceita cartao, Pix e boleto.
                  </p>

                  <div className="flex justify-center">
                    <Button variant="ghost" onClick={() => setStep("upsell")}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
