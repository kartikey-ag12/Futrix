"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, FileSpreadsheet, ChevronDown, ChevronRight as ChevronRightIcon, PlayCircle, LayoutTemplate, Pencil, Trash2 } from "lucide-react";
import { addMonths, format } from "date-fns";
import { useDrivers } from "@/hooks/useDrivers";
import { DriversExcelUploadPanel } from "@/components/drivers/DriversExcelUploadPanel";
import { CreateDriverPanel } from "@/components/drivers/CreateDriverPanel";

export default function DriversPage() {
  const { drivers, groups, isLoading, createDriver, createGroup, updateGroup, deleteGroup, deleteDriver } = useDrivers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  // Expanded groups state
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: prev[groupId] !== undefined ? !prev[groupId] : false
    }));
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;
    setIsCreatingGroup(true);
    const success = await createGroup(newGroupName.trim());
    setIsCreatingGroup(false);
    if (success) {
      setNewGroupName("");
      setIsGroupModalOpen(false);
    }
  };

  // Group drivers
  const groupedDrivers = useMemo(() => {
    const map = new Map<string, any[]>();
    const ungrouped: any[] = [];
    
    // Initialize groups
    groups.forEach((g) => {
      map.set(g.id, []);
    });

    drivers.forEach(d => {
      if (d.driverGroupId && map.has(d.driverGroupId)) {
        map.get(d.driverGroupId)!.push(d);
      } else {
        ungrouped.push(d);
      }
    });

    return { groupsMap: map, ungrouped };
  }, [drivers, groups]);

  // Pagination for columns (11 months)
  const [startMonthOffset, setStartMonthOffset] = useState(0);
  const today = new Date();
  const monthColumns = Array.from({ length: 11 }, (_, i) => addMonths(today, startMonthOffset + i));

  const handlePrevMonths = () => setStartMonthOffset(prev => prev - 1);
  const handleNextMonths = () => setStartMonthOffset(prev => prev + 1);

  // Helper to parse the JSON value and get a month's specific data
  const getDriverMonthValue = (jsonValue: string | null, targetDate: Date) => {
    if (!jsonValue) return "—";
    try {
      const parsed = JSON.parse(jsonValue);
      const year = targetDate.getFullYear().toString();
      const month = (targetDate.getMonth() + 1).toString().padStart(2, "0");
      const monthKey = `${year}-${month}`;
      
      if (parsed[monthKey]) {
        return parsed[monthKey];
      }
      return "—";
    } catch {
      return "—";
    }
  };


  return (
    <div className="flex-1 flex flex-col p-8 lg:p-12 overflow-y-auto">
      
      {/* Header section */}
      <div className="mb-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-[28px] font-bold tracking-tight text-foreground">Organisation Drivers</h1>
          <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-foreground/60 flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-foreground/40" />
            Virtual demo
          </span>
        </div>
        <p className="text-foreground/60 text-sm mb-6 max-w-3xl">
          Use in formulas when budgeting or forecasting and in reports as data rows and in report row formulas.
        </p>

        {/* Actions Row */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold bg-[#118B50] hover:brightness-110 text-white transition-all shadow-sm text-sm"
          >
            Create Driver
          </button>
          <button 
            onClick={() => setIsExcelModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold border-2 border-[#118B50] text-[#118B50] hover:bg-[#118B50]/20 transition-all text-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel upload
          </button>
          <button 
            onClick={() => setIsGroupModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold border-2 border-[#118B50] text-[#118B50] hover:bg-[#118B50]/20 transition-all text-sm"
          >
            Create group
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold border-2 border-[#118B50] text-[#118B50] hover:bg-[#118B50]/20 transition-all text-sm"
          >
            Reorder rows
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-[1400px] mx-auto w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-[#118B50]/30 border-t-[#118B50] rounded-full animate-spin" />
          </div>
        ) : drivers.length > 0 || groups.length > 0 ? (
          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 shadow-sm overflow-x-auto rounded-xl">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="bg-[#fcfcfc] dark:bg-[#1a1a1a]">
                <tr>
                  {/* Search Column */}
                  <th className="min-w-[200px] w-[300px] border-b border-r border-[#e5e5e5] dark:border-white/10 p-0 relative">
                    <input 
                      type="text" 
                      placeholder="Search..."
                      className="w-full h-full py-3 px-4 focus:outline-none text-sm font-normal text-foreground/80 placeholder-foreground/40 bg-transparent"
                    />
                    <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40" />
                  </th>
                  
                  {/* Monthly Columns */}
                  {monthColumns.map((date, idx) => (
                    <th key={idx} className="min-w-[100px] border-b border-r border-[#e5e5e5] dark:border-white/10 px-2 py-3 text-center text-xs font-semibold text-foreground/60 uppercase relative">
                      {idx === 0 && (
                        <button onClick={handlePrevMonths} className="absolute left-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-foreground/5 rounded text-foreground/80">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      )}
                      
                      {format(date, 'MMM yy')}
                      
                      {idx === monthColumns.length - 1 && (
                        <button onClick={handleNextMonths} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-foreground/5 rounded text-foreground/80">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e5] dark:divide-white/10">
                {/* Render Groups */}
                {groups.map(group => {
                  const isExpanded = expandedGroups[group.id] ?? true;
                  const groupDrivers = groupedDrivers.groupsMap.get(group.id) || [];
                  
                  return (
                    <React.Fragment key={group.id}>
                      {/* Group Header Row */}
                      <tr className="bg-gray-100 dark:bg-white/5 border-b border-[#e5e5e5] dark:border-white/10 group">
                        <td 
                          className="px-4 py-3 text-sm font-medium text-foreground border-r border-[#e5e5e5] dark:border-white/10 flex items-center justify-between cursor-pointer"
                          onClick={() => toggleGroup(group.id)}
                        >
                          <div className="flex items-center gap-2">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-foreground/60" /> : <ChevronRightIcon className="w-4 h-4 text-foreground/60" />}
                            {group.name}
                          </div>
                          
                          <div className="hidden group-hover:flex items-center gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                const newName = window.prompt("Enter new group name:", group.name);
                                if (newName && newName.trim() !== group.name) {
                                  updateGroup(group.id, newName.trim());
                                }
                              }}
                              className="p-1 hover:bg-foreground/10 rounded text-foreground/60 hover:text-foreground transition-colors"
                              title="Edit group"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete the group "${group.name}"? Drivers in this group will not be deleted, they will just be ungrouped.`)) {
                                  deleteGroup(group.id);
                                }
                              }}
                              className="p-1 hover:bg-red-500/10 rounded text-foreground/60 hover:text-red-500 transition-colors"
                              title="Delete group"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        {monthColumns.map((_, idx) => (
                          <td key={idx} className="px-4 py-3 text-sm text-foreground/40 text-center border-r border-[#e5e5e5] dark:border-white/10">
                            —
                          </td>
                        ))}
                      </tr>
                      
                      {/* Group Children Rows */}
                      {isExpanded && groupDrivers.map(d => (
                        <tr key={d.id} className="hover:bg-foreground/[0.02] transition-colors group">
                          <td className="pl-10 pr-4 py-3 text-sm font-medium text-foreground border-r border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111] flex items-center justify-between">
                            <span>{d.name}</span>
                            <div className="hidden group-hover:flex items-center">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(`Are you sure you want to delete the driver "${d.name}"?`)) {
                                    deleteDriver(d.id);
                                  }
                                }}
                                className="p-1 hover:bg-red-500/10 rounded text-foreground/60 hover:text-red-500 transition-colors"
                                title="Delete driver"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                          {monthColumns.map((date, idx) => (
                            <td key={idx} className="px-4 py-3 text-sm text-foreground/80 text-center border-r border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111]">
                              {getDriverMonthValue(d.value, date)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}

                {/* Render Ungrouped Drivers */}
                {groupedDrivers.ungrouped.map(d => (
                  <tr key={d.id} className="hover:bg-foreground/[0.02] transition-colors group">
                    <td className="px-4 py-3 text-sm font-medium text-foreground border-r border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111] flex items-center justify-between">
                      <span>{d.name}</span>
                      <div className="hidden group-hover:flex items-center">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm(`Are you sure you want to delete the driver "${d.name}"?`)) {
                              deleteDriver(d.id);
                            }
                          }}
                          className="p-1 hover:bg-red-500/10 rounded text-foreground/60 hover:text-red-500 transition-colors"
                          title="Delete driver"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    {monthColumns.map((date, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm text-foreground/80 text-center border-r border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#111]">
                        {getDriverMonthValue(d.value, date)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-foreground/40 bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 p-12 text-center rounded-xl shadow-sm">
            <div className="w-24 h-24 bg-[#118B50]/10 rounded-full flex items-center justify-center mb-6">
              <LayoutTemplate className="w-12 h-12 text-[#118B50]" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-3">Your drivers will appear here</h2>
            <p className="text-foreground/60 max-w-md">Create drivers using the freestyle or formula method above.</p>
          </div>
        )}
      </div>

      <DriversExcelUploadPanel 
        isOpen={isExcelModalOpen} 
        onClose={() => setIsExcelModalOpen(false)} 
      />

      <CreateDriverPanel 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          const success = await createDriver(data);
          return success;
        }}
        groups={groups}
      />

      {/* Create Group Modal */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111] border border-[#e5e5e5] dark:border-white/10 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 relative">
            <h3 className="text-xl font-bold mb-4 text-[#1a1a1a] dark:text-white">Create Group</h3>
            <input 
              type="text"
              placeholder="Group name"
              value={newGroupName}
              onChange={e => setNewGroupName(e.target.value)}
              className="w-full px-4 py-2.5 mb-6 rounded-lg border border-[#e5e5e5] dark:border-white/10 bg-transparent text-foreground focus:outline-none focus:border-[#118B50] focus:ring-1 focus:ring-[#118B50]"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsGroupModalOpen(false)}
                className="px-4 py-2 rounded-full font-semibold border border-[#e5e5e5] dark:border-white/10 text-foreground hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateGroup}
                disabled={isCreatingGroup || !newGroupName.trim()}
                className="px-4 py-2 rounded-full font-semibold bg-[#118B50] text-white hover:brightness-110 disabled:opacity-50 transition-colors"
              >
                {isCreatingGroup ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

