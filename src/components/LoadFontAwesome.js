import React  from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HOME_ICON, USER_ASTRONAUT, DICE_THREE, MOUNTAIN,
         USER, MARKER, TRUCK_LOADING, DATABASE, PAPERPLANE,
         USER_TAG, TASKS, CIRCLE_NOTCH, CALANDAR, HISTORY } from '../labels/iconLabels'
import { faLink, faPowerOff, faUser, faHome, faUserAstronaut, faDiceThree,
         faMarker, faTruckLoading, faDatabase, faPaperPlane,
         faMountain, faUserTag, faTasks, faCircleNotch,
         faCalendar, faHistory } from "@fortawesome/free-solid-svg-icons";

export const AddIcon = (props) => {
    const icon = props.icon || '';
    var iconHolder;

    switch (icon){
        case HOME_ICON:
            iconHolder = faHome;
            break;
        case USER_ASTRONAUT:
            iconHolder = faUserAstronaut;
            break;
        case DICE_THREE:
            iconHolder = faDiceThree;
            break;
        case TRUCK_LOADING:
            iconHolder = faTruckLoading;
            break;
        case USER:
            iconHolder = faUser;
            break;
        case MARKER:
            iconHolder = faMarker;
            break;
        case DATABASE:
            iconHolder = faDatabase;
            break;
        case PAPERPLANE:
            iconHolder = faPaperPlane;
            break;
        case MOUNTAIN:
            iconHolder = faMountain;
            break;
        case USER_TAG:
            iconHolder = faUserTag;
            break;
        case TASKS:
             iconHolder = faTasks;
             break;
        case CIRCLE_NOTCH:
             iconHolder = faCircleNotch;
             break;
        case CALANDAR:
            iconHolder = faCalendar;
            break;
        case HISTORY:
            iconHolder = faHistory;
            break;
    }

    return <FontAwesomeIcon size="2x" icon={iconHolder} size= {props.size}/>
}


//<AddIcon status= {HOME_ICON}/>
