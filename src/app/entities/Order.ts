export interface Order {
    id: string;
    email: string;
    items: OrderItem[];
    totalOrderAmount: number;
    createdAt: string; // Date in ISO format
  }
  
  export interface OrderItem {
    productId: number;
    quantity: number;
    price: number;
    name?: string; // To store product name
    imageUrl?: string; // To store product image
  }
  