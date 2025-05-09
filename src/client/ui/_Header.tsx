import { Link } from "react-router-dom";
import { Button } from "../components/button";

export default function _Header() {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 border border-zinc-700 rounded-xl">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link to="/">
          <Button 
            className="bg-0 text-3xl cursor-pointer hover:bg-0 animate-bounce">
            Nicholas's Customer List
          </Button>
        </Link>
        <div className="ml-auto flex gap-2">
          <Link to="/managecustomers">
            <Button
              className="justify-self-e px-2 py-1 text-lg hover:bg-zinc-700 cursor-pointer">
              Manage Customers
            </Button>
          </Link>
          <Link to="/createcustomer">
            <Button 
              className="justify-self-end px-2 py-1 text-lg hover:bg-zinc-700 cursor-pointer">
              Create Customer
            </Button>
          </Link>
          <Link to="/import">
            <Button 
              className="justify-self-end px-2 py-1 text-lg hover:bg-zinc-700 cursor-pointer">
              Import
            </Button>
          </Link>
          <Link to="/export">
            <Button 
              className="justify-self-end px-2 py-1 text-lg hover:bg-zinc-700 cursor-pointer">
              Export
            </Button>
          </Link>
        </div>
      </header>
    </div>
  );
}
