import React, { useState } from 'react';
import {
  Store,
  PlusCircle,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  FileText,
  DollarSign,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { AppEvent, Vendor } from '../types';
import { formatCurrency } from '../lib/formatters';

interface VendorsViewProps {
  activeEvent: AppEvent;
  vendors: Vendor[];
  onAddVendor: (vendor: Vendor) => void;
  onUpdateVendor: (vendor: Vendor) => void;
  onDeleteVendor: (id: string) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({
  activeEvent,
  vendors,
  onAddVendor,
  onUpdateVendor,
  onDeleteVendor
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Comparison State
  const [comparingIds, setComparingIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Caterers');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('₹₹₹');
  const [serviceDescription, setServiceDescription] = useState('');
  const [quotedAmount, setQuotedAmount] = useState(0);
  const [depositPaid, setDepositPaid] = useState(0);
  const [status, setStatus] = useState<'shortlisted' | 'contacted' | 'booked' | 'declined'>('shortlisted');
  const [rating, setRating] = useState(4.8);
  const [contactPerson, setContactPerson] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [image, setImage] = useState('');

  const currency = activeEvent.currency;

  const categories = [
    'Venues',
    'Caterers',
    'Decorators',
    'Photographers',
    'Videographers',
    'Florists',
    'Makeup artists',
    'DJs and musicians',
    'Bakers',
    'Transportation',
    'Event coordinators'
  ];

  const filteredVendors = vendors.filter((v) => {
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    if (selectedStatus !== 'All' && v.status !== selectedStatus) return false;
    if (searchQuery.trim() && !v.name.toLowerCase().includes(searchQuery.toLowerCase()) && !v.location.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleToggleCompare = (id: string) => {
    if (comparingIds.includes(id)) {
      setComparingIds(comparingIds.filter((cid) => cid !== id));
    } else {
      if (comparingIds.length >= 3) {
        alert('You can compare up to 3 vendors simultaneously.');
        return;
      }
      setComparingIds([...comparingIds, id]);
    }
  };

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setName('');
    setCategory('Caterers');
    setLocation(activeEvent.city);
    setPriceRange('₹₹₹');
    setServiceDescription('');
    setQuotedAmount(100000);
    setDepositPaid(0);
    setStatus('shortlisted');
    setRating(4.8);
    setContactPerson('');
    setContactPhone('');
    setContactEmail('');
    setNotes('');
    setImage('https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vendor) => {
    setEditingVendor(v);
    setName(v.name);
    setCategory(v.category);
    setLocation(v.location);
    setPriceRange(v.priceRange);
    setServiceDescription(v.serviceDescription);
    setQuotedAmount(v.quotedAmount);
    setDepositPaid(v.depositPaid);
    setStatus(v.status);
    setRating(v.rating);
    setContactPerson(v.contactPerson);
    setContactPhone(v.contactPhone);
    setContactEmail(v.contactEmail);
    setNotes(v.notes);
    setImage(v.image || '');
    setIsModalOpen(true);
  };

  const handleSaveVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingVendor) {
      onUpdateVendor({
        ...editingVendor,
        name,
        category,
        location,
        priceRange,
        serviceDescription,
        quotedAmount: Number(quotedAmount),
        depositPaid: Number(depositPaid),
        status,
        rating: Number(rating),
        contactPerson,
        contactPhone,
        contactEmail,
        notes,
        image
      });
    } else {
      const newV: Vendor = {
        id: `v-${Date.now()}`,
        eventId: activeEvent.id,
        name,
        category,
        location,
        priceRange,
        serviceDescription,
        quotedAmount: Number(quotedAmount),
        depositPaid: Number(depositPaid),
        status,
        rating: Number(rating),
        contactPerson,
        contactPhone,
        contactEmail,
        notes,
        image,
        isSample: false
      };
      onAddVendor(newV);
    }
    setIsModalOpen(false);
  };

  const compareList = vendors.filter((v) => comparingIds.includes(v.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B5CF0] bg-indigo-50 px-2.5 py-0.5 rounded-full">
              Partner Network
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-slate-600">{activeEvent.title}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14213D] font-heading">
            Vendor Directory & Quotes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Shortlist, compare quotes side-by-side, record contracts and deposit payments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {comparingIds.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Compare ({comparingIds.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 bg-[#5B5CF0] hover:bg-[#494ACF] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Custom Vendor</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-800 text-xs flex items-center justify-between gap-3">
        <span>
          💡 <strong>Notice:</strong> Sample vendor entries represent illustrative demonstration data. Real contact details and quotes reflect your actual agreements entered manually.
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendor or city..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#5B5CF0]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
          >
            <option value="All">All Statuses</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="contacted">Contacted</option>
            <option value="booked">Booked</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
            No vendors found matching your filter criteria. Click "+ Add Custom Vendor" to create one.
          </div>
        ) : (
          filteredVendors.map((vendor) => {
            const isComparing = comparingIds.includes(vendor.id);
            return (
              <div
                key={vendor.id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={vendor.image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'}
                      alt={vendor.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-[10px] font-bold px-2.5 py-0.5 rounded-full text-slate-800 shadow-2xs">
                      {vendor.category}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-amber-400/90 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-2xs">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{vendor.rating}</span>
                    </div>

                    {vendor.isSample && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[9px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                        Sample Demo Partner
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 font-heading leading-tight">
                          {vendor.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{vendor.location}</span>
                        </p>
                      </div>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        vendor.status === 'booked'
                          ? 'bg-emerald-100 text-emerald-800'
                          : vendor.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : vendor.status === 'shortlisted'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {vendor.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {vendor.serviceDescription}
                    </p>

                    {/* Financial Snapshot */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Quote</span>
                        <strong className="text-slate-900 font-bold">{formatCurrency(vendor.quotedAmount, currency)}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">Deposit Paid</span>
                        <strong className="text-emerald-600 font-bold">{formatCurrency(vendor.depositPaid, currency)}</strong>
                      </div>
                    </div>

                    {/* Contact Person */}
                    {vendor.contactPerson && (
                      <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                        <p className="font-semibold text-slate-700">Contact: {vendor.contactPerson}</p>
                        {vendor.contactPhone && <p className="text-slate-500">{vendor.contactPhone}</p>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleCompare(vendor.id)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                      isComparing
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isComparing ? '✓ Comparing' : '+ Compare'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(vendor)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition"
                      title="Edit vendor"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteVendor(vendor.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-lg transition"
                      title="Delete vendor"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Side-by-Side Vendor Comparison Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">
                  Side-by-Side Vendor Comparison
                </h3>
                <p className="text-xs text-slate-500">Comparing {compareList.length} shortlisted options</p>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareList.map((v) => (
                <div key={v.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                  <h4 className="text-base font-bold text-slate-900 font-heading">{v.name}</h4>
                  <p className="text-[11px] text-slate-500">{v.category} • {v.location}</p>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-400 block font-medium">Quoted Amount</span>
                    <strong className="text-base text-[#5B5CF0] font-heading">{formatCurrency(v.quotedAmount, currency)}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Deposit Paid</span>
                    <strong className="text-emerald-600">{formatCurrency(v.depositPaid, currency)}</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Service Scope</span>
                    <p className="text-slate-700 mt-0.5 leading-relaxed">{v.serviceDescription}</p>
                  </div>

                  <div>
                    <span className="text-slate-400 block font-medium">Booking Status</span>
                    <span className="inline-block mt-0.5 font-bold uppercase text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-800">
                      {v.status}
                    </span>
                  </div>

                  {v.notes && (
                    <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-600">
                      <span className="font-semibold block text-[10px] text-slate-400 uppercase">Notes</span>
                      {v.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Vendor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900 font-heading">
                {editingVendor ? 'Edit Vendor Record' : 'Add Partner Vendor'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Business Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Annapurna Royal Catering Co."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">City / Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Banjara Hills, Hyderabad"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quoted Amount ({currency})</label>
                  <input
                    type="number"
                    value={quotedAmount}
                    onChange={(e) => setQuotedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deposit Paid</label>
                  <input
                    type="number"
                    value={depositPaid}
                    onChange={(e) => setDepositPaid(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Booking Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] bg-white"
                  >
                    <option value="shortlisted">Shortlisted</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Rating (1-5)</label>
                  <input
                    type="number"
                    step={0.1}
                    min={1}
                    max={5}
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Inclusions / Description</label>
                <textarea
                  rows={2}
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="e.g. Includes traditional banana leaf lunch and live jalebi counter..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98480 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#5B5CF0]"
                  />
                </div>
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
                  {editingVendor ? 'Save Changes' : 'Add Vendor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
