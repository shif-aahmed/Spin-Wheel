import { useEffect, useState } from 'react';

const Results = () => {
  const [status, setStatus] = useState('Ready to spin...');
  const [combination, setCombination] = useState('');

  useEffect(() => {
    const handleSpinStart = () => {
      setStatus('Spinning...');
      setCombination('');
    };

    const handleSpinEnd = (event) => {
      const { winner } = event.detail;
      // Wait a short moment before showing "Ready to spin..." again
      setTimeout(() => {
        setStatus('Ready to spin...');
      }, 1500); 
      setCombination(winner.number); // show combination if you still want
    };

    window.addEventListener('spin-start', handleSpinStart);
    window.addEventListener('add-winner-to-ladder', handleSpinEnd);

    return () => {
      window.removeEventListener('spin-start', handleSpinStart);
      window.removeEventListener('add-winner-to-ladder', handleSpinEnd);
    };
  }, []);

  return (
    <div className="results">
      <div className="result-display" id="resultDisplay">{status}</div>
    </div>
  );
};

export default Results;
