import OrderSidebar from "@/components/order/OrderSidebar";
import OrderSummary from "@/components/order/OrderSummary";
import TableSessionGate from "@/components/order/TableSessionGate";
import { getCurrentTableSession } from "@/actions/table-session-actions";

export default async function RootLayout({children}:Readonly<{children:React.ReactNode}>) {

  const tableSession = await getCurrentTableSession();

  if (!tableSession) {
    return <TableSessionGate />;
  }

  return (

    <>
    <div className="md:flex">
        <OrderSidebar tableSession={tableSession}/>

        <main className="md:flex-1 md:h-screen md:overflow-y-scroll p-5">
            {children}
        </main>

        <OrderSummary/>


    </div>
    </>
  );

}