import React, { useState } from 'react';
import './WheelOverlay.css';

const WheelOverlay = ({ onColorsChange, onSoundChange, onApplauseSoundChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [colorInputs, setColorInputs] = useState([
    { value: '#e74c3c', active: false }, // ⬅️ Unchecked by default
    { value: '#3498db', active: false }  // ⬅️ Unchecked by default
  ]);

  const [selectedSound, setSelectedSound] = useState('spin1');
  const [selectedApplause, setSelectedApplause] = useState('applause1'); // ✅ Fix name & default

  const soundOptions = [
    { label: 'Classic Spin', value: 'spin1' },
    { label: 'Fast Spin', value: 'spin2' },
    { label: 'Ticking Spin', value: 'spin3' }
  ];

  const applauseSoundOptions = [
    { label: 'Cheering', value: 'applause1' },
    { label: 'Clapping', value: 'applause2' },
    { label: 'Fanfare', value: 'applause3' },
    { label: 'Joke Punchline', value: 'applause4' },
    { label: 'Twinkling Star', value: 'applause5' }
  ];

  const handleColorChange = (index, value) => {
    const updated = [...colorInputs];
    updated[index].value = value;
    setColorInputs(updated);
  };

  const handleToggle = (index) => {
    const updated = [...colorInputs];
    updated[index].active = !updated[index].active;
    setColorInputs(updated);
  };

  const addColorInput = () => {
    setColorInputs([...colorInputs, { value: '#ffffff', active: false }]); // ⬅️ New colors unchecked
  };

  const removeColorInput = (index) => {
    const updated = colorInputs.filter((_, i) => i !== index);
    setColorInputs(updated);
  };

  const applyChanges = () => {
    const selectedColors = colorInputs.filter(c => c.active).map(c => c.value);
    onColorsChange?.(selectedColors);
    onSoundChange?.(selectedSound);
    onApplauseSoundChange?.(selectedApplause); // ✅ Pass applause
    setIsOpen(false);
  };

  return (
    <>
      <button className="open-overlay-button" onClick={() => setIsOpen(true)}>
        🎨 Customize Wheel
      </button>

      {isOpen && (
        <div className="overlay-backdrop">
          <div className="overlay-content">
            <div className="overlay-header">
              <h2>Customize Wheel Appearance</h2>
              <button className="close-button" onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="overlay-body">
              <h4>Wheel Colours</h4>
              {colorInputs.map((color, index) => (
                <div className="color-row" key={index}>
                  <input
                    type="color"
                    value={color.value}
                    onChange={(e) => handleColorChange(index, e.target.value)}
                  />
                  <label>
                    <input
                      type="checkbox"
                      checked={color.active}
                      onChange={() => handleToggle(index)}
                    />
                    Use
                  </label>
                  <button className="remove-btn" onClick={() => removeColorInput(index)}>Remove</button>
                </div>
              ))}

              <button className="add-btn" onClick={addColorInput}> Add Color</button>

              <h4 style={{ marginTop: '20px' }}>Spin Sound</h4>
              <select
                value={selectedSound}
                onChange={(e) => setSelectedSound(e.target.value)}
              >
                {soundOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <h4 style={{ marginTop: '20px' }}>Applause Sound</h4>
              <select
                value={selectedApplause}
                onChange={(e) => setSelectedApplause(e.target.value)}
              >
                {applauseSoundOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div style={{ textAlign: 'center', marginTop: '25px' }}>
                <button className="apply-btn" onClick={applyChanges}> Apply Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WheelOverlay;
