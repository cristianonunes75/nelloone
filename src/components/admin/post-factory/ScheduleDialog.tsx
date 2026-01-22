import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { format, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Clock, Download, Facebook, Instagram, Linkedin } from "lucide-react";

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSchedule: (date: Date, platforms: string[]) => void;
  onDownload: () => void;
}

export const ScheduleDialog = ({
  open,
  onOpenChange,
  onSchedule,
  onDownload,
}: ScheduleDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("12:00");
  const [platforms, setPlatforms] = useState<string[]>(['instagram']);

  const handlePlatformToggle = (platform: string) => {
    setPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (!selectedDate) return;
    
    const [hours, minutes] = time.split(':').map(Number);
    const scheduledDate = setMinutes(setHours(selectedDate, hours), minutes);
    
    onSchedule(scheduledDate, platforms);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar ou Baixar Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Download option */}
          <div className="p-4 border rounded-lg bg-muted/30">
            <p className="text-sm font-medium mb-2">Baixar para publicar manualmente</p>
            <p className="text-xs text-muted-foreground mb-3">
              Baixe a imagem e copie a legenda para publicar você mesmo nas redes sociais.
            </p>
            <Button onClick={onDownload} variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Baixar Imagem + Copiar Legenda
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou agendar para depois</span>
            </div>
          </div>

          {/* Schedule options */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-2 block">Plataformas</Label>
              <div className="flex gap-2">
                <Button
                  variant={platforms.includes('instagram') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('instagram')}
                  className="flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
                <Button
                  variant={platforms.includes('facebook') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('facebook')}
                  className="flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                <Button
                  variant={platforms.includes('linkedin') ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePlatformToggle('linkedin')}
                  className="flex items-center gap-2"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2 block">Data</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                className="rounded-md border"
                disabled={(date) => date < new Date()}
              />
            </div>

            <div>
              <Label className="text-sm mb-2 block">Horário</Label>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-32"
                />
                <span className="text-sm text-muted-foreground">
                  {selectedDate && format(selectedDate, "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!selectedDate || platforms.length === 0}
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            Agendar Post
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
