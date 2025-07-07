import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cultos from './pages/Cultos';
import Escalas from './pages/Escalas';
import Pessoas from './pages/Pessoas';
import Usuarios from './pages/Usuarios';
import Perfis from './pages/Perfis';
import Visitantes from './pages/Visitantes';
import Avaliacoes from './pages/Avaliacoes';
import AvaliacaoPublica from './pages/AvaliacaoPublica';
import Configuracoes from './pages/Configuracoes';
import './App.css';
import NotFound from './pages/NotFound';

// Páginas placeholder para desenvolvimento futuro
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground">Esta página será implementada em breve.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rota pública de avaliação */}
          <Route 
            path="/avaliacao-publica" 
            element={<AvaliacaoPublica />} 
          />
          
          {/* Rotas protegidas */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route index element={<Dashboard />} />
            
            {/* Cultos */}
            <Route 
              path="cultos" 
              element={
                <ProtectedRoute requiredPermission="view_cultos">
                  <Cultos />
                </ProtectedRoute>
              } 
            />
            
            {/* Escalas */}
            <Route 
              path="escalas" 
              element={
                <ProtectedRoute requiredPermission="read_escalas">
                  <Escalas />
                </ProtectedRoute>
              } 
            />
            
            {/* Pessoas */}
            <Route 
              path="/pessoas" 
              element={
                <ProtectedRoute requiredPermissions={['read_pessoas']}>
                  <Pessoas />
                </ProtectedRoute>
              } 
            />
            
            {/* Visitantes */}
            <Route 
              path="/visitantes" 
              element={
                <ProtectedRoute requiredPermissions={['read_visitantes']}>
                  <Visitantes />
                </ProtectedRoute>
              } 
            />
            
            {/* Avaliações */}
            <Route 
              path="avaliacoes" 
              element={
                <ProtectedRoute requiredPermission="read_avaliacoes">
                  <Avaliacoes />
                </ProtectedRoute>
              } 
            />
            {/* Usuários */}
            <Route 
              path="usuarios" 
              element={
                <ProtectedRoute requiredPermission="read_usuarios">
                  <Usuarios />
                </ProtectedRoute>
              } 
            />
            
            {/* Perfis */}
            <Route 
              path="perfis" 
              element={
                <ProtectedRoute requiredPermission="read_perfis">
                  <Perfis />
                </ProtectedRoute>
              } 
            />            
            {/* Configurações */}
            <Route 
              path="/configuracoes" 
              element={
                <ProtectedRoute requiredPermission="read_configuracoes">
                  <Configuracoes />
                </ProtectedRoute>
              } 
            />
          </Route>
          
         {/* Rota coringa para página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
