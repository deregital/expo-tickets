'use server';
import { trpc } from '@/server/trpc/server';
import { cookies } from 'next/headers';

export async function login(prevState: unknown, formData: FormData) {
  const cookieStore = await cookies();
  try {
    const response = await trpc.expoTicketsProducerLogin.login({
      mail: formData.get('mail') as string,
      password: formData.get('password') as string,
    });
    if (response.success) {
      cookieStore.set('loggedIn', 'true');
      cookieStore.set('mail', formData.get('mail') as string);
      cookieStore.set('loggedInDate', new Date().toISOString());
      cookieStore.set('password', formData.get('password') as string);
      return { success: true, redirectTo: '/admin' };
    } else {
      return { error: response.message };
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: 'Error desconocido' };
  }
}
