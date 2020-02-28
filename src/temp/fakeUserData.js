/** fake user data - temp - delete later once permissions are avail**/
import React  from 'react';

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
}];


const columnData = [
    {Name: 'Jim Carrey', Occupation: 'Actor', Organisation: 'Self', Read: 'Y', Write: 'Y'},
    {Name: 'Glass Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N'}
];

export const fakeUserData = {columnData:columnData, columnConf:columnConf};
