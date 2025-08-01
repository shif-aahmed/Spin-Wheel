import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HeaderWithResults from './components/HeaderWithResults';
import Wheel from './components/Wheel';
import Controls from './components/Controls';
import Results from './components/Results';
import WinnersLadder from './components/WinnersLadder';
import Participants from './components/Participants';
import WinnerPopup from './components/WinnerPopup';
import RigControls from './components/RigControls';
import WheelOverlay from './components/WheelOverlay';
import './style.css';

const MAX_SLICES = 60;


const App = () => {
  const [fullData, setFullData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  const [customColors, setCustomColors] = useState([]);
  const [selectedSound, setSelectedSound] = useState('spin.mp3');
  const [applauseSound, setApplauseSound] = useState('applause1'); // ✅ NEW

  useEffect(() => {
  axios.get('http://localhost:4000/api/tickets') // or your server IP if deployed
    .then(res => {
      const transformed = res.data.map(row => ({
        name: `${row.firstName} ${row.lastName}`,
        number: row.ticketNumber
      }));
      setFullData(transformed);
    })
    .catch(err => {
      console.error('Failed to fetch ticket data:', err);
    });
}, []);

 const getNextArray = (currentArray) => {
  const rotated = [...currentArray];
  const first = rotated.shift(); 
  rotated.push(first);           
  return rotated;
};



  const getRandomBatch = (fullList) => {
    const shuffled = [...fullList].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(MAX_SLICES, fullList.length));
  };

  useEffect(() => {
    setCurrentData(getRandomBatch(fullData));
  }, [fullData]);

  return (
    <><div className='overlay'>
      <WheelOverlay
        onColorsChange={setCustomColors}
        onSoundChange={setSelectedSound}
        onApplauseSoundChange={setApplauseSound} // ✅ NEW
      /></div>
    <div className="main-layout">
      
      <HeaderWithResults />

      <div className="container">
        <div className="wheel-section">
          <Wheel
            fullData={fullData}
            setFullData={setFullData}
            currentData={currentData}
            setCurrentData={setCurrentData}
            getNextArray={getNextArray}
            getRandomBatch={getRandomBatch}
            customColors={customColors}
            selectedSound={selectedSound}
            applauseSound={applauseSound} // ✅ NEW
          />
          <Controls />
          <Results />
          <WinnersLadder />
        </div>

        <Participants currentData={currentData} />
      </div>

      <WinnerPopup />
      <RigControls currentData={currentData} />

  
    </div>
    </>
  );
};

export default App;
