"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

interface NavLinkProps {
  href: string;
  currentPath: string;
  children: React.ReactNode;
}

export function Navbar(): JSX.Element {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center px-6">
        <Button>
          <span className="flex items-center gap-2 font-semibold">Cardquest-Admin</span>
        </Button>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-4 text-sm font-medium">
          <NavLink href="/" currentPath={pathname}>Reportes</NavLink>
          <NavLink href="/cards" currentPath={pathname}>Crear Cartas</NavLink>
          <NavLink href="/roles" currentPath={pathname}>Administrar roles</NavLink>
          <NavLink href="/ban" currentPath={pathname}>Banear usuarios</NavLink>
        </nav>
      </div>
    </div>
  );
}

function NavLink({ href, currentPath, children }: NavLinkProps): JSX.Element {
  const isActive = href === currentPath;

  return (
    <Link href={href}>
      <span className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 cursor-pointer ${isActive ? "text-black dark:text-white bg-neutral-200 " : "text-muted-foreground"}`}>
        {children}
      </span>
    </Link>
  );
}
