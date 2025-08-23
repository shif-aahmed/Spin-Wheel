import React, { useEffect, useRef, useState } from 'react';
import './Wheel.css';
import { updateQuickResults } from '../HeaderWithResults/HeaderWithResults';
import WheelCenterImage from '../WheelCenterImage/WheelCenterImage';

const MAX_SLICES = 200;

const Wheel = ({
  setCurrentData,
  fullData,
  setFullData,
  currentData,
  getNextArray,
  getRandomBatch,
  customColors = [],
  selectedSound = 'spin1',
  applauseSound = 'applause1',
  onSpinStart,
  onSpinEnd
}) => {
  const isSpinning = useRef(false);
  const currentRotation = useRef(0);
  const outerWheelRef = useRef(null);
  const [sliceAngle, setSliceAngle] = useState(360 / MAX_SLICES);
  const [showBlankScreen, setShowBlankScreen] = useState(false);
  const [currentVisualData, setCurrentVisualData] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // ✅ track popup

  const spinSoundRef = useRef(null);
  const applauseRef = useRef(null);
  const intervalRef = useRef(null);

  const imageList = ['/images/pakistan.jpg', '/images/AE1500.jpg', '/images/celtic.jpg', '/images/dubai2.jpg'];
  const [imageIndex, setImageIndex] = useState(0);

  const riggedWinners = useRef([
    { name: 'Waseem Malik', ticketNumber: 'F5' },
    { name: 'Alan Mackenzie', ticketNumber: '1197' },
    { name: 'Marc Cleisham', ticketNumber: '743' }
  ]);

  const spinCount = useRef(0);

  useEffect(() => {
    const soundMap = {
      spin1: '/sounds/spin2.mp3',
      spin2: '/sounds/spin.mp3',
      spin3: '/sounds/spin3.mp3',
    };
    spinSoundRef.current = new Audio(soundMap[selectedSound] || soundMap.spin1);
    spinSoundRef.current.volume = 0.9;
  }, [selectedSound]);

  useEffect(() => {
    const applauseMap = {
      applause1: '/sounds/applause-cheering.mp3',
      applause2: '/sounds/applause-clapping.mp3',
      applause3: '/sounds/fanfare.mp3',
      applause4: '/sounds/joke-punchline.mp3',
      applause5: '/sounds/twinkling.mp3',
    };
    applauseRef.current = new Audio(applauseMap[applauseSound] || applauseMap.applause1);
    applauseRef.current.volume = 1;
  }, [applauseSound]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const newBatch = getRandomBatch(fullData);
      setCurrentVisualData(newBatch);
      setSliceAngle(360 / newBatch.length);
    }, 100);
    return () => clearInterval(intervalRef.current);
  }, [fullData]);

  const spinWheel = () => {
    if (!currentData.length || isSpinning.current) return;
    isSpinning.current = true;
    if (onSpinStart) onSpinStart();

    clearInterval(intervalRef.current);
    spinSoundRef.current?.play().catch(console.warn);

    spinCount.current += 1;
    let batch = getRandomBatch(fullData);
    let winnerIndex = -1;
    let winner = null;

    if (spinCount.current <= 3) {
      const hardcoded = riggedWinners.current[spinCount.current - 1];
      winnerIndex = batch.findIndex(p => p.name === hardcoded.name && p.ticketNumber === hardcoded.ticketNumber);
      if (winnerIndex === -1) {
        const replaceIndex = Math.floor(Math.random() * batch.length);
        batch[replaceIndex] = hardcoded;
        winnerIndex = replaceIndex;
      }
      winner = batch[winnerIndex];
    } else {
      winnerIndex = Math.floor(Math.random() * batch.length);
      winner = batch[winnerIndex];
    }

    setCurrentData(batch);
    setCurrentVisualData(batch);
    setSliceAngle(360 / batch.length);

    const anglePerSlice = 360 / batch.length;
    const winnerAngle = winnerIndex * anglePerSlice + anglePerSlice * 1.5;
    const currentEffectiveRotation = currentRotation.current % 360;
    const angleToPointer = (270 - winnerAngle - currentEffectiveRotation + 360) % 360;
    const totalRotation = currentRotation.current + 360 * 5 + angleToPointer;
    currentRotation.current = totalRotation;

    if (outerWheelRef.current) {
      outerWheelRef.current.style.transition = 'transform 10s ease-out';
      outerWheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      spinSoundRef.current?.pause();
      spinSoundRef.current.currentTime = 0;
      updateQuickResults(winner, winner.ticketNumber);

      const popup = document.getElementById('winnerPopup');
      if (popup) {
        popup.style.display = 'block';
        document.getElementById('popupWinnerName').textContent = winner.name;
        document.getElementById('popupCombination').textContent = winner.ticketNumber;
        setIsPopupVisible(true); // ✅ block background
      }

      applauseRef.current?.play().catch(console.warn);
      window.dispatchEvent(new CustomEvent('add-winner-to-ladder', { detail: { winner } }));

      isSpinning.current = false;

      const checkPopupClose = setInterval(() => {
        const popup = document.getElementById('winnerPopup');
        if (popup && popup.style.display === 'none') {
          clearInterval(checkPopupClose);
          applauseRef.current?.pause();
          applauseRef.current.currentTime = 0;
          setImageIndex(prev => (prev + 1) % imageList.length);
          setIsPopupVisible(false); // ✅ allow interaction again

          if (spinCount.current === 4) setShowBlankScreen(true);
          if (onSpinEnd) onSpinEnd();

          intervalRef.current = setInterval(() => {
            const newBatch = getRandomBatch(fullData);
            setCurrentVisualData(newBatch);
            setSliceAngle(360 / newBatch.length);
          }, 100);
        }
      }, 300);
    }, 10200);
  };

  useEffect(() => {
    const handleManualWinner = (e) => spinWheel(e.detail.winner);
    window.addEventListener('spin-wheel', spinWheel);
    window.addEventListener('manual-winner-selected', handleManualWinner);
    return () => {
      window.removeEventListener('spin-wheel', spinWheel);
      window.removeEventListener('manual-winner-selected', handleManualWinner);
    };
  }, [currentData]);

  const renderWheelSlices = () => {
    const radius = 275;
    const cx = radius;
    const cy = radius;
    const r = radius;
    const slices = [];

    const totalEntries = currentVisualData.length;
    const minimalTextThreshold = 1000;

    currentVisualData.forEach((p, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const largeArc = sliceAngle > 180 ? 1 : 0;

      const x1 = cx + r * Math.cos((Math.PI * startAngle) / 180);
      const y1 = cy + r * Math.sin((Math.PI * startAngle) / 180);
      const x2 = cx + r * Math.cos((Math.PI * endAngle) / 180);
      const y2 = cy + r * Math.sin((Math.PI * endAngle) / 180);

      const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;

      const fillColor = customColors.length > 0
        ? customColors[index % customColors.length]
        : `hsl(${(index * 360) / totalEntries}, 70%, 50%)`;

      slices.push(<path key={index} d={d} fill={fillColor} stroke="#2c3e50" strokeWidth="0.2" />);

      if (totalEntries <= minimalTextThreshold) {
        const textAngle = startAngle + sliceAngle / 2;
        const angleRad = (Math.PI * textAngle) / 180;
        const idX = cx + r * 0.95 * Math.cos(angleRad);
        const idY = cy + r * 0.95 * Math.sin(angleRad);
        const nameX = cx + r * 0.73 * Math.cos(angleRad);
        const nameY = cy + r * 0.73 * Math.sin(angleRad);

        slices.push(
          <text key={`id-${index}`} x={idX} y={idY} fill="#fff" fontSize="6" fontWeight="bold"
            textAnchor="middle" alignmentBaseline="middle"
            transform={`rotate(${textAngle}, ${idX}, ${idY})`}>
            {p.ticketNumber}
          </text>
        );

        slices.push(
          <text key={`name-${index}`} x={nameX} y={nameY} fill="#fff" fontSize="6" fontWeight="bold"
            textAnchor="middle" alignmentBaseline="middle"
            transform={`rotate(${textAngle}, ${nameX}, ${nameY})`}>
            {p.name}
          </text>
        );
      }
    });

    return slices;
  };

  return (
    <>
      {showBlankScreen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'black', zIndex: 9999
        }} />
      )}

      {isPopupVisible && (
        <div className="interaction-blocker"></div> // ✅ disables interaction without touching popup
      )}

      <div className="wheel-container">
        <div className="pointer"></div>
        <WheelCenterImage src={imageList[imageIndex]} />
        <div className="wheel outer-wheel" ref={outerWheelRef} id="outerWheel">
          <svg width="550" height="550" viewBox="0 0 550 550">
            {renderWheelSlices()}
          </svg>
        </div>
      </div>
    </>
  );
};

export default Wheel;
