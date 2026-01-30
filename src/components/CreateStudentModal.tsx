"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, User, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { Student, Address } from "../models/student";
import { studentSchema } from "../schemas/studentSchema";
import { z, ZodError } from "zod";

interface Props {
  onClose: () => void;
  onCreated: () => void;
}

type FormErrors = Partial<Record<string, string[]>>;

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
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors({}); // clear errors on change

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
      const fieldErrors: FormErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error("Failed to create student", error);
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
    errors[field]?.length ? (
      <p className="text-xs text-red-500 mt-1">{errors[field]?.[0]}</p>
    ) : null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create Student</h2>
            <p className="text-sm text-slate-500">Add a new student to the system</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto bg-slate-50/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Personal Info Section */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>First Name</Label>
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  {renderError("firstName")}
                </div>
                <div>
                  <Label>Middle Name</Label>
                  <input
                    name="middleName"
                    value={form.middleName || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  {renderError("middleName")}
                </div>
                <div>
                  <Label>Last Name</Label>
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                  />
                  {renderError("lastName")}
                </div>
              </div>
            </div>

            {/* DOB Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Calendar size={16} /> Date of Birth
              </h3>
              <input
                type="date"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("birthDate")}
            </div>

            {/* Contact Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Phone size={16} /> Contact Number
              </h3>
              <input
                name="contactNumber"
                value={form.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("contactNumber")}
            </div>

            {/* Email Section */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </h3>
              <input
                name="email"
                value={form.email || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
              />
              {renderError("email")}
            </div>

            {/* Address Section */}
            <div className="space-y-4 md:col-span-2 pt-2">
              <h3 className="text-sm font-bold text-purple-600 flex items-center gap-2">
                <MapPin size={16} /> Location Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Line 1</Label>
                  <input
                    name="address.line1"
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
                    value={form.address.line2 || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                  {renderError("address.line2")}
                </div>
                <div>
                  <Label>City</Label>
                  <input
                    name="address.city"
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

        {/* Footer Actions */}
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
