import { Navbar } from "./navbar";
import { UserMenu } from "./user-menu";

interface AdminPanelProps {
  children: React.ReactNode;
}

export function AdminPanel({children}:AdminPanelProps) {

  return (
    <div className="relative h-screen min-h-screen w-full overflow-hidden lg:grid lg:grid-cols-[280px_1fr]">
      <div className="border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <Navbar />
      </div>
      <div className="flex flex-col relative">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <div className="flex items-center gap-4 ml-auto absolute left-6 lg:static">
            <UserMenu />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
