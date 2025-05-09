// ----------req packages--------------
import { useState, useEffect, useMemo } from "react";
import { neon } from "@neondatabase/serverless";


// ---------- hooks ------------------
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// ---------- types --------------
type FormValues = {
  id: number | null;
  firstName: string;
  lastName: string;
  state: string;
  salesYTD: number | null;
  previousYearsSales: number | null;
};
// -------------------------------

export default function _EditCustomer() {
  //----- initial variables -----------
  const { cusid } = useParams();
  const DATABASEURL = import.meta.env.VITE_DATABASE_URL;
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
  // ------ states -------------------
  const [cusfname, setCusFName] = useState("");
  const [cuslname, setCusLName] = useState("");
  const [cusstate, setCusState] = useState("");
  const [cussalesytd, setCusSalesYTD] = useState("");
  const [cussalesprev, setCusSalesPrev] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  // ------- Form Logic --------------
  const { register, handleSubmit, setValue, watch } = useForm<FormValues>({
    defaultValues: {
      id: null,
      firstName: "",
      lastName: "",
      state: "",
      salesYTD: null,
      previousYearsSales: null,
    },
  });

  const watchedValues = watch();
  const isFullyFilled = useMemo(() => {
    // Check if all form fields have values
    return Object.entries(watchedValues).every(([value]) => {
      // Ensure no field is null, empty string, or invalid value
      return (
        value !== null &&
        value !== "" &&
        (typeof value !== "number" || !isNaN(value))
      );
    });
  }, [watchedValues]);
  // ------ fetch and populate form ------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const sql = neon(DATABASEURL);
        const params: any[] = [];
        let paramCount = 1;

        // combines statements
        params.push(cusid);
        let query = `SELECT * FROM customer WHERE cusid = $${paramCount};`;

        // run query && set states
        const result = await sql.query(query, params);
        let user = result[0];

        setCusFName(result[0].cusfname);
        setCusLName(result[0].cuslname);
        setCusState(result[0].cusstate);
        setCusSalesYTD(result[0].cussalesytd);
        setCusSalesPrev(result[0].cussalesprev);

        // sync with react-hook-form
        // Sync with react-hook-form
        setValue("id", user.cusid);
        setValue("firstName", user.cusfname);
        setValue("lastName", user.cuslname);
        setValue("state", user.cusstate);
        setValue(
          "salesYTD",
          Number(user.cussalesytd.toString().replace(/[^0-9.-]+/g, ""))
        );
        setValue(
          "previousYearsSales",
          Number(user.cussalesprev.toString().replace(/[^0-9.-]+/g, ""))
        );
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);
  // ------handlers----------------
  const handleFNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCusFName(event.target.value);
  };
  const handleLNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCusLName(event.target.value);
  };
  const handleSalesYTDChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCusSalesYTD(event.target.value);
  };
  const handleSalesPrev = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCusSalesPrev(event.target.value);
  };
  // -------- form handler ------------
  const onSubmit = (data: FormValues) => {
    console.log("submitting form");
    const updateCustomer = async () => {
      try {
        let query = `UPDATE customer SET `;
        const sql = neon(DATABASEURL);
        const joinClauses: string[] = [];
        const params: any[] = [];
        let paramCount = 1;

        // fname clause
        if (data.firstName) {
          joinClauses.push(`cusfname = $${paramCount++}`);
          params.push(data.firstName);
        }
        // lname clause
        if (data.lastName) {
          joinClauses.push(`cuslname = $${paramCount++}`);
          params.push(data.lastName);
        }
        // state clause
        if (data.state) {
          joinClauses.push(`cusstate = $${paramCount++}`);
          params.push(data.state);
        }
        // sales ytd clause
        if (data.salesYTD) {
          joinClauses.push(`cussalesytd = $${paramCount++}`);
          params.push(data.salesYTD);
        }
        // prev sales clause
        if (data.previousYearsSales) {
          joinClauses.push(`cussalesprev = $${paramCount++}`);
          params.push(data.previousYearsSales);
        }
        // -- join query ----
        if (joinClauses.length > 0) {
          query += `${joinClauses.join(" ,")}  WHERE cusid = ${cusid};`;
          console.log(query);
        }
        // ---- run query --------
        await sql.query(query, params);
        console.log("Customer Updated Sucessfully!");
        setUpdateMessage("Customer Updated Successfully!");
      } catch (err) {
        console.error(err);
      }
    };
    updateCustomer();
  };
  return (
    <div className="container pl-16 pt-8">
      <h1 className="text-4xl text-white font-semibold mb-5">
        Customer Update
      </h1>
      {/* ADD ONSUBMIT HERE */}
      <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
        {/* ID */}
        <label className="text-white text-lg font-semibold">
          ID:
          <Input
            type="number"
            placeholder="(equals)"
            className="text-white"
            value={cusid}
            readOnly
            disabled
            {...register("id", { valueAsNumber: true })}
          />
        </label>

        {/* First Name */}
        <label className="text-white text-lg font-semibold">
          First Name:
          <Input
            type="text"
            placeholder={cusfname}
            className="text-white"
            required
            onChange={handleFNameChange}
            {...register("firstName")}
          />
        </label>

        {/* Last Name */}
        <label className="text-white text-lg font-semibold">
          Last Name:
          <Input
            type="text"
            placeholder={cuslname}
            className="text-white"
            required
            onChange={handleLNameChange}
            {...register("lastName")}
          />
        </label>

        {/* State Select */}
        <label className="text-white text-lg font-semibold">
          State:
          <Select
            value={watchedValues.state}
            onValueChange={(value) => setValue("state", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={cusstate || "Select state"} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 text-white">
              <SelectGroup className="bg-zinc-800">
                <SelectLabel>Select a state</SelectLabel>
                {states.map((state) => (
                  <SelectItem
                    className="text-white"
                    key={state}
                    value={state}
                    required
                    {...register("state")}
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
            placeholder={cussalesytd}
            className="text-white"
            required
            onChange={handleSalesYTDChange}
            step={0.01}
            {...register("salesYTD", { valueAsNumber: true })}
          />
        </label>

        {/* Previous Years Sales */}
        <label className="text-white text-lg font-semibold">
          Previous Years Sales:
          <Input
            type="number"
            placeholder={cussalesprev}
            className="text-white mb-5"
            required
            onChange={handleSalesPrev}
            step={0.01}
            {...register("previousYearsSales", { valueAsNumber: true })}
          />
        </label>
        <AlertDialog>
          {isFullyFilled ? (
            <AlertDialogTrigger asChild>
              <Button className="text-xl mr-2 bg-orange-400 cursor-pointer hover:bg-orange-500">
                Update Customer
              </Button>
            </AlertDialogTrigger>
          ) : (
            <Button
              disabled
              className="text-xl mr-2 bg-orange-400 cursor-not-allowed opacity-50"
            >
              Update Customer
            </Button>
          )}
          <AlertDialogContent className="bg-zinc-800 border-0">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action will overwrite the existing entry. Your previous
                data will be replaced and cannot be recovered.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                form="edit-form"
                className="cursor-pointer"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
      {updateMessage ? (
        <h1 className="text-4xl text-white font-semibold mt-5">
          Customer Updated Successfully!
        </h1>
      ) : null}
    </div>
  );
}
