import React, { useState, FormEvent, useRef, useEffect } from 'react';
import type { Analysis, Host, HostFilters } from '../types';
import { findHosts, generateImage } from '../services/geminiService';
import { LocationPinIcon, CatIcon, DogIcon, TagIcon, CheckCircleIcon, DocumentIcon, ClockIcon, HandshakeIcon, UploadIcon, TwitterIcon, FacebookIcon, UsersIcon } from './icons';
import { ShareButtons } from './ShareButtons';

interface HostFinderProps {
  analysis: Analysis;
}

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: { name: string; email: string; message: string }) => void;
    host: Host;
    species: string;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSubmit, host, species }) => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    if (!isOpen) {
        return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            // Basic validation
            return;
        }
        onSubmit(formData);
        setFormData({ name: '', email: '', message: '' }); // Reset form
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6 relative transform transition-all duration-300 scale-95 opacity-0 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <style>{`
                    @keyframes scale-in {
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-scale-in {
                        animation: scale-in 0.2s ease-out forwards;
                    }
                `}</style>
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Contact {host.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Express your interest in booking their services for your {species.toLowerCase()}.
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                            <input
                                type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Your Email</label>
                            <input
                                type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                            <textarea
                                name="message" id="message" rows={4} required value={formData.message}
                                placeholder={`I'm interested in booking your services for my ${species.toLowerCase() || 'pet'}...`}
                                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 border border-transparent rounded-md hover:bg-slate-200 dark:hover:bg-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
                        >
                            Send Inquiry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

interface HostCardProps {
    host: Host;
    onContact: (host: Host) => void;
    species: string;
    distance: number;
    analysis: Analysis;
}

const BookingStep: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-6 h-6 text-indigo-500 dark:text-indigo-400 mt-1">{icon}</div>
        <div>
            <h5 className="font-semibold text-slate-700 dark:text-slate-200">{title}</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    </div>
);

const HostCard: React.FC<HostCardProps> = ({ host, onContact, species, distance, analysis }) => {
    const [contacted, setContacted] = useState(false);
    const [showProcess, setShowProcess] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [petImage, setPetImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);

    const shareText = `Check out this wonderful pet host I found on Pet Pal Locator: ${host.name}! "${host.bio}" #PetPalLocator #PetSitter`;
    const encodedText = encodeURIComponent(shareText);
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

    const handleModalSubmit = (formData: { name: string; email: string; message: string }) => {
        onContact(host);
        setContacted(true);
        setIsModalOpen(false);
        console.log("Simulating message send with data:", formData);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            if (petImage) {
                URL.revokeObjectURL(petImage);
            }
            setPetImage(URL.createObjectURL(e.target.files[0]));
        }
    };
    
    useEffect(() => {
        return () => {
            if (petImage && petImage.startsWith('blob:')) {
                URL.revokeObjectURL(petImage);
            }
        };
    }, [petImage]);

    const handleGenerateImage = async () => {
        setIsGenerating(true);
        setGenerationError(null);
        try {
            const base64Data = await generateImage(analysis);
            if (petImage && petImage.startsWith('blob:')) {
                URL.revokeObjectURL(petImage);
            }
            setPetImage(`data:image/png;base64,${base64Data}`);
        } catch (err) {
            console.error("Image generation failed:", err);
            setGenerationError(err instanceof Error ? err.message : "Failed to generate image.");
        } finally {
            setIsGenerating(false);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Available':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-700';
            case 'Partially Booked':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700';
            case 'Fully Booked':
                return 'bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-500';
            default:
                return 'bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-500';
        }
    };

    const getSpeciesIcon = (speciesName: string) => {
        const lowerSpecies = speciesName.toLowerCase();
        if (lowerSpecies.includes('cat')) {
          return <CatIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>;
        }
        if (lowerSpecies.includes('dog')) {
          return <DogIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>;
        }
        return <TagIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>;
    };

    return (
        <>
            <ContactModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                host={host}
                species={species}
            />
            <div className="relative bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 border border-transparent transition-all duration-300 hover:shadow-xl hover:scale-[1.03] hover:border-indigo-300 dark:hover:border-indigo-600">
                <span className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadgeColor(host.availability)}`}>
                    {host.availability}
                </span>
                <h4 className="text-lg font-bold flex items-center gap-2 mb-1 text-slate-800 dark:text-slate-100">
                    <UsersIcon className="w-5 h-5 text-indigo-500 dark:text-indigo-400"/>
                    {host.name}
                </h4>
                <p className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-3 ml-1">
                    <LocationPinIcon className="w-4 h-4" />
                    Located within {distance} miles
                </p>

                <div className="my-4 border-y border-slate-200 dark:border-slate-600 py-4">
                    {petImage ? (
                        <div className="relative group">
                            <img src={petImage} alt="Your pet" className="w-full h-48 object-cover rounded-lg shadow-inner" />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center rounded-lg">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 text-slate-800 font-semibold py-2 px-4 rounded-lg shadow-md"
                                >
                                    Change Photo
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full p-4 bg-slate-100 dark:bg-slate-600/50 rounded-lg flex flex-col items-center justify-center text-center min-h-[192px]">
                            {isGenerating ? (
                                <>
                                    <div className="w-8 h-8 border-4 border-indigo-300 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">Generating a likeness of your pet...</p>
                                </>
                            ) : (
                                <>
                                    <UploadIcon className="w-8 h-8 mb-2 text-slate-400 dark:text-slate-500" />
                                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Considering this host?</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">Upload a photo of your pet or generate one based on the analysis.</p>
                                    {generationError && <p className="text-xs text-red-500 dark:text-red-400 mb-2">{generationError}</p>}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 py-2 px-4 rounded-md border border-slate-300 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors shadow-sm"
                                        >
                                            Upload Photo
                                        </button>
                                        <button
                                            onClick={handleGenerateImage}
                                            className="text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold py-2 px-4 rounded-md border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-200 dark:hover:bg-indigo-900/80 transition-colors shadow-sm"
                                        >
                                            Generate Image
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/png, image/jpeg, image/webp"
                        id={`file-upload-${host.name.replace(/\s+/g, '-')}`}
                    />
                </div>


                <div className="space-y-3 text-sm">
                    <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">About them:</p>
                        <p className="pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2 text-slate-500 dark:text-slate-400">{host.bio}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Why they're a great match:</p>
                        <p className="pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2 text-slate-500 dark:text-slate-400">{host.matchReason}</p>
                    </div>
                    
                    <div className="pt-2">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mb-2">
                            <p className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                <TagIcon className="w-4 h-4" />
                                Rate: <span className="font-bold text-indigo-600 dark:text-indigo-300 ml-1">{host.dailyRate}</span>
                            </p>
                            {host.maxDuration && (
                                <p className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <ClockIcon className="w-4 h-4" />
                                    Max Stay: <span className="font-bold text-indigo-600 dark:text-indigo-300 ml-1">{host.maxDuration}</span>
                                </p>
                            )}
                        </div>
                        {host.servicesOffered && host.servicesOffered.length > 0 && (
                            <div className="pl-2 border-l-2 border-slate-200 dark:border-slate-600 ml-2 text-slate-500 dark:text-slate-400 mt-1">
                                <p className="text-xs italic mb-1">Services offered:</p>
                                <ul className="space-y-1">
                                    {host.servicesOffered.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-2 text-xs">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-200 dark:border-slate-600">
                        <button
                            onClick={() => setShowProcess(!showProcess)}
                            className="text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
                        >
                            {showProcess ? 'Hide' : 'Show'} Booking Process
                        </button>
                        {showProcess && (
                            <div className="mt-3 space-y-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                            <BookingStep 
                                    icon={<DocumentIcon />}
                                    title="1. Send Inquiry"
                                    description="Submit a simple online form to express your interest."
                            />
                            <BookingStep 
                                    icon={<ClockIcon />}
                                    title="2. Host Review"
                                    description="The host will review your request, which usually takes 1-2 business days."
                            />
                            <BookingStep 
                                    icon={<HandshakeIcon />}
                                    title="3. Meet & Greet"
                                    description="If it's a good fit, schedule a time for you and your pet to meet the host."
                            />
                            <BookingStep 
                                    icon={<CheckCircleIcon />}
                                    title="4. Confirm & Book"
                                    description="Finalize the details and payment to book your pet's stay!"
                            />
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Share:</span>
                             <button
                                onClick={handleTwitterShare}
                                aria-label="Share on Twitter"
                                className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                            >
                                <TwitterIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleFacebookShare}
                                aria-label="Share on Facebook"
                                className="p-2 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                            >
                                <FacebookIcon className="w-4 h-4" />
                            </button>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            disabled={host.availability === 'Fully Booked' || contacted}
                            className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-700 transition-all duration-200 text-sm disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {contacted ? (
                                <span className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-5 h-5"/> Inquiry Sent!
                                </span>
                            ) : (
                                'Contact Host'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export const HostFinder: React.FC<HostFinderProps> = ({ analysis }) => {
  const [hosts, setHosts] = useState<Host[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState(10);
  const [filters, setFilters] = useState<HostFilters>({
    hasChildren: false,
    hasPets: false,
    environmentType: 'any',
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFindHosts = () => {
    setIsLoading(true);
    setError(null);
    setHosts(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const resultJsonString = await findHosts(analysis, position.coords, distance, filters);
          const cleanedJsonString = resultJsonString.replace(/^```json\s*|```\s*$/g, '');
          const result: { hosts: Host[] } = JSON.parse(cleanedJsonString);
          setHosts(result.hosts);
        } catch (err) {
          console.error("Finding hosts failed:", err);
          setError(err instanceof Error ? `Failed to find hosts: ${err.message}` : "An unknown error occurred while finding hosts.");
        } finally {
          setIsLoading(false);
        }
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError(`Could not get your location: ${geoError.message}. Please enable location services.`);
        setIsLoading(false);
      }
    );
  };

  const handleContact = (host: Host) => {
    // This is a simulation. In a real app, this would trigger a modal or an API call.
    console.log(`Simulating contact with ${host.name} for the ${analysis.species}.`);
  };

  const hostShareText = `I'm using Pet Pal Locator to find a great sitter for my ${analysis.species.toLowerCase()}! The app found some amazing potential hosts in my area. Check it out! #PetPalLocator #PetSitter`;


  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
      <div className="text-center max-w-lg mx-auto">
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">Ready for the next step?</h3>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Fine-tune your search to find the perfect pet sitter.</p>
        
        <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
            <h4 className="font-bold text-slate-600 dark:text-slate-300 mb-4 text-left">Filter Options</h4>
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="distance-slider" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 text-left">
                        Search Radius: <span className="font-bold text-indigo-600 dark:text-indigo-400">{distance} miles</span>
                    </label>
                    <input
                        id="distance-slider"
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={distance}
                        onChange={(e) => setDistance(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="environmentType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 text-left">
                        Environment Type
                    </label>
                    <select
                        id="environmentType"
                        name="environmentType"
                        value={filters.environmentType}
                        onChange={handleFilterChange}
                        disabled={isLoading}
                        className="w-full p-2 border border-slate-300 dark:border-slate-500 rounded-md bg-white dark:bg-slate-600 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="any">Any</option>
                        <option value="Quiet Apartment">Quiet Apartment</option>
                        <option value="House with Yard">House with Yard</option>
                        <option value="Active Household">Active Household</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center justify-start gap-6">
                <div className="flex items-center">
                    <input
                        id="hasChildren"
                        name="hasChildren"
                        type="checkbox"
                        checked={filters.hasChildren}
                        onChange={handleFilterChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 bg-slate-200 dark:bg-slate-600"
                    />
                    <label htmlFor="hasChildren" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                        Host Has Children
                    </label>
                </div>
                <div className="flex items-center">
                    <input
                        id="hasPets"
                        name="hasPets"
                        type="checkbox"
                        checked={filters.hasPets}
                        onChange={handleFilterChange}
                        disabled={isLoading}
                        className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-indigo-600 focus:ring-indigo-500 bg-slate-200 dark:bg-slate-600"
                    />
                    <label htmlFor="hasPets" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                        Host Has Other Pets
                    </label>
                </div>
            </div>
        </div>

        <button
          onClick={handleFindHosts}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300 disabled:bg-green-300 dark:disabled:bg-slate-600 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Finding Hosts...
            </>
          ) : (
            <>
              <LocationPinIcon className="w-5 h-5"/>
              Find Local Pet Sitters
            </>
          )}
        </button>
      </div>

      <div className="mt-6">
        {isLoading && (
            <div className="flex flex-col items-center justify-center p-8 space-y-4 rounded-xl h-full min-h-[200px]">
                <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 dark:text-slate-400">Searching for perfect matches...</p>
            </div>
        )}
        {error && (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-red-100 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-xl h-full">
                <h3 className="font-bold text-red-700 dark:text-red-200 mb-2">Search Failed</h3>
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
        )}
        {hosts && (
            <div className="space-y-4">
                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 text-center mb-4">Potential Pet Sitters Nearby</h3>
                {hosts.map((host, index) => (
                    <HostCard key={index} host={host} onContact={handleContact} species={analysis.species} distance={distance} analysis={analysis} />
                ))}
                <div className="pt-4">
                    <ShareButtons title="Share These Results" textToShare={hostShareText} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
