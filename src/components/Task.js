import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";


import "bootstrap/dist/css/bootstrap.min.css";
import RegionsList from "./RegionsList";


function Task() {

  const navigate = useNavigate();
  const { worker_id, campaign_id } = useParams();
  const regionList = React.createRef()

  

  const checkWorker = () => {
    fetch("https://annotation-backend-9bc6a8af9348.herokuapp.com/CheckWorker", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        worker_id: worker_id
      })
    })
      .then(res => {
        return res.json()
      })
      .then(data => {
        if (data.alreadyFinish || data.dummyWorkerId) {
          navigate(`/${worker_id}/${campaign_id}/Questionair`)
        }
      })
      .catch(error => {
        window.alert("Not able to check previous data for loading the task. Please try again.")
        console.log(error)
      })
  }

  useEffect(() => {
    checkWorker()
  }, [])

  return (
    <div className="container">
      <div className="container wrapper">
        <div style={{ "textAlign": "center" }}>
          <p style={{ "visibility": "hidden", "width": "125px" }}>extra</p>
          <h3 className="c-inline-block">Annotation Task </h3>
        </div>
  
        <RegionsList/>       
        
      </div>

    </div>

  );
}

export default Task;