import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideFirestore,getFirestore} from "@angular/fire/firestore";
import {provideFirebaseApp,initializeApp} from "@angular/fire/app";


import { routes } from './app.routes';
import {environment} from "../enviroment";
import {getAuth, provideAuth} from '@angular/fire/auth';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(()=>initializeApp(environment.firebaseConfig)),
    provideFirestore(()=>getFirestore()),
    provideAuth(() => getAuth())
  ]
};
