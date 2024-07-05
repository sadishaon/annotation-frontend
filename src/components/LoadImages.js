import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useStore from "../store";


function LoadImages() {
  const { worker_id, campaign_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://annotation-backend-9bc6a8af9348.herokuapp.com/get_ids?count=6&amountToSubextract=8",
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const dataImgs = await response.json();
        //console.log("dataImgs",dataImgs);
        navigate(`/${worker_id}/${campaign_id}/Task?chaz=${encodeURIComponent(JSON.stringify(dataImgs))}`);
      } catch (error) {
        window.alert(
          "Not able to check images data for loading the task. Please try again."
        );
        console.error(error);
      }
    };

    fetchData();
  }, [ navigate, worker_id, campaign_id]);

  return null; // assuming LoadImages is just for side-effects
}

export default LoadImages;
