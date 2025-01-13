/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { Skeleton } from "../../../components/loader";
import { useDeleteOrderMutation, useOrderDetailsQuery, useUpdateOrderMutation } from "../../../redux/api/orderAPI";
import { RootState, server } from "../../../redux/store";
import { Order, OrderItem } from "../../../types/types";
import { responseToast } from "../../../utils/features";

const defaultData : Order = {
  shippingDetails : {
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
  },
    status: "",
    subtotal: 0,
    discount: 0,
    shippingCharges: 0,
    tax: 0,
    total: 0,
    orderItems : [],
    user : {name: "", _id : ""},
    _id : "",
};


const TransactionManagement = () => {


  const {user} = useSelector((state : RootState) => state.userReducer);
   // eslint-disable-next-line react-hooks/rules-of-hooks
  
  const params = useParams();
  const navigate = useNavigate();
 
  // call api here
  const { isLoading, isError, data } = useOrderDetailsQuery(params.id!);


  const {
    shippingDetails: {
      address = "",
      city = "",
      state = "",
      country = "",
      pinCode = "",
    } = {},
    orderItems = [],
    status = "",
    tax = 0,
    subtotal = 0,
    total = 0,
    discount = 0,
    shippingCharges = 0,
 
  } = data?.getOrder || defaultData;

  const userName = user?.name;

  const [updateOrder]  =  useUpdateOrderMutation();
  const [deleteOrder]  =  useDeleteOrderMutation();

  const updateHandler = async() => {
    const res = await updateOrder({
        userId : user?._id!,
        orderId : data?.getOrder._id!,
    });
    responseToast(res, navigate, "/admin/transaction");
  };

  const deleteHandler = async() => {
    const res = await deleteOrder({
      userId : user?._id!,
      orderId : data?.getOrder._id!,
    });

    responseToast(res, navigate, "/admin/transaction");
  };

  if(isError) return <Navigate to={"/404"}/>

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        {
          isLoading ? <Skeleton length={20}/> 
          : 
          <>
            <section
          style={{
            padding: "2rem",
          }}
        >
          <h2>Order Items</h2>

          {orderItems.map((i) => (
            <ProductCard
              key={i._id}
              name={i.name}
              photo={`${server}/${i.photo}`}
              productId={i.productId}
              _id={i._id}
              quantity={i.quantity}
              price={i.price}
            />
          ))}
        </section>

        <article className="shipping-info-card">
          <button className="product-delete-btn" onClick={deleteHandler}>
            <FaTrash />
          </button>
          <h1>Order Info</h1>
          <h5>User Info</h5>
          <p>Name: {userName}</p>
          <p>
            Address: {`${address}, ${city}, ${state}, ${country} ${pinCode}`}
          </p>
          <h5>Amount Info</h5>
          <p>Subtotal: {subtotal}</p>
          <p>Shipping Charges: {shippingCharges}</p>
          <p>Tax: {tax}</p>
          <p>Discount: {discount}</p>
          <p>Total: {total}</p>

          <h5>Status Info</h5>
          <p>
            Status:{" "}
            <span
              className={
                status === "Delivered"
                  ? "purple"
                  : status === "Shipped"
                  ? "green"
                  : "red"
              }
            >
              {status}
            </span>
          </p>
          <button className="shipping-btn" onClick={updateHandler}>
            Process Status
          </button>
        </article>
          </>
        }
      </main>
    </div>
  );
};

const ProductCard = ({
  name,
  photo,
  price,
  quantity,
  productId,
}: OrderItem) => (
  <div className="transaction-product-card">
    <img src={photo} alt={name} />
    <Link to={`/product/${productId}`}>{name}</Link>
    <span>
      ₹{price} X {quantity} = ₹{price * quantity}
    </span>
  </div>
);

export default TransactionManagement;
