
export interface CustomFeature {
  id: string;
  name: string;
  importance: number;
}

export interface Room {
  id: string;
  name: string;
  size: number;
  hasPrivateBathroom: boolean;
  hasCloset: boolean;
  hasBalcony: boolean;
  hasAirConditioning: boolean;
  noiseLevel: number;
  naturalLight: number;
  customFeatures: CustomFeature[];
}

export interface Weights {
  size: number;
  features: number;
  comfort: number;
}

export interface FormData {
  totalRent: number;
  currency: string;
  rooms: Room[];
  weights: Weights;
}

export interface CalculationResult {
  roomName: string;
  rent: number;
  percentage: number;
  score: number;
}
