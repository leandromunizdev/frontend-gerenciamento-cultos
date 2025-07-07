import api from './api';

/**
 * Serviço para gerenciamento de visitantes
 */
const visitantesService = {
  /**
   * Listar visitantes com filtros
   * @param {Object} filtros - Filtros para busca
   * @returns {Promise<Object>}
   */
  async listar(filtros = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== '' && filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key]);
        }
      });

      const response = await api.get(`/visitantes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar visitantes:', error);
      throw error;
    }
  },

  /**
   * Obter visitante por ID
   * @param {number} id - ID do visitante
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/visitantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter visitante:', error);
      throw error;
    }
  },

  /**
   * Criar novo visitante
   * @param {Object} dados - Dados do visitante
   * @returns {Promise<Object>}
   */
  async criar(dados) {
    try {
      const response = await api.post('/visitantes', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar visitante:', error);
      throw error;
    }
  },

  /**
   * Atualizar visitante
   * @param {number} id - ID do visitante
   * @param {Object} dados - Dados atualizados
   * @returns {Promise<Object>}
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/visitantes/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar visitante:', error);
      throw error;
    }
  },

  /**
   * Excluir visitante
   * @param {number} id - ID do visitante
   * @returns {Promise<Object>}
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/visitantes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir visitante:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de visitantes
   * @returns {Promise<Object>}
   */
  async estatisticas() {
    try {
      const response = await api.get('/visitantes/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  }
};

export default visitantesService;

