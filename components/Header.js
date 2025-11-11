import React from 'react';
import { HeaderIcon, SunIcon, MoonIcon } from './icons.js';

export const Header = ({ theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        React.createElement('header', { className: "bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-10" },
            React.createElement('div', { className: "container mx-auto px-4 py-3 flex items-center justify-between" },
                React.createElement('div', { className: "flex items-center" },
                    React.createElement(HeaderIcon, { className: "w-8 h-8 text-indigo-600 dark:text-indigo-500" }),
                    React.createElement('h1', { className: "text-xl font-bold text-slate-900 dark:text-slate-100 ml-3" },
                        "AI Documentation Studio"
                    )
                ),
                React.createElement('button',
                    {
                        onClick: toggleTheme,
                        className: "p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors",
                        "aria-label": "Toggle theme"
                    },
                    theme === 'light' ? (
                        React.createElement(MoonIcon, { className: "w-5 h-5 text-slate-600" })
                    ) : (
                        React.createElement(SunIcon, { className: "w-5 h-5 text-yellow-400" })
                    )
                )
            )
        )
    );
};
