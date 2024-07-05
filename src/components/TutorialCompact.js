import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Modal from 'react-bootstrap/Modal';
import TutorialTumor from "./TutorialTumor";
import TutorialErrors from "./TutorialErrors";
import TutorialDescription from "./TutorialDescription";


const errroListMap = {
  "dark-dot": "/dark-dots.JPG",
  "pink-zone": "/pink-zones.JPG",
  "white-zone": '/white-zones.JPG',
  'red-zone': '/red-zones.JPG',
  'area': '/area.gif',
  'line': '/shape.gif'
}

function TutorialCompact({
  show,
  onClose: handleClose,
  fullscreen = 'sm-down',
  size = 'lg',
  showTutorialTumor = true,
  showTutorialError = true,
  showTutorialDescription = true,
  errorType
}) {


  return (
    <div
      className="modal show"
      style={{ display: 'block', position: 'initial' }}
    >
      <Modal
        size={size}
        fullscreen={fullscreen}
        show={show}
        onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Tutorial</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <center>

            {showTutorialTumor &&
              <TutorialTumor
                inCompact={true}
                heights={{ ep1: '35vh', ep2: '35vh' }}  // was 25
              />
            }
          
          {showTutorialError &&
            <TutorialErrors
              inCompact={true}
              heights={{ en1: '20vh', en2: '22vh', en3: '22vh' }}
            />
          }

          {showTutorialDescription &&
            <TutorialDescription
              inCompact={true}
              heights={{ v1: '70vh' }}
            />
          }

          {
            errorType &&
            <div>
              <img src={'/error_Patterns' + errroListMap[errorType]} alt={errorType} />
            </div>
          }

          </center>

        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TutorialCompact;
