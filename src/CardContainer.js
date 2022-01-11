import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Card from "./Card";
import './CardContainer.css'
import { v4 as uuid } from 'uuid';


function CardContainer() {
    const timerId = useRef();
    const BASE_URL = 'http://deckofcardsapi.com/api/deck/new/shuffle/'
    const [deckID, setDeckID] = useState(null)
    // put drawn cards into cards
    const [cards, setCards] = useState([])
    const [remaining, setRemaining] = useState(52)
    const [drawing, setDrawing] = useState(false)

    // input deckId1/2 as params, have this make 2 async reqs to get 2 decks. 
    useEffect(() => {
        async function getCards() {
            const res = await axios.get(BASE_URL)
            console.log('deck_id', res)
            setDeckID(res.data.deck_id)
        };
        getCards();
    }, [])

    // learning!!!
    // useEffect enables you to run something whenever the the component is rendered or when a state changes. Having that inside of a function that is called on click makes it useless. useEffect should call other functions, but should never be called from within a function.
    // slowdraw triggers useEffect
    useEffect(() => {
        if (remaining === 0) {
            stopTimer()
            setDrawing(false)
            alert('Error: no cards remaining!');
            return;
        }
        if (!drawing) return

        async function timedDraw() {
            timerId.current = setInterval(async () => {
                const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckID}/draw/`)
                const newCard = res.data.cards[0];
 
                setCards(cards => [...cards, newCard]);
                setRemaining(remaining => remaining - 1);
            }, 200);
        }
        timedDraw()

        return function cleanUpClearTimer() {
            clearInterval(timerId.current);
        };
    })

    const stopTimer = () => {
        console.log('stopping timer')
        clearInterval(timerId.current)
    }

    // trigges useEffect by changing value of its dependency
    // don't want triggered by remaining2 -> gets called that inside useEffect
    function slowDraw() {
        if (remaining === 0) {
            alert('Error: no cards remaining!');
            return;
        }
        if (!drawing){
            setDrawing(true)
        } else {
            setDrawing(false);
            stopTimer()
        }
    }

    async function reset() {
        setCards([])
        setRemaining(52)
        const res = await axios.get(BASE_URL)
        setDeckID(res.data.deck_id)
    }


    // async function drawCard() {
    //     if (remaining === 0) {
    //         alert('Error: no cards remaining!');
    //         return;
    //     }
    //     const res = await axios.get(`http://deckofcardsapi.com/api/deck/${deckID}/draw/`)
    //     const newCard = res.data.cards[0];

    //     setCards(cards => [...cards, newCard]);
    //     setRemaining(remaining => remaining - 1);
    // };

    return (
        <div>
            <h1>Deck of Cards</h1>
            {/* <h2>Deck 1 Remaining: {remaining}</h2> */}
            <h2>Remaining: {remaining}</h2>
            {/* <button onClick={drawCard}>Get Cards</button> */}
            {/* <div className="CardContainer">
                {cards.map((card) => <Card imgUrl={card.image} key={uuid()} />)}
            </div> */}
            <button onClick={reset}>Reset</button>
            <button onClick={slowDraw}>{`${drawing ? 'Stop Drawing' : 'Start Drawing'}`}</button>
            <div className="CardContainer">
                {cards.map((card) => <Card imgUrl={card.image} key={uuid()} />)}
            </div>
        </div>
    )
}

export default CardContainer;