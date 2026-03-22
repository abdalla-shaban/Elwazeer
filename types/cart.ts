import { ProductDetailsImage, Size } from "./productDetails";

export interface CartResponse {
  message: string;
  data: Data;
}

export interface Data {
  _id: string;
  items: Item[];
  totalPrice: number;
  totalItems: number;
  totalQuantity: number;
}

export interface Item {
  productId: string;
  name: string;
  image: string | null;
  sku: string;
  color: Color;
  size: Size;
  price: number;
  quantity: number;
  total: number;
}

export interface Product {
  stock: Stock;
  offer: Offer;
  _id: string;
  name: string;
  sizeDescription: Size[];
  size?: Size[];
  colors: Color[];
  price: number;
  images: ProductDetailsImage[];
  isAvailable: boolean;
  category: string;
  sku: string;
  brand: string;
  condition: string;
  googleCategory: string;
  mpn: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  finalPrice: number;
  id: string;
}

export interface Color {
  name: string;
  hexCode: string;
  _id?: string;
}

export interface Image {
  color: Color;
  public_id: string;
  secure_url: string;
  _id: string;
}

export interface Stock {
  manageStock: boolean;
  stockQuantity: number;
}

export interface Offer {
  isAvailable: boolean;
  percent: number;
}
