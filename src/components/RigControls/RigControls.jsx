import React, { useEffect } from 'react';
import './RigControls.css';
const RigControls = ({ currentData }) => {
  useEffect(() => {
    const rigButton = document.querySelector('.rig-controls .btn');
    const rigOuterInput = document.getElementById('rigOuter');

    const handleRigClick = () => {
      const selectedticketNumber = parseInt(rigOuterInput?.value);
      if (isNaN(selectedticketNumber)) {
        alert('Please enter a valid ticketNumber');
        return;
      }

      const winner = currentData.find(p => p.ticketNumber === selectedticketNumber);

      if (!winner) {
        alert(`No participant found with ticketNumber ${selectedticketNumber}`);
        return;
      }

      // Dispatch manual winner event to trigger your custom popup and ladder update
      window.dispatchEvent(new CustomEvent('manual-winner-selected', { detail: { winner } }));

      // Removed the alert below to avoid duplicate popups
      // alert(`Manually selected winner: ${winner.name} (#${winner.ticketNumber})`);
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
          <input type="ticketNumber" id="rigOuter" min="1" max="80" placeholder="Enter Ticket Number" />
        </div>
      </div>
      <button className="btn btn-secondary">Set Rigged Stops</button>
    </div>
  );
};

export default RigControls;
