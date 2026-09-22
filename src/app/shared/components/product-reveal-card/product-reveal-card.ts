import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-reveal-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-reveal-card.html',
  styleUrl: './product-reveal-card.css'
})
export class ProductRevealCard {
  @Input() id: string = "";
  @Input() name: string = "Premium Wireless Headphones";
  @Input() price: string = "$199";
  @Input() originalPrice?: string;
  @Input() image: string = "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop";
  @Input() description: string = "Experience studio-quality sound with advanced noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.";
  @Input() rating: number = 4.8;
  @Input() reviewCount: number = 124;
  @Input() enableAnimations: boolean = true;
  @Input() badgeText: string = "";

  @Output() add = new EventEmitter<void>();
  @Output() favorite = new EventEmitter<boolean>();

  isFavorite: boolean = false;
  isFavoriting: boolean = false;

  toggleFavorite(event: Event) {
    event.stopPropagation();
    this.isFavorite = !this.isFavorite;
    this.isFavoriting = true;
    setTimeout(() => {
      this.isFavoriting = false;
    }, 500);
    this.favorite.emit(this.isFavorite);
  }

  onAddToCart(event: Event) {
    event.stopPropagation();
    this.add.emit();
  }

  get discountPercent(): number {
    if (!this.originalPrice || !this.price) return 0;
    const orig = parseFloat(this.originalPrice.replace('$', ''));
    const curr = parseFloat(this.price.replace('$', ''));
    if (isNaN(orig) || isNaN(curr) || orig <= 0) return 0;
    return Math.round(((orig - curr) / orig) * 100);
  }

  get ratingFloor(): number {
    return Math.floor(this.rating);
  }
}
