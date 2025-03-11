import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

export interface CartItem {
  productId: string;
  name?: string;
  price?: number;
  imageUrl?: string;
  quantity: number;
}

export interface CartResponse {
  email: string;
  items: CartItem[];
}

export interface Cart {
  email: string;
  items: CartItem[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  email: string = localStorage.getItem('userEmail') || ''; // Use stored email
  totalAmount: number = 0;

  constructor(private cartService: CartService, private orderService: OrderService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.email).subscribe({
      next: (response: CartResponse) => {
        this.cartItems = response.items.map((item: CartItem) => ({
          ...item,
          name: '',
          price: item.price ?? 0,
          quantity: item.quantity ?? 1,
          imageUrl: ''
        }));
  
        // Fetch product details for each item
        this.cartItems.forEach((item: CartItem, index: number) => {
          this.cartService.getProductById(item.productId).subscribe((product: Product) => {
            this.cartItems[index] = {
              ...this.cartItems[index],
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            };
            this.updateTotal();
          });
        });
      },
      error: (error) => {
        if (error.status === 404) {
          console.warn("Cart not found. Initializing an empty cart.");
          this.cartItems = []; // Ensure cartItems is an empty array
        } else {
          console.error("Error fetching cart:", error);
        }
      }
    });
  }
  

  updateTotal(): void {
    this.totalAmount = this.cartItems.reduce((sum, item) => sum + (item.quantity * (item.price ?? 0)), 0);
  }

  updateQuantity(item: CartItem, change: number): void {
    const newQuantity = item.quantity + change;
    if (newQuantity < 1) return; // Prevent negative quantity

    item.quantity = newQuantity;
    this.updateTotal();

    // Update cart in backend
    this.cartService.updateCart(this.email, this.cartItems).subscribe(
      () => console.log('Cart updated successfully'),
      (error) => console.error('Error updating cart:', error)
    );
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(this.email, productId).subscribe(
      () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.updateTotal();
      },
      (error) => console.error('Error removing item:', error)
    );
  }

  placeOrder(): void {
    const orderItems = this.cartItems.map(item => ({
      productId: Number(item.productId), // Convert string to number
      quantity: item.quantity
    }));
  
    this.orderService.placeOrder(this.email, orderItems).subscribe(
      () => {
        alert('Order placed successfully!');
        this.cartItems = []; // Clear cart
        this.totalAmount = 0;
      },
      (error) => console.error('Order placement failed:', error)
    );

    this.router.navigate(['/home']);
  }
}
