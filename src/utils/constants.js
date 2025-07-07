/**
 * Constantes da aplicação
 */

// Status de cultos
export const STATUS_CULTOS = {
  PLANEJADO: 1,
  EM_ANDAMENTO: 2,
  FINALIZADO: 3,
  CANCELADO: 4
};

// Status de escalas
export const STATUS_ESCALAS = {
  PENDENTE: 1,
  CONFIRMADO: 2,
  RECUSADO: 3,
  AUSENTE: 4
};

// Tipos de usuário/perfis
export const PERFIS = {
  ADMINISTRADOR: 'Administrador',
  PASTOR: 'Pastor',
  LIDER: 'Líder',
  SECRETARIO: 'Secretário',
  MEMBRO: 'Membro',
  VISITANTE: 'Visitante'
};

// Cargos eclesiásticos
export const CARGOS_ECLESIASTICOS = {
  PASTOR: 'Pastor',
  PRESBITERO: 'Presbítero',
  EVANGELISTA: 'Evangelista',
  DIACONO: 'Diácono',
  MEMBRO: 'Membro',
  CONGREGADO: 'Congregado'
};

// Cores padrão para status
export const CORES_STATUS = {
  PLANEJADO: '#FFA500',
  EM_ANDAMENTO: '#32CD32',
  FINALIZADO: '#4169E1',
  CANCELADO: '#DC143C',
  PENDENTE: '#FFA500',
  CONFIRMADO: '#32CD32',
  RECUSADO: '#DC143C',
  AUSENTE: '#8B0000'
};

// Configurações de paginação
export const PAGINACAO = {
  ITENS_POR_PAGINA: 10,
  OPCOES_ITENS_POR_PAGINA: [5, 10, 20, 50],
  PAGINA_INICIAL: 1
};

// Configurações de data
export const FORMATOS_DATA = {
  DATA_CURTA: 'dd/MM/yyyy',
  DATA_LONGA: 'dd/MM/yyyy HH:mm',
  HORA: 'HH:mm',
  DATA_ISO: 'yyyy-MM-dd',
  DATETIME_LOCAL: 'yyyy-MM-ddTHH:mm'
};

// Mensagens padrão
export const MENSAGENS = {
  SUCESSO: {
    SALVO: 'Dados salvos com sucesso!',
    EXCLUIDO: 'Item excluído com sucesso!',
    ATUALIZADO: 'Dados atualizados com sucesso!',
    CRIADO: 'Item criado com sucesso!'
  },
  ERRO: {
    GENERICO: 'Ocorreu um erro inesperado. Tente novamente.',
    CONEXAO: 'Erro de conexão com o servidor.',
    PERMISSAO: 'Você não tem permissão para realizar esta ação.',
    VALIDACAO: 'Verifique os dados informados.',
    NAO_ENCONTRADO: 'Item não encontrado.'
  },
  CONFIRMACAO: {
    EXCLUIR: 'Tem certeza que deseja excluir este item?',
    CANCELAR: 'Tem certeza que deseja cancelar?',
    SAIR: 'Tem certeza que deseja sair?'
  }
};

// Validações
export const VALIDACOES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  CEP: /^\d{5}-\d{3}$/,
  SENHA_MIN_LENGTH: 6,
  NOME_MIN_LENGTH: 2,
  TITULO_MIN_LENGTH: 3
};

// Configurações de upload
export const UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  TIPOS_PERMITIDOS: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  EXTENSOES_IMAGEM: ['.jpg', '.jpeg', '.png', '.gif'],
  EXTENSOES_DOCUMENTO: ['.pdf', '.doc', '.docx']
};

// URLs da API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  CULTOS: {
    BASE: '/cultos',
    ESTATISTICAS: '/cultos/estatisticas',
    PROXIMOS: '/cultos/proximos',
    VERIFICAR_CONFLITO: '/cultos/verificar-conflito'
  },
  TIPOS_CULTOS: {
    BASE: '/tipos-cultos'
  },
  ESCALAS: {
    BASE: '/escalas',
    CONFIRMAR: '/escalas/confirmar',
    RECUSAR: '/escalas/recusar'
  },
  PESSOAS: {
    BASE: '/pessoas',
    BUSCAR: '/pessoas/buscar'
  },
  VISITANTES: {
    BASE: '/visitantes',
    ESTATISTICAS: '/visitantes/estatisticas'
  },
  RELATORIOS: {
    BASE: '/relatorios',
    CULTOS: '/relatorios/cultos',
    ESCALAS: '/relatorios/escalas',
    VISITANTES: '/relatorios/visitantes'
  }
};

// Configurações de notificação
export const NOTIFICACOES = {
  DURACAO_PADRAO: 5000,
  TIPOS: {
    SUCESSO: 'success',
    ERRO: 'error',
    AVISO: 'warning',
    INFO: 'info'
  }
};

// Configurações de tema
export const TEMA = {
  CORES_PRIMARIAS: {
    LARANJA: '#FF6B35',
    DOURADO: '#F7931E',
    AMARELO: '#FFD23F'
  },
  CORES_SECUNDARIAS: {
    VERDE: '#06FFA5',
    AZUL: '#4ECDC4',
    AZUL_CLARO: '#45B7D1'
  },
  CORES_NEUTRAS: {
    CINZA_CLARO: '#F8F9FA',
    CINZA_MEDIO: '#6C757D',
    CINZA_ESCURO: '#343A40',
    BRANCO: '#FFFFFF',
    PRETO: '#000000'
  }
};

// Configurações de localStorage
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USUARIO: 'usuario',
  TEMA: 'tema',
  CONFIGURACOES: 'configuracoes',
  FILTROS_CULTOS: 'filtros_cultos',
  FILTROS_ESCALAS: 'filtros_escalas'
};

// Configurações de sessão
export const SESSAO = {
  TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas
  WARNING_TIME: 5 * 60 * 1000, // 5 minutos antes de expirar
  REFRESH_INTERVAL: 15 * 60 * 1000 // Verificar a cada 15 minutos
};

// Configurações de busca
export const BUSCA = {
  MIN_CARACTERES: 2,
  DELAY_BUSCA: 500, // ms
  MAX_RESULTADOS: 50
};

// Configurações de relatórios
export const RELATORIOS = {
  FORMATOS: ['PDF', 'EXCEL', 'CSV'],
  PERIODOS: {
    HOJE: 'hoje',
    SEMANA: 'semana',
    MES: 'mes',
    TRIMESTRE: 'trimestre',
    ANO: 'ano',
    PERSONALIZADO: 'personalizado'
  }
};

export default {
  STATUS_CULTOS,
  STATUS_ESCALAS,
  PERFIS,
  CARGOS_ECLESIASTICOS,
  CORES_STATUS,
  PAGINACAO,
  FORMATOS_DATA,
  MENSAGENS,
  VALIDACOES,
  UPLOAD,
  API_ENDPOINTS,
  NOTIFICACOES,
  TEMA,
  STORAGE_KEYS,
  SESSAO,
  BUSCA,
  RELATORIOS
};

