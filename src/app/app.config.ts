import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(environment.firebaseConfig))
    ),
    importProvidersFrom(
      provideAuth(() => {
        const auth = getAuth();
        if (!environment.production) {
          connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
            disableWarnings: true,
          });
        }
        return auth;
      })
    ),
    importProvidersFrom(
      provideFirestore(() => {
        const firestore = getFirestore();
        if (!environment.production) {
          connectFirestoreEmulator(firestore, 'localhost', 8080);
        }
        return firestore;
      })
    ),
  ],
};
