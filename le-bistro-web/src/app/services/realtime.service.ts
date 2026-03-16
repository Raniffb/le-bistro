import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeService {
  private readonly socket: Socket = io('http://localhost:3000/realtime');

  onOrdersUpdated(): Observable<void> {
    return new Observable((observer) => {
      const handler = () => observer.next();

      this.socket.on('orders.updated', handler);

      return () => {
        this.socket.off('orders.updated', handler);
      };
    });
  }

  onMenuItemsUpdated(): Observable<void> {
    return new Observable((observer) => {
      const handler = () => observer.next();

      this.socket.on('menu-items.updated', handler);

      return () => {
        this.socket.off('menu-items.updated', handler);
      };
    });
  }
}
