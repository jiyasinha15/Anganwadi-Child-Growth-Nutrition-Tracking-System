import AppShell from "./shell/AppShell";
import { ActionProvider } from "./forms/ActionHost";

export default function WorkerLayout() {
  return <ActionProvider><AppShell role="worker" /></ActionProvider>;
}
