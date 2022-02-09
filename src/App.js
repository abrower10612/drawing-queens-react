import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import HashLoader from "react-spinners/HashLoader";
import useStyles from './styles';
import { Alert } from 'react-bootstrap';
import SuitComponent from './SuitComponent';

function App() {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState('');
  const [alertColor, setAlertColor] = useState('');
  const [reset, setReset] = useState(false);
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [foundAllQueens, setFoundAllQueens] = useState(false);
  let queenCount = 0;

  const suits = [
    "Hearts",
    "Diamonds",
    "Spades",
    "Clubs"
  ]

  const sortOrder = [
    "ACE",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING"
  ];

  /** get new deck id when page first loads and again any time the reset button is pressed */
  useEffect(async () => {
    try {
      setAlert('');
      setAlertColor('danger');
      setFoundAllQueens(false);
      setCards([]);
      const result = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      setDeckId(result.data.deck_id);
    } catch (err) {
      setLoading(false);
      setAlertColor('danger');
      setAlert(err.message);
    }
    setReset(false);
  }, [reset]);

  /** draw cards and push queen cards onto suit arrays until all 4 queen cards are drawn */
  const drawCards = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);

      /** add new drawn cards to existing drawn cards array */
      result.data.cards.forEach(card => {
        if (card.value === "QUEEN") queenCount++;
        setCards(prevCards => [ ...prevCards, card ]);
      });

      checkQueenCount();
    } catch (err) {
      setLoading(false);
      setAlertColor('danger');
      setAlert(err.message);
    }
  }

  const checkQueenCount = async () => {
    /** recursively call drawCards after 1000ms if all 4 Queens have not been drawn */
    if (queenCount < 4) {
      await timeoutPromise();
      return drawCards(deckId);
    }

    setAlertColor('success');
    setAlert('All Queen cards have now been drawn');
    setFoundAllQueens(true);
    setLoading(false);
  }

  /** space out network requests */
  const timeoutPromise = () => {
    return new Promise(resolve => {
      setTimeout(resolve, 500);
    });
  }

  return (
    <div className={classes.appWrap}>
      <h1>Drawing Queens</h1>
      <p>Pressing start will begin utilizing the <a href="https://deckofcardsapi.com/" target="_blank" className={classes.link}>Deck of Cards API</a> to draw 2 cards repeatedly from a standard 52-card deck until each suit's Queen card is drawn.</p>
      { alert.length > 0 && <Alert variant={alertColor}>{alert}</Alert> }
      {!loading
        ? !foundAllQueens
        ? <Button variant="contained" onClick={() => drawCards()} className={classes.button}>START</Button>
        : <Button variant="outlined" onClick={() => setReset(true)} className={classes.button}>START OVER</Button>
        : <div className={classes.loaderWrap}><HashLoader className={classes.loader} color="gray"/></div>}
      <div className={classes.suitsWrap}>
        {suits.map((suit, index) => {
            return (
              <div key={index} >
                <h2>{suit}</h2>
                <SuitComponent suit={suit.toUpperCase()} cards={cards} classes={classes} sortOrder={sortOrder}/>
              </div>
            )
          })}
      </div>
    </div>
  );
}

export default App;