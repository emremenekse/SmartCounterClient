export interface ReportRequestDTO {
  id: string;
  serialNumber: string;
  status: string;
  filePath: string;
  requestTime: Date;
  measurementTime: Date;
}
