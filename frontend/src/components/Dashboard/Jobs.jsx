import React, { useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useDeleteJob, useJobs } from "../../hooks/jobs/useJobs";

import NewJob from "../NewJob";
import EditJob from "../EditJob";

import useDebounce from "../../hooks/useDebounce";

export default function Jobs() {
  //
  // STATE
  //
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  //
  // DEBOUNCE
  //
  const debounceVal = useDebounce(search);

  //
  // FETCH JOBS
  //
  const { data, isLoading, error } = useJobs({
    search: debounceVal,
    page: currentPage,
  });

  //
  // DELETE JOB
  //
  const { mutateAsync } = useDeleteJob();

  //
  // DELETE HANDLER
  //
  const handleDeleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job posting?",
    );

    if (!confirmDelete) return;

    await mutateAsync(id);
  };

  //
  // DATA
  //
  const jobsList = data?.jobs || [];

  const total = data?.pagination?.total || 0;

  const totalPages = data?.pagination?.totalPages || 1;

  const hasNextPage = data?.pagination?.hasNextPage || false;

  const hasPrevPage = data?.pagination?.hasPrevPage || false;

  //
  // LOADING
  //
  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-indigo-600"></div>

          <p className="text-sm font-medium text-gray-500">Loading jobs...</p>
        </div>
      </div>
    );
  }

  //
  // ERROR
  //
  if (error) {
    return (
      <div className="m-8 flex items-center gap-3 rounded-lg border border-red-100 bg-red-50 p-4 text-red-600">
        <div className="rounded-full bg-red-100 p-2 text-red-600">!</div>

        <p className="font-medium">
          Error loading jobs. Please check your connection.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* HEADER */}
      <div className="mx-auto mb-8 flex max-w-7xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Job Board
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {jobsList.length}
            </span>{" "}
            of <span className="font-semibold text-gray-700">{total}</span>{" "}
            total positions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* SEARCH */}
          <div className="group relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-indigo-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                //
                // RESET PAGE ON SEARCH
                //
                setCurrentPage(1);
              }}
              placeholder="Filter by title..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 md:w-72"
            />
          </div>

          <NewJob />
        </div>
      </div>

      {/* TABLE */}
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Position & Description
                </th>

                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Location
                </th>

                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Posted On
                </th>

                <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Manage
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {jobsList.map((job) => (
                <tr
                  key={job.id}
                  className="group transition-colors hover:bg-indigo-50/30"
                >
                  {/* JOB INFO */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold leading-none text-gray-900">
                          {job.title}
                        </span>

                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">
                          Active
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-indigo-600">
                        {job.designation}
                      </span>

                      <p className="mt-1 line-clamp-1 max-w-xs text-xs italic text-gray-500">
                        "{job.short_description}"
                      </p>
                    </div>
                  </td>

                  {/* LOCATION */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gray-100 p-2 text-gray-500 transition-colors group-hover:bg-indigo-100 group-hover:text-indigo-600">
                        <MapPin size={16} />
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">
                          {job.city}
                        </span>

                        <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                          {job.state || "Remote"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} className="text-gray-400" />

                      <span className="text-sm">
                        {new Date(job.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => window.open(job.jd_file, "_blank")}
                        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-indigo-50 hover:text-indigo-600"
                        title="View Document"
                      >
                        <Eye size={18} />
                      </button>

                      <EditJob job={job} />

                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-50 hover:text-red-600"
                        title="Remove Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50/50 px-6 py-4">
          <span className="text-xs font-medium text-gray-500">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={!hasPrevPage}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="rounded-md border border-gray-300 bg-white p-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              disabled={!hasNextPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="rounded-md border border-gray-300 bg-white p-1.5 text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* EMPTY */}
        {!isLoading && jobsList.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="mb-4 rounded-full bg-gray-100 p-4">
              <FileText className="size-8 text-gray-400" />
            </div>

            <h3 className="font-bold text-gray-900">No jobs found</h3>

            <p className="mt-1 max-w-xs text-center text-sm text-gray-500">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
