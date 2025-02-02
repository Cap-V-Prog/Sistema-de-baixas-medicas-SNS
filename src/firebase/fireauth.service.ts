import { Injectable } from '@angular/core';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  User,
  UserCredential,
  browserSessionPersistence,
  browserLocalPersistence
} from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FireauthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor(private auth: Auth) {
    this.listenToAuthStateChanges();
  }

  private listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user:any) => {
      this.userSubject.next(user);
    });
  }

  public isLoggedIn(): boolean {
    return this.userSubject.value !== null;
  }

  public getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  public async register(email: string, password: string): Promise<UserCredential | null> {
    try {
      const cred = await createUserWithEmailAndPassword(this.auth, email, password);
      return cred;
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    }
  }

  public async login(email: string, password: string, rememberMe: boolean=true): Promise<UserCredential> {
    try {
      await this.auth.setPersistence(rememberMe ? browserLocalPersistence : browserSessionPersistence);
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  public async signOut(): Promise<void> {
    await this.auth.signOut();
  }
}
