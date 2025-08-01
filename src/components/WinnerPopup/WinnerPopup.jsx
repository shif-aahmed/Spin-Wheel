import { useEffect } from 'react';
import './WinnerPopup.css';
const WinnerPopup = () => {
  useEffect(() => {
    const popup = document.getElementById('winnerPopup');
    const closeBtn = popup?.querySelector('.close-popup');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        popup.style.display = 'none';

        const spinBtn = document.getElementById('spinBtn');
        const resetBtn = document.getElementById('resetBtn');
        if (spinBtn) spinBtn.disabled = false;
        if (resetBtn) resetBtn.disabled = false;
      });
    }
  }, []);

  return (
    <div className="winner-popup" id="winnerPopup" style={{ display: 'none' }}>
      <span className="close-popup" style={{ cursor: 'pointer' }}>&times;</span>
      <h3>🎉 Winner! 🎉</h3>
      <div className="winner-name" id="popupWinnerName"></div>
      <div className="winner-combination" id="popupCombination"></div>
      <div id="popupWinnerDetails"></div>
    </div>
  );
};

export default WinnerPopup;
