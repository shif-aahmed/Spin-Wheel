import { useEffect, useRef } from 'react';
import './WinnersLadder.css';
const WinnersLadder = () => {
  const winnersListRef = useRef(null);

  useEffect(() => {
    const winnersList = winnersListRef.current;

    const addWinnerToLadder = (event) => {
      const { winner } = event.detail;

      if (winnersList) {
        // Remove placeholder if it's still there
        const placeholder = winnersList.querySelector('.winner-name');
        if (placeholder && placeholder.textContent === 'No winners yet') {
          winnersList.innerHTML = '';
        }

        // Create new winner entry
        const newEntry = document.createElement('div');
        newEntry.className = 'winner-entry';
        newEntry.innerHTML = `
          <div class="winner-position"></div>
          <div class="winner-name">${winner.name}</div>
          <div class="winner-combination">${winner.ticketNumber}</div>
        `;

        winnersList.prepend(newEntry);

        // Update positions
        const entries = winnersList.querySelectorAll('.winner-entry');
        entries.forEach((entry, index) => {
          const position = entry.querySelector('.winner-position');
          if (position) position.textContent = index + 1;
        });

        // Keep only 5 latest winners
        while (entries.length > 5) {
          winnersList.removeChild(winnersList.lastChild);
        }
      }
    };

    const resetLadder = () => {
      if (winnersList) {
        winnersList.innerHTML = `
          <div class="winner-entry">
            <div class="winner-position gold">1</div>
            <div class="winner-name">No winners yet</div>
            <div class="winner-combination">---</div>
          </div>
        `;
      }
    };

    window.addEventListener('add-winner-to-ladder', addWinnerToLadder);
    window.addEventListener('reset-wheel', resetLadder);

    return () => {
      window.removeEventListener('add-winner-to-ladder', addWinnerToLadder);
      window.removeEventListener('reset-wheel', resetLadder);
    };
  }, []);

  return (
    <div className="winners-ladder">
      <h2>Top 5 Winners</h2>
      <div id="winnersList" ref={winnersListRef}>
        <div className="winner-entry">
          <div className="winner-position gold">1</div>
          <div className="winner-name">No winners yet</div>
          <div className="winner-combination">---</div>
        </div>
      </div>
    </div>
  );
};

export default WinnersLadder;
