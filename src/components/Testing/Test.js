import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import FinalSlide from "./FinalSlide";
import SlideShow from "./SlideShow";
import SlideTwo from "./SlideTwo";
import TutorialCompact from "../TutorialCompact";

import { useNavigate, useParams } from "react-router-dom";

function Test() {
  const [page, setPage] = useState(0);
  const { worker_id, campaign_id } = useParams();
  const [interval, stInterval] = useState(120);
  const [disabled, setDisabled] = useState(true);
  const [TestAnswers, setTestanswers] = useState({
    worker_id: worker_id,
    campaign_id: campaign_id,
    Q1: "",
    Q2: "",
    Q3: "",
  });
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    let timeout = setInterval(function () {
      stInterval(interval - 1);
      if (interval === 0) {
        clearInterval(timeout);
        redirection();
      }
    }, 1000);
    return ()=> {
      clearInterval(timeout);
    };
  });

  const TestTitle = [
    "Select which image contains the tumor",
    "Select which image contains the tumor",
    "Select which image is annotated correctly",
  ];




  function beep() {
    setDisabled(false);
  }

  function redirection() {
    navigate(`/${worker_id}/${campaign_id}/TutorialDescription`);
  }

  function startTimeOutRedirect() {
    
    //setTimeout(redirection, 5000);
    
  }

  const PageDisplay = () => {
    if (page === 0) {
      return (
        <SlideShow TestAnswers={TestAnswers} setTestanswers={setTestanswers} />
      );
    } else if (page === 1) {
      return (
        <SlideTwo
          TestAnswers={TestAnswers}
          setTestanswers={setTestanswers}
        ></SlideTwo>
      );
    } else if (page === 2) {
      return (
        <FinalSlide
          TestAnswers={TestAnswers}
          setTestanswers={setTestanswers}
        ></FinalSlide>
      );
    }
  };
  const navigate = useNavigate();

  const openTutorial = () => {
    setShowTutorial(true)
  };

  function check() {
    var failure = document.querySelector(".failure");
    failure.innerText = "Test failed please watch the tutorial and answer again.";
  }

  async function testPost() {
    try {
      const res = await fetch("https://annotation-backend-9bc6a8af9348.herokuapp.com/Test", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          campaign_id: campaign_id,
          worker_id: worker_id,
          Q1: TestAnswers.Q1,
          Q2: TestAnswers.Q2,
          Q3: TestAnswers.Q3,
        }),
      });
    } catch (error) {
      window.alert("Error saving your data. Please try again.");
    }
  }

  return (
    <Container fluid>
      <div className="test-container">
        <div className="header">
          <h1 className="d-inline-block text-center">
            Test your knowledge to get to the task{" "}
          </h1>
          <div className="text-center my-2" hidden={disabled}>
            You failed the test. You will be redirected to the tutorial in: {interval}</div>
            
          <div hidden={!disabled}>
          <h5
            className="d-inline-block ms-5 tutorial"
            style={{ cursor: "pointer" }}
            onClick={openTutorial}
          >
            Tutorial<img src="/logo.png" alt="logo"></img>
          </h5>
          </div>
          <h5 hidden={!disabled}>{TestTitle[page]}</h5>
        </div>
        <div className="body2" hidden={!disabled}>{PageDisplay()}</div>
        <div className="text-center failure mb-4"></div>
        <div className="btn-col  d-flex">
          <button
            className="previous"
            disabled={page === 0}
            onClick={() => {
              setPage((currentPage) => currentPage - 1);
              var failure = document.querySelector(".failure");
              failure.innerText = "";
            }}
          >
            &laquo;Previous
          </button>
          <div style={{ width: "80px" }}></div>
          <button
            className="next"
            disabled={page === TestTitle.length}
            onClick={() => {
              if (page === TestTitle.length - 1) {
                testPost();
                if (TestAnswers.Q1 === "A" && TestAnswers.Q2 === "B" && TestAnswers.Q3 === "A") {
                  navigate(`/${worker_id}/${campaign_id}/LoadImages`);
                } else {
                  setPage(0)
                  check();
                  beep();
                  stInterval(5);
                 
                }
              } else {
                const buttons = document.querySelectorAll(
                  "input[type='radio']"
                );
                buttons.forEach((button) => {
                  if (!button.checked) {
                    button.setAttribute("required", "");
                    var failure = document.querySelector(".failure");
                    failure.innerText = "Select one option";
                  }

                  if (button.checked) {
                    // eslint-disable-next-lin
                    setPage((currentPage) => currentPage + 1);
                    var failure2 = document.querySelector(".failure");
                    failure2.innerText = "";
                  }
                });
              }
            }}
          >
            {page === TestTitle.length - 1 ? "Continue" : "Next"}
          </button>
        </div>
      </div>
      <TutorialCompact show={showTutorial} setShow={setShowTutorial} showTutorialDescription={false}/>
    </Container>
  );
}

export default Test;
