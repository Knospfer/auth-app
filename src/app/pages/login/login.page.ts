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
  //Questo è un formGroup base, gli ho messo di default le credenziali di accesso così non le devi scrivere a mano tutte le volte
  //se le cancelli vedrai nella grafica che ti mostra un messaggio di errore perchè il form non è valido
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
    if (this.form.invalid) return; //se il form non è valido mi fermo qua

    const { username, password } = this.form.getRawValue(); //prendo i campi dal form con il destructuring operator
    if (!username || !password) return; //se per qualche motivo non ho username O password mi fermo qua (inoltre aiuta il controllo dei tipi dell'intellisense, string? e string non sono la stessa cosa perchè string? può anche essere undefined)

    this.authService
      .login(username, password)
      .pipe(
        tap(() => {
          //aggiungo un side effect nel caso in cui la chiamata va a buon fine (cioè il contenuto della arrow function)
          this.presentSuccessToast(); //mostro il toast che dice che è andato tutto bene
          this.router.navigateByUrl('home'); //navigo alla  home
        }),
        catchError((error: HttpErrorResponse) => {
          //gestisco il caso in cui la chiamata dia errore (mettendo anche il tipo HttpErrorResponse)
          this.showErrorAlert(error.message); //mostro un alert con l'errore della chiamata che mi manda il backend (non sempre va bene fare così, dipedne dal backend)

          return throwError(() => error); //in questo caso devi ritornare l'errore così com'è come osservabile con questo operatore
        })
      )
      .subscribe(); //ricorda sempre il subscribe sennò non parte la chiamata
    //ricorda che come buona prassi non va messa logica nel subscribe (per una questione di stile principalmente)
  }

  private async showErrorAlert(message: string) {
    //mostro l'alert come fanno nell'esempio della doc di Ionic

    //Così preparo l'alert
    const alert = await this.alertController.create({
      header: 'Error',
      message, //è l'equivalente di fare 'message': message (<- variabile)
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        },
      ],
    });

    //costì lo mostro
    await alert.present();
  }

  private async presentSuccessToast() {
    //mostro il toast come nella doc di Ionic

    //così lo preparo
    const toast = await this.toastController.create({
      //ricorda async await, async dice che questa funzione sarà asincrona, await lo usi per aspettare il completamento di una funziona asincrona, in questo caso this.toastController.create
      message: 'Login completed!',
      duration: 1000,
      position: 'bottom',
    });

    //così lo mostro
    await toast.present();
  }
}
