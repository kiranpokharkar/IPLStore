export interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    stock: number;
    imageUrl: string;
    createdAt?: string;
    categoryId: number;
    franchiseId?: number;
    category?: CategoryDto;
    franchise?: FranchiseDto;
    quantity?: number; // UI quantity for cart interaction
  }
  
  export interface CategoryDto {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
  }
  
  export interface FranchiseDto {
    id: number;
    name: string;
    description?: string;
    createdAt?: string;
  }
  