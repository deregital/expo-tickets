import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ErrorModal({ isOpen, onClose }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <VisuallyHidden asChild>
        <DialogTitle>Error Modal</DialogTitle>
      </VisuallyHidden>
      <DialogContent className='bg-[#F9F9F9] rounded-[20px] p-8 max-w-md mx-auto text-center border-none'>
        {/* Ícono de check */}
        <div className='flex justify-center mb-8'>
          <div className='w-24 h-24 rounded-full border-4 border-black flex items-center justify-center'>
            <X className='w-12 h-12 text-black stroke-[3]' />
          </div>
        </div>
        <h2 className='text-2xl font-bold text-black mb-2'>
          No se pudo realizar la compra.
        </h2>
        <p className='text-lg text-black mb-4'>
          Por favor, revisá los datos que ingresaste y volvé a intentarlo.
        </p>
      </DialogContent>
    </Dialog>
  );
}

export default ErrorModal;
