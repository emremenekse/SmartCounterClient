import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from 'express';
import { Observable } from 'rxjs';
import { AlertifyService, MessageType, Position } from '../alertify/alertify.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor(private router: Router,private alertify: AlertifyService) {}

  public handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An unknown error occurred!';

    if (error.error instanceof ErrorEvent) {
      
      errorMessage = `Error: ${error.error.message}`;
    } else {

      if (error.error && error.error.ErrorMessage) {
        errorMessage = error.error.ErrorMessage;
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request';
            break;
          case 401:
            errorMessage = 'Unauthorized';
            break;
          case 403:
            errorMessage = 'Forbidden';
            break;
          case 404:
            errorMessage = 'Not Found';
            break;
          case 500:
            errorMessage = 'Internal Server Error';
            break;
          default:
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
      }
    }

    this.alertify.message(errorMessage);
    
  }
}
