import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AlertifyService, MessageType, Position } from '../alertify/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  private baseUrl: string = 'http://localhost';
  private baseApi: string = 'api';
  constructor(private httpClient: HttpClient,private alertify: AlertifyService) { }

  private url(requestParameters: Partial<RequestParameters>): string {
    return `${this.baseUrl}:${requestParameters.port}/${this.baseApi}/${requestParameters.controller}${requestParameters.action ? `/${requestParameters.action}` : ''}`;
  }

  get<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndpoint) {
      url = requestParameters.fullEndpoint;
    } else {
      url = this.url(requestParameters);
      let queryParams: string[] = [];

      if (id) {
        queryParams.push(`id=${encodeURIComponent(id)}`);
      }
      if (requestParameters.querystrings) {
        queryParams.push(requestParameters.querystrings);
      }
      let queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
      url = `${url}${queryString}`;
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.get<T>(url, { headers: requestParameters.headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  post<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndpoint) {
      url = requestParameters.fullEndpoint;
    } else {
      url = `${this.url(requestParameters)}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}`;
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.post<T>(url, body, { headers: requestParameters.headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  put<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndpoint) {
      url = requestParameters.fullEndpoint;
    } else {
      url = `${this.url(requestParameters)}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}`;
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.put<T>(url, body, { headers: requestParameters.headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }

  delete<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";
    if (requestParameters.fullEndpoint) {
      url = requestParameters.fullEndpoint;
    } else {
      url = `${this.url(requestParameters)}/${id}${requestParameters.querystrings ? `?${requestParameters.querystrings}` : ""}`;
    }
    url = url.replace(/\s/g, '');
    return this.httpClient.delete<T>(url, { headers: requestParameters.headers }).pipe(
      catchError(error => this.handleError(error))
    );
  }
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    if (error.error) {
      if (error.error.errorMessage) {
        errorMessage = error.error.errorMessage;
      }
      if (error.error.data === null) {
        this.alertify.message(errorMessage, {
          messageType: MessageType.Error,
          position: Position.TopRight,
          delay: 5
        });
      }
    }
    return throwError(() => errorMessage);
  }
  downloadFile(requestParameters: Partial<RequestParameters>): Observable<Blob> {
    const url = this.url(requestParameters);
    return this.httpClient.get(url, { responseType: 'blob' }).pipe(
      catchError(error => {
        let errorMessage = 'An error occurred while downloading the file.';

        if (error.error && error.error.ErrorMessage) {
          errorMessage = error.error.ErrorMessage;
        }

        this.alertify.message(errorMessage, {
          messageType: MessageType.Error,
          position: Position.TopRight,
          delay: 5
        });
        return throwError(() => error);
      })
    );
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  querystrings?: string;
  headers?: HttpHeaders;
  fullEndpoint?: string;
  port?: number; 
}
