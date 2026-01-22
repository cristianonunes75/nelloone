import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { 
  SocialMediaPost, 
  PRODUCT_CONFIGS, 
  NelloProduct, 
  TYPE_LABELS,
  CardType
} from "./types";
import { 
  Grid3X3, 
  List, 
  Search, 
  Copy, 
  Trash2, 
  Edit, 
  Download,
  Loader2,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";

interface PostGalleryProps {
  onEditPost?: (post: SocialMediaPost) => void;
  onDuplicatePost?: (post: SocialMediaPost) => void;
}

export const PostGallery = ({ onEditPost, onDuplicatePost }: PostGalleryProps) => {
  const [posts, setPosts] = useState<SocialMediaPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("social_media_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching posts:", error);
      toast.error("Erro ao carregar posts");
    } else {
      setPosts((data || []) as unknown as SocialMediaPost[]);
    }
    setIsLoading(false);
  };

  const handleDelete = async (postId: string) => {
    const { error } = await supabase
      .from("social_media_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast.error("Erro ao deletar post");
    } else {
      toast.success("Post deletado");
      setPosts(posts.filter(p => p.id !== postId));
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = !searchTerm || 
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.copy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = filterProduct === 'all' || post.product === filterProduct;
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;

    return matchesSearch && matchesProduct && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      published: "default",
      scheduled: "secondary",
      draft: "outline",
      failed: "destructive",
    };
    const labels: Record<string, string> = {
      published: "Publicado",
      scheduled: "Agendado",
      draft: "Rascunho",
      failed: "Falhou",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="text-[10px]">
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Galeria de Posts
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9"
            />
          </div>
          <Select value={filterProduct} onValueChange={setFilterProduct}>
            <SelectTrigger className="w-[150px] h-9">
              <SelectValue placeholder="Produto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos produtos</SelectItem>
              {Object.values(PRODUCT_CONFIGS).map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="scheduled">Agendado</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts Grid/List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
            <p className="text-sm text-muted-foreground">Nenhum post encontrado</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="group relative rounded-lg border bg-card overflow-hidden hover:border-gold/50 transition-colors"
              >
                {/* Preview thumbnail */}
                <div 
                  className="aspect-square flex items-center justify-center p-4"
                  style={{ 
                    backgroundColor: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.primary || '#1a1a1a'
                  }}
                >
                  {post.background_image_url ? (
                    <img 
                      src={post.background_image_url} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <p 
                        className="text-xs font-medium text-white/90 line-clamp-3"
                      >
                        {post.title || post.copy?.slice(0, 60)}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Info */}
                <div className="p-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant="outline" 
                      className="text-[10px]"
                      style={{ 
                        borderColor: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.secondary,
                        color: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.secondary 
                      }}
                    >
                      {PRODUCT_CONFIGS[post.product as NelloProduct]?.name?.split(' ')[1] || post.product}
                    </Badge>
                    {getStatusBadge(post.status)}
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {post.created_at && format(new Date(post.created_at), "dd MMM yyyy", { locale: ptBR })}
                  </p>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => onEditPost?.(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => onDuplicatePost?.(post)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => post.id && handleDelete(post.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div 
                  className="w-12 h-12 rounded-md flex-shrink-0 flex items-center justify-center"
                  style={{ 
                    backgroundColor: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.primary || '#1a1a1a'
                  }}
                >
                  <span 
                    className="text-xs font-bold"
                    style={{ color: PRODUCT_CONFIGS[post.product as NelloProduct]?.colors.secondary }}
                  >
                    {post.product.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {post.title || post.copy?.slice(0, 50) || "Sem título"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{TYPE_LABELS.pt[post.content_type as CardType]}</span>
                    <span>•</span>
                    <span>{post.format}</span>
                    <span>•</span>
                    <span>{post.created_at && format(new Date(post.created_at), "dd/MM/yy")}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(post.status)}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onEditPost?.(post)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => onDuplicatePost?.(post)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
