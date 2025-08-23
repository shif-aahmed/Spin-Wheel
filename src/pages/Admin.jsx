// Admin.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RigControls from '../components/RigControls/RigControls';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch files when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFiles();
    }
  }, [isAuthenticated]);

  // ✅ Fetch all files (active + inactive) for Admin panel
  const fetchFiles = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/spins/admin-list/");
      const data = await response.json();
      setRows(
        data.map((file) => ({
          id: file.id,
          image: null,
          imagePreview: file.picture || null,
          dataFile: null,
          fileName: file.filename,
          active: file.active,
        }))
      );
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/spins/check-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await response.json();
      if (response.ok && data.valid) setIsAuthenticated(true);
      else alert('Incorrect Password!');
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

  // ✅ Toggle active/inactive on backend + UI
  const toggleActive = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/spins/toggle-active/${id}/`, {
        method: 'PATCH',
      });
      const data = await response.json();
      if (response.ok) {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, active: data.active } : row
          )
        );
      } else {
        alert("❌ Failed to toggle active status: " + data.error);
      }
    } catch (error) {
      console.error("Error toggling active:", error);
      alert("Something went wrong while toggling active status.");
    }
  };

  // ✅ Delete row from backend + UI
  const handleDeleteRow = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/spins/delete/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
      } else {
        const result = await response.json();
        alert("❌ Delete failed: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Something went wrong while deleting.");
    }
  };

  // ✅ Upload new files only
  const handleUpload = async () => {
    try {
      for (const row of rows) {
        if (!row.dataFile) continue; // skip already uploaded rows

        const formData = new FormData();
        formData.append('filename', row.fileName || 'Untitled');
        if (row.image) formData.append('picture', row.image);
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
      fetchFiles(); // refresh table after upload
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

          <div className="admin-table-wrapper">
            <div className="table-header">
              <h2>Upload Files</h2>
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
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className={row.active ? 'active-row' : 'inactive-row'}
                  >
                    <td>
                      {row.imagePreview ? (
                        <img
                          src={row.imagePreview}
                          alt="preview"
                          className="preview-image"
                        />
                      ) : (
                        <div className="custom-file-input">
                          <input
                            type="file"
                            accept="image/*"
                            disabled={!row.active}
                            onChange={(e) =>
                              handleImageChange(row.id, e.target.files[0])
                            }
                          />
                          <div className="file-label">Choose Image</div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="custom-file-input">
                        <input
                          type="file"
                          disabled={!row.active}
                          onChange={(e) =>
                            handleDataFileChange(row.id, e.target.files[0])
                          }
                        />
                        <div className="file-label">Choose File</div>
                      </div>
                    </td>
                    <td>{row.fileName || 'File Name'}</td>
                    <td>
                      <button
                        className={`status-button ${row.active ? 'active' : 'inactive'}`}
                        onClick={() => toggleActive(row.id)}
                      >
                        {row.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="status-button"
                        style={{ backgroundColor: '#ed5d53ff' }}
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        Delete
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

          {/* ADD RIG CONTROLS HERE */}
          <RigControls currentData={[]} /> {/* Pass real participant data if available */}
        </div>
      )}
    </>
  );
};

export default Admin;
