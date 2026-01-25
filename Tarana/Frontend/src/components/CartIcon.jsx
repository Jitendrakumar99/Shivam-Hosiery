import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useState, useEffect } from 'react';

const CartIcon = () => {
  const { items } = useAppSelector((state) => state.cart);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);
  // const itemCount = items.length; // Count unique products, not total quantity

  return (
    <Link
      to="/cart"
      id="header-cart-icon"
      className={`relative flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-300 ${isBouncing ? 'animate-cart-bounce shadow-[0_0_15px_rgba(255,255,255,0.4)]' : ''
        }`}
      // id="cart-icon-header"
      // className="relative flex items-center justify-center w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full transition"
      aria-label="Shopping cart"
    >
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;

