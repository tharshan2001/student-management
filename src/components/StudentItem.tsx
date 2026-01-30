"use client";

import React, { useState, useMemo } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { Student } from "../models/student";
import UpdateStudentModal from "./UpdateStudentModal";
import toast from "react-hot-toast"; // Added toast

interface Props {
  student: Student;
  onRefresh: () => void;
}

const StudentItem: React.FC<Props> = ({ student, onRefresh }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();

  const avatarColors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-amber-100 text-amber-600",
    "bg-indigo-100 text-indigo-600",
    "bg-rose-100 text-rose-600",
    "bg-cyan-100 text-cyan-600",
  ];

  const colorClass = useMemo(() => {
    const charCodeSum = (student.firstName + student.lastName)
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return avatarColors[charCodeSum % avatarColors.length];
  }, [student.firstName, student.lastName]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    if (!confirm("Are you sure you want to delete this student record?")) return;

    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("Student deleted successfully!");
      onRefresh();
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("⚠️ Could not delete student. Please try again.");
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenEdit(true);
  };

  const handleRowClick = () => {
    router.push(`/students/${student._id}`);
  };

  return (
    <>
      <tr 
        onClick={handleRowClick}
        className="hover:bg-slate-50/80 transition-all group cursor-pointer"
      >
        <td className="py-4 px-6">
          <div className="flex items-center gap-4">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-transform group-hover:scale-105 ${colorClass}`}>
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-sm">
                {student.firstName} {student.lastName}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                View Profile
              </span>
            </div>
          </div>
        </td>

        <td className="py-4 px-6 text-slate-500 text-sm font-bold">
          <span className="bg-slate-100 px-2 py-1 rounded-lg text-[10px]">
            #{student.studentCode}
          </span>
        </td>

        <td className="py-4 px-6 text-slate-600 text-sm">
          <p className="font-medium">{student.address.city}</p>
          <p className="text-[11px] text-slate-400">{student.address.district}</p>
        </td>

        <td className="py-4 px-6 text-slate-600 text-sm font-medium text-center">
          {student.age}
        </td>

        <td className="py-4 px-6 text-slate-500 text-sm">
          {new Date(student.birthDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </td>

        <td className="py-4 px-6 text-slate-600 text-sm font-medium">
          {student.contactNumber}
        </td>

        <td className="py-4 px-6 text-right">
          <div className="flex justify-end gap-1 
              opacity-100 sm:opacity-0 
              translate-x-0 sm:translate-x-2 
              transition-all group-hover:opacity-100 group-hover:translate-x-0">
            <button
              onClick={handleEditClick}
              className="p-2.5 text-slate-400 hover:text-yellow-600 hover:bg-yellow-100 rounded-xl transition-colors"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </td>
      </tr>

      {openEdit && (
        <UpdateStudentModal
          student={student}
          onClose={() => setOpenEdit(false)}
          onUpdated={onRefresh}
        />
      )}
    </>
  );
};

export default StudentItem;
