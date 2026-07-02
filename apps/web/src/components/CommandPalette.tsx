import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Package, ShoppingCart, Settings, Truck, Wallet,
  BarChart3,   HelpCircle, FileText, Receipt, ShoppingBasket, PackageCheck,
  ClipboardList, Cog, UserCircle, Landmark, TrendingUp, Printer,
  ArrowUpCircle, ArrowDownCircle, BookOpen, CreditCard, Building2,
  Zap, Folder, ArrowRightLeft, Percent,
  Shield, Undo2, FileSignature, Search,
} from 'lucide-react';
import { api } from '@/services/api';
import { useHelp } from '@/contexts/HelpContext';
import { routeHelpMap } from '@/components/help-routes';

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  path?: string;
  icon?: React.ElementType;
  type: 'page' | 'cliente' | 'produto' | 'pedido';
  onSelect: () => void;
}

const pages = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Orçamentos', icon: FileText, path: '/orcamentos' },
  { label: 'Pedidos', icon: ShoppingCart, path: '/orders' },
  { label: 'PDV', icon: ShoppingBasket, path: '/pdv' },
  { label: 'CRM', icon: TrendingUp, path: '/crm' },
  { label: 'Compras', icon: ShoppingCart, path: '/compras' },
  { label: 'Cotações', icon: FileText, path: '/compras/cotacoes' },
  { label: 'Entradas', icon: ArrowDownCircle, path: '/compras/entradas' },
  { label: 'Produtos', icon: Package, path: '/products' },
  { label: 'Estoque', icon: PackageCheck, path: '/estoque' },
  { label: 'Movimentações', icon: ArrowRightLeft, path: '/estoque/movimentacoes' },
  { label: 'Categorias', icon: Folder, path: '/estoque/categorias' },
  { label: 'Inventário', icon: ClipboardList, path: '/inventario' },
  { label: 'Tabelas de Preço', icon: Percent, path: '/tabelas-preco' },
  { label: 'Variações', icon: Package, path: '/produtos-variacoes' },
  { label: 'Lotes', icon: PackageCheck, path: '/produtos-lotes' },
  { label: 'Clientes', icon: Users, path: '/customers' },
  { label: 'Fornecedores', icon: Truck, path: '/suppliers' },
  { label: 'Vendedores', icon: Users, path: '/vendedores' },
  { label: 'Transportadoras', icon: Truck, path: '/transportadoras' },
  { label: 'Filiais', icon: Building2, path: '/filiais' },
  { label: 'Contas a Receber', icon: ArrowUpCircle, path: '/contas-receber' },
  { label: 'Contas a Pagar', icon: ArrowDownCircle, path: '/contas-pagar' },
  { label: 'Boletos', icon: Receipt, path: '/boletos' },
  { label: 'Fluxo de Caixa', icon: Wallet, path: '/fluxo-caixa' },
  { label: 'Cheques', icon: Landmark, path: '/cheques' },
  { label: 'Centros de Custo', icon: Folder, path: '/centros-custo' },
  { label: 'DRE', icon: TrendingUp, path: '/dre' },
  { label: 'Plano de Contas', icon: Landmark, path: '/plano-contas' },
  { label: 'NF-e', icon: FileText, path: '/notas-fiscais' },
  { label: 'NFC-e', icon: FileText, path: '/nfce' },
  { label: 'NFSe', icon: FileText, path: '/nfse' },
  { label: 'ECF', icon: Printer, path: '/ecf' },
  { label: 'SPED Fiscal', icon: FileText, path: '/sped-fiscal' },
  { label: 'MDF-e', icon: Truck, path: '/mdfe' },
  { label: 'Veículos', icon: Truck, path: '/veiculos' },
  { label: 'Condutores', icon: UserCircle, path: '/condutores' },
  { label: 'Relatórios', icon: BarChart3, path: '/relatorios' },
  { label: 'Contratos', icon: FileSignature, path: '/contratos' },
  { label: 'Garantias', icon: Shield, path: '/garantias' },
  { label: 'Devoluções', icon: Undo2, path: '/devolucoes' },
  { label: 'Renegociação', icon: Undo2, path: '/renegociacao' },
  { label: 'Conciliação Bancária', icon: Landmark, path: '/conciliacao' },
  { label: 'Adiantamentos', icon: ArrowUpCircle, path: '/adiantamentos' },
  { label: 'Quitações', icon: Receipt, path: '/quitacoes' },
  { label: 'Promoções', icon: Percent, path: '/promocoes' },
  { label: 'Kardex', icon: PackageCheck, path: '/estoque/kardex' },
  { label: 'Convênios', icon: FileSignature, path: '/convenios' },
  { label: 'Licitações', icon: FileText, path: '/licitacoes' },
  { label: 'CT-e', icon: Truck, path: '/cte' },
  { label: 'Usuários', icon: Users, path: '/usuarios' },
  { label: 'Logs', icon: FileText, path: '/logs' },
  { label: 'Parâmetros', icon: Cog, path: '/parametros' },
  { label: 'Planos', icon: CreditCard, path: '/planos' },
  { label: 'Multi-empresa', icon: Building2, path: '/multi-empresa' },
  { label: 'Automação', icon: Zap, path: '/automacao' },
  { label: 'Ajuda', icon: HelpCircle, path: '/ajuda' },
  { label: 'Manual', icon: BookOpen, path: '/manual' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommandItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { openHelp } = useHelp();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const customHandler = () => setOpen(true);
    document.addEventListener('keydown', handler);
    window.addEventListener('open-command-palette', customHandler);
    return () => {
      document.removeEventListener('keydown', handler);
      window.removeEventListener('open-command-palette', customHandler);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      const match = routeHelpMap[location.pathname];
      const helpItems: CommandItem[] = match ? [{
        id: 'help-current',
        label: `Ajuda: ${match.title}`,
        description: 'Abrir guia de treinamento desta tela (Ctrl+Shift+H)',
        icon: BookOpen,
        type: 'page' as const,
        onSelect: () => {
          openHelp(match.file, match.title);
          setOpen(false);
        },
      }] : [];

      setResults([...helpItems, ...pages.map((p) => ({
        id: p.path,
        label: p.label,
        icon: p.icon,
        type: 'page' as const,
        path: p.path,
        onSelect: () => { navigate(p.path); setOpen(false); },
      }))]);
      setSelectedIndex(0);
      return;
    }

    const q = query.toLowerCase();
    const isHelpQuery = q === 'ajuda' || q === 'help' || q.includes('ajuda') || q.includes('manual') || q.includes('treinamento');

    const pageResults = pages
      .filter((p) => p.label.toLowerCase().includes(q))
      .map((p) => ({
        id: p.path,
        label: p.label,
        icon: p.icon,
        type: 'page' as const,
        path: p.path,
        onSelect: () => { navigate(p.path); setOpen(false); },
      })) as CommandItem[];

    if (isHelpQuery) {
      const match = routeHelpMap[location.pathname];
      if (match) {
        pageResults.unshift({
          id: 'help-current',
          label: `Ajuda: ${match.title}`,
          description: 'Abrir guia de treinamento desta tela',
          icon: BookOpen,
          type: 'page' as const,
          onSelect: () => {
            openHelp(match.file, match.title);
            setOpen(false);
          },
        });
      }
    }

    setSearching(true);
    Promise.all([
      api.get(`/clientes?search=${encodeURIComponent(query)}&limite=3`).catch(() => ({ data: { data: [] } })),
      api.get(`/produtos?search=${encodeURIComponent(query)}&limite=3`).catch(() => ({ data: { data: [] } })),
      api.get(`/pedidos-venda?search=${encodeURIComponent(query)}&limite=3`).catch(() => ({ data: { data: [] } })),
    ]).then(([clientesRes, produtosRes, pedidosRes]) => {
      const clientes: CommandItem[] = (clientesRes.data?.data ?? []).map((c: any) => ({
        id: `cliente-${c.id}`, label: c.nome, description: c.documento,
        type: 'cliente' as const,
        onSelect: () => { navigate(`/customers?id=${c.id}`); setOpen(false); },
      }));
      const produtos: CommandItem[] = (produtosRes.data?.data ?? []).map((p: any) => ({
        id: `produto-${p.id}`, label: p.nome, description: p.codigoInterno,
        type: 'produto' as const,
        onSelect: () => { navigate(`/products?id=${p.id}`); setOpen(false); },
      }));
      const pedidos: CommandItem[] = (pedidosRes.data?.data ?? []).map((p: any) => ({
        id: `pedido-${p.id}`, label: `Pedido ${p.numeroPedido}`, description: `R$ ${Number(p.valorTotal).toFixed(2)}`,
        type: 'pedido' as const,
        onSelect: () => { navigate(`/orders?id=${p.id}`); setOpen(false); },
      }));
      setResults([...pageResults, ...clientes, ...produtos, ...pedidos]);
      setSelectedIndex(0);
      setSearching(false);
    });
  }, [query, navigate]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIndex((prev) => Math.max(prev - 1, 0)); }
    if (e.key === 'Enter' && results[selectedIndex]) { results[selectedIndex].onSelect(); }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-xl rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center border-b border-border px-4">
          <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar páginas, clientes, produtos, pedidos..."
            className="flex h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
          <kbd className="ml-auto hidden shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline-block">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {searching && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">Buscando...</div>
          )}
          {!searching && results.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">Nenhum resultado encontrado</div>
          )}
          {results.length > 0 && (
            <div className="space-y-0.5">
              {results.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onSelect}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                      index === selectedIndex ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <div className="flex-1 truncate">
                      <span className="font-medium">{item.label}</span>
                      {item.description && <span className="ml-2 text-xs text-muted-foreground">({item.description})</span>}
                    </div>
                    <span className={`shrink-0 text-xs font-medium ${
                      item.type === 'cliente' ? 'text-blue-600' :
                      item.type === 'produto' ? 'text-green-600' :
                      item.type === 'pedido' ? 'text-purple-600' : 'text-muted-foreground'
                    }`}>
                      {item.type === 'page' ? 'Página' :
                       item.type === 'cliente' ? 'Cliente' :
                       item.type === 'produto' ? 'Produto' : 'Pedido'}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
