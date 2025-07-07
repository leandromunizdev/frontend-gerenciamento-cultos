import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3008/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Se o token expirou ou é inválido, redirecionar para login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    const errorMessage = error.response?.data?.error || 'Erro de conexão com o servidor';
    return Promise.reject(new Error(errorMessage));
  }
);

export const authService = {
  login: async (email, senha) => {
    const response = await api.post('/auth/login', { email, senha });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.usuario));
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  me: async () => {
    return await api.get('/auth/me');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Serviços de cultos
export const cultosService = {
  listar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/cultos${queryString ? `?${queryString}` : ''}`);
  },

  buscarPorId: async (id) => {
    return await api.get(`/cultos/${id}`);
  },

  criar: async (dados) => {
    return await api.post('/cultos', dados);
  },

  atualizar: async (id, dados) => {
    return await api.put(`/cultos/${id}`, dados);
  },

  excluir: async (id) => {
    return await api.delete(`/cultos/${id}`);
  }
};

// Serviços de escalas
export const escalasService = {
  listar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/escalas${queryString ? `?${queryString}` : ''}`);
  },

  buscarPorId: async (id) => {
    return await api.get(`/escalas/${id}`);
  },

  criar: async (dados) => {
    return await api.post('/escalas', dados);
  },

  atualizar: async (id, dados) => {
    return await api.put(`/escalas/${id}`, dados);
  },

  confirmar: async (id) => {
    return await api.patch(`/escalas/${id}/confirmar`);
  },

  checkIn: async (id) => {
    return await api.patch(`/escalas/${id}/check-in`);
  },

  excluir: async (id) => {
    return await api.delete(`/escalas/${id}`);
  }
};

// Serviços de visitantes
export const visitantesService = {
  listar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/visitantes${queryString ? `?${queryString}` : ''}`);
  },

  buscarPorId: async (id) => {
    return await api.get(`/visitantes/${id}`);
  },

  criar: async (dados) => {
    return await api.post('/visitantes', dados);
  },

  atualizar: async (id, dados) => {
    return await api.put(`/visitantes/${id}`, dados);
  },

  excluir: async (id) => {
    return await api.delete(`/visitantes/${id}`);
  }
};

// Serviços de avaliações
export const avaliacoesService = {
  listar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/avaliacoes${queryString ? `?${queryString}` : ''}`);
  },

  criar: async (dados) => {
    return await api.post('/avaliacoes', dados);
  },

  buscarCriterios: async () => {
    return await api.get('/avaliacoes/criterios');
  }
};

// Serviços de pessoas
export const pessoasService = {
  listar: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await api.get(`/pessoas${queryString ? `?${queryString}` : ''}`);
  },

  buscarPorId: async (id) => {
    return await api.get(`/pessoas/${id}`);
  },

  criar: async (dados) => {
    return await api.post('/pessoas', dados);
  },

  atualizar: async (id, dados) => {
    return await api.put(`/pessoas/${id}`, dados);
  }
};

// Serviços de configuração
export const configService = {
  buscarTiposCulto: async () => {
    return await api.get('/config/tipos-culto');
  },

  buscarFuncoes: async () => {
    return await api.get('/config/funcoes');
  },

  buscarDepartamentos: async () => {
    return await api.get('/config/departamentos');
  },

  buscarCargosEclesiasticos: async () => {
    return await api.get('/config/cargos-eclesiasticos');
  },

  buscarFormasConhecimento: async () => {
    return await api.get('/config/formas-conhecimento');
  }
};

export default api;

