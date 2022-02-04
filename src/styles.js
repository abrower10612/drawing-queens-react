import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    startBtn: {
      border: 'solid 2px red',
      width: 'fit-content'
    },
  
    appWrap: {
      fontFamily: 'helvetica',
      margin: '30px'
    },
  
    queen: {
      width: '100px', 
      border: 'solid 5px gold', 
      borderRadius: '10px',
      margin: '0 5px'
    },
    
    card: {
      width: '100px',
      margin: '0 5px'
    },
  
    loaderWrap: {
      position: 'relative',
      width: '100px',
      height: 'fit-content',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
  
    loader: {
      position: 'absolute'
    },

    link: {
      color: 'blue'
    }
  });

  export default useStyles;