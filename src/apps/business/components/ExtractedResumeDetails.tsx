import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code, 
  Languages, 
  User,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ExtractedResumeData {
  personal_info?: {
    full_name?: string;
    email?: string;
    phone?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
    linkedin?: string;
    portfolio?: string;
  };
  professional_objective?: string;
  professional_summary?: string;
  work_experience?: Array<{
    company?: string;
    position?: string;
    start_date?: string;
    end_date?: string;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    institution?: string;
    course?: string;
    degree?: string;
    start_date?: string;
    end_date?: string;
    status?: string;
  }>;
  courses_certifications?: Array<{
    name?: string;
    institution?: string;
    date?: string;
    hours?: string;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
  };
  languages?: Array<{
    language?: string;
    level?: string;
  }>;
  additional_info?: string;
}

interface Props {
  data: ExtractedResumeData;
}

export function ExtractedResumeDetails({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const hasExperience = data.work_experience && data.work_experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasSkills = data.skills && (data.skills.technical?.length || data.skills.soft?.length);
  const hasCertifications = data.courses_certifications && data.courses_certifications.length > 0;
  const hasLanguages = data.languages && data.languages.length > 0;

  if (!hasExperience && !hasEducation && !hasSkills && !hasCertifications && !hasLanguages && !data.professional_summary) {
    return null;
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground">
          <User className="h-4 w-4" />
          <span>Dados extraídos do currículo</span>
          {isOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 space-y-4 pl-2 border-l-2 border-muted">
        {/* Professional Summary */}
        {data.professional_summary && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Resumo Profissional</p>
            <p className="text-sm">{data.professional_summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {hasExperience && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Experiência Profissional</p>
            </div>
            <div className="space-y-2">
              {data.work_experience!.slice(0, 3).map((exp, idx) => (
                <div key={idx} className="text-sm pl-2">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-muted-foreground">
                    {exp.company} • {exp.start_date} - {exp.end_date || "Atual"}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{exp.description}</p>
                  )}
                </div>
              ))}
              {data.work_experience!.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  + {data.work_experience!.length - 3} experiência(s) anterior(es)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {hasEducation && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Formação Acadêmica</p>
            </div>
            <div className="space-y-2">
              {data.education!.map((edu, idx) => (
                <div key={idx} className="text-sm pl-2">
                  <p className="font-medium">{edu.course}</p>
                  <p className="text-muted-foreground">
                    {edu.institution} {edu.degree && `• ${edu.degree}`}
                  </p>
                  {edu.status && (
                    <Badge variant="outline" className="text-xs mt-1">{edu.status}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {hasSkills && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Habilidades</p>
            </div>
            <div className="flex flex-wrap gap-1">
              {data.skills!.technical?.slice(0, 10).map((skill, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {data.skills!.soft?.slice(0, 5).map((skill, idx) => (
                <Badge key={`soft-${idx}`} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {hasCertifications && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Certificações</p>
            </div>
            <div className="space-y-1">
              {data.courses_certifications!.slice(0, 3).map((cert, idx) => (
                <p key={idx} className="text-sm pl-2">
                  {cert.name} {cert.institution && `- ${cert.institution}`}
                </p>
              ))}
              {data.courses_certifications!.length > 3 && (
                <p className="text-xs text-muted-foreground">
                  + {data.courses_certifications!.length - 3} certificação(ões)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Languages */}
        {hasLanguages && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Idiomas</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {data.languages!.map((lang, idx) => (
                <span key={idx} className="text-sm">
                  {lang.language} {lang.level && <span className="text-muted-foreground">({lang.level})</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
