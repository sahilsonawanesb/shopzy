/* eslint-disable react-hooks/rules-of-hooks */
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "react-table";
import TableHOC from "../components/admin/TableHOC";
import { Skeleton } from "../components/loader";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import { CustomError } from "../types/api-types";
import { userReducerInitialState } from "../types/reducer-types";

type DataType = {
    _id: string;
    amount:number;
    quantity:number;
    discount:number;
    status:ReactElement;
    action:ReactElement;
};

const column : Column<DataType>[] = [
    {
        Header : "ID",
        accessor:"_id",
    },
    {
        Header : "Quantity",
        accessor:"quantity",
    },
    {
        Header : "Discount",
        accessor : "discount",
    },
    {
        Header : "Amount",
        accessor : "amount",
    },
    {
        Header : "Status",
        accessor : "status",
    },
    {
        Header : "Action",
        accessor : "action"
    }
];

const orders = () => {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {user} = useSelector((state : {userReducer : userReducerInitialState}) => state.userReducer);

    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-non-null-asserted-optional-chain
    const {isLoading, isError, data, error } = useMyOrdersQuery(user?._id!);
    // eslint-disable-next-line react-hooks/rules-of-hooks

    if(isError){
        const err = error as CustomError;
        toast.error(err.data.message);
    }

  
    const [rows, setRows] = useState<DataType[]>([]);
    
    
     useEffect(() => {
        if(data)
          setRows(
            data?.orders.map((i) => ({
              _id : i._id,
              amount : i.total,
              discount : i.discount,
            //   quantity : i.orderItems.length,
            quantity: i.orderItems.reduce((total, item) => total + item.quantity, 0),
              status : <span 
                className={
                  i.status === "Processing" 
                  ? "red" 
                  : i.status === "Shipped" 
                  ? "green"
                  : "purple"
                  }>{i.status}</span>,
              action : <Link to={`/admin/transaction/${i._id}`}>Manage</Link>
            }))
        );
      }, [data]);

      console.log(data);

    // now calling the table component here..
    const Table = TableHOC<DataType>(column, 
        rows, 
        "dashboard-product-box", 
        "Orders", 
        rows.length > 6
    )();

    // navigation..
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
  return (
    <div className="container">
        <button className="back-btn" onClick={() => navigate("/")}>
        <BiArrowBack />
      </button>
        <h1>My Orders</h1>
        {isLoading ? <Skeleton length={20}/> : Table} 
    </div>
  )
}

export default orders
