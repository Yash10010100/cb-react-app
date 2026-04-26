import React, { useState } from 'react';
import { Search, ChevronDown, Filter, Download, Eye, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Button from '../components/ui/Button';

// Dummy data representing participants based on Image 2
const participantsData = [
  { id: 1, name: 'Alex Rivera', email: 'a.rivera@university.edu', event: 'Annual Tech Symposium', date: 'Oct 24, 2023', status: 'APPROVED' },
  { id: 2, name: 'Jordan Smith', email: 'jordan.s@university.edu', event: 'Spring Music Fest', date: 'Oct 25, 2023', status: 'PENDING' },
  { id: 3, name: 'Maya Chen', email: 'm.chen@university.edu', event: 'Alumni Career Mixer', date: 'Oct 22, 2023', status: 'REJECTED' },
  { id: 4, name: 'Lucas Graham', email: 'lgraham@university.edu', event: 'Annual Tech Symposium', date: 'Oct 26, 2023', status: 'APPROVED' },
];

const statusStyles = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-indigo-100 text-indigo-700',
  REJECTED: 'bg-gray-100 text-gray-500',
};

const ManageParticipants = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <DashboardLayout role="organizer" userName="Curator">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Participants</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage attendee registrations for your events</p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Find by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-indigo-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option>Select Event</option>
                <option>Annual Tech Symposium</option>
                <option>Spring Music Fest</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium outline-none cursor-pointer focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                <option>Status</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
              <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <Button variant="outline" className="gap-2 bg-white flex items-center shadow-sm">
              <Download size={16} className="text-indigo-600" />
              <span className="font-semibold text-indigo-700">Export CSV</span>
            </Button>
          </div>
        </div>

        {/* Custom Data Table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase">Event Name</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase">Registration Date</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 font-semibold text-xs tracking-widest text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {participantsData.map((participant) => (
                  <tr key={participant.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {participant.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-gray-900">{participant.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {participant.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="w-32 whitespace-normal leading-snug">{participant.event}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {participant.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyles[participant.status]}`}>
                        {participant.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right right-0">
                      <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                        {participant.status === 'PENDING' ? (
                          <>
                            <button className="p-1.5 text-gray-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors" title="View Details">
                              <Eye size={16} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50 transition-colors" title="Approve">
                              <Check size={16} />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors" title="Reject">
                              <X size={16} />
                            </button>
                          </>
                        ) : (
                          <div className="h-8"></div> // Placeholder to maintain row height
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-white text-sm text-gray-500">
            <span>Showing 1-4 of 128 registrations</span>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-400" disabled>
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageParticipants;
