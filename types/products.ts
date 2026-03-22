export interface IProductImage {
  public_id?: string;
  secure_url: string;
  _id?: string;
  id?: string;
}

export interface IProductBody {
  name: string;
  image_preview: string | IProductImage;
  price: number;
  season: string;
  brand?: string;
  condition?: string;
  googleCategory?: string;
  mpn?: string;
  metaDescription: string;
  metaKeywords: string[];
  offer?: {
    isAvailable: boolean;
    percent: number;
  };
  isAvailable?: boolean;
  category: string;
  fabric: string;
  colors: {
    name: string;
    hexCode: string;
    images: (string | IProductImage)[];
    sizes: {
      size: string;
      range?: string;
      manageStock: boolean;
      stock: number;
      isAvailable: boolean;
    }[];
  }[];
}
export interface IWishlistRes {
  message: string;
  wishlist: Wishlist;
}

export interface Wishlist {
  _id: string;
  user: string | null;
  products: IProductRes[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface IRelatedProductsResponse {
  success: boolean;
  count: number;
  data: IProductRes[];
}
export interface IProductsResponse {
  success: boolean;
  pagination: {
    page: number;
    limit: number;
    totalProducts: number;
    totalPages: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
  };
  data: IProductRes[];
}
export interface IProductRes {
  stock: Stock;
  offer: Offer;
  _id: string;
  name: string;
  image_preview?: IProductImage;
  isInWishlist: boolean;
  colors: Color[];
  price: number;
  images: Image[];
  isAvailable: boolean;
  category: string;
  fabric?: string;
  season?: string;
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
  sizeDescription: SizeDescription;
}
export interface SizeDescription {
  size: string;
  range: string;
  _id?: string;
  id?: string;
}
export interface Stock {
  manageStock: boolean;
  stockQuantity: number;
}

export interface Offer {
  isAvailable: boolean;
  percent: number;
}

export interface Color {
  name: string;
  hexCode: string;
  _id: string;
  id: string;
}

export interface Image {
  public_id: string;
  secure_url: string;
  _id: string;
  id: string;
}
