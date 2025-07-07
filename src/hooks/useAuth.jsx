import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Verificar se há token armazenado
      const token = authService.getToken();
      const storedUser = authService.getCurrentUser();
      
      if (token && storedUser) {
        // Verificar se token ainda é válido
        const response = await authService.verifyToken();
        
        if (response?.usuario) {
          setUser(response.usuario || storedUser);
        } else {
          // Token inválido, limpar dados
          authService.logout();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      
      if (response.success) {
        setUser(response.usuario);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.error || 'Erro ao fazer login' 
        };
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return { 
        success: false, 
        error: error.response?.error || 'Erro ao conectar com o servidor' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Função para verificar se usuário tem permissão específica
  const hasPermission = (permission) => {
    if (!user || !user.perfil || !user.perfil.permissoes) {
      return false;
    }

    // Verificar se é admin (tem todas as permissões)
    if (user.perfil.nome === 'Administrador' || user.perfil.nome === 'admin') {
      return true;
    }

    // Verificar permissão específica
    return user.perfil.permissoes.some(p => p.nome === permission);
  };

  // Função para verificar se usuário tem pelo menos uma das permissões
  const hasAnyPermission = (permissions) => {
    if (!Array.isArray(permissions)) {
      return hasPermission(permissions);
    }

    return permissions.some(permission => hasPermission(permission));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

