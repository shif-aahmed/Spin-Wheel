import React, { useState, useEffect } from 'react';
import HeaderWithResults from './components/HeaderWithResults/HeaderWithResults';
import Wheel from './components/Wheel/Wheel';
import Controls from './components/Controls/Controls';
import Results from './components/Results/Results';
import WinnersLadder from './components/WinnersLadder/WinnersLadder';
import Participants from './components/Participants/Participants';
import WinnerPopup from './components/WinnerPopup/WinnerPopup';
import RigControls from './components/RigControls/RigControls';
import WheelOverlay from './components/WheelOverlay/WheelOverlay';

import { MarchMystery, goldentries, participants as defaultParticipants } from './people';
import './style.css';

const MAX_SLICES = 60;


const App = () => {
  const [fullData, setFullData] = useState(MarchMystery);
  const [currentData, setCurrentData] = useState([]);

  const [customColors, setCustomColors] = useState([]);
  const [selectedSound, setSelectedSound] = useState('spin.mp3');
  const [applauseSound, setApplauseSound] = useState('applause1'); // ✅ NEW

  const getNextArray = (currentArray) => {
    if (currentArray === MarchMystery) return goldentries;
    if (currentArray === goldentries) return defaultParticipants;
    return MarchMystery;
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
      />
      <HeaderWithResults /></div>
    <div className="main-layout">
      
      

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
