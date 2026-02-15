import React from "react";

import BarChartComponent from "./BarChartComponent";
import type { SubConceptMastery } from "../types/analytics";

type BarChartCardProps = {
    title: string;
    subtitle?: string;
    subconceptMastery: Record<string, SubConceptMastery>;
};

const BarChartCard: React.FC<BarChartCardProps> = ({
    title,
    subtitle,
    subconceptMastery,
}) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
            <div>
                <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
                {subtitle ? <p className="text-sm text-slate-400">{subtitle}</p> : null}
            </div>
            <div className="mt-6">
                <BarChartComponent subconceptMastery={subconceptMastery} />
            </div>
        </div>
    );
};

export default BarChartCard;
