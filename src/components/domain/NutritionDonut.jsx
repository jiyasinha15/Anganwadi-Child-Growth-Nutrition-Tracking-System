import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const SEGMENTS = [
  { key: "complete", label: "Up to date", color: "#0b5d46" },
  { key: "stale", label: "Record is old", color: "#d9a441" },
  { key: "missing", label: "No record", color: "#cdcabb" },
];

// counts: { complete, stale, missing }. Status is always also written out in the legend, never colour alone.
export default function NutritionDonut({ counts, total }) {
  const data = SEGMENTS.map((s) => ({ ...s, value: counts[s.key] ?? 0 })).filter((d) => d.value > 0);
  const pct = total ? Math.round(((counts.complete ?? 0) / total) * 100) : 0;
  return (
    <div className="donut">
      <div className="donut-chart" role="img" aria-label={`${pct}% of children have an up-to-date nutrition record`}>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={data} dataKey="value" innerRadius={48} outerRadius={68} paddingAngle={data.length > 1 ? 3 : 0} stroke="none" animationDuration={900} startAngle={90} endAngle={-270}>
              {data.map((d) => <Cell key={d.key} fill={d.color} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-centre"><b>{pct}%</b><span>covered</span></div>
      </div>
      <ul className="donut-legend">
        {SEGMENTS.map((s) => <li key={s.key}><i style={{ background: s.color }} aria-hidden="true" /><span>{s.label}</span><b>{counts[s.key] ?? 0}</b></li>)}
      </ul>
    </div>
  );
}
