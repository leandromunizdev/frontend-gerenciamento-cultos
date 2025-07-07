import api from './api';

/**
 * Serviço para gerenciamento de departamentos
 */
const departamentosService = {
    /**
     * Listar todos os departamentos
     */
    async listar() {
        try {
            const response = await api.get('/departamentos');
            return response.data;
        } catch (error) {
            console.error('Erro ao listar departamentos:', error);
            throw error;
        }
    },

    /**
     * Obter departamento por ID
     */
    async obter(id) {
        try {
            const response = await api.get(`/departamentos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter departamento:', error);
            throw error;
        }
    }
};

export default departamentosService;

