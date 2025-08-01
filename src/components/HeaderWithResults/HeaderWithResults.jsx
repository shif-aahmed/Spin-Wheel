import { useEffect } from 'react';
import './HeaderWithResults.css';
// This function updates the quick result display — called elsewhere in app logic
export function updateQuickResults(winner, combination) {
  const quickResultDisplay = document.getElementById('quickResultDisplay');
  if (quickResultDisplay) {
    quickResultDisplay.innerHTML = `
      <div><strong>Name:</strong> ${winner.name}</div>
      <div><strong>Combination:</strong> ${winner.number}</div>
    `;
  }
}

const HeaderWithResults = () => {
  useEffect(() => {
    // Just preload the element reference if needed in future logic
    document.getElementById('quickResultDisplay').innerHTML ||= 'No winners yet';
  }, []);

  return (
    <div className="header-with-results">
      <div className="quick-results">
        <h3>Latest Winner</h3>
        <div id="quickResultDisplay">No winners yet</div>
      </div>
    </div>
  );
};

export default HeaderWithResults;
