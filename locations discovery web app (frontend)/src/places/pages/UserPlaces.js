import React from "react";

import PlaceList from "../components/PlaceList";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const DUMMY_PLACES=[
    {
        id: 'p1',
        title: 'Madison Square Garden',
        description: 'Where world cup final will be played',
        imageURL: 'https://assets.simpleviewinc.com/simpleview/image/upload/c_limit,h_1200,q_75,w_1200/v1/clients/newyork/pedro_bariak_EJ_AkAWkA8_unsplash_resized_6a3b0c1d-d084-4b3f-b3f3-a5bdf4070ef5.png',
        address: 'New York',
        location:{
            lat: 67,
            lng: -67
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Allianz Arena',
        description: 'Juventus Home Stadium',
        imageURL: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/25/3e/59/34/stadio-allianz.jpg?w=1200&h=-1&s=1',
        address: 'Turin',
        location:{
            lat: 67,
            lng: -67
        },
        creator: 'u2'
    }
];



const UserPlaces = ()=>{

    const userId=useParams().userId;
    const loadedPlaces=DUMMY_PLACES.filter(place=>place.creator===userId);

    return <PlaceList items={loadedPlaces}/>


}

export default UserPlaces;