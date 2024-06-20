import { Injectable } from '@angular/core';
import { HttpClientService, RequestParameters } from '../httpClient/http-client.service';
import { Observable } from 'rxjs';
import { MeterReadingDTO } from '../../DTOs/MeterReadingDTO';


@Injectable({
  providedIn: 'root'
})
export class CounterServiceService {

   private controllerName = 'meter';

  constructor(private httpClientService: HttpClientService) { }

  getAll(): Observable<any> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: 'getAll',
      port: 8001
    };
    return this.httpClientService.get<any>(requestParameters);
  }

  getBySerialNumberAndMeasurementTime(serialNumber: string, measurementTime: Date): Observable<{ data: MeterReadingDTO }> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: `GetBySerialNumberAndMeasurementTime/${serialNumber}/${measurementTime.toISOString()}`,
      port: 8001
    };
    return this.httpClientService.get<{ data: MeterReadingDTO }>(requestParameters);
  }

  add(meterReadingDto: MeterReadingDTO): Observable<any> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: 'add',
      port: 8001
    };
    return this.httpClientService.post<any>(requestParameters, meterReadingDto);
  }
}
