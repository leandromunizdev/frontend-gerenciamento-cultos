import api from './api';

/**
 * Serviço para gerenciamento de cargos eclesiásticos
 */
const cargosService = {
    /**
     * Listar todos os cargos
     */
    async listar() {
        try {
            const response = await api.get('/cargos');
            return response.data;
        } catch (error) {
            console.error('Erro ao listar cargos:', error);
            throw error;
        }
    },

    /**
     * Obter cargo por ID
     */
    async obter(id) {
        try {
            const response = await api.get(`/cargos/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erro ao obter cargo:', error);
            throw error;
        }
    }
};

export default cargosService;

