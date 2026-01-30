"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, MapPin } from "lucide-react";
import { Student, Address } from "../models/student";
import { studentSchema } from "../schemas/studentSchema";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

type FormErrors = Partial<Record<string, string>>;

const CreateStudentModal: React.FC<Props> = ({ onClose, onCreated }) => {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [form, setForm] = useState<Omit<Student, "_id" | "studentCode" | "age">>({
    firstName: "",
    middleName: "",
    lastName: "",
    birthDate: "",
    contactNumber: "",
    email: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      district: "",
    } as Address,
  });

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({});

    if (name.startsWith("address.")) {
      const key = name.split(".")[1] as keyof Address;
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
    setErrors({});

    const result = studentSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: FormErrors = {};
      const flatten = (err: any, prefix = "") => {
        for (const key in err) {
          if (typeof err[key] === "string") fieldErrors[prefix + key] = err[key];
          else if (Array.isArray(err[key]) && err[key].length > 0)
            fieldErrors[prefix + key] = err[key][0];
          else if (typeof err[key] === "object") flatten(err[key], prefix + key + ".");
        }
      };
      flatten(result.error.format());
      setErrors(fieldErrors);
      const firstError = Object.values(fieldErrors)[0];
      toast.error(`Oops! ${firstError}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success(`🎉 Student "${form.firstName} ${form.lastName}" created successfully!`);
      onCreated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("⚠️ Could not save the student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
      {children}
    </label>
  );

  const renderError = (field: string) =>
    errors[field] ? <p className="text-xs text-red-500 mt-1">{errors[field]}</p> : null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create Student</h2>
            <p className="text-sm text-slate-500">Add a new student</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Personal Details */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>First Name</Label>
                  <input
                    name="firstName"
                    autoComplete="off"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("firstName")}
                </div>
                <div>
                  <Label>Middle Name</Label>
                  <input
                    name="middleName"
                    autoComplete="off"
                    value={form.middleName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("middleName")}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <input
                    name="lastName"
                    autoComplete="off"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("lastName")}
                </div>
              </div>
            </div>

            {/* DOB */}
            <div className="space-y-4">
              <Label>Date of Birth</Label>
              <input
                type="date"
                name="birthDate"
                autoComplete="off"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("birthDate")}
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <Label>Contact Number</Label>
              <input
                name="contactNumber"
                autoComplete="off"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("contactNumber")}
            </div>

            {/* Email */}
            <div className="space-y-4 md:col-span-2">
              <Label>Email Address</Label>
              <input
                name="email"
                autoComplete="off"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("email")}
            </div>

            {/* Address */}
            <div className="space-y-4 md:col-span-2 pt-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <MapPin size={16} /> Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Line 1</Label>
                  <input
                    name="address.line1"
                    autoComplete="off"
                    value={form.address.line1}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("address.line1")}
                </div>
                <div>
                  <Label>Line 2</Label>
                  <input
                    name="address.line2"
                    autoComplete="off"
                    value={form.address.line2}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("address.line2")}
                </div>
                <div>
                  <Label>City</Label>
                  <input
                    name="address.city"
                    autoComplete="off"
                    value={form.address.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("address.city")}
                </div>
                <div>
                  <Label>District</Label>
                  <input
                    name="address.district"
                    autoComplete="off"
                    value={form.address.district}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("address.district")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg shadow-purple-200 disabled:opacity-50 transition-all"
          >
            {isSubmitting ? "Creating..." : "Create Student"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreateStudentModal;
