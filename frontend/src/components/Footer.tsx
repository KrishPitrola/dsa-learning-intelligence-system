import React from "react";

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-800/60 bg-slate-900">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center">
                <span className="text-slate-200">DSA Intelligence</span>
                <span>Built for focused, data-driven learning.</span>
                <span>2026</span>
            </div>
        </footer>
    );
};

export default Footer;
