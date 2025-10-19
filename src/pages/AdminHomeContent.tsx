import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HomeContentManagement } from "@/components/admin/HomeContentManagement";
import { HeroContentManagement } from "@/components/admin/HeroContentManagement";
import { ForWhoContentManagement } from "@/components/admin/ForWhoContentManagement";
import { TestimonialsContentManagement } from "@/components/admin/TestimonialsContentManagement";
import { FAQContentManagement } from "@/components/admin/FAQContentManagement";

const AdminHomeContent = () => {
  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Conteúdo da Home</h1>
        <p className="text-muted-foreground">
          Edite todas as seções da página inicial através das abas abaixo
        </p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="about">Sobre</TabsTrigger>
          <TabsTrigger value="for-who">Para Quem</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="hero">
            <HeroContentManagement />
          </TabsContent>

          <TabsContent value="about">
            <HomeContentManagement />
          </TabsContent>

          <TabsContent value="for-who">
            <ForWhoContentManagement />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsContentManagement />
          </TabsContent>

          <TabsContent value="faq">
            <FAQContentManagement />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default AdminHomeContent;