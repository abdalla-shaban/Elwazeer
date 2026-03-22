export interface SettingsResponse {
  message: string;
  settings: Settings;
}

export interface Settings {
  _id: string;
  __v: number;
  createdAt: string;
  season: string;
  updatedAt: string;
  category: string[];
  fabric: string[];
  banner: {
    secure_url?: string;
    base64?: string;
  };
  sizeDescription: SizeDescription[];
  shippingRates: Record<string, number>;
  areas?: Record<string, string[]>;
}

export interface SizeDescription {
  size: string;
  range: string;
  _id: string;
}
