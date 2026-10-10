import React, { useEffect, useState } from 'react';
import { citizenService } from '../services/citizenService';
import { useLocation } from '../context/LocationContext';
import { RadiusSlider } from '../components/location/RadiusSlider';
import { LocalitySelector } from '../components/location/LocalitySelector';

export const CitizenDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [quizzes, setQuizzes] = useState([]);
  const [myFeedback, setMyFeedback] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);

  const { coords, localityName, consentStatus, revokeConsent, openConsentModal } = useLocation();

  const loadData = () => {
    setLoading(true);
    Promise.all([
      citizenService.getWallet(),
      citizenService.getQuizzes(),
      citizenService.getMyFeedback(),
    ])
      .then(([walRes, quizRes, feedRes]) => {
        if (walRes.data) setWallet(walRes.data);
        if (quizRes.data) setQuizzes(quizRes.data);
        if (feedRes.data) setMyFeedback(feedRes.data);
      })
      .catch((err) => console.error('Error fetching citizen dashboard:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectOption = (quizId, opt) => {
    setSelectedAnswers({ ...selectedAnswers, [quizId]: opt });
  };

  const handleSubmitQuiz = async (quizId) => {
    const opt = selectedAnswers[quizId];
    if (!opt) {
      alert('Please select an option first!');
      return;
    }

    try {
      const res = await citizenService.submitQuiz(quizId, opt);
      setQuizResults({ ...quizResults, [quizId]: res.data.correct });
      if (res.data.correct) {
        alert('Correct answer! Reward coins added to your wallet.');
      } else {
        alert('Incorrect answer. Try again!');
      }
      // Refresh wallet balance
      citizenService.getWallet().then((w) => w.data && setWallet(w.data));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.5rem' }}>
          Citizen Hub
        </h1>
        <p style={{ color: 'var(--slate)' }}>
          Civic rewards wallet, geolocation preferences, quizzes, and representative dialogues
        </p>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header">
        <button className={`tab-btn ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <i className="fas fa-coins" style={{ color: '#d97706' }}></i> Civic Wallet ({wallet.balance} Coins)
        </button>
        <button className={`tab-btn ${activeTab === 'location' ? 'active' : ''}`} onClick={() => setActiveTab('location')}>
          <i className="fas fa-map-marker-alt"></i> Location & Privacy Preferences
        </button>
        <button className={`tab-btn ${activeTab === 'quizzes' ? 'active' : ''}`} onClick={() => setActiveTab('quizzes')}>
          <i className="fas fa-award"></i> Civic Literacy Quizzes ({quizzes.length})
        </button>
        <button className={`tab-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
          <i className="fas fa-comments"></i> My Inquiries ({myFeedback.length})
        </button>
      </div>

      {/* TAB 1: WALLET */}
      {activeTab === 'wallet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef3c7', color: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem auto' }}>
              <i className="fas fa-wallet"></i>
            </div>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '0.25rem' }}>
              {wallet.balance}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '1.5rem' }}>
              Virtual Civic Coins
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--slate)', textAlign: 'left', lineHeight: '1.5' }}>
              <strong style={{ color: 'var(--dark)' }}>How to earn coins:</strong>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.4rem' }}>
                <li>Read verified news: <strong>+5 Coins</strong></li>
                <li>Submit feedback / question: <strong>+10 Coins</strong></li>
                <li>Flag inaccurate news: <strong>+10 Coins</strong></li>
                <li>Pass civic quiz: <strong>+10 Coins</strong></li>
              </ul>
            </div>
          </div>

          <div style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>Reward Transaction Ledger</h3>
            {wallet.transactions.length === 0 ? (
              <p style={{ color: 'var(--slate)' }}>No transactions yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Activity</th>
                      <th>Coins</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallet.transactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>{tx.activity}</td>
                        <td style={{ fontWeight: 700, color: '#047857' }}>+{tx.coins}</td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--slate)' }}>{new Date(tx.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: LOCATION PREFERENCES */}
      {activeTab === 'location' && (
        <div style={{ background: '#ffffff', padding: '2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', maxWidth: '650px', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--dark)' }}>
            <i className="fas fa-user-shield" style={{ color: 'var(--primary)' }}></i> Informed Consent & Geolocation Settings
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '1.5rem' }}>
            We only acquire your location with explicit consent to tailor neighborhood news feeds and nearby candidate platforms.
          </p>

          <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '0.4rem' }}>
              Current Status: <strong style={{ color: coords ? 'var(--success)' : 'var(--slate)' }}>{consentStatus}</strong>
            </div>
            <div style={{ fontSize: '0.88rem', color: 'var(--slate)', marginBottom: '0.4rem' }}>
              Active Neighborhood: <strong>{localityName || 'Not configured'}</strong>
            </div>
            {coords && coords.latitude != null && coords.longitude != null && (
              <div style={{ fontSize: '0.82rem', color: 'var(--light-slate)' }}>
                Coordinates: {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Adjust Nearby Search Radius</label>
            <RadiusSlider />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label className="form-label">Manual Neighborhood Selection</label>
            <LocalitySelector />
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={openConsentModal} className="btn btn-primary btn-sm">
              <i className="fas fa-location-arrow"></i> Change Location / Grant GPS
            </button>
            {coords && (
              <button onClick={revokeConsent} className="btn btn-danger btn-sm">
                <i className="fas fa-ban"></i> Revoke Location Consent
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: QUIZZES */}
      {activeTab === 'quizzes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
          {quizzes.map((q) => (
            <div key={q.id} style={{ background: '#ffffff', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className="badge badge-category">{q.title}</span>
                <span className="badge" style={{ background: '#fef3c7', color: '#b45309' }}>+{q.rewardCoins} Coins</span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--dark)', margin: '0.5rem 0 1rem 0' }}>{q.question}</h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
                {[
                  { key: 'A', text: q.optionA },
                  { key: 'B', text: q.optionB },
                  { key: 'C', text: q.optionC },
                  { key: 'D', text: q.optionD },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: selectedAnswers[q.id] === opt.key ? 'var(--primary-light)' : '#f8fafc',
                      border: `1px solid ${selectedAnswers[q.id] === opt.key ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="radio"
                      name={`quiz_${q.id}`}
                      checked={selectedAnswers[q.id] === opt.key}
                      onChange={() => handleSelectOption(q.id, opt.key)}
                    />
                    <span><strong>{opt.key}.</strong> {opt.text}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={() => handleSubmitQuiz(q.id)} className="btn btn-primary btn-sm">
                  Submit Answer (+{q.rewardCoins} Coins)
                </button>
                {quizResults[q.id] !== undefined && (
                  <span style={{ fontWeight: 600, color: quizResults[q.id] ? 'var(--success)' : 'var(--danger)', fontSize: '0.9rem' }}>
                    {quizResults[q.id] ? '✓ Correct! Coins Awarded.' : '✗ Incorrect. Try again!'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: MY INQUIRIES */}
      {activeTab === 'feedback' && (
        <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--dark)' }}>My Inquiries & Feedback</h3>
          {myFeedback.length === 0 ? (
            <p style={{ color: 'var(--slate)' }}>You haven't submitted any inquiries yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myFeedback.map((f) => (
                <div key={f.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>To: <strong>{f.candidateName}</strong></div>
                    <span className={`badge ${f.status === 'RESOLVED' ? 'badge-verified' : 'badge-pending'}`}>{f.status}</span>
                  </div>
                  <p style={{ fontSize: '0.92rem', color: '#334155', marginBottom: '0.75rem' }}>{f.content}</p>
                  {f.reply && (
                    <div style={{ background: '#f1f5f9', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem' }}>
                      <strong>Representative Reply:</strong> {f.reply}
                    </div>
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
