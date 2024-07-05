import React,{useState} from "react";

import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CountDown from "./CountDown";

function TutorialDescription({ 
  heights={v1: '60vh'}, 
  inCompact=false}) {
  const { worker_id, campaign_id } = useParams();
  const [disabled,setDisabled] = useState(true)

  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{ backgroundColor: "#FFFFFF", width: "100%", textAlign: inCompact ? "left" : "center" }}
    >
      <h3 className="text-center py-4">{!inCompact ? 'Tutorial: basic': 'How to annotate a tumor'} </h3>
      <div className="col-12">
          <center>
          <video 
            controls={true}
            autoPlay={true}
            src="/Slideshow/video_1-2.mp4"
            alt="How to annotate a tumor"
            style={{ height: heights.v1 }}
          ></video>
          </center>
      </div>
      {!inCompact &&
      <div className="row gx-1 my-3">
        <div className="text-center my-2">Remaining time to click: <CountDown seconds={30} urlDst={`/${worker_id}/${campaign_id}/TutorialTumor`} /></div>
        <div className="col text-center"></div>
      </div>
      }
    </div>
  );
}

export default TutorialDescription;
