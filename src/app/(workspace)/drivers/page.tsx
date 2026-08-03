"use client";

import { useState } from "react";
import { PlayCircle, Plus, FileSpreadsheet, X, LayoutTemplate } from "lucide-react";
import { useDrivers } from "@/hooks/useDrivers";

export default function DriversPage() {
  const { drivers, isLoading, createDriver } = useDrivers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [name, setName] = useState("");
  const [type, setType] = useState("freestyle");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await createDriver({ name, type, value, unit });
    setIsSubmitting(false);
    if (success) {
      setIsModalOpen(false);
      setName("");
      setValue("");
      setUnit("");
    }
  };

  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 max-w-6xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-semibold text-foreground">Organisation Drivers</h1>
            <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium hover:bg-emerald-500/20 transition-colors">
              <PlayCircle className="w-4 h-4" />
              Virtual demo
            </button>
          </div>
          <p className="text-foreground/60 text-lg">Use in formulas when budgeting or forecasting and in reports as data rows and in report row formulas.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/5 transition-all text-foreground">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Excel upload
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Create Driver
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : drivers.length > 0 ? (
          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-[#fcfcfc] dark:bg-[#1a1a1a] border-b border-[#e5e5e5] dark:border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium text-foreground/60">Name</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Type</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Value / Formula</th>
                  <th className="px-6 py-4 font-medium text-foreground/60">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/10">
                {drivers.map(d => (
                  <tr key={d.id} className="hover:bg-foreground/[0.02] transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{d.name}</td>
                    <td className="px-6 py-4 text-foreground/70 capitalize">{d.type}</td>
                    <td className="px-6 py-4 text-foreground/70">{d.value || "—"}</td>
                    <td className="px-6 py-4 text-foreground/70">{d.unit || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-xl p-12 text-center">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <LayoutTemplate className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Your drivers will appear here</h2>
            <p className="text-foreground/60 max-w-md">Create drivers using the freestyle or formula method above.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-white dark:bg-[#111] rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5] dark:border-white/10">
              <h3 className="font-semibold text-lg">Create Driver</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-foreground/40 hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 flex flex-col gap-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Name</label>
                <input 
                  required
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent"
                  placeholder="e.g. Sales per employee"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Type</label>
                <select 
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent text-foreground"
                >
                  <option value="freestyle">Freestyle</option>
                  <option value="formula">Formula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Value / Formula</label>
                <input 
                  type="text" 
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent"
                  placeholder={type === 'formula' ? 'e.g. Sales / Employees' : 'e.g. 5000'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Unit</label>
                <input 
                  type="text" 
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent"
                  placeholder="e.g. $"
                />
              </div>
              
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-medium hover:bg-foreground/5 transition-colors">
                  Cancel
                </button>
                <button disabled={isSubmitting} type="submit" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Driver"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
