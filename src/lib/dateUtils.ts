import { format, toDate } from 'date-fns-tz';

const KOREA_TIME_ZONE = 'Asia/Seoul';

export const getTodayInKST = (): Date => {
    const now = new Date();
    const todayStringInKST = format(now, 'yyyy-MM-dd', { timeZone: KOREA_TIME_ZONE });
    return toDate(`${todayStringInKST}T00:00:00Z`);
};

export const getMikuBirthdayInJST = (): Date => {
    return toDate('2007-08-31T00:00:00Z');
};

export const formatDateForDateObject = (dateStr: string): string => {
    return dateStr.replace(/\./g, '-');
};
