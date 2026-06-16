import React from "react";
import {
  useDeleteLocation,
  useLocations,
} from "../../hooks/locations/useLocations";

export default function Locations() {
  const { data: locations, isLoading, error } = useLocations();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <LocationsTable data={locations} />
    </div>
  );
}

import {
  MapPin,
  Globe,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  Search,
} from "lucide-react";
import NewLocation from "../NewLocation";
import EditLocation from "../EditLocation";

function LocationsTable({ data }) {
  // Replace this with your actual hook, e.g., const { data, isLoading } = useLocations();
  const { mutateAsync, isPending: deleteLoad } = useDeleteLocation();
  const locations = data?.locations || [];
  const hanldeDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this job posting?")) {
      // Implementation: mutation.mutate(id);
      await mutateAsync(id);
    }
  };
  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Globe className="text-indigo-600" size={28} />
              Location Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Configure office locations and remote regions ({data.count})
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input
                type="text"
                placeholder="Search city..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white shadow-sm text-sm outline-none"
              />
            </div> */}
            <NewLocation />
          </div>
        </div>

        {/* --- TABLE CARD --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  City & Region
                </th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Country
                </th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Added Date
                </th>
                <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {locations.map((loc) => (
                <tr
                  key={loc.id}
                  className="hover:bg-indigo-50/30 transition-colors group"
                >
                  {/* City & State */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-md transition-all">
                        <MapPin size={18} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">
                          {loc.city}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {loc.state || "National / Remote"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Country */}
                  <td className="px-6 py-5 text-sm font-semibold text-slate-600">
                    {loc.country}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Calendar size={14} />
                      {new Date(loc.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <EditLocation location={loc} />
                      <button
                        onClick={() => {
                          hanldeDelete(loc.id);
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Info */}
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Total Registered Hubs: {data.count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
