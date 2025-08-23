import { useEffect } from 'react';
import './Controls.css';
const Controls = () => {
  useEffect(() => {
    const spinBtn = document.getElementById('spinBtn');
    const resetBtn = document.getElementById('resetBtn');

    const handleSpinClick = () => {
      // ✅ Inform Results to show "Spinning..."
      window.dispatchEvent(new Event('spin-start'));

      // ✅ Start spinning logic
      window.dispatchEvent(new Event('spin-wheel'));
    };

    const handleResetClick = () => {
      window.dispatchEvent(new Event('reset-wheel'));
    };

    if (spinBtn) spinBtn.addEventListener('click', handleSpinClick);
    if (resetBtn) resetBtn.addEventListener('click', handleResetClick);

    return () => {
      if (spinBtn) spinBtn.removeEventListener('click', handleSpinClick);
      if (resetBtn) resetBtn.removeEventListener('click', handleResetClick);
    };
  }, []);

  return (
    <div className="controls">
      <button className="btn btn-primary" id="spinBtn">
        <i className="fas fa-sync-alt"></i> SPIN
      </button>
      <button className="btn btn-secondary" id="resetBtn">
        <i className="fas fa-redo"></i> RESET
      </button>
    </div>
  );
};

export default Controls;
