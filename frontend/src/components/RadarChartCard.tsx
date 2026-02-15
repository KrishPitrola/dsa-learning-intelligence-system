import React from "react";

import RadarChartComponent from "./RadarChartComponent";
import type { ConceptMastery } from "../types/analytics";

type RadarChartCardProps = {
    title: string;
    subtitle?: string;
    conceptMastery: Record<string, ConceptMastery>;
};

const RadarChartCard: React.FC<RadarChartCardProps> = ({
    title,
    subtitle,
    conceptMastery,
}) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
                    {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
                </div>
                <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                    Live
                </span>
            </div>
            <div className="mt-6">
                <RadarChartComponent conceptMastery={conceptMastery} />
            </div>
        </div>
    );
};

export default RadarChartCard;
