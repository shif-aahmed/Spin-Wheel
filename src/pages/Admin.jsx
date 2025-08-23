// Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // Initialize with one empty row
  useEffect(() => {
    handleAddRow();
  }, []);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spins/check-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: passwordInput }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setIsAuthenticated(true);
      } else {
        alert('Incorrect Password!');
      }
    } catch (error) {
      console.error('Error checking password:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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

  // ✅ Upload button handler with backend integration
 // ✅ Upload button handler with backend integration
const handleUpload = async () => {
  try {
    for (const row of rows) {
      if (!row.dataFile) {
        alert('Please select a data file for all rows.');
        return;
      }

      const formData = new FormData();
      formData.append('filename', row.fileName || 'Untitled');

      if (row.image) {
        formData.append('picture', row.image);
      }
      // if no image, backend will use default

      formData.append('excel_file', row.dataFile);
      formData.append('active', row.active);
      formData.append('password', passwordInput);

      const response = await fetch('http://127.0.0.1:8000/api/spins/upload/', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        alert(`❌ Upload failed: ${result.error}`);
        return;
      }
    }

    alert('✅ All files uploaded successfully!');
    navigate('/home');
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('Something went wrong while uploading. Try again.');
  }
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
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Checking...' : 'Enter'}
            </button>
          </form>
        </div>
      )}

      {isAuthenticated && (
        <div className="admin-container">
          <h1 className="admin-heading">Admin Panel</h1>

          <div className="nav-button-container">
            <button
              className="spinwheel-button"
              onClick={() => navigate('/home')}
            >
              Go to Spin Wheel
            </button>
          </div>

          <div className="table-header">
            <h2>Uploaded Files</h2>
            <button className="add-row-button" onClick={handleAddRow}>
              +
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Data File</th>
                  <th>File Name</th>
                  <th>Status</th>
                  <th>Delete</th> {/* New column for delete button */}
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
                    <td>
                      <button
                        className="status-button"
                        style={{ backgroundColor: '#f44336' }}
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
