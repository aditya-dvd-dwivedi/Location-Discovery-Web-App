import React, {useEffect, useEffectEvent,useState} from 'react';

import { useParams } from 'react-router-dom/cjs/react-router-dom.min';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/components/util/validators';

import './PlaceForm.css';

import useForm from '../../shared/hooks/form-hook';

import Card from '../../shared/components/UIElements/Card';

//copy pasted from UserPlaces.js
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

const UpdatePlace = () => {

    const [isLoading,setIsLoading]=useState(true);

    const placeId=useParams().placeId;


    const [formState,inputHandler,setFormData]=useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    },
        false
    );
    //swapped places w useForm so that we can test how backend works
    const identifiedPlace=DUMMY_PLACES.find(p => p.id === placeId);

    //after we get identified place we can call useEffect and within that setFormData to set our data values
    useEffect(()=>{
        //only if identifiedPlace exists otherwise we wanna show no places found
        if(identifiedPlace){
            setFormData(
                {
                    title: {
                        value: identifiedPlace.title,
                        isValid: true
                    },
                    description: {
                        value: identifiedPlace.description,
                        isValid: true
                    }
                },
                true
            );
        }
        setIsLoading(false);
    }, [setFormData,identifiedPlace]);


    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if(!identifiedPlace){
        return(
            <div className='center'>
                <Card>
                    <h2>could not find a place!</h2>
                </Card>
            </div>
        );
    }

    if(isLoading){
            return(
            <div className='center'>
                <h2>Loading...</h2>
            </div>
        );
    }

    return <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
        <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={formState.inputs.title.value}
            initialValid={formState.inputs.title.isValid}
        />
        <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid title"
            onInput={inputHandler}
            initialValue={formState.inputs.description.value}
            initialValid={formState.inputs.description.isValid}
        />
        <Button type="submit" disabled={!formState.isValid} >
            UPDATE PLACE
        </Button>

    </form>;

};

export default UpdatePlace;