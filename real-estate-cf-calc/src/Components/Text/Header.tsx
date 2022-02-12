import React from 'react';
import './styles.css';

export const Header = ({text, weight=400, size=1}) => {
    return <p style={{fontWeight: weight, fontSize:`${size}em`}} className="header"> {text} </p>
}

