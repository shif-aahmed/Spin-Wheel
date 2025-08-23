import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rows, setRows] = useState([]);

  // Initialize with one empty row
  useEffect(() => {
    handleAddRow();
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect Password!');
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now() + Math.random(),
      image: null,
      dataFile: null,
      fileName: '',
      active: true,
      imagePreview: null,
    };
    setRows((prev) => [...prev, newRow]);
  };

  const handleImageChange = (id, file) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, image: file, imagePreview: URL.createObjectURL(file) }
          : row
      )
    );
  };

  const handleDataFileChange = (id, file) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, dataFile: file, fileName: file.name }
          : row
      )
    );
  };

  const toggleActive = (id) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, active: !row.active } : row
      )
    );
  };

  // Upload button handler
  const handleUpload = () => {
    const activeRows = rows.filter(row => row.active && row.dataFile);
    navigate('/home', { state: { uploadedRows: activeRows } });
  };

  return (
    <>
      {!isAuthenticated && (
        <div className="password-modal">
          <form className="password-form" onSubmit={handlePasswordSubmit}>
            <h2>Enter Admin Password</h2>
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Password"
            />
            <button type="submit">Enter</button>
          </form>
        </div>
      )}

      {isAuthenticated && (
        <div className="admin-container">
          <h1 className="admin-heading">Admin Panel</h1>
          <button
            className="spinwheel-button"
            onClick={() => navigate('/home')}
          >
            Go to Spin Wheel
          </button>

          <div className="table-header">
            <h2>Uploaded Files</h2>
            <button className="add-row-button" onClick={handleAddRow}>
              +
            </button>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Data File</th>
                <th>File Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={row.active ? 'active-row' : 'inactive-row'}
                >
                  <td>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange(row.id, e.target.files[0])
                      }
                    />
                    {row.imagePreview && (
                      <img
                        src={row.imagePreview}
                        alt="preview"
                        className="preview-image"
                      />
                    )}
                  </td>
                  <td>
                    <input
                      type="file"
                      onChange={(e) =>
                        handleDataFileChange(row.id, e.target.files[0])
                      }
                    />
                  </td>
                  <td>{row.fileName}</td>
                  <td>
                    <button
                      className={`status-button ${
                        row.active ? 'active' : 'inactive'
                      }`}
                      onClick={() => toggleActive(row.id)}
                    >
                      {row.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="upload-button-container">
            <button className="upload-button" onClick={handleUpload}>
              UPLOAD
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Admin;
