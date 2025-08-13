import { trpc } from '@/server/trpc/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function TicketListPage() {
  const cookieStore = await cookies();
  const mail = cookieStore.get('mail');
  const password = cookieStore.get('password');

  if (!mail || !password) {
    redirect('/admin/login');
  }

  const { event } = await trpc.expoTicketsProducerLogin.getEventTickets({
    mail: mail.value,
    password: password.value,
  });

  return <pre>{JSON.stringify(event, null, 2)}</pre>;
}
