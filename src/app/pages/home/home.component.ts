import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../entities/product';
import { CategoryService } from 'src/app/services/category.service';
import { FranchiseService } from 'src/app/services/franchise.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  filteredProducts: any[] = [];

  categories: any[] = [];
  franchises: any[] = [];

  searchQuery: string = '';
  selectedFranchises: string[] = [];
  selectedCategories: string[] = []; 
  showFilter: boolean = false;


  email = localStorage.getItem('userEmail') || '';
  constructor(private productService: ProductService,
    private categoryService: CategoryService,
    private franchiseService: FranchiseService, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.fetchCategories();
    this.fetchFranchises();
  }

  // Fetch products from API
  loadProducts(): void {
    this.productService.getProducts('').subscribe(
      (data) => {
        this.products = data.map(product => ({
          ...product,
          quantity: 0
        }));
        
       
        this.filteredProducts = [...this.products];
      },
      (error) => console.error('Error fetching products:', error)
    );
  }

  openProductDetails(product: Product): void {
    this.selectedProduct = product;
  }

  closeProductDetails(): void {
    this.selectedProduct = null;
  }

  increaseQuantity(product: Product): void {
    product.quantity = (product.quantity ?? 0) + 1;
  }
  
  decreaseQuantity(product: Product): void {
    if (product.quantity && product.quantity > 0) {
      product.quantity--;
    }
  }

  addToCart(product: Product): void {
    if (product.quantity && product.quantity > 0) {
      this.cartService.addToCart(this.email, product.id, product.quantity).subscribe(
        () => alert(`${product.name} added to cart!`),
        (error) => console.error('Error adding product to cart:', error)
      );
    } else {
      alert(`Please select at least one quantity of ${product.name}.`);
    }
  }

  fetchProducts(): void {
    this.productService.getProducts('').subscribe((data) => {
      this.products = data;
      this.filteredProducts = [...data];
    });
  }

  fetchCategories(): void {
    this.categoryService.getCategories().subscribe((data: any[]) => {
      this.categories = data;
    });
  }

  fetchFranchises(): void {
    this.franchiseService.getFranchises().subscribe((data: any[]) => {
      this.franchises = data;
    });
  }

  applyFilters(): void {
    let queryParams: any = {};
  
    if (this.searchQuery) {
      queryParams.name = this.searchQuery;
    }
    if (this.selectedCategories.length) {
      queryParams.category = this.selectedCategories.join(',');
    }
    if (this.selectedFranchises.length) {
      queryParams.franchise = this.selectedFranchises.join(',');
    }
  
    const queryString = new URLSearchParams(queryParams).toString();
    const queryParamsString = queryString ? `?${queryString}` : '';
  
    this.productService.getProducts(queryParamsString).subscribe((data) => {
      this.filteredProducts = data;
    });
  }
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategories = [];
    this.selectedFranchises = [];
    this.filteredProducts = [...this.products];
  }

  toggleFilter(): void {
    this.showFilter = !this.showFilter;
  }

  toggleSelection(name: string, type: 'franchise' | 'category'): void {
    if (type === 'franchise') {
      this.selectedFranchises.includes(name)
        ? this.selectedFranchises = this.selectedFranchises.filter(f => f !== name)
        : this.selectedFranchises.push(name);
    } else {
      this.selectedCategories.includes(name)
        ? this.selectedCategories = this.selectedCategories.filter(c => c !== name)
        : this.selectedCategories.push(name);
    }
  }
}
