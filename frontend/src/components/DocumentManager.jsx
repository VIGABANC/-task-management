import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { downloadDocument, downloadHistorique } from '../utils/download';
import './DocumentManager.css';

const DocumentManager = ({ taskId, type = 'task' }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [taskId, type]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (type === 'task') {
        response = await axios.get('http://127.0.0.1:8000/api/v1/documentpaths');
        const filteredDocs = response.data.filter(doc => doc.task_id == taskId);
        setDocuments(filteredDocs);
      } else if (type === 'historique') {
        response = await axios.get('http://127.0.0.1:8000/api/v1/historiques');
        const filteredHist = response.data.filter(hist => hist.task_id == taskId);
        setDocuments(filteredHist);
      }
    } catch (err) {
      setError('Error fetching documents');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      
      if (!allowedTypes.includes(fileExtension)) {
        alert('Please select a valid file type: PDF, DOC, DOCX, or TXT');
        event.target.value = '';
        return;
      }
      
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        event.target.value = '';
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      if (type === 'task') {
        formData.append('document_path', selectedFile);
        formData.append('task_id', taskId);
        
        await axios.post('http://127.0.0.1:8000/api/v1/documentpaths', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else if (type === 'historique') {
        formData.append('dochistorique_path', selectedFile);
        formData.append('task_id', taskId);
        formData.append('description', 'Document uploaded via Document Manager');
        formData.append('change_date', new Date().toISOString());
        
        await axios.post('http://127.0.0.1:8000/api/v1/historiques', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      alert('Document uploaded successfully!');
      setSelectedFile(null);
      document.getElementById('file-input').value = '';
      fetchDocuments();
    } catch (err) {
      console.error('Upload error:', err);
      alert(err.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      let result;
      if (type === 'task') {
        result = await downloadDocument(document.document_id);
      } else if (type === 'historique') {
        result = await downloadHistorique(document.hist_id);
      }
      
      if (!result.success) {
        alert(result.message || 'Error downloading document');
      }
    } catch (err) {
      console.error('Download error:', err);
      alert('Error downloading document');
    }
  };

  const handleDelete = async (document) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      if (type === 'task') {
        await axios.delete(`http://127.0.0.1:8000/api/v1/documentpaths/${document.document_id}`);
      } else if (type === 'historique') {
        await axios.delete(`http://127.0.0.1:8000/api/v1/historiques/${document.hist_id}`);
      }
      
      alert('Document deleted successfully!');
      fetchDocuments();
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.message || 'Error deleting document');
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      default:
        return '📎';
    }
  };

  if (loading) {
    return <div className="document-manager-loading">Loading documents...</div>;
  }

  if (error) {
    return <div className="document-manager-error">Error: {error}</div>;
  }

  return (
    <div className="document-manager">
      <div className="document-manager-header">
        <h3>Document Manager</h3>
        <div className="upload-section">
          <input
            type="file"
            id="file-input"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <button
            className="select-file-btn"
            onClick={() => document.getElementById('file-input').click()}
            disabled={uploading}
          >
            Select File
          </button>
          {selectedFile && (
            <span className="selected-file">
              {selectedFile.name}
              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </span>
          )}
        </div>
      </div>

      <div className="documents-list">
        {documents.length === 0 ? (
          <div className="no-documents">
            No documents found for this {type === 'task' ? 'task' : 'history entry'}.
          </div>
        ) : (
          documents.map((document) => (
            <div key={document.document_id || document.hist_id} className="document-item">
              <div className="document-info">
                <span className="document-icon">
                  {getFileIcon(document.document_path || document.dochistorique_path)}
                </span>
                <span className="document-name">
                  {document.document_path || document.dochistorique_path}
                </span>
              </div>
              <div className="document-actions">
                <button
                  className="download-btn"
                  onClick={() => handleDownload(document)}
                >
                  Download
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(document)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DocumentManager; 