import React from 'react';
import { UsersIcon } from './icons';

interface HomePageProps {
  onFindSitter: () => void;
  onBecomeHost: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onFindSitter, onBecomeHost }) => {
  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
      <img 
        src="https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?q=80&w=880&auto=format&fit=crop" 
        alt="A cute cat with sunglasses" 
        className="w-48 h-48 mx-auto rounded-full object-cover shadow-2xl mb-8 ring-4 ring-indigo-200 dark:ring-indigo-500/50"
      />
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-4">
        The Perfect Stay for Your Best Pal
      </h1>
      <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-400 mb-10">
        Whether you're looking for a loving sitter or want to offer your home, Pet Pal Locator connects you with the perfect match.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={onFindSitter}
          className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-4 px-8 rounded-lg shadow-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 transform hover:scale-105"
        >
          Find a Pet Sitter
        </button>
        <button
          onClick={onBecomeHost}
          className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold py-4 px-8 rounded-lg shadow-lg text-lg hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-600 transition-all duration-300 transform hover:scale-105"
        >
            <UsersIcon className="w-6 h-6" />
          Become a Host
        </button>
      </div>
    </div>
  );
};
