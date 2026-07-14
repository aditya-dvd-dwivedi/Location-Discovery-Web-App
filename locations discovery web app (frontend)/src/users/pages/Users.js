import React from 'react';

import UsersList from '../components/UsersList';

function Users(){

    //dummy list to act as props for UsersList
    //with one dummy user

    const USERS =[
        {
            id: 'u1',
            name: 'Ronaldo',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05jwO7tEUcBkqsSiSi3Epmn2vGYmWybyq_w&s',
            placeCount: 5,
        }
    ];

    //pass USERS as items array
    return <UsersList items ={USERS}/>
}

export default Users;