/**
 * Utilitários para verificação de permissões
 */

/**
 * Verificar se usuário tem permissão específica
 * @param {Object} usuario - Objeto do usuário com perfil e permissões
 * @param {string} permissao - Código da permissão
 * @returns {boolean}
 */
export const temPermissao = (usuario, permissao) => {
  if (!usuario || !usuario.perfil) return false;
  
  // Administrador tem todas as permissões
  if (usuario.perfil.nome === 'Administrador') return true;
  
  // Verificar se tem a permissão específica
  if (usuario.perfil.permissoes) {
    return usuario.perfil.permissoes.some(p => p.codigo === permissao);
  }
  
  return false;
};

/**
 * Verificar se usuário tem qualquer uma das permissões
 * @param {Object} usuario 
 * @param {Array} permissoes 
 * @returns {boolean}
 */
export const temQualquerPermissao = (usuario, permissoes) => {
  if (!Array.isArray(permissoes)) return false;
  
  return permissoes.some(permissao => temPermissao(usuario, permissao));
};

/**
 * Verificar se usuário tem todas as permissões
 * @param {Object} usuario 
 * @param {Array} permissoes 
 * @returns {boolean}
 */
export const temTodasPermissoes = (usuario, permissoes) => {
  if (!Array.isArray(permissoes)) return false;
  
  return permissoes.every(permissao => temPermissao(usuario, permissao));
};

/**
 * Verificar se usuário tem nível de acesso mínimo
 * @param {Object} usuario 
 * @param {number} nivelMinimo 
 * @returns {boolean}
 */
export const temNivelAcesso = (usuario, nivelMinimo) => {
  if (!usuario || !usuario.perfil) return false;
  
  return usuario.perfil.nivel_acesso >= nivelMinimo;
};

/**
 * Verificar se usuário pode gerenciar cultos
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeGerenciarCultos = (usuario) => {
  return temQualquerPermissao(usuario, [
    'manage_cultos',
    'create_cultos',
    'update_cultos',
    'delete_cultos'
  ]);
};

/**
 * Verificar se usuário pode criar cultos
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeCriarCultos = (usuario) => {
  return temQualquerPermissao(usuario, ['manage_cultos', 'create_cultos']);
};

/**
 * Verificar se usuário pode editar cultos
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeEditarCultos = (usuario) => {
  return temQualquerPermissao(usuario, ['manage_cultos', 'update_cultos']);
};

/**
 * Verificar se usuário pode excluir cultos
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeExcluirCultos = (usuario) => {
  return temQualquerPermissao(usuario, ['manage_cultos', 'delete_cultos']);
};

/**
 * Verificar se usuário pode visualizar cultos
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeVisualizarCultos = (usuario) => {
  return temQualquerPermissao(usuario, [
    'manage_cultos',
    'create_cultos',
    'read_cultos',
    'update_cultos',
    'delete_cultos'
  ]);
};

/**
 * Verificar se usuário pode gerenciar escalas
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeGerenciarEscalas = (usuario) => {
  return temQualquerPermissao(usuario, [
    'manage_escalas',
    'create_escalas',
    'update_escalas',
    'delete_escalas'
  ]);
};

/**
 * Verificar se usuário pode gerenciar pessoas
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeGerenciarPessoas = (usuario) => {
  return temQualquerPermissao(usuario, [
    'manage_pessoas',
    'create_pessoas',
    'update_pessoas',
    'delete_pessoas'
  ]);
};

/**
 * Verificar se usuário pode gerenciar visitantes
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeGerenciarVisitantes = (usuario) => {
  return temQualquerPermissao(usuario, [
    'manage_visitantes',
    'create_visitantes',
    'update_visitantes',
    'delete_visitantes'
  ]);
};

/**
 * Verificar se usuário pode acessar relatórios
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeAcessarRelatorios = (usuario) => {
  return temPermissao(usuario, 'read_relatorios');
};

/**
 * Verificar se usuário é administrador
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const isAdmin = (usuario) => {
  return usuario && usuario.perfil && usuario.perfil.nome === 'Administrador';
};

/**
 * Verificar se usuário é pastor
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const isPastor = (usuario) => {
  return usuario && usuario.perfil && usuario.perfil.nome === 'Pastor';
};

/**
 * Verificar se usuário é líder
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const isLider = (usuario) => {
  return usuario && usuario.perfil && usuario.perfil.nome === 'Líder';
};

/**
 * Obter permissões do usuário
 * @param {Object} usuario 
 * @returns {Array}
 */
export const obterPermissoes = (usuario) => {
  if (!usuario || !usuario.perfil || !usuario.perfil.permissoes) return [];
  
  return usuario.perfil.permissoes.map(p => p.codigo);
};

/**
 * Filtrar itens de menu baseado nas permissões
 * @param {Array} itensMenu 
 * @param {Object} usuario 
 * @returns {Array}
 */
export const filtrarMenuPorPermissoes = (itensMenu, usuario) => {
  if (!Array.isArray(itensMenu)) return [];
  
  return itensMenu.filter(item => {
    // Se não tem permissão requerida, mostrar item
    if (!item.permissaoRequerida) return true;
    
    // Verificar se tem a permissão
    if (typeof item.permissaoRequerida === 'string') {
      return temPermissao(usuario, item.permissaoRequerida);
    }
    
    // Se é array, verificar se tem qualquer uma das permissões
    if (Array.isArray(item.permissaoRequerida)) {
      return temQualquerPermissao(usuario, item.permissaoRequerida);
    }
    
    return false;
  });
};

/**
 * Verificar se usuário pode acessar rota
 * @param {string} rota 
 * @param {Object} usuario 
 * @returns {boolean}
 */
export const podeAcessarRota = (rota, usuario) => {
  // Mapeamento de rotas para permissões
  const rotasPermissoes = {
    '/cultos': ['read_cultos', 'manage_cultos'],
    '/escalas': ['read_escalas', 'manage_escalas'],
    '/pessoas': ['read_pessoas', 'manage_pessoas'],
    '/visitantes': ['read_visitantes', 'manage_visitantes'],
    '/relatorios': ['read_relatorios'],
    '/admin': ['admin_sistema']
  };
  
  const permissoesRota = rotasPermissoes[rota];
  if (!permissoesRota) return true; // Rota pública
  
  return temQualquerPermissao(usuario, permissoesRota);
};

export default {
  temPermissao,
  temQualquerPermissao,
  temTodasPermissoes,
  temNivelAcesso,
  podeGerenciarCultos,
  podeCriarCultos,
  podeEditarCultos,
  podeExcluirCultos,
  podeVisualizarCultos,
  podeGerenciarEscalas,
  podeGerenciarPessoas,
  podeGerenciarVisitantes,
  podeAcessarRelatorios,
  isAdmin,
  isPastor,
  isLider,
  obterPermissoes,
  filtrarMenuPorPermissoes,
  podeAcessarRota
};

