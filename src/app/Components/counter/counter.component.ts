import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MeterReadingDTO } from '../../DTOs/MeterReadingDTO';
import { CounterServiceService } from '../../services/counterService/counter-service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReportServiceService } from '../../services/reportService/report-service.service';
import { CreateReportRequestDTO } from '../../DTOs/CreateReportRequestDTO';
import { AlertifyService, MessageType, Position } from '../../services/alertify/alertify.service';

@Component({
  selector: 'app-counter',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,HttpClientModule],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent implements OnInit {
  meterReadingForm!: FormGroup;
  meterReadings: MeterReadingDTO[] = [];
  filteredReadings: MeterReadingDTO[] = [];
  filterSerialNumber: string = '';

  constructor(private fb: FormBuilder, private counterService: CounterServiceService,private reportService: ReportServiceService,private alertify: AlertifyService) { }

  ngOnInit(): void {
    this.meterReadingForm = this.fb.group({
      serialNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      measurementTime: ['', Validators.required],
      lastIndex: ['', Validators.required],
      voltage: ['', Validators.required],
      current: ['', Validators.required]
    });

    this.loadReadings();
  }

  loadReadings(): void {
    this.counterService.getAll().subscribe(data => {
      this.meterReadings = data.data;
      this.filteredReadings = data.data;
      
    });
  }

  onSubmit(): void {
    if (this.meterReadingForm.valid) {
      const newReading: MeterReadingDTO = this.meterReadingForm.value;
      this.counterService.add(newReading).subscribe(() => {
        this.loadReadings();
        this.meterReadingForm.reset();
      });
    }
  }
  onCreateReport(reading: any): void {
    const request: CreateReportRequestDTO = {
      serialNumber: reading.serialNumber,
      measurementTime: reading.measurementTime
    };
    this.reportService.createReportRequest(request).subscribe((data) => {
      this.alertify.message('Report request successfully created.', {
          messageType: MessageType.Success,
          position: Position.TopRight,
          delay: 5
        });
    });
    
  }
  applyFilter(): void {
    this.filteredReadings = this.meterReadings.filter(reading =>
      reading.serialNumber.includes(this.filterSerialNumber)
    );
  }
}