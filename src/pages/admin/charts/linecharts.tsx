/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useSelector } from "react-redux";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { LineChart } from "../../../components/admin/Charts";
import { getLastMonths } from "../../../utils/features";
import { RootState } from "../../../redux/store";
import { useLineQuery } from "../../../redux/api/dashboardAPI";
// import { CustomError } from "../../../types/api-types";
// import { toast } from "react-hot-toast";
import { Skeleton } from "../../../components/loader";
import { Navigate } from "react-router-dom";


const {last12Months} = getLastMonths();

const Linecharts = () => {

  const {user} = useSelector((state : RootState) => state.userReducer);

  const {isLoading, isError, data} = useLineQuery(user?._id!);

  const users = data?.charts.user! || [];
  const product = data?.charts.product! || [];
  const discount = data?.charts.discount!;
  const revenue = data?.charts.revenue!;

  // console.log(data?.charts.revenue);

  if(isError) return <Navigate to={"/admin/dashboard"}/>

  return (
    <div className="admin-container">
      <AdminSidebar />
      {
        isLoading ? <Skeleton length={20}/> : 
        <>
          <main className="chart-container">
        <h1>Line Charts</h1>
        <section>
          <LineChart
            data={users}
            label="Users"
            borderColor="rgb(53, 162, 255)"
            labels={last12Months}
            backgroundColor="rgba(53, 162, 255, 0.5)"
          />
          <h2>Active Users</h2>
        </section>

        <section>
          <LineChart
            data={product}
            backgroundColor={"hsla(269,80%,40%,0.4)"}
            borderColor={"hsl(269,80%,40%)"}
            labels={last12Months}
            label="Products"
          />
          <h2>Total Products (SKU)</h2>
        </section>

        <section>
          <LineChart
            data={revenue}
            backgroundColor={"hsla(129,80%,40%,0.4)"}
            borderColor={"hsl(129,80%,40%)"}
            label="Revenue"
            labels={last12Months}
          />
          <h2>Total Revenue </h2>
        </section>

        <section>
          <LineChart
            data={discount}
            backgroundColor={"hsla(29,80%,40%,0.4)"}
            borderColor={"hsl(29,80%,40%)"}
            label="Discount"
            labels={last12Months}
          />
          <h2>Discount Allotted </h2>
        </section>
        </main>
        </>
      }

    </div>
  );
};

export default Linecharts;
