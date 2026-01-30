"use client";

import React, { useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { Student } from "../models/student";
import UpdateStudentModal from "./UpdateStudentModal";

interface Props {
  student: Student;
  onRefresh: () => void;
}

const StudentItem: React.FC<Props> = ({ student, onRefresh }) => {
  const [openEdit, setOpenEdit] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Delete this student?")) return;

    await fetch(`/api/students/${student._id}`, {
      method: "DELETE",
    });

    onRefresh();
  };

  return (
    <>
      <tr className="hover:bg-slate-50 transition-colors group">
        <td className="py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold uppercase">
              {student.firstName[0]}
              {student.lastName[0]}
            </div>
            <span className="font-medium text-slate-700">
              {student.firstName} {student.lastName}
            </span>
          </div>
        </td>

        <td className="py-4 px-4 text-slate-500 text-sm font-medium">
          #{student.studentCode}
        </td>

        <td className="py-4 px-4 text-slate-500 text-sm">
          {student.address.city}, {student.address.district}
        </td>

        <td className="py-4 px-4 text-slate-500 text-sm">
          {student.age}
        </td>

        <td className="py-4 px-4 text-slate-500 text-sm">
          {new Date(student.birthDate).toLocaleDateString()}
        </td>

        <td className="py-4 px-4 text-slate-500 text-sm">
          {student.contactNumber}
        </td>

        <td className="py-4 px-4 text-right">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setOpenEdit(true)}
              className="p-1.5 text-slate-400 hover:text-blue-500 rounded-md hover:bg-blue-50"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50"
            >
              <Trash2 size={16} />
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
