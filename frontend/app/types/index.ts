export type Language = "pt-br" | "en" | "es";
export type ViewMode = "grid" | "horizontal";

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  value: number;
  img: string;
  category?: string;
}

export interface Extra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  uid: string;
  food: FoodItem;
  quantity: number;
  extras: Extra[];
  observation: string;
}

export interface SavedOrder {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
}
