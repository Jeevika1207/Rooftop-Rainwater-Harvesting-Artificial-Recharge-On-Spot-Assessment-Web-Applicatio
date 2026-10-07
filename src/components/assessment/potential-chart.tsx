
"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
  RadarChart,
  Radar
} from "recharts";

interface PotentialChartProps {
    harvested: number;
    demand: number;
    stored: number;
    recharged: number;
}

export function PotentialChart({ harvested, demand, stored, recharged}: PotentialChartProps) {
  const data = [
    { name: "Harvested", value: harvested },
    { name: "Demand", value: demand },
    { name: "Stored", value: stored },
    { name: "Recharged", value: recharged },
  ]

  return (
    <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid gridType="circle" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'hsl(var(--foreground))' }} />
                <Tooltip
                    contentStyle={{
                        background: "hsl(var(--background))",
                        borderColor: "hsl(var(--border))",
                    }}
                    formatter={(value: number, name: string) => [`${value.toLocaleString()} L`, "Water Volume"]}
                />
                <Legend />
                <Radar name="Water Volume" dataKey="value" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
            </RadarChart>
        </ResponsiveContainer>
    </div>
  )
}
