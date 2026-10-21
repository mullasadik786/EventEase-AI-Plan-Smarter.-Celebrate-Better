import React, { useState } from 'react';
import {
  X,
  FileText,
  Download,
  Copy,
  Printer,
  Check,
  Share2,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { AppEvent, BudgetItem, Guest, TimelineTask, Vendor } from '../types';
import { exportToCSV, formatCurrency, formatDate } from '../lib/formatters';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeEvent: AppEvent;
  budgetItems: BudgetItem[];
  tasks: TimelineTask[];
  guests: Guest[];
  vendors: Vendor[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  activeEvent,
  budgetItems,
  tasks,
  guests,
  vendors
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currency = activeEvent.currency;

  const handleCopySummary = () => {
    const summaryText = `🎉 EVENT SUMMARY: ${activeEvent.title}
Occasion: ${activeEvent.eventType}
Date: ${formatDate(activeEvent.date)}
Location: ${activeEvent.location}
Guest Target: ${activeEvent.guestCount}
Total Budget: ${formatCurrency(activeEvent.totalBudget, currency)}
Contingency: ${activeEvent.contingencyPercent}% (${formatCurrency(Math.round(activeEvent.totalBudget * (activeEvent.contingencyPercent / 100)), currency)})
Theme: ${activeEvent.theme}
Style: ${activeEvent.style}
Vision: ${activeEvent.vision}

📊 BUDGET COMMITTED:
Estimated: ${formatCurrency(budgetItems.reduce((a, b) => a + b.estimatedCost, 0), currency)}
Actual Committed: ${formatCurrency(budgetItems.reduce((a, b) => a + b.actualCost, 0), currency)}

👥 GUESTS:
Confirmed Attendees: ${guests.filter(g => g.rsvpStatus === 'confirmed').reduce((s, g) => s + 1 + g.plusOnes, 0)}

Prepared via EventEase AI — Plan Smarter. Celebrate Better.`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportBudgetCsv = () => {
    const headers = ['Category', 'Name', 'Estimated', 'Actual', 'Paid', 'Status', 'Vendor'];
    const rows = budgetItems.map((b) => [
      b.category,
      b.name,
      b.estimatedCost,
      b.actualCost,
      b.paidAmount,
      b.status,
      b.vendorName || ''
    ]);
    exportToCSV(`${activeEvent.title}_Budget.csv`, [headers, ...rows]);
  };

  const handleExportGuestsCsv = () => {
    const headers = ['Name', 'Group', 'RSVP', 'PlusOnes', 'MealPreference', 'Table', 'Phone', 'Email'];
    const rows = guests.map((g) => [
      g.name,
      g.group,
      g.rsvpStatus,
      g.plusOnes,
      g.mealPreference,
      g.tableNumber || '',
      g.phone,
      g.email
    ]);
    exportToCSV(`${activeEvent.title}_Guests.csv`, [headers, ...rows]);
  };

  const handleExportTasksCsv = () => {
    const headers = ['Title', 'Due Date', 'Category', 'Priority', 'Status', 'Owner', 'Notes'];
    const rows = tasks.map((t) => [
      t.title,
      t.dueDate,
      t.category,
      t.priority,
      t.status,
      t.owner,
      t.notes || ''
    ]);
    exportToCSV(`${activeEvent.title}_Tasks.csv`, [headers, ...rows]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#5B5CF0]" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Export Event Brief & Data
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-5">
          Export your complete plan and spreadsheets to share with family elders, financial managers, caterers, and venue coordinators.
        </p>

        <div className="space-y-3 text-xs">
          {/* Action 1: Copy Summary Brief */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5B5CF0] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Event Summary Brief</p>
                <p className="text-[11px] text-slate-500">Copy formatted text overview for WhatsApp / Email</p>
              </div>
            </div>
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Action 2: Budget CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Budget & Expense Sheet</p>
                <p className="text-[11px] text-slate-500">Download formatted CSV with estimates & actuals</p>
              </div>
            </div>
            <button
              onClick={handleExportBudgetCsv}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Action 3: Guests CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Guest List & RSVPs</p>
                <p className="text-[11px] text-slate-500">Download attendee roster, tables, and dietary preferences</p>
              </div>
            </div>
            <button
              onClick={handleExportGuestsCsv}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-pink-50 hover:text-pink-700 font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Action 4: Tasks CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Timeline & Tasks Checklist</p>
                <p className="text-[11px] text-slate-500">Download deadlines, task owners, and milestone status</p>
              </div>
            </div>
            <button
              onClick={handleExportTasksCsv}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-amber-50 hover:text-amber-700 font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV</span>
            </button>
          </div>

          {/* Action 5: Print Run Sheet */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Print Day-Of Run Sheet</p>
                <p className="text-[11px] text-slate-500">Physical paper format for organizers & leads</p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                window.print();
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        <div className="pt-5 border-t border-slate-100 flex justify-end mt-5">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
