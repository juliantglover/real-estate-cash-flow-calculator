import React from 'react';
import './styles.css';

export const Header = ({color="black", text, weight=400, size=1}) => {
    return <p style={{color:color, fontWeight: weight, fontSize:`${size}em`}} className="header"> {text} </p>
}

