import { createPortal } from 'react-dom';
import {useDispatch, useSelector } from 'react-redux';
import { forwardRef } from 'react';
import '../../assets/components/ui/cart.css';
import useClickOutside from '../../hooks/useClickOutside';
import {closeCart, clearCart} from '../../store/cartSlice';
import usePriceFormatter from '../../hooks/usePriceFormatter.js';
const {formatPrice} = usePriceFormatter();
const Cart = forwardRef(function Cart() {
  // const isCartOpen = useSelector(state => state.cart.isCartOpen);
  const cart = useSelector((state)=>state.cart)
  // if (!isCartOpen) return null;
  const dispatch=useDispatch();
  const cartRef=useClickOutside(()=>dispatch(closeCart()));
  return createPortal(
    <div className="cart" ref={cartRef}>
      <div className="cart-head">
        <h6>Name's Cart</h6>
        <h6>Price: {formatPrice(String(cart.total))}</h6>
      </div>
      <ul className='cart-body'>
        {cart.items.map((item, index)=>(
          <li key={index}>
            <div>{item.name}</div>
            <span className="dotted-line"></span>
            <div>{formatPrice(item.price)}</div>
          </li>
        ))}
        
      </ul>
      <div className="cart-foot">
        <button onClick={()=>dispatch(clearCart())}>Empty Cart</button>
        <button>Checkout</button>
      </div>
    </div>,
    document.getElementById('main')
  );
})


export default Cart;
