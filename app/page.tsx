"use client";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center font-sans">
      <div className="space-y-4">
        <span className="text-blue-500 font-bold tracking-[0.6em] text-[10px] uppercase opacity-80">Sunflex Luxury Master</span>
        <h1 className="text-7xl font-black text-white tracking-tighter italic uppercase leading-none">Management</h1>
        <p className="text-slate-500 tracking-[0.2em] text-xs font-medium mt-6">Luxury Crystal ERP System</p>
      </div>
      
      <div className="mt-12">
        <a href="/inventory" className="px-10 py-4 font-black text-white transition-all duration-200 bg-blue-600 rounded-full hover:bg-blue-500 shadow-2xl shadow-blue-900/40 uppercase tracking-widest text-xs">
          ENTER SYSTEM
        </a>
      </div>
    </div>
  );
}
