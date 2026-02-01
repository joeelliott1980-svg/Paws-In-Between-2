import React from 'react';
import type { Analysis } from '../types';
import { CatIcon, DogIcon, HeartIcon, HomeIcon, InfoIcon, MoodIcon, TagIcon } from './icons';
import { ShareButtons } from './ShareButtons';

interface AnalysisResultProps {
  analysis: Analysis | null;
  isLoading: boolean;
  error: string | null;
}

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
    <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-200">
      {icon}
      {title}
    </h3>
    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
      {children}
    </div>
  </div>
);

const InfoRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="font-medium text-slate-500 dark:text-slate-400">{label}:</span>
    <span className="text-right">{value || 'N/A'}</span>
  </div>
);

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl h-full min-h-[300px]">
        <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 dark:text-slate-400">AI is thinking...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl h-full">
        <h3 className="font-bold text-red-700 dark:text-red-200 mb-2">Analysis Failed</h3>
        <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-100 dark:bg-slate-800/50 rounded-xl h-full min-h-[300px]">
        <CatIcon className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
        <h3 className="font-bold text-slate-600 dark:text-slate-300">Pet Profile</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500">Your pet's analysis will appear here.</p>
      </div>
    );
  }

  const { species, breed, estimatedAge, healthNotes, mood, idealHome } = analysis;

  const getSpeciesIcon = (speciesName?: string) => {
    if (!speciesName) return <TagIcon className="w-5 h-5" />;
    const lowerSpecies = speciesName.toLowerCase();
    if (lowerSpecies.includes('cat')) {
      return <CatIcon className="w-5 h-5" />;
    }
    if (lowerSpecies.includes('dog')) {
      return <DogIcon className="w-5 h-5" />;
    }
    return <TagIcon className="w-5 h-5" />;
  };

  const shareText = `Just analyzed my ${species.toLowerCase()} with Pet Pal Locator!
Breed: ${breed}
Est. Age: ${estimatedAge}
Mood: ${mood}
Looking for a sitter with an ideal home: ${idealHome.environment.toLowerCase()}.
#PetPalLocator #PetCare #PetSitter`;


  return (
    <div className="space-y-4">
      <ResultCard title="Pet Profile" icon={getSpeciesIcon(species)}>
        <InfoRow label="Species" value={species} />
        <InfoRow label="Breed" value={breed} />
        <InfoRow label="Est. Age" value={estimatedAge} />
      </ResultCard>

      <ResultCard title="Observations" icon={<InfoIcon className="w-5 h-5"/>}>
        <div className="flex items-start gap-2">
            <HeartIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500 dark:text-slate-400" /> 
            <p><span className="font-medium">Health:</span> {healthNotes}</p>
        </div>
        <div className="flex items-start gap-2">
            <MoodIcon className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-500 dark:text-slate-400" />
            <p><span className="font-medium">Mood:</span> {mood}</p>
        </div>
      </ResultCard>

      <ResultCard title="Ideal Sitter Environment" icon={<HomeIcon className="w-5 h-5"/>}>
         <p className="font-semibold text-slate-600 dark:text-slate-300">Environment:</p>
         <p className="pl-2 pb-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2">{idealHome.environment}</p>
         
         <p className="font-semibold text-slate-600 dark:text-slate-300">Family Type:</p>
         <p className="pl-2 pb-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2">{idealHome.family}</p>

         <p className="font-semibold text-slate-600 dark:text-slate-300">Other Pets:</p>
         <p className="pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2">{idealHome.otherPets}</p>
      </ResultCard>

      <ShareButtons title="Share This Profile" textToShare={shareText} />
    </div>
  );
};