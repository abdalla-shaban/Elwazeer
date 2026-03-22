export interface OrdersResponse {
  message: string;
  data: Order[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface Order {
  _id: string;
  userId?: string;
  items: Item[];
  totalPrice: number;
  shipping: Shipping;
  payment: Payment;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  facebookPurchaseSent?: boolean;
}

export interface Shipping {
  name: string;
  phone: string;
  phone2: string;
  address: string;
  building: string;
  city: string;
  governorate: string;
  shippingPrice: number;
  email?: string;
  note?: string;
}

export interface Payment {
  method: string;
}

export interface Item {
  productId: string | ProductId;
  name?: string;
  quantity: number;
  sku: string;
  size: Size; // Optional if we only have the string returned, but keeping for compatibility if backend populates it
  color: Color; // Changed from Color[] to Color
  image?: string | {
    public_id: string;
    secure_url: string;
  } | null;
  totalItemPrice?: number; // Might be optional in some contexts
  price: number;
  _id?: string;
}

export interface Size {
  size: string;
  range: string;
}

export interface ProductId {
  _id: string;
  name: string;
  sizeDescription: SizeDescription[];
  colors: Color[];
  price: number;
  images: Image[];
  stock: Stock;
  isAvailable: boolean;
  category: string;
  fabric: string;
  season: string;
  offer: Offer;
  sku: string;
  brand: string;
  condition: string;
  googleCategory: string;
  mpn: string;
  metaDescription: string;
  metaKeywords: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
  finalPrice: number;
}

export interface Stock {
  manageStock: boolean;
  stockQuantity: number;
}

export interface Offer {
  isAvailable: boolean;
  percent: number;
}

export interface SizeDescription {
  size: string;
  range: string;
  _id: string;
}

export interface Color {
  name: string;
  hexCode: string;
  _id?: string;
}

export interface Image {
  public_id: string;
  color?: Color;
  secure_url: string;
  _id: string;
}

export interface Stock {
  manageStock: boolean;
  stockQuantity: number;
}
