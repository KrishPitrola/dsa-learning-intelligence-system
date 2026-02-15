import React from "react";

type FeatureCardProps = {
    title: string;
    description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => {
    return (
        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg transition-transform hover:scale-[1.02]">
            <div className="mb-4 h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
            <p className="mt-3 text-sm text-slate-400">{description}</p>
        </div>
    );
};

export default FeatureCard;
