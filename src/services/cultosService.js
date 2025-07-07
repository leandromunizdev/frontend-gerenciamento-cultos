import api from './api';

/**
 * Serviço para gerenciamento de cultos
 */
const cultosService = {
  /**
   * Listar cultos com filtros e paginação
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/cultos', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar cultos:', error);
      throw error;
    }
  },

  /**
   * Obter culto por ID
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async obterPorId(id) {
    try {
      const response = await api.get(`/cultos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter culto:', error);
      throw error;
    }
  },

  /**
   * Criar novo culto
   * @param {Object} dados 
   * @returns {Promise<Object>}
   */
  async criar(dados) {
    try {
      const response = await api.post('/cultos', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar culto:', error);
      throw error;
    }
  },

  /**
   * Atualizar culto
   * @param {number} id 
   * @param {Object} dados 
   * @returns {Promise<Object>}
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/cultos/${id}`, dados);
      return response;
    } catch (error) {
      console.error('Erro ao atualizar culto:', error);
      throw error;
    }
  },

  /**
   * Excluir culto
   * @param {number} id 
   * @returns {Promise<Object>}
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/cultos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir culto:', error);
      throw error;
    }
  },

  /**
   * Atualizar status do culto
   * @param {number} id 
   * @param {number} statusId 
   * @returns {Promise<Object>}
   */
  async atualizarStatus(id, statusId) {
    try {
      const response = await api.patch(`/cultos/${id}/status`, { status_id: statusId });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do culto:', error);
      throw error;
    }
  },

  /**
   * Verificar conflito de horário
   * @param {Object} dados 
   * @returns {Promise<Object>}
   */
  async verificarConflito(dados) {
    try {
      const response = await api.post('/cultos/verificar-conflito', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar conflito:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de cultos
   * @param {Object} filtros 
   * @returns {Promise<Object>}
   */
  async obterEstatisticas(filtros = {}) {
    try {
      const response = await api.get('/cultos/estatisticas', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  },

  /**
   * Obter cultos próximos
   * @param {number} dias - Número de dias à frente
   * @returns {Promise<Array>}
   */
  async obterProximos(dias = 7) {
    try {
      const response = await api.get('/cultos/proximos', {
        params: { dias }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter cultos próximos:', error);
      throw error;
    }
  },

  /**
   * Duplicar culto
   * @param {number} id 
   * @param {Object} novosDados 
   * @returns {Promise<Object>}
   */
  async duplicar(id, novosDados) {
    try {
      const response = await api.post(`/cultos/${id}/duplicar`, novosDados);
      return response.data;
    } catch (error) {
      console.error('Erro ao duplicar culto:', error);
      throw error;
    }
  }
};

export default cultosService;

