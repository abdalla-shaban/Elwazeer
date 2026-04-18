export interface ProductDetailsResponse {
  message: string;
  data: Product;
}

export interface Product {
  _id: string;
  name: string;
  image_preview?: ProductDetailsImage;
  price: number;
  category: string;
  fabric: string;
  season: string;
  brand: string;
  condition: string;
  googleCategory: string;
  mpn?: string;
  metaDescription: string;
  metaKeywords: string[];
  offer: Offer;
  isAvailable: boolean;
  ageGroup?: "kids" | "adults";
  colors: Color[];
  productType: "normal" | "3d";
  slug: string;
  finalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface Color {
  _id: string;
  name: string;
  hexCode: string;
  isAvailable: boolean;
  images: ProductDetailsImage[];
  sizes: Size[];
}

export interface Size {
  _id: string;
  size: string;
  range: string;
  sku: string;
  manageStock: boolean;
  stock: number;
  isAvailable: boolean;
}

export interface Offer {
  isAvailable: boolean;
  percent: number;
}

export interface ProductDetailsImage {
  public_id: string;
  secure_url: string;
  _id?: string;
}
