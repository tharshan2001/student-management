"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Student } from "../models/student";
import toast from "react-hot-toast";

interface Props {
  student: Student;
  onClose: () => void;
  onUpdated: () => void;
}

const UpdateStudentModal: React.FC<Props> = ({ student, onClose, onUpdated }) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    firstName: student.firstName,
    middleName: student.middleName || "",
    lastName: student.lastName,
    birthDate: student.birthDate.split("T")[0],
    contactNumber: student.contactNumber,
    email: student.email,
    address: {
      line1: student.address.line1,
      line2: student.address.line2 || "",
      city: student.address.city,
      district: student.address.district,
    },
  });

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/students/${student._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Student updated successfully!");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update student", error);
      toast.error("⚠️ Failed to update student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
      {children}
    </label>
  );

  const inputClass =
    "w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none text-black transition-all";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">Update Student Profile</h2>
            <p className="text-xs md:text-sm text-slate-500">
              Edit information for {student.firstName} {student.lastName}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">
            
            {/* Personal Info Section */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label>First Name</Label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <Label>Middle Name</Label>
                  <input name="middleName" value={form.middleName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

            {/* DOB */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Calendar size={16} /> Date of Birth
              </h3>
              <input type="date" name="birthDate" value={form.birthDate} onChange={handleChange} className={inputClass} />
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Phone size={16} /> Contact Number
              </h3>
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} className={inputClass} />
            </div>

            {/* Email */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </h3>
              <input name="email" value={form.email} onChange={handleChange} className={inputClass} />
            </div>

            {/* Address */}
            <div className="space-y-4 md:col-span-2 pt-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <MapPin size={16} /> Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>City</Label>
                  <input name="address.city" value={form.address.city} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <Label>District</Label>
                  <input name="address.district" value={form.address.district} onChange={handleChange} className={inputClass} />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 bg-white">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-md shadow-purple-200 disabled:opacity-50 transition-all text-sm md:text-base"
          >
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UpdateStudentModal;
