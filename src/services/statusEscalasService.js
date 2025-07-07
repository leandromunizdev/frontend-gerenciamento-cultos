import api from './api';

/**
 * Serviço para gerenciamento de status de escalas
 */
const statusEscalasService = {
  /**
   * Listar status de escalas
   * @returns {Promise<Object>}
   */
  async listar() {
    try {
      const response = await api.get('/status-escalas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar status de escalas:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao listar status de escalas'
      };
    }
  },

  /**
   * Obter status por ID
   * @param {number} id - ID do status
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/status-escalas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao obter status'
      };
    }
  }
};

export default statusEscalasService;

