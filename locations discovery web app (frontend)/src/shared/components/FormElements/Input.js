import React, { useReducer , useEffect} from "react";

import './Input.css';

import { validate } from '../../components/util/validators';

const inputReducer = (state,action)=>{

    switch(action.type){

        case 'CHANGE':
            return{
                ...state,
                value: action.val,
                isValid: validate(action.val,action.validators)
            };
        
        case 'TOUCH':
            return{
                ...state,
                isTouched: true
            };
        
        default:
            return state;


    }
};

const Input = props => {

    const [inputState,dispatch]=useReducer(inputReducer,{
        value: props.initialValue||'',
        isValid: props.initialValid||false,
        isTouched: false
    });

    //extracting certain components to inform NewPlace.js about change in input
    const {id,onInput}=props;
    const {value,isValid}=inputState; 

    //this calls the onInput function given by props so that we can inform NewPlace.js about
    //change in input
    useEffect(()=>{
        onInput(id,value,isValid)
    },[id,value,isValid,onInput]);

    //recognises keystrokes
    const ChangeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators});
    };

    const touchHandler=()=>{
        dispatch({
            type: 'TOUCH',
        });
    };
    const element=
        props.element ==='input'?
        (<input 
            id ={props.id} 
            type={props.type} 
            placeholder={props.placeholder} 
            onChange={ChangeHandler} 
            value ={inputState.value}
            onBlur={touchHandler}/>)
        :
        (<textarea 
            id={props.id} 
            rows={props.rows||3} 
            onChange={ChangeHandler} 
            value={inputState.value}
            onBlur={touchHandler}/>)


    return (<div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid&&inputState.isTouched&&<p>{props.errorText}</p>}
    </div>);
};

export default Input;