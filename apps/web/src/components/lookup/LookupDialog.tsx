import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '@/services/api';
import { lookupSources, LookupSourceConfig } from './lookup-sources';

interface LookupDialogProps {
  open: boolean;
  source: string;
  onSelect: (item: any) => void;
  onClose: () => void;
}

type SortDir = 'asc' | 'desc';

export function LookupDialog({ open, source, onSelect, onClose }: LookupDialogProps) {
  const config: LookupSourceConfig | undefined = lookupSources[source];
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchItems = useCallback(async (search: string) => {
    if (!config) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.append(config.searchParam, search.trim());
      params.append('limite', '50');
      if (config.filterParams) {
        Object.entries(config.filterParams).forEach(([k, v]) => params.append(k, v));
      }
      const res = await api.get(`${config.endpoint}?${params}`);
      const data = res.data?.dados || res.data?.data || res.data || [];
      setItems(Array.isArray(data) ? data : []);
      setSelectedIdx(0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setItems([]);
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 100);
    fetchItems('');
  }, [open, fetchItems]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchItems(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchItems]);

  const handleSelect = (item: any) => {
    onSelect(item);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && items[selectedIdx]) {
      handleSelect(items[selectedIdx]);
    }
  };

  if (!config) {
    return (
      <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Fonte inválida</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Fonte de dados "{source}" não encontrada.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...items].sort((a, b) => {
    if (!sortKey) return 0;
    const aVal = String(a[sortKey] ?? '').toLowerCase();
    const bVal = String(b[sortKey] ?? '').toLowerCase();
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Selecionar {source}</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Buscar por ${config.columns.map(c => c.label.toLowerCase()).join(', ')}...`}
            className="pl-9"
          />
        </div>

        <div className="flex-1 overflow-y-auto min-h-[200px] max-h-[50vh] border rounded-lg mt-3">
          {loading && (
            <div className="flex h-32 items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Buscando...</span>
            </div>
          )}

          {!loading && sorted.length === 0 && (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              {query ? 'Nenhum resultado encontrado' : 'Digite para buscar'}
            </div>
          )}

          {!loading && sorted.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  {config.columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className="cursor-pointer select-none"
                      style={col.width ? { width: col.width } : undefined}
                      onClick={() => toggleSort(col.key)}
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortKey === col.key && (
                          sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((item, idx) => (
                  <TableRow
                    key={item.id || idx}
                    className={`cursor-pointer ${idx === selectedIdx ? 'bg-accent' : 'hover:bg-accent/50'}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    {config.columns.map((col) => (
                      <TableCell key={col.key}>
                        {col.render ? col.render(item) : String(item[col.key] ?? '')}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
          <span>{sorted.length} registro(s) encontrado(s)</span>
          <div className="flex items-center gap-3">
            <span>↑↓ Navegar</span>
            <span>↵ Selecionar</span>
            <span>ESC Fechar</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
