import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Camera, User, Eye } from "lucide-react";

export const ViewModeSelector = () => {
  const navigate = useNavigate();

  const viewModes = [
    {
      title: "Visualizar como Cliente",
      description: "Acesse a área do cliente para ver a experiência completa dos testes e sessões",
      icon: User,
      path: "/cliente",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Visualizar como Fotógrafo",
      description: "Veja como os fotógrafos gerenciam clientes, sessões e galerias",
      icon: Camera,
      path: "/fotografo",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Eye className="w-5 h-5 text-gold" />
        <h2 className="text-2xl font-bold">Visualizações de Teste</h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {viewModes.map((mode) => (
          <Card
            key={mode.path}
            className={`p-6 border-2 ${mode.borderColor} hover:shadow-lg transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl ${mode.bgColor} flex items-center justify-center flex-shrink-0`}>
                <mode.icon className={`w-7 h-7 ${mode.color}`} />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{mode.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {mode.description}
                </p>
                
                <Button
                  onClick={() => navigate(mode.path)}
                  variant="outline"
                  className="w-full"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Visualizar Área
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-accent/10 border-accent/30">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Dica:</strong> Como administrador, você tem acesso total a todas as áreas. 
          Use essas visualizações para testar a experiência de cada tipo de usuário e identificar melhorias.
        </p>
      </Card>
    </div>
  );
};
