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
import { motion } from "framer-motion";
import { 
  Building2, 
  MapPin, 
  Car,
  Heart,
  Shield,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle
} from "lucide-react";

interface JobApplication {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  neighborhood: string | null;
  city: string | null;
  commute_time: string | null;
  cultural_affinity_response: string | null;
  pending_fields: string[] | null;
  confirmed_at: string | null;
  lgpd_consent: boolean;
  job: {
    id: string;
    title: string;
    department: string;
    cultural_affinity_question: string | null;
    cultural_affinity_options: string[] | null;
    company: {
      id: string;
      name: string;
      logo_url: string | null;
    };
  };
}

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

export default function BusinessApplicationConfirm() {
  const { token } = useParams<{ token: string }>();
  
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [declined, setDeclined] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  
  // Form data for completing missing fields
  const [formData, setFormData] = useState({
    neighborhood: "",
    city: "",
    commute_time: "",
    cultural_affinity_response: "",
    cultural_affinity_index: -1,
    lgpd_consent: false,
  });

  useEffect(() => {
    if (token) {
      fetchApplication();
    }
  }, [token]);

  const fetchApplication = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          job:job_postings(
            id,
            title,
            department,
            cultural_affinity_question,
            cultural_affinity_options,
            company:companies(id, name, logo_url)
          )
        `)
        .eq("confirmation_token", token)
        .single();

      if (error) throw error;
      
      if (data.confirmed_at) {
        setConfirmed(true);
      }
      
      setApplication(data as unknown as JobApplication);
      
      // Pre-fill form with existing data
      setFormData({
        neighborhood: data.neighborhood || "",
        city: data.city || "",
        commute_time: data.commute_time || "",
        cultural_affinity_response: data.cultural_affinity_response || "",
        cultural_affinity_index: -1,
        lgpd_consent: data.lgpd_consent || false,
      });
    } catch (error) {
      console.error("Error fetching application:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!application || !formData.lgpd_consent) return;
    
    setSubmitting(true);
    try {
      const affinityLevel = formData.cultural_affinity_index >= 0 
        ? AFFINITY_MAPPING[formData.cultural_affinity_index] 
        : application.cultural_affinity_response ? "not_informed" : null;

      const { error } = await supabase
        .from("job_applications")
        .update({
          status: "active_candidate",
          neighborhood: formData.neighborhood || application.neighborhood,
          city: formData.city || application.city,
          commute_time: formData.commute_time || application.commute_time,
          cultural_affinity_response: formData.cultural_affinity_response || application.cultural_affinity_response,
          cultural_affinity_level: affinityLevel,
          lgpd_consent: true,
          lgpd_consent_at: new Date().toISOString(),
          lgpd_consent_text_version: "v1.0",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", application.id);

      if (error) throw error;

      setConfirmed(true);
      toast.success("Candidatura confirmada!");
    } catch (error: any) {
      console.error("Error confirming application:", error);
      toast.error(error.message || "Erro ao confirmar candidatura");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = async () => {
    if (!application) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("job_applications")
        .update({
          status: "withdrawn",
        })
        .eq("id", application.id);

      if (error) throw error;

      setDeclined(true);
    } catch (error) {
      console.error("Error declining application:", error);
      toast.error("Erro ao recusar candidatura");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Link inválido</h2>
            <p className="text-muted-foreground text-center">
              Este link de confirmação é inválido ou expirou.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (declined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <XCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Candidatura recusada</h2>
            <p className="text-muted-foreground text-center">
              Entendemos sua decisão. Seus dados serão removidos do processo seletivo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmed) {
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
              <h2 className="text-2xl font-semibold mb-2">Candidatura confirmada!</h2>
              <p className="text-muted-foreground text-center mb-4">
                Sua candidatura para <strong>{application.job.title}</strong> na {application.job.company.name} foi confirmada.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Você receberá atualizações sobre as próximas etapas no email {application.email}.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const pendingFields = application.pending_fields || [];
  const needsNeighborhood = pendingFields.includes("neighborhood") && !formData.neighborhood;
  const needsCommute = pendingFields.includes("commute_time") && !formData.commute_time;
  const needsCultural = pendingFields.includes("cultural_affinity") && !formData.cultural_affinity_response;
  const needsConsent = pendingFields.includes("lgpd_consent") && !formData.lgpd_consent;

  const affinityOptions = application.job.cultural_affinity_options || DEFAULT_AFFINITY_OPTIONS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4">
            {application.job.company.logo_url ? (
              <img src={application.job.company.logo_url} alt={application.job.company.name} className="w-12 h-12 object-contain" />
            ) : (
              <Building2 className="w-8 h-8 text-primary" />
            )}
          </div>
          <h1 className="text-2xl font-bold mb-1">Confirmar Candidatura</h1>
          <p className="text-muted-foreground">
            {application.job.title} • {application.job.company.name}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Olá, {application.full_name || "Candidato"}!</CardTitle>
            <CardDescription>
              Recebemos seu currículo e gostaríamos de confirmar seu interesse na vaga.
              Complete as informações abaixo para seguir no processo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Missing location data */}
            {(needsNeighborhood || needsCommute) && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Localização
                </h4>
                {!application.neighborhood && (
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro onde mora</Label>
                    <Input
                      id="neighborhood"
                      placeholder="Ex: Jardins"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                    />
                  </div>
                )}
                {!application.city && (
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade *</Label>
                    <Input
                      id="city"
                      placeholder="Ex: São Paulo"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                    />
                  </div>
                )}
                {!application.commute_time && (
                  <div className="space-y-2">
                    <Label>Tempo de deslocamento até o trabalho *</Label>
                    <RadioGroup
                      value={formData.commute_time}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, commute_time: value }))}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="up_to_30_min" id="commute-30" />
                        <Label htmlFor="commute-30" className="cursor-pointer flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          Até 30 minutos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="30_to_60_min" id="commute-60" />
                        <Label htmlFor="commute-60" className="cursor-pointer flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          30 a 60 minutos
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="over_60_min" id="commute-over" />
                        <Label htmlFor="commute-over" className="cursor-pointer flex items-center gap-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          Mais de 1 hora
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}

            {/* Cultural affinity */}
            {needsCultural && (
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Afinidade Cultural
                </h4>
                <p className="text-sm text-muted-foreground">
                  {application.job.cultural_affinity_question || "Esta empresa possui uma identidade e valores próprios, vividos no dia a dia do trabalho, de forma respeitosa e aberta. Como você se identifica com esse tipo de ambiente?"}
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
                  className="space-y-2"
                >
                  {affinityOptions.map((option, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <RadioGroupItem value={index.toString()} id={`affinity-${index}`} className="mt-1" />
                      <Label htmlFor={`affinity-${index}`} className="cursor-pointer text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Consent */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Consentimento
              </h4>
              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <p>Ao confirmar sua candidatura, você declara que:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Os dados fornecidos são verdadeiros</li>
                  <li>Autoriza o uso dos seus dados para este processo seletivo</li>
                  <li>Entende que nenhuma avaliação clínica será realizada</li>
                  <li>Entende que não há decisão automática de contratação</li>
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                className="flex-1"
                onClick={handleConfirm} 
                disabled={!formData.lgpd_consent || submitting}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirmar Candidatura
              </Button>
              <Button 
                variant="outline"
                onClick={handleDecline}
                disabled={submitting}
              >
                Não tenho interesse
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
