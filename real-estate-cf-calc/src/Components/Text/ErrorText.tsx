import React from 'react';
import './styles.css';

export const ErrorText = ({message}) => {
    if(!message){
        return null;
    }
    return <p className="errorMessage">{message}</p>
}

