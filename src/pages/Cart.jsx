import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`;

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { items, totalItems, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Fraunces:ital,wght@0,600;1,400&display=swap');

                .cart-page{min-height:100vh;background:#000;color:#fff;font-family:'Inter',sans-serif;padding:104px 24px 80px;}
                .cart-wrap{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:28px;align-items:start;}
                .cart-head{max-width:1100px;margin:0 auto 28px;display:flex;justify-content:space-between;gap:16px;align-items:end;}
                .cart-title{font-family:'Fraunces',serif;font-size:clamp(30px,5vw,46px);font-weight:600;line-height:1;}
                .cart-title span{color:#d4af37;font-style:italic;font-weight:400;}
                .cart-sub{margin-top:10px;color:rgba(255,255,255,.45);font-size:14px;}
                .cart-link{border:1px solid rgba(212,175,55,.24);background:transparent;color:#d4af37;border-radius:8px;padding:11px 16px;font-weight:700;cursor:pointer;}
                .cart-list{display:flex;flex-direction:column;gap:14px;}
                .cart-item{display:grid;grid-template-columns:84px minmax(0,1fr) auto;gap:18px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px;padding:16px;}
                .cart-img{width:84px;height:112px;border-radius:6px;background:#111;overflow:hidden;border:1px solid #222;display:flex;align-items:center;justify-content:center;color:#333;font-size:34px;}
                .cart-img img{width:100%;height:100%;object-fit:cover;}
                .cart-name{font-family:'Fraunces',serif;font-size:20px;color:#fff;margin-bottom:5px;}
                .cart-author{font-size:13px;color:rgba(255,255,255,.45);margin-bottom:12px;}
                .cart-meta{display:flex;gap:8px;flex-wrap:wrap;}
                .cart-pill{border:1px solid rgba(212,175,55,.18);color:#d4af37;border-radius:999px;padding:4px 10px;font-size:11px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;}
                .cart-controls{display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;gap:16px;}
                .cart-price{font-size:18px;font-weight:800;color:#d4af37;white-space:nowrap;}
                .cart-stepper{display:grid;grid-template-columns:34px 44px 34px;border:1px solid rgba(255,255,255,.12);border-radius:8px;overflow:hidden;height:36px;}
                .cart-stepper button{background:#111;border:0;color:#fff;font-size:18px;cursor:pointer;}
                .cart-stepper button:disabled{opacity:.35;cursor:not-allowed;}
                .cart-stepper span{display:flex;align-items:center;justify-content:center;background:#050505;color:#fff;font-weight:700;font-size:13px;}
                .cart-remove{background:transparent;border:0;color:rgba(255,107,97,.86);font-size:13px;font-weight:700;cursor:pointer;padding:0;}
                .cart-summary{position:sticky;top:88px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px;padding:22px;}
                .cart-summary h2{font-family:'Fraunces',serif;font-size:24px;margin-bottom:18px;}
                .cart-row{display:flex;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,.06);font-size:14px;color:rgba(255,255,255,.62);}
                .cart-row strong{color:#fff;}
                .cart-total{font-size:18px;color:#fff;}
                .cart-total strong{color:#d4af37;font-size:22px;}
                .cart-pay{width:100%;margin-top:20px;border:0;background:#d4af37;color:#000;border-radius:8px;padding:14px;font-size:14px;font-weight:900;cursor:pointer;}
                .cart-pay:hover{background:#f1c40f;}
                .cart-clear{width:100%;margin-top:10px;border:1px solid rgba(255,255,255,.12);background:transparent;color:rgba(255,255,255,.58);border-radius:8px;padding:12px;font-weight:700;cursor:pointer;}
                .cart-empty{max-width:620px;margin:70px auto 0;text-align:center;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:12px;padding:42px 24px;}
                .cart-empty h2{font-family:'Fraunces',serif;font-size:30px;margin-bottom:10px;}
                .cart-empty p{color:rgba(255,255,255,.48);line-height:1.7;margin-bottom:24px;}

                @media(max-width:860px){.cart-wrap{grid-template-columns:1fr}.cart-summary{position:static}.cart-head{align-items:flex-start;flex-direction:column}.cart-item{grid-template-columns:72px minmax(0,1fr)}.cart-img{width:72px;height:96px}.cart-controls{grid-column:1/-1;flex-direction:row;align-items:center}.cart-price{white-space:normal}}
            `}</style>

            <div className="cart-page">
                <div className="cart-head">
                    <div>
                        <h1 className="cart-title">Shopping <span>Cart</span></h1>
                        <p className="cart-sub">{totalItems} item{totalItems === 1 ? '' : 's'} ready for checkout.</p>
                    </div>
                    <button className="cart-link" onClick={() => navigate('/books')}>Continue browsing</button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <h2>Your cart is empty.</h2>
                        <p>Add books from the library, choose how many copies you want, and checkout with one payment.</p>
                        <button className="cart-pay" onClick={() => navigate('/books')}>Browse books</button>
                    </div>
                ) : (
                    <div className="cart-wrap">
                        <div className="cart-list">
                            {items.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    <div className="cart-img">
                                        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} /> : 'Book'}
                                    </div>
                                    <div>
                                        <div className="cart-name">{item.title}</div>
                                        <div className="cart-author">by {item.author}</div>
                                        <div className="cart-meta">
                                            <span className="cart-pill">{item.type === 'SELL' ? 'Buy' : item.type}</span>
                                            <span className="cart-pill">{item.quantityAvailable} available</span>
                                        </div>
                                    </div>
                                    <div className="cart-controls">
                                        <div className="cart-price">{formatPrice(item.price * item.quantity)}</div>
                                        <div className="cart-stepper" aria-label={`Quantity for ${item.title}`}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.quantityAvailable}>+</button>
                                        </div>
                                        <button className="cart-remove" onClick={() => removeFromCart(item.id)}>Remove</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="cart-summary">
                            <h2>Summary</h2>
                            <div className="cart-row"><span>Items</span><strong>{totalItems}</strong></div>
                            <div className="cart-row"><span>Delivery</span><strong>Free</strong></div>
                            <div className="cart-row cart-total"><span>Total</span><strong>{formatPrice(totalAmount)}</strong></div>
                            <button className="cart-pay" onClick={handleCheckout}>Checkout and pay</button>
                            <button className="cart-clear" onClick={clearCart}>Clear cart</button>
                        </aside>
                    </div>
                )}
            </div>
        </>
    );
};

export default Cart;
