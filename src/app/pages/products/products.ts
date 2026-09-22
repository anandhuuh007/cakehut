import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRevealCard } from '../../shared/components/product-reveal-card/product-reveal-card';
import { ProductService } from '../../shared/services/product.service';
import { ProductData } from '../../shared/services/admin-db.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductRevealCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit, OnDestroy {
  searchQuery: string = '';
  sortBy: string = 'featured';
  selectedCategory: string = 'All';
  allProducts: ProductData[] = [];
  
  categories: string[] = ['All', 'Featured Cakes', 'Chocolate Cakes', 'Birthday Cakes', 'Wedding Cakes', 'Cheesecakes', 'Cupcakes'];

  private productsSub!: Subscription;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.initializeRealTimeSync();
    this.productsSub = this.productService.products$.subscribe(products => {
      this.allProducts = products;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }

  get filteredProducts(): ProductData[] {
    let products = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    if (this.selectedCategory !== 'All') {
      if (this.selectedCategory === 'Featured Cakes') {
        products = products.filter(p => p.featured);
      } else {
        products = products.filter(p => p.category === this.selectedCategory || p.category === this.selectedCategory.replace(' Cakes', ''));
      }
    }

    if (this.sortBy === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'featured') {
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return products;
  }

  onSearch(event: Event) {
    this.searchQuery = (event.target as HTMLInputElement).value;
  }

  onSortChange(event: Event) {
    this.sortBy = (event.target as HTMLSelectElement).value;
  }
  
  setCategory(category: string) {
    this.selectedCategory = category;
  }
}
