import React, { useState } from 'react';
import {
  Clock,
  Printer,
  Phone,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  User,
  ShieldAlert,
  FileText,
  DollarSign,
  PlusCircle,
  Trash2,
  X
} from 'lucide-react';
import { AppEvent, DayOfScheduleItem, Vendor, BudgetItem } from '../types';
import { formatCurrency, formatDate } from '../lib/formatters';

interface EventDayViewProps {
  activeEvent: AppEvent;
  scheduleItems: DayOfScheduleItem[];
  vendors: Vendor[];
  budgetItems: BudgetItem[];
  onToggleScheduleItem: (id: string) => void;
  onAddScheduleItem: (item: DayOfScheduleItem) => void;
  onDeleteScheduleItem: (id: string) => void;
}

export const EventDayView: React.FC<EventDayViewProps> = ({
  activeEvent,
  scheduleItems,
  vendors,
  budgetItems,
  onToggleScheduleItem,
  onAddScheduleItem,
  onDeleteScheduleItem
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState('09:00 AM');
  const [title, setTitle] = useState('');
  const [lead, setLead] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  const currency = activeEvent.currency;

  // Outstanding vendor balances
  const outstandingVendors = vendors.filter((v) => v.status === 'booked' && v.quotedAmount > v.depositPaid);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem: DayOfScheduleItem = {
      id: `s-${Date.now()}`,
      eventId: activeEvent.id,
      time,
      title,
      lead: lead || 'Host Coordinator',
      location: location || activeEvent.location,
      notes,
      completed: false
    };

    onAddScheduleItem(newItem);
    setTitle('');
    setNotes('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
              Day-Of Execution
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">{formatDate(activeEvent.date)}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Event-Day Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Hour-by-hour run sheet, lead vendor contacts, and critical emergency backups for {activeEvent.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Agenda Slot</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clean Run Sheet</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Header (Visible when printed or on screen) */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-5">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0]">
            Official Day-Of Master Run Sheet
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-heading mt-1">
            {activeEvent.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
            <span><strong>Date:</strong> {formatDate(activeEvent.date)}</span>
            <span>•</span>
            <span><strong>Location:</strong> {activeEvent.location}</span>
            <span>•</span>
            <span><strong>Guest Count:</strong> {activeEvent.guestCount} Attendees</span>
          </div>
        </div>

        {/* Emergency Contacts Strip */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Emergency & Lead Coordinators Directory</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {activeEvent.emergencyContacts?.map((contact, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{contact.role}</span>
                <p className="text-sm font-bold text-slate-900">{contact.name}</p>
                <p className="text-xs text-[#5B5CF0] font-semibold flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{contact.phone}</span>
                </p>
                {contact.notes && <p className="text-[10px] text-slate-500">{contact.notes}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Master Hour-by-Hour Timeline */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#5B5CF0]" />
            <span>Chronological Run Sheet Agenda</span>
          </h3>

          <div className="space-y-3">
            {scheduleItems.length === 0 ? (
              <p className="text-slate-400 text-xs py-4">No agenda items added yet.</p>
            ) : (
              scheduleItems.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 transition ${
                    item.completed ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => onToggleScheduleItem(item.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition cursor-pointer no-print ${
                        item.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-heading">
                          {item.time}
                        </span>
                        <h4 className={`text-sm font-bold ${item.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {item.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Lead: {item.lead}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.location}</span>
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteScheduleItem(item.id)}
                    className="text-slate-300 hover:text-rose-500 transition p-1 no-print"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Day-Of Outstanding Balance Reminders */}
        {outstandingVendors.length > 0 && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-amber-600" />
              <span>Day-Of Vendor Settlement Balances</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {outstandingVendors.map((v) => (
                <div key={v.id} className="p-2.5 bg-white rounded-xl border border-amber-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{v.name}</span>
                    <span className="text-[10px] text-slate-500">{v.contactPerson || v.contactPhone}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Due On Event Day</span>
                    <strong className="text-rose-600 font-bold">{formatCurrency(v.quotedAmount - v.depositPaid, currency)}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Agenda Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                Add Run Sheet Agenda Item
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Slot *</label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lead Coordinator</label>
                  <input
                    type="text"
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    placeholder="e.g. Lead Planner / Caterer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Traditional Muhurtham Ceremony Begins"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location on Venue</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Central Courtyard / Dining Lawn"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Notes & Inclusions</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Key instructions for emcee, sound team..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] resize-none"
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
                  Add Agenda Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
