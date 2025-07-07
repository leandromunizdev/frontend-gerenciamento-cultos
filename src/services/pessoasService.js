import api from './api';

/**
 * Serviço para gerenciamento de pessoas
 */
const pessoasService = {
  /**
   * Listar pessoas com filtros e paginação
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/pessoas', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao listar pessoas:', error);
      throw error;
    }
  },

  /**
   * Obter pessoa por ID
   * @param {number} id - ID da pessoa
   * @returns {Promise<Object>}
   */
  async obter(id) {
    try {
      const response = await api.get(`/pessoas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter pessoa:', error);
      throw error;
    }
  },

  /**
   * Criar nova pessoa
   * @param {Object} dados - Dados da pessoa
   * @returns {Promise<Object>}
   */
  async criar(dados) {
    try {
      const response = await api.post('/pessoas', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar pessoa:', error);
      throw error;
    }
  },

  /**
   * Atualizar pessoa
   * @param {number} id - ID da pessoa
   * @param {Object} dados - Dados atualizados
   * @returns {Promise<Object>}
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/pessoas/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pessoa:', error);
      throw error;
    }
  },

  /**
   * Excluir pessoa
   * @param {number} id - ID da pessoa
   * @returns {Promise<Object>}
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/pessoas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir pessoa:', error);
      throw error;
    }
  },

  /**
   * Obter estatísticas de pessoas
   * @param {Object} params - Parâmetros de filtro
   * @returns {Promise<Object>}
   */
  async estatisticas(params = {}) {
    try {
      const response = await api.get('/pessoas/estatisticas', { params });
      return response.data;
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      throw error;
    }
  },

  /**
   * Buscar pessoas para seleção (retorna lista simplificada)
   * @param {string} busca - Termo de busca
   * @param {Object} filtros - Filtros adicionais
   * @returns {Promise<Object>}
   */
  async buscarParaSelecao(busca = '', filtros = {}) {
    try {
      const params = {
        busca,
        limit: 50,
        ativo: true,
        ...filtros
      };

      const response = await api.get('/pessoas', { params });

      return {
        success: response.data.success,
        data: response.data.data.pessoas.map(pessoa => ({
          id: pessoa.id,
          nome_completo: pessoa.nome_completo,
          telefone: pessoa.telefone,
          cargo: pessoa.cargoEclesiastico?.nome,
          departamento: pessoa.departamento?.nome
        }))
      };
    } catch (error) {
      console.error('Erro ao buscar pessoas para seleção:', error);
      throw error;
    }
  }
};

export default pessoasService;

