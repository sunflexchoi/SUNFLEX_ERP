"use client";
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-10 text-center font-sans">
      <h1 className="text-6xl font-black text-white tracking-tighter italic mb-4">SUNFLEX MASTER</h1>
      <p className="text-slate-500 tracking-[0.5em] text-[10px] uppercase mb-12 font-bold leading-none">Luxury Crystal ERP System</p>
      <a href="/inventory" className="px-12 py-5 bg-white text-black font-black rounded-full hover:scale-110 transition-all shadow-2xl uppercase tracking-widest text-xs">
        Enter Inventory System
      </a>
    </div>
  );
}
