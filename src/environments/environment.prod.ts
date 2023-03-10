//Angular scambia il file environments o environment.prod in base a come builda (dev di default o --prod per production)
export const environment = {
  production: true,
  apiUrl: 'https://dummyjson.com', //così hai la varbiaile di ambiente che cambia in base a come buildi l'applicazione (ionic build, ionic build --prod)
};
