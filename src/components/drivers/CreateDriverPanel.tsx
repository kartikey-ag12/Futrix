"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronRight, Check } from "lucide-react";

interface MonthlyValue {
  selected: boolean;
  value: string;
}

interface YearData {
  expanded: boolean;
  months: Record<string, MonthlyValue>; // key: YYYY-MM (e.g. "2026-01")
}

const MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

interface CreateDriverPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<boolean>;
  groups?: any[];
}

export function CreateDriverPanel({ isOpen, onClose, onSave, groups = [] }: CreateDriverPanelProps) {
  const [name, setName] = useState("");
  const [method, setMethod] = useState("freestyle");
  const [storeOn, setStoreOn] = useState("last_day");
  const [quickAction, setQuickAction] = useState("set");
  const [quickActionValue, setQuickActionValue] = useState("");
  
  const [driverGroupId, setDriverGroupId] = useState("");
  const [decimalDisplay, setDecimalDisplay] = useState("0.00");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize years 2024-2027
  const [yearsData, setYearsData] = useState<Record<number, YearData>>(() => {
    const initial: Record<number, YearData> = {};
    for (let y = 2024; y <= 2027; y++) {
      const months: Record<string, MonthlyValue> = {};
      for (let m = 1; m <= 12; m++) {
        months[`${y}-${m.toString().padStart(2, "0")}`] = { selected: false, value: "" };
      }
      initial[y] = { expanded: y === 2026, months };
    }
    return initial;
  });

  if (!isOpen) return null;

  const toggleYear = (year: number) => {
    setYearsData(prev => ({
      ...prev,
      [year]: { ...prev[year], expanded: !prev[year].expanded }
    }));
  };

  const handleSelectAllYear = (year: number, checked: boolean) => {
    setYearsData(prev => {
      const newYearData = { ...prev[year] };
      const newMonths = { ...newYearData.months };
      Object.keys(newMonths).forEach(key => {
        newMonths[key] = { ...newMonths[key], selected: checked };
      });
      newYearData.months = newMonths;
      return { ...prev, [year]: newYearData };
    });
  };

  const handleMonthSelect = (year: number, monthKey: string, checked: boolean) => {
    setYearsData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        months: {
          ...prev[year].months,
          [monthKey]: { ...prev[year].months[monthKey], selected: checked }
        }
      }
    }));
  };

  const handleMonthValueChange = (year: number, monthKey: string, value: string) => {
    setYearsData(prev => ({
      ...prev,
      [year]: {
        ...prev[year],
        months: {
          ...prev[year].months,
          [monthKey]: { ...prev[year].months[monthKey], value }
        }
      }
    }));
  };

  const handleQuickActionUpdate = () => {
    const val = parseFloat(quickActionValue);
    if (isNaN(val) && quickAction !== "set") return;

    setYearsData(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(yearStr => {
        const year = parseInt(yearStr);
        const newYear = { ...next[year] };
        const newMonths = { ...newYear.months };
        
        Object.keys(newMonths).forEach(monthKey => {
          if (newMonths[monthKey].selected) {
            const currentVal = parseFloat(newMonths[monthKey].value) || 0;
            let newVal = currentVal;
            
            switch (quickAction) {
              case "set":
                newVal = isNaN(val) ? 0 : val;
                break;
              case "inc_pct":
                newVal = currentVal * (1 + val / 100);
                break;
              case "dec_pct":
                newVal = currentVal * (1 - val / 100);
                break;
              case "inc_amt":
                newVal = currentVal + val;
                break;
              case "dec_amt":
                newVal = currentVal - val;
                break;
            }
            newMonths[monthKey] = { ...newMonths[monthKey], value: newVal.toString() };
          }
        });
        newYear.months = newMonths;
        next[year] = newYear;
      });
      return next;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Flatten months data to JSON
    const monthlyData: Record<string, string> = {};
    Object.values(yearsData).forEach(yearData => {
      Object.entries(yearData.months).forEach(([key, data]) => {
        if (data.value) {
          monthlyData[key] = data.value;
        }
      });
    });

    const driverData = {
      name,
      type: method,
      value: JSON.stringify(monthlyData), // Save as JSON string
      unit: '',
      driverGroupId: driverGroupId || null,
    };

    const success = await onSave(driverData);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 px-4 pb-10 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-[#f2f4f7] rounded-xl shadow-2xl w-full max-w-6xl relative flex flex-col min-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#e5e5e5]">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Creating a Driver</h2>
          <button onClick={onClose} className="p-2 text-[#666] hover:text-[#1a1a1a] transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-8 flex flex-col lg:flex-row gap-8 overflow-y-auto">
          
          {/* Main Left Column */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Driver method</label>
                <select 
                  value={method}
                  onChange={e => setMethod(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                >
                  <option value="freestyle">Freestyle</option>
                  <option value="formula">Formula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Store on the</label>
                <select 
                  value={storeOn}
                  onChange={e => setStoreOn(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                >
                  <option value="last_day">Last day of the month</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const suffix = ["st", "nd", "rd"][((day + 90) % 100 - 10) % 10 - 1] || "th";
                    return (
                      <option key={day} value={day.toString()}>{day}{suffix}</option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Quick actions</label>
                <select 
                  value={quickAction}
                  onChange={e => setQuickAction(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
                >
                  <option value="set">Set selected to</option>
                  <option value="inc_pct">Increase by percentage</option>
                  <option value="dec_pct">Decrease by percentage</option>
                  <option value="inc_amt">Increase by amount</option>
                  <option value="dec_amt">Decrease by amount</option>
                </select>
              </div>
            </div>


            {/* Quick Action Input */}
            <div className="flex items-center gap-4 mb-10">
              <input 
                type="number" 
                value={quickActionValue}
                onChange={e => setQuickActionValue(e.target.value)}
                placeholder="0"
                className="w-32 px-4 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <button 
                onClick={handleQuickActionUpdate}
                className="px-6 py-2.5 rounded-full border border-[#d1d5db] bg-white text-[#666] font-medium hover:bg-gray-50 transition-colors"
              >
                Update
              </button>
            </div>

            {/* Years Grid */}
            <div className="flex flex-col gap-6">
              {Object.entries(yearsData).map(([yearStr, yearData]) => {
                const year = parseInt(yearStr);
                const allSelected = Object.values(yearData.months).every(m => m.selected);

                return (
                  <div key={year} className="flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <button onClick={() => toggleYear(year)} className="text-[#1a1a1a] flex items-center gap-2 font-bold text-lg">
                        {yearData.expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        {year}
                      </button>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${allSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-[#d1d5db] bg-white'}`}>
                          {allSelected && <Check className="w-3 h-3" />}
                        </div>
                        <input 
                          type="checkbox" 
                          className="hidden"
                          checked={allSelected}
                          onChange={(e) => handleSelectAllYear(year, e.target.checked)}
                        />
                        <span className="text-sm text-[#666]">Select all</span>
                      </label>
                    </div>
                    
                    {yearData.expanded && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-2">
                        {MONTH_NAMES.map((monthName, idx) => {
                          const monthKey = `${year}-${(idx + 1).toString().padStart(2, "0")}`;
                          const monthData = yearData.months[monthKey];
                          const shortYear = year.toString().slice(-2);
                          
                          return (
                            <div key={monthKey} className="flex flex-col items-center">
                              <label className="flex items-center gap-1.5 mb-2 cursor-pointer">
                                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${monthData.selected ? 'bg-[#0f4a4f] border-[#0f4a4f] text-white' : 'border-[#d1d5db] bg-white'}`}>
                                  {monthData.selected && <Check className="w-2.5 h-2.5" />}
                                </div>
                                <input 
                                  type="checkbox"
                                  className="hidden"
                                  checked={monthData.selected}
                                  onChange={(e) => handleMonthSelect(year, monthKey, e.target.checked)}
                                />
                                <span className="text-[11px] font-bold text-[#1a1a1a] tracking-wider">{monthName} {shortYear}</span>
                              </label>
                              <input 
                                type="text"
                                value={monthData.value}
                                onChange={(e) => handleMonthValueChange(year, monthKey, e.target.value)}
                                placeholder="-"
                                className="w-full h-12 text-center rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-64 flex flex-col gap-6">
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Add to group</label>
              <select 
                value={driverGroupId}
                onChange={e => setDriverGroupId(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
              >
                <option value="">Please select...</option>
                {groups.map((g: any) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Decimal display</label>
              <select 
                value={decimalDisplay}
                onChange={e => setDecimalDisplay(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded border border-[#d1d5db] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_1rem_center]"
              >
                <option value="0.00">0.00</option>
                <option value="0.0">0.0</option>
                <option value="0">0</option>
              </select>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#e5e5e5] flex justify-end gap-4 bg-white rounded-b-xl">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-emerald-600 text-emerald-700 font-bold hover:bg-emerald-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || !name}
            className="px-6 py-2.5 rounded-full bg-[#0a6c52] hover:bg-[#075340] text-white font-bold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}
