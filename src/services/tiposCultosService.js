import api from './api';

export const tiposCultosService = {
  // Listar tipos de cultos
  async listar() {
    try {
      const response = await api.get('/tipos-cultos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar tipos de cultos:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao listar tipos de cultos'
      };
    }
  },

  // Criar tipo de culto
  async criar(dados) {
    try {
      const response = await api.post('/tipos-cultos', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar tipo de culto:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar tipo de culto'
      };
    }
  },

  // Atualizar tipo de culto
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/tipos-cultos/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar tipo de culto:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar tipo de culto'
      };
    }
  }
};

