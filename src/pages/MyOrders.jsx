import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../services/api';

const statusStyle = {
    PENDING:   { bg: 'rgba(212, 175, 55, 0.1)',  color: '#d4af37', border: 'rgba(212, 175, 55, 0.3)' },
    CONFIRMED: { bg: 'rgba(74, 127, 165, 0.1)',  color: '#4a7fa5', border: 'rgba(74, 127, 165, 0.3)' },
    SHIPPED:   { bg: 'rgba(122, 104, 168, 0.1)', color: '#7a68a8', border: 'rgba(122, 104, 168, 0.3)' },
    DELIVERED: { bg: 'rgba(80, 140, 80, 0.1)',   color: '#4a8c4a', border: 'rgba(80, 140, 80, 0.3)' },
    CANCELLED: { bg: 'rgba(255, 69, 58, 0.08)',  color: '#ff453a', border: 'rgba(255, 69, 58, 0.2)' },
};

const MyOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => { fetchOrders(); }, []);

    const fetchOrders = async () => {
        try { 
            const res = await getMyOrders(); 
            setOrders(res.data); 
        } catch { 
            setError('Failed to load orders.'); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this order?')) return;
        try { 
            await cancelOrder(id); 
            fetchOrders(); 
        } catch (err) { 
            setError(err.response?.data || 'Something went wrong.'); 
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Fraunces:ital,wght@0,600;1,400&display=swap');

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .mo {
                    min-height: 100vh;
                    background: #000000;
                    font-family: 'Inter', sans-serif;
                    color: #ffffff;
                    padding: 100px 32px 80px;
                }

                .mo-header {
                    max-width: 760px;
                    margin: 0 auto 36px;
                    animation: fadeInUp 0.6s ease;
                }

                .mo-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 600;
                }

                .mo-title span {
                    color: #d4af37;
                    font-style: italic;
                }

                .mo-list {
                    max-width: 760px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .mo-card {
                    background: #0a0a0a;
                    border: 1px solid #1a1a1a;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.4);
                    transition: all 0.3s ease;
                    animation: fadeInUp 0.6s ease backwards;
                }

                .mo-card:hover {
                    transform: translateY(-4px);
                    border-color: #d4af37;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.6);
                }

                .mo-book {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 20px;
                }

                .mo-img {
                    width: 70px;
                    height: 95px;
                    border-radius: 6px;
                    overflow: hidden;
                    background: #121212;
                    border: 1px solid #222;
                }

                .mo-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .mo-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .mo-book-title {
                    font-family: 'Fraunces', serif;
                    font-size: 18px;
                    font-weight: 600;
                    color: #fff;
                    margin-bottom: 4px;
                }

                .mo-book-author {
                    font-size: 13px;
                    color: #888;
                    margin-bottom: 8px;
                }

                .mo-amount {
                    font-size: 20px;
                    font-weight: 600;
                    color: #d4af37;
                }

                .mo-qty {
                    margin-top: 4px;
                    color: rgba(255,255,255,.45);
                    font-size: 12px;
                }

                .mo-details {
                    background: #050505;
                    border-radius: 8px;
                    padding: 16px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .mo-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .mo-row-label {
                    font-size: 12px;
                    color: #555;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .mo-row-value, .mo-row-id {
                    font-size: 13px;
                    color: #bbb;
                }

                .mo-status {
                    padding: 4px 12px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    border: 1px solid;
                }

                .mo-actions {
                    display: flex;
                    gap: 12px;
                }

                .mo-btn {
                    flex: 1;
                    padding: 12px;
                    border-radius: 6px;
                    font-weight: 600;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .mo-cancel {
                    background: transparent;
                    color: #ff453a;
                    border: 1px solid rgba(255, 69, 58, 0.3);
                }

                .mo-cancel:hover {
                    background: #ff453a;
                    color: #fff;
                }

                .mo-track {
                    background: #d4af37;
                    color: #000;
                    border: none;
                }

                .mo-track:hover {
                    background: #f1c40f;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
                }

                .mo-loading, .mo-empty {
                    text-align: center;
                    padding-top: 100px;
                    color: #d4af37;
                }

                .mo-browse {
                    margin-top: 20px;
                    padding: 12px 24px;
                    background: transparent;
                    border: 1px solid #d4af37;
                    color: #d4af37;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: 0.3s;
                }

                .mo-browse:hover {
                    background: #d4af37;
                    color: #000;
                }

                @media(max-width:540px){
                    .mo{padding: 80px 16px;}
                    .mo-actions{flex-direction: column;}
                }
            `}</style>

            <div className="mo">
                <div className="mo-header">
                    <h1 className="mo-title">My <span>Orders</span></h1>
                </div>

                {error && <div style={{color: '#ff453a', textAlign: 'center', marginBottom: '20px'}}>{error}</div>}

                {loading ? (
                    <div className="mo-loading">Syncing your orders...</div>
                ) : orders.length === 0 ? (
                    <div className="mo-empty">
                        <p>No active orders found.</p>
                        <button className="mo-browse" onClick={() => navigate('/books')}>Start Reading</button>
                    </div>
                ) : (
                    <div className="mo-list">
                        {orders.map((order, index) => {
                            const s = statusStyle[order.status] || statusStyle.PENDING;
                            return (
                                <div 
                                    key={order.id} 
                                    className="mo-card"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="mo-book">
                                        <div className="mo-img">
                                            {order.book?.imageUrl
                                                ? <img src={order.book.imageUrl} alt={order.book.title} />
                                                : <div style={{textAlign:'center', fontSize:'30px', marginTop:'25px'}}>📚</div>
                                            }
                                        </div>
                                        <div className="mo-info">
                                            <div className="mo-book-title">{order.book?.title}</div>
                                            <div className="mo-book-author">by {order.book?.author}</div>
                                            <div className="mo-amount">₹{order.amount}</div>
                                            {order.quantity > 1 && <div className="mo-qty">Quantity: {order.quantity}</div>}
                                        </div>
                                    </div>

                                    <div className="mo-details">
                                        <div className="mo-row">
                                            <span className="mo-row-label">Order ID</span>
                                            <span className="mo-row-id">#{order.id.toString().slice(-8)}</span>
                                        </div>
                                        <div className="mo-row">
                                            <span className="mo-row-label">Shipping to</span>
                                            <span className="mo-row-value">{order.address}</span>
                                        </div>
                                        <div className="mo-row">
                                            <span className="mo-row-label">Status</span>
                                            <span className="mo-status" style={{ background: s.bg, color: s.color, borderColor: s.border }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mo-actions">
                                        {order.status === 'PENDING' && (
                                            <button className="mo-btn mo-cancel" onClick={() => handleCancel(order.id)}>Cancel Order</button>
                                        )}
                                        <button className="mo-btn mo-track" onClick={() => navigate(`/track/${order.id}`)}>📍 Track Details</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyOrders;
