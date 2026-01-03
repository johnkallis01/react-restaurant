import { createPortal } from 'react-dom';
import {useDispatch, useSelector } from 'react-redux';
import { forwardRef } from 'react';
import '../../assets/components/ui/cart.css';
import useClickOutside from '../../hooks/useClickOutside';
import {closeCart, clearCart} from '../../store/cartSlice';
import usePriceFormatter from '../../hooks/usePriceFormatter.js';

const Cart = forwardRef(function Cart() {
  const {formatPrice} = usePriceFormatter();
  // const isCartOpen = useSelector(state => state.cart.isCartOpen);
  const cart = useSelector((state)=>state.cart)
  // if (!isCartOpen) return null;
  const dispatch=useDispatch();
  const cartRef=useClickOutside(()=>dispatch(closeCart()));
  return createPortal(
    <div className="cart" ref={cartRef}>
      <div className="cart-head">
        <h6>Name's Cart</h6>
        <h6>Total: {formatPrice(String(cart.total))}</h6>
      </div>
      <ul className='cart-body'>
        {cart.items.map((item, index)=>(
          <>
            <li key={index}>
              <div>{item.name}</div>
              <span className="dotted-line"></span>
              <div>{formatPrice(item.price)}</div>
            </li>
            
            <ul className="cart-item-notes">
              {item.comments && <div>
                  <span>Comments:</span>
                  {item.comments}
              </div>}
              {item.options?.choices.map((choice,index)=>(
                <li key={index}>
                  {choice.option_name + ": "}
                  {choice.name}
                </li>))}
            </ul>
            <ul className="cart-item-notes">
              {item.addOns.choices.map((choice, index)=>(
                <li key={index}>
                  {choice.name}
                </li>
              ))}
            </ul>
          </>
        ))}
      </ul>
      <div className="cart-foot">
        <ul className='cart-foot-summary'>
          <li>
            <div>subTotal:</div>
            <span className='dotted-line'></span>
            <div>{formatPrice(String(cart.subTotal))}</div>
          </li>
          <li>
            <div>tax:</div>
            <span className='dotted-line'></span>
            <div>{formatPrice(String(Math.round(cart.tax*100)/100))}</div>
          </li>

          <li>
            <div>Total:</div>
            <span className='dotted-line'></span>
            <div>{formatPrice(String(cart.total))}</div>
          </li>
        </ul>
        <div className='cart-foot-actions'>
          <button onClick={()=>dispatch(clearCart())}>Empty Cart</button>
          <button>Checkout</button>
        </div>
        
      </div>
    </div>,
    document.getElementById('main')
  );
})


export default Cart;
