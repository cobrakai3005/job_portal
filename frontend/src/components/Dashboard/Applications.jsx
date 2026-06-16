import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  X,
  ChevronDown,
  Briefcase,
  Activity,
  MessageSquare, // New icon for cover letter
  UserCheck,
  UserX,
} from "lucide-react";
import {
  useApplications,
  useUpdateApplication,
} from "../../hooks/apply/useApply";

export default function ApplicationsTable() {
  // 1. Filtering States
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const { mutateAsync, isPending, error } = useUpdateApplication();

  // Debounce search input (waits 500ms after typing stops)

  // 2. Fetching data
  const { data, isLoading } = useApplications({
    search: debouncedSearch,
    status,
  });

  const applications = data?.data || [];
  const pagination = data?.pagination || { total: 0 };

  // 3. Dynamic Designations for filter
  const uniqueDesignations = [
    ...new Set(applications.map((app) => app.job_title)),
  ];

  const handleUpdateStatus = async (id, newStatus) => {
    console.log(`Updating app ${id} to ${newStatus}`);
    // Here you would call your mutation: updateStatus.mutate({ id, status: newStatus })

    try {
      await mutateAsync({
        id,
        applicationData: { status: newStatus },
      });
    } catch (error) {}
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "shortlisted":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* --- HEADER --- */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Recruitment Candidates
            </h1>
            <p className="text-slate-500 mt-1">
              Manage {pagination.total} active candidates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            {/* <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white w-full md:w-64 transition-all shadow-sm text-sm"
              />
            </div> */}

            {/* Status Filter */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-slate-200 rounded-xl bg-white shadow-sm text-sm font-semibold text-slate-700 cursor-pointer focus:ring-4 focus:ring-indigo-500/10 outline-none"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 size-4 pointer-events-none" />
            </div>

            {/* Clear Button */}
            {(status || search) && (
              <button
                onClick={() => {
                  setStatus("");

                  setSearch("");
                }}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Clear Filters"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* --- TABLE --- */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Candidate Information
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Applied Role
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Date of Birth
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Current Status
                  </th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em]">
                    Quick Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-20 text-center text-slate-400 animate-pulse"
                    >
                      Loading candidates...
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">
                              {app.name}
                            </p>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Mail size={12} className="text-slate-300" />{" "}
                                {app.email}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Phone size={12} className="text-slate-300" />{" "}
                                {app.phone_number}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Calendar
                                  size={12}
                                  className="text-slate-300"
                                />{" "}
                                {new Date(app.dob).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">
                            {app.job_title}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase mt-1">
                            <Calendar size={10} />{" "}
                            {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-slate-700">
                            {new Date(app.dob).toLocaleDateString()}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusColor(app.status)}`}
                        >
                          {app.status === "shortlisted" && (
                            <CheckCircle size={12} />
                          )}
                          {app.status === "pending" && <Clock size={12} />}
                          {app.status === "rejected" && <XCircle size={12} />}
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center gap-2">
                          {/* Resume Link */}
                          <button
                            onClick={() => window.open(app.resume, "_blank")}
                            disabled={!app.resume}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-indigo-600 disabled:bg-slate-200 transition-all"
                          >
                            <Download size={14} /> Resume
                          </button>

                          {/* Status Quick-Switchers */}
                          <div className="flex border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <button
                              onClick={() =>
                                handleUpdateStatus(app.id, "shortlisted")
                              }
                              className="p-2 hover:bg-green-50 text-slate-400 hover:text-green-600 transition-colors border-r border-slate-100"
                              title="Shortlist Candidate"
                            >
                              <UserCheck size={16} />
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateStatus(app.id, "rejected")
                              }
                              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                              title="Reject Candidate"
                            >
                              <UserX size={16} />
                            </button>
                          </div>
                        </div>

                        {/* Cover Letter Snippet */}
                        {app.cover_letter && (
                          <div className="mt-2 flex items-start gap-2 text-left bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <MessageSquare
                              size={12}
                              className="text-slate-400 mt-0.5 shrink-0"
                            />
                            <p className="text-[10px] text-slate-500 italic line-clamp-1">
                              {app.cover_letter}
                            </p>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- EMPTY STATE --- */}
        {!isLoading && applications.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 mt-4">
            <Briefcase size={40} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">
              No applicants found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
