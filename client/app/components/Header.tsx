// components/Header.tsx
import { Link, useNavigate, NavLink } from "react-router";
import { useState } from "react";
import { Search, Settings } from "lucide-react";

type HeaderProps = {
  user: {
    name: string
  } | null
}



export default function Header({user}: HeaderProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/users/${encodeURIComponent(query)}`);
  };


  return (
    <header className="app-header">
      <div className="header-inner">
        <Link to="/" className="text-lg font-semibold tracking-tight">
          Message Board
        </Link>

        <form
          onSubmit={handleSearch}
          className="flex items-center w-1/3 bg-gray-100 rounded-md px-3 py-2"
        >
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none w-full text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-link-active" : ""}`
            }
          >
            Explore
          </NavLink>


          {/* RIGHT: User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                to="/message/create"
                className="btn-primary"
                >
                  Post
                </Link>
                <Link to={`/users/${user.name.replaceAll(' ', '-')}`} className="text-sm font-bold">
                  {user.name}
                </Link>
                <Link
                  to="/account"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </Link>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
