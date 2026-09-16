import Sidebar from "@/components/Sidebar";

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:flex">
      <Sidebar />
      <main className="p-5 md:w-3/4 xl:w-4/5">{children}</main>
    </div>
  );
}
