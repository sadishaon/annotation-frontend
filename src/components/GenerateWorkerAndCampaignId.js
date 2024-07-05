import React, { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";

export default function GenerateWorkerAndCampaignId() {
  setLocalHost();
  
  const campaignId = localStorage.getItem('campaignId');
  const workerId = localStorage.getItem('workerId');

  const navigate = useNavigate();
   
  useEffect(() => {
    navigate(`/${workerId}/${campaignId}`, { replace: true }); //URL to include in every route
    // eslint-disable-next-line
  }, []);
    
  return (
    <></>
  )
}

const setLocalHost = () => {
  localStorage.setItem('campaignId', 'c781');
  //Setting worker_id and campaign_id from uuid pacakge

  if (!localStorage.getItem('workerId')) {
    const uuid = uuidv4();
    localStorage.setItem('workerId', uuid);
  }
}
