import React, { useEffect, useState } from 'react';
import { adminService } from '../services/adminService';
import { mediaService } from '../services/mediaService';
import { ImageUploader } from '../components/upload/ImageUploader';
import { FileUploader } from '../components/upload/FileUploader';
import { newsService } from '../services/newsService';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [pendingNews, setPendingNews] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Announcement form state
  const [announcement, setAnnouncement] = useState({
    title: '',
    category: 'Civic',
    location: 'Downtown Ward 4',
    localityName: 'Downtown Ward 4',
    latitude: 40.7128,
    longitude: -74.0060,
    content: '',
    imageKey: '',
    imageUrl: '',
    attachmentKey: '',
    attachmentName: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.all([
      adminService.getStats(),
      adminService.getCandidates(),
      adminService.getPendingNews(),
      adminService.getReports(),
      adminService.getUsers(),
      adminService.getAuditLogs(),
    ])
      .then(([statsRes, candsRes, newsRes, repRes, usersRes, logsRes]) => {
        if (statsRes.data) setStats(statsRes.data);
        if (candsRes.data) setCandidates(candsRes.data);
        if (newsRes.data) setPendingNews(newsRes.data);
        if (repRes.data) setReports(repRes.data);
        if (usersRes.data) setUsers(usersRes.data);
        if (logsRes.data) setAuditLogs(logsRes.data);
      })
      .catch((err) => console.error('Error loading admin dashboard:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Candidate Actions
  const handleVerifyCandidate = async (id) => {
    const remarks = prompt('Enter validation notes (optional):', 'Credentials verified against registry.');
    if (remarks === null) return;
    try {
      await adminService.performVerificationAction(id, 'VERIFIED', remarks);
      alert('Candidate verified and published to public portal!');
      loadData();
    } catch (err) {
      alert('Error verifying: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectCandidate = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminService.performVerificationAction(id, 'REJECTED', reason);
      alert('Candidate marked as Rejected.');
      loadData();
    } catch (err) {
      alert('Error rejecting: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResubmitCandidate = async (id) => {
    const remarks = prompt('Specify missing documents or fields required from candidate:');
    if (!remarks) return;
    try {
      await adminService.performVerificationAction(id, 'RESUBMISSION_REQUIRED', remarks);
      alert('Resubmission request recorded.');
      loadData();
    } catch (err) {
      alert('Error requesting resubmission: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDownloadDoc = (storageKey, fileName) => {
    mediaService.downloadSecureDocument(storageKey, fileName);
  };

  // News Actions
  const handleApproveNews = async (id) => {
    try {
      await adminService.approveNews(id);
      alert('News post approved and published!');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleRejectNews = async (id) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      await adminService.rejectNews(id, reason);
      alert('News post rejected.');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Publish Announcement Form Submit
  const handlePublishAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await newsService.createAdminNews(announcement);
      alert('Official municipal announcement published immediately!');
      setAnnouncement({
        title: '',
        category: 'Civic',
        location: 'Downtown Ward 4',
        localityName: 'Downtown Ward 4',
        latitude: 40.7128,
        longitude: -74.0060,
        content: '',
        imageKey: '',
        imageUrl: '',
        attachmentKey: '',
        attachmentName: '',
      });
      loadData();
    } catch (err) {
      alert('Error publishing announcement: ' + (err.response?.data?.message || err.message));
    }
  };

  // User Actions
  const handleToggleUser = async (id) => {
    try {
      await adminService.toggleUserStatus(id);
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Report Resolution
  const handleResolveReport = async (id, action) => {
    const notes = prompt('Enter administrator resolution notes:');
    try {
      await adminService.resolveReport(id, action, notes);
      alert('Report resolved.');
      loadData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
          Municipal Administration Console
        </h1>
        <p style={{ color: 'var(--slate)' }}>
          Electoral verification, news moderation, content oversight, and system security
        </p>
      </div>

      {/* Stats Counter Bar */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--dark)' }}>{stats.totalUsers}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Total Users</div>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--secondary)' }}>{stats.totalCandidates}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Candidates Registered</div>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>{stats.verifiedCandidates}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Verified Leaders</div>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--warning)' }}>{stats.pendingNews}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Pending News</div>
          </div>
          <div style={{ background: '#fff', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)' }}>{stats.pendingReports}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--slate)', textTransform: 'uppercase' }}>Flagged Reports</div>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
          <i className="fas fa-id-card"></i> Candidate Verification ({candidates.filter((c) => c.verificationStatus === 'PENDING').length} Pending)
        </button>
        <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
          <i className="fas fa-newspaper"></i> News Moderation & Announcements ({pendingNews.length})
        </button>
        <button className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>
          <i className="fas fa-flag"></i> Content Reports ({reports.length})
        </button>
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          <i className="fas fa-users-cog"></i> User Management
        </button>
        <button className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`} onClick={() => setActiveTab('audit')}>
          <i className="fas fa-history"></i> Audit Trail
        </button>
      </div>

      {/* TAB 1: CANDIDATE VERIFICATION REVIEWS */}
      {activeTab === 'candidates' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: 'var(--dark)' }}>
            Candidate Registration Queue & Identity Verification
          </h3>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Constituency</th>
                  <th>Status</th>
                  <th>Private Documents</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((cand) => (
                  <tr key={cand.id}>
                    <td>
                      <strong>{cand.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>{cand.email} • {cand.party}</div>
                    </td>
                    <td>{cand.area}</td>
                    <td>
                      <span className={`badge ${cand.verificationStatus === 'VERIFIED' ? 'badge-verified' : cand.verificationStatus === 'PENDING' ? 'badge-pending' : 'badge-rejected'}`}>
                        {cand.verificationStatus}
                      </span>
                    </td>
                    <td>
                      {cand.documents && cand.documents.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          {cand.documents.map((doc) => (
                            <button
                              key={doc.id}
                              onClick={() => handleDownloadDoc(doc.storageKey, doc.fileName)}
                              className="btn btn-outline btn-sm"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem', justifyContent: 'flex-start' }}
                              title="Download confidential document (Logged in audit trail)"
                            >
                              <i className="fas fa-file-pdf" style={{ color: '#ef4444' }}></i>
                              <span>{doc.fileName}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--light-slate)', fontStyle: 'italic' }}>No files</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <button onClick={() => handleVerifyCandidate(cand.id)} className="btn btn-success btn-sm" title="Approve candidate">
                          <i className="fas fa-check"></i> Verify
                        </button>
                        <button onClick={() => handleResubmitCandidate(cand.id)} className="btn btn-outline btn-sm" title="Request resubmission">
                          <i className="fas fa-undo"></i> Request Resubmit
                        </button>
                        <button onClick={() => handleRejectCandidate(cand.id)} className="btn btn-danger btn-sm" title="Reject registration">
                          <i className="fas fa-ban"></i> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NEWS MODERATION & ANNOUNCEMENTS */}
      {activeTab === 'news' && (
        <div>
          {/* Direct Municipal Announcement Form */}
          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
              Publish Official Municipal Announcement
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '1.25rem' }}>
              Official administrative notices bypass moderation and are published directly to citizens' local feeds.
            </p>

            <form onSubmit={handlePublishAnnouncement}>
              <div className="form-group">
                <label className="form-label">Announcement Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. City Council Approves Ward 4 Clean Water Modernization"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({ ...announcement, title: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-control"
                    value={announcement.category}
                    onChange={(e) => setAnnouncement({ ...announcement, category: e.target.value })}
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
                  <label className="form-label">Location Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={announcement.location}
                    onChange={(e) => setAnnouncement({ ...announcement, location: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Locality Coordinates (Lat, Lng)</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      placeholder="Lat"
                      value={announcement.latitude}
                      onChange={(e) => setAnnouncement({ ...announcement, latitude: parseFloat(e.target.value) })}
                    />
                    <input
                      type="number"
                      step="any"
                      className="form-control"
                      placeholder="Lng"
                      value={announcement.longitude}
                      onChange={(e) => setAnnouncement({ ...announcement, longitude: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
              </div>

              <ImageUploader
                label="Article Picture / Photo (Object Storage)"
                uploadType="news-image"
                onUploadSuccess={(media) => setAnnouncement({ ...announcement, imageKey: media.storageKey, imageUrl: media.url })}
              />

              <FileUploader
                label="Downloadable Municipal PDF / Document Attachment (Optional)"
                uploadType="news-attachment"
                onUploadSuccess={(media) => setAnnouncement({ ...announcement, attachmentKey: media.storageKey, attachmentName: media.originalFileName })}
              />

              <div className="form-group">
                <label className="form-label">Full Article / Policy Announcement Content</label>
                <textarea
                  className="form-control"
                  rows="5"
                  placeholder="Provide complete council details, project schedules, and public notices..."
                  value={announcement.content}
                  onChange={(e) => setAnnouncement({ ...announcement, content: e.target.value })}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary">
                <i className="fas fa-bullhorn"></i> Publish Municipal Announcement
              </button>
            </form>
          </div>

          {/* Pending Submissions Queue */}
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>
              Candidate Submissions Awaiting Moderation
            </h3>

            {pendingNews.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate)' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }}></i>
                <p>No news posts currently awaiting moderation.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingNews.map((item) => (
                  <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="badge badge-category">{item.category}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', color: 'var(--dark)' }}>{item.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--slate)', marginBottom: '0.75rem' }}>
                      Author: <strong>{item.authorName}</strong> • Area: <strong>{item.location}</strong>
                    </div>
                    <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '1rem', whiteSpace: 'pre-line' }}>{item.content}</p>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleApproveNews(item.id)} className="btn btn-success btn-sm">
                        <i className="fas fa-check"></i> Approve & Publish
                      </button>
                      <button onClick={() => handleRejectNews(item.id)} className="btn btn-danger btn-sm">
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeTab === 'reports' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Flagged Content Reports</h3>
          {reports.length === 0 ? (
            <p style={{ color: 'var(--slate)' }}>No content reports pending review.</p>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Reason</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.news?.title}</strong></td>
                      <td style={{ color: '#991b1b' }}>{r.reason}</td>
                      <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleResolveReport(r.id, 'RESOLVED_NO_ACTION')} className="btn btn-outline btn-sm">
                            Dismiss
                          </button>
                          <button onClick={() => handleResolveReport(r.id, 'REMOVED_CONTENT')} className="btn btn-danger btn-sm">
                            Remove Post
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: USERS */}
      {activeTab === 'users' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Registered User Accounts</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Locality</th>
                  <th>Toggle Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong> ({u.username})<div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>{u.email}</div></td>
                    <td><span className="badge badge-category">{u.role}</span></td>
                    <td><span className={`badge ${u.status === 'ACTIVE' ? 'badge-verified' : 'badge-rejected'}`}>{u.status}</span></td>
                    <td>{u.locality || '—'}</td>
                    <td>
                      <button onClick={() => handleToggleUser(u.id)} className="btn btn-outline btn-sm">
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Administrative Audit Trail</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Candidate Target</th>
                  <th>Administrator</th>
                  <th>Action</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td><strong>{log.candidateProfile?.user?.name || 'Candidate #' + log.candidateProfile?.id}</strong></td>
                    <td>{log.admin?.name}</td>
                    <td><span className="badge badge-geo">{log.action}</span></td>
                    <td style={{ fontSize: '0.85rem' }}>{log.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
