import { format } from "date-fns";

export const DATETIME_FULL = "h:mm:ss a, MMM dd yyyy"
export const DATETIME_REGULAR = "dd-MMM-yy h.mm"
export const DATETIME_SHORT = 'h.mm d/MM'
export const DATETIME_YEAR = 'yyyy'
export const DATETIME_YEAR_MONTH = 'MMM-yy'

export const printts = (ts, f) => {
    f = f || DATETIME_REGULAR
    return format(new Date(ts * 1000), f)
}