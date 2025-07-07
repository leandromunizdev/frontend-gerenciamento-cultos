import api from './api';

/**
 * Serviço para gerenciamento de usuários
 */
const usuariosService = {
  /**
   * Listar usuários com filtros e paginação
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/usuarios', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      throw error;
    }
  },

  /**
   * Obter usuário por ID
   */
  async obter(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      throw error;
    }
  },

  /**
   * Criar novo usuário
   */
  async criar(dados) {
    try {
      const response = await api.post('/usuarios', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  /**
   * Atualizar usuário
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/usuarios/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  /**
   * Alterar senha do usuário
   */
  async alterarSenha(id, dados) {
    try {
      const response = await api.patch(`/usuarios/${id}/senha`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      throw error;
    }
  },

  /**
   * Resetar senha do usuário (admin)
   */
  async resetarSenha(id, dados) {
    try {
      const response = await api.patch(`/usuarios/${id}/resetar-senha`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao resetar senha:', error);
      throw error;
    }
  },

  /**
   * Ativar/Desativar usuário
   */
  async toggleAtivo(id) {
    try {
      const response = await api.patch(`/usuarios/${id}/toggle-ativo`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      throw error;
    }
  },

  /**
   * Excluir usuário
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de usuários
   */
  async estatisticas() {
    try {
      const response = await api.get('/usuarios/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
};

export default usuariosService;

