import React, { useState } from 'react';
import {
  DollarSign,
  PlusCircle,
  Download,
  AlertTriangle,
  TrendingUp,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  Sparkles,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';
import { AppEvent, BudgetItem } from '../types';
import { formatCurrency, exportToCSV } from '../lib/formatters';

interface BudgetViewProps {
  activeEvent: AppEvent;
  budgetItems: BudgetItem[];
  onAddBudgetItem: (item: BudgetItem) => void;
  onUpdateBudgetItem: (item: BudgetItem) => void;
  onDeleteBudgetItem: (id: string) => void;
  onUpdateEventBudget: (newBudget: number, contingencyPercent: number) => void;
}

export const BudgetView: React.FC<BudgetViewProps> = ({
  activeEvent,
  budgetItems,
  onAddBudgetItem,
  onUpdateBudgetItem,
  onDeleteBudgetItem,
  onUpdateEventBudget
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Budget Adjust Modal
  const [isAdjustBudgetOpen, setIsAdjustBudgetOpen] = useState(false);
  const [editTotalBudget, setEditTotalBudget] = useState(activeEvent.totalBudget);
  const [editContingency, setEditContingency] = useState(activeEvent.contingencyPercent || 10);

  // Form state
  const [category, setCategory] = useState('Catering & Beverages');
  const [name, setName] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(50000);
  const [actualCost, setActualCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [status, setStatus] = useState<'unpaid' | 'deposit_paid' | 'fully_paid'>('unpaid');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');

  const currency = activeEvent.currency;
  const totalBudget = activeEvent.totalBudget;
  const contingencyPercent = activeEvent.contingencyPercent || 10;
  const contingencyAmount = Math.round(totalBudget * (contingencyPercent / 100));
  const availablePlanningBudget = totalBudget - contingencyAmount;

  // Authoritative deterministic math
  const totalEstimatedCost = budgetItems.reduce((acc, item) => acc + (item.estimatedCost || 0), 0);
  const totalActualCost = budgetItems.reduce((acc, item) => acc + (item.actualCost || 0), 0);
  const totalPaid = budgetItems.reduce((acc, item) => acc + (item.paidAmount || 0), 0);
  const outstandingBalance = totalActualCost - totalPaid;
  const remainingBudget = totalBudget - totalActualCost;

  const categories = [
    'Venue & Accommodation',
    'Catering & Beverages',
    'Decoration & Lighting',
    'Photography & Videography',
    'Attire & Styling',
    'Invitations & Favors',
    'Entertainment & Music',
    'Transportation & Logistics',
    'Permits & Security',
    'Miscellaneous & Contingency'
  ];

  // Filtered Items
  const filteredItems = budgetItems.filter((item) => {
    if (filterCategory !== 'All' && item.category !== filterCategory) return false;
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setCategory('Catering & Beverages');
    setName('');
    setEstimatedCost(25000);
    setActualCost(0);
    setPaidAmount(0);
    setStatus('unpaid');
    setPriority('medium');
    setVendorName('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: BudgetItem) => {
    setEditingItem(item);
    setCategory(item.category);
    setName(item.name);
    setEstimatedCost(item.estimatedCost);
    setActualCost(item.actualCost);
    setPaidAmount(item.paidAmount);
    setStatus(item.status);
    setPriority(item.priority);
    setVendorName(item.vendorName || '');
    setNotes(item.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      onUpdateBudgetItem({
        ...editingItem,
        category,
        name,
        estimatedCost: Number(estimatedCost),
        actualCost: Number(actualCost),
        paidAmount: Number(paidAmount),
        status,
        priority,
        vendorName,
        notes
      });
    } else {
      const newItem: BudgetItem = {
        id: `b-${Date.now()}`,
        eventId: activeEvent.id,
        category,
        name,
        estimatedCost: Number(estimatedCost),
        actualCost: Number(actualCost),
        paidAmount: Number(paidAmount),
        status,
        priority,
        vendorName,
        notes
      };
      onAddBudgetItem(newItem);
    }

    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Expense Name',
      'Priority',
      'Estimated Cost',
      'Actual Cost',
      'Paid Amount',
      'Balance Due',
      'Status',
      'Vendor Name',
      'Notes'
    ];

    const rows = budgetItems.map((item) => [
      item.category,
      item.name,
      item.priority,
      item.estimatedCost,
      item.actualCost,
      item.paidAmount,
      item.actualCost - item.paidAmount,
      item.status,
      item.vendorName || '',
      item.notes || ''
    ]);

    exportToCSV(`${activeEvent.title.replace(/\s+/g, '_')}_Budget_Report.csv`, [headers, ...rows]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Financial Control
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">{currency} Calculations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Smart Budget Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Deterministic arithmetic tracking estimates vs actual costs for {activeEvent.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAdjustBudgetOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Adjust Total Budget</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Event Budget
          </span>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {formatCurrency(totalBudget, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Reserved contingency: <strong className="text-slate-700">{formatCurrency(contingencyAmount, currency)} ({contingencyPercent}%)</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Available Planning Cap
          </span>
          <div className="text-2xl font-black text-indigo-600 font-heading">
            {formatCurrency(availablePlanningBudget, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Allocated: <strong className="text-slate-700">{formatCurrency(totalEstimatedCost, currency)}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Actual Spent / Committed
          </span>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {formatCurrency(totalActualCost, currency)}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Deposits paid: <strong className="text-emerald-600">{formatCurrency(totalPaid, currency)}</strong>
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-2xs ${
          remainingBudget >= 0
            ? 'bg-emerald-50/50 border-emerald-200/80'
            : 'bg-rose-50/50 border-rose-200/80'
        }`}>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
            Remaining Budget
          </span>
          <div className={`text-2xl font-black font-heading ${
            remainingBudget >= 0 ? 'text-emerald-700' : 'text-rose-700'
          }`}>
            {formatCurrency(remainingBudget, currency)}
          </div>
          <p className="text-[11px] text-slate-600 mt-1">
            Balance due to vendors: <strong className="text-slate-800">{formatCurrency(outstandingBalance, currency)}</strong>
          </p>
        </div>
      </div>

      {/* Filter and Category Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Controls toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
            >
              <option value="All">All Categories ({budgetItems.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
            >
              <option value="All">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="deposit_paid">Deposit Paid</option>
              <option value="fully_paid">Fully Paid</option>
            </select>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredItems.length} of {budgetItems.length} expenses
          </span>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Item & Category</th>
                <th className="py-3 px-4">Vendor Partner</th>
                <th className="py-3 px-4 text-right">Estimated</th>
                <th className="py-3 px-4 text-right">Actual</th>
                <th className="py-3 px-4 text-right">Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No expense records found. Click "+ Add Expense" to start.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isOverrun = item.actualCost > item.estimatedCost && item.estimatedCost > 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>{item.category}</span>
                          <span>•</span>
                          <span className={`capitalize text-[10px] font-bold ${
                            item.priority === 'high' ? 'text-rose-600' : 'text-slate-500'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600">
                        {item.vendorName || <span className="text-slate-300 italic">Not assigned</span>}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-slate-600">
                        {formatCurrency(item.estimatedCost, currency)}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span className={`font-bold ${isOverrun ? 'text-rose-600' : 'text-slate-900'}`}>
                          {formatCurrency(item.actualCost, currency)}
                        </span>
                        {isOverrun && (
                          <span className="block text-[10px] text-rose-500 font-semibold">
                            +{formatCurrency(item.actualCost - item.estimatedCost, currency)}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right font-semibold text-emerald-600">
                        {formatCurrency(item.paidAmount, currency)}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'fully_paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'deposit_paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                            title="Edit expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteBudgetItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {editingItem ? 'Edit Expense Item' : 'Add New Budget Expense'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Expense Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mandap Floral Architecture"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Estimated Cost ({currency})</label>
                  <input
                    type="number"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Actual Cost ({currency})</label>
                  <input
                    type="number"
                    value={actualCost}
                    onChange={(e) => setActualCost(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Amount Paid Deposit</label>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="deposit_paid">Deposit Paid</option>
                    <option value="fully_paid">Fully Paid</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Vendor Partner (Optional)</label>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Annapurna Royal Catering"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Inclusions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key deliverables, payment milestones..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#5B5CF0] resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5B5CF0] hover:bg-[#494ACF] text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  {editingItem ? 'Save Changes' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Budget Modal */}
      {isAdjustBudgetOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 font-heading mb-4">
              Adjust Overall Event Budget & Contingency
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Total Event Budget ({currency})</label>
                <input
                  type="number"
                  step={1000}
                  value={editTotalBudget}
                  onChange={(e) => setEditTotalBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] text-sm font-semibold"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contingency Emergency Reserve (%)</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={editContingency}
                  onChange={(e) => setEditContingency(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] text-sm"
                />
                <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                  Reserved amount: {formatCurrency(Math.round(editTotalBudget * (editContingency / 100)), currency)}
                </span>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setIsAdjustBudgetOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateEventBudget(Number(editTotalBudget), Number(editContingency));
                    setIsAdjustBudgetOpen(false);
                  }}
                  className="px-5 py-2 bg-[#5B5CF0] hover:bg-[#494ACF] text-white rounded-xl font-bold shadow-md shadow-indigo-500/20"
                >
                  Update Budget
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
