import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/stores/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { DashboardPage } from '@/pages/DashboardPage';
import { CustomersPage } from '@/pages/customers/CustomersPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { SuppliersPage } from '@/pages/suppliers/SuppliersPage';
import { OrdersPage } from '@/pages/orders/OrdersPage';
import { SettingsPage } from '@/pages/settings/SettingsPage';
import { FluxoCaixaPage } from '@/pages/fluxo-caixa/FluxoCaixaPage';
import { UsuariosPage } from '@/pages/usuarios/UsuariosPage';
import { TransportadorasPage } from '@/pages/transportadoras/TransportadorasPage';
import { VendedoresPage } from '@/pages/vendedores/VendedoresPage';
import { RelatoriosFiscaisPage } from '@/pages/relatorios/RelatoriosFiscaisPage';
import { LogsPage } from '@/pages/logs/LogsPage';
import AjudaPage from '@/pages/AjudaPage';
import ManualPage from '@/pages/ManualPage';
import ManualTecnicoPage from '@/pages/ManualTecnicoPage';
import FiliaisPage from '@/pages/FiliaisPage';
import { LoginPage } from '@/pages/LoginPage';
import OrcamentosPage from '@/pages/OrcamentosPage';
import BoletosPage from '@/pages/BoletosPage';
import PdvPage from '@/pages/PdvPage';
import InventarioPage from '@/pages/InventarioPage';
import EstoquePage from '@/pages/EstoquePage';
import ParametrosPage from '@/pages/ParametrosPage';
import NotasFiscaisPage from '@/pages/notas-fiscais/NotasFiscaisPage';
import DREPage from '@/pages/dre/DREPage';
import PlanoContasPage from '@/pages/plano-contas/PlanoContasPage';
import NFCePage from '@/pages/nfce/NFCePage';
import ECFPage from '@/pages/ecf/ECFPage';
import NFSePage from '@/pages/nfse/NFSePage';
import PlanosPage from '@/pages/planos/PlanosPage';
import { CRMPage } from '@/pages/crm/CRMPage';
import { CampanhasPage } from '@/pages/crm/CampanhasPage';
import { MultiEmpresaPage } from '@/pages/multi-empresa/MultiEmpresaPage';
import { AutomacaoPage } from '@/pages/AutomacaoPage';
import { ProdutosVariacoesPage } from '@/pages/produtos-variacoes/ProdutosVariacoesPage';
import { ProdutosLotesPage } from '@/pages/produtos-lotes/ProdutosLotesPage';
import { PedidosCompraPage } from '@/pages/compras/PedidosCompraPage';
import { CotacoesPage } from '@/pages/compras/CotacoesPage';
import { EntradasPage } from '@/pages/compras/EntradasPage';
import { MovimentacoesPage } from '@/pages/estoque/MovimentacoesPage';
import { CategoriasPage } from '@/pages/estoque/CategoriasPage';
import { UnidadesMedidaPage } from '@/pages/estoque/UnidadesMedidaPage';
import { SpedFiscalPage } from '@/pages/fiscal/SpedFiscalPage';
import ContasReceberPage from '@/pages/contas-receber/ContasReceberPage';
import ContasPagarPage from '@/pages/contas-pagar/ContasPagarPage';
import TabelasPrecoPage from '@/pages/tabelas-preco/TabelasPrecoPage';
import ChequesPage from '@/pages/cheques/ChequesPage';
import CentrosCustoPage from '@/pages/centros-custo/CentrosCustoPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
      } />
      
      <Route path="/*" element={
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/orcamentos" element={<OrcamentosPage />} />
            <Route path="/boletos" element={<BoletosPage />} />
            <Route path="/pdv" element={<PdvPage />} />
            <Route path="/inventario" element={<InventarioPage />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/estoque/movimentacoes" element={<MovimentacoesPage />} />
            <Route path="/estoque/categorias" element={<CategoriasPage />} />
            <Route path="/estoque/unidades" element={<UnidadesMedidaPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/fluxo-caixa" element={<FluxoCaixaPage />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/transportadoras" element={<TransportadorasPage />} />
            <Route path="/vendedores" element={<VendedoresPage />} />
            <Route path="/relatorios" element={<RelatoriosFiscaisPage />} />
            <Route path="/notas-fiscais" element={<NotasFiscaisPage />} />
            <Route path="/dre" element={<DREPage />} />
            <Route path="/plano-contas" element={<PlanoContasPage />} />
            <Route path="/nfce" element={<NFCePage />} />
            <Route path="/ecf" element={<ECFPage />} />
            <Route path="/nfse" element={<NFSePage />} />
            <Route path="/sped-fiscal" element={<SpedFiscalPage />} />
            <Route path="/planos" element={<PlanosPage />} />
            <Route path="/compras" element={<PedidosCompraPage />} />
            <Route path="/compras/cotacoes" element={<CotacoesPage />} />
            <Route path="/compras/entradas" element={<EntradasPage />} />
            <Route path="/crm" element={<CRMPage />} />
            <Route path="/crm/campanhas" element={<CampanhasPage />} />
            <Route path="/automacao" element={<AutomacaoPage />} />
            <Route path="/multi-empresa" element={<MultiEmpresaPage />} />
            <Route path="/contas-receber" element={<ContasReceberPage />} />
            <Route path="/contas-pagar" element={<ContasPagarPage />} />
            <Route path="/tabelas-preco" element={<TabelasPrecoPage />} />
            <Route path="/cheques" element={<ChequesPage />} />
            <Route path="/centros-custo" element={<CentrosCustoPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/ajuda" element={<AjudaPage />} />
            <Route path="/manual" element={<ManualPage />} />
            <Route path="/manual-tecnico" element={<ManualTecnicoPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/parametros" element={<ParametrosPage />} />
            <Route path="/filiais" element={<FiliaisPage />} />
            <Route path="/produtos-variacoes" element={<ProdutosVariacoesPage />} />
            <Route path="/produtos-lotes" element={<ProdutosLotesPage />} />
          </Routes>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
