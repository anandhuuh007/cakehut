import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PRODUCTS, Product } from '../../shared/data/products';
import { Toast } from '../../shared/services/toast';
import { AdminDbService, ProductData } from '../../shared/services/admin-db.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  product?: Product;
  isLoading = true;
  notFound = false;
  activeImage: string = '';
  activeWeight: string = '';
  quantity: number = 1;
  activeTab: 'ingredients' | 'delivery' = 'ingredients';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: Toast,
    private dbService: AdminDbService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('id');
      if (!id) {
        this.setNotFound();
        return;
      }

      this.isLoading = true;
      this.notFound = false;
      this.product = undefined;
      this.cdr.detectChanges();

      try {
        const firebaseProduct = await this.dbService.getProduct(id);
        if (firebaseProduct) {
          this.setProduct(this.mapFirebaseProduct(firebaseProduct));
          return;
        }

        const staticProduct = PRODUCTS.find(p => p.id === id);
        if (staticProduct) {
          this.setProduct(staticProduct);
          return;
        }

        this.setNotFound();
      } catch (error) {
        console.error('Failed to load product:', error);
        this.setNotFound();
      }
    });
  }

  private setProduct(product: Product) {
    this.product = product;
    this.activeImage = product.image;
    this.activeWeight = product.weights?.[0]?.label ?? '1.0 kg';
    this.quantity = 1;
    this.isLoading = false;
    this.notFound = false;
    this.cdr.detectChanges();
  }

  private setNotFound() {
    this.product = undefined;
    this.isLoading = false;
    this.notFound = true;
    this.cdr.detectChanges();
  }

  private mapFirebaseProduct(data: ProductData): Product {
    const originalPrice = data.discount > 0 ? data.price + data.discount : undefined;

    return {
      id: data.id ?? data.name,
      name: data.name,
      price: `$${data.price}`,
      originalPrice: originalPrice ? `$${originalPrice}` : undefined,
      image: data.image,
      description: data.description,
      rating: 4.9,
      reviewCount: 100 + data.price * 2,
      badgeText: data.soldOut ? 'Sold Out' : data.featured ? 'Featured' : data.category,
      priceNum: data.price,
      weights: (data.weights?.length ? data.weights : ['1.0 kg']).map(label => ({
        label,
        priceMultiplier: 1,
      })),
      ingredients: [
        'Premium quality ingredients',
        'Fresh dairy and eggs',
        'Natural flavors and colors',
      ],
      deliveryInfo:
        'Delivered fresh in temperature-controlled packaging. Store refrigerated until serving.',
    };
  }

  get calculatedPrice(): number {
    if (!this.product) return 0;

    const selectedWeightObj = this.product.weights?.find(w => w.label === this.activeWeight);
    const multiplier = selectedWeightObj ? selectedWeightObj.priceMultiplier : 1;

    return Math.round(this.product.priceNum * multiplier * this.quantity);
  }

  get discountPercentage(): number {
    if (!this.product?.originalPrice) return 0;
    const original = parseFloat(this.product.originalPrice.replace('$', ''));
    if (isNaN(original) || original === 0) return 0;
    return Math.round(((original - this.product.priceNum) / original) * 100);
  }

  changeImage(img: string) {
    this.activeImage = img;
  }

  selectWeight(weight: string) {
    this.activeWeight = weight;
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  setTab(tab: 'ingredients' | 'delivery') {
    this.activeTab = tab;
  }

  buyNow() {
    if (!this.product) return;

    this.router.navigate(['/checkout'], {
      queryParams: {
        productId: this.product.id,
        weight: this.activeWeight,
        quantity: this.quantity,
        price: this.calculatedPrice,
      },
    });
  }
}
