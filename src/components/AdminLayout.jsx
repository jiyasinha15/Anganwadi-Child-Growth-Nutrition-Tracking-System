import AppShell from "./shell/AppShell";
import { ActionProvider } from "./forms/ActionHost";

export default function AdminLayout() {
  return <ActionProvider><AppShell role="admin" /></ActionProvider>;
}
