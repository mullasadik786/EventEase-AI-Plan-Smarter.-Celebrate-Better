import React, { useState, useRef } from 'react';
import {
  Users,
  PlusCircle,
  Download,
  Upload,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Mail,
  Phone,
  Utensils,
  Edit2,
  Trash2,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { AppEvent, Guest, MealPreference, RSVPStatus } from '../types';
import { exportToCSV } from '../lib/formatters';

interface GuestsViewProps {
  activeEvent: AppEvent;
  guests: Guest[];
  onAddGuest: (guest: Guest) => void;
  onUpdateGuest: (guest: Guest) => void;
  onDeleteGuest: (id: string) => void;
  onBulkAddGuests: (newGuests: Guest[]) => void;
}

export const GuestsView: React.FC<GuestsViewProps> = ({
  activeEvent,
  guests,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  onBulkAddGuests
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRsvp, setFilterRsvp] = useState<string>('All');
  const [filterGroup, setFilterGroup] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [group, setGroup] = useState('Family');
  const [rsvpStatus, setRsvpStatus] = useState<RSVPStatus>('confirmed');
  const [plusOnes, setPlusOnes] = useState<number>(0);
  const [mealPreference, setMealPreference] = useState<MealPreference>('Vegetarian');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Attendance metrics
  const confirmedAttendees = guests
    .filter((g) => g.rsvpStatus === 'confirmed')
    .reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);

  const pendingCount = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const declinedCount = guests.filter((g) => g.rsvpStatus === 'declined').length;
  const totalInvited = guests.reduce((sum, g) => sum + 1 + (g.plusOnes || 0), 0);

  // Meal breakdown
  const mealTally: { [key: string]: number } = {};
  guests
    .filter((g) => g.rsvpStatus === 'confirmed')
    .forEach((g) => {
      const count = 1 + (g.plusOnes || 0);
      mealTally[g.mealPreference] = (mealTally[g.mealPreference] || 0) + count;
    });

  const filteredGuests = guests.filter((g) => {
    if (filterRsvp !== 'All' && g.rsvpStatus !== filterRsvp) return false;
    if (filterGroup !== 'All' && g.group !== filterGroup) return false;
    if (searchQuery.trim() && !g.name.toLowerCase().includes(searchQuery.toLowerCase()) && !g.email.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingGuest(null);
    setName('');
    setEmail('');
    setPhone('');
    setGroup('Family');
    setRsvpStatus('confirmed');
    setPlusOnes(0);
    setMealPreference('Vegetarian');
    setDietaryNotes('');
    setTableNumber('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (g: Guest) => {
    setEditingGuest(g);
    setName(g.name);
    setEmail(g.email);
    setPhone(g.phone);
    setGroup(g.group);
    setRsvpStatus(g.rsvpStatus);
    setPlusOnes(g.plusOnes);
    setMealPreference(g.mealPreference);
    setDietaryNotes(g.dietaryNotes || '');
    setTableNumber(g.tableNumber || '');
    setNotes(g.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingGuest) {
      onUpdateGuest({
        ...editingGuest,
        name,
        email,
        phone,
        group,
        rsvpStatus,
        plusOnes: Number(plusOnes),
        mealPreference,
        dietaryNotes,
        tableNumber,
        notes
      });
    } else {
      const newGuest: Guest = {
        id: `g-${Date.now()}`,
        eventId: activeEvent.id,
        name,
        email,
        phone,
        group,
        rsvpStatus,
        plusOnes: Number(plusOnes),
        mealPreference,
        dietaryNotes,
        tableNumber,
        notes
      };
      onAddGuest(newGuest);
    }
    setIsModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Name',
      'Group',
      'RSVP Status',
      'Plus Ones',
      'Total Seats',
      'Meal Preference',
      'Dietary Notes',
      'Table Assignment',
      'Phone',
      'Email',
      'Notes'
    ];

    const rows = guests.map((g) => [
      g.name,
      g.group,
      g.rsvpStatus,
      g.plusOnes,
      1 + g.plusOnes,
      g.mealPreference,
      g.dietaryNotes || '',
      g.tableNumber || '',
      g.phone,
      g.email,
      g.notes || ''
    ]);

    exportToCSV(`${activeEvent.title.replace(/\s+/g, '_')}_Guest_List.csv`, [headers, ...rows]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const lines = content.split('\n').filter((l) => l.trim().length > 0);
      const parsedGuests: Guest[] = [];

      // Assume first line is header if contains "Name"
      const startIndex = lines[0].toLowerCase().includes('name') ? 1 : 0;

      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
        if (parts[0]) {
          parsedGuests.push({
            id: `g-import-${Date.now()}-${i}`,
            eventId: activeEvent.id,
            name: parts[0],
            email: parts[1] || '',
            phone: parts[2] || '',
            group: parts[3] || 'Friends',
            rsvpStatus: (parts[4]?.toLowerCase() as any) || 'pending',
            plusOnes: Number(parts[5]) || 0,
            mealPreference: (parts[6] as any) || 'Vegetarian',
            tableNumber: parts[7] || '',
            notes: 'Imported from CSV'
          });
        }
      }

      if (parsedGuests.length > 0) {
        onBulkAddGuests(parsedGuests);
        alert(`Successfully imported ${parsedGuests.length} guests!`);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Hospitality & RSVP
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">Capacity: {activeEvent.guestCount} Target</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Guest List & RSVPs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage invitations, seating tables, plus-ones, and dietary catering counts for {activeEvent.title}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Guest</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Target Capacity
          </span>
          <div className="text-2xl font-black text-[#14213D] font-heading">
            {activeEvent.guestCount} <span className="text-xs font-normal text-slate-500">seats</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Invited list headcount: <strong className="text-slate-800">{totalInvited}</strong>
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Confirmed Attendees
          </span>
          <div className="text-2xl font-black text-emerald-600 font-heading">
            {confirmedAttendees}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Guaranteed catering plates required
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Pending Responses
          </span>
          <div className="text-2xl font-black text-amber-600 font-heading">
            {pendingCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Awaiting RSVP follow-up calls
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
            Declined Invitations
          </span>
          <div className="text-2xl font-black text-rose-600 font-heading">
            {declinedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Seats freed up for waitlist
          </p>
        </div>
      </div>

      {/* Catering Meal Counts Strip */}
      <div className="bg-gradient-to-r from-amber-50/70 to-orange-50/60 p-4 rounded-2xl border border-amber-200/70 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-amber-700" />
          <span className="font-bold text-amber-900">Confirmed Catering Count Breakdown:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {Object.entries(mealTally).map(([meal, count]) => (
            <span key={meal} className="bg-white/90 px-3 py-1 rounded-xl shadow-2xs font-semibold text-slate-800">
              {meal}: <strong className="text-[#5B5CF0]">{count}</strong>
            </span>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guest by name or email..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5B5CF0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterRsvp}
            onChange={(e) => setFilterRsvp(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All RSVP Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="declined">Declined</option>
            <option value="invited">Invited</option>
          </select>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Groups</option>
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Colleagues">Colleagues</option>
            <option value="VIP">VIP</option>
          </select>
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Guest Name & Group</th>
                <th className="py-3 px-4 text-center">RSVP</th>
                <th className="py-3 px-4 text-center">Plus-Ones</th>
                <th className="py-3 px-4">Meal Preference</th>
                <th className="py-3 px-4">Table / Seating</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No guests found. Click "+ Add Guest" or "Import CSV" to populate your invite list.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{guest.name}</div>
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.2 rounded-md font-medium">
                        {guest.group}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        guest.rsvpStatus === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : guest.rsvpStatus === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {guest.rsvpStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                      +{guest.plusOnes} ({1 + guest.plusOnes} seats)
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-900 block">{guest.mealPreference}</span>
                      {guest.dietaryNotes && (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-sm block mt-0.5">
                          {guest.dietaryNotes}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      {guest.tableNumber || <span className="text-slate-300 italic">Unassigned</span>}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-500">
                      {guest.phone && <div>{guest.phone}</div>}
                      {guest.email && <div className="text-slate-400 truncate max-w-[140px]">{guest.email}</div>}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Edit guest"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGuest(guest.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete guest"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {editingGuest ? 'Edit Guest Details' : 'Add Guest to Celebration'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuest} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Guest / Family Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Venkatesh & Sumathi Rao"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Group / Affiliation</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="Family">Family</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="VIP">VIP</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">RSVP Status</label>
                  <select
                    value={rsvpStatus}
                    onChange={(e) => setRsvpStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="pending">Pending</option>
                    <option value="declined">Declined</option>
                    <option value="invited">Invited</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Plus-Ones Count</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={plusOnes}
                    onChange={(e) => setPlusOnes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Meal Preference</label>
                  <select
                    value={mealPreference}
                    onChange={(e) => setMealPreference(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Jain">Jain (No Root Veg)</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Halal">Halal</option>
                    <option value="Gluten-Free">Gluten-Free</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dietary Allergies / Notes</label>
                  <input
                    type="text"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="e.g. Nut allergy, diabetic"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Table Assignment</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="e.g. Table 1 (Elders)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Special Notes / Accessibility</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ground floor seating required, arriving from out-of-town..."
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
                  {editingGuest ? 'Save Changes' : 'Add Guest'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
