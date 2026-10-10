import React, { useState, useRef } from 'react';
import { mediaService } from '../../services/mediaService';

export const FileUploader = ({
  onUploadSuccess,
  uploadType = 'news-attachment', // 'news-attachment' | 'candidate-document'
  documentType = 'ID_PROOF',
  maxSizeMB = 12,
  label = 'Upload Document File',
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];

  const validateAndUpload = async (file) => {
    setError(null);

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      setError(`Unsupported file extension (${ext}). Allowed: PDF, DOC, DOCX, TXT.`);
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    setUploading(true);
    setProgress(0);

    try {
      let response;
      if (uploadType === 'candidate-document') {
        response = await mediaService.uploadCandidateDocument(file, documentType, (p) => setProgress(p));
      } else {
        response = await mediaService.uploadNewsAttachment(file, (p) => setProgress(p));
      }

      setUploading(false);
      setProgress(100);
      if (onUploadSuccess && response.data) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setUploading(false);
      setProgress(0);
      const msg = err.response?.data?.message || err.message || 'File upload failed. Please try again.';
      setError(msg);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndUpload(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess({ storageKey: null, originalFileName: null });
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && <label className="form-label">{label}</label>}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          disabled={uploading}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline"
          disabled={uploading}
        >
          <i className="fas fa-paperclip"></i>
          {selectedFile ? 'Change File' : 'Choose Document'}
        </button>

        {selectedFile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.4rem 0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
            <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i>
            <span style={{ fontWeight: 600, color: 'var(--dark)' }}>{selectedFile.name}</span>
            <span style={{ color: 'var(--slate)' }}>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', marginLeft: '0.35rem' }}
                title="Remove file"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        )}
      </div>

      {uploading && (
        <div style={{ marginTop: '0.75rem', maxWidth: '350px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--slate)', marginBottom: '0.2rem' }}>
            <span>Securing and storing document...</span>
            <span>{progress}%</span>
          </div>
          <div style={{ width: '100%', height: '5px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.2s ease' }}></div>
          </div>
        </div>
      )}

      {error && (
        <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
