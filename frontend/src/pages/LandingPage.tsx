import React from "react";
import { Link } from "react-router-dom";

import BarChartCard from "../components/BarChartCard";
import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RadarChartCard from "../components/RadarChartCard";

const previewConceptMastery = {
    Arrays: { status: "Evaluated", mastery_score: 82 },
    Graphs: { status: "Evaluated", mastery_score: 64 },
    DP: { status: "Evaluated", mastery_score: 58 },
    Trees: { status: "Evaluated", mastery_score: 75 },
};

const previewSubconceptMastery = {
    "Two Pointers": { status: "Evaluated", mastery_score: 42 },
    "Binary Search": { status: "Evaluated", mastery_score: 55 },
    "Graph BFS": { status: "Evaluated", mastery_score: 68 },
    "DP Tabulation": { status: "Evaluated", mastery_score: 72 },
};

const features = [
    {
        title: "Intelligent Scoring",
        description:
            "Blend accuracy, difficulty, time, and consistency into a single mastery signal.",
    },
    {
        title: "Performance Analytics",
        description:
            "Track concept mastery with visual breakdowns and progress insights.",
    },
    {
        title: "Adaptive Recommendations",
        description:
            "Get targeted practice sets that close gaps faster and build confidence.",
    },
];

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />

            <section className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
                    <div>
                        <p className="inline-flex rounded-full border border-slate-700 px-4 py-2 text-xs text-slate-400">
                            Weighted scoring for mastery growth
                        </p>
                        <h1 className="mt-6 text-5xl font-bold leading-tight">
                            Diagnose Your DSA Weaknesses with Precision
                        </h1>
                        <p className="mt-6 text-lg text-slate-400">
                            Our scoring engine blends accuracy, difficulty, time, and consistency
                            to surface the exact gaps holding you back.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/quiz"
                                className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                            >
                                Start Assessment
                            </Link>
                            <Link
                                to="/dashboard"
                                className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-transform hover:scale-[1.02]"
                            >
                                View Dashboard
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Weekly mastery
                                </p>
                                <p className="mt-2 text-3xl font-semibold">73%</p>
                            </div>
                            <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
                                +12% vs last week
                            </span>
                        </div>
                        <div className="mt-6 space-y-4">
                            <div>
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span>Arrays</span>
                                    <span>78%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-700">
                                    <div className="h-2 w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span>Graphs</span>
                                    <span>61%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-700">
                                    <div className="h-2 w-3/5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between text-sm text-slate-300">
                                    <span>Dynamic Programming</span>
                                    <span>54%</span>
                                </div>
                                <div className="mt-2 h-2 rounded-full bg-slate-700">
                                    <div className="h-2 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="mb-10 flex flex-col gap-3">
                    <p className="text-sm text-slate-400">Features</p>
                    <h2 className="text-3xl font-semibold">Built for mastery clarity</h2>
                    <p className="text-lg text-slate-400">
                        A focused suite of analytics and recommendations designed for serious
                        DSA improvement.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {features.map((feature) => (
                        <FeatureCard
                            key={feature.title}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
                    <div className="grid gap-6">
                        <RadarChartCard
                            title="Concept radar preview"
                            subtitle="Highlights strength across concepts"
                            conceptMastery={previewConceptMastery}
                        />
                        <BarChartCard
                            title="Sub-concept mastery preview"
                            subtitle="Spot weaknesses instantly"
                            subconceptMastery={previewSubconceptMastery}
                        />
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">Visual previews</p>
                        <h2 className="mt-3 text-3xl font-semibold">
                            Understand your performance at a glance
                        </h2>
                        <ul className="mt-6 space-y-4 text-lg text-slate-400">
                            <li>See mastery patterns across every concept.</li>
                            <li>Spot the weakest sub-concepts automatically.</li>
                            <li>Track progress with consistent benchmarks.</li>
                        </ul>
                        <div className="mt-8">
                            <Link
                                to="/dashboard"
                                className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-100 transition-transform hover:scale-[1.02]"
                            >
                                Explore analytics
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="mb-10">
                    <p className="text-sm text-slate-400">How it works</p>
                    <h2 className="mt-2 text-3xl font-semibold">Three simple steps</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {[
                        {
                            title: "Take the quiz",
                            description:
                                "Answer a short assessment to capture your current mastery.",
                        },
                        {
                            title: "Review analytics",
                            description:
                                "We score your performance across every key concept.",
                        },
                        {
                            title: "Practice smarter",
                            description:
                                "Receive targeted recommendations to close the gaps.",
                        },
                    ].map((step, index) => (
                        <div
                            key={step.title}
                            className="rounded-2xl bg-slate-800 p-6 shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-blue-400">
                                {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-100">
                                {step.title}
                            </h3>
                            <p className="mt-3 text-sm text-slate-400">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-6 pb-24">
                <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 p-10 shadow-lg">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-sm text-blue-100">Ready to get started?</p>
                            <h2 className="mt-2 text-3xl font-semibold text-white">
                                Turn practice into mastery
                            </h2>
                            <p className="mt-3 text-sm text-blue-100">
                                Start your assessment and unlock the next level of insights.
                            </p>
                        </div>
                        <Link
                            to="/quiz"
                            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            Start assessment
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
