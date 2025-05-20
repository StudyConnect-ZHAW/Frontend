import type { OpenHoliday } from '@/types/openholidays';
import i18n from 'i18next';

/**
 * Fetches public holidays in Switzerland (CH) for a given year.
 * Uses OpenHolidays API and translates based on current i18n language.
 * Filters holidays for nationwide or Zurich (CH-ZH) region only.
 */
export async function fetchPublicHolidays(year: number) {
  const lang = i18n.language;
  const isoLang = lang.startsWith('de') ? 'DE' : 'EN';

  const res = await fetch(
    `https://openholidaysapi.org/PublicHolidays?countryIsoCode=CH&languageIsoCode=${isoLang}&validFrom=${year}-01-01&validTo=${year}-12-31`
  );

  if (!res.ok) {return [];}

  const holidays: OpenHoliday[] = await res.json();

  return holidays
    // Only include nationwide or Zurich-specific holidays
    .filter((holiday) =>
      holiday.nationwide === true ||
      holiday.subdivisions?.some((sub) => sub.code === 'CH-ZH')
    )
    // Map holidays to FullCalendar-compatible format
    .map((holiday) => ({
      title: holiday.name[0].text,
      start: holiday.startDate,
      end: holiday.endDate,
      allDay: true,
      color: '#F85A6D',
    }));
}