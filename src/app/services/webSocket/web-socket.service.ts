import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private subject: Subject<MessageEvent>;

  constructor() {
    this.socket = new WebSocket('');
    this.subject = new Subject<MessageEvent>();
  }

  public connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
    }
    return this.subject;
  }

  private create(url: string): Subject<MessageEvent> {
    this.socket = new WebSocket(url);

    const observable = new Observable((obs: Observer<MessageEvent>) => {
      this.socket.onmessage = obs.next.bind(obs);
      this.socket.onerror = obs.error.bind(obs);
      this.socket.onclose = obs.complete.bind(obs);
      return () => this.socket.close();
    });

    const observer = {
      next: (data: Object) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }

  public send(data: any): void {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }
}
