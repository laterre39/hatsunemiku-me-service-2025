import { format, toDate } from 'date-fns-tz';

const KOREA_TIME_ZONE = 'Asia/Seoul';

/**
 * Returns a Date object representing the start of today (00:00:00) in KST, converted to a UTC timestamp.
 * This ensures "today" is always based on Korean time, regardless of the user's or server's location.
 * @returns {Date} A Date object for the start of the current day in Korea, represented in UTC.
 */
export const getTodayInKST = (): Date => {
    // 1. Get the current date and time.
    const now = new Date();
    
    // 2. Format `now` into a "yyyy-MM-dd" string, according to the 'Asia/Seoul' timezone.
    //    This correctly determines "today's date" in Korea.
    const todayStringInKST = format(now, 'yyyy-MM-dd', { timeZone: KOREA_TIME_ZONE });
    
    // 3. Create a new Date object from that string. 
    //    new Date('2024-05-10') creates a date for 2024-05-10 at 00:00:00 in the LOCAL timezone of the server.
    //    To make it universal, we treat it as a UTC date.
    return toDate(`${todayStringInKST}T00:00:00Z`);
};

/**
 * Formats a date string (e.g., "2025.02.11") into a format compatible with the Date constructor.
 * @param {string} dateStr - The date string to format.
 * @returns {string} The formatted date string (e.g., "2025-02-11").
 */
export const formatDateForDateObject = (dateStr: string): string => {
    return dateStr.replace(/\./g, '-');
};
