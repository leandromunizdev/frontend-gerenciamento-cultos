import api from './api';

/**
 * Serviço para gerenciamento de configurações do sistema
 */
const configuracaoService = {
  /**
   * Obter configurações do sistema
   * @returns {Promise<Object>}
   */
  async obter() {
    try {
      const response = await api.get('/configuracoes');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter configurações:', error);
      throw error;
    }
  },

  /**
   * Atualizar configurações do sistema
   * @param {Object} configuracoes - Configurações a serem atualizadas
   * @returns {Promise<Object>}
   */
  async atualizar(configuracoes) {
    try {
      const response = await api.put('/configuracoes', configuracoes);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  },

  /**
   * Gerar backup do sistema
   * @returns {Promise<Object>}
   */
  async gerarBackup() {
    try {
      const response = await api.post('/configuracoes/backup');
      return response.data;
    } catch (error) {
      console.error('Erro ao gerar backup:', error);
      throw error;
    }
  },

  /**
   * Obter status do sistema
   * @returns {Promise<Object>}
   */
  async obterStatus() {
    try {
      const response = await api.get('/configuracoes/sistema/status');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter status do sistema:', error);
      throw error;
    }
  },

  /**
   * Obter logs do sistema
   * @param {Object} filtros - Filtros para os logs
   * @returns {Promise<Object>}
   */
  async obterLogs(filtros = {}) {
    try {
      const response = await api.get('/configuracoes/logs', { params: filtros });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter logs:', error);
      throw error;
    }
  }
};

export default configuracaoService;

