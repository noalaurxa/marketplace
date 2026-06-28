export interface Category {
  id: number;
  name: string;
  imageUrl?: string;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  descripcion?: string;
  imageUrl?: string;
  categoryId?: number;
  category?: Category;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
