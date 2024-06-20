import { Component, OnInit } from '@angular/core';
import { MeterReadingDTO } from '../../DTOs/MeterReadingDTO';
import { ReportRequestDTO } from '../../DTOs/ReportRequestDTO';
import { ReportServiceService } from '../../services/reportService/report-service.service';
import { CounterServiceService } from '../../services/counterService/counter-service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss'
})
export class ReportComponent implements OnInit {
  reportRequests: ReportRequestDTO[] = [];
  selectedReport: ReportRequestDTO | null = null;
  meterReadings: MeterReadingDTO[] = [];
  selectedSerialNumber: string = '';
  selectedMeasurementTime: Date | null = null;
  showModal: boolean = false;
  meterReading: MeterReadingDTO | null = null;

  constructor(private reportService: ReportServiceService, private counterService: CounterServiceService) { }

  ngOnInit(): void {
    this.loadReportRequests();
  }

  loadReportRequests(): void {
    this.reportService.getAllReportRequests().subscribe(data => {
      this.reportRequests = data.data;
    });
  }


  onShowDetails(request: ReportRequestDTO): void {
  this.counterService.getBySerialNumberAndMeasurementTime(request.serialNumber, new Date(request.measurementTime))
    .subscribe(response => {
      console.log(response);
      this.meterReading = response.data;
      this.showModal = true;
    });
}


  closeModal(): void {
    this.showModal = false;
    this.meterReading = null;
  }

  onDownloadReport(reportId: string): void {
    this.reportService.getReportRequestById(reportId).subscribe(response => {
      const filePath = response.data.filePath;

     this.reportService.downloadFile(filePath).subscribe(blob => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = filePath.split('\\').pop() || 'download';
        link.click();
        window.URL.revokeObjectURL(url);
      });
    }
  );
  }
}
