import { Bell, BellOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";

interface PushNotificationToggleProps {
  variant?: "default" | "compact";
}

export function PushNotificationToggle({ variant = "default" }: PushNotificationToggleProps) {
  const { isSupported, isSubscribed, isLoading, subscribe, unsubscribe } = usePushNotifications();

  if (!isSupported) {
    return null;
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  if (variant === "compact") {
    return (
      <Button
        variant={isSubscribed ? "default" : "outline"}
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        title={isSubscribed ? "Desativar notificações" : "Ativar notificações"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSubscribed ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={isSubscribed ? "default" : "outline"}
      onClick={handleToggle}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isSubscribed ? (
        <>
          <Bell className="h-4 w-4" />
          Notificações Ativadas
        </>
      ) : (
        <>
          <BellOff className="h-4 w-4" />
          Ativar Notificações
        </>
      )}
    </Button>
  );
}
