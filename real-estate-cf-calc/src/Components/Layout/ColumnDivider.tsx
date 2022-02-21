
import React from 'react';

export const ColumnDivider = ({width = "5px" , height ="100%"}) => {
    return <hr style={{borderRadius: "2px", height:height, marginLeft: "auto", marginRight: "auto", width:width}}/>
}