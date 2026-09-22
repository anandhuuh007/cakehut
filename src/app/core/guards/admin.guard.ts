import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AdminAuthService } from '../../shared/services/admin-auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private adminAuth: AdminAuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.adminAuth.user$.pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        return this.router.createUrlTree(['/admin/login']);
      })
    );
  }
}
