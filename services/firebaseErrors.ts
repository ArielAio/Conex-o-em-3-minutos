export interface FriendlyError {
  title: string;
  detail: string;
  domain?: string;
}

const ERROR_MAP: Record<string, string> = {
  'auth/email-already-in-use': 'Este e-mail já está em uso. Entre com ele ou escolha outro.',
  'auth/invalid-email': 'E-mail inválido. Verifique se digitou corretamente.',
  'auth/user-not-found': 'Não encontramos uma conta com este e-mail.',
  'auth/wrong-password': 'Senha incorreta. Tente novamente.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas agora. Aguarde alguns minutos e tente novamente.',
  'auth/network-request-failed': 'Falha de conexão. Confira sua internet e tente de novo.',
  'auth/popup-blocked': 'O navegador bloqueou a janela de login. Libere pop-ups para continuar.',
  'auth/popup-closed-by-user': 'A janela foi fechada antes de concluir. Abra novamente para continuar.',
  'auth/unauthorized-domain': 'O domínio atual não está autorizado no Firebase. Adicione-o em Authentication > Settings > Authorized Domains.',
  'auth/account-exists-with-different-credential': 'Este e-mail já foi usado com outro método de login. Use o método original ou redefina a senha.',
  'auth/operation-not-allowed': 'Este método de login está desativado no Firebase. Ative-o no console para continuar.',
  'auth/internal-error': 'Erro interno do Firebase. Tente novamente em instantes.',
};

export const translateAuthError = (error: any, action: string = 'continuar'): FriendlyError => {
  const code = error?.code || '';
  const detail = ERROR_MAP[code] || 'Não foi possível concluir agora. Tente novamente ou use outra opção.';
  const title = `Erro ao ${action}`;

  if (code === 'auth/unauthorized-domain') {
    const domain = typeof window !== 'undefined' ? window.location.hostname : undefined;
    return {
      title,
      detail,
      domain,
    };
  }

  return { title, detail };
};
