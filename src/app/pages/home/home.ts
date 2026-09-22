import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductRevealCard } from '../../shared/components/product-reveal-card/product-reveal-card';
import { TestimonialsComponent } from '../../shared/components/testimonials/testimonials';
import { CtaSectionComponent } from '../../shared/components/cta-section/cta-section';
import { ProductData } from '../../shared/services/admin-db.service';
import { ProductService } from '../../shared/services/product.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductRevealCard, TestimonialsComponent, CtaSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  featuredProducts: ProductData[] = [];
  isLoading = true;
  private productsSub!: Subscription;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.productService.initializeRealTimeSync();
    this.productsSub = this.productService.products$.subscribe({
      next: (allProducts) => {
        // Filter to featured products and take up to 3
        let featured = allProducts.filter(p => p.featured).slice(0, 3);
        
        // If we don't have enough featured products, fallback to any newest products
        if (featured.length < 3) {
          const remaining = 3 - featured.length;
          const extraProducts = allProducts
            .filter(p => !p.featured)
            .slice(0, remaining);
          featured = [...featured, ...extraProducts];
        }
        this.featuredProducts = featured;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load products for homepage:', error);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
