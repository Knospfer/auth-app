import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { tap } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user?: User | null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService
      .getUser()
      .pipe(tap((response) => (this.user = response)))
      .subscribe();
  }

  async askForLogout() {
    const alert = await this.alertController.create({
      header: 'Info',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  private logout() {
    this.authService
      .logout()
      .pipe(
        tap(() => {
          this.router.navigateByUrl('login');
        })
      )
      .subscribe();
  }
}
