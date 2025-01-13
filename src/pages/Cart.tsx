/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { addToCart, calculatePrice, discontApplied, removeCartItem } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";

const cart = () => {

  const {cartItems, subtotal, tax, total, shippingCharges, discount} = useSelector(
    (state : { cartReducer : CartReducerInitialState }) => state.
    cartReducer
  );
  
  const dispatch = useDispatch();
  // navigation
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const[couponCode, setCouponCode] = useState<string>("");
  const[isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler = (cartItem: CartItem) => {
    if(cartItem.quantity >= cartItem.stock) return toast.error("Product Out of Stock");
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity + 1}));
  };

  const decrementHandler = (cartItem: CartItem) => {
    if(cartItem.quantity <= 1) return;
    dispatch(addToCart({...cartItem, quantity:cartItem.quantity - 1}));
  };

  const removeHandler = (productId:string) => {
    dispatch(removeCartItem(productId));
  };

  useEffect(() => {

    const {token, cancel} = axios.CancelToken.source();


    const timeOutId = setTimeout(() => {

    axios.get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,{
      cancelToken: token,
    })
      .then((res) => {
        dispatch(discontApplied(res.data.discount));
        setIsValidCouponCode(true);
        dispatch(calculatePrice());
      })
      .catch(() => {
        dispatch(discontApplied(0));
        setIsValidCouponCode(false);
        dispatch(calculatePrice());
      });
    }, 1000)
    return () => {
        clearTimeout(timeOutId);
        cancel();
        setIsValidCouponCode(false);
    }
  }, [couponCode]);

  

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);


  return (
  
    <div className="cart">
      <button className="back-btn" onClick={() => navigate("/")}>
        <BiArrowBack />
      </button>
      <main>
      <h1>
        Shopping Cart
      </h1>  
      <hr/>
      {
        cartItems.length > 0 ? cartItems.map((i, idx) => (
          <CartItemCard 
            incrementHandler = {incrementHandler} 
            decrementHandler = {decrementHandler} 
            removeHandler = {removeHandler}
            key = {idx} 
            cartItems={i}
          />
        
        )) : <h2>No Items Added</h2>}
      </main>
      <aside>
        <p>Subtotal : ₹{subtotal}</p>
        <p>Shipping Charges : ₹{shippingCharges}</p>
        <p>Tax : ₹{tax}</p>
        <p>
          Discount : <em> - ₹{discount}</em>
        </p>
        <p>
          <b>Total : ₹{total}</b>
        </p>
        <input type="text" 
        placeholder="Coupon Code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        />

    {couponCode && 
      (isValidCouponCode ? 
        (
        <span className="green">
          ₹{discount} off using the 
        <code>
          {couponCode}
          </code>
        </span>
          ):
        ( 
        <span className = "red">
          Invalis Coupon <VscError/>
        </span>)
    )}


    {
      cartItems.length > 0 && <Link to="/shipping">Checkout</Link>
    }
    
   </aside>
 </div>
 
  )
}

export default cart
