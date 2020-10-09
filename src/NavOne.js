import React from 'react';
import { Line } from 'react-lineto';

function NavOne() {
  return (

    
    <div className="App" >
    <img src={require("./assets/images/react.png" )} style={{width:'30px', height:'30px'}}/>
      <h5 suppressContentEditableWarning
  contentEditable>React JS</h5>
      {/* <Line x0={300} y0={100} x1={100} y1={150}  orientation="h" borderColor="blue" borderWidth={1}/>      */}
      </div>
  );
}

export default NavOne;
