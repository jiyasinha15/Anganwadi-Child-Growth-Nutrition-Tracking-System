import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { fmtShort } from "../../lib/dates";

export const METRICS = {
  height: { label: "Height", unit: "cm" },
  weight: { label: "Weight", unit: "kg" },
  bmi: { label: "BMI", unit: "" },
};
const COLORS = ["#0b5d46", "#1d5fb8", "#a65f00", "#6b3fb5"];

function Tip({ active, payload, label, unit }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <b>{label}</b>
      {payload.map((p) => <div key={p.dataKey}><i style={{ background: p.color }} />{p.name}: <b>{p.value}{unit ? ` ${unit}` : ""}</b></div>)}
    </div>
  );
}

// `data` rows need { date|label, [metric]: number }. Pass `lines` to draw several series.
export default function GrowthChart({ data, metric = "weight", lines, xKey = "date", height = 280 }) {
  const m = METRICS[metric] ?? METRICS.weight;
  const series = lines ?? [{ key: metric, name: m.label }];
  const rows = useMemo(() => data.map((d) => ({ ...d, label: xKey === "date" ? fmtShort(d.date) : d[xKey] })), [data, xKey]);
  return (
    <div className="chart" role="img" aria-label={`${series.map((s) => s.name).join(" and ")} over time. ${rows.length} measurements.`}>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={rows} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="#e3e2da" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5a6660" }} tickLine={false} axisLine={{ stroke: "#cfcdc2" }} />
          <YAxis tick={{ fontSize: 12, fill: "#5a6660" }} tickLine={false} axisLine={false} domain={["auto", "auto"]} width={44} />
          <Tooltip content={<Tip unit={m.unit} />} />
          {series.length > 1 && <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} isAnimationActive animationDuration={1000} animationEasing="ease-out" />)}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
