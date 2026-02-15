import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import BarChartCard from "../components/BarChartCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import RadarChartCard from "../components/RadarChartCard";
import RecommendationCard from "../components/RecommendationCard";
import WeakAreasCard from "../components/WeakAreasCard";
import { fetchAnalytics } from "../services/api";
import type { AnalyticsResponse } from "../types/analytics";

type AnalyticsResult = AnalyticsResponse | { message: string };

const DashboardPage: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsResult | null>(null);
    const [loading, setLoading] = useState(true);

    const userId = useMemo(() => localStorage.getItem("dsa_user_id")?.trim() ?? "", []);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const loadAnalytics = async () => {
            const data = await fetchAnalytics(userId);
            setAnalytics(data as AnalyticsResult);
            setLoading(false);
        };

        void loadAnalytics();
    }, [userId]);

    const isAnalyticsReady =
        analytics !== null && "overall_mastery" in analytics && "weak_areas" in analytics;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />
            <main className="mx-auto w-full max-w-7xl px-6 py-20">
                <div className="flex flex-col gap-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                        Analytics Dashboard
                    </p>
                    <h1 className="text-3xl font-semibold text-slate-100">Mastery Overview</h1>
                    <p className="text-slate-400">
                        Review your performance and focus the next session.
                    </p>
                </div>

                {!userId ? (
                    <div className="mt-8 rounded-2xl bg-slate-800 p-6 shadow-lg">
                        <p className="text-slate-300">
                            No user name found. Start a quiz to generate analytics.
                        </p>
                        <Link
                            to="/quiz"
                            className="mt-4 inline-flex rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            Start Assessment
                        </Link>
                    </div>
                ) : null}

                {loading ? (
                    <div className="mt-8 rounded-2xl bg-slate-800 p-6 shadow-lg">
                        <p className="text-slate-400">Loading analytics...</p>
                    </div>
                ) : null}

                {analytics && "message" in analytics ? (
                    <div className="mt-8 rounded-2xl bg-slate-800 p-6 shadow-lg">
                        <p className="text-slate-400">{analytics.message}</p>
                    </div>
                ) : null}

                {isAnalyticsReady ? (
                    <div className="mt-10 grid gap-6">
                        <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
                            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                                Overall Mastery
                            </p>
                            <p className="mt-3 text-4xl font-semibold text-slate-100">
                                {analytics.overall_mastery.toFixed(2)}%
                            </p>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
                            <RadarChartCard
                                title="Concept Mastery"
                                subtitle="Balanced view across all concepts"
                                conceptMastery={analytics.concept_mastery}
                            />
                            <BarChartCard
                                title="Sub-Concept Mastery"
                                subtitle="Sorted by mastery score"
                                subconceptMastery={analytics.subconcept_mastery}
                            />
                        </div>

                        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)]">
                            <WeakAreasCard weakAreas={analytics.weak_areas} />
                            <RecommendationCard recommendations={analytics.recommendations ?? []} />
                        </div>
                    </div>
                ) : null}
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
