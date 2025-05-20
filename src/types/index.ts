export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  brand: string;
};

export type Sort = {
  id: string;
  desc: boolean;
};

export type EditProductData = {
  title: string;
  description: string;
  price: number;
};


export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
  };
}