import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  Clock, 
  Car,
  Heart,
  Shield,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileText
} from "lucide-react";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  contract_type: string;
  status: string;
  description: string | null;
  cultural_affinity_question: string | null;
  cultural_affinity_options: any;
  closed_at: string | null;
  company: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

type FormStep = "job_info" | "personal" | "location" | "cultural" | "resume" | "consent" | "success";

const CONTRACT_TYPES: Record<string, string> = {
  clt: "CLT",
  pj: "PJ",
  internship: "Estágio",
  freelancer: "Freelancer",
};

const DEFAULT_AFFINITY_OPTIONS = [
  "Me identifico e vivo esses valores no meu dia a dia",
  "Me identifico e tenho interesse em viver esse ambiente",
  "Respeito esse tipo de ambiente, mesmo não sendo algo que vivencio",
  "Prefiro não responder"
];

const AFFINITY_MAPPING: Record<number, string> = {
  0: "high",
  1: "medium",
  2: "low",
  3: "not_informed",
};

export default function BusinessJobPublic() {
  const { slug } = useParams<{ slug: string }>();
  
  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<FormStep>("job_info");
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    neighborhood: "",
    city: "",
    commute_time: "",
    cultural_affinity_response: "",
    cultural_affinity_index: -1,
    lgpd_consent: false,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    if (slug) {
      fetchJob();
    }
  }, [slug]);

  const fetchJob = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_postings")
        .select(`
          *,
          company:companies(id, name, logo_url)
        `)
        .eq("public_slug", slug)
        .eq("status", "open")
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!job || !formData.lgpd_consent) return;
    
    setSubmitting(true);
    try {
      let resumeUrl = null;
      let resumeFilename = null;

      // Upload resume if provided
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        // Store inside the "resumes" bucket
        const filePath = `${job.company.id}/${job.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, resumeFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(filePath);

        resumeUrl = urlData.publicUrl;
        resumeFilename = resumeFile.name;
      }

      // Determine affinity level
      const affinityLevel = formData.cultural_affinity_index >= 0 
        ? AFFINITY_MAPPING[formData.cultural_affinity_index] 
        : "not_informed";

      // Create application
      const { error } = await supabase
        .from("job_applications")
        .insert({
          job_id: job.id,
          company_id: job.company.id,
          status: "active_candidate",
          source: "public_link",
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone || null,
          neighborhood: formData.neighborhood,
          city: formData.city,
          commute_time: formData.commute_time || null,
          cultural_affinity_response: formData.cultural_affinity_response || null,
          cultural_affinity_level: affinityLevel,
          resume_url: resumeUrl,
          resume_filename: resumeFilename,
          lgpd_consent: true,
          lgpd_consent_at: new Date().toISOString(),
          lgpd_consent_text_version: "v1.0",
          confirmed_at: new Date().toISOString(), // Public link = auto-confirmed
        });

      if (error) throw error;

      setStep("success");
    } catch (error: any) {
      console.error("Error submitting application:", error);
      toast.error(error.message || "Erro ao enviar candidatura");
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    const steps: FormStep[] = ["job_info", "personal", "location", "cultural", "resume", "consent"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: FormStep[] = ["job_info", "personal", "location", "cultural", "resume", "consent"];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const canProceed = () => {
    switch (step) {
      case "job_info":
        return true;
      case "personal":
        return formData.full_name && formData.email;
      case "location":
        return formData.city && formData.commute_time;
      case "cultural":
        return true; // Optional
      case "resume":
        return true; // Optional
      case "consent":
        return formData.lgpd_consent;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Vaga não encontrada</h2>
            <p className="text-muted-foreground text-center">
              Esta vaga pode ter sido encerrada ou o link está incorreto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Candidatura enviada!</h2>
              <p className="text-muted-foreground text-center mb-6">
                Obrigado pelo interesse na vaga de <strong>{job.title}</strong> na {job.company.name}.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Você receberá atualizações sobre o processo seletivo no email informado.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const affinityOptions = job.cultural_affinity_options || DEFAULT_AFFINITY_OPTIONS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Company Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            {job.company.logo_url ? (
              <img src={job.company.logo_url} alt={job.company.name} className="w-12 h-12 object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
          <p className="text-muted-foreground">{job.company.name} • {job.department}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
              {CONTRACT_TYPES[job.contract_type]}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {["job_info", "personal", "location", "cultural", "resume", "consent"].map((s, i) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-colors ${
                ["job_info", "personal", "location", "cultural", "resume", "consent"].indexOf(step) >= i
                  ? "bg-primary"
                  : "bg-muted"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {step === "job_info" && <><Briefcase className="h-5 w-5" /> Sobre a Vaga</>}
                  {step === "personal" && <><Building2 className="h-5 w-5" /> Dados Pessoais</>}
                  {step === "location" && <><MapPin className="h-5 w-5" /> Localização</>}
                  {step === "cultural" && <><Heart className="h-5 w-5" /> Afinidade Cultural</>}
                  {step === "resume" && <><FileText className="h-5 w-5" /> Currículo</>}
                  {step === "consent" && <><Shield className="h-5 w-5" /> Consentimento</>}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === "job_info" && (
                  <div className="space-y-4">
                    {job.description && (
                      <div>
                        <h4 className="font-medium mb-2">Descrição</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                      </div>
                    )}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">
                        Ao prosseguir, você preencherá um formulário com seus dados e poderá anexar seu currículo.
                      </p>
                    </div>
                  </div>
                )}

                {step === "personal" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo *</Label>
                      <Input
                        id="name"
                        placeholder="Seu nome completo"
                        value={formData.full_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  </div>
                )}

                {step === "location" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro onde mora</Label>
                      <Input
                        id="neighborhood"
                        placeholder="Ex: Jardins"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade *</Label>
                      <Input
                        id="city"
                        placeholder="Ex: São Paulo"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tempo de deslocamento até o trabalho *</Label>
                      <RadioGroup
                        value={formData.commute_time}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, commute_time: value }))}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="up_to_30_min" id="commute-30" />
                          <Label htmlFor="commute-30" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              Até 30 minutos
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="30_to_60_min" id="commute-60" />
                          <Label htmlFor="commute-60" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              30 a 60 minutos
                            </div>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="over_60_min" id="commute-over" />
                          <Label htmlFor="commute-over" className="cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Car className="h-4 w-4 text-muted-foreground" />
                              Mais de 1 hora
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === "cultural" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {job.cultural_affinity_question || "Esta empresa possui uma identidade e valores próprios, vividos no dia a dia do trabalho, de forma respeitosa e aberta. Como você se identifica com esse tipo de ambiente?"}
                    </p>
                    <RadioGroup
                      value={formData.cultural_affinity_index.toString()}
                      onValueChange={(value) => {
                        const index = parseInt(value);
                        setFormData(prev => ({
                          ...prev,
                          cultural_affinity_index: index,
                          cultural_affinity_response: affinityOptions[index]
                        }));
                      }}
                      className="space-y-3"
                    >
                      {affinityOptions.map((option, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <RadioGroupItem value={index.toString()} id={`affinity-${index}`} className="mt-1" />
                          <Label htmlFor={`affinity-${index}`} className="cursor-pointer text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {step === "resume" && (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Anexe seu currículo para complementar sua candidatura.
                    </p>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-4" />
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                        className="max-w-xs mx-auto"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        PDF ou DOC, máximo 5MB
                      </p>
                    </div>
                    {resumeFile && (
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="text-sm">{resumeFile.name}</span>
                      </div>
                    )}
                  </div>
                )}

                {step === "consent" && (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-3">
                      <p>
                        Ao enviar sua candidatura, você declara que:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Os dados fornecidos são verdadeiros</li>
                        <li>Autoriza o uso dos seus dados para este processo seletivo</li>
                        <li>Entende que nenhuma avaliação clínica será realizada</li>
                        <li>Entende que não há decisão automática de contratação</li>
                        <li>Pode solicitar a exclusão dos seus dados a qualquer momento</li>
                      </ul>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="consent"
                        checked={formData.lgpd_consent}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, lgpd_consent: checked === true }))}
                      />
                      <Label htmlFor="consent" className="text-sm cursor-pointer">
                        Li e concordo com os termos acima, e autorizo o uso dos meus dados conforme a LGPD.
                      </Label>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  {step !== "job_info" ? (
                    <Button variant="outline" onClick={prevStep}>
                      Voltar
                    </Button>
                  ) : (
                    <div />
                  )}
                  
                  {step === "consent" ? (
                    <Button 
                      onClick={handleSubmit} 
                      disabled={!canProceed() || submitting}
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                      Enviar Candidatura
                    </Button>
                  ) : (
                    <Button onClick={nextStep} disabled={!canProceed()}>
                      Continuar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
