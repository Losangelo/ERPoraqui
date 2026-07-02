import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { LookupDialog } from './LookupDialog';

interface LookupFieldProps {
  source: string;
  value?: string;
  selectedLabel?: string;
  onChange: (item: any) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function LookupField({
  source,
  value,
  selectedLabel,
  onChange,
  onClear,
  placeholder,
  disabled,
  className,
}: LookupFieldProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const label = selectedLabel || (value ? value : '');

  return (
    <>
      <div className={`flex gap-2 ${className || ''}`}>
        <div className="relative flex-1">
          <Input
            value={label}
            onChange={() => {}}
            placeholder={placeholder || `Selecionar ${source}...`}
            disabled={disabled}
            className="pr-8 cursor-pointer"
            onClick={() => !disabled && setDialogOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || (e.ctrlKey && e.shiftKey && e.key === 'F2')) {
                e.preventDefault();
                if (!disabled) setDialogOpen(true);
              }
            }}
            readOnly
          />
          <Search className="absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        </div>
        {label && onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            type="button"
            className="shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDialogOpen(true)}
          type="button"
          disabled={disabled}
          title="Buscar (Enter, Ctrl+Shift+F2)"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <LookupDialog
        source={source}
        open={dialogOpen}
        onSelect={onChange}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}
