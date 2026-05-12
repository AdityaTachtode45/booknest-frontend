import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [accepted, setAccepted] = useState(false);

    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        confirmPassword: '', 
        phone: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateForm = () => {
        const { name, email, password, confirmPassword, phone } = formData;

        if (!/^[A-Za-z ]{3,}$/.test(name)) return "Enter valid name (min 3 letters)";
        if (!/^[6-9]\d{9}$/.test(phone)) return "Enter valid 10-digit phone number";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter valid email address";
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            return "Password: 8+ chars, Uppercase, Lowercase, & Number";
        }

        if (password !== confirmPassword) return "Passwords do not match";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!accepted) {
    setError("You must accept Terms & Conditions");
    return;
}
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true); 
        setError('');

        try {
            const { confirmPassword, ...dataToSend } = formData;
            const res = await registerUser(dataToSend);
            login(res.data, res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'Something went wrong.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                
                .rg-container {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                }

                .rg-box {
                    width: 100%;
                    max-width: 400px;
                    background: #0a0a0a;
                    padding: 32px;
                    border: 1px solid #1a1a1a;
                    border-radius: 12px;
                    box-sizing: border-box; /* Ensures padding doesn't push width out */
                }

                .rg-brand {
                    font-family: 'Fraunces', serif;
                    font-size: 22px;
                    font-weight: 600;
                    color: #ffffff;
                    margin-bottom: 24px;
                    cursor: pointer;
                    width: fit-content;
                }
                .rg-brand span { color: #d4af37; }

                .rg-title {
                    font-family: 'Fraunces', serif;
                    font-size: 28px;
                    color: #ffffff;
                    margin-bottom: 6px;
                }
                .rg-title span { color: #d4af37; font-style: italic; font-weight: 400; }

                .rg-sub {
                    font-size: 13px;
                    color: #666;
                    margin-bottom: 24px;
                    line-height: 1.4;
                }

                .rg-err {
                    padding: 12px;
                    border-radius: 6px;
                    background: rgba(255, 69, 58, 0.1);
                    color: #ff453a;
                    font-size: 13px;
                    margin-bottom: 20px;
                    border: 1px solid rgba(255, 69, 58, 0.2);
                }

                .rg-group {
                    margin-bottom: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .rg-label {
                    font-size: 11px;
                    color: #888;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .rg-input {
                    padding: 12px 14px;
                    background: #121212;
                    border: 1px solid #222;
                    border-radius: 6px;
                    color: #fff;
                    font-size: 14px;
                    width: 100%;
                    box-sizing: border-box; /* Critical for keeping inputs inside the box */
                    transition: all 0.3s ease;
                }

                .rg-input:hover { border-color: #444; }
                .rg-input:focus {
                    outline: none;
                    border-color: #d4af37;
                    background: #181818;
                    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
                }

                /* Name and Phone row stays side-by-side */
                .rg-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .rg-btn {
                    width: 100%;
                    padding: 14px;
                    background: #d4af37;
                    color: #000;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                    margin-top: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .rg-btn:hover:not(:disabled) {
                    background: #f1c40f;
                    transform: translateY(-1px);
                }

                .rg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .rg-divider {
                    height: 1px;
                    background: #1a1a1a;
                    margin: 24px 0;
                }

                .rg-footer {
                    text-align: center;
                    color: #666;
                    font-size: 13px;
                }
                .rg-footer a {
                    color: #d4af37;
                    text-decoration: none;
                    font-weight: 500;
                }
                    /* TERMS CHECKBOX */
.rg-check {
    display: flex;
    justify-content: center;   /* 🔥 centers horizontally */
    align-items: center;
    gap: 10px;
    margin-top: 14px;
    font-size: 13px;
    color: #888;
    text-align: center;
}

.rg-check input {
    accent-color: #d4af37;
    cursor: pointer;
    width: 16px;
    height: 16px;
}

.rg-check label {
    cursor: pointer;
}

.rg-check span {
    color: #d4af37;
    font-weight: 500;
}

.rg-check a {
    color: #d4af37;
    font-weight: 500;
    text-decoration: none;
}

.rg-check a:hover {
    text-decoration: underline;
}

                @media (max-width: 400px) {
                    .rg-row { grid-template-columns: 1fr; gap: 16px; }
                }
            `}</style>

            <div className="rg-container">
                <div className="rg-box">
                    <div className="rg-brand" onClick={() => navigate('/')}>Book<span>Nest</span></div>

                    <h1 className="rg-title">Join <span>us</span></h1>
                    <p className="rg-sub">Experience the darker side of BookNest.</p>

                    {error && <div className="rg-err">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        {/* Name and Phone still shared for compactness */}
                        <div className="rg-row">
                            <div className="rg-group" style={{marginBottom: 0}}>
                                <label className="rg-label">Full Name</label>
                                <input className="rg-input" type="text" name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange} required />
                            </div>
                            <div className="rg-group" style={{marginBottom: 0}}>
                                <label className="rg-label">Phone</label>
                                <input className="rg-input" type="text" name="phone"
                                    placeholder="Number"
                                    value={formData.phone}
                                    onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="rg-group">
                            <label className="rg-label">Email Address</label>
                            <input className="rg-input" type="email" name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange} required />
                        </div>

                        {/* Password - Taken out of rg-row to be on its own line */}
                        <div className="rg-group">
                            <label className="rg-label">Password</label>
                            <input className="rg-input" type="password" name="password"
                                placeholder="Min. 8 characters"
                                value={formData.password}
                                onChange={handleChange} required />
                        </div>

                        {/* Confirm Password - Now on its own line beneath Password */}
                        <div className="rg-group">
                            <label className="rg-label">Confirm Password</label>
                            <input className="rg-input" type="password" name="confirmPassword"
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange} required />
                        </div>

                        <button className="rg-btn" type="submit" disabled={loading}>
                            {loading ? 'Verifying...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="rg-divider" />
                    <div className="rg-check">
    <input
        type="checkbox"
        id="terms"
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
    />
    <label htmlFor="terms">
        I agree to the{' '}
        <Link to="/terms" onClick={(e) => e.stopPropagation()}>
            Terms & Conditions
        </Link>
    </label>
    
                    <div className="rg-divider" />
</div>
                    <p className="rg-footer">Member already? <Link to="/login">Sign in</Link></p>
                </div>
            </div>
        </>
    );
};

export default Register;
