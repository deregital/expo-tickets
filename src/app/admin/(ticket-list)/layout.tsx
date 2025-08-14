import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get('loggedIn');
  const loggedInDate = cookieStore.get('loggedInDate');

  if (
    loggedInDate &&
    new Date(loggedInDate.value) < new Date(Date.now() - 1000 * 60 * 60 * 24)
  ) {
    cookieStore.delete('mail');
    cookieStore.delete('loggedInDate');
    cookieStore.delete('password');
    cookieStore.delete('loggedIn');
    redirect('/admin/login');
  }

  if (!session) {
    redirect('/admin/login');
  }

  return children;
}
