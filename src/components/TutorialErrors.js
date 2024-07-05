import React,{useState} from "react";

import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CountDown from "./CountDown";

function TutorialErrors({ 
  heights={en1: '25vh', en2: '29vh', en3: '29vh', ep1: '29vh'}, 
  inCompact=false}) {
  const { worker_id, campaign_id } = useParams();
  const [disabled,setDisabled] = useState(true)

  const navigate = useNavigate();

  return (
    <div
      className="container"
      style={{
        backgroundColor: "#FFFFFF", width: "100%",
      }}
    >
      <h3 className="text-center mt-5"> {!inCompact && 'Tutorial: '}Common errors, what a tumor does NOT look like</h3>      
      <div className="row gx-1 justify-content-center" >
        <div className="col-md-12 col-xl-9">
          <div className="row">

            <div className="col-12">
              <h5>Example 1:</h5>
                <img
                  src="/Slideshow/image_3-1.jpg"
                  alt="show1"
                  style={{ height: heights.en1 }}
                ></img>
            </div>
            
            <div className="col-lg-4 col-sm-12 my-3">
              <h5>Example 2:</h5>
              <img
                src="/Slideshow/image_3-2.jpg"
                alt="show2"
                style={{ height: heights.en2 }}
              ></img>
            </div>
            
            <div className="col-lg-3 col-sm-12 my-3">
              <h5>Example 3:</h5>
              <img
                src="/Slideshow/image_3-3.jpg"
                alt="show3"
                style={{ height: heights.en3 }}
              ></img>
            </div>
            

          </div>
        </div>
        {!inCompact && 
        <div className="col-md-12 col-xl-3">
          <h5>Remember, a tumor looks like:</h5>
          <img
            src="/Slideshow/image_3-4.jpg"
            alt="show4"
            style={{ height: heights.ep1 }}
          ></img>
        </div>
        }
      </div>
      {!inCompact &&
      <div className="row gx-1 my-3">
        <div className="col-12 text-center">Remaining time to click : <CountDown seconds={30} urlDst={`/${worker_id}/${campaign_id}/Test`} /></div>
        <div className="col-12 text-center"></div>
      </div>
      }
    </div>
  );
}

export default TutorialErrors;
