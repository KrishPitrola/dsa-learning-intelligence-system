import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { fetchQuiz, submitQuiz } from "../services/api";

type QuizQuestion = {
    question_id: string;
    title: string;
    options: string[];
    concept: string;
    sub_concept: string;
    difficulty: number;
    expected_time: number;
};

type StoredAnswer = {
    question_id: string;
    selected_option: string;
    time_taken: number;
};

const QuizPage: React.FC = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [answers, setAnswers] = useState<StoredAnswer[]>([]);
    const [startTime, setStartTime] = useState<number>(() => Date.now());
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    const userId = useMemo(() => localStorage.getItem("dsa_user_id")?.trim() ?? "", []);

    useEffect(() => {
        if (!userId) {
            navigate("/");
            return;
        }

        const loadQuiz = async () => {
            const data = await fetchQuiz(userId);
            setQuestions(data as QuizQuestion[]);
            setCurrentIndex(0);
            setSelectedOption("");
            setAnswers([]);
            setStartTime(Date.now());
            setElapsedSeconds(0);
        };

        void loadQuiz();
    }, [navigate, userId]);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    const currentQuestion = questions[currentIndex];

    const handleNext = async () => {
        if (!currentQuestion || !selectedOption) {
            return;
        }

        const timeTaken = Math.max(1, Math.round((Date.now() - startTime) / 1000));
        const nextAnswer: StoredAnswer = {
            question_id: currentQuestion.question_id,
            selected_option: selectedOption,
            time_taken: timeTaken,
        };

        const updatedAnswers = [...answers, nextAnswer];
        setAnswers(updatedAnswers);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex((prev) => prev + 1);
            setSelectedOption("");
            setStartTime(Date.now());
            setElapsedSeconds(0);
            return;
        }

        await submitQuiz({ user_id: userId, responses: updatedAnswers });
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <Navbar />
            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-20">
                {!currentQuestion ? (
                    <div className="rounded-2xl bg-slate-800 p-6 shadow-lg">
                        <p className="text-slate-400">Loading quiz...</p>
                    </div>
                ) : (
                    <div className="rounded-2xl bg-slate-800 p-8 shadow-lg">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    Question {currentIndex + 1} of {questions.length}
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-100">
                                    {currentQuestion.title}
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    {currentQuestion.concept} / {currentQuestion.sub_concept}
                                </p>
                            </div>
                            <div className="rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200">
                                Timer: {elapsedSeconds}s
                            </div>
                        </div>

                        <div className="mt-6 grid gap-3">
                            {currentQuestion.options.map((option) => {
                                const isSelected = selectedOption === option;
                                return (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => setSelectedOption(option)}
                                        className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${isSelected
                                                ? "border-blue-500 bg-slate-900/70 text-slate-100"
                                                : "border-slate-700 bg-slate-900/40 text-slate-300 hover:border-slate-500"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                        >
                            {currentIndex === questions.length - 1 ? "Submit Quiz" : "Next"}
                        </button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default QuizPage;
