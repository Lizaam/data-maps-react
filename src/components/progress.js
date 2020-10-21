import React from 'react';
import Fade from 'react-reveal/Fade';

function ProgressAnimation() {
  return (
    <Fade duration={400}> 
      <div className="d-flex progress-animation"> 
        <div id="progress-animation-container" className="progress-shift-right">
          <p className="progress-text">Processing, Please Wait ...</p>
          <div className="outer-circle"></div>
        </div>
      </div>
    </Fade>
  )
}

export default ProgressAnimation;