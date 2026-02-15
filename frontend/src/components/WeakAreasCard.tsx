import React from "react";

import type { WeakArea } from "../types/analytics";

type WeakAreasCardProps = {
    weakAreas: WeakArea[];
};

const statusStyles: Record<WeakArea["status"], string> = {
    Critical: "bg-red-500/20 text-red-300 border-red-500/40",
    Weak: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    Moderate: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    Strong: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
};

const WeakAreasCard: React.FC<WeakAreasCardProps> = ({ weakAreas }) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100">Weak Areas</h3>
            <p className="mt-1 text-sm text-slate-400">
                Focus on the concepts with the lowest mastery scores.
            </p>
            <div className="mt-6 space-y-3">
                {weakAreas.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No weak areas detected. Great work staying consistent.
                    </p>
                ) : (
                    weakAreas.map((area) => (
                        <div
                            key={area.sub_concept}
                            className="flex items-center justify-between rounded-2xl border border-slate-700/60 bg-slate-900/40 px-4 py-3"
                        >
                            <div>
                                <p className="text-sm font-semibold text-slate-100">
                                    {area.sub_concept}
                                </p>
                                <p className="text-xs text-slate-400">
                                    Mastery: {area.mastery_score.toFixed(1)}%
                                </p>
                            </div>
                            <span
                                className={`rounded-full border px-3 py-1 text-xs ${statusStyles[area.status]}`}
                            >
                                {area.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WeakAreasCard;
