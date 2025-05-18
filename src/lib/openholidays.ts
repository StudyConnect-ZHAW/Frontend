import type { OpenHoliday } from '@/types/openHolidays';
import i18n from 'i18next';

export async function fetchPublicHolidays(year: number) {
  const lang = i18n.language;
  const isoLang = lang.startsWith('de') ? 'DE' : 'EN';

  const res = await fetch(
    `https://openholidaysapi.org/PublicHolidays?countryIsoCode=CH&languageIsoCode=${isoLang}&validFrom=${year}-01-01&validTo=${year}-12-31`
  );

  if (!res.ok) {return [];}

  const holidays: OpenHoliday[] = await res.json();

  return holidays
    .filter((holiday) =>
      holiday.nationwide === true ||
      holiday.subdivisions?.some((sub) => sub.code === 'CH-ZH')
    )
    .map((holiday) => ({
      title: holiday.name[0].text,
      start: holiday.startDate,
      end: holiday.endDate,
      allDay: true,
      color: '#F85A6D',
    }));
}