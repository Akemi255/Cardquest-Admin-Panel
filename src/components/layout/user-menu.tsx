import { UserButton } from "@clerk/nextjs";

export function UserMenu() {
  return (
   <UserButton afterSignOutUrl="/sign-in"/>
  );
}
