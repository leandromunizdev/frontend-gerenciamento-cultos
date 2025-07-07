import api from './api';

/**
 * Serviço de autenticação
 */
const authService = {
    /**
     * Fazer login
     * @param {string} email 
     * @param {string} senha 
     * @returns {Promise<Object>}
     */
    async login(email, senha) {
        try {
            const response = await api.post('/auth/login', {
                email,
                senha
            });

            const data = response;

            if (data.success && data.token) {
                const { token, usuario } = data;

                localStorage.setItem('token', token);
                localStorage.setItem('usuario', JSON.stringify(usuario));

                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            return data;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    },

    /**
     * Fazer logout
     */
    logout() {
        try {
            localStorage.removeItem('token');
            localStorage.removeItem('usuario');

            delete api.defaults.headers.common['Authorization'];

            return true;
        } catch (error) {
            console.error('Erro no logout:', error);
            return false;
        }
    },

    /**
     * Obter usuário atual do localStorage
     * @returns {Object|null}
     */
    getCurrentUser() {
        try {
            const usuario = localStorage.getItem('usuario');
            return usuario ? JSON.parse(usuario) : null;
        } catch (error) {
            console.error('Erro ao obter usuário atual:', error);
            return null;
        }
    },

    /**
     * Obter token do localStorage
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Verificar se usuário está logado
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = this.getToken();
        const usuario = this.getCurrentUser();
        return !!(token && usuario);
    },

    /**
     * Verificar se token é válido
     * @returns {Promise<Object>}
     */
    async verifyToken() {
        try {
            const token = this.getToken();
            if (!token) return { success: false };

            const response = await api.get('/auth/verify');
            return response.data;
        } catch (error) {
            console.error('Token inválido:', error);
            this.logout();
            return { success: false };
        }
    },

    /**
     * Atualizar dados do usuário no localStorage
     * @param {Object} usuario 
     */
    updateUser(usuario) {
        try {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            return true;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return false;
        }
    },

    /**
     * Solicitar redefinição de senha
     * @param {string} email 
     * @returns {Promise<Object>}
     */
    async forgotPassword(email) {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            console.error('Erro ao solicitar redefinição de senha:', error);
            throw error;
        }
    },

    /**
     * Redefinir senha
     * @param {string} token 
     * @param {string} novaSenha 
     * @returns {Promise<Object>}
     */
    async resetPassword(token, novaSenha) {
        try {
            const response = await api.post('/auth/reset-password', {
                token,
                novaSenha
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            throw error;
        }
    },

    /**
     * Alterar senha
     * @param {string} senhaAtual 
     * @param {string} novaSenha 
     * @returns {Promise<Object>}
     */
    async changePassword(senhaAtual, novaSenha) {
        try {
            const response = await api.post('/auth/change-password', {
                senhaAtual,
                novaSenha
            });
            return response.data;
        } catch (error) {
            console.error('Erro ao alterar senha:', error);
            throw error;
        }
    }
};

// Configurar token no header se existir
const token = authService.getToken();
if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default authService;

