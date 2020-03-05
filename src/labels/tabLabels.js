import { SCHEMA_LIST_OF_CLASSES_QUERY, SCHEMA_LIST_OF_PROPERTIES_QUERY } from '../labels/queryLabels';
import { GET_SCHEMA }  from '../labels/apiLabels'

export const CLASSES_TAB = {
    state: 'CLASSES_TAB',
    label: 'Classes',
    command: SCHEMA_LIST_OF_CLASSES_QUERY
}
export const PROPERTIES_TAB = {
    state: 'PROPERTIES_TAB',
    label: 'Properties',
    command: SCHEMA_LIST_OF_PROPERTIES_QUERY
}
export const OWL_TAB = {
    state: 'OWL_TAB',
    label: 'OWL',
    command: GET_SCHEMA
}

export const SCHEMA_TABS = [
    {CLASSES_TAB: {
        state: 'CLASSES_TAB',
        label: 'Classes',
        command: SCHEMA_LIST_OF_CLASSES_QUERY
    }},
    {PROPERTIES_TAB: {
        state: 'PROPERTIES_TAB',
        label: 'Properties',
        command: SCHEMA_LIST_OF_PROPERTIES_QUERY
    }},
    {OWL_TAB: {
        state: 'OWL_TAB',
        label: 'OWL',
        command: GET_SCHEMA
    }}
]

/* database home tabs */
export const DETAILS_TAB = 'Details'
export const COLLABORATE_TAB = 'Collaborate'
export const MANAGE_TAB = 'Manage'

/* create database tabs */
export const CREATE_DATABASE_TAB = 'Create New Database'
export const CLONE_LOCAL_DB_TAB = 'Clone Local Database'
export const CLONE_REMOTE_DB_TAB = 'Clone Remote Database'

/* user tab */
export const CREATE_USER =  'Create New User'
export const ADD_USER =  'Add Users'
export const INVITE_USER = 'Invite Users'
export const CURRENT_USERS = 'Users'
