"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { type ComponentType } from "react";

interface DonutChartProps {
  data: { label: string; value: number }[];
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = [
  "hsl(210 20% 98%)",
  "hsl(221.2 83.2% 53.3%)",
  "hsl(43 95.2% 53.9%)",
  "hsl(262 83.3% 57.8%)",
  "hsl(172 47.1% 53.3%)",
  "hsl(25 95.4% 55.5%)",
  "hsl(0 84.5% 60.2%)",
  "hsl(210 40% 40%)",
  "hsl(220 13% 53%)",
];

export function AppDonutChart({
  data,
  colors = DEFAULT_COLORS,
}: DonutChartProps) {
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">Belum ada data.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={45}
          outerRadius={75}
          paddingAngle={2}
        >
          {data.map((_entry, i) => (
            <Cell key={`cell-${i}`} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Legend layout="horizontal" verticalAlign="bottom" iconSize={8} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const AppDonutChartSkeleton: ComponentType = () => (
  <div className="h-[200px] w-full animate-pulse rounded-md bg-muted" />
);
