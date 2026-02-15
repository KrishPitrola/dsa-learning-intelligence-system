import React from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type BarChartProps = {
    subconceptMastery: Record<string, any>;
};

type TooltipProps = {
    active?: boolean;
    payload?: Array<{ value?: number }>;
    label?: string;
};

const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200 shadow-lg">
            <p className="text-slate-300">{label}</p>
            <p className="mt-1 font-semibold">{Number(payload[0].value ?? 0).toFixed(1)}%</p>
        </div>
    );
};

const BarChartComponent: React.FC<BarChartProps> = ({ subconceptMastery }) => {
    const data = Object.entries(subconceptMastery)
        .map(([subConcept, values]) => ({
            subConcept,
            mastery:
                values?.status === "Evaluated" && typeof values.mastery_score === "number"
                    ? values.mastery_score
                    : 0,
        }))
        .sort((a, b) => a.mastery - b.mastery);

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ left: 24, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={{ stroke: "#334155" }}
                    />
                    <YAxis
                        type="category"
                        dataKey="subConcept"
                        width={120}
                        tick={{ fill: "#94a3b8", fontSize: 12 }}
                        axisLine={{ stroke: "#334155" }}
                        tickLine={{ stroke: "#334155" }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Bar dataKey="mastery" fill="#3b82f6" radius={[6, 6, 6, 6]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default BarChartComponent;
