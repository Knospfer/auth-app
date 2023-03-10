import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  Credentials,
  PersistenceService,
} from 'src/app/core/services/persistence.service';

//L'interceptor è la parte più complicata
//Questo interceptor fa due cose: (e per questo protrebbe essere diviso in due interceptors diversi)
//- autentica le chiamate API aggiungendo il JWT negli header di ogni chiamata: Authorization: Bearer [valore del token]
//- refresha  il token nel caso in cui ricevo un 401(unhautorized) durante una chiamata che non è login, quindi è una chiamta fatta con un token scaduto che va aggiornato
@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  //deve implementare questa classe così ti da il metodo corretto che verrà chiamato automaticamente da Angular ogni volta che viene fatta una chiamata API
  constructor(
    private persistenceService: PersistenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  //ogni volta che viene fatta una chiamata API Angular chiamerà il metodo intercept()
  intercept(
    req: HttpRequest<any>, //questo oggetto è la richiesta in corso
    next: HttpHandler //questo oggetto si occupa di inoltrare la richiesta, infatti ha solo un metodo che è handle (gestisci in inglese)
  ): Observable<HttpEvent<any>> {
    if (req.method.includes('/auth/login')) return next.handle(req); //se sto facendo la chiamata di login non mi interessa se mi da errori di autenticazione (401) perchè può essere che l'utente sbagli la password o la mail, quindi ritorno il default che  è next.hanlde(req)

    //Se invece non sto facendo il login devo autenticare la chiamata col token
    const token = this.persistenceService.getToken(); //prendo il token
    const authorizedRequest = req.clone({
      //aggiungo il token agli header della chiamata, ATTENZIONE la req (request) va sempre clonata perchè è immutabile
      setHeaders: { Authorization: `Bearer ${token}` }, //in questo modo aggiungo l'header col token al clone della richiesta di partenza (req)
    });

    return next.handle(authorizedRequest).pipe(
      //inoltro la chiamata e gestisco l'errore stile RxJs, perchè Angular si basa sempre sugli Observables (che fanno parte di RxJs)
      catchError((error: HttpErrorResponse) => {
        //Se ricevo un errore di tipo HttpErrorResponse
        if (error.status !== 401) return throwError(() => error); //se  non è un 401 allora è giusto che questo errore continui per la sua strada quindi lo ritorno come osservabile

        //se invece è un 401 allora vuol dire che ho fatto una chiamata api con un token scaduto, perchè a questo punto del codice sono sicuro 100% che non ho fatto chiamate di login
        const credentials = this.persistenceService.getCredentials(); //prendo le credenziali dell'utente
        if (!credentials) return this.forceLogout(error); //se non ho le credenziali per qualche strano motivo allora chiamo la funzione che forza il logout e torna alla pagina di login (non dovrebbe succedere mai)

        return this.refreshToken(req, next, credentials); //chiamo la mia funzione per refreshare il token, che in pratica rifà la login con le credeziali che mi sono salvato quando ho fatto il primo login
      })
    );
  }

  //ho fatto questa funzione per rendere più ordinato il codice, le funzioni idealmente devono sempre essere corte,coincise e con un nome chiaro che spiega bene cosa fanno
  //Questa funzione rifà il login, se da errore per qualche motivo forza il logout, altrimenti logga (qidindi aggiorna  il token) e fa continuare il flusso dell'intercetor
  private refreshToken(
    req: HttpRequest<any>,
    next: HttpHandler,
    credentials: Credentials
  ): Observable<HttpEvent<any>> {
    return this.authService
      .login(credentials.username, credentials.password) //chiamo l'api di login, che se vai a vedere cosa fa salva il token e le credenziali tutte le volte che il login a a buon fine
      .pipe(
        catchError((error: HttpErrorResponse) => {
          //gestisco l'errore nel caso ci sia
          return this.forceLogout(error); //se ci sono errori significa che c'è qualche problema con le credenziali quindi l'utente si dovraà riloggare a mano, qundi forzo il logout
        }),
        switchMap(() => next.handle(req)) //se invece va tutto bene cambio osservabile: passo da quello della chiamata api di login a questo nella arrow function che torna il metodo che serve all'interceptor per continuare a gestire la sua chiamata iniziale, quella per cui abbaimo ricevuto il 401 all'inzio di tutto il flusso
      );
  }

  private forceLogout(error: HttpErrorResponse) {
    this.persistenceService.clearStorage(); //pulisco lo storage (in queso senso forzo il logout)
    this.router.navigateByUrl('login'); //navigo alla pagina di login

    return throwError(() => error); //ritorno l'osservabile contentne l'errore della chiamata, questo l'ho messo per comodità perchè questa funzione viene chiamta sempre all'interno di una catchError che vuole sempre che si ritorni un osservabiloe alla sua chiusura, e questo è il modo standard di farlo
  }
}
