export interface CharacterStats {
  tinhCam: number;
  tuVi: string;
  thoNguyen: string;
}

export interface CharacterCurrency {
  congDuc: number;
  nghiepLuc: number;
}

export interface RelationshipUnlockable {
  type: 'feature' | 'content' | 'thought' | 'gift' | 'scene';
  title: string;
  description: string;
}

export interface RelationshipLevel {
  level: number;
  title:string;
  description: string;
  unlocks?: RelationshipUnlockable[];
}


export interface Character {
  id: string;
  name: string;
  tag: string;
  tagline: string;
  biography: string;
  personality: string; // Added for core personality traits
  lore: string; // Added for world-building/lore
  greeting: string;
  imageUrl: string;
  viewerCount: string;
  stats: CharacterStats;
  currency: CharacterCurrency;
  alignment: number; // 0-100, where 0 is Chống and 100 is Thuận
  resources: string;
  magicItems: string;
  model: string; // The Gemini model to use for this character
  relationshipLevels: RelationshipLevel[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'event';
  timestamp: number;
}

export interface PersonaStats {
  congDuc: number;
  nghiepLuc: number;
  tinNguong: number;
  khiVan: number;
}

export interface UserPersona {
  id: string;
  name:string;
  tagline: string;
  biography: string;
  stats: PersonaStats;
  imageUrl: string;
}

// New interface for character-specific persona settings
export interface PersonaProfile {
  relationship: string;
  howCharacterAddressesUser: string;
  secondPersonPronoun: string;
  description: string;
}

// --- New Map Interfaces ---

export interface PlacedCharacter {
  characterId: string;
  x: number; // Percentage from left
  y: number; // Percentage from top
}

export interface MapData {
  name: string;
  description: string;
  imageUrl: string; // Base64 URL
  placedCharacters: PlacedCharacter[];
}