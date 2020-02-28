import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faLink, faPowerOff, faUser, faHome } from "@fortawesome/free-solid-svg-icons";

function initFontAwesome() {
    library.add(faLink);
    library.add(faUser);
    library.add(faPowerOff);
    library.add(faHome);
    return library;
}

export default initFontAwesome;
