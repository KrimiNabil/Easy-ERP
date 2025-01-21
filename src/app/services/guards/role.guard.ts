import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Array<string>;
    const user = sessionStorage.getItem('user') || "";
    const userRole =jwtDecode(user)

    // Check if user's role is in the list of allowed roles
    // if (allowedRoles.includes(userRole.)) {
    //   return true;
    // }

    // Redirect to an unauthorized page or home page
    this.router.navigate(['/unauthorized']);
    return false;
  }
}





// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RoleGuard implements CanActivate {
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
//     return true;
//   }
  
// }
