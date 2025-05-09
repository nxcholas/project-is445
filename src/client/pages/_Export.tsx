// --------- req packages ----------------
import { neon } from "@neondatabase/serverless";

// ----------- Hooks --------------------
import { useState, useEffect } from "react";

//  ---------- components ---------------
import { Input } from "@/components/ui/input";
import { Button } from "../components/button";

export default function _Export() {
  // -------- initial variables ----------
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;
  const sql = neon(DATABASEURL);
  // ---------- states ----------
  const [records, setRecords] = useState("");
  const [fileName, setFileName] = useState("export");
  // ----------- handlers ---------------
  // ------- fetch total records ----------
  const getTotalRecords = async () => {
    const data = await sql`SELECT COUNT(cusid) FROM customer;`;
    setRecords(data[0].count);
  };

  // ---------- fetch data handler --------
  const getData = async () => {
    const data = await sql`
  SELECT
    cusid,
    cusfname,
    cuslname,
    
    cussalesytd::INTEGER AS cussalesytd,  
    cussalesprev::INTEGER AS cussalesprev
  FROM customer;
`;
    return handleDownload(data);
  };

  // ---------- download handler ----------
  const handleDownload = (data: any) => {
    // Convert the data into CSV format
    const rows = data
      .map((row: any) =>
        Object.values(row)
          .map((val) => `${val}`)
          .join(",")
      )
      .join("\n");

    // create blob from csv
    const blob = new Blob([rows], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName + ".txt"; // Set the download filename
    link.click(); // Trigger the download
  };
  // ------- file name handler ---------
  const handleFileName = (event: any) => {
    setFileName(event.target.value);
  };
  // -------- on mount -------
  useEffect(() => {
    getTotalRecords();
  });
  // -------------------------
  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold">Customer Export</h1>
      <h1 className="text-2xl text-white font-semibold mb-8">
        Total Number of records in the database: {records}
      </h1>
      <h1 className="text-lg text-white font-semibold">
        Enter a file name and click "Export Customers"
      </h1>
      <div className="flex space-between gap-1">
        <Input
          onChange={handleFileName}
          type="text"
          placeholder="export.csv"
          className="w-50 mt-1 text-white"
        ></Input>
        <Button
          className="mt-1 text-lg cursor-pointer hover:bg-zinc-950"
          onClick={getData}
        >
          Export Customers
        </Button>
      </div>
    </div>
  );
}
