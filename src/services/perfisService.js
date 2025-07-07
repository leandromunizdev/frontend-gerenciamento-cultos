import api from './api';

/**
 * Serviço para gerenciamento de perfis
 */
const perfisService = {
  /**
   * Listar perfis com filtros e paginação
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/perfis', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar perfis:', error);
      throw error;
    }
  },

  /**
   * Listar todos os perfis (sem paginação) - para dropdowns
   */
  async listarTodos() {
    try {
      const response = await api.get('/perfis/todos');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar todos os perfis:', error);
      throw error;
    }
  },

  /**
   * Obter perfil por ID
   */
  async obter(id) {
    try {
      const response = await api.get(`/perfis/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      throw error;
    }
  },

  /**
   * Criar novo perfil
   */
  async criar(dados) {
    try {
      const response = await api.post('/perfis', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
  },

  /**
   * Atualizar perfil
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/perfis/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  },

  /**
   * Ativar/Desativar perfil
   */
  async toggleAtivo(id) {
    try {
      const response = await api.patch(`/perfis/${id}/toggle-ativo`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do perfil:', error);
      throw error;
    }
  },

  /**
   * Excluir perfil
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/perfis/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir perfil:', error);
      throw error;
    }
  },

  /**
   * Listar todas as permissões disponíveis
   */
  async listarPermissoes() {
    try {
      const response = await api.get('/perfis/permissoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar permissões:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de perfis
   */
  async estatisticas() {
    try {
      const response = await api.get('/perfis/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
};

export default perfisService;

