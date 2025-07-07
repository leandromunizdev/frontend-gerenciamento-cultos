/**
 * Utilitários para formatação de dados
 */

/**
 * Formatar data para exibição
 * @param {string|Date} data 
 * @param {Object} opcoes 
 * @returns {string}
 */
export const formatarData = (data, opcoes = {}) => {
  if (!data) return '';
  
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) return '';

  const opcoesDefault = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...opcoes
  };

  return dataObj.toLocaleDateString('pt-BR', opcoesDefault);
};

/**
 * Formatar data e hora para exibição
 * @param {string|Date} data 
 * @param {Object} opcoes 
 * @returns {string}
 */
export const formatarDataHora = (data, opcoes = {}) => {
  if (!data) return '';
  
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) return '';

  const opcoesDefault = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...opcoes
  };

  return dataObj.toLocaleString('pt-BR', opcoesDefault);
};

/**
 * Formatar apenas hora
 * @param {string|Date} data 
 * @returns {string}
 */
export const formatarHora = (data) => {
  if (!data) return '';
  
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) return '';

  return dataObj.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatar data para input datetime-local
 * @param {string|Date} data 
 * @returns {string}
 */
export const formatarParaInput = (data) => {
  if (!data) return '';
  
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) return '';

  // Ajustar para timezone local
  const offset = dataObj.getTimezoneOffset();
  const dataLocal = new Date(dataObj.getTime() - (offset * 60 * 1000));
  
  return dataLocal.toISOString().slice(0, 16);
};

/**
 * Formatar telefone
 * @param {string} telefone 
 * @returns {string}
 */
export const formatarTelefone = (telefone) => {
  if (!telefone) return '';
  
  // Remove tudo que não é número
  const numeros = telefone.replace(/\D/g, '');
  
  // Aplica máscara baseada no tamanho
  if (numeros.length === 11) {
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (numeros.length === 10) {
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  
  return telefone;
};

/**
 * Formatar CPF
 * @param {string} cpf 
 * @returns {string}
 */
export const formatarCPF = (cpf) => {
  if (!cpf) return '';
  
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  
  return cpf;
};

/**
 * Formatar CEP
 * @param {string} cep 
 * @returns {string}
 */
export const formatarCEP = (cep) => {
  if (!cep) return '';
  
  const numeros = cep.replace(/\D/g, '');
  
  if (numeros.length === 8) {
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
  
  return cep;
};

/**
 * Formatar moeda (Real brasileiro)
 * @param {number} valor 
 * @returns {string}
 */
export const formatarMoeda = (valor) => {
  if (valor === null || valor === undefined || isNaN(valor)) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
};

/**
 * Formatar número
 * @param {number} numero 
 * @param {number} decimais 
 * @returns {string}
 */
export const formatarNumero = (numero, decimais = 0) => {
  if (numero === null || numero === undefined || isNaN(numero)) return '0';
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais
  }).format(numero);
};

/**
 * Capitalizar primeira letra
 * @param {string} texto 
 * @returns {string}
 */
export const capitalizar = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Capitalizar cada palavra
 * @param {string} texto 
 * @returns {string}
 */
export const capitalizarPalavras = (texto) => {
  if (!texto) return '';
  
  return texto
    .toLowerCase()
    .split(' ')
    .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
    .join(' ');
};

/**
 * Truncar texto
 * @param {string} texto 
 * @param {number} limite 
 * @returns {string}
 */
export const truncarTexto = (texto, limite = 100) => {
  if (!texto) return '';
  
  if (texto.length <= limite) return texto;
  
  return texto.substring(0, limite) + '...';
};

/**
 * Remover acentos
 * @param {string} texto 
 * @returns {string}
 */
export const removerAcentos = (texto) => {
  if (!texto) return '';
  
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Gerar slug a partir de texto
 * @param {string} texto 
 * @returns {string}
 */
export const gerarSlug = (texto) => {
  if (!texto) return '';
  
  return removerAcentos(texto)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

/**
 * Validar email
 * @param {string} email 
 * @returns {boolean}
 */
export const validarEmail = (email) => {
  if (!email) return false;
  
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar CPF
 * @param {string} cpf 
 * @returns {boolean}
 */
export const validarCPF = (cpf) => {
  if (!cpf) return false;
  
  const numeros = cpf.replace(/\D/g, '');
  
  if (numeros.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numeros)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(numeros.charAt(i)) * (10 - i);
  }
  
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(numeros.charAt(i)) * (11 - i);
  }
  
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(numeros.charAt(10))) return false;
  
  return true;
};

/**
 * Calcular idade
 * @param {string|Date} dataNascimento 
 * @returns {number}
 */
export const calcularIdade = (dataNascimento) => {
  if (!dataNascimento) return 0;
  
  const nascimento = new Date(dataNascimento);
  const hoje = new Date();
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
};

/**
 * Obter diferença entre datas em dias
 * @param {string|Date} data1 
 * @param {string|Date} data2 
 * @returns {number}
 */
export const diferencaEmDias = (data1, data2) => {
  const d1 = new Date(data1);
  const d2 = new Date(data2);
  
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export default {
  formatarData,
  formatarDataHora,
  formatarHora,
  formatarParaInput,
  formatarTelefone,
  formatarCPF,
  formatarCEP,
  formatarMoeda,
  formatarNumero,
  capitalizar,
  capitalizarPalavras,
  truncarTexto,
  removerAcentos,
  gerarSlug,
  validarEmail,
  validarCPF,
  calcularIdade,
  diferencaEmDias
};

