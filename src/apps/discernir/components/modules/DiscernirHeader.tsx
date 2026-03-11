interface DiscernirHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export function DiscernirHeader({ title, subtitle, icon }: DiscernirHeaderProps) {
  return (
    <div className="text-center space-y-2">
      {icon && <div className="flex justify-center">{icon}</div>}
      <h1 className="font-serif text-2xl font-semibold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
