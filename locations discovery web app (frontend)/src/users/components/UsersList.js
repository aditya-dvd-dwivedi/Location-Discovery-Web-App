import React from 'react';

import UserItem from './UserItem';

import Card from '../../shared/components/UIElements/Card';

import './UsersList.css';

const UsersList = props => {

    {/*0 users in props (our user list) */}
    if(props.items.length===0){
        return(
            <div class ="center">
                <Card>
                <h2> No Users Found</h2>
                </Card>
            </div>
        );
    }

    return(
        <ul className='users-list'>
            {/*returning an unordered list to print on html page
            of all prop items mapped to jsx */}
            {props.items.map(user=>(
                <UserItem
                    key={user.id}
                    id={user.id}
                    image={user.image}
                    name={user.name}
                    placeCount={user.placeCount}
                />
            ))}
        </ul>
    )


};

export default UsersList;