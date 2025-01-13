import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CartReducerInitialState } from '../types/reducer-types';
import { server } from '../redux/store';
import axios from 'axios';
import toast from 'react-hot-toast';
import { saveShippingInfo } from '../redux/reducer/cartReducer';



const Shipping = () => {

    const { cartItems, total } = 
        useSelector(
          (state : { cartReducer: CartReducerInitialState}) => state.cartReducer
        );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [shippingInfo, setShippingInfo] = useState({
        address:"",
        city:"",
        state:"",
        country:"",
        pinCode:""
    });

    const changeHandler = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = event.target as HTMLInputElement; // Assumes it's an input
        console.log(target.value);

        setShippingInfo((prev) => ({...prev, [event.target.name]: event.target.value}));
      };


    const submitHandler = async(e:FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      dispatch(saveShippingInfo(shippingInfo));


      // try {
      //   const {data} = await axios.post(`${server}/api/v1/payment/create`, {
      //     amount : total,
      //   }, {
      //     headers:{
      //       "Content-Type" : "application/json",
      //     },
      //   }
      // );
      // navigate("/pay", {
      //   state : data.clientSecret,
      // });
      // } catch (error){
      //   console.log(error);
      //   toast.error("Something Went Wrong");
      // } 

      try {
        const { data } = await axios.post(
          `${server}/api/v1/payment/create`,
          {
            amount: total,
            // customerName: "John Doe", // Replace with user data
            // customerEmail: "john.doe@example.com", // Replace with user data
            // // customerPhone: "9999999999", // Replace with user data
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        window.location.href = data.paymentLink; // Redirect to Cashfree payment page
      } catch (error) {
        console.error(error);
        toast.error("Something Went Wrong");
      }
    };

   
    useEffect(() => {
      if(cartItems.length <= 0) return navigate("/cart");
    }, [cartItems]);

  return (
  <div className="container">
    <h1>Shipping Details</h1>
    <hr/>
    <div className="shipping">
      <button className="back-btn" onClick={() => navigate("/cart")}>
        <BiArrowBack />
      </button>

      <form onSubmit={submitHandler}>

        <h1>Shipping Address</h1>
        {/* Address Input */}
        <input type="text" 
        required
        placeholder='Address' 
        name='address' 
        value={shippingInfo.address}
        onChange={changeHandler}
        />

        {/* City Input */}
        <input type="text" 
        required
        placeholder='City'
        name='city'
        value={shippingInfo.city}
        onChange={changeHandler}
        />

        {/* state event handler as follows */}
        <input type="text" 
        required
        placeholder='State'
        name='state'
        value={shippingInfo.state}
        onChange={changeHandler}
        />

        {/* country event handler  */}
        <select 
        name="country" 
        required 
        value={shippingInfo.country}
        onChange={changeHandler}
>
            <option value=""> Choose Country</option>
            <option value="india">India</option>
            <option value="us">US</option>
        </select>

        {/* pincode input */}
        <input type="number" 
        required
        placeholder='Pin Code'
        name='pinCode'
        value={shippingInfo.pinCode}
        onChange={changeHandler}
        />

        <button type='submit'>
            Pay Now
        </button>

      </form>
    </div>
    </div>
  )
}

export default Shipping
