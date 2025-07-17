import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
} from 'rxjs/operators';
import { environment } from '@environments/environment';
import { RxStomp } from '@stomp/rx-stomp';
import { AuthService } from './auth.service';

type ConnectionState = 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private rxStomp: RxStomp;

  private state = new BehaviorSubject<ConnectionState>('DISCONNECTED');

  constructor(private authService: AuthService) {
    this.rxStomp = new RxStomp();
    this.setupStateTracking();
    this.manageConnection();
  }

  private setupStateTracking(): void {
    this.rxStomp.connectionState$.subscribe((stompState) => {
      switch (stompState) {
        case 0:
          this.state.next('CONNECTED');
          break;
        case 1:
          this.state.next('CONNECTING');
          break;
        default:
          this.state.next('DISCONNECTED');
          break;
      }
    });
  }

  private manageConnection(): void {
    this.authService
      .getAuthTokenObservable()
      .pipe(distinctUntilChanged())
      .subscribe((token) => {
        if (token && this.state.value === 'DISCONNECTED') {
          console.log(
            'Token de autenticación detectado. Conectando WebSocket...'
          );
          this.connect(token);
        } else if (!token && this.state.value !== 'DISCONNECTED') {
          console.log('Sin token de autenticación. Desconectando WebSocket...');
          this.disconnect();
        }
      });
  }

  private connect(authToken: string): void {
    if (this.state.value === 'CONNECTED' || this.state.value === 'CONNECTING') {
      console.log('Ya está conectado o conectándose.');
      return;
    }

    this.rxStomp.configure({
      brokerURL: environment.wsApiUrl,
      connectHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
      debug: (str) => {
        console.log('STOMP Debug: ' + str);
      },
      reconnectDelay: 5000,
    });

    this.rxStomp.activate();
  }

  public disconnect(): void {
    this.rxStomp.deactivate();
  }

  public getState(): Observable<ConnectionState> {
    return this.state.asObservable();
  }

  public watch<T>(channel: string): Observable<T> {
    return this.rxStomp.watch(channel).pipe(
      map((message) => {
        return JSON.parse(message.body) as T;
      })
    );
  }

  public publish(destination: string, payload: any): void {
    this.rxStomp.publish({
      destination: destination,
      body: JSON.stringify(payload),
    });
  }
}
