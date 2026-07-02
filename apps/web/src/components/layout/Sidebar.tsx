import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Truck,
  Wallet,
  BarChart3,
  HelpCircle,
  FileText,
  FileBarChart,
  Receipt,
  ShoppingBasket,
  PackageCheck,
  ClipboardList,
  Cog,
  UserCircle,
  Landmark,
  TrendingUp,
  Printer,
  ArrowUpCircle,
  ArrowDownCircle,
  BookOpen,
  CreditCard,
  Building2,
  Zap,
  ShoppingBag,
  Folder,
  Scale,
  ArrowRightLeft,
  Percent,
  Shield,
  Undo2,
  FileSignature,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
  categoria: string;
}

interface CategoriaMenu {
  id: string;
  nome: string;
  icone: React.ElementType;
  items: MenuItem[];
}

const menuCategorias: CategoriaMenu[] = [
  {
    id: 'inicio',
    nome: 'Início',
    icone: LayoutDashboard,
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/', categoria: 'inicio' },
    ],
  },
  {
    id: 'vendas',
    nome: 'Vendas',
    icone: ShoppingCart,
    items: [
      { id: 'orcamentos', label: 'Orçamentos', icon: FileBarChart, path: '/orcamentos', categoria: 'vendas' },
      { id: 'orders', label: 'Pedidos', icon: ShoppingCart, path: '/orders', categoria: 'vendas' },
      { id: 'pdv', label: 'PDV', icon: ShoppingBasket, path: '/pdv', categoria: 'vendas' },
      { id: 'crm', label: 'CRM', icon: TrendingUp, path: '/crm', categoria: 'vendas' },
    ],
  },
  {
    id: 'compras',
    nome: 'Compras',
    icone: ShoppingBag,
    items: [
      { id: 'compras', label: 'Pedidos', icon: ShoppingCart, path: '/compras', categoria: 'compras' },
      { id: 'cotacoes', label: 'Cotações', icon: FileText, path: '/compras/cotacoes', categoria: 'compras' },
      { id: 'entradas', label: 'Entradas', icon: ArrowDownCircle, path: '/compras/entradas', categoria: 'compras' },
    ],
  },
  {
    id: 'estoque',
    nome: 'Estoque',
    icone: PackageCheck,
    items: [
      { id: 'products', label: 'Produtos', icon: Package, path: '/products', categoria: 'estoque' },
      { id: 'estoque', label: 'Estoque', icon: PackageCheck, path: '/estoque', categoria: 'estoque' },
      { id: 'movimentacoes', label: 'Movimentações', icon: ArrowRightLeft, path: '/estoque/movimentacoes', categoria: 'estoque' },
      { id: 'categorias', label: 'Categorias', icon: Folder, path: '/estoque/categorias', categoria: 'estoque' },
      { id: 'unidades', label: 'Unidades', icon: Scale, path: '/estoque/unidades', categoria: 'estoque' },
      { id: 'inventario', label: 'Inventário', icon: ClipboardList, path: '/inventario', categoria: 'estoque' },
      { id: 'tabelas-preco', label: 'Tabelas de Preço', icon: Percent, path: '/tabelas-preco', categoria: 'estoque' },
      { id: 'produtos-variacoes', label: 'Variações', icon: Package, path: '/produtos-variacoes', categoria: 'estoque' },
      { id: 'produtos-lotes', label: 'Lotes', icon: PackageCheck, path: '/produtos-lotes', categoria: 'estoque' },
    ],
  },
  {
    id: 'cadastros',
    nome: 'Cadastros',
    icone: UserCircle,
    items: [
      { id: 'customers', label: 'Clientes', icon: Users, path: '/customers', categoria: 'cadastros' },
      { id: 'suppliers', label: 'Fornecedores', icon: Truck, path: '/suppliers', categoria: 'cadastros' },
      { id: 'vendedores', label: 'Vendedores', icon: Users, path: '/vendedores', categoria: 'cadastros' },
      { id: 'transportadoras', label: 'Transportadoras', icon: Truck, path: '/transportadoras', categoria: 'cadastros' },
      { id: 'filiais', label: 'Filiais', icon: Building2, path: '/filiais', categoria: 'cadastros' },
    ],
  },
  {
    id: 'financeiro',
    nome: 'Financeiro',
    icone: Landmark,
    items: [
      { id: 'contas-receber', label: 'Contas a Receber', icon: ArrowUpCircle, path: '/contas-receber', categoria: 'financeiro' },
      { id: 'contas-pagar', label: 'Contas a Pagar', icon: ArrowDownCircle, path: '/contas-pagar', categoria: 'financeiro' },
      { id: 'boletos', label: 'Boletos', icon: Receipt, path: '/boletos', categoria: 'financeiro' },
      { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: Wallet, path: '/fluxo-caixa', categoria: 'financeiro' },
      { id: 'cheques', label: 'Cheques', icon: Landmark, path: '/cheques', categoria: 'financeiro' },
      { id: 'centros-custo', label: 'Centros de Custo', icon: Folder, path: '/centros-custo', categoria: 'financeiro' },
    ],
  },
  {
    id: 'relatorios',
    nome: 'Fiscal',
    icone: BarChart3,
    items: [
      { id: 'sped-fiscal', label: 'SPED Fiscal', icon: FileText, path: '/sped-fiscal', categoria: 'relatorios' },
      { id: 'mdfe', label: 'MDF-e', icon: Truck, path: '/mdfe', categoria: 'relatorios' },
      { id: 'veiculos', label: 'Veículos', icon: Truck, path: '/veiculos', categoria: 'relatorios' },
      { id: 'condutores', label: 'Condutores', icon: UserCircle, path: '/condutores', categoria: 'relatorios' },
      { id: 'relatorios', label: 'Relatórios', icon: BarChart3, path: '/relatorios', categoria: 'relatorios' },
      { id: 'notas-fiscais', label: 'NF-e', icon: FileText, path: '/notas-fiscais', categoria: 'relatorios' },
      { id: 'nfce', label: 'NFC-e', icon: FileText, path: '/nfce', categoria: 'relatorios' },
      { id: 'nfse', label: 'NFSe', icon: FileText, path: '/nfse', categoria: 'relatorios' },
      { id: 'ecf', label: 'ECF', icon: Printer, path: '/ecf', categoria: 'relatorios' },
      { id: 'contratos', label: 'Contratos', icon: FileSignature, path: '/contratos', categoria: 'relatorios' },
      { id: 'garantias', label: 'Garantias', icon: Shield, path: '/garantias', categoria: 'relatorios' },
      { id: 'devolucoes', label: 'Devoluções', icon: Undo2, path: '/devolucoes', categoria: 'relatorios' },
    ],
  },
  {
    id: 'gestao',
    nome: 'Gestão',
    icone: Cog,
    items: [
      { id: 'usuarios', label: 'Usuários', icon: Users, path: '/usuarios', categoria: 'gestao' },
      { id: 'logs', label: 'Logs', icon: FileText, path: '/logs', categoria: 'gestao' },
      { id: 'parametros', label: 'Parâmetros', icon: Cog, path: '/parametros', categoria: 'gestao' },
      { id: 'dre', label: 'DRE', icon: TrendingUp, path: '/dre', categoria: 'gestao' },
      { id: 'plano-contas', label: 'Plano de Contas', icon: Landmark, path: '/plano-contas', categoria: 'gestao' },
    ],
  },
  {
    id: 'sistema',
    nome: 'Sistema',
    icone: Settings,
    items: [
      { id: 'ajuda', label: 'Ajuda', icon: HelpCircle, path: '/ajuda', categoria: 'sistema' },
      { id: 'manual', label: 'Manual do Usuário', icon: BookOpen, path: '/manual', categoria: 'sistema' },
      { id: 'manual-tecnico', label: 'Manual Técnico', icon: BookOpen, path: '/manual-tecnico', categoria: 'sistema' },
      { id: 'planos', label: 'Planos e Licença', icon: CreditCard, path: '/planos', categoria: 'sistema' },
      { id: 'multi-empresa', label: 'Multi-empresa', icon: Building2, path: '/multi-empresa', categoria: 'sistema' },
      { id: 'automacao', label: 'Automação', icon: Zap, path: '/automacao', categoria: 'sistema' },
      { id: 'settings', label: 'Configurações', icon: Settings, path: '/settings', categoria: 'sistema' },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside
      className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-sidebar-accent">
            <span className="text-xl font-bold text-sidebar-accent-foreground">FG</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold tracking-tight text-sidebar-foreground whitespace-nowrap">
              <span className="text-sidebar-accent">ERP</span>
              <span className="font-medium text-sidebar-muted-foreground">oraqui</span>
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-colors"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuCategorias.map((categoria) => (
          <div key={categoria.id} className="mb-1">
            {!collapsed && (
              <div className="px-4 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sidebar-muted-foreground">
                  <categoria.icone className="h-3.5 w-3.5" />
                  {categoria.nome}
                </div>
              </div>
            )}

            <ul className="space-y-0.5 px-2">
              {categoria.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => navigate(item.path)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent/10 text-sidebar-accent'
                          : 'text-sidebar-foreground hover:bg-sidebar-muted'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${
                        isActive ? 'text-sidebar-accent' : 'text-sidebar-muted-foreground'
                      }`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>

            {!collapsed && (
              <div className="mx-4 my-2 border-t border-sidebar-border" />
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
