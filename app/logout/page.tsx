import { logoutAction } from "./actions";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  return (
    <form action={logoutAction} className="p-6">
      <Button type="submit">
        Logout
      </Button>
    </form>
  );
}