import { fetchClient } from '@/server/fetchClient';

interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: 'USER' | 'ADMIN' | 'FORM' | 'TICKETS';
    isGlobalFilterActive: boolean;
    fcmToken: string[];
    created_at: string;
    updated_at: string;
  };
  backendTokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

interface TokenInfo {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenInfo | null = null;

export async function getAuthToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  return await login();
}

async function login(): Promise<string> {
  const username = process.env.EXPO_TICKETS_USERNAME;
  const password = process.env.EXPO_TICKETS_PASSWORD;

  if (!username || !password) {
    throw new Error('Credenciales de autenticación no configuradas');
  }

  const { data, error } = await fetchClient.POST('/auth/login', {
    body: {
      username,
      password,
    },
  });

  if (error) {
    console.error('Error al autenticar:', error);
    throw new Error(`Error de autenticación: ${error.message}`);
  }

  const response = data as LoginResponse;
  const token = response.backendTokens.accessToken;

  tokenCache = {
    token,
    expiresAt: response.backendTokens.expiresIn,
  };

  return token;
}
