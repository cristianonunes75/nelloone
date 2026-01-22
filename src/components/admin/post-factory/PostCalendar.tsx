import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { SocialMediaPost, PRODUCT_CONFIGS, NelloProduct } from "./types";
import { CalendarDays, Clock } from "lucide-react";

interface PostCalendarProps {
  onDateSelect?: (date: Date) => void;
  onPostClick?: (post: SocialMediaPost) => void;
}

export const PostCalendar = ({ onDateSelect, onPostClick }: PostCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [scheduledPosts, setScheduledPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScheduledPosts();
  }, [selectedDate]);

  const fetchScheduledPosts = async () => {
    if (!selectedDate) return;

    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    const { data, error } = await supabase
      .from("social_media_posts")
      .select("*")
      .gte("scheduled_at", start.toISOString())
      .lte("scheduled_at", end.toISOString())
      .order("scheduled_at", { ascending: true });

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setScheduledPosts((data || []) as unknown as SocialMediaPost[]);
    }
    setIsLoading(false);
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      if (!post.scheduled_at) return false;
      return isSameDay(new Date(post.scheduled_at), date);
    });
  };

  const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  // Custom day content to show dots for scheduled posts
  const dayContent = (day: Date) => {
    const posts = getPostsForDate(day);
    if (posts.length === 0) return null;

    return (
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
        {posts.slice(0, 3).map((post, index) => (
          <div
            key={index}
            className="w-1.5 h-1.5 rounded-full"
            style={{ 
              backgroundColor: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.secondary || '#888' 
            }}
          />
        ))}
        {posts.length > 3 && (
          <span className="text-[8px] text-muted-foreground">+{posts.length - 3}</span>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Calendário de Posts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          locale={ptBR}
          className="rounded-md border"
          components={{
            DayContent: ({ date }) => (
              <div className="relative w-full h-full flex items-center justify-center">
                {date.getDate()}
                {dayContent(date)}
              </div>
            ),
          }}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : "Selecione uma data"}
            </h4>
            <Badge variant="outline" className="text-xs">
              {selectedDatePosts.length} post{selectedDatePosts.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {selectedDatePosts.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedDatePosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onPostClick?.(post)}
                  className="w-full text-left p-2 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ 
                        backgroundColor: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.secondary || '#888' 
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {post.title || post.copy?.slice(0, 50) || "Sem título"}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {post.scheduled_at && format(new Date(post.scheduled_at), "HH:mm")}
                        <span>•</span>
                        <span>{PRODUCT_CONFIGS[post.product as NelloProduct]?.name}</span>
                      </div>
                    </div>
                    <Badge 
                      variant={post.status === 'published' ? 'default' : 'secondary'}
                      className="text-[10px]"
                    >
                      {post.status === 'scheduled' ? 'Agendado' : 
                       post.status === 'published' ? 'Publicado' : 
                       post.status === 'draft' ? 'Rascunho' : 'Falhou'}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Nenhum post agendado para esta data
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
