import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface FranchiseDto {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl: string;
  createdAt: string;
  categoryId: number;
  franchiseId?: number;
  category: CategoryDto;
  franchise?: FranchiseDto;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${ environment.apiBaseUrl}/Product`;

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts(url: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/${url}`); 
  }

  // Fetch product details by ID
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }
}
