import React from 'react';
import { FacebookIcon, TwitterIcon } from './icons';

interface ShareButtonsProps {
  textToShare: string;
  title: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ textToShare, title }) => {
  const encodedText = encodeURIComponent(textToShare);
  // Using a generic URL as this is a local app without specific shareable links.
  const appUrl = "https://aistudio.google.com/";
  const encodedUrl = encodeURIComponent(appUrl);

  const handleFacebookShare = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  const handleTwitterShare = () => {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
      <h4 className="text-sm font-semibold text-center text-slate-600 dark:text-slate-300 mb-3">{title}</h4>
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={handleTwitterShare}
          aria-label="Share on Twitter"
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
        >
          <TwitterIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleFacebookShare}
          aria-label="Share on Facebook"
          className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
        >
          <FacebookIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
