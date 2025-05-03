"use client";

import { useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Report } from '@/types/report';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface QuickStatsProps {
  reports: Report[];
}

export default function QuickStats({ reports: initialReports }: QuickStatsProps) {
  const [reports, setReports] = useState(initialReports);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const stats = {
    newPatients: reports.length,
    urgent: reports.filter(r => r.is_urgent).length,
    pendingConsultations: 3, // Placeholder
    savedForLater: reports.filter(r => r.is_bookmarked).length,
  };

  const changes = {
    newPatients: '+10%',
    urgent: '-5%',
    pendingConsultations: '+15%',
    savedForLater: '+20%',
  };

  const bookmarkedReports = reports.filter(r => r.is_bookmarked);

  const handleUpdateReport = async (reportId: string, updates: Partial<Report>) => {
    // Update local state immediately
    setReports(prevReports => 
      prevReports.map(report => 
        report.id === reportId 
          ? { ...report, ...updates }
          : report
      )
    );

    // Update in database
    const { error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', reportId);

    if (error) {
      console.error('Error updating report:', error);
      // Revert local state if update failed
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, ...Object.fromEntries(Object.entries(updates).map(([key, value]) => [key, !value])) }
            : report
        )
      );
    } else {
      // Refresh the server-side props to keep everything in sync
      router.refresh();
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">New Patients</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold">{stats.newPatients}</p>
          <p className="text-sm text-green-600">{changes.newPatients}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">Urgent</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold">{stats.urgent}</p>
          <p className="text-sm text-red-600">{changes.urgent}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">Pending Consultations</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold">{stats.pendingConsultations}</p>
          <p className="text-sm text-green-600">{changes.pendingConsultations}</p>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50"
          onClick={() => setIsBookmarksOpen(true)}
        >
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-medium text-gray-500">Saved for later</h3>
          </div>
          <p className="mt-2 text-3xl font-semibold">{stats.savedForLater}</p>
          <p className="text-sm text-green-600">{changes.savedForLater}</p>
        </div>
      </div>

      {/* Bookmarks Dialog */}
      <Dialog
        open={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl rounded-xl bg-white p-6 w-full">
            <Dialog.Title className="text-lg font-medium mb-4">
              Bookmarked Reports
            </Dialog.Title>

            <div className="space-y-4">
              {bookmarkedReports.length > 0 ? (
                bookmarkedReports.map(report => (
                  <div 
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      window.location.href = `/dashboard/${report.id}`;
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Report #{report.id}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(report.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateReport(report.id, { is_bookmarked: false });
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No bookmarked reports yet
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsBookmarksOpen(false)}
              >
                Close
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
} 