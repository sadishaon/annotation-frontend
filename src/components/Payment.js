import React, { useEffect } from "react";
import { useNavigate, useParams} from "react-router-dom";


function Payment() {

  const navigate = useNavigate();
  const {worker_id, campaign_id } = useParams();

  const myHash = localStorage.getItem('paymentCode');
  const testMode = true;

  const tryWorkerFinish = () => {
    fetch("https://annotation-backend-9bc6a8af9348.herokuapp.com/finishWorker", { 
      method: "POST",
      headers:{
        "Content-type" : "application/json"
      },
      body: JSON.stringify({ 
        worker_id: worker_id
      })})
    .then (res => {
      return res.json()
    })
    .then (data => {
      if(data.notFinishedYet) {
        navigate(`/${worker_id}/${campaign_id}/Questionair`)
      }
    })
    .catch (error => {
      window.alert("Not able to check previous data for loading the task. Please try again.")
      console.log(error)
    }) 
  }

  useEffect(() => {
    tryWorkerFinish()
  }, [])

  return (
    <>
        <div className="payment-container">
            <h2 className="text-center mt-6">Thank you for taking part in the task</h2>
            {testMode
              ? <div> 
                  <h3 className="mt-5">Payment code 1:</h3>
                  <div>
                    <h4 className="mt-5">Please <b>copy and save</b> the code 1 to receive your payment. You won't be able to see this code anymore.</h4>
                  </div>
                </div>
              : <div>
                  <h3 className="mt-5">Payment code:</h3>
                  <h4 className="mt-5">Please <b>copy and save</b> the payment code below to receive your payment</h4>
                </div>
            }
            <div className="payment-box d-flex align-items-center justify-content-center ">
                <h5 >{`${myHash}`}</h5>
            </div>
            {testMode && <div>
                <h4 className="mt-5">To get the payment code 2 continue in the left side of the screen</h4>
                  <img src="/left-arrow.png" alt="Continue on the left" style={{ width: "80px" }}></img>
                </div>
            }
        </div>
    </>
  )
}

export default Payment