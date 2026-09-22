import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuthService } from '../../shared/services/admin-auth.service';
import { AdminDbService, ProductData, OrderData } from '../../shared/services/admin-db.service';
import { Subscription } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { Toast } from '../../shared/services/toast';
import { Router } from '@angular/router';
import { FirebaseService } from '../../shared/services/firebase.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit, OnDestroy {
  // Authentication State
  isLoggedIn = false;
  authLoading = false;
  authError = '';
  userEmail = '';
  password = '';
  
  // Dashboard Navigation
  activeTab: 'overview' | 'products' | 'orders' = 'overview';
  
  // Dev Bypass for local layout testing
  devBypassCount = 0;
  async triggerBypass() {
    this.devBypassCount++;
    if (this.devBypassCount >= 3) {
      try {
        await this.adminAuthService.anonymousLogin();
        // The auth state listener in ngOnInit will automatically handle the rest
      } catch (error) {
        console.warn('Anonymous login failed. Falling back to local bypass.', error);
        this.isLoggedIn = true;
        this.userEmail = 'dev-bypass@sweetlayers.com';
        this.loadDashboardData();
      }
    }
  }
  
  // Data State
  isLoading = false;
  products: ProductData[] = [];
  orders: OrderData[] = [];
  
  // Stats
  totalRevenue = 0;
  totalOrders = 0;
  activeProductsCount = 0;
  pendingOrdersCount = 0;
  
  // Product Form Modal State
  showProductModal = false;
  isEditingProduct = false;
  weightInput = '';
  imageUploading = false;
  
  productForm: Omit<ProductData, 'id' | 'createdAt'> & { id?: string } = {
    name: '',
    image: '',
    description: '',
    price: 0,
    discount: 0,
    category: 'Classic',
    featured: false,
    soldOut: false,
    weights: ['1.0 kg']
  };

  private authSubscription!: Subscription;

  constructor(
    private adminAuthService: AdminAuthService,
    private adminDbService: AdminDbService,
    private cdr: ChangeDetectorRef,
    private toast: Toast,
    private firebaseService: FirebaseService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.authLoading = true;
    this.authSubscription = this.adminAuthService.user$.subscribe((user) => {
      this.ngZone.run(() => {
        this.authLoading = false;
        if (user) {
          this.isLoggedIn = true;
          this.userEmail = user.email || 'Admin';
          this.loadDashboardData();
        } else {
          this.isLoggedIn = false;
          this.userEmail = '';
        }
        this.cdr.detectChanges();
      });
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  // --- Auth Actions ---
  async login() {
    if (!this.userEmail || !this.password) {
      this.authError = 'Please fill in all fields.';
      return;
    }
    
    this.authLoading = true;
    this.authError = '';
    
    try {
      await this.adminAuthService.login(this.userEmail, this.password);
      this.password = '';
    } catch (error: any) {
      console.error(error);
      this.authError = error.message || 'Login failed. Please check your credentials.';
    } finally {
      this.authLoading = false;
      this.cdr.detectChanges();
    }
  }

  async logout() {
    try {
      this.isLoading = true;
      await this.adminAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // --- Data Fetching ---
  async loadDashboardData() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.loadProducts(),
        this.loadOrders()
      ]);
      this.calculateStats();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async loadProducts() {
    this.products = await this.adminDbService.getProducts();
  }

  async loadOrders() {
    this.orders = await this.adminDbService.getOrders();
  }

  calculateStats() {
    this.totalOrders = this.orders.length;
    this.activeProductsCount = this.products.length;
    
    this.pendingOrdersCount = this.orders.filter(
      order => order.orderStatus?.toLowerCase() === 'pending' || order.orderStatus?.toLowerCase() === 'processing'
    ).length;
    
    this.totalRevenue = this.orders
      .filter(order => order.orderStatus?.toLowerCase() === 'delivered' || order.paymentStatus?.toLowerCase() === 'completed' || order.paymentStatus?.toLowerCase() === 'paid')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }

  // --- Product Modal CRUD ---
  openAddProductModal() {
    this.isEditingProduct = false;
    this.productForm = {
      name: '',
      image: '',
      description: '',
      price: 0,
      discount: 0,
      category: 'Classic',
      featured: false,
      soldOut: false,
      weights: ['1.0 kg']
    };
    this.weightInput = '';
    this.showProductModal = true;
  }

  openEditProductModal(product: ProductData) {
    this.isEditingProduct = true;
    this.productForm = {
      id: product.id,
      name: product.name,
      image: product.image,
      description: product.description,
      price: product.price,
      discount: product.discount,
      category: product.category || 'Classic',
      featured: product.featured || false,
      soldOut: product.soldOut || false,
      weights: product.weights && product.weights.length ? [...product.weights] : ['1.0 kg']
    };
    this.weightInput = '';
    this.showProductModal = true;
    this.cdr.detectChanges();
  }

  closeProductModal() {
    this.showProductModal = false;
    this.cdr.detectChanges();
  }

  // File selected from local device
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.imageUploading = true;
      this.cdr.detectChanges();

      try {
        const base64String = await this.compressImageToBase64(file);
        this.productForm.image = base64String;
        this.toast.show('Image uploaded successfully!', 'success');
      } catch (compressError) {
        console.error('Image compression failed:', compressError);
        this.toast.show('Failed to process image. Please try again.', 'error');
      } finally {
        this.imageUploading = false;
        this.cdr.detectChanges();
      }
    }
  }

  compressImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      // Safety timeout just in case it hangs
      const timeout = setTimeout(() => reject(new Error('Image compression timed out')), 10000);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const max_size = 600;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > max_size) {
                height *= max_size / width;
                width = max_size;
              }
            } else {
              if (height > max_size) {
                width *= max_size / height;
                height = max_size;
              }
            }
            
            canvas.width = Math.max(1, width);
            canvas.height = Math.max(1, height);
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');
            
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            clearTimeout(timeout);
            resolve(dataUrl);
          } catch (e) {
            clearTimeout(timeout);
            reject(e);
          }
        };
        
        img.onerror = (err) => {
          clearTimeout(timeout);
          reject(err || new Error('Image failed to load'));
        };

        // Important: set src AFTER onload
        img.src = event.target?.result as string;
      };
      
      reader.onerror = (err) => {
        clearTimeout(timeout);
        reject(err || new Error('FileReader failed'));
      };
      
      reader.readAsDataURL(file);
    });
  }

  // Weight chips management
  addWeight() {
    const val = this.weightInput.trim();
    if (val && !this.productForm.weights.includes(val)) {
      this.productForm.weights.push(val);
      this.weightInput = '';
    }
  }

  removeWeight(index: number) {
    if (this.productForm.weights.length > 1) {
      this.productForm.weights.splice(index, 1);
    }
  }

  // Save product
  async saveProduct() {
    if (!this.productForm.name || !this.productForm.price || !this.productForm.image) {
      this.toast.show('Please fill in all required fields, including the Cake Image.', 'error');
      return;
    }

    this.isLoading = true;
    try {
      const { id, ...productPayload } = this.productForm;
      const isNewProduct = !this.isEditingProduct;
      if (this.isEditingProduct && id) {
        await this.adminDbService.updateProduct(id, productPayload);
      } else {
        await this.adminDbService.addProduct(productPayload);
      }
      this.showProductModal = false;
      this.toast.show('Product saved successfully!', 'success');
      
      await this.loadProducts();
      this.calculateStats();
    } catch (error) {
      console.error('Error saving product:', error);
      this.toast.show('Could not save product. Please try again.', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // Delete product
  async deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading = true;
      try {
        await this.adminDbService.deleteProduct(id);
        this.toast.show('Product deleted successfully.', 'success');
        await this.loadProducts();
        this.calculateStats();
      } catch (error) {
        console.error('Error deleting product:', error);
        this.toast.show('Could not delete product.', 'error');
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }
  }

  // --- Order Status Management ---
  async updateOrderStatus(orderId: string, event: Event) {
    const newStatus = (event.target as HTMLSelectElement).value;
    this.isLoading = true;
    try {
      await this.adminDbService.updateOrderStatus(orderId, newStatus);
      this.toast.show('Order status updated.', 'success');
      await this.loadOrders();
      this.calculateStats();
    } catch (error) {
      console.error('Error updating order status:', error);
      this.toast.show('Could not update order status.', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  // --- Seeder for Sample Data ---
  async seedSampleProducts() {
    if (confirm('This will seed 5 delicious default cakes into your database. Continue?')) {
      this.isLoading = true;
      try {
        const samples: Omit<ProductData, 'id' | 'createdAt'>[] = [
          {
            name: "Signature Belgian Fudge",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
            description: "Layers of rich moist chocolate fudge cake filled and coated with smooth premium Belgian chocolate ganache.",
            price: 39,
            discount: 16,
            category: "Classic",
            featured: true,
            soldOut: false,
            weights: ["1.0 kg", "1.5 kg", "2.0 kg"]
          },
          {
            name: "Red Velvet Supreme",
            image: "https://images.unsplash.com/photo-1616260888915-6387de6f9ecf?w=600&auto=format&fit=crop&q=80",
            description: "Classic Southern red velvet layers filled and frosted with our signature light cream cheese frosting.",
            price: 45,
            discount: 15,
            category: "Classic",
            featured: true,
            soldOut: false,
            weights: ["1.0 kg", "1.5 kg"]
          },
          {
            name: "Classic Strawberry Cream",
            image: "https://images.unsplash.com/photo-1464349172961-104d33a55191?w=600&auto=format&fit=crop&q=80",
            description: "Light vanilla sponge cake layered with fresh handpicked strawberries and clouds of whipped cream.",
            price: 35,
            discount: 13,
            category: "Classic",
            featured: false,
            soldOut: false,
            weights: ["1.0 kg", "2.0 kg"]
          },
          {
            name: "Decadent Caramel Cheesecake",
            image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80",
            description: "Rich and creamy cheesecake topped with a generous layer of house-made golden caramel sauce and toasted pecans.",
            price: 42,
            discount: 8,
            category: "Cheesecake",
            featured: true,
            soldOut: false,
            weights: ["1.0 kg", "1.5 kg"]
          },
          {
            name: "Sugar-Free Fruity Dream",
            image: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=600&auto=format&fit=crop&q=80",
            description: "Guilt-free dessert naturally sweetened with Stevia extract and decorated with vibrant fresh berries.",
            price: 34,
            discount: 8,
            category: "Sugar-Free",
            featured: false,
            soldOut: true,
            weights: ["1.0 kg"]
          }
        ];

        for (const item of samples) {
          await this.adminDbService.addProduct(item);
        }

        this.toast.show('Sample cakes seeded successfully!', 'success');
        await this.loadProducts();
        this.calculateStats();
      } catch (error) {
        console.error('Error seeding sample data:', error);
        this.toast.show('Could not seed sample data.', 'error');
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    }
  }
}
