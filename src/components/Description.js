import React,{useState} from "react";
import { useNavigate ,useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import CountDown from "./CountDown";


function Description() {
  const navigate = useNavigate();
  const [disabled,setDisabled] = useState(true)
  //let count = 5;
  const {worker_id, campaign_id} = useParams();


  ///////////// Time Counting /////////////

  // const [interval,stInterval] = useState(10);
  
  // setTimeout(beep,10000) 
  // let timeout = setInterval(function () {
  //   stInterval(interval - 1)   
  // },1000);
  

  // if (interval === 0) {
  //   clearInterval(timeout);
   
  // }
   

  // function beep() {
  //   setDisabled(false);
  // }
  

  /////////////////////////////////////////
 
  return (
    <div
      className="body"
      style={{
        backgroundColor: "#FFFFF",
        height: "100vh",
        width: "100%",
        //overflow: "hidden",
      }}
    >
      <Container className="main-container">
        <Container>
          <div className="col-12 mt-5">
            <h1 className="text-center fw-medium">General Information</h1>
          </div>
        </Container>
        <div style={{ height: "0.5rem" }}></div>
        <div className="col-12 mt-3">
          <h3>Task Description</h3>
        </div>
        <div className="col-12 mt-3">
          <p>
            You will detect and annotate tumors in five different images.
          </p>
        </div>
        <div style={{ height: "1.0rem" }}></div>
        <Container>
          <div className="row justify-content-between">
            <div className="col-5">
              <div className="d-flex">
                <img src="/logo.png" alt="logo" style={{ width: "50px" }}></img>
                <h3 className="align-self-center mb-0 px-4">
                  Task Guidelines
                </h3>
              </div>
              <ol className="list-group mt-3">
                <li className="list-group-item py-3">
                1. Fill out the <b>questionnaire</b>
                </li>
                <li className="list-group-item py-3">
                2. Watch the <b>tutorial</b> – you can always rewatch it
                </li>
                <li className="list-group-item py-3">
                3. Perform a quick <b>knowledge check</b>
                </li>
                <li className="list-group-item py-3">
                4. <b>Annotate</b> the images
                </li>
                <li className="list-group-item py-3">
                5. Get your <b>payment code</b>
                </li>                
              </ol>
            </div>
            <div className="col-6">
              <div className="d-flex">
                <img src="/logo2.png" alt="logo" style={{ width: "50px" }}></img>
                <h3 className="align-self-center mb-0 px-4">
                  Interface Instructions
                </h3>
              </div>
              <ul className="list-group mt-3"> 
                <li className="list-group-item py-3">
                Press and hold left mouse button to annotate
                </li>            
                <li className="list-group-item py-3">
                Press “next image” when finished with annotating
                </li>
                <li className="list-group-item py-3">
                Your progress will be saved automatically
                </li>
                <li className="list-group-item py-3">
                For help, you can always rewatch the tutorial with the button “tutorial"
                </li>
                <li className="list-group-item py-3">
                For correct visualization, please adjust the zoom of browser between 80% and 100%
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center my-3">
          <div className="col-12 text-center my-2">Remaining time to click : <CountDown seconds={30} urlDst={`/${worker_id}/${campaign_id}/TutorialDescription`}  /></div>
            
          </div>
          
        </Container>
      </Container>
    </div>
  );
}

export default Description;
