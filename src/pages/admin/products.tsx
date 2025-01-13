import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/productAPI";
import { server } from "../../redux/store";
import { CustomError } from "../../types/api-types";
import { userReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../components/loader";

interface DataType {
  photo: ReactElement;
  name: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Photo",
    accessor: "photo",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {

  const { user } = useSelector(
    (state:{userReducer:userReducerInitialState}) => state.
    userReducer
  );


  // this line of code is of api call after settuping the backend as follows
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const {isLoading, isError, error, data} = useAllProductsQuery(user?._id!);
  const [rows, setRows] = useState<DataType[]>([]);
  // this line of code is of api call after settuping the backend as follows 

  if (isError) {
    const err = error as CustomError;
    toast.error(err?.data?.message || "An error occurred while fetching products.");
  }
 
  useEffect(() => {
    if (data && Array.isArray(data.products)) {
      setRows(
        data.products.map((i) => ({
          photo: <img src={`${server}/${i.photo}`} alt={i.name} />,
          name: i.name,
          price: i.price,
          stock: i.stock,
          action: <Link to={`/admin/product/${i._id}`}> Manage </Link>,
        }))
      );
    }
  }, [data]);
  
  

  const Table = TableHOC<DataType>(
    columns,
    rows || [],
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={25}/> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
