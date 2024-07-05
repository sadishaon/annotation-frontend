import React from "react";


function SlideShow({ TestAnswers, setTestanswers }) {
  const handleTestAnswers = (event) => {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    setTestanswers({ ...TestAnswers, [name]: value });
  };


  return (
    <div className="Container">
      <div className="row justify-content-around py-4">
        <div className="col-sm-6 col-md-6 col-lg-5 col-xxl-6 col-xl-5">
          <img
            src="/Testing/Test1_A.jpg"
            className="card-img-size img-fluid"
            
          ></img>
          <div className="d-flex justify-content-center my-5">
            <p>
              <input
                type="radio"
                className="ms-3"
                name="Q1"
                value="A"
                onChange={handleTestAnswers}
                required
              ></input>
              <label>A</label>
            </p>
          </div>
        </div>
        <div className="col-sm-6 col-md-6 col-lg-5 col-xxl-6 col-xl-5">
          <img
            src="/Testing/Test1_B.jpg"
            className="card-img-size img-fluid"
          ></img>
          <div className="d-flex justify-content-center my-5">
            <p>
              <input
                type="radio"
                className="ms-3"
                name="Q1"
                value="B"
                onChange={handleTestAnswers}
              ></input>
              <label>B</label>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SlideShow;
