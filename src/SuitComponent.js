import React from 'react'

const SuitComponent = ({ suit, cards, classes, sortOrder }) => {
  return (
    <>
        {
          cards
            .filter(card => card.suit === suit)
            .sort((a, b) => { return sortOrder.indexOf(a.value) - sortOrder.indexOf(b.value) })
            .map((suit, index) => {
                return <img key={index} src={suit.image} alt="" className={ suit.value === "QUEEN" ? classes.queen : classes.card }/>
            })
        }
    </>
  )
}

export default SuitComponent