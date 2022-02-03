import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import HashLoader from "react-spinners/HashLoader";
import useStyles from './styles';

function App() {
  const classes = useStyles();
  const [reset, setReset] = useState(0);
  const [deckId, setDeckId] = useState('');
  const [foundAllQueens, setFoundAllQueens] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [diamonds, setDiamonds] = useState([]);
  const [cards, setCards] = useState([]);
  const [spades, setSpades] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);

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
      console.log(`Error: ${err.message}`);
    }
  }, [reset]);

  /** draw cards and push queen cards onto suit arrays until all 4 queen cards are drawn */
  const drawCards = async () => {
    setLoading(true);
    fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
        .then((result) => {
            return result.json();
        })
        .then((data) => {
            data.cards.forEach((card) => {
                if (card.suit === "HEARTS") hearts.push(card.value);
                if (card.suit === "DIAMONDS") diamonds.push(card.value);
                if (card.suit === "SPADES") spades.push(card.value);
                if (card.suit === "CLUBS") clubs.push(card.value);

                cards.push(card);

                card.suit === "HEARTS" && handleHearts();
                card.suit === "DIAMONDS" && handleDiamonds();
                card.suit === "SPADES" && handleSpades();
                card.suit === "CLUBS" && handleClubs();
            });
        })
        .then(() => {
            if (
                !hearts.includes("QUEEN") ||
                !diamonds.includes("QUEEN") ||
                !spades.includes("QUEEN") ||
                !clubs.includes("QUEEN")
            ) {
                return timeoutPromise().then(() => drawCards(deckId));
            }

            setFoundAllQueens(true);

            spades.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            clubs.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            hearts.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            diamonds.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });

            console.log(
                `SPADES: [${spades.toString().replaceAll(",", ", ")}]\n` +
                `CLUBS: [${clubs.toString().replaceAll(",", ", ")}]\n` +
                `HEARTS: [${hearts.toString().replaceAll(",", ", ")}]\n` +
                `DIAMONDS: [${diamonds.toString().replaceAll(",", ", ")}]\n`
            );

            setLoading(false);
        })
        .catch((err) => console.log(err.message));
  }

  /** reset hearts array for instant rendering */
  const handleHearts = () => {
    const temp = [];
    hearts.forEach(card => temp.push(card));
    setHearts(temp);
  }

  /** reset diamonds array for instant rendering */
  const handleDiamonds = () => {
    const temp = [];
    diamonds.forEach(card => temp.push(card));
    setHearts(temp);
  }

  /** reset spades array for instant rendering */
  const handleSpades = () => {
    const temp = [];
    spades.forEach(card => temp.push(card));
    setHearts(temp);
  }

  /** reset clubs array for instant rendering */
  const handleClubs = () => {
    const temp = [];
    clubs.forEach(card => temp.push(card));
    setHearts(temp);
  }

  /** space out network requests */
  const timeoutPromise = async () => {
      return new Promise(resolve => {
          setTimeout(resolve, 500);
      });
  }

  return (
    <div className={classes.appWrap}>
      <h1>Search for the Queens</h1>
      {
        !loading
        ? !foundAllQueens
        && <Button variant="contained" onClick={() => drawCards()}>START</Button>
        : <div className={classes.loaderWrap}><HashLoader className={classes.loader} color="gray"/></div>
      }
      { 
        foundAllQueens && 
        <Button variant="outlined" onClick={() => {
          setReset(reset + 1)
          setFoundAllQueens(false);
          setHearts([]);
          setDiamonds([]);
          setSpades([]);
          setClubs([]);
          setCards([]);
        }}
        >Start Over</Button>
      }
      <div>
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
