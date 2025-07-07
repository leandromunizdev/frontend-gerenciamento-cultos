/**
 * Utilitários para máscaras de input
 */

/**
 * Máscara para telefone brasileiro
 * Formatos: (11) 99999-9999 ou (11) 9999-9999
 */
export const phoneMask = (value) => {
    if (!value) return '';

    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara baseada no tamanho
    if (numbers.length <= 10) {
        // Telefone fixo: (11) 9999-9999
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
    } else {
        // Celular: (11) 99999-9999
        return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .substring(0, 15); // Limita o tamanho
    }
};

/**
 * Máscara para CPF
 * Formato: 999.999.999-99
 */
export const cpfMask = (value) => {
    if (!value) return '';

    const numbers = value.replace(/\D/g, '');

    return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .substring(0, 14);
};

/**
 * Máscara para CEP
 * Formato: 99999-999
 */
export const cepMask = (value) => {
    if (!value) return '';

    const numbers = value.replace(/\D/g, '');

    return numbers
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 9);
};

/**
 * Remove máscara deixando apenas números
 */
export const removeMask = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '');
};

/**
 * Valida telefone brasileiro
 */
export const validatePhone = (phone) => {
    const numbers = removeMask(phone);
    return numbers.length >= 10 && numbers.length <= 11;
};

/**
 * Valida CPF
 */
export const validateCPF = (cpf) => {
    const numbers = removeMask(cpf);

    if (numbers.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numbers)) return false;

    // Validação do primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(numbers.charAt(i)) * (10 - i);
    }
    let remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(9))) return false;

    // Validação do segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numbers.charAt(i)) * (11 - i);
    }
    remainder = 11 - (sum % 11);
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.charAt(10))) return false;

    return true;
};

/**
 * Valida CEP
 */
export const validateCEP = (cep) => {
    const numbers = removeMask(cep);
    return numbers.length === 8;
};

