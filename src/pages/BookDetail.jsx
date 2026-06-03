import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookById, deleteBook } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Reviews from '../components/Reviews';

const typeColor = { SELL: '#d4af37', RENT: '#4a7fa5', EXCHANGE: '#7a68a8' };

const BookDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user }  = useAuth();
    const { addToCart } = useCart();

    const [book,    setBook]    = useState(null);
    const [loading, setLoading] = useState(true);
    const [error,   setError]   = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => { fetchBook(); }, [id]);

    const fetchBook = async () => {
        try { const res = await getBookById(id); setBook(res.data); }
        catch { setError('Book not found.'); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this book?')) return;
        try { await deleteBook(id); navigate('/books'); }
        catch (err) { setError(err.response?.data || 'Something went wrong.'); }
    };

    const handleAddToCart = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        addToCart(book, quantity);
        navigate('/cart');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Fraunces:ital,wght@0,600;1,400&display=swap');
                
                .bd {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    padding: 100px 32px 80px;
                }
                .bd-wrap { max-width: 960px; margin: 0 auto; }

                /* Back link */
                .bd-back {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    background: none;
                    border: none;
                    font-family: 'Inter', sans-serif;
                    font-size: 13px;
                    color: #888;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 28px;
                    transition: color 0.2s;
                }
                .bd-back:hover { color: #d4af37; }

                /* States */
                .bd-loading { text-align: center; padding: 80px 0; color: #d4af37; }
                .bd-dot {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #d4af37;
                    margin: 0 3px;
                    animation: bdB 1.2s ease-in-out infinite;
                }
                .bd-dot:nth-child(2) { animation-delay: 0.15s; }
                .bd-dot:nth-child(3) { animation-delay: 0.3s; }
                @keyframes bdB { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
                
                .bd-err {
                    padding: 14px 18px;
                    border: 1px solid #ff453a;
                    border-radius: 4px;
                    background: rgba(255, 69, 58, 0.1);
                    color: #ff453a;
                    font-size: 13px;
                }

                /* Main card */
                .bd-card {
                    display: grid;
                    grid-template-columns: 320px 1fr;
                    gap: 0;
                    border: 1px solid #1a1a1a;
                    background: #0a0a0a;
                    border-radius: 12px;
                    overflow: hidden;
                }

                /* Image panel */
                .bd-img-panel { border-right: 1px solid #1a1a1a; position: relative; background: #111; }
                .bd-img { width: 100%; aspect-ratio: 3/4; overflow: hidden; }
                .bd-img img { width: 100%; height: 100%; object-fit: cover; }
                .bd-noimg {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 60px;
                    color: #222;
                }
                .bd-type-badge {
                    position: absolute;
                    top: 14px;
                    left: 14px;
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                    color: #000;
                }

                /* Info panel */
                .bd-info { padding: 32px 40px; display: flex; flex-direction: column; }
                .bd-book-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(24px, 4vw, 36px);
                    font-weight: 600;
                    color: #ffffff;
                    line-height: 1.1;
                    margin-bottom: 8px;
                }
                .bd-author { font-size: 16px; color: #888; margin-bottom: 24px; }

                /* Meta rows */
                .bd-meta {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 24px;
                    border: 1px solid #1a1a1a;
                    border-radius: 8px;
                    background: #111;
                }
                .bd-row {
                    display: flex;
                    justify-content: space-between;
                    padding: 12px 16px;
                    border-bottom: 1px solid #1a1a1a;
                }
                .bd-row:last-child { border-bottom: none; }
                .bd-row-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 1px; }
                .bd-row-value { font-size: 14px; color: #ddd; }
                .bd-price { font-family: 'Fraunces', serif; font-size: 22px; color: #d4af37; }
                .bd-price-exchange { color: #7a68a8; font-weight: 500; }

                /* Description */
                .bd-section-label {
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    color: #d4af37;
                    margin-bottom: 8px;
                    opacity: 0.8;
                }
                .bd-desc {
                    font-size: 15px;
                    color: #bbb;
                    line-height: 1.6;
                    margin-bottom: 24px;
                }

                /* Seller */
                .bd-seller {
                    padding: 16px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid #1a1a1a;
                    border-radius: 8px;
                    margin-bottom: 32px;
                }
                .bd-seller-name { font-size: 15px; font-weight: 500; color: #fff; margin-bottom: 4px; }
                .bd-seller-email { font-size: 13px; color: #666; }

                /* Actions */
                .bd-actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: auto; }
                .bd-cart-box {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                    width: 100%;
                    flex-wrap: wrap;
                }
                .bd-qty {
                    display: grid;
                    grid-template-columns: 36px 46px 36px;
                    height: 38px;
                    overflow: hidden;
                    border: 1px solid #262626;
                    border-radius: 8px;
                    background: #050505;
                }
                .bd-qty button {
                    border: 0;
                    background: #111;
                    color: #fff;
                    font-size: 18px;
                    cursor: pointer;
                }
                .bd-qty button:disabled { opacity: .35; cursor: not-allowed; }
                .bd-qty span {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #fff;
                    font-size: 13px;
                    font-weight: 700;
                }
                .bd-stock {
                    color: rgba(255,255,255,.45);
                    font-size: 12px;
                }
                .bd-btn-primary {
                    padding: 12px 28px;
                    background: #d4af37;
                    color: #000;
                    border: none;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .bd-btn-primary:hover { background: #f1c40f; transform: translateY(-2px); }
                
                .bd-btn-edit, .bd-btn-del {
                    padding: 12px 24px;
                    background: transparent;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: 0.2s;
                }
                .bd-btn-edit { border: 1px solid #333; color: #fff; }
                .bd-btn-edit:hover { border-color: #d4af37; color: #d4af37; }
                
                .bd-btn-del { border: 1px solid rgba(255, 69, 58, 0.3); color: #ff453a; }
                .bd-btn-del:hover { background: rgba(255, 69, 58, 0.1); border-color: #ff453a; }

                /* Reviews section */
                .bd-reviews {
                    margin-top: 24px;
                    background: #0a0a0a;
                    border: 1px solid #1a1a1a;
                    border-radius: 12px;
                    padding: 32px;
                }
                .bd-reviews-title {
                    font-family: 'Fraunces', serif;
                    font-size: 22px;
                    color: #fff;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #1a1a1a;
                }
                .bd-reviews-title span { color: #d4af37; font-style: italic; }

                @media(max-width:768px){
                    .bd { padding: 80px 16px 60px; }
                    .bd-card { grid-template-columns: 1fr; }
                    .bd-img-panel { border-right: none; border-bottom: 1px solid #1a1a1a; }
                    .bd-info { padding: 24px; }
                }
            `}</style>

            <div className="bd">
                <div className="bd-wrap">
                    <button className="bd-back" onClick={() => navigate('/books')}>← Back to gallery</button>

                    {loading ? (
                        <div className="bd-loading"><span className="bd-dot"/><span className="bd-dot"/><span className="bd-dot"/></div>
                    ) : error ? (
                        <div className="bd-err">{error}</div>
                    ) : book && (() => {
                        const isOwner = user?.email === book.seller?.email;
                        return (
                            <>
                                <div className="bd-card">
                                    <div className="bd-img-panel">
                                        <div className="bd-img">
                                            {book.imageUrl
                                                ? <img src={book.imageUrl} alt={book.title} />
                                                : <div className="bd-noimg">📚</div>
                                            }
                                        </div>
                                        <span className="bd-type-badge" style={{ background: typeColor[book.type] || '#d4af37' }}>
                                            {book.type}
                                        </span>
                                    </div>

                                    <div className="bd-info">
                                        <div className="bd-book-title">{book.title}</div>
                                        <div className="bd-author">by {book.author}</div>

                                        <div className="bd-meta">
                                            <div className="bd-row">
                                                <span className="bd-row-label">Genre</span>
                                                <span className="bd-row-value">{book.genre}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Condition</span>
                                                <span className="bd-row-value">{book.condition}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Location</span>
                                                <span className="bd-row-value">{book.location}</span>
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Price</span>
                                                {book.type === 'EXCHANGE'
                                                    ? <span className="bd-price-exchange">Free Exchange</span>
                                                    : <span className="bd-price">₹{book.price}</span>
                                                }
                                            </div>
                                            <div className="bd-row">
                                                <span className="bd-row-label">Available</span>
                                                <span className="bd-row-value">{book.quantity || 1}</span>
                                            </div>
                                            {book.rentPrice && (
                                                <div className="bd-row">
                                                    <span className="bd-row-label">Rent Price</span>
                                                    <span className="bd-row-value">₹{book.rentPrice}/day</span>
                                                </div>
                                            )}
                                        </div>

                                        {book.description && <>
                                            <div className="bd-section-label">Description</div>
                                            <p className="bd-desc">{book.description}</p>
                                        </>}

                                        <div className="bd-section-label">Seller</div>
                                        <div className="bd-seller">
                                            <div className="bd-seller-name">👤 {book.seller?.name}</div>
                                            <div className="bd-seller-email">{book.seller?.email}</div>
                                        </div>

                                        <div className="bd-actions">
                                            {!isOwner && (
                                                book.type === 'EXCHANGE'
                                                    ? <button className="bd-btn-primary" onClick={() => navigate(`/exchange/${book.id}`)}>Request Exchange</button>
                                                    : <>
                                                        <div className="bd-cart-box">
                                                            <div className="bd-qty" aria-label="Quantity">
                                                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>-</button>
                                                                <span>{quantity}</span>
                                                                <button onClick={() => setQuantity(q => Math.min(Number(book.quantity || 1), q + 1))} disabled={quantity >= Number(book.quantity || 1)}>+</button>
                                                            </div>
                                                            <span className="bd-stock">Choose copies before checkout</span>
                                                        </div>
                                                        <button className="bd-btn-primary" onClick={handleAddToCart}>
                                                            Add to Cart
                                                        </button>
                                                        <button className="bd-btn-edit" onClick={() => navigate(`/checkout/${book.id}?qty=${quantity}`)}>
                                                            Buy Now
                                                        </button>
                                                      </>
                                            )}
                                            {isOwner && <>
                                                <button className="bd-btn-edit" onClick={() => navigate(`/edit-book/${book.id}`)}>✏️ Edit</button>
                                                <button className="bd-btn-del"  onClick={handleDelete}>🗑️ Delete</button>
                                            </>}
                                        </div>
                                    </div>
                                </div>

                                <div className="bd-reviews">
                                    <div className="bd-reviews-title">Reviews & <span>Ratings</span></div>
                                    <Reviews bookId={book.id} sellerId={book.seller?.email} />
                                </div>
                            </>
                        );
                    })()}
                </div>
            </div>
        </>
    );
}; 

export default BookDetail;
