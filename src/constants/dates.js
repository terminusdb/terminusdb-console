/**
 * These are date time format patterns that are sent to format
 * function of date-fns package, to assist common date formats
 * used throughout the console
 */
import { format } from "date-fns";

export const DATETIME_DB_UPDATED = "HH.mm, MMM d yyyy "

export const DATETIME_COMPLETE = "MMM d, yyyy - HH:mm:ss"
export const DATETIME_FULL = "hh:mm:ss, dd/MM/yy"
export const DATETIME_REGULAR = "dd-MM-yy hh.mm"
export const DATETIME_SHORT = 'h.mm d/MM'
export const DATETIME_DATE = 'dd MMM yy'
export const DATETIME_YEAR = 'yyyy'
export const DATETIME_YEAR_MONTH = 'MMM yy'
export const DATETIME_YY = "'yy"
export const DATETIME_DD_MM = "MMM d"
export const DATETIME_HOUR = "ha"
export const DATETIME_HHMM = "hh:mm"
export const DATETIME_HH_DD = "haaaaa'm' d/M"
export const DATETIME_SS = "ss \s"
export const DATETIME_SSS = "sss \s"
export const DATE_REGULAR = "yyyy-MM-dd"

export const printts = (ts, f) => {
    f = f || DATETIME_REGULAR
    return format(new Date(ts * 1000), f)
}
