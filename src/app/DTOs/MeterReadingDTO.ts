export interface MeterReadingDTO {
  id: string;
  serialNumber: string;
  measurementTime: Date;
  lastIndex: number;
  voltage: number;
  current: number;
}
