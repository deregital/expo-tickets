export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className='md:h-[calc(100vh-12vh)] lg:h-[calc(100vh-16vh)] h-[calc(100vh-8vh)] w-full'>
      {children}
    </main>
  );
}
