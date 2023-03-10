import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PersistenceService } from 'src/app/core/services/persistence.service';

//Le guardie si fanno in questo modo da Angular 14 in poi, quindi molto recente, prima service molto più codice
//In pratica fai una funzione che ritorna un boolean, se è true allora Angular continua la navigazione altrimenti la blocca
//Di solito quando la blocchi fai anche navigare da qualche altra parte, come nel caso di canActivateLoggedIn

//Occhio con le guardie perchè è molto facile creare dei loop infiniti di guardie che si rimbalzano a vicenda e ti si pianta tutto il browser

//Questa funzione decide se puoi navigare alla HomePage in base all'esistenza del token, se esiste vuol dire che probabilmente l'utente è loggato e quindi può andare, altrimenti torna alla pagina di login
export function canActivateLoggedIn() {
  const router = inject(Router); //il metdo inject() serve per prendersi la classe Router
  const persistenceService = inject(PersistenceService); //il metdo inject() serve per prendersi la classe PersistenceService, che ci serve per controllare l'esistenza del token
  const token = persistenceService.getToken();

  if (!token) return router.createUrlTree(['login']); //la funzione deve tornare un oggeto che si chiama UrlTree nel caso in cui voglio far navigare con la guardia, come in questo caso in cui ti faccio tornare alla pagina di login

  return true; //in questo caso invece può tornare un boolean, e ornerà true perchè il token esiste
}

//Questa guardia invece serve ad evitare che l'utente torni alla pagina di login se è loggato, perchè è un flusso che non ha senso
//qui mi basta controllare l'esistenza del token e se esiste ti blocco, quindi ritorno false, altrimenti true e puoi andare al login
export function canActivateNotLoggedIn() {
  const persistenceService = inject(PersistenceService);
  const token = persistenceService.getToken();

  //controllare l'esistenza di una variabile solo con il ! o !! si può fare grazie al fatto che js/ts convertono tutto in un boolean (valori truty/falsy)
  //in un linguaggio senza questa funzionalità devi fare token != null o una cosa simile
  return !token; //se il token esiste tornerò false e ti blocco, altrimenti true e puoi anare al login
}
