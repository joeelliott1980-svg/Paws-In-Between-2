import React from 'react';
import { LoadingCatIcon } from './icons';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-300">
      <div className="animate-pulse">
        <LoadingCatIcon className="w-48 h-48 text-indigo-500 dark:text-indigo-400" />
      </div>
      <h1 className="text-2xl font-bold mt-6 tracking-wider">
        Pet Pal Locator
      </h1>
      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">By Elliott Media Group</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Finding animals a temporary home...</p>
    </div>
  );
};