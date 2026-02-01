import { GoogleGenAI } from "@google/genai";
import type { Analysis, HostFilters } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT_FOR_ANALYSIS = `You are an expert animal behaviorist with a friendly and caring tone. Analyze the image of the animal provided. Identify the species, potential breed, estimated age, and any visible signs of its health or mood. Based on your analysis, provide a detailed recommendation for a suitable temporary home environment. Your response MUST be a valid JSON object, without any surrounding text or markdown formatting. Follow this exact schema:
{
  "species": "e.g., Cat, Dog",
  "breed": "e.g., Domestic Shorthair, Golden Retriever, Unknown",
  "estimatedAge": "e.g., Kitten (2-6 months), Adult, Senior",
  "healthNotes": "e.g., Appears healthy and well-groomed. No visible injuries.",
  "mood": "e.g., Curious and alert, Relaxed, Cautious",
  "idealHome": {
    "environment": "e.g., Quiet indoor home, a place with a secure yard.",
    "family": "e.g., Suitable for a single person or a quiet couple. May be good with older children.",
    "otherPets": "e.g., Should be the only pet to start. May get along with calm animals after slow introduction."
  }
}`;

export const analyzeImage = async (base64Data: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          { text: PROMPT_FOR_ANALYSIS },
        ],
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("API returned an empty response.");
    }

    return text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while contacting the Gemini API.");
  }
};

const PROMPT_FOR_HOSTS = (analysis: Analysis, coords: GeolocationCoordinates, distance: number, filters: HostFilters) => {
  let filterInstructions = 'Please adhere to the following user-specified filters for the hosts you generate:';
  let hasFilter = false;

  if (filters.hasChildren) {
    filterInstructions += '\n- The host MUST have children.';
    hasFilter = true;
  }
  if (filters.hasPets) {
    filterInstructions += '\n- The host MUST have other pets.';
    hasFilter = true;
  }
  if (filters.environmentType && filters.environmentType !== 'any') {
    filterInstructions += `\n- The host's home environment MUST be a '${filters.environmentType}'.`;
    hasFilter = true;
  }
  
  return `
You are a "Paws In Between" service. Your goal is to find suitable, temporary, paid pet sitters (hosts) for a pet owner.
Based on the provided animal analysis and the user's approximate location, generate a list of 3 to 4 *completely fictional* potential pet hosts.
These hosts should be good matches for the animal described, and should be located within approximately ${distance} miles of the user's location.
Pay close attention to the animal's mood to infer its energy level and socialization needs. For example, a playful and curious animal needs an active host, while a calm or cautious one needs a quiet environment.

${hasFilter ? filterInstructions : 'Generate a diverse set of hosts as no specific filters were provided.'}

Your response MUST be a valid JSON object, without any surrounding text or markdown formatting. Follow this exact schema:
{
  "hosts": [
    {
      "name": "e.g., Jane's Pet Paradise",
      "bio": "A short, friendly description of the fictional host, including if they have children or other pets if relevant to the filters.",
      "matchReason": "Explain exactly why this host is a good match based on the animal's profile AND the user's filters.",
      "dailyRate": "A suggested daily rate, e.g., $45/day",
      "maxDuration": "A maximum stay duration, e.g., '2 weeks', '1 month'",
      "servicesOffered": ["A list of 3-4 services offered, e.g., 'Overnight boarding', 'Daily walks (2)', 'Medication administration', 'Grooming'],
      "availability": "Randomly assign one of: 'Available', 'Partially Booked', or 'Fully Booked'"
    }
  ]
}

Animal Profile to match:
- Species: ${analysis.species}
- Breed: ${analysis.breed}
- Estimated Age: ${analysis.estimatedAge}
- Health Notes: ${analysis.healthNotes}
- Mood: ${analysis.mood}
- Ideal Home Environment: ${analysis.idealHome.environment}
- Ideal Family Type: ${analysis.idealHome.family}
- Compatibility with other pets: ${analysis.idealHome.otherPets}

User's approximate location (do not include in response, just use for context of "local" hosts):
- Latitude: ${coords.latitude}
- Longitude: ${coords.longitude}
`;
};

export const findHosts = async (analysis: Analysis, coords: GeolocationCoordinates, distance: number, filters: HostFilters): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: { parts: [{ text: PROMPT_FOR_HOSTS(analysis, coords, distance, filters) }] },
          config: {
            responseMimeType: 'application/json'
          }
        });
    
        const text = response.text;
        if (!text) {
          throw new Error("API returned an empty response.");
        }
    
        return text;
    
      } catch (error) {
        console.error("Error calling Gemini API for hosts:", error);
        if (error instanceof Error) {
            throw new Error(`Gemini API Error: ${error.message}`);
        }
        throw new Error("An unknown error occurred while finding hosts.");
      }
}

export const generateImage = async (analysis: Analysis): Promise<string> => {
  try {
    const prompt = `A realistic, high-quality photo of a ${analysis.mood.toLowerCase()} ${analysis.breed} ${analysis.species.toLowerCase()}, ${analysis.estimatedAge.toLowerCase()}. The animal ${analysis.healthNotes.toLowerCase().replace('appears', 'is')}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("API returned no image data.");

  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while generating the image.");
  }
};