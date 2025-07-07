import api from './api';

/**
 * Serviço para gerenciamento de escalas
 */
const escalasService = {
  /**
   * Listar escalas com filtros e paginação
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/escalas', { params });
      return response;
    } catch (error) {
      console.error('Erro ao listar escalas:', error);
      throw error;
    }
  },

  /**
   * Obter escala por ID
   * @param {number} id - ID da escala
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/escalas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter escala:', error);
      throw error;
    }
  },

  /**
   * Criar nova escala
   * @param {Object} dados - Dados da escala
   * @returns {Promise<Object>}
   */
  async criar(dados) {
    try {
      const response = await api.post('/escalas', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar escala:', error);
      throw error;
    }
  },

  /**
   * Atualizar escala
   * @param {number} id - ID da escala
   * @param {Object} dados - Dados atualizados
   * @returns {Promise<Object>}
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/escalas/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar escala:', error);
      throw error;
    }
  },

  /**
   * Excluir escala
   * @param {number} id - ID da escala
   * @returns {Promise<Object>}
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/escalas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir escala:', error);
      throw error;
    }
  },

  /**
   * Confirmar escala
   * @param {number} id - ID da escala
   * @returns {Promise<Object>}
   */
  async confirmar(id) {
    try {
      const response = await api.patch(`/escalas/${id}/confirmar`);
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar escala:', error);
      throw error;
    }
  },

  /**
   * Cancelar escala
   * @param {number} id - ID da escala
   * @param {string} motivo - Motivo do cancelamento
   * @returns {Promise<Object>}
   */
  async cancelar(id, motivo = '') {
    try {
      const response = await api.patch(`/escalas/${id}/cancelar`, { motivo });
      return response.data;
    } catch (error) {
      console.error('Erro ao cancelar escala:', error);
      throw error;
    }
  },

  /**
   * Listar escalas por pessoa
   * @param {number} pessoaId - ID da pessoa
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async listarPorPessoa(pessoaId, params = {}) {
    try {
      const response = await api.get(`/escalas/pessoa/${pessoaId}`, { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar escalas por pessoa:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de escalas
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async estatisticas(params = {}) {
    try {
      const response = await api.get('/escalas/estatisticas', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
};

export default escalasService;

