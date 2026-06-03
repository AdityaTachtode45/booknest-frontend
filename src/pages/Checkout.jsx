import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { createDelivery, createPaymentOrder, getBookById, placeOrder, updateOrderStatus, verifyPayment } from '../services/api';
import { useCart } from '../context/CartContext';

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const Checkout = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { items: cartItems, clearCart } = useCart();

    const [directItem, setDirectItem] = useState(null);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(Boolean(id));
    const [placing, setPlacing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return;

        const fetchBook = async () => {
            setLoading(true);
            try {
                const res = await getBookById(id);
                const qty = Math.min(
                    Math.max(1, Number(searchParams.get('qty') || 1)),
                    Math.max(1, Number(res.data.quantity || 1))
                );
                setDirectItem({
                    id: res.data.id,
                    title: res.data.title,
                    author: res.data.author,
                    type: res.data.type,
                    price: Number((res.data.type === 'RENT' && res.data.rentPrice != null ? res.data.rentPrice : res.data.price) || 0),
                    imageUrl: res.data.imageUrl,
                    quantity: qty,
                    quantityAvailable: Math.max(1, Number(res.data.quantity || 1)),
                });
            } catch {
                setError('Book not found.');
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, searchParams]);

    const checkoutItems = useMemo(() => {
        if (id) return directItem ? [directItem] : [];
        return cartItems;
    }, [cartItems, directItem, id]);

    const totalItems = useMemo(
        () => checkoutItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        [checkoutItems]
    );

    const totalAmount = useMemo(
        () => checkoutItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
        [checkoutItems]
    );

    const loadRazorpay = () => new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

    const createBackendOrders = async () => {
        const createdOrders = [];

        for (const item of checkoutItems) {
            const orderRes = await placeOrder(item.id, item.type, address, item.quantity);
            createdOrders.push(orderRes.data);
            await updateOrderStatus(orderRes.data.id, 'CONFIRMED');
            await createDelivery(orderRes.data.id);
        }

        return createdOrders;
    };

    const handlePayment = async () => {
        if (checkoutItems.length === 0) {
            setError('Your cart is empty.');
            return;
        }
        if (!address.trim()) {
            setError('Please enter your delivery address.');
            return;
        }
        if (totalAmount <= 0) {
            setError('Payment amount is invalid.');
            return;
        }

        setPlacing(true);
        setError('');

        try {
            const loaded = await loadRazorpay();
            if (!loaded) throw new Error('Razorpay failed to load.');

            const orderRes = await createPaymentOrder(totalAmount);
            const { orderId, amount, keyId } = orderRes.data;

            const options = {
                key: keyId,
                amount: Number(amount) * 100,
                currency: 'INR',
                name: 'BookNest',
                description: `${totalItems} item${totalItems === 1 ? '' : 's'} from BookNest`,
                order_id: orderId,
                handler: async (response) => {
                    setPlacing(true);
                    setError('');
                    try {
                        await verifyPayment(response.razorpay_order_id, response.razorpay_payment_id, response.razorpay_signature);
                        await createBackendOrders();
                        if (!id) clearCart();
                        navigate('/my-orders');
                    } catch (err) {
                        setError(err.response?.data || err.message || 'Payment completed, but order creation failed. Please contact support.');
                    } finally {
                        setPlacing(false);
                    }
                },
                modal: {
                    ondismiss: () => setPlacing(false),
                },
                prefill: { name: 'BookNest User' },
                theme: { color: '#d4af37' },
            };

            new window.Razorpay(options).open();
        } catch (err) {
            setError(err.response?.data || err.message || 'Something went wrong.');
            setPlacing(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,400&display=swap');

                .co{min-height:100vh;background:#000;color:#fff;font-family:'Inter',sans-serif;padding:104px 24px 80px;}
                .co-wrap{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:28px;align-items:start;}
                .co-head{max-width:1080px;margin:0 auto 28px;}
                .co-back{display:inline-flex;background:none;border:none;color:rgba(255,255,255,.52);cursor:pointer;padding:0;margin-bottom:20px;font-size:13px;}
                .co-back:hover{color:#d4af37;}
                .co-title{font-family:'Fraunces',serif;font-size:clamp(30px,5vw,46px);font-weight:600;line-height:1;}
                .co-title span{color:#d4af37;font-style:italic;font-weight:400;}
                .co-sub{margin-top:10px;color:rgba(255,255,255,.45);font-size:14px;}
                .co-panel,.co-summary{background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px;}
                .co-panel{padding:20px;}
                .co-items{display:flex;flex-direction:column;gap:12px;}
                .co-item{display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:14px;padding:14px;background:#050505;border:1px solid rgba(255,255,255,.06);border-radius:8px;}
                .co-img{width:70px;height:94px;border-radius:6px;background:#111;overflow:hidden;border:1px solid #222;display:flex;align-items:center;justify-content:center;color:#333;font-size:12px;}
                .co-img img{width:100%;height:100%;object-fit:cover;}
                .co-name{font-family:'Fraunces',serif;font-size:18px;color:#fff;margin-bottom:4px;}
                .co-author{font-size:13px;color:rgba(255,255,255,.45);margin-bottom:10px;}
                .co-pill{display:inline-flex;border:1px solid rgba(212,175,55,.18);border-radius:999px;color:#d4af37;padding:4px 10px;font-size:11px;font-weight:800;text-transform:uppercase;}
                .co-line{text-align:right;color:#d4af37;font-weight:800;white-space:nowrap;}
                .co-line span{display:block;margin-top:8px;color:rgba(255,255,255,.42);font-size:12px;font-weight:600;}
                .co-address{margin-top:18px;}
                .co-label{font-size:11px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;color:rgba(212,175,55,.68);margin-bottom:10px;}
                .co-textarea{width:100%;min-height:112px;background:#050505;border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#fff;padding:13px 14px;outline:none;resize:vertical;font-family:'Inter',sans-serif;font-size:14px;line-height:1.6;}
                .co-textarea:focus{border-color:rgba(212,175,55,.44);}
                .co-err{max-width:1080px;margin:0 auto 18px;padding:13px 16px;border:1px solid rgba(255,69,58,.28);border-radius:8px;background:rgba(255,69,58,.08);color:#ff6b61;font-size:13px;}
                .co-loading,.co-empty{text-align:center;padding:90px 0;color:#d4af37;}
                .co-summary{position:sticky;top:88px;padding:22px;}
                .co-summary h2{font-family:'Fraunces',serif;font-size:24px;margin-bottom:18px;}
                .co-row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px;color:rgba(255,255,255,.62);}
                .co-row strong{color:#fff;}
                .co-total{font-size:18px;color:#fff;}
                .co-total strong{color:#d4af37;font-size:22px;}
                .co-pay{width:100%;margin-top:20px;border:0;background:#d4af37;color:#000;border-radius:8px;padding:14px;font-size:14px;font-weight:900;cursor:pointer;}
                .co-pay:hover:not(:disabled){background:#f1c40f;}
                .co-pay:disabled{opacity:.55;cursor:not-allowed;}
                .co-secondary{width:100%;margin-top:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.62);border-radius:8px;padding:12px;font-weight:800;cursor:pointer;}

                @media(max-width:860px){.co-wrap{grid-template-columns:1fr}.co-summary{position:static}.co-item{grid-template-columns:60px minmax(0,1fr)}.co-img{width:60px;height:82px}.co-line{grid-column:1/-1;text-align:left;white-space:normal}}
            `}</style>

            <div className="co">
                <div className="co-head">
                    <button className="co-back" onClick={() => navigate(id ? `/books/${id}` : '/cart')}>Back</button>
                    <h1 className="co-title">Confirm <span>Checkout</span></h1>
                    <p className="co-sub">Review your books, add delivery address, then complete payment.</p>
                </div>

                {error && <div className="co-err">{error}</div>}

                {loading ? (
                    <div className="co-loading">Loading checkout...</div>
                ) : checkoutItems.length === 0 ? (
                    <div className="co-empty">
                        <p>No books are ready for checkout.</p>
                        <button className="co-pay" style={{ maxWidth: 220 }} onClick={() => navigate('/books')}>Browse books</button>
                    </div>
                ) : (
                    <div className="co-wrap">
                        <section className="co-panel">
                            <div className="co-items">
                                {checkoutItems.map((item) => (
                                    <div className="co-item" key={item.id}>
                                        <div className="co-img">
                                            {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : 'Book'}
                                        </div>
                                        <div>
                                            <div className="co-name">{item.title}</div>
                                            <div className="co-author">by {item.author}</div>
                                            <span className="co-pill">{item.type === 'SELL' ? 'Buy' : item.type}</span>
                                        </div>
                                        <div className="co-line">
                                            {formatPrice(item.price * item.quantity)}
                                            <span>{item.quantity} x {formatPrice(item.price)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="co-address">
                                <div className="co-label">Delivery Address</div>
                                <textarea
                                    className="co-textarea"
                                    placeholder="Enter your complete delivery address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>
                        </section>

                        <aside className="co-summary">
                            <h2>Payment</h2>
                            <div className="co-row"><span>Items</span><strong>{totalItems}</strong></div>
                            <div className="co-row"><span>Delivery</span><strong>Free</strong></div>
                            <div className="co-row co-total"><span>Total</span><strong>{formatPrice(totalAmount)}</strong></div>
                            <button className="co-pay" onClick={handlePayment} disabled={placing}>
                                {placing ? 'Processing...' : `Pay ${formatPrice(totalAmount)}`}
                            </button>
                            <button className="co-secondary" onClick={() => navigate(id ? `/books/${id}` : '/cart')}>
                                Edit order
                            </button>
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
};

export default Checkout;
