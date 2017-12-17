import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class AdminAuthGuard implements CanActivate {

  constructor(private auth: AuthService , private userService: UserService) { }

  canActivate(){
    return this.auth.appUser$()
      .map(appUser => {
        return appUser.isAdmin;
      })
  }

}
