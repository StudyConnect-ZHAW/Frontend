/**
 * Represents a single event entry in the ZHAW schedule (e.g., lecture, or holiday).
 */
export interface ZhawEvent {
    startTime: string;
    endTime: string;
    name?: string;
    description?: string;
    type?: string;
    eventRealizations?: {
        room?: { name: string };
    }[];
}

/**
 * Represents one day in the ZHAW schedule, holding multiple events.
 */
export interface ZhawDay {
    date: string;
    events: ZhawEvent[];
}

/**
 * Represents the full schedule response from the ZHAW API, spanning multiple days.
 */
export interface ZhawSchedule {
    days: ZhawDay[];
}

/**
 * Represents the list of all student shortNames fetched from the ZHAW API.
 */
export interface ZhawStudents {
    students: string[];
}

/**
 * Represents a single lecturer with display name and system shortName.
 */
export interface Lecturer {
    name: string;
    shortName: string;
}

/**
 * Represents the list of all lecturers fetched from the ZHAW API.
 */
export interface ZhawLecturers {
    lec‌: string[] | PromiseLike<string[]>;
    lecturers: Lecturer[];
}

/**
 * Represents a calendar event formatted for the frontend calendar view (e.g., FullCalendar).
 */
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