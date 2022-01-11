import React, { useState, useEffect, useRef } from "react";
import './Card.css'

function Card({ imgUrl }) {


    return (
        <div className="Card">
            <img src={imgUrl} height='140px' width='95px'></img>
        </div>
    )
}

export default Card;