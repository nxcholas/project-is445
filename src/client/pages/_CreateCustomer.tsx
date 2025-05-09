// ----------req packages--------------
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { neon } from "@neondatabase/serverless";

// ---------- components --------------
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

// ----- types ------------
type FormValues = {
  id: number | null;
  firstName: string;
  lastName: string;
  state: string;
  salesYTD: number | null;
  previousYearsSales: number | null;
};
// ------------------------

export default function _CreateCustomer() {
  // -------Form Variables---------------
  const {
    register,
    handleSubmit,
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
  // prettier-ignore
  const states = [
      "AL", "AK", "AZ", "AR", "CA", "CO",
      "CT", "DE", "FL", "GA", "HI", "ID",
      "IL", "IN", "IA", "KS", "KY", "LA",
      "ME", "MD", "MA", "MI", "MN", "MS",
      "MO", "MT", "NE", "NV", "NH", "NJ",
      "NM", "NY", "NC", "ND", "OH", "OK",
      "OR", "PA", "RI", "SC", "SD", "TN",
      "TX", "UT", "VT", "VA", "WA", "WV",
      "WI", "WY",
    ] as const;
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;
  // ------------Form Populate ID -----------------------
  const [id, setID] = useState("");
  useEffect(() => {
    const fetchID = async () => {
      try {
        const sql = neon(DATABASEURL);
        let query = `SELECT MAX(cusid) FROM customer`;
  
        // run query
        const result = await sql.query(query);
        setID(result[0].max);
        console.log(`Max ID found: ${id}`);
      } catch (err) {
        console.error(err);
      }
    };
    fetchID();
  }, [id])
  //------------ Clear Button --------------------
  const handleClear = () => {
    reset();
    // Manually reset the Select UI
    setValue("state", "", { shouldDirty: false });
    setCusCreated(false);
  };
  // ------------Form Submit Button----------------------
  const [cusCreated, setCusCreated] = useState(false);
  const onSubmit = (data: FormValues) => {
    console.log(data);
    // initialize SQL and WHERE clauses
    const fetchCustomers = async () => {
      try {
        setCusCreated(false);
        const sql = neon(DATABASEURL);
        const whereClauses: string[] = [];
        const params: any[] = [];
        let paramCount = 1;

        // Build conditions for each field
        if (id) {
          whereClauses.push(`$${paramCount++}`);
          params.push(id + 1);
        } 

        if (data.firstName) {
          whereClauses.push(`$${paramCount++}`);
          params.push(data.firstName);
        }

        if (data.lastName) {
          whereClauses.push(`$${paramCount++}`);
          params.push(data.lastName);
        }

        if (data.state) {
          whereClauses.push(`$${paramCount++}`);
          params.push(data.state);
        } else {
          whereClauses.push(`$${paramCount++}`);
          params.push(null);
        }

        if (data.salesYTD) {
          whereClauses.push(`$${paramCount++}`);
          params.push(data.salesYTD);
        } else {
          whereClauses.push(`$${paramCount++}`);
          params.push(null);
        }

        if (data.previousYearsSales) {
          whereClauses.push(`$${paramCount++}`);
          params.push(data.previousYearsSales);
        } else {
          whereClauses.push(`$${paramCount++}`);
          params.push(null);
        }
        // FINAL QUERY
        let query = `INSERT INTO customer (
          cusid,
          cusfname,
          cuslname,
          cusstate,
          cussalesytd,
          cussalesprev
        ) VALUES (`;
        if (whereClauses.length > 0) {
          query += `${whereClauses.join(", ")});`;
          console.log(query);
        }

        // run query
        await sql.query(query, params);
        setCusCreated(true);
        console.log("Customer Created Successfully!")
      } catch (err) {
        console.error(err);
      }
    };
    fetchCustomers();
  };
  // -----------------------------------------------
  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold">
        Create a New Customer
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ID */}
        <label className="text-white text-lg font-semibold">
          ID: 
          <Input
            type="number"
            placeholder="(equals)"
            className="text-white"
            readOnly
            disabled
            {...register("id", { valueAsNumber: true })}
            value={id + 1}
            />
        </label>

        {/* First Name */}
        <label className="text-white text-lg font-semibold">
          First Name:
          <Input
            type="text"
            placeholder="(begins with)"
            className="text-white"
            required
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
            required
            {...register("lastName")}
          />
        </label>

        {/* State Select */}
        <label className="text-white text-lg font-semibold">
          State:
          <Select onValueChange={(value) => setValue("state", value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a State" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white">
              <SelectGroup className="bg-zinc-800">
                <SelectLabel>Select a state</SelectLabel>
                {states.map((state) => (
                  <SelectItem className="text-white" key={state} value={state} {...register("state")}>
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
            className="bg-green-500 mr-5 text-xl hover:bg-green-700 cursor-pointer"
          >
            Create
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
      {
        cusCreated ? (
          <h1 className="text-4xl text-green-400 font-semibold">
            Customer Created Successfully!
        </h1>
        ):(
          null
        )
      }
    </div>
  );
}
