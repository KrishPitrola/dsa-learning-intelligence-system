import React from "react";
import { Link, NavLink } from "react-router-dom";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? "text-slate-100" : "text-slate-300 hover:text-slate-100"
    }`;

const Navbar: React.FC = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-900/80 backdrop-blur">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
                <Link to="/" className="text-lg font-semibold text-slate-100">
                    DSA Intelligence
                </Link>
                <nav className="hidden items-center gap-6 md:flex">
                    <NavLink to="/" end className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/quiz" className={navLinkClass}>
                        Quiz
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkClass}>
                        Dashboard
                    </NavLink>
                </nav>
                <Link
                    to="/quiz"
                    className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
                >
                    Start Assessment
                </Link>
            </div>
        </header>
    );
};

export default Navbar;
