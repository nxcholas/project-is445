// --------- req packages ----------------
import { neon } from "@neondatabase/serverless";

// ----------- Hooks --------------------
import { useState, useEffect } from "react";

//  ---------- components ---------------
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";

import { Skeleton } from "@/components/ui/skeleton";
// -----------types-------------------
interface Customer {
  cusid: number;
  cusfname: string;
  cuslname: string;
  cusstate: string;
  cussalesytd: number;
  cussalesprev: number;
}

type NeonDbError = {
  detail: string;
  [key: string]: any; // allows other fields too
};

export default function _Import() {
  // ------ initial variables ---------------
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;
  const [customer, setCustomer] = useState(null);
  // --------- states ----------------
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inserted, setInserted] = useState("");
  const [skipped, setSkipped] = useState("");
  const [totalRecords, setTotalRecords] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<NeonDbError[]>([]);

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
      console.log(customer);
    }
  };
  useEffect(() => {
    fetchCustomerCount();
  }, []);
  // ------- handlers ---------
  const handleFileUpload = (e: any) => {
    // reset submitted state to false
    setSubmitted(false);

    const file = e.target.files?.[0];
    if (!file) return;

    // --- read each line and store into array as objects ------
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/);
      const parsedCustomers: Customer[] = lines.map((line: any) => {
        const [cusid, cusfname, cuslname, cusstate, cussalesytd, cussalesprev] =
          line.split(",");
        return {
          cusid: Number(cusid),
          cusfname,
          cuslname,
          cusstate,
          cussalesytd: Number(cussalesytd),
          cussalesprev: Number(cussalesprev),
        };
      });
      setCustomers(parsedCustomers);
    };
    reader.readAsText(file);
  };
  // ---- sql query ---------
  const handleSubmit = async (e: any) => {
    // prevent default form behavior and reset submitted state
    e.preventDefault();
    setSubmitted(false);
    // --- initial vars ------
    const skipped: number[] = [];
    const inserted: number[] = [];
    const errorMessages: string[] = [];
    // -------- look for duplicates ------------
    // first pass: build `inserted` and `skipped`
    for (const customer of customers) {
      try {
        setLoading(true);
        const sql = neon(DATABASEURL);
        const existsQuery = `SELECT 1 FROM customer WHERE cusid = $1 LIMIT 1;`;
        const existsResult = await sql.query(existsQuery, [customer.cusid]);

        if (existsResult && existsResult.length > 0) {
          skipped.push(customer.cusid);
          continue;
        }
        inserted.push(customer.cusid);
      } catch (error: any) {
        console.error("Full error object:", error);
        skipped.push(customer.cusid);
      } finally {
        setTotalRecords(
          `Records Processed: ${inserted.length + skipped.length}`
        );
        setInserted(`Records inserted successfully: ${inserted.length}.`);
        setSkipped(`Records not inserted: ${skipped.length}.`);
        setSubmitted(true);
        setLoading(false);
      }
    }

    // now only insert the valid ones:
    const runQuery = async () => {
      // build a lookup from cusid → Customer object
      const byId = new Map(customers.map((c) => [c.cusid, c]));

      for (const cusid of inserted) {
        const customer = byId.get(cusid)!; // we know it exists
        try {
          const sql = neon(DATABASEURL);
          await sql`
        INSERT INTO customer
          (cusid, cusfname, cuslname, cusstate, cussalesytd, cussalesprev)
        VALUES
          (${customer.cusid},
           ${customer.cusfname},
           ${customer.cuslname},
           ${customer.cusstate},
           ${customer.cussalesytd},
           ${customer.cussalesprev})
      `;
          console.log("Inserted customer", cusid);
        } catch (error: any) {
          console.error("Insert error for", cusid, error);
          setErrors((prev) => [
            ...prev,
            {
              detail: error.detail || "",
              message: error.message,
              code: error.code,
            } as NeonDbError,
          ]);
        }
      }
    };

    // make sure to await it:
    await runQuery();
    await fetchCustomerCount();
  };

  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold">Customer Import</h1>
      <h1 className="text-3xl text-white font-semibold">
        Total Number of records in the database: {customer}
      </h1>
      <h1 className="text-xl text-white mt-6">
        Select a file with customers for Database Insert
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="w-104 flex justify-between mt-2">
          <Input
            required
            className="text-white file:text-white  border border-zinc-700 w-50 cursor-pointer hover:border-cyan-400"
            accept=".txt"
            type="file"
            onChange={handleFileUpload}
          />
          <Button className="cursor-pointer hover:bg-zinc-950">
            Import Customers
          </Button>
        </div>
        {loading ? (
          <div className="mt-8 pl-16">
            <Skeleton className="h-4 w-[20vw] bg-zinc-700" />
            <Skeleton className="h-4 w-[15vw] mt-4 bg-zinc-700" />
            <Skeleton className="h-4 w-[15vw] mt-4 bg-zinc-700" />
            <Skeleton className="h-4 w-[15vw] mt-4 bg-zinc-700" />
          </div>
        ) : null}
        {submitted ? (
          <div className="container pl-16 pt-8">
            <h1 className="text-4xl text-white font-semibold">
              Import Summary
            </h1>
            <h1 className="text-lg text-white font-semibold">{totalRecords}</h1>
            <h1 className="text-lg text-white font-semibold">{inserted}</h1>
            <h1 className="text-lg text-white font-semibold">{skipped}</h1>
            <div className="errors pl-20 pt-5">
              <h1 className="text-2xl text-white font-semibold mb-0">Errors</h1>
              {errors.length > 0 && (
                <div className="mt-4 text-zinc-500">
                  {errors.map((err, idx) => (
                    <p className="mt-4" key={idx}>
                      {err.detail} {err.message}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}
