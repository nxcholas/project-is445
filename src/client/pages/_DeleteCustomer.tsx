// ----------req packages--------------
import { useState } from "react";
import { neon } from "@neondatabase/serverless";

// ---------- hooks ------------------
import { useParams } from "react-router-dom";
// -----------------------------------

// ---------- components --------------
import { Button } from "../components/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// -------------------------------

export default function _DeleteCustomer() {
  //------- inital variables ---------
  const { cusid } = useParams(); // Get customer ID from URL
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;
  // -------- states ------------------
  const [customerid, setCusID] = useState("");
  const [cusfname, setCusFName] = useState("");
  const [cuslname, setCusLName] = useState("");
  const [cusstate, setCusState] = useState("");
  const [cussalesytd, setCusSalesYTD] = useState("");
  const [cussalesprev, setCusSalesPrev] = useState("");
  const [delMessage, setDelMessage] = useState("");
  // ----------------------------------
  // -------SQL euery to fetch and populate user data--------
  const fetchUser = async () => {
    try {
      const sql = neon(DATABASEURL);
      const params: any[] = [];
      let paramCount = 1;

      // combines statements
      params.push(cusid);
      let query = `SELECT * FROM customer WHERE cusid = $${paramCount};`;
      console.log(query);

      // run query && set states
      const result = await sql.query(query, params);
      console.log(`Returned Customer:`, result);
      setCusID(result[0].cusid);
      setCusFName(result[0].cusfname);
      setCusLName(result[0].cuslname);
      setCusState(result[0].cusstate);
      setCusSalesYTD(result[0].cussalesytd);
      setCusSalesPrev(result[0].cussalesprev);
    } catch (err) {
      console.error(err);
    }
  };
  fetchUser();
  // ------------SQL query to delete record------------------
  const delUser = async () => {
    try {
      const sql = neon(DATABASEURL);
      const params: any[] = [];
      let paramCount = 1;
      params.push(cusid);
      const query = `DELETE FROM customer WHERE cusid = $${paramCount};`;

      // run query
      console.log(query);
      await sql.query(query, params);
      setDelMessage("Customer Deleted Successfully!")
    } catch (err) {
      console.error(err);
    }
  };
  // --------------------------------------------------------

  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold mb-8">
        Are you sure you want to delete this customer?
      </h1>
      {/* ID */}
      <label className="text-white text-lg font-semibold">
        ID:
        <Input
          type="number"
          placeholder=""
          className="text-white"
          value={customerid}
          readOnly
          disabled
        />
      </label>

      {/* First Name */}
      <label className="text-white text-lg font-semibold">
        First Name:
        <Input
          type="text"
          placeholder=""
          className="text-white"
          readOnly
          value={cusfname}
          disabled
        />
      </label>

      {/* Last Name */}
      <label className="text-white text-lg font-semibold">
        Last Name:
        <Input
          type="text"
          placeholder=""
          className="text-white"
          readOnly
          value={cuslname}
          disabled
        />
      </label>

      {/* State Select */}
      <label className="text-white text-lg font-semibold">
        State:
        <Input
          type="string"
          placeholder=""
          className="text-white"
          readOnly
          value={cusstate}
          disabled
        />
      </label>

      {/* Sales YTD */}
      <label className="text-white text-lg font-semibold">
        Sales YTD:
        <Input
          type="string"
          placeholder=""
          className="text-white"
          readOnly
          value={cussalesytd}
          disabled
        />
      </label>

      {/* Previous Years Sales */}
      <label className="text-white text-lg font-semibold">
        Previous Years Sales:
        <Input
          type="string"
          placeholder=""
          className="text-white"
          readOnly
          disabled
          value={cussalesprev}
        />
      </label>
      <AlertDialog>
        <AlertDialogTrigger>
          {" "}
          <Button className="mt-8 bg-red-500 text-xl cursor-pointer hover:bg-red-600">
            Delete
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-zinc-800 border-0">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => delUser()} className="cursor-pointer">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <h1 className="text-4xl text-white font-semibold mb-8">{delMessage}</h1>
    </div>
  );
}
