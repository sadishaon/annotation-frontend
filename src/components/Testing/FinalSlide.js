import React from 'react'

function FinalSlide({TestAnswers,setTestanswers}) {
  const handleTestAnswers = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;    
    setTestanswers({ ...TestAnswers, [name]: value });
   
  };
  return (
    <div>
       <div className="Container">
          <div className="row justify-content-around py-4">
            <div className="col-sm-6 col-md-6 col-lg-5 col-xxl-6 col-xl-5">
              <img src="/Testing/Test3_A.jpg" className="card-img-size img-fluid" ></img>
              <div className="d-flex justify-content-center my-5">
                <input type="radio" className="ms-3" name="Q3" value="A" onChange={handleTestAnswers} ></input>
                <label>A</label>
              </div>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-5 col-xxl-6 col-xl-5">
              <img src="/Testing/Test3_B.jpg" className="card-img-size img-fluid" ></img>
              <div className="d-flex justify-content-center my-5">
                <input type="radio" className="ms-3" name="Q3" value="B" onChange={handleTestAnswers}></input>
                <label>B</label>
              </div>
            </div>
          </div>
        </div> 
    </div>
  )
}

export default FinalSlide