/**
 * Component that represents a calendar integrated in the page.
 *
 * TODO: Different components for week view and month view of the calendar?
 */

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default function Calendar() {
    return (
        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl">
        <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            events={[
            { title: 'Test Event', date: '2025-05-07' },
            { title: 'Meeting', date: '2025-05-09' },
            ]}
        />
        </div>

        </div>
    )
}