'use client';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BuyTicketsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function BuyTicketsModal({ isOpen, onClose }: BuyTicketsModalProps) {
  const router = useRouter();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden asChild>
        <DialogTitle>Compra de entradas</DialogTitle>
      </VisuallyHidden>
      <DialogContent className='bg-[#F9F9F9] rounded-[20px] p-8 max-w-md mx-auto text-center border-none'>
        {/* Ícono de check */}
        <div className='flex justify-center mb-8'>
          <div className='w-24 h-24 rounded-full border-4 border-black flex items-center justify-center'>
            <Check className='w-12 h-12 text-black stroke-[3]' />
          </div>
        </div>

        {/* Mensaje de éxito */}
        <h2 className='text-2xl font-bold text-black mb-2'>
          Compra realizada con éxito.
        </h2>

        {/* Instrucciones */}
        <p className='text-lg text-black mb-4'>
          Podés visualizar tu entrada en tu mail o descargarla clickeando{' '}
          <button
            onClick={() => router.push('/tickets')}
            className='text-black font-bold underline hover:cursor-pointer bg-transparent border-none p-0 m-0'
          >
            ACÁ
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default BuyTicketsModal;
