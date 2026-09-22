import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PRODUCTS, Product } from '../../shared/data/products';
import { Toast } from '../../shared/services/toast';
import { AdminDbService } from '../../shared/services/admin-db.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  product: Product | undefined;
  weight: string = '';
  quantity: number = 1;
  totalPrice: number = 0;

  // Form Fields
  customerName: string = '';
  customerPhone: string = '';
  customerAddress: string = '';
  customerPincode: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toast: Toast,
    private dbService: AdminDbService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      const productId = params['productId'];
      this.weight = params['weight'] || '1.0 kg';
      this.quantity = +params['quantity'] || 1;
      this.totalPrice = +params['price'] || 0;

      if (productId) {
        const firestoreProduct = await this.dbService.getProduct(productId);
        if (firestoreProduct) {
          this.product = {
            id: firestoreProduct.id ?? firestoreProduct.name,
            name: firestoreProduct.name,
            price: `$${firestoreProduct.price}`,
            image: firestoreProduct.image,
            description: firestoreProduct.description,
            rating: 4.9,
            reviewCount: 100,
            priceNum: firestoreProduct.price
          };
        } else {
          this.product = PRODUCTS.find(p => p.id === productId);
        }
      }
    });
  }

  async onSubmit() {
    if (!this.customerName.trim()) {
      this.toast.show('Please enter your name.', 'error');
      return;
    }
    if (!this.customerPhone.trim()) {
      this.toast.show('Please enter your phone number.', 'error');
      return;
    }
    if (!this.customerAddress.trim()) {
      this.toast.show('Please enter your delivery address.', 'error');
      return;
    }
    if (!this.customerPincode.trim()) {
      this.toast.show('Please enter your pincode.', 'error');
      return;
    }

    const newOrder = {
      orderId: 'SL-' + Math.floor(100000 + Math.random() * 900000),
      product: {
        id: this.product?.id || '',
        name: this.product?.name || '',
        image: this.product?.image || '',
        price: this.product?.price || ''
      },
      weight: this.weight,
      quantity: this.quantity,
      totalPrice: this.totalPrice,
      totalAmount: this.totalPrice,
      customerName: this.customerName,
      customerPhone: this.customerPhone,
      customerAddress: this.customerAddress,
      customerPincode: this.customerPincode,
      date: new Date().toISOString(),
      status: 'Baking',
      orderStatus: 'Baking',
      paymentStatus: 'Pending'
    };

    try {
      const docId = await this.dbService.addOrder(newOrder);
      const myOrderIds = JSON.parse(localStorage.getItem('my_order_ids') || '[]');
      myOrderIds.unshift(docId);
      localStorage.setItem('my_order_ids', JSON.stringify(myOrderIds));

      this.toast.show('Order Placed Successfully! Your cake is baking.', 'success');
      this.router.navigate(['/orders']);
    } catch (error) {
      console.error('Error placing order:', error);
      this.toast.show('Failed to place order. Please try again.', 'error');
    }
  }
}
