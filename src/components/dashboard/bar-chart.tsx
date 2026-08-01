"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataItem {
  label: string;
  value: number;
  [key: string]: unknown;
}

export interface ChartDataBar {
  label: string;
  value: number;
}

interface BarChartCardProps {
  data: ChartDataItem[];
  dataKey?: string;
  nameKey?: string;
  color?: string;
  className?: string;
}

const COLORS = [
  "hsl(222.2 47.4% 11.2%)",
  "hsl(221.2 83.2% 53.3%)",
  "hsl(220 13% 53%)",
  "hsl(210 20% 98%)",
];

export function AppSimpleBarChart({
  data,
  dataKey = "value",
  nameKey = "label",
  color = COLORS[1],
}: BarChartCardProps) {
  if (!data.length) {
    return <p className="text-sm text-muted-foreground">Belum ada data.</p>;
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={nameKey} tickLine={false} tickMargin={8} />
        <YAxis width={30} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
          }}
        />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}
