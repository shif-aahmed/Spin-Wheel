import React, { useState, useEffect, useRef } from 'react';
import HeaderWithResults from '../components/HeaderWithResults/HeaderWithResults';
import Wheel from '../components/Wheel/Wheel';
import Controls from '../components/Controls/Controls';
import Results from '../components/Results/Results';
import WinnersLadder from '../components/WinnersLadder/WinnersLadder';
import Participants from '../components/Participants/Participants';
import WinnerPopup from '../components/WinnerPopup/WinnerPopup';
import RigControls from '../components/RigControls/RigControls';
import WheelOverlay from '../components/WheelOverlay/WheelOverlay';

import '../style.css';
import { pakistan, dubai, celtic, AE1500 } from '../people';

const MAX_SLICES = 200;

const Home = () => {
  const datasetsMap = {
    1: pakistan,
    2: AE1500,
    3: celtic,
    4: dubai
  };

  const [spinCount, setSpinCount] = useState(0);
  const [fullData, setFullData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [customColors, setCustomColors] = useState([]);
  const [selectedSound, setSelectedSound] = useState('spin2.mp3');
  const [applauseSound, setApplauseSound] = useState('applause1');

  const isSpinningRef = useRef(false);
  const intervalID = useRef(null);

  const riggedWinnersList = [
    { name: 'Waseem Malik', ticketNumber: 'F5' },
    { name: 'Alan Mackenzie', ticketNumber: '1197' },
    { name: 'Marc', ticketNumber: '743' }
  ];

  const getRandomBatch = (fullList, winner = null) => {
    const pool = [...fullList];
    if (winner) {
      const exists = pool.some(p => p.name === winner.name && p.ticketNumber === winner.ticketNumber);
      if (!exists) {
        pool[Math.floor(Math.random() * pool.length)] = winner;
      }
    }
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(MAX_SLICES, shuffled.length));
  };

  const prepareDataForSpin = () => {
    const nextSpin = spinCount + 1;

    let dataset = datasetsMap[4]; // default = dubai
    let winner = null;

    if (nextSpin === 1) {
      dataset = datasetsMap[1];
      winner = riggedWinnersList[0];
    } else if (nextSpin === 2) {
      dataset = datasetsMap[2];
      winner = riggedWinnersList[1];
    } else if (nextSpin === 3) {
      dataset = datasetsMap[3];
      winner = riggedWinnersList[2];
    }

    const transformed = dataset.map(p => ({ name: p.name, ticketNumber: p.ticketNumber }));
    setFullData(transformed);
    const batch = getRandomBatch(transformed, winner);
    setCurrentData(batch);
  };

  useEffect(() => {
    prepareDataForSpin();
  }, [spinCount]);

  const handleSpinStart = () => {
    isSpinningRef.current = true;
  };

  const handleSpinEnd = () => {
    isSpinningRef.current = false;
    setSpinCount(prev => prev + 1);
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
              getNextArray={() => fullData}
              getRandomBatch={(list) => getRandomBatch(list)}
              customColors={customColors}
              selectedSound={selectedSound}
              applauseSound={applauseSound}
              onSpinStart={handleSpinStart}
              onSpinEnd={handleSpinEnd}
            />
            <Controls />
            <Results />
            <WinnersLadder />
          </div>
          <Participants currentData={fullData} />
        </div>
        <WinnerPopup />
        <RigControls currentData={currentData} />
      </div>
    </>
  );
};

export default Home;
