import { AdminPanel } from "@/components/layout/admin-panel"
import { OrderTable } from "@/components/reports/order-table"

const page = () => {
  return (
    <>
    <AdminPanel>
     <OrderTable />
    </AdminPanel>
    
    </>
  )
}

export default page