import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faPowerOff, faClock, faCheckCircle,
    faInfoCircle, faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export const initFontLib = library.add(faUser,
    faPowerOff,
    faClock,
    faCheckCircle,
    faInfoCircle,
    faExclamationCircle,
    faTimesCircle );
