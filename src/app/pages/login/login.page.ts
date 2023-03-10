import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  form = new FormGroup({
    username: new FormControl<string>('kminchelle', {
      validators: [Validators.required],
    }),
    password: new FormControl<string>('0lelplR', {
      validators: [Validators.required],
    }),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  login() {
    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();
    if (!username || !password) return;

    this.authService
      .login(username, password)
      .pipe(
        tap(() => {
          this.presentSuccessToast();
          this.router.navigateByUrl('home');
        }),
        catchError((error: HttpErrorResponse) => {
          this.showErrorAlert(error.message);

          return throwError(() => error);
        })
      )
      .subscribe();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    await alert.present();
  }

  private async presentSuccessToast() {
    const toast = await this.toastController.create({
      message: 'Login completed!',
      duration: 1000,
      position: 'bottom',
    });

    await toast.present();
  }
}
