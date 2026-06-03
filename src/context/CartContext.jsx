/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'booknest_cart';

const normalizeBook = (book) => ({
    id: book.id,
    title: book.title,
    author: book.author,
    type: book.type,
    price: Number((book.type === 'RENT' && book.rentPrice != null ? book.rentPrice : book.price) || 0),
    imageUrl: book.imageUrl,
    quantityAvailable: Math.max(1, Number(book.quantity || 1)),
    sellerEmail: book.seller?.email,
});

const clampQuantity = (quantity, max) => {
    const safeMax = Math.max(1, Number(max || 1));
    const safeQuantity = Math.max(1, Number(quantity || 1));
    return Math.min(safeQuantity, safeMax);
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (book, quantity = 1) => {
        const cartBook = normalizeBook(book);
        setItems((current) => {
            const existing = current.find((item) => String(item.id) === String(cartBook.id));
            if (!existing) {
                return [...current, { ...cartBook, quantity: clampQuantity(quantity, cartBook.quantityAvailable) }];
            }

            return current.map((item) => (
                String(item.id) === String(cartBook.id)
                    ? {
                        ...item,
                        ...cartBook,
                        quantity: clampQuantity(Number(item.quantity || 1) + Number(quantity || 1), cartBook.quantityAvailable),
                    }
                    : item
            ));
        });
    };

    const updateQuantity = (bookId, quantity) => {
        setItems((current) => current.map((item) => (
            String(item.id) === String(bookId)
                ? { ...item, quantity: clampQuantity(quantity, item.quantityAvailable) }
                : item
        )));
    };

    const removeFromCart = (bookId) => {
        setItems((current) => current.filter((item) => String(item.id) !== String(bookId)));
    };

    const clearCart = () => setItems([]);

    const totalItems = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        [items]
    );

    const totalAmount = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
        [items]
    );

    const value = {
        items,
        totalItems,
        totalAmount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used inside CartProvider');
    return context;
};
