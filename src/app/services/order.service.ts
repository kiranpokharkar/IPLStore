import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Order } from '../entities/Order';
import { Product } from './product.service';
import { environment } from '../environment';

// Define CartItem interface to match API payload
export interface CartItem {
  productId: number;
  quantity: number;
}


// Define OrderPayload to match the API request format
export interface OrderPayload {
  email: string;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${ environment.apiBaseUrl}/Order`;
  private productUrl = `${ environment.apiBaseUrl}/Product`; // Ensure this is your correct backend endpoint

  constructor(private http: HttpClient) {}

  // place order
  placeOrder(email: string, items: CartItem[]): Observable<void> {
    const payload: OrderPayload = {
      email: email,
      items: items.map(item => ({
        productId: Number(item.productId), // Ensure productId is a number
        quantity: item.quantity
      }))
    };

    console.log("Placing order with payload:", payload);

    return this.http.post<void>(this.apiUrl, payload, { observe: 'response' }).pipe(
      map(response => {
        console.log('Order placed successfully. Response status:', response.status);
        return;
      }),
      catchError(error => {
        console.error('Error placing order:', error);
        return throwError(error);
      })
    );
  }

  // get order details with email
  getOrders(email: string): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/${email}`).pipe(
      switchMap((orders: Order[]) => {
        const productRequests = orders.flatMap(order =>
          order.items.map(item =>
            this.http.get<Product>(`${this.productUrl}/${item.productId}`).pipe(
              map(product => ({ productId: item.productId, name: product.name, imageUrl: product.imageUrl }))
            )
          )
        );

        return forkJoin(productRequests).pipe(
          map(productDetails => {
            let index = 0;
            return orders.map(order => ({
              ...order,
              items: order.items.map(item => {
                const productDetail = productDetails[index++];
                return {
                  ...item,
                  name: productDetail?.name || 'Unknown Product',
                  imageUrl: productDetail?.imageUrl || ''
                };
              })
            }));
          })
        );
      })
    );
  }
}
