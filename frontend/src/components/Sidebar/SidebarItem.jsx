import { Link, useSearchParams } from "react-router";

export default function SidebarItem({ label }) {
  const [search, setSearch] = useSearchParams();
  const page = search.get("page");
  return (
    <div
      className={`px-4 py-2 rounded-lg cursor-pointer transition-all font-medium

        ${page === label.toLowerCase() ? "bg-indigo-600 text-white" : ""}
     `}
    >
      <Link to={`/admin/dashboard?page=${label.toLowerCase()}`}>{label}</Link>
    </div>
  );
}
