import { ChildAvatar } from "../ui";
import { ageLabel } from "../../lib/dates";

export default function ChildCell({ child, sub, size = 36 }) {
  return (
    <span className="child-cell">
      <ChildAvatar name={child.name} gender={child.gender} size={size} />
      <span><b>{child.name}</b><small>{sub ?? `${ageLabel(child.dob)} · ${child.gender}`}</small></span>
    </span>
  );
}
