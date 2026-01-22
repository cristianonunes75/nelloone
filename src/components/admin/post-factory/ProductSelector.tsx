import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { NelloProduct, PRODUCT_CONFIGS } from "./types";

interface ProductSelectorProps {
  value: NelloProduct;
  onChange: (value: NelloProduct) => void;
}

export const ProductSelector = ({ value, onChange }: ProductSelectorProps) => {
  const config = PRODUCT_CONFIGS[value];
  
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
      <div className="flex-1">
        <label className="text-sm font-medium text-muted-foreground mb-1 block">
          Produto
        </label>
        <Select value={value} onValueChange={(v) => onChange(v as NelloProduct)}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(PRODUCT_CONFIGS).map((product) => (
              <SelectItem key={product.id} value={product.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: product.colors.secondary }}
                  />
                  <span>{product.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1">
        <Badge 
          variant="outline" 
          className="text-xs"
          style={{ 
            borderColor: config.colors.secondary,
            color: config.colors.secondary 
          }}
        >
          {config.description}
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        <div 
          className="w-8 h-8 rounded-md"
          style={{ backgroundColor: config.colors.primary }}
        />
        <div 
          className="w-8 h-8 rounded-md"
          style={{ backgroundColor: config.colors.secondary }}
        />
        {config.colors.accent && (
          <div 
            className="w-8 h-8 rounded-md"
            style={{ backgroundColor: config.colors.accent }}
          />
        )}
      </div>
    </div>
  );
};
