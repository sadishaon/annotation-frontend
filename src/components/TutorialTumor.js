import React,{useState} from "react";

import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CountDown from "./CountDown";

function TutorialTumor({ 
  heights={ep1: '40vh', ep2: '40vh'}, 
  inCompact=false}) {
  const { worker_id, campaign_id } = useParams();
  const [disabled,setDisabled] = useState(true)

  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{ backgroundColor: "#FFFFFF", width: "100%" }}
    >
      <h3 className="text-center">{!inCompact && 'Tutorial: '} What a tumor looks like</h3>
      <div
        className="row justify-content-evenly align-items-center"
      >
        <div className="col-md-12 col-lg-6">
          <h5>Example 1:</h5>
          <img
            src="/Slideshow/image_2-1.gif"
            alt="show1"
            style={{ height: heights.ep1 }}
          ></img>
        </div>
        <div className="col-md-12 col-lg-6">
          <h5>Example 2:</h5>
          <img
            src="/Slideshow/image_2-2.gif"
            alt="slide2"
            style={{ height: heights.ep1 }}
          ></img>
        </div>        
      </div>
      {!inCompact &&
      <div className="row gx-1 my-3">
        <div className="col-12 text-center my-2">Remaining time to click : <CountDown seconds={15} urlDst={`/${worker_id}/${campaign_id}/TutorialErrors`} /></div>
        <div className="col-12 text-center"></div>
      </div>
      }
    </div>
  );
}

export default TutorialTumor;
