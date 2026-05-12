import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getBookById, updateBook } from '../services/api';

const EditBook = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '', author: '', genre: '', description: '',
        price: '', rentPrice: '', condition: '', location: '', quantity: 1
    });
    const [image,   setImage]   = useState(null);
    const [preview, setPreview] = useState(null);
    const [error,   setError]   = useState('');
    const [loading, setLoading] = useState(true);
    const [saving,  setSaving]  = useState(false);

    useEffect(() => { fetchBook(); }, [id]);

    const fetchBook = async () => {
        try {
            const res = await getBookById(id);
            const b = res.data;
            setFormData({
                title: b.title || '', author: b.author || '',
                genre: b.genre || '', description: b.description || '',
                price: b.price || '', rentPrice: b.rentPrice || '',
                condition: b.condition || '', location: b.location || '',
                quantity: b.quantity || 1
            });
            setPreview(b.imageUrl || null);
        } catch { setError('Book not found.'); }
        finally { setLoading(false); }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleImage  = (e) => { const f = e.target.files[0]; if (!f) return; setImage(f); setPreview(URL.createObjectURL(f)); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const data = new FormData();
            Object.keys(formData).forEach(k => data.append(k, formData[k]));
            if (image) data.append('image', image);
            await updateBook(id, data);
            navigate('/my-books');
        } catch (err) { setError(err.response?.data || 'Something went wrong.'); }
        finally { setSaving(false); }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                
                .eb {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding: 100px 24px 80px;
                }
                .eb-box { width: 100%; max-width: 660px; }

                .eb-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    color: #666;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 24px;
                    transition: color 0.2s;
                }
                .eb-back:hover { color: #d4af37; }

                .eb-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(26px, 4vw, 38px);
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: -0.5px;
                    margin-bottom: 6px;
                }
                .eb-title span { color: #d4af37; font-style: italic; font-weight: 400; }
                .eb-sub { font-size: 13px; color: #555; margin-bottom: 32px; }

                .eb-err {
                    padding: 12px 16px;
                    border: 1px solid #ff453a;
                    border-radius: 4px;
                    background: rgba(255, 69, 58, 0.1);
                    color: #ff453a;
                    font-size: 13px;
                    margin-bottom: 20px;
                }

                .eb-loading { text-align: center; padding: 60px 0; color: #d4af37; }
                .eb-dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #d4af37;
                    margin: 0 3px;
                    animation: ebB 1.2s ease-in-out infinite;
                }
                @keyframes ebB { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }

                .eb-sec {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #d4af37;
                    margin-bottom: 14px;
                    margin-top: 28px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid #1a1a1a;
                }
                .eb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
                .eb-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
                .eb-label { font-size: 12px; color: #666; font-weight: 500; }
                
                .eb-input, .eb-select, .eb-textarea {
                    padding: 12px 14px;
                    background: #0a0a0a;
                    border: 1px solid #1a1a1a;
                    border-radius: 6px;
                    color: #fff;
                    font-family: 'Inter', sans-serif;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .eb-input:focus, .eb-select:focus, .eb-textarea:focus { border-color: #d4af37; }
                
                .eb-select { appearance: none; cursor: pointer; }
                .eb-textarea { resize: vertical; min-height: 100px; line-height: 1.6; }

                .eb-div { height: 1px; background: #1a1a1a; margin: 24px 0; }

                .eb-upload {
                    border: 1px dashed #333;
                    border-radius: 8px;
                    overflow: hidden;
                    background: #0a0a0a;
                }
                .eb-upload-label {
                    display: flex; align-items: center; justify-content: center;
                    flex-direction: column; gap: 8px; padding: 30px 20px;
                    cursor: pointer; transition: 0.2s;
                }
                .eb-upload-label:hover { background: #111; border-color: #d4af37; }
                .eb-upload-icon { font-size: 20px; color: #444; }
                .eb-upload-text { font-size: 13px; color: #888; }
                .eb-upload-hint { font-size: 11px; color: #444; }
                .eb-file { display: none; }
                .eb-preview { width: 100%; max-height: 250px; object-fit: contain; background: #000; border-top: 1px solid #1a1a1a; }

                .eb-actions { display: flex; gap: 12px; margin-top: 32px; }
                .eb-cancel {
                    flex: 1; padding: 12px; background: transparent;
                    border: 1px solid #333; border-radius: 6px; color: #888;
                    cursor: pointer; transition: 0.2s;
                }
                .eb-cancel:hover { border-color: #555; color: #fff; }
                
                .eb-save {
                    flex: 2; padding: 12px; background: #d4af37; color: #000;
                    border: none; border-radius: 6px; font-weight: 600;
                    cursor: pointer; transition: 0.2s;
                }
                .eb-save:hover:not(:disabled) { background: #f1c40f; transform: translateY(-2px); }
                .eb-save:disabled { opacity: 0.4; cursor: not-allowed; }

                @media(max-width:540px){ .eb-row { grid-template-columns: 1fr; } .eb-actions { flex-direction: column; } }
            `}</style>

            <div className="eb">
                <div className="eb-box">
                    <button className="eb-back" onClick={() => navigate('/my-books')}>← Back to my listings</button>

                    {loading ? (
                        <div className="eb-loading"><span className="eb-dot"/><span className="eb-dot"/><span className="eb-dot"/></div>
                    ) : (
                        <>
                            <h1 className="eb-title">Update <span>Book</span></h1>
                            <p className="eb-sub">Fine-tune your listing details below.</p>

                            {error && <div className="eb-err">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <p className="eb-sec">Core Information</p>
                                <div className="eb-row">
                                    <div className="eb-group">
                                        <label className="eb-label">Book Title</label>
                                        <input className="eb-input" type="text" name="title" value={formData.title} onChange={handleChange} required />
                                    </div>
                                    <div className="eb-group">
                                        <label className="eb-label">Author</label>
                                        <input className="eb-input" type="text" name="author" value={formData.author} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="eb-row">
                                    <div className="eb-group">
                                        <label className="eb-label">Genre</label>
                                        <select className="eb-select" name="genre" value={formData.genre} onChange={handleChange} required>
                                            <option value="">Select genre</option>
                                            <option value="Fiction">Fiction</option>
                                            <option value="Non-Fiction">Non-Fiction</option>
                                            <option value="Fantasy">Fantasy</option>
                                            <option value="Science">Science</option>
                                            <option value="History">History</option>
                                            <option value="Biography">Biography</option>
                                            <option value="Technology">Technology</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="eb-group">
                                        <label className="eb-label">Condition</label>
                                        <select className="eb-select" name="condition" value={formData.condition} onChange={handleChange} required>
                                            <option value="">Select condition</option>
                                            <option value="New">New</option>
                                            <option value="Like New">Like New</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="eb-group">
                                    <label className="eb-label">Detailed Description</label>
                                    <textarea className="eb-textarea" name="description" value={formData.description} onChange={handleChange} rows="3" required />
                                </div>

                                <div className="eb-div" />
                                <p className="eb-sec">Listing Logistics</p>

                                <div className="eb-row">
                                    <div className="eb-group">
                                        <label className="eb-label">Price (₹)</label>
                                        <input className="eb-input" type="number" name="price" value={formData.price} onChange={handleChange} required />
                                    </div>
                                    <div className="eb-group">
                                        <label className="eb-label">Quantity</label>
                                        <input className="eb-input" type="number" min="1" step="1" name="quantity" value={formData.quantity} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="eb-row">
                                    <div className="eb-group">
                                        <label className="eb-label">Rent (₹/day)</label>
                                        <input className="eb-input" type="number" name="rentPrice" value={formData.rentPrice} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="eb-group">
                                    <label className="eb-label">Pick-up Location</label>
                                    <input className="eb-input" type="text" name="location" value={formData.location} onChange={handleChange} required />
                                </div>

                                <div className="eb-div" />
                                <p className="eb-sec">Visuals</p>

                                <div className="eb-upload">
                                    <label className="eb-upload-label" htmlFor="eb-file">
                                        <span className="eb-upload-icon">📷</span>
                                        <span className="eb-upload-text">{preview ? 'Replace current image' : 'Upload new photo'}</span>
                                        <span className="eb-upload-hint">Best quality: 3:4 aspect ratio</span>
                                    </label>
                                    <input id="eb-file" className="eb-file" type="file" accept="image/*" onChange={handleImage} />
                                    {preview && <img src={preview} alt="preview" className="eb-preview" />}
                                </div>

                                <div className="eb-actions">
                                    <button type="button" className="eb-cancel" onClick={() => navigate('/my-books')}>Cancel</button>
                                    <button type="submit" className="eb-save" disabled={saving}>
                                        {saving ? 'Updating…' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditBook;