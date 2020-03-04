/** fake user data - temp - delete later once permissions are avail**/
import React  from 'react';

const columnConf = [
    {
        name: 'ID',
        selector: 'Id',
        sortable: true
    },
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
        cell: row => <input type="checkbox" name="read" value="read"/>
    },
    {
        name: 'Write',
        selector: 'Write',
        cell: row => <input type="checkbox" name="write" value="write"/>
    },
    {
        name: 'Manage',
        selector: 'Manage',
        cell: row => <input type="checkbox" name="manage" value="manage"/>
    }];


const columnData = [
    {Id: '001', Name: 'Jim Carrey', Occupation: 'Actor', Organisation: 'Self', Read: 'Y', Write: 'Y', Manage: 'N'},
    {Id: 'Name89', Name: 'Glass Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'},
    {Id: 'BAC', Name: 'WHOEVER', Occupation: 'WHOEVER', Organisation: 'WHOEVER', Read: 'Y', Write: 'Y', Manage: 'Y'},
    {Id: 'VT676', Name: 'John Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'},
    {Id: '00X', Name: 'Check Mate', Occupation: 'student', Organisation: 'NCI', Read: 'Y', Write: 'N', Manage: 'N'}
];

export const fakeUserData = {columnData:columnData, columnConf:columnConf};
