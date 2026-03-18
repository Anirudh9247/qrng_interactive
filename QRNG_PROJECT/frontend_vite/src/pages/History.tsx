import { useState, useMemo, useEffect } from 'react';
import { Download, Search, Trash2, Database, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQRNGStore } from '../store/qrngStore';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { ExperimentResponse } from '../lib/types';

const ITEMS_PER_PAGE = 20;

// Helper to generate a deterministic looking hash based on the experiment parameters since the backend doesn't provide one
const computeHashSync = (data: ExperimentResponse) => {
  // A simplistic mock hash approach for visual purposes in a table rendering synchronously
  const stringToHash = `${data.id}-${data.zeros}-${data.ones}-${data.entropy}`;
  let hash = 0;
  for (let i = 0; i < stringToHash.length; i++) {
    const char = stringToHash.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(16, '0') + Math.abs(hash * 31).toString(16).padStart(16, '0');
};

const History = () => {
  const { history, clearHistory, fetchHistory } = useQRNGStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Filtering functionality
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      // Add hash dynamically for searchability parity with older implementation
      const dynamicHash = computeHashSync(item);
      return (
        dynamicHash.toLowerCase().includes(searchLower) ||
        item.id.toString().includes(searchLower) ||
        item.ones.toString().includes(searchLower) ||
        item.zeros.toString().includes(searchLower)
      );
    });
  }, [history, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredHistory, currentPage]);

  const handleExportCSV = () => {
    if (history.length === 0) {
      toast.error('No data to export');
      return;
    }

    const headers = ['ID', 'Zeros', 'Ones', 'Entropy', 'Visual Hash'];
    const csvContent = [
      headers.join(','),
      ...history.map((row) => 
        `"${row.id}","${row.zeros}","${row.ones}","${row.entropy}","${computeHashSync(row)}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `qrng-history-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Log exported successfully');
  };

  const handleClear = () => {
    if (window.confirm('WARNING: Are you sure you want to purge all quantum logs? This action is irreversible.')) {
      clearHistory();
      toast.success('Data logs purged.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Database className="h-8 w-8 text-quantum-primary" />
            Quantum Registry
          </h1>
          <p className="text-gray-400 mt-1">Archived interactions with the quantum source</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-quantum-secondary transition-colors" />
            <input
              type="text"
              placeholder="Search registry indices..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-64 bg-quantum-800/80 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-quantum-secondary/50 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-quantum-800 border border-white/10 hover:bg-white/5 rounded-lg text-sm text-white transition-all shadow-md group"
          >
            <Download className="h-4 w-4 text-gray-400 group-hover:text-quantum-secondary transition-colors" />
            <span>Export Registry</span>
          </button>

          <button
            onClick={handleClear}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-lg text-sm text-red-400 hover:text-red-300 transition-all shadow-md group"
          >
            <Trash2 className="h-4 w-4" />
            <span>Purge Data</span>
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl overflow-hidden min-h-[500px] flex flex-col"
      >
        <div className="flex-1 overflow-x-auto relative min-h-[400px]">
          <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
            <thead className="sticky top-0 bg-quantum-900/90 backdrop-blur border-b border-white/10 z-10">
              <tr className="text-xs uppercase tracking-wider text-gray-500">
                <th className="py-4 pl-6 font-medium">Index ID</th>
                <th className="py-4 font-medium">Bits: 0 / 1</th>
                <th className="py-4 font-medium">Entropy Quality</th>
                <th className="py-4 pr-6 font-medium text-right">Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 relative bg-transparent">
              <AnimatePresence>
                {currentItems.length > 0 ? (
                  currentItems.map((item, index) => {
                    const hashStr = computeHashSync(item);
                    return (
                    <motion.tr 
                      key={`history-${item.id}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.2 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="py-3 pl-6">
                        <span className="text-sm font-bold text-emerald-400 font-mono">
                          #{item.id}
                        </span>
                      </td>
                      <td className="py-3 text-gray-300 font-mono text-base">
                        {item.zeros} / {item.ones}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-quantum-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-quantum-secondary to-quantum-primary"
                              style={{ width: `${item.entropy * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{(item.entropy * 100).toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <code className="text-xs font-mono text-quantum-accent/50 group-hover:text-quantum-accent/90 transition-colors inline-block truncate" title={hashStr}>
                          {hashStr.substring(0, 16)}...
                        </code>
                      </td>
                    </motion.tr>
                  )})
                ) : (
                  <tr>
                    <td colSpan={4} className="py-16 text-center text-gray-500 text-sm">
                      <div className="flex flex-col items-center justify-center opacity-60">
                        <Database className="h-12 w-12 text-gray-400 mb-3" />
                        <p>No matching quantum records found.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-quantum-900/50 border-t border-white/10 px-6 py-4 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Showing <span className="text-white font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="text-white font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, filteredHistory.length)}</span> of <span className="text-white font-medium">{filteredHistory.length}</span> entries
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md border border-white/10 bg-quantum-800 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Logic to show pages around current page
                  let pageToShow = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) {
                      pageToShow = currentPage - 3 + i + (currentPage === totalPages ? 0 : 1);
                      if(pageToShow > totalPages) return null;
                    }
                  }
                  
                  return (
                    <button
                      key={pageToShow}
                      onClick={() => setCurrentPage(pageToShow)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-all ${
                        currentPage === pageToShow
                          ? 'bg-quantum-primary text-white shadow-md'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {pageToShow}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md border border-white/10 bg-quantum-800 text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default History;
