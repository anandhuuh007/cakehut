import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  public isInitialized = false;

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {
    onAuthStateChanged(this.firebaseService.auth, (user) => {
      this.userSubject.next(user);
      this.isInitialized = true;
    });
  }

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.firebaseService.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Admin Login Error:', error);
      throw error;
    }
  }

  async anonymousLogin(): Promise<User> {
    try {
      const { signInAnonymously } = await import('firebase/auth');
      const userCredential = await signInAnonymously(this.firebaseService.auth);
      return userCredential.user;
    } catch (error) {
      console.error('Anonymous Login Error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.firebaseService.auth);
    this.router.navigate(['/admin/login']);
  }
}
