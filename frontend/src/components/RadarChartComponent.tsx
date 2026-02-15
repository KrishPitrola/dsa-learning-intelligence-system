import React from "react";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

type RadarChartProps = {
    conceptMastery: Record<string, { status: string; mastery_score?: number }>;
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

const RadarChartComponent: React.FC<RadarChartProps> = ({ conceptMastery }) => {
    const data = Object.entries(conceptMastery).map(([concept, values]) => ({
        concept,
        mastery:
            values.status === "Evaluated" && typeof values.mastery_score === "number"
                ? values.mastery_score
                : 0,
    }));

    return (
        <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data} outerRadius="70%">
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="concept" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#94a3b8", fontSize: 11 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Radar dataKey="mastery" stroke="#6366f1" fill="#6366f1" fillOpacity={0.22} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChartComponent;
