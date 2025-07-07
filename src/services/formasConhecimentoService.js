import api from './api';

/**
 * Serviço para gerenciamento de formas de conhecimento
 */
const formasConhecimentoService = {
  /**
   * Listar todas as formas de conhecimento
   * @returns {Promise<Object>}
   */
  async listar() {
    try {
      const response = await api.get('/formas-conhecimento');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar formas de conhecimento:', error);
      throw error;
    }
  },

  /**
   * Obter forma de conhecimento por ID
   * @param {number} id - ID da forma de conhecimento
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/formas-conhecimento/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter forma de conhecimento:', error);
      throw error;
    }
  }
};

export default formasConhecimentoService;

