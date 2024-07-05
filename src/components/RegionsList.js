import React, { useEffect, useState } from "react";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { useParams, useNavigate } from "react-router-dom";
import sjcl from 'sjcl'
import "bootstrap/dist/css/bootstrap.min.css";
import arrayMove from "array-move";
import useStore from "../store";
import TutorialCompact from "./TutorialCompact";
import Canvas from "./Canvas";
import "../styles.css";


const SortableItem = SortableElement(({ regionHash, region, sortIndex, onRemove }) => {
  return (
    <div
      className="region"
      style={{
        boxShadow: `0 0 5px ${region.color}`,
        border: `1px solid ${region.color}`,
      }}
    >
      Region #{regionHash}
      <button
        onClick={() => {
          onRemove(sortIndex);
        }}
      >
        Delete
      </button>
    </div>
  );
});


const SortableList = SortableContainer(({ items, onRemove }) => {
  return (
    <div className="regions-list">
      {items.map((region, index) => (
        <SortableItem
          key={`item-${region.id}`}
          index={index}
          region={region}
          onRemove={onRemove}
          sortIndex={index}
          regionHash={index + 1}
        />
      ))}
    </div>
  );
});


function RegionList() {
  const regions = useStore((s) => s.regions);
  const { worker_id, campaign_id } = useParams();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const imagesN = JSON.parse(decodeURIComponent(searchParams.get("chaz")));
  const setRegions = useStore((s) => s.setRegions);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false)
  const [imageI, setimageI] = useState(0);


  const displayCordinates = () => {
    setShowCoordinates(!showCoordinates);
  };


  const listCoordinates = () => <div></div>;

  //States for changing Image source on the Task page
  const [imageSrc, setImgSrc] = useState(imagesN[0]);
  const [disabled, setDisabled] = useState(true); // state for next and previous image
  const [imageRegions, setImageRegions] = useState([]);
  const [canSave, setCanSave] = useState(false); // state for next and previous image
  var lastImage = false;
  const no_images_to_annotate = 5
 
  
  //Annon function for next button
  const incrementImg = () => {
    var newIndexNext = -1;
    if (imageI < no_images_to_annotate) {
      newIndexNext = imageI + 1;
      setimageI(newIndexNext);
      setImgSrc(imagesN[newIndexNext]);
      setDisabled(false);
      if (imageSrc === no_images_to_annotate - 1) {
        let nextBtn = document.querySelector(".sum");
        nextBtn.innerHTML = "Continue";
        setCanSave(true)
      }
      
    }
    if (newIndexNext === no_images_to_annotate-1) {
      lastImage = true;
    }
    if (lastImage){
      //console.log("CanSave", newIndexNext);
      let nextBtn = document.querySelector(".sum");
      nextBtn.innerHTML = "Continue";
      setCanSave(true);
    }
  };

  //Annon function for previous button
  const decrementImg = () => {
    if (imageI > 0) {
      let nextBtn = document.querySelector(".sum");
      nextBtn.innerHTML = "Next";
      const newIndexPrev = imageI - 1;
      setimageI(newIndexPrev);
      setImgSrc(imagesN[newIndexPrev]);
      setRegions(regions.concat());
      setDisabled(false);
      lastImage = false;
      setCanSave(false);

      // Assuming imageRegions is the state variable containing the array of image regions
      const updatedImageRegions = imageRegions.slice(0, -1);
      // Now updatedImageRegions contains all elements of imageRegions except the last one

      // Update the state with the new array
      setImageRegions(updatedImageRegions);

      if (newIndexPrev === 0) {
        setDisabled(true);
      }
    }
  };


  //Clear drawings after an interval 
  const clearRegions = () => {
    setRegions([]);
  };

  // Function to correct region Id's
  const saveCordinates = async () => {
    if (regions.length > 0) {
      const imageRegion = {
        image_number: imageSrc,
        regions
      };

      setImageRegions([...imageRegions, imageRegion]);
      var coordinatesToSave = [...imageRegions, imageRegion];


      const PaymentCode = "36jk88lpoxt";
      const PaymentGeneratorString = `${worker_id}${campaign_id}${PaymentCode}`;
      const myBitArray = sjcl.hash.sha256.hash(PaymentGeneratorString)
      const myHash = sjcl.codec.hex.fromBits(myBitArray);

      if (canSave) {
        const saveData = {
          campaign_id: campaign_id,
          worker_id: worker_id,
          paymentCode: myHash,
          coordinates: coordinatesToSave
        };
        const response = await fetch("https://annotation-backend-9bc6a8af9348.herokuapp.com/Task", {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          },
          body: JSON.stringify(saveData)
        }).then(()=>{localStorage.setItem('paymentCode', myHash);
        navigate(`/${worker_id}/${campaign_id}/Payment`)});

        
      }
    }

  }


  //Parent function for Task page 
  const wrappedNextFunc = async () => {
    setLoading(true)
    displayCordinates();
    await saveCordinates();
    clearRegions();
    incrementImg();
    setLoading(false)
  };

  /* Navigate to Tutorial  */
  const openTutorial = () => {
    setShowTutorial(true)
  };

  const [errorType, setErrorType] = useState(null);

  return (
    <div>
      <div hidden={!loading}>
        Loading content ...
      </div>
      <div hidden={loading}>
        <div className="text-center"><h5 className="description me-2 mb-4"> Please annotate the tumors regions ({imageI+1} / {no_images_to_annotate})</h5></div>
        <div className="Task-container col-md-12">
          <Canvas
            imageSrc={imageSrc}
            setErrorType={setErrorType}
            errorType={errorType}
            setShowTutorial={setShowTutorial}
          />
        </div>

        <SortableList
          items={regions}
          onSortEnd={({ oldIndex, newIndex }) => {
            setRegions(arrayMove(regions, oldIndex, newIndex));
          }}
        
          onRemove={(index) => {
            regions.splice(index, 1);
            setRegions(regions.concat());
          }}
        />
        <div style={{
          "float": "right",
          "bottom": "40px",
          "right": "40px",
          "backgroundColor": "#cfd7de",
          "box-shadow": "2px 2px 3px #999",
          "paddingLeft": "10px",
          "paddingRight": "10px",
          "marginTop": "10px",
          "cursor": "pointer"
        }}>
          <h5 onClick={openTutorial} >Help? <img src="/logo.png" alt="open tutorial"></img></h5>
        </div>
        <div className="d-flex container justify-content-center mt-5">
          <button
            onClick={decrementImg}
            className="previous sub"
            disabled={disabled}
          >
            &laquo; Previous
          </button>
          <div style={{ width: "100px" }}></div>
          <button onClick={wrappedNextFunc} className="next sum" disabled={regions.length === 0}>
            Next &raquo;
          </button>
          {showCoordinates && listCoordinates()}
        </div>
      </div>
      <TutorialCompact showTutorialTumor={!errorType} showTutorialError={!errorType} showTutorialDescription={!errorType} errorType={errorType} show={showTutorial} onClose={() => {
        setShowTutorial(false)
      }} />

    </div>
  );
}

export default RegionList;
