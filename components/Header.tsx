import React from 'react';
import { PawPrintIcon } from './icons';

interface HeaderProps {
    onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const isClickable = !!onLogoClick;

  const content = (
    <div className="flex items-center gap-3">
      <PawPrintIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
      <div>
        <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
          Pet Pal Locator
        </h1>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 -mt-1 font-medium">By Elliott Media Group</p>
      </div>
    </div>
  );

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-md sticky top-0 z-10">
      <div className="container mx-auto max-w-4xl px-4 py-4">
        {isClickable ? (
          <button
            onClick={onLogoClick}
            className="transition-opacity hover:opacity-80"
            aria-label="Go to homepage"
          >
            {content}
          </button>
        ) : (
          content
        )}
      </div>
    </header>
  );
};