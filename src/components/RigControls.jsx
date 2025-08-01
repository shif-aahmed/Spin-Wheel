import React, { useEffect } from 'react';

const RigControls = ({ currentData }) => {
  useEffect(() => {
    const rigButton = document.querySelector('.rig-controls .btn');
    const rigOuterInput = document.getElementById('rigOuter');

    const handleRigClick = () => {
      const selectedNumber = parseInt(rigOuterInput?.value);
      if (isNaN(selectedNumber)) {
        alert('Please enter a valid number');
        return;
      }

      const winner = currentData.find(p => p.number === selectedNumber);

      if (!winner) {
        alert(`No participant found with number ${selectedNumber}`);
        return;
      }

      // Dispatch manual winner event to trigger your custom popup and ladder update
      window.dispatchEvent(new CustomEvent('manual-winner-selected', { detail: { winner } }));

      // Removed the alert below to avoid duplicate popups
      // alert(`Manually selected winner: ${winner.name} (#${winner.number})`);
    };

    rigButton?.addEventListener('click', handleRigClick);

    return () => {
      rigButton?.removeEventListener('click', handleRigClick);
    };
  }, [currentData]);

  return (
    <div className="rig-controls">
      <h3>Rig Wheel Stops</h3>
      <div className="rig-inputs">
        <div className="rig-input">
          <label htmlFor="rigOuter">Outer Wheel:</label>
          <input type="number" id="rigOuter" min="1" max="80" placeholder="1-80" />
        </div>
      </div>
      <button className="btn btn-secondary">Set Rigged Stops</button>
    </div>
  );
};

export default RigControls;
