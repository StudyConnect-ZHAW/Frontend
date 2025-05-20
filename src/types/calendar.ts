// * Type definitions for ZHAW schedule and mapped calendar events

export interface ZhawEvent {
    startTime: string;
    endTime: string;
    name?: string;
    description?: string;
    type?: string;
  }
  
export interface ZhawDay {
    date: string;
    events: ZhawEvent[];
  }
  
export interface ZhawSchedule {
    days: ZhawDay[];
  }
  
export interface CalendarEvent {
    title: string;
    start: string;
    end: string;
    color?: string;
    allDay?: boolean;
    extendedProps?: {
      isHoliday?: boolean;
    };
  }