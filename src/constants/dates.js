/**
 * These are date time format patterns that are sent to format
 * function of date-fns package, to assist common date formats
 * used throughout the console
 */
import moment from 'moment'; 
export const DATETIME_DB_UPDATED = "HH.mm, MMM d yyyy "

export const DATETIME_COMPLETE = "MMM d, yyyy - HH:mm:ss"
export const DATETIME_FULL = "hh:mm:ss, dd/MM/yy"
export const DATETIME_REGULAR = "dd-MM-yy HH.MM"


//export const DATETIME_REGULAR = "dd-MM-yy hh.mm"
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

export const printts = (ts, format) => {
    format = format|| DATETIME_REGULAR
    return moment(ts * 1000).format(format)
    //return format(new Date(ts * 1000), f)
}

export const formatFileDate=(date)=>{
   // let dt=format(new Date(date), DATETIME_DB_UPDATED)
   	let dt=moment(date).format(DATETIME_DB_UPDATED)

    return dt
}
