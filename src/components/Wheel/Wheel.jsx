import React, { useEffect, useRef, useState } from 'react';
import './Wheel.css';
import { updateQuickResults } from '../HeaderWithResults/HeaderWithResults';
import WheelCenterImage from '../WheelCenterImage/WheelCenterImage';

const MAX_SLICES = 70;

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
  onSpinEnd
}) => {
  const isSpinning = useRef(false);
  const currentRotation = useRef(0);
  const outerWheelRef = useRef(null);
  const [sliceAngle, setSliceAngle] = useState(360 / MAX_SLICES);

  const spinSoundRef = useRef(null);
  const applauseRef = useRef(null);

  const imageList = ['/images/Xbox.jpg', '/images/3.jpg', '/images/cash.jpg'];
  const [imageIndex, setImageIndex] = useState(0);

  // ✅ Hardcoded Winners
  const riggedWinners = useRef([
    { name: 'Waseem Malik', ticketNumber: 'F5' },
    { name: 'Alan Mackenzie', ticketNumber: '1197' },
    { name: 'Marc', ticketNumber: '743' }
  ]);

  const spinCount = useRef(0); // ✅ Track number of spins

  useEffect(() => {
    const soundMap = {
      spin1: '/sounds/spin.mp3',
      spin2: '/sounds/spin2.mp3',
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

  const updateParticipantData = () => {
    const nextArray = getNextArray(fullData);
    setFullData(nextArray);
    const newBatch = getRandomBatch(nextArray);
    setCurrentData(newBatch);
    setSliceAngle(360 / newBatch.length);
  };

  const spinWheel = () => {
    if (!currentData.length || isSpinning.current) return;
    isSpinning.current = true;

    spinCount.current += 1; // ✅ Increment spin count

    if (spinSoundRef.current) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(console.warn);
    }

    let batch = [...currentData];
    let winner;
    let winnerIndex;

    // ✅ First 3 spins — rigged
    if (spinCount.current <= 3) {
      const nextWinner = riggedWinners.current[spinCount.current - 1];
      winnerIndex = batch.findIndex(
        p => p.name === nextWinner.name && p.ticketNumber === nextWinner.ticketNumber
      );
      if (winnerIndex === -1) {
        batch[Math.floor(Math.random() * batch.length)] = nextWinner;
        winnerIndex = batch.findIndex(
          p => p.name === nextWinner.name && p.ticketNumber === nextWinner.ticketNumber
        );
      }
      winner = batch[winnerIndex];
    } else {
      // ✅ From 4th spin onwards — random
      winnerIndex = Math.floor(Math.random() * batch.length);
      winner = batch[winnerIndex];
    }

    setCurrentData(batch);
    const anglePerSlice = 360 / batch.length;
    setSliceAngle(anglePerSlice);

    const currentEffectiveRotation = currentRotation.current % 360;
    const winnerCenterAngle = winnerIndex * anglePerSlice + anglePerSlice / 2;
    const angleToPointer = 270 - winnerCenterAngle;
    const stopRotation = angleToPointer - currentEffectiveRotation;
    const normalizedStopRotation = stopRotation < 0 ? stopRotation + 360 : stopRotation;
    const totalRotation = currentRotation.current + 5 * 360 + normalizedStopRotation;

    currentRotation.current = totalRotation;

    if (outerWheelRef.current) {
      outerWheelRef.current.style.transition = 'transform 5s ease-out';
      outerWheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }

    setTimeout(() => {
      if (spinSoundRef.current) {
        spinSoundRef.current.pause();
        spinSoundRef.current.currentTime = 0;
      }

      updateQuickResults(winner, winner.ticketNumber);

      const popup = document.getElementById('winnerPopup');
      if (popup) {
        popup.style.display = 'block';
        const nameEl = document.getElementById('popupWinnerName');
        const ticketNumberEl = document.getElementById('popupCombination');
        if (nameEl) nameEl.textContent = winner.name;
        if (ticketNumberEl) ticketNumberEl.textContent = winner.ticketNumber;
      }

      if (applauseRef.current) {
        applauseRef.current.currentTime = 0;
        applauseRef.current.play().catch(console.warn);
      }

      window.dispatchEvent(new CustomEvent('add-winner-to-ladder', {
        detail: { winner }
      }));

      isSpinning.current = false;

      const checkPopupClose = setInterval(() => {
        if (popup && popup.style.display === 'none') {
          clearInterval(checkPopupClose);
          if (applauseRef.current) {
            applauseRef.current.pause();
            applauseRef.current.currentTime = 0;
          }
          setImageIndex(prev => (prev + 1) % imageList.length);
          updateParticipantData();
          if (onSpinEnd) onSpinEnd();
        }
      }, 300);
    }, 5200);
  };

  useEffect(() => {
    const initialBatch = getRandomBatch(fullData);
    setCurrentData(initialBatch);
    setSliceAngle(360 / initialBatch.length);
  }, [fullData]);

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

    currentData.forEach((p, index) => {
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
        : `hsl(${(index * 360) / currentData.length}, 70%, 50%)`;

      slices.push(<path key={index} d={d} fill={fillColor} stroke="#2c3e50" strokeWidth="1" />);

      const textAngle = startAngle + sliceAngle / 2;
      const angleRad = (Math.PI * textAngle) / 180;

      const idRadius = r * 0.95;
      const nameRadius = r * 0.73;

      const idX = cx + idRadius * Math.cos(angleRad);
      const idY = cy + idRadius * Math.sin(angleRad);
      const nameX = cx + nameRadius * Math.cos(angleRad);
      const nameY = cy + nameRadius * Math.sin(angleRad);

      slices.push(
        <text
          key={`id-${index}`}
          x={idX}
          y={idY}
          fill="#fff"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textAngle}, ${idX}, ${idY})`}
        >
          {p.ticketNumber}
        </text>
      );

      slices.push(
        <text
          key={`name-${index}`}
          x={nameX}
          y={nameY}
          fill="#fff"
          fontSize="12"
          fontWeight="bold"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${textAngle}, ${nameX}, ${nameY})`}
        >
          {p.name}
        </text>
      );
    });

    return slices;
  };

  return (
    <div className="wheel-container">
      <div className="pointer"></div>
      <WheelCenterImage src={imageList[imageIndex]} />
      <div className="wheel outer-wheel" ref={outerWheelRef} id="outerWheel">
        <svg width="550" height="550" viewBox="0 0 550 550">
          {renderWheelSlices()}
        </svg>
      </div>
    </div>
  );
};

export default Wheel;
