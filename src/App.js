import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import HashLoader from "react-spinners/HashLoader";
import useStyles from './styles';
import { Alert } from 'react-bootstrap';

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

  /** get new deck id when reset button is selected */
  useEffect(async () => {
    try {
      const result = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
      setDeckId(result.data.deck_id);
    } catch (err) {
      setLoading(false);
      setAlertColor('danger');
      setAlert(err.message);
    }
  }, [reset]);

  /** draw cards and push queen cards onto suit arrays until all 4 queen cards are drawn */
  const drawCards = async () => {
    try {
      setLoading(true);
      const result = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`);
      const data = await result.json();

      data.cards.map((card) => {
        if (card.value === "QUEEN") queenCount++;
        setCards(prevCards => [ ...prevCards, card ]);
      });

      if (queenCount < 4) {
        await timeoutPromise()
        return drawCards(deckId);
      }

      setAlertColor('success');
      setAlert('All Queen cards have now been drawn');
      setFoundAllQueens(true);
      setLoading(false);

    } catch (err) {
      setLoading(false);
      setAlertColor('danger');
      setAlert(err.message);
    }
  }

  /** space out network requests */
  const timeoutPromise = async () => {
    return new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }

  const resetAll = () => {
    setAlert('');
    setAlertColor('danger');
    setReset(!reset)
    setFoundAllQueens(false);
    setCards(() => []);
  }

  return (
    <div className={classes.appWrap}>
      <h1>Drawing Queens</h1>
      <p>Pressing start will begin utilizing the <a href="https://deckofcardsapi.com/" target="_blank" className={classes.link}>Deck of Cards API</a> to draw 2 cards repeatedly from a standard 52-card deck until each suit's Queen card is drawn.</p>
      {alert.length > 0 && <Alert variant={alertColor}>{alert}</Alert>}
      {
        !loading
        ? !foundAllQueens
        ? <Button variant="contained" onClick={() => drawCards()} className={classes.button}>START</Button>
        : <Button variant="outlined" onClick={() => resetAll()} className={classes.button}>START OVER</Button>
        : <div className={classes.loaderWrap}><HashLoader className={classes.loader} color="gray"/></div>
      }
      <div className={classes.suitsWrap}>
        <h2>Hearts</h2>
        {
          cards
          .filter(card => card.suit === "HEARTS")
          .sort((a, b) => { return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value) })
          .map((heart, index) => {
            return <img key={index} src={heart.image} alt="" className={ heart.value === "QUEEN" ? classes.queen : classes.card }/>
          })
        }
        <h2>Diamonds</h2>
        {
          cards
          .filter(card => card.suit === "DIAMONDS")
          .sort((a, b) => { return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value) })
          .map((diamond, index) => {
            return <img key={index} src={diamond.image} alt="" className={ diamond.value === "QUEEN" ? classes.queen : classes.card }/>
          })
        }
        <h2>Spades</h2>
        {
          cards
          .filter(card => card.suit === "SPADES")
          .sort((a, b) => { return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value) })
          .map((spade, index) => {
            return <img key={index} src={spade.image} alt="" className={ spade.value === "QUEEN" ? classes.queen : classes.card }/>
          })
        }
        <h2>Clubs</h2>
        {
          cards
          .filter(card => card.suit === "CLUBS")
          .sort((a, b) => { return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value) })
          .map((club, index) => {
            return <img key={index} src={club.image} alt="" className={ club.value === "QUEEN" ? classes.queen : classes.card }/>
          })
        }
      </div>
    </div>
  );
}

export default App;