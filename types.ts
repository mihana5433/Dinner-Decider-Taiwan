export interface FoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface MapSource {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface RecommendationResult {
  text: string;
  mapChunks: GroundingChunk[];
  suggestedFoodName?: string; // Used for fallback image query
}

export interface SavedPlace {
  uri: string;
  title: string;
  snippet?: string;
  addedAt: number;
}

export enum AppMode {
  HOME = 'HOME',
  RANDOM = 'RANDOM',
  AI_CHAT = 'AI_CHAT',
  GROUP_SELECTOR = 'GROUP_SELECTOR',
}