import api from './api';

/**
 * Serviço para gerenciar funções
 */
const funcoesService = {
  /**
   * Listar todas as funções
   */
  async listar(params = {}) {
    try {
      const response = await api.get('/funcoes', { params });
      return response;
    } catch (error) {
      console.error('Erro ao listar funções:', error);
      throw error;
    }
  },

  /**
   * Obter função por ID
   */
  async obter(id) {
    try {
      const response = await api.get(`/funcoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao obter função:', error);
      throw error;
    }
  },

  /**
   * Criar nova função
   */
  async criar(dados) {
    try {
      const response = await api.post('/funcoes', dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar função:', error);
      throw error;
    }
  },

  /**
   * Atualizar função
   */
  async atualizar(id, dados) {
    try {
      const response = await api.put(`/funcoes/${id}`, dados);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar função:', error);
      throw error;
    }
  },

  /**
   * Excluir função
   */
  async excluir(id) {
    try {
      const response = await api.delete(`/funcoes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao excluir função:', error);
      throw error;
    }
  }
};

export default funcoesService;

