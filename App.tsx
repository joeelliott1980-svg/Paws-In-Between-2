import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeImage } from './services/geminiService';
import type { Analysis } from './types';
import { HostFinder } from './components/FamilyFinder';
import { LoadingScreen } from './components/LoadingScreen';
import { HomePage } from './components/HomePage';
import { CheckCircleIcon, UsersIcon } from './components/icons';

type View = 'home' | 'findSitter' | 'becomeHost';

const BecomeAHost: React.FC<{onGoHome: () => void}> = ({ onGoHome }) => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        dailyRate: '40',
        environment: 'House with Yard',
        hasChildren: false,
        hasPets: false,
    });
    const [errors, setErrors] = useState({
        name: '',
        bio: '',
        dailyRate: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        const newErrors = { name: '', bio: '', dailyRate: '' };
        let isValid = true;

        // Name validation
        if (formData.name.trim().length < 3) {
            newErrors.name = 'Host name must be at least 3 characters long.';
            isValid = false;
        } else if (formData.name.length > 50) {
            newErrors.name = 'Host name cannot exceed 50 characters.';
            isValid = false;
        }

        // Bio validation
        if (formData.bio.trim().length < 10) {
            newErrors.bio = 'Bio must be at least 10 characters long.';
            isValid = false;
        } else if (formData.bio.length > 300) {
            newErrors.bio = 'Bio cannot exceed 300 characters.';
            isValid = false;
        }

        // Daily Rate validation
        if (Number(formData.dailyRate) <= 0) {
            newErrors.dailyRate = 'Daily rate must be a positive number.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // In a real app, you'd probably send the data to a server here.
            setSubmitted(true);
        }
    };

    if (submitted) {
        return (
            <div className="text-center py-16 px-4 animate-fade-in bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl">
                 <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">Registration Complete!</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                    Thank you for joining the Pet Pal Locator community. Pet owners in your area can now find your wonderful service!
                </p>
                <button
                    onClick={onGoHome}
                    className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl p-6 md:p-10 animate-fade-in">
             <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">Become a Pet Host</h2>
              <p className="text-slate-500 dark:text-slate-400">Offer your home to a pet in need and earn extra income.</p>
            </div>
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6" noValidate>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Host Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder="e.g., The Smith Family" 
                        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.name ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && <p id="name-error" className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short Bio</label>
                    <textarea 
                        name="bio" 
                        id="bio" 
                        rows={3} 
                        required 
                        value={formData.bio} 
                        onChange={handleChange} 
                        placeholder="Describe your home and experience with pets..." 
                        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.bio ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        aria-invalid={!!errors.bio}
                        aria-describedby={errors.bio ? "bio-error" : undefined}
                    ></textarea>
                    {errors.bio && <p id="bio-error" className="text-red-500 text-xs mt-1">{errors.bio}</p>}
                </div>
                <div>
                    <label htmlFor="dailyRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Daily Rate ($)</label>
                    <input 
                        type="number" 
                        name="dailyRate" 
                        id="dailyRate" 
                        required 
                        value={formData.dailyRate} 
                        onChange={handleChange} 
                        className={`mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${errors.dailyRate ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                        aria-invalid={!!errors.dailyRate}
                        aria-describedby={errors.dailyRate ? "dailyRate-error" : undefined}
                    />
                    {errors.dailyRate && <p id="dailyRate-error" className="text-red-500 text-xs mt-1">{errors.dailyRate}</p>}
                </div>
                 <div>
                    <label htmlFor="environment" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Home Environment</label>
                    <select id="environment" name="environment" value={formData.environment} onChange={handleChange} className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded-md bg-white dark:bg-slate-700 focus:ring-indigo-500 focus:border-indigo-500">
                        <option>House with Yard</option>
                        <option>Quiet Apartment</option>
                        <option>Active Household</option>
                        <option>Farm or Rural Property</option>
                    </select>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center">
                        <input id="hasChildren" name="hasChildren" type="checkbox" checked={formData.hasChildren} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 bg-slate-200 dark:bg-slate-600" />
                        <label htmlFor="hasChildren" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">I have children</label>
                    </div>
                    <div className="flex items-center">
                        <input id="hasPets" name="hasPets" type="checkbox" checked={formData.hasPets} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 bg-slate-200 dark:bg-slate-600" />
                        <label htmlFor="hasPets" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">I have other pets</label>
                    </div>
                </div>
                 <div className="pt-4">
                    <button type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300">
                        <UsersIcon className="w-5 h-5" />
                        Complete Registration
                    </button>
                </div>
            </form>
        </div>
    );
};

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [view, setView] = useState<View>('home');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2000); // Show loading screen for 2 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, []);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const [mimeString, data] = result.split(',');
        if (!mimeString || !data) {
          reject(new Error("Invalid file format"));
          return;
        }
        const mimeType = mimeString.split(':')[1]?.split(';')[0];
        if (!mimeType) {
          reject(new Error("Could not determine file MIME type"));
          return;
        }
        resolve({ base64Data: data, mimeType });
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { base64Data, mimeType } = await fileToBase64(imageFile);
      const resultJsonString = await analyzeImage(base64Data, mimeType);
      
      // Clean up potential markdown formatting from the response
      const cleanedJsonString = resultJsonString.replace(/^```json\s*|```\s*$/g, '');
      
      const result: Analysis = JSON.parse(cleanedJsonString);
      setAnalysis(result);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError(err instanceof Error ? `Failed to analyze image: ${err.message}` : "An unknown error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);
  
  const handleGoHome = () => {
    setView('home');
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    setIsLoading(false);
  };

  const renderContent = () => {
    switch(view) {
        case 'home':
            return <HomePage onFindSitter={() => setView('findSitter')} onBecomeHost={() => setView('becomeHost')} />;
        case 'becomeHost':
            return <BecomeAHost onGoHome={handleGoHome} />;
        case 'findSitter':
            return (
                <div className="bg-white dark:bg-slate-800/50 shadow-2xl rounded-2xl p-6 md:p-10 animate-fade-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-100 mb-2">Find the Perfect Pet Sitter</h2>
                  <p className="text-slate-500 dark:text-slate-400">Upload your pet's photo to analyze their needs and find the best local hosts.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="flex flex-col items-center">
                    <ImageUploader onImageSelect={handleImageSelect} previewUrl={previewUrl} />
                    <button
                      onClick={handleAnalyze}
                      disabled={!imageFile || isLoading}
                      className="mt-6 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-800 transition-all duration-300 disabled:bg-indigo-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Pet'
                      )}
                    </button>
                  </div>
    
                  <AnalysisResult analysis={analysis} isLoading={isLoading} error={error} />
                </div>
    
                {analysis && !isLoading && !error && (
                  <HostFinder analysis={analysis} />
                )}
              </div>
            );
        default:
            return <HomePage onFindSitter={() => setView('findSitter')} onBecomeHost={() => setView('becomeHost')} />;
    }
  }


  if (isAppLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
      <Header onLogoClick={view !== 'home' ? handleGoHome : undefined} />
      <main className="container mx-auto p-4 md:p-8 max-w-4xl">
        {renderContent()}
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>Pet Pal Locator by Elliott Media Group &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;