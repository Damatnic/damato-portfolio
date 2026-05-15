"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartPoint {
  date: string;
  pageviews: number;
  clicks: number;
}

export function PublicAnalyticsChart({ data }: { data: ChartPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="pvFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.5} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="clkFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8a29e" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#a8a29e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#292524" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#78716c"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: string) => v.slice(5)}
          />
          <YAxis
            stroke="#78716c"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: "#1c1917",
              border: "1px solid #44403c",
              borderRadius: 6,
              fontSize: 12,
              color: "#f5f5f4",
            }}
            labelStyle={{ color: "#a8a29e" }}
          />
          <Area
            type="monotone"
            dataKey="pageviews"
            stroke="var(--accent)"
            strokeWidth={2}
            fill="url(#pvFill)"
            name="pageviews"
          />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#a8a29e"
            strokeWidth={1.5}
            fill="url(#clkFill)"
            name="link clicks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
