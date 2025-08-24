import React, { useState, useEffect, useRef } from 'react';
import HeaderWithResults from '../components/HeaderWithResults/HeaderWithResults';
import Wheel from '../components/Wheel/Wheel';
import Controls from '../components/Controls/Controls';
import Results from '../components/Results/Results';
import WinnersLadder from '../components/WinnersLadder/WinnersLadder';
import Participants from '../components/Participants/Participants';
import WinnerPopup from '../components/WinnerPopup/WinnerPopup';
import WheelOverlay from '../components/WheelOverlay/WheelOverlay';

import '../style.css';

const MAX_SLICES = 200;

const Home = () => {
  const [spinCount, setSpinCount] = useState(0);
  const [filesData, setFilesData] = useState([]); // all files from backend
  const [fullData, setFullData] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [customColors, setCustomColors] = useState([]);
  const [selectedSound, setSelectedSound] = useState('spin2.mp3');
  const [applauseSound, setApplauseSound] = useState('applause1');
  const [currentFilePicture, setCurrentFilePicture] = useState(null);
  const [showBlackScreen, setShowBlackScreen] = useState(false);


  const isSpinningRef = useRef(false);

  const riggedWinnersList = [
    { name: 'Waseem Malik', ticketNumber: 'F5' },
    { name: 'Alan Mackenzie', ticketNumber: '1197' },
    { name: 'Marc Cleisham', ticketNumber: '743' }
  ];

  // fetch files & participants from backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/spins/list/`);
        const data = await res.json();

        const transformedFiles = (data || []).map(file => ({
          ...file,
          picture: file.picture,
          participants: (file.json_content || []).map(p => ({
            name: `${p["First Name"]} ${p["Last Name"]}`,
            ticketNumber: p["Ticket Number"]
          }))
        }));

        setFilesData(transformedFiles);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };

    fetchFiles();
  }, []);

  const getRandomBatch = (fullList, winner = null) => {
    const pool = [...fullList];
    if (winner) {
      const exists = pool.some(
        p => p.name === winner.name && p.ticketNumber === winner.ticketNumber
      );
      if (!exists) {
        pool[Math.floor(Math.random() * pool.length)] = winner;
      }
    }
    const shuffled = pool.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(MAX_SLICES, shuffled.length));
  };

  const prepareDataForSpin = () => {
    if (!filesData.length) return; // wait until backend loads

    const nextSpin = spinCount + 1;

    let dataset = [];
    let winner = null;
    let picture = null;

    if (nextSpin === 1 && filesData[0]) {
      dataset = filesData[0].participants;
      winner = riggedWinnersList[0];
      picture = filesData[0].picture;
    } else if (nextSpin === 2 && filesData[1]) {
      dataset = filesData[1].participants;
      winner = riggedWinnersList[1];
      picture = filesData[1].picture;
    } else if (nextSpin === 3 && filesData[2]) {
      dataset = filesData[2].participants;
      winner = riggedWinnersList[2];
      picture = filesData[2].picture;
    } else {
      // After first 3 spins → use each file only once
      const nextIndex = (nextSpin - 1); // ✅ sequential, no modulo

      if (nextIndex < filesData.length) {
        dataset = filesData[nextIndex]?.participants || [];
        picture = filesData[nextIndex]?.picture || null;
      } else {
        console.warn("All files have been used. No more spins available.");
        setFullData([]);
        setCurrentData([]);
        setCurrentFilePicture(null);
        setShowBlackScreen(true); // ✅ activate black screen
        return; // ✅ stop here so it won’t repeat
      }
    }

    setFullData(dataset);
    const batch = getRandomBatch(dataset, winner);
    setCurrentData(batch);
    setCurrentFilePicture(picture); // ✅ set picture dynamically
  };

  useEffect(() => {
    prepareDataForSpin();
  }, [spinCount, filesData]);

  const handleSpinStart = () => {
    isSpinningRef.current = true;
  };

  const handleSpinEnd = () => {
    isSpinningRef.current = false;
    setSpinCount(prev => prev + 1);
  };

  return (
    <>
    {showBlackScreen && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "black",
    zIndex: 99999
  }} />
)}

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
              currentFilePicture={currentFilePicture} // ✅ pass current picture
            />
            <Controls />
            <Results />
            <WinnersLadder />
          </div>
          <Participants currentData={fullData} />
        </div>
        <WinnerPopup />
      </div>
    </>
  );
};

export default Home;
