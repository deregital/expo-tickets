'use client';
import ErrorModal from '@/components/Event/ErrorModal';
import { useRouter } from 'next/navigation';

function ErrorPage() {
  const router = useRouter();
  return (
    <ErrorModal
      isOpen={true}
      onClose={() => router.push(`${process.env.NEXT_PUBLIC_APP_URL}`)}
      errorTitle='Error'
      errorMessage='Ha ocurrido un error al procesar el pago'
    />
  );
}

export default ErrorPage;
