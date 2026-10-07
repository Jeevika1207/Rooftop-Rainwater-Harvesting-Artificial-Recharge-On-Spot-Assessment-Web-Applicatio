"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatINR } from "@/lib/gis-datasets";

interface CostBenefitChartProps {
    investment: number;
    savings: number;
}

export function CostBenefitChart({ investment, savings }: CostBenefitChartProps) {
    const data = Array.from({ length: 10 }, (_, i) => {
        const year = i + 1;
        return {
            name: `Year ${year}`,
            "Cumulative Savings (₹)": Math.round(savings * year),
            "Initial Investment (₹)": Math.round(investment),
        }
    });

  const formatShortINR = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value}`;
  };

  return (
    <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatShortINR} />
            <Tooltip
                formatter={(value: number) => [formatINR(value), ""]}
                contentStyle={{
                    background: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                }}
            />
            <Legend />
            <Bar dataKey="Initial Investment (₹)" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Cumulative Savings (₹)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    </div>
  )
}
