import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';

const CustomSlider = () => {
  const [slider1Value, setSlider1Value] = useState(33);
  const [slider2Value, setSlider2Value] = useState(33);

  const calculateSlider3Value = () => 100 - (slider1Value + slider2Value);
  const slider3Value = calculateSlider3Value();

  const handleSlider1Change = (e) => {
    const value = parseInt(e.target.value, 10);
    const remaining = 100 - value - slider2Value;

    setSlider1Value(value >= 0 ? value : 0);
    setSlider2Value(slider2Value + remaining >= 0 ? slider2Value + remaining : 0);
  };

  const handleSlider2Change = (e) => {
    const value = parseInt(e.target.value, 10);
    const remaining = 100 - value - slider1Value;

    setSlider2Value(value >= 0 ? value : 0);
    setSlider1Value(slider1Value + remaining >= 0 ? slider1Value + remaining : 0);
  };

  return (
    <div className="slider-container">
      <ProgressBar now={slider1Value} label={`Section 1: ${slider1Value}%`} variant="info" />
      <input type="range" value={slider1Value} onChange={handleSlider1Change} />
      <ProgressBar now={slider2Value} label={`Section 2: ${slider2Value}%`} variant="warning" />
      <input type="range" value={slider2Value} onChange={handleSlider2Change} />
      <ProgressBar now={slider3Value} label={`Section 3: ${slider3Value}%`} variant="success" />
    </div>
  );
};

export default function ManualSetup(){
    // Import necessary React and React-Bootstrap components
    return <div><CustomSlider /></div>


}