"use client";

import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Student } from "../models/student";
import StudentItem from "./StudentItem";
import CreateStudentModal from "./CreateStudentModal";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const limit = 10;

  const fetchStudents = async (pageNumber: number = page) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        page: pageNumber.toString(),
        limit: limit.toString(),
      });
      const res = await fetch(`/api/students?${query}`);
      const data = await res.json();

      const formatted: Student[] = (data.data || []).map((s: any) => ({
        ...s,
        _id: String(s._id),
      }));

      setStudents(formatted);
      setTotalPages(data.totalPages || 1);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(1);
  }, [search]);

  useEffect(() => {
    fetchStudents(page);
  }, [page]);

  const handleStudentCreated = () => {
    fetchStudents(1);
    setOpenCreate(false);
  };

  return (
    <div className="bg-slate-50/50 rounded-3xl p-4 md:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">
            Students Information
          </h2>
          <p className="text-slate-500 text-sm md:text-base">
            Manage your student directory
          </p>
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 w-full md:w-auto items-start sm:items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[150px] sm:min-w-[250px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2 sm:py-3 w-full bg-white border-none rounded-2xl text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 transition-all shadow-sm"
              placeholder="Search students..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Add Student Button */}
          <div className="flex justify-end w-full sm:w-auto">
            <button
              onClick={() => setOpenCreate(true)}
              className="px-8 sm:px-6 py-0.5 sm:py-2 bg-black/90 hover:bg-black text-white font-bold rounded-2xl text-sm sm:text-base shadow-md shadow-yellow-200/50 transition-all active:scale-95 border-b "
            >
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <div className="max-h-[550px] overflow-y-auto">
            <table className="w-full table-auto border-collapse min-w-[600px] md:min-w-full">
              <thead>
                <tr className="text-[10px] sm:text-[11px] uppercase tracking-wider bg-slate-100">
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Student
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Roll
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Address
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Age
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    DOB
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-left py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Phone
                  </th>
                  <th className="sticky top-0 z-10 bg-slate-100 text-right py-3 sm:py-5 px-4 sm:px-6 font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20">
                      <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-yellow-400 border-r-transparent align-[-0.125em]" />
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 text-slate-400 font-medium">
                      No students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student) => (
                    <StudentItem
                      key={student._id}
                      student={student}
                      onRefresh={() => fetchStudents(page)}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-8 py-4 sm:py-5 bg-slate-50/30 border-t border-slate-50 gap-2 sm:gap-0">
          <span className="text-xs sm:text-sm text-slate-500 font-medium">
            Page {page} of {totalPages}
          </span>

          <div className="flex flex-wrap items-center gap-1">
            <button
              className="p-2 rounded-xl hover:bg-white transition-colors disabled:opacity-30"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={18} className="text-slate-600" />
            </button>

            <div className="flex gap-1 flex-wrap mx-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-xs font-bold transition-all ${
                    p === page
                      ? "bg-yellow-400 text-slate-900 shadow-sm"
                      : "text-slate-500 hover:bg-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              className="p-2 rounded-xl hover:bg-white transition-colors disabled:opacity-30"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              <ChevronRight size={18} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openCreate && (
        <CreateStudentModal
          onClose={() => setOpenCreate(false)}
          onCreated={handleStudentCreated}
        />
      )}
    </div>
  );
};

export default StudentList;
