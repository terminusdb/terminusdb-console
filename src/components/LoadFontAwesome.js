import React  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as icons from '../labels/iconLabels'
import { faLink, faPowerOff, faUser, faHome, faUserAstronaut, faDiceThree,
         faMarker, faTruckLoading, faDatabase, faPaperPlane,
         faMountain, faUserTag, faTasks, faCircleNotch,
         faCalendar, faHistory, faEdit , faUserPlus,
         faCaretLeft, faCaretRight, faTable, faProjectDiagram,
         faVial, faWindowClose, faFillDrip} from "@fortawesome/free-solid-svg-icons";

export const AddIcon = (props) => {
    const icon = props.icon || '';
    var iconHolder;

    switch (icon){
        case icons.HOME_ICON:
            iconHolder = faHome;
            break;
        case icons.USER_ASTRONAUT:
            iconHolder = faUserAstronaut;
            break;
        case icons.DICE_THREE:
            iconHolder = faDiceThree;
            break;
        case icons.TRUCK_LOADING:
            iconHolder = faTruckLoading;
            break;
        case icons.USER:
            iconHolder = faUser;
            break;
        case icons.MARKER:
            iconHolder = faMarker;
            break;
        case icons.DATABASE:
            iconHolder = faDatabase;
            break;
        case icons.PAPERPLANE:
            iconHolder = faPaperPlane;
            break;
        case icons.MOUNTAIN:
            iconHolder = faMountain;
            break;
        case icons.USER_TAG:
            iconHolder = faUserTag;
            break;
        case icons.TASKS:
             iconHolder = faTasks;
             break;
        case icons.CIRCLE_NOTCH:
             iconHolder = faCircleNotch;
             break;
        case icons.CALANDAR:
            iconHolder = faCalendar;
            break;
        case icons.HISTORY:
            iconHolder = faHistory;
            break;
        case icons.EDIT:
            iconHolder = faEdit;
            break;
        case icons.USER_PLUS:
            iconHolder = faUserPlus;
            break;
        case icons.CARET_RIGHT:
            iconHolder = faCaretRight;
            break;
        case icons.CARET_LEFT:
            iconHolder = faCaretLeft;
            break;
        case icons.TABLE:
            iconHolder = faTable;
            break;
        case icons.PROJECT_DIAGRAM:
            iconHolder = faProjectDiagram;
            break;
        case icons.VIAL:
            iconHolder = faVial;
            break;
        case icons.CANCEL:
            iconHolder = faWindowClose;
            break;
        case icons.FILL_DRIP:
            iconHolder = faFillDrip;
            break;
    }

    return (
        <div className = {props.className}>
            <FontAwesomeIcon size="2x" icon={iconHolder} size= {props.size} className={props.className}/>
        </div>
        )
}


//<AddIcon status= {HOME_ICON}/>
