
import React from "react";
import ReactDOM from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Questionaries from "./Questionaries";
import Description from "./Description";
import Task from "./Task";
import SlideShow from "./Testing/SlideShow"
import SlideTwo from "./Testing/SlideTwo";
import FinalSlide from "./Testing/FinalSlide";
import Test from "./Testing/Test"
import TutorialDescription from "./TutorialDescription";
import TutorialTumor from "./TutorialTumor";
import TutorialErrors from "./TutorialErrors";
import CountDown from "./CountDown";
import LoadImages from "./LoadImages";

/*import GenerateWorkerAndCampaignId from "./GenerateWorkerAndCampaignId";*/
import Payment from "./Payment";

function Routing() {
  return (
    <>
      <Router>
        <Routes>         
          <Route path="/:worker_id/:campaign_id/Questionair" element={<Questionaries />} />
          <Route path="/:worker_id/:campaign_id/Description"  element={<Description />} />
          <Route path="/:worker_id/:campaign_id/Test" element={<Test />} />
          <Route path="/:worker_id/:campaign_id/SlideShow" element={<SlideShow />} />
          <Route path="/:worker_id/:campaign_id/SlideTwo" element={<SlideTwo />} />
          <Route path="/:worker_id/:campaign_id/FinalSlide" element={<FinalSlide />} />
          <Route path="/:worker_id/:campaign_id/Task" element={<Task />} />
          <Route path="/:worker_id/:campaign_id/LoadImages" element={<LoadImages />} />
          <Route path="/:worker_id/:campaign_id/Payment" element={<Payment />} /> 
          <Route path="/:worker_id/:campaign_id/TutorialDescription" element={<TutorialDescription />} />  
          <Route path="/:worker_id/:campaign_id/TutorialTumor" element={<TutorialTumor />} />      
          <Route path="/:worker_id/:campaign_id/TutorialErrors" element={<TutorialErrors />} />
          <Route path="/:worker_id/:campaign_id/Countdown" element={<CountDown hours={0} minutes={0} seconds={5} />} />
        </Routes>
      </Router>
    </>
  );
}

export default Routing;