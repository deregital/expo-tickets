'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { login } from './actions';
import { useActionState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className='flex h-full items-center justify-center flex-col gap-4'>
      <h1 className='text-xl font-bold text-center'>
        Iniciar sesión para administradores
      </h1>
      <form
        action={action}
        className='flex flex-col gap-4 w-full max-w-md p-8 border-2 border-MiExpo_black/50 rounded-lg mx-4'
      >
        <Input
          type='email'
          name='mail'
          placeholder='Mail'
          className='w-full'
          required
        />
        <Input
          type='password'
          name='password'
          placeholder='Código de Acceso'
          className='w-full'
          required
        />
        <Button
          variant={'default'}
          className='cursor-pointer'
          type='submit'
          disabled={isPending}
        >
          Iniciar sesión
        </Button>
        {state?.error && (
          <p className='text-red-500 font-bold text-sm'>{state.error}</p>
        )}
      </form>
    </div>
  );
}
