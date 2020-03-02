/** fake user data - temp - delete later once permissions are avail**/
import React  from 'react';
import { AddIcon } from "../components/LoadFontAwesome"
import { EDIT } from '../labels/iconLabels'

const columnConf = [
{
    name: 'Name',
    selector: 'Name',
    sortable: true
},
{
    name: 'Occupation',
    selector: 'Occupation',
    sortable: true
},
{
    name: 'Organisation',
    selector: 'Organisation',
    sortable: true
},
{
    name: 'Read',
    selector: 'Read',
    cell: row => <input type="radio" name="read" value="read"/>
},
{
    name: 'Write',
    selector: 'Write',
    cell: row => <input type="radio" name="write" value="write"/>
},
{
    name: 'Manage',
    selector: 'Manage',
    cell: row => <input type="radio" name="manage" value="manage"/>
},
{
    selector: 'Edit',
    cell: row => <AddIcon icon={EDIT} className="us-ctrl"/>
}];


const columnData = [
    {Name: 'Jim Carrey', Occupation: 'Actor', Organisation: 'Self', Read: 'Y', Write: 'Y', Manage: 'N'},
    {Name: 'Glass Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'},
    {Name: 'WHOEVER', Occupation: 'WHOEVER', Organisation: 'WHOEVER', Read: 'Y', Write: 'Y', Manage: 'Y'},
    {Name: 'John Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'},
    {Name: 'Check Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'}
];

export const fakeUserData = {columnData:columnData, columnConf:columnConf};
