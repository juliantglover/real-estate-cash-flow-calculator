import React from 'react';
import './styles.css';

export const SubHeader = ({text, size="h2"}) => {
    if(size === "h3"){
        return <h3 className="header"> {text} </h3>
    }
    return <h2 className="header"> {text} </h2>
}

