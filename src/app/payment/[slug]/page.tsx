'use client';
import BuyTicketsModal from '@/components/Event/BuyTicketsModal';
import { trpc } from '@/server/trpc/client';
import { useRouter } from 'next/navigation';
import { use } from 'react';

interface PaymentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function PaymentPage({ params }: PaymentPageProps) {
  const { slug } = use(params);
  const { data: ticketGroup, isLoading } =
    trpc.ticketGroup.getPdf.useQuery(slug);
  const router = useRouter();
  return (
    <div>
      {isLoading && (
        <div className='flex justify-center items-center h-screen'>
          Loading...
        </div>
      )}
      {ticketGroup?.pdfs && (
        <BuyTicketsModal
          pdfs={ticketGroup?.pdfs}
          isOpen={true}
          key={slug}
          onClose={() => router.push(`${process.env.NEXT_PUBLIC_APP_URL}`)}
        />
      )}
    </div>
  );
}
