// --------- req packages ----------------
import { neon } from "@neondatabase/serverless";

// -------- page links -------------
import _CreateCustomer from "./_CreateCustomer";
//----------------------------------

// ----------- Hooks --------------------
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

// ------------ components ---------------
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../components/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
// ------ Types -----------------

interface Customer {
  cusid: number;
  cusfname: string;
  cuslname: string;
  cusstate: string;
  cussalesytd: number;
  cussalesprev: number;
}

type FormValues = {
  id: number | null;
  firstName: string;
  lastName: string;
  state: string;
  salesYTD: number | null;
  previousYearsSales: number | null;
};

export default function ManageCustomers() {
  const [table, setTable] = useState<Customer[]>([]);
  const [searched, setSearched] = useState(false);
  const states = [
    "AL",
    "AK",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "FL",
    "GA",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "OH",
    "OK",
    "OR",
    "PA",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ] as const;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;

  // -------------- initial search count ----------------
  const fetchCustomerCount = async () => {
    try {
      const sql = neon(DATABASEURL);
      const result = await sql.query(
        "SELECT COUNT(DISTINCT cusid) FROM customer;"
      );
      console.log(result[0]);
      setCustomer(result[0].count);
    } catch (err) {
      console.error("Database error:", err);
    } finally {
      setLoading(false);
      console.log(customer);
    }
  };

  // ----- form values logic here --------
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      id: null,
      firstName: "",
      lastName: "",
      state: "",
      salesYTD: null,
      previousYearsSales: null,
    },
  });
  const watchedState = watch("state");

  // ----- form handlers -------------
  const onSubmit = (data: FormValues) => {
    console.log(data);
    // initialize SQL and WHERE clauses
    const fetchCustomers = async () => {
      try {
        const sql = neon(DATABASEURL);
        const whereClauses: string[] = [];
        const params: any[] = [];
        let paramCount = 1;

        // Build conditions for each field
        if (data.id) {
          whereClauses.push(`cusid = $${paramCount++}`);
          params.push(data.id);
        }

        if (data.firstName) {
          whereClauses.push(`cusfname ILIKE $${paramCount++}`);
          params.push(`${data.firstName}%`);
        }

        if (data.lastName) {
          whereClauses.push(`cuslname ILIKE $${paramCount++}`);
          params.push(`${data.lastName}%`);
        }

        if (data.state) {
          whereClauses.push(`cusstate = $${paramCount++}`);
          params.push(data.state);
        }

        if (data.salesYTD) {
          whereClauses.push(`cussalesytd >= $${paramCount++}`);
          params.push(data.salesYTD);
        }

        if (data.previousYearsSales) {
          whereClauses.push(`cussalesprev >= $${paramCount++}`);
          params.push(data.previousYearsSales);
        }
        // FINAL QUERY
        let query = "SELECT * FROM customer";
        if (whereClauses.length > 0) {
          query += ` WHERE ${whereClauses.join(" AND ")}`;
        }

        // run query\
        console.log(query);
        const result = await sql.query(query, params);
        console.log("Query Results:", result);
        setTable(result);
        setSearched(true);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCustomers();
  };

  const handleClear = () => {
    reset();
    // Manually reset the Select UI
    setValue("state", "", { shouldDirty: false });
  };
  // --------------------------------

  useEffect(() => {
    fetchCustomerCount();
  }, []);

  if (loading)
    return (
      <div className="container pl-16 pt-8 flex items-center space-x-4">
        <div className="space-y-1">
          <Skeleton className="h-4 w-[20vw] bg-zinc-700" />
          <Skeleton className="h-4 w-[40vw] mt-8 bg-zinc-700" />
          <div className="pl-12 mt-10">
            <Skeleton className="h-7 w-[5vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[70vw] mt-3 bg-zinc-700" />

            <Skeleton className="h-7 w-[10vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[70vw] mt-3 bg-zinc-700" />

            <Skeleton className="h-7 w-[10vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[70vw] mt-3 bg-zinc-700" />

            <Skeleton className="h-7 w-[8vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[70vw] mt-3 bg-zinc-700" />

            <Skeleton className="h-7 w-[15vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[70vw] mt-3 bg-zinc-700" />
          </div>
          <div className="flex gap-4 pl-12">
            <Skeleton className="h-7 w-[8vw] mt-3 bg-zinc-700" />
            <Skeleton className="h-7 w-[6vw] mt-3 bg-zinc-700" />
          </div>
        </div>
      </div>
    );
  if (!customer) return <div>Customer not found</div>;

  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold">Find Customers</h1>
      <h1 className="text-3xl text-white font-semibold">
        Total Number of records in the database: {customer}
      </h1>
      <div className="form-container pl-16 pt-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ID */}
          <label className="text-white text-lg font-semibold">
            ID:
            <Input
              type="number"
              placeholder="(equals)"
              className="text-white"
              {...register("id", { valueAsNumber: true })}
            />
          </label>

          {/* First Name */}
          <label className="text-white text-lg font-semibold">
            First Name:
            <Input
              type="text"
              placeholder="(begins with)"
              className="text-white"
              {...register("firstName")}
            />
          </label>

          {/* Last Name */}
          <label className="text-white text-lg font-semibold">
            Last Name:
            <Input
              type="text"
              placeholder="(begins with)"
              className="text-white"
              {...register("lastName")}
            />
          </label>

          {/* State Select */}
          <label className="text-white text-lg font-semibold">
            State:
            <Select
              value={watchedState}
              onValueChange={(value) =>
                setValue("state", value, { shouldDirty: true })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 text-white">
                <SelectGroup className="bg-zinc-800">
                  <SelectLabel>Select a state</SelectLabel>
                  {states.map((state) => (
                    <SelectItem
                      className="text-white"
                      key={state}
                      value={state}
                    >
                      {state}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </label>

          {/* Sales YTD */}
          <label className="text-white text-lg font-semibold">
            Sales YTD:
            <Input
              type="number"
              placeholder="(greater than or equal to)"
              className="text-white"
              {...register("salesYTD", { valueAsNumber: true })}
            />
          </label>

          {/* Previous Years Sales */}
          <label className="text-white text-lg font-semibold">
            Previous Years Sales:
            <Input
              type="number"
              placeholder="(greater than or equal to)"
              className="text-white"
              {...register("previousYearsSales", { valueAsNumber: true })}
            />
          </label>

          <div className="mt-5">
            <Button
              type="submit"
              className="bg-cyan-500 mr-5 text-xl hover:bg-cyan-700 cursor-pointer"
            >
              Submit
            </Button>
            <Button
              type="button"
              className="bg-zinc-700 text-xl cursor-pointer"
              onClick={handleClear}
              disabled={!isDirty}
            >
              Clear
            </Button>
          </div>
        </form>
      </div>
      {table.length > 0 ? (
        <Table className="mt-8">
          <TableHeader>
            <TableRow className="text-lg hover:bg-transparent">
              <TableHead className="text-white">ID</TableHead>
              <TableHead className="text-white">First Name</TableHead>
              <TableHead className="text-white">Last Name</TableHead>
              <TableHead className="text-white">Amount</TableHead>
              <TableHead className="text-white">State</TableHead>
              <TableHead className="text-white">Sales YTD</TableHead>
              <TableHead className="text-white">Prev Year Sales</TableHead>
              <Link to="/createcustomer">
                <Button className="bg-green-500 hover:bg-green-700 cursor-pointer">
                  Create Customer
                </Button>
              </Link>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.map((customer: Customer) => (
              <TableRow
                key={customer.cusid}
                className="text-lg hover:bg-transparent"
              >
                <TableCell className="text-white">{customer.cusid}</TableCell>
                <TableCell className="text-white">
                  {customer.cusfname}
                </TableCell>
                <TableCell className="text-white">
                  {customer.cuslname}
                </TableCell>
                <TableCell className="text-white">{customer.cusid}</TableCell>{" "}
                <TableCell className="text-white">
                  {customer.cusstate}
                </TableCell>
                <TableCell className="text-white">
                  {customer.cussalesytd}
                </TableCell>
                <TableCell className="text-white">
                  {customer.cussalesprev}
                </TableCell>
                <TableCell>
                  <Link to={`/editcustomer/${customer.cusid}`}>
                    <Button className="mr-2 bg-orange-400 cursor-pointer hover:bg-orange-500">
                      Edit
                    </Button>
                  </Link>
                  <Link to={`/deletecustomer/${customer.cusid}`}>
                    <Button className="mr-2 bg-red-500 cursor-pointer hover:bg-red-600">
                      Delete
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : searched ? (
        <h1 className="text-3xl text-zinc-600 font-semibold">
          No records found!
        </h1>
      ) : null}
    </div>
  );
}
