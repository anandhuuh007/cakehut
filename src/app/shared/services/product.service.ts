import { Injectable, NgZone } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { collection, query, orderBy, onSnapshot, DocumentData } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductData } from './admin-db.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<ProductData[]>([]);
  public products$: Observable<ProductData[]> = this.productsSubject.asObservable();
  private isInitialized = false;

  constructor(
    private firebaseService: FirebaseService,
    private ngZone: NgZone
  ) {}

  initializeRealTimeSync() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const col = collection(this.firebaseService.firestore, 'cakes');
    const orderedQuery = query(col, orderBy('createdAt', 'desc'));

    const emitProducts = (querySnapshot: { docs: { id: string; data: () => DocumentData }[] }) => {
      const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductData));
      this.ngZone.run(() => {
        this.productsSubject.next(products);
      });
    };

    onSnapshot(orderedQuery, emitProducts, (error) => {
      console.warn('Ordered products listener failed, falling back to unordered sync:', error);
      onSnapshot(col, emitProducts, (fallbackError) => {
        console.error('Error in real-time products sync:', fallbackError);
      });
    });
  }
}
