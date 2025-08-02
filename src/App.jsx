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

import './style.css';
import { pakistan, dubai, celtic, AE1500 } from './people';

const MAX_SLICES = 60;

const App = () => {
  const datasets = [pakistan, dubai, celtic, AE1500];
  const [datasetIndex, setDatasetIndex] = useState(0);

  const [fullData, setFullData] = useState([]);
  const [currentData, setCurrentData] = useState([]);

  const [customColors, setCustomColors] = useState([]);
  const [selectedSound, setSelectedSound] = useState('spin.mp3');
  const [applauseSound, setApplauseSound] = useState('applause1');

  const riggedWinnersList = [
    { name: 'Waseem Malik', ticketNumber: 'F5' },
    { name: 'Alan Mackenzie', ticketNumber: '1197' },
    { name: 'Marc', ticketNumber: '743' }
  ];

  useEffect(() => {
    const selected = datasets[datasetIndex];
    const transformed = selected.map(row => ({
      name: row.name,
      ticketNumber: row.ticketNumber
    }));
    setFullData(transformed);
  }, [datasetIndex]);

  const getNextArray = (currentArray) => {
    const rotated = [...currentArray];
    const first = rotated.shift();
    rotated.push(first);
    return rotated;
  };

  const getRandomBatch = (fullList) => {
    const requiredWinners = riggedWinnersList;

    const validatedWinners = requiredWinners.filter(r =>
      fullList.some(p => p.name === r.name && p.ticketNumber === r.ticketNumber)
    );

    const pool = fullList.filter(
      p => !validatedWinners.some(r => r.name === p.name && r.ticketNumber === p.ticketNumber)
    );

    const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

    const batch = [...validatedWinners, ...shuffledPool.slice(0, Math.min(MAX_SLICES - validatedWinners.length, shuffledPool.length))];

    return batch.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    setCurrentData(getRandomBatch(fullData));
  }, [fullData]);

  const handleSpinEnd = () => {
    setDatasetIndex((prevIndex) => (prevIndex + 1) % datasets.length);
  };

  return (
    <>
      <div className='overlay'>
        <WheelOverlay
          onColorsChange={setCustomColors}
          onSoundChange={setSelectedSound}
          onApplauseSoundChange={setApplauseSound}
        />
        <HeaderWithResults />
      </div>

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
              applauseSound={applauseSound}
              onSpinEnd={handleSpinEnd}
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
