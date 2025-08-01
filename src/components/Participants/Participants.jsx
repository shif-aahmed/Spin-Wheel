import React, { useState, useEffect } from 'react';
import './Participants.css';
const Participants = ({ currentData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    if (!currentData || !Array.isArray(currentData)) return;

    const filtered = currentData.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.number.toString().includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredList(filtered);
  }, [searchTerm, currentData]);

  return (
    <div className="participants-section">
      <div className="participants-header">
        <h2>Participants</h2>
        <input
          type="text"
          className="search-box"
          placeholder="Search participants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="participants-list">
        {filteredList.length > 0 ? (
          filteredList.map(participant => (
            <div className="participant-item" key={participant.number} data-number={participant.number}>
              <div>{participant.name}</div>
              <div className="participant-number">{participant.number}</div>
            </div>
          ))
        ) : (
          <p>No participants found.</p>
        )}
      </div>
    </div>
  );
};

export default Participants;
