"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Fingerprint,
  Clock
} from "lucide-react";
import { Student } from "../models/student";

const StudentProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/students/${id}`);
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800">Student not found</h2>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-yellow-400 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className=" bg-slate-50/50 p-6 md:p-12">
      {/* Navigation */}
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Directory</span>
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm flex flex-col items-center text-center">
            <div className="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center text-slate-600 text-4xl font-black mb-4 shadow-inner">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">
              {student.firstName} <br /> {student.lastName}
            </h1>
            <span className="mt-2 px-4 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold tracking-widest uppercase">
              ID: {student.studentCode}
            </span>
            
            <div className="w-full h-px bg-slate-100 my-8" />
            
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><Phone size={18} /></div>
                <span className="text-sm font-medium">{student.contactNumber}</span>
              </div>
              <div className="flex items-center gap-4 text-slate-600">
                <div className="p-2 bg-slate-50 rounded-lg"><Clock size={18} /></div>
                <span className="text-sm font-medium">{student.age} Years Old</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info Grid */}
        <div className="md:col-span-2 space-y-6">
          {/* Header Info */}
          <div className="bg-slate-400/10 rounded-[2.5rem] p-8 shadow-md shadow-yellow-200/50 flex justify-between items-center text-slate-900">
            <div>
              <p className="text-xs font-black uppercase tracking-widest opacity-70">Current Status</p>
              <h3 className="text-xl font-bold">Active Enrollment</h3>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 font-bold">
              2024 Academic Year
            </div>
          </div>

          {/* Details Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Personal Details */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-slate-600">
                <User size={20} />
                <h4 className="font-bold text-slate-800">Personal Data</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Full Name</label>
                  <p className="text-sm font-semibold text-slate-700">{student.firstName} {student.lastName}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Birth Date</label>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(student.birthDate).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-yellow-600">
                <MapPin size={20} />
                <h4 className="font-bold text-slate-800">Location</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">City</label>
                  <p className="text-sm font-semibold text-slate-700">{student.address.city}</p>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">District</label>
                  <p className="text-sm font-semibold text-slate-700">{student.address.district}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;