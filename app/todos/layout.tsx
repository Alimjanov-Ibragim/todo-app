export default function TodosLayout({
  children,
  sidebar
}: {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}) {
  return (
    <div className=" h-full min-h-screen grid grid-cols-4 gap-[30px]">
      {sidebar && <aside className="col-span-1">{sidebar}</aside>}
      <main className="col-span-3">{children}</main>
    </div>
  );
}
