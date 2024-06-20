import { Injectable } from '@angular/core';
import { HttpClientService, RequestParameters } from '../httpClient/http-client.service';
import { Observable } from 'rxjs';
import { ReportRequestDTO } from '../../DTOs/ReportRequestDTO';
import { CreateReportRequestDTO } from '../../DTOs/CreateReportRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class ReportServiceService {
  private controllerName = 'report';

  constructor(private httpClientService: HttpClientService) { }

  createReportRequest(request: CreateReportRequestDTO): Observable<ReportRequestDTO> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: 'createReportRequest',
      port: 8002
    };
    return this.httpClientService.post<ReportRequestDTO>(requestParameters, request);
  }

   getAllReportRequests(): Observable<{ data: ReportRequestDTO[] }> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: 'getAllReportRequests',
      port: 8002
    };
    return this.httpClientService.get<{ data: ReportRequestDTO[] }>(requestParameters);
  }

  getReportRequestById(id: string): Observable<{ data: ReportRequestDTO }> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: `getReportRequestById/${id}`,
      port: 8002
    };
    return this.httpClientService.get<{ data: ReportRequestDTO }>(requestParameters);
  }
  downloadFile(filePath: string): Observable<Blob> {
    const requestParameters: Partial<RequestParameters> = {
      controller: this.controllerName,
      action: `downloadFile/${encodeURIComponent(filePath)}`,
      port: 8002
    };
    return this.httpClientService.downloadFile(requestParameters);
  }
}
