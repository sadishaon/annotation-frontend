import React,{useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CountDown = ({ hours = 0, minutes = 0, seconds = 0, urlDst = "" }) => {
    const [paused, setPaused] = React.useState(false);
    const [over, setOver] = React.useState(false);
    const [[h, m, s], setTime] = React.useState([hours, minutes, seconds]);
    const navigate = useNavigate();
  
    const tick = () => {
      if (paused || over) return;
      if (h === 0 && m === 0 && s === 0) setOver(true);
      else if (m === 0 && s === 0) {
        setTime([h - 1, 59, 59]);
      } else if (s == 0) {
        setTime([h, m - 1, 59]);
      } else {
        setTime([h, m, s - 1]);
      }
    };
  
    /*
    const reset = () => {
      setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
      setPaused(false);
      setOver(false);
    };
    */
  
    React.useEffect(() => {
      const timerID = setInterval(() => tick(), 1000);
      return () => clearInterval(timerID);
    });
  
    return (
      <div>
        <p>{`${s.toString()}`}</p>
        <div>{over ? <button
        
          onClick={() => navigate(urlDst)}
          className="next sum"
        >
          Next &raquo;
        </button> : ''}</div>
        
      </div>
    );
  };

  export default CountDown;