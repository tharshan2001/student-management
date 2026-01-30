"use client";

import React, { useEffect, useState } from "react";
import { Search, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { Student } from "../models/student";
import StudentItem from "./StudentItem";
import CreateStudentModal from "./CreateStudentModal";

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        page: page.toString(),
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
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, page, limit]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          Students Information
        </h2>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              className="pl-10 pr-4 py-2 w-full border rounded-lg text-sm"
              placeholder="Search by name or city"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm">
            <Calendar size={18} />
            Last 30 days
          </button>

          {/* Add Student Button */}
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
          >
            + Add Student
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-10 text-gray-400">Loading students...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-slate-400 uppercase border-b">
                  <th className="py-4 px-4">Student</th>
                  <th className="py-4 px-4">Roll</th>
                  <th className="py-4 px-4">Address</th>
                  <th className="py-4 px-4">Age</th>
                  <th className="py-4 px-4">DOB</th>
                  <th className="py-4 px-4">Phone</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {students.map((student) => (
                  <StudentItem
                    key={student._id}
                    student={student}
                    onRefresh={fetchStudents}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-8 gap-4">
            <div className="flex items-center gap-1">
              <button
                className="p-2"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded ${
                      p === page
                        ? "bg-purple-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                className="p-2"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight />
              </button>
            </div>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value={5}>5 / page</option>
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
            </select>
          </div>
        </>
      )}

      {/* Create Student Modal */}
      {openCreate && (
        <CreateStudentModal
          onClose={() => setOpenCreate(false)}
          onCreated={fetchStudents}
        />
      )}
    </div>
  );
};

export default StudentList;
