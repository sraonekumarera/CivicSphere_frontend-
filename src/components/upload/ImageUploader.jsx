import React, { useState, useRef } from 'react';
import { mediaService } from '../../services/mediaService';

export const ImageUploader = ({
  onUploadSuccess,
  uploadType = 'news-image',
  initialUrl = null,
  maxSizeMB = 8,
  label = 'Upload Image',
}) => {
  const [preview, setPreview] = useState(initialUrl);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  const validateAndUpload = async (file) => {
    setError(null);

    // 1. Validate MIME
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid format. Please upload JPG, PNG, WEBP, or GIF.');
      return;
    }

    // 2. Validate Size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds maximum allowed limit of ${maxSizeMB}MB.`);
      return;
    }

    // 3. Show instant preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    // 4. Upload to backend object storage
    setUploading(true);
    setProgress(0);

    try {
      let response;
      if (uploadType === 'profile-photo') {
        response = await mediaService.uploadProfilePhoto(file, (p) => setProgress(p));
      } else {
        response = await mediaService.uploadNewsImage(file, (p) => setProgress(p));
      }

      setUploading(false);
      setProgress(100);
      if (onUploadSuccess && response.data) {
        onUploadSuccess(response.data);
      }
    } catch (err) {
      setUploading(false);
      setProgress(0);
      const msg = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setError(msg);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) validateAndUpload(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndUpload(file);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    setProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onUploadSuccess) onUploadSuccess({ storageKey: null, url: null });
  };

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {label && <label className="form-label">{label}</label>}

      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragOver ? 'var(--primary)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'center',
          backgroundColor: isDragOver ? 'var(--primary-light)' : '#f8fafc',
          cursor: uploading ? 'not-allowed' : 'pointer',
          position: 'relative',
          transition: 'all 0.2s ease',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/gif"
          style={{ display: 'none' }}
          disabled={uploading}
        />

        {preview ? (
          <div style={{ position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
            <img
              src={preview}
              alt="Uploaded Preview"
              style={{
                maxHeight: '220px',
                maxWidth: '100%',
                borderRadius: 'var(--radius-sm)',
                objectFit: 'cover',
                boxShadow: 'var(--shadow-sm)',
              }}
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Remove image"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        ) : (
          <div>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '0.75rem' }}></i>
            <div style={{ fontWeight: 600, color: 'var(--dark)', marginBottom: '0.25rem' }}>
              Click to select or drag and drop an image
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--slate)' }}>
              PNG, JPG, WEBP, or GIF up to {maxSizeMB}MB
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div style={{ marginTop: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--slate)', marginBottom: '0.3rem' }}>
              <span>Uploading to Object Storage...</span>
              <span>{progress}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
                  transition: 'width 0.2s ease',
                }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
