import React, { useEffect, useState } from 'react';
import { candidateService } from '../services/candidateService';
import { newsService } from '../services/newsService';
import { mediaService } from '../services/mediaService';
import { ImageUploader } from '../components/upload/ImageUploader';
import { FileUploader } from '../components/upload/FileUploader';
import { useAuth } from '../context/AuthContext';

export const CandidateDashboard = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [authoredNews, setAuthoredNews] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);

  // Verification document upload type
  const [docType, setDocType] = useState('ID_PROOF');

  // News authoring state
  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Civic',
    location: '',
    localityName: '',
    latitude: 40.7128,
    longitude: -74.0060,
    content: '',
    imageKey: '',
    imageUrl: '',
    attachmentKey: '',
    attachmentName: '',
  });

  const loadCandidateData = () => {
    setLoading(true);
    Promise.all([
      candidateService.getMyProfile(),
      candidateService.getMyNews(),
      candidateService.getMyFeedback(),
    ])
      .then(([profRes, newsRes, feedRes]) => {
        if (profRes.data) {
          setProfile(profRes.data);
          setNewsForm((prev) => ({
            ...prev,
            location: profRes.data.area || 'Downtown Ward 4',
            localityName: profRes.data.area || 'Downtown Ward 4',
          }));
        }
        if (newsRes.data) setAuthoredNews(newsRes.data);
        if (feedRes.data) setFeedbackList(feedRes.data);
      })
      .catch((err) => console.error('Error fetching candidate data:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCandidateData();
  }, []);

  const handleProfilePhotoUpload = (media) => {
    if (media.url) {
      updateUser({ profilePhotoUrl: media.url });
      loadCandidateData();
    }
  };

  const handleDocumentUploaded = (media) => {
    alert('Verification document uploaded! It has been submitted to the administrative review queue.');
    loadCandidateData();
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    if (!profile?.verificationStatus || profile.verificationStatus !== 'VERIFIED') {
      alert('Only officially verified candidates can publish community news. Please await admin review.');
      return;
    }

    try {
      await newsService.createCandidateNews(newsForm);
      alert('News submitted successfully! It is now in the administrative moderation queue.');
      setNewsForm({
        title: '',
        category: 'Civic',
        location: profile.area || '',
        localityName: profile.area || '',
        latitude: 40.7128,
        longitude: -74.0060,
        content: '',
        imageKey: '',
        imageUrl: '',
        attachmentKey: '',
        attachmentName: '',
      });
      loadCandidateData();
      setActiveTab('posts');
    } catch (err) {
      alert('Error submitting post: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReplyFeedback = async (id) => {
    const replyText = prompt('Enter response to constituent:');
    if (!replyText) return;
    try {
      await candidateService.replyFeedback(id, replyText);
      alert('Reply sent!');
      loadCandidateData();
    } catch (err) {
      alert('Error replying: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
          Candidate Portal
        </h1>
        <p style={{ color: 'var(--slate)' }}>
          Manage credentials, submit community announcements, and engage with constituents
        </p>
      </div>

      {/* Verification Status Banner */}
      {profile && (
        <div style={{
          padding: '1.25rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: profile.verificationStatus === 'VERIFIED' ? '#ecfdf5' : profile.verificationStatus === 'PENDING' ? '#fef3c7' : '#fee2e2',
          border: `1px solid ${profile.verificationStatus === 'VERIFIED' ? '#a7f3d0' : profile.verificationStatus === 'PENDING' ? '#fde68a' : '#fecaca'}`,
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
              <span className={`badge ${profile.verificationStatus === 'VERIFIED' ? 'badge-verified' : profile.verificationStatus === 'PENDING' ? 'badge-pending' : 'badge-rejected'}`}>
                {profile.verificationStatus}
              </span>
              <strong style={{ color: 'var(--dark)' }}>
                {profile.verificationStatus === 'VERIFIED'
                  ? 'Your profile is officially verified and public'
                  : profile.verificationStatus === 'PENDING'
                  ? 'Your verification documents are awaiting administrator review'
                  : profile.verificationStatus === 'RESUBMISSION_REQUIRED'
                  ? 'Administrator requested document resubmission'
                  : 'Candidate profile verification rejected'}
              </strong>
            </div>
            {profile.verificationReason && (
              <div style={{ fontSize: '0.85rem', color: 'var(--slate)', marginTop: '0.25rem' }}>
                Admin Notes: <em>{profile.verificationReason}</em>
              </div>
            )}
          </div>

          {profile.verificationStatus !== 'VERIFIED' && (
            <button onClick={() => setActiveTab('credentials')} className="btn btn-outline btn-sm" style={{ background: '#fff' }}>
              <i className="fas fa-upload"></i> Upload / Replace Documents
            </button>
          )}
        </div>
      )}

      {/* Tabs Header */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>
          <i className="fas fa-newspaper"></i> My Submitted Posts ({authoredNews.length})
        </button>
        <button className={`tab-btn ${activeTab === 'author' ? 'active' : ''}`} onClick={() => setActiveTab('author')}>
          <i className="fas fa-edit"></i> Submit New Announcement
        </button>
        <button className={`tab-btn ${activeTab === 'credentials' ? 'active' : ''}`} onClick={() => setActiveTab('credentials')}>
          <i className="fas fa-id-card"></i> Profile & Documents
        </button>
        <button className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`} onClick={() => setActiveTab('inquiries')}>
          <i className="fas fa-comments"></i> Constituent Inquiries ({feedbackList.length})
        </button>
      </div>

      {/* TAB 1: MY POSTS */}
      {activeTab === 'posts' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>My News & Community Updates</h3>

          {authoredNews.length === 0 ? (
            <p style={{ color: 'var(--slate)', textAlign: 'center', padding: '2rem' }}>No articles authored yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Headline</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {authoredNews.map((post) => (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        {post.rejectionReason && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>Rejection reason: {post.rejectionReason}</div>
                        )}
                      </td>
                      <td><span className="badge badge-category">{post.category}</span></td>
                      <td>{post.localityName || post.location}</td>
                      <td>
                        <span className={`badge ${post.status === 'APPROVED' ? 'badge-verified' : post.status === 'PENDING_MODERATION' ? 'badge-pending' : 'badge-rejected'}`}>
                          {post.status}
                        </span>
                      </td>
                      <td>{post.views}</td>
                      <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AUTHOR NEW ANNOUNCEMENT */}
      {activeTab === 'author' && (
        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxWidth: '800px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>Submit Civic Announcement</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.5rem' }}>
            Updates submitted by candidates enter the administrative moderation queue before publishing.
          </p>

          <form onSubmit={handleCreateNews}>
            <div className="form-group">
              <label className="form-label">Article Headline</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Ward 4 Youth Mentorship Program Announced"
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  value={newsForm.category}
                  onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                >
                  <option value="Civic">Civic & Council</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Health">Health & Wellness</option>
                  <option value="Education">Education & Youth</option>
                  <option value="Environment">Environment & Parks</option>
                  <option value="Events">Community Events</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Constituency Neighborhood</label>
                <input
                  type="text"
                  className="form-control"
                  value={newsForm.location}
                  onChange={(e) => setNewsForm({ ...newsForm, location: e.target.value, localityName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude Coordinate</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={newsForm.latitude}
                  onChange={(e) => setNewsForm({ ...newsForm, latitude: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude Coordinate</label>
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  value={newsForm.longitude}
                  onChange={(e) => setNewsForm({ ...newsForm, longitude: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <ImageUploader
              label="Article Picture / Photo (Object Storage)"
              uploadType="news-image"
              onUploadSuccess={(media) => setNewsForm({ ...newsForm, imageKey: media.storageKey, imageUrl: media.url })}
            />

            <FileUploader
              label="Downloadable Project Brief / Flyer PDF (Optional)"
              uploadType="news-attachment"
              onUploadSuccess={(media) => setNewsForm({ ...newsForm, attachmentKey: media.storageKey, attachmentName: media.originalFileName })}
            />

            <div className="form-group">
              <label className="form-label">Full Article / Announcement Body</label>
              <textarea
                className="form-control"
                rows="6"
                placeholder="Provide full details, background, objectives, and contact info..."
                value={newsForm.content}
                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i> Submit Post for Moderation
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CREDENTIALS & PROFILE */}
      {activeTab === 'credentials' && profile && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Photo & Info */}
          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--dark)' }}>Candidate Profile Photo</h3>
            <ImageUploader
              label="Upload Profile Photo"
              uploadType="profile-photo"
              initialUrl={user.profilePhotoUrl}
              onUploadSuccess={handleProfilePhotoUpload}
            />

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '0.5rem' }}>
                Constituency Area: <strong>{profile.area}</strong>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '0.5rem' }}>
                Affiliation: <strong>{profile.party}</strong>
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--slate)' }}>
                Platform Bio: <div style={{ marginTop: '0.35rem', color: 'var(--dark)' }}>{profile.profile}</div>
              </div>
            </div>
          </div>

          {/* Verification Documents Upload */}
          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>Private Verification Documents</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
              Upload proof of identity, voter registration, or electoral nomination certificates. Kept private and accessible only to administrators.
            </p>

            <div className="form-group">
              <label className="form-label">Document Category</label>
              <select className="form-control" value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="ID_PROOF">National ID / Passport</option>
                <option value="VOTER_ID">Constituency Voter ID</option>
                <option value="NOMINATION_DOC">Nomination Certificate</option>
                <option value="AFFIDAVIT">Candidate Affidavit</option>
              </select>
            </div>

            <FileUploader
              label="Select Document File (.pdf, .doc, .docx)"
              uploadType="candidate-document"
              documentType={docType}
              onUploadSuccess={handleDocumentUploaded}
            />

            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: '0.75rem', color: 'var(--dark)' }}>Submitted Credentials:</div>
              {profile.documents && profile.documents.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {profile.documents.map((doc) => (
                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i>
                        <span>{doc.fileName}</span>
                        <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>{doc.documentType}</span>
                      </div>
                      <span className={`badge ${doc.verificationStatus === 'VALID' ? 'badge-verified' : 'badge-pending'}`} style={{ fontSize: '0.72rem' }}>
                        {doc.verificationStatus}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--light-slate)', fontStyle: 'italic' }}>No documents uploaded yet.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Constituent Inquiries</h3>
          {feedbackList.length === 0 ? (
            <p style={{ color: 'var(--slate)', textAlign: 'center', padding: '2rem' }}>No inquiries received from constituents yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {feedbackList.map((f) => (
                <div key={f.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong>{f.citizenName}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>{new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.75rem' }}>{f.content}</p>

                  {f.reply ? (
                    <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                      <strong>Your Reply:</strong> {f.reply}
                    </div>
                  ) : (
                    <button onClick={() => handleReplyFeedback(f.id)} className="btn btn-outline btn-sm">
                      <i className="fas fa-reply"></i> Reply to Constituent
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
