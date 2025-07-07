import api from './api';

/**
 * Serviço para gerenciamento de avaliações
 */
const avaliacoesService = {
  /**
   * Listar avaliações com filtros 
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

      const response = await api.get(`/avaliacoes?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar avaliações:', error);
      throw error;
    }
  },

  /**
   * Obter avaliação por ID 
   * @param {number} id - ID da avaliação
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/avaliacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter avaliação:', error);
      throw error;
    }
  },

  /**
   * Criar avaliação pública (sem autenticação)
   * @param {Object} dados - Dados da avaliação
   * @returns {Promise<Object>}
   */
  async criarPublica(dados) {
    try {
      // Fazer requisição direta sem token de autenticação
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3008/api'}/avaliacoes/publica`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao enviar avaliação');
      }

      return result;
    } catch (error) {
      console.error('Erro ao criar avaliação pública:', error);
      throw error;
    }
  },

  /**
   * Excluir avaliação 
   * @param {number} id - ID da avaliação
   * @returns {Promise<Object>}
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/avaliacoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir avaliação:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de avaliações 
   * @returns {Promise<Object>}
   */
  async estatisticas() {
    try {
      const response = await api.get('/avaliacoes/estatisticas');
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  },

  /**
   * Listar critérios de avaliação (público)
   * @returns {Promise<Object>}
   */
  async listarCriterios() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3008/api'}/avaliacoes/criterios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao carregar critérios');
      }

      return result;
    } catch (error) {
      console.error('Erro ao listar critérios:', error);
      throw error;
    }
  }
};

export default avaliacoesService;

