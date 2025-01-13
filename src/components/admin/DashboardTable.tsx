
import { Column } from "react-table";
import TableHOC from "./TableHOC";
import { useMemo } from "react";

interface DataType {
  _id: string;
  quantity: number;
  discount: number;
  amount: number;
  status: string;
}

const DashboardTable = ({ data = [] }: { data: DataType[] }) => {
  const columns: Column<DataType>[] = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "_id",
      },
      {
        Header: "Quantity",
        accessor: "quantity",
      },
      {
        Header: "Discount",
        accessor: "discount",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Status",
        accessor: "status",
      },
    ],
    []
  );

  const TableComponent = useMemo(
    () =>
      TableHOC<DataType>(
        columns,
        data,
        "transaction-box",
        "Top Transaction"
      ),
    [columns, data]
  );

  return <TableComponent />;
};

export default DashboardTable;

