import React, { useCallback , useReducer} from 'react';

import Input from '../../shared/components/FormElements/Input';

import './PlaceForm.css';

import Button from '../../shared/components/FormElements/Button';

import { VALIDATOR_REQUIRE,VALIDATOR_MINLENGTH } from '../../shared/components/util/validators';

import useForm from '../../shared/hooks/form-hook';


//just some dummy page
const NewPlace =()=>{

    //first argument is inputs and second argument is false
    const [formState,inputHandler]=useForm( {
            title :{
                value: '',
                isValid: false

            },
            description: {
                value: '',
                isValid: false
            },
            address: {
                value: '',
                isValid: false
            }
        }, false);




    //to handle form submissions
    const placeSubmitHandler = event =>{
        event.preventDefault();
        console.log(formState.inputs);//send this to backend later
    };

    return (
        <form className='place-form' onSubmit={placeSubmitHandler}>
            <Input 
                id='title'
                element='input'
                type = "text"
                label ="Title"
                validators ={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid title"
                onInput={inputHandler} //passed straight to Input to see input change
            />
            <Input 
                id='description'
                element='textarea'
                type = "text"
                label ="Description"
                validators ={[VALIDATOR_MINLENGTH(5)]}
                errorText="Please enter a valid description (min 5 chars)"
                onInput={inputHandler} //passed straight to Input to see input change
            />
            <Input 
                id='address'
                element='input'
                label ="Address"
                validators ={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a valid address"
                onInput={inputHandler} //passed straight to Input to see input change
            />

            <Button type='submit' disabled={!formState.isValid}>
                ADD PLACE
            </Button>
        </form>
    )
}

export default NewPlace;
