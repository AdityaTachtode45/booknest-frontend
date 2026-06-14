import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();
  const year = new Date().getFullYear();
  const [jokeData, setJokeData] = useState(null);
useEffect(() => {

  const fetchStatus = async () => {
    try {

      const response = await fetch("https://booknest-b.onrender.com/scheduler-status");

      const data = await response.json();

      setJokeData(data);

    } catch (error) {
      console.error(error);
    }
  };

  fetchStatus();

  const interval = setInterval(fetchStatus, 5000);

  return () => clearInterval(interval);

}, []);
  return (
    <>
   <style>{`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:wght@600&display=swap');

/* ===== AMOLED GOLD FOOTER ===== */
.ft{
  background: #000000;
  border-top: 1px solid rgba(255, 193, 7, 0.1);
  font-family:'Inter',sans-serif;
  position: relative;
}

.ft-monitor{
  margin-top: 30px;
  margin-bottom: 20px;
  padding: 16px;
  border-radius: 10px;
  background: rgba(255,193,7,0.04);
  border: 1px solid rgba(255,193,7,0.12);
}

.ft-monitor-title{
  color:#FFC107;
  font-size:12px;
  font-weight:600;
  letter-spacing:1px;
  margin-bottom:8px;
}

.ft-monitor-time{
  color:#ffffff;
  font-size:12px;
  margin-bottom:8px;
}

.ft-monitor-joke{
  color:rgba(255,255,255,.7);
  font-size:13px;
  line-height:1.5;
}
/* CONTAINER */
.ft-inner{
  max-width:1200px;
  margin:0 auto;
  padding:60px 32px 30px;
}

/* GRID */
.ft-grid{
  display:grid;
  grid-template-columns:1.6fr 1fr 1fr;
  gap:50px;
  padding-bottom:40px;
  border-bottom:1px solid rgba(255, 193, 7, 0.05);
}

/* BRAND */
.ft-brand{
  display:flex;
  flex-direction:column;
  gap:16px;
}

.ft-logo{
  font-family:'Fraunces',serif;
  font-size:24px;
  font-weight:600;
  cursor:pointer;
  color:#ffffff;
  letter-spacing: -0.5px;
}

.ft-logo span{
  color:#FFC107;
}

/* DESCRIPTION */
.ft-desc{
  font-size:14px;
  color:rgba(255, 255, 255, 0.4);
  line-height:1.6;
  max-width:280px;
}

/* GITHUB BUTTON - UPDATED TO GOLD */
.ft-gh{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding:10px 16px;
  border-radius:8px;
  border:1px solid rgba(255, 193, 7, 0.2);
  background: rgba(255, 193, 7, 0.03);
  font-size:13px;
  font-weight: 500;
  color:#FFC107;
  text-decoration:none;
  transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: fit-content;
}

.ft-gh:hover{
  background:#FFC107;
  color:#000;
  transform:translateY(-3px);
  box-shadow: 0 10px 20px rgba(255, 193, 7, 0.15);
}

/* COLUMNS */
.ft-col{
  display:flex;
  flex-direction:column;
  gap:8px;
}

.ft-col-head{
  font-size:11px;
  font-weight: 600;
  letter-spacing:1.5px;
  text-transform:uppercase;
  color:#FFC107;
  margin-bottom:16px;
  opacity: 0.9;
}

/* LINKS */
.ft-col-link{
  background:none;
  border:none;
  text-align:left;
  font-size:14px;
  color:rgba(255, 255, 255, 0.5);
  cursor:pointer;
  padding:5px 0;
  transition:all 0.2s ease;
}

.ft-col-link:hover{
  color:#FFC107;
  transform:translateX(6px);
}

/* BOTTOM */
.ft-bottom{
  display:flex;
  justify-content:space-between;
  align-items:center;
  flex-wrap:wrap;
  gap:16px;
  padding-top:30px;
}

/* COPYRIGHT */
.ft-copy{
  font-size:13px;
  color:rgba(255, 255, 255, 0.3);
}

.ft-copy b{
  color:#FFC107;
  font-weight: 600;
}

/* LEGAL LINKS */
.ft-legal{
  display:flex;
  gap:24px;
}

.ft-ll{
  background:none;
  border:none;
  font-size:13px;
  color:rgba(255, 255, 255, 0.4);
  cursor:pointer;
  transition:all 0.2s ease;
}

.ft-ll:hover{
  color:#FFC107;
}

/* MOBILE RESPONSIVENESS */
@media(max-width:700px){
  .ft-grid{
    grid-template-columns: 1fr 1fr;
    gap:40px;
  }
  .ft-brand{
    grid-column: 1 / -1;
  }
}

@media(max-width:440px){
  .ft-inner{padding:40px 24px 24px;}
  .ft-grid{grid-template-columns: 1fr;}
  .ft-bottom{flex-direction: column; align-items: flex-start;}
}
`}</style>

      <footer className="ft" role="contentinfo">
        <div className="ft-inner">
          <div className="ft-grid">
            <div className="ft-brand">
              <div className="ft-logo" onClick={() => navigate('/')}>Book<span>Nest</span></div>
              <p className="ft-desc">The premium marketplace for bibliophiles. Exchange, rent, and trade with your local community.</p>
              <a className="ft-gh" href="https://github.com/Oshimataru" target="_blank" rel="noopener noreferrer">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                Oshimataru
              </a>
            </div>

            <div className="ft-col">
              <p className="ft-col-head">Navigation</p>
              <button className="ft-col-link" onClick={() => navigate('/books')}>Browse Catalog</button>
              <button className="ft-col-link" onClick={() => navigate('/clubs')}>Reader Circles</button>
              <button className="ft-col-link" onClick={() => navigate('/leaderboard')}>Hall of Fame</button>
              <button className="ft-col-link" onClick={() => navigate('/terms')}>Governance</button>
              {!user && <button className="ft-col-link" onClick={() => navigate('/register')}>Join Membership</button>}
            </div>

            <div className="ft-col">
              <p className="ft-col-head">{user ? 'Dashboard' : 'Access'}</p>
              {user ? <>
                <button className="ft-col-link" onClick={() => navigate('/my-books')}>Collection</button>
                <button className="ft-col-link" onClick={() => navigate('/my-orders')}>Orders</button>
                <button className="ft-col-link" onClick={() => navigate('/my-exchanges')}>Trades</button>
                <button className="ft-col-link" onClick={() => navigate('/add-book')}>+ List a Title</button>
              </> : <>
                <button className="ft-col-link" onClick={() => navigate('/login')}>Sign In</button>
                <button className="ft-col-link" onClick={() => navigate('/register')}>Sign Up</button>
                <button className="ft-col-link" onClick={() => navigate('/books')}>Guest Access</button>
              </>}
            </div>
          </div>
{jokeData && (
  <div className="ft-monitor">
    <div className="ft-monitor-title">
      🟢 BOOKNEST LIVE MONITOR
    </div>

    <div className="ft-monitor-time">
      Last Run: {jokeData.lastRun}
    </div>

    <div className="ft-monitor-joke">
      {jokeData.joke}
    </div>
  </div>
)}
          <div className="ft-bottom">
            <p className="ft-copy">© {year} <b>BookNest</b>. All Rights Reserved.</p>
            <div className="ft-legal">
              <button className="ft-ll" onClick={() => navigate('/terms')}>Terms</button>
              <button className="ft-ll" onClick={() => navigate('/contact')}>Support</button>
              <button className="ft-ll" onClick={() => navigate('/books')}>Catalog</button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
