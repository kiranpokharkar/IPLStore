import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, throwError } from 'rxjs';
import { CartResponse, CartItem, Product, Cart } from '../pages/cart/cart.component';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = `${ environment.apiBaseUrl}/Cart`;

  constructor(private http: HttpClient) {}

  getCart(email: string): Observable<CartResponse> {
    return this.http.get<CartResponse>(`${this.apiUrl}/${email}`);
  }

  getProductById(productId: string): Observable<Product> {
    return this.http.get<Product>(`${ environment.apiBaseUrl}/Product/${productId}`);
  }

  updateCart(email: string, items: CartItem[]): Observable<void> {
    // Ensure the payload matches the expected format
    const payload = {
      email: email,
      items: items.map(item => ({
        productId: item.productId, 
        quantity: item.quantity
      }))
    };
  
  
    return this.http.post<void>(`${this.apiUrl}`, payload, { observe: 'response' }).pipe(
      map(response => {
        return;
      }),
      catchError(error => {
        console.error('Error updating cart:', error);
        return throwError(error);
      })
    );
  }
  removeFromCart(email: string, productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${email}/${productId}`);
  }

  placeOrder(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${email}/order`, {});
  }

  addToCart(email: string, productId: number, quantity: number = 1): Observable<void> {
    console.log("Newly added product:", productId, "Quantity:", quantity);
  
    return this.getCart(email).pipe(
      catchError(error => {
        if (error.status === 404) {
          console.warn("Cart not found. Creating a new cart...");
          return of({ email, items: [] as CartItem[] });
        }
        return throwError(error);
      }),
      map(cart => {
        
        const productIdStr = productId.toString();
        
        cart.items = cart.items ?? [];

        const existingItem = cart.items.find(item => item.productId === productIdStr);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({ productId: productIdStr, quantity } as CartItem); 
        }
  
        return cart;
      }),
      switchMap(updatedCart => this.updateCart(updatedCart.email, updatedCart.items)) 
    );
  } 
}
