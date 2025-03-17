import { fetchClient } from '@/server/fetchClient';
import { type LoginResponseDto } from 'expo-backend-types';

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

  const response = data as LoginResponseDto;
  const token = response.backendTokens.accessToken;
  fetchClient.use({
    onRequest: ({ request }) => {
      request.headers.set('Authorization', `Bearer ${token}`);
      return request;
    },
  });
  tokenCache = {
    token,
    expiresAt: response.backendTokens.expiresIn,
  };

  return token;
}
