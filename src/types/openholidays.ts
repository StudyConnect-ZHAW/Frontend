// * Type definitions for data received from the OpenHolidays API

export interface HolidayName {
    language: string;
    text: string;
  }
  
export interface HolidaySubdivision {
    code: string;
    shortName: string;
  }
  
export interface OpenHoliday {
    id: string;
    startDate: string;
    endDate: string;
    name: HolidayName[];
    nationwide: boolean;
    regionalScope: string;
    subdivisions: HolidaySubdivision[];
    temporalScope: string;
    type: string;
  }