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
  user?: User | null; //Esiste un modo migliore per fare questa cosa ma per ora lo facciamo così

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    //quando il componente si inizializza chiamo l'api
    this.userService
      .getUser()
      .pipe(
        tap((response) => {
          this.user = response; //e come side effect se la chiamata va a buon fine assegno la proprietà user della nostra classe HomePage
        })
      )
      .subscribe(); //ricorda sempre il subscribe sennò non parte la chiamata
    //ricorda che come buona prassi non va messa logica nel subscribe (per una questione di stile principalmente)
  }

  async askForLogout() {
    //mostro l'alert come nella doc di IOnic
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
            //questa arrow function contiene la funzione che viene chiamata se l'utente clicca su OK
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }

  private logout() {
    this.authService
      .logout() //chiamo l'eventuale api (in questo caso non c'era ma ho scritto il codice facendo finta che ci fosse)
      .pipe(
        tap(() => {
          this.router.navigateByUrl('login'); //e come side effect ritorno al login se va tutto a buon fine
        })
      )
      .subscribe(); //ricorda sempre il subscribe sennò non parte la chiamata
    //ricorda che come buona prassi non va messa logica nel subscribe (per una questione di stile principalmente)
  }
}
