import React from "react";

type RecommendationLike = {
    sub_concept: string;
    classification?: string;
    easy?: unknown[];
    medium?: unknown[];
    hard?: unknown[];
    practice_questions?: {
        easy?: unknown[];
        medium?: unknown[];
        hard?: unknown[];
    };
};

type RecommendationCardProps = {
    recommendations: RecommendationLike[];
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-100">Recommendations</h3>
            <p className="mt-1 text-sm text-slate-400">
                Practice sets based on your weakest sub-concepts.
            </p>
            <div className="mt-6 space-y-4">
                {recommendations.length === 0 ? (
                    <p className="text-sm text-slate-400">
                        No recommendations yet. Finish a quiz to generate practice sets.
                    </p>
                ) : (
                    recommendations.map((recommendation) => {
                        const practice = recommendation.practice_questions;
                        const easy = recommendation.easy ?? practice?.easy ?? [];
                        const medium = recommendation.medium ?? practice?.medium ?? [];
                        const hard = recommendation.hard ?? practice?.hard ?? [];

                        return (
                            <div
                                key={recommendation.sub_concept}
                                className="rounded-2xl border border-slate-700/60 bg-slate-900/40 px-4 py-4"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-100">
                                        {recommendation.sub_concept}
                                    </p>
                                    {recommendation.classification ? (
                                        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-300">
                                            {recommendation.classification}
                                        </span>
                                    ) : null}
                                </div>
                                <p className="mt-2 text-xs text-slate-400">
                                    Easy: {easy.length} | Medium: {medium.length} | Hard: {hard.length}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default RecommendationCard;
