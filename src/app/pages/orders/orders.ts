import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminDbService } from '../../shared/services/admin-db.service';
import { ChangeDetectorRef } from '@angular/core';

interface OrderItem {
  orderId: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: string;
  };
  weight: string;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerPincode?: string;
  date: string;
  status: string;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders implements OnInit {
  orders: any[] = [];
  isLoading = true;

  constructor(
    private dbService: AdminDbService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  async loadOrders() {
    this.isLoading = true;
    const savedIds = localStorage.getItem('my_order_ids');
    if (savedIds) {
      try {
        const ids: string[] = JSON.parse(savedIds);
        const fetchedOrders: any[] = [];
        for (const id of ids) {
          const order = await this.dbService.getOrder(id);
          if (order) {
             order.status = order.orderStatus || order.status || 'Baking';
             fetchedOrders.push(order);
          }
        }
        fetchedOrders.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
        this.orders = fetchedOrders;
      } catch (e) {
        console.error('Failed to load orders from Firestore', e);
        this.orders = [];
      }
    }
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'baking':
        return 'bg-amber-100 text-amber-900 border-amber-200/50';
      case 'delivering':
        return 'bg-blue-100 text-blue-900 border-blue-200/50';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-900 border-emerald-200/50';
      default:
        return 'bg-zinc-100 text-zinc-900 border-zinc-200/50';
    }
  }

  clearOrders() {
    localStorage.removeItem('my_order_ids');
    this.orders = [];
  }
}
