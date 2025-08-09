'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/utils/api';
import { Log, User } from '@/types';
import { formatDate } from '@/utils/helpers';
import { AlertCircle, Search } from 'lucide-react';

export default function SystemLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<Log[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { token } = useAuth();

  useEffect(() => {
    fetchLogs();
  }, [token]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLogs(logs);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
      setFilteredLogs(logs.filter(log => 
        log.action.toLowerCase().includes(lowerSearchTerm) ||
        log.details.toLowerCase().includes(lowerSearchTerm) ||
        (typeof log.user !== 'string' && log.user && 
          (log.user.firstName.toLowerCase().includes(lowerSearchTerm) || 
           log.user.lastName.toLowerCase().includes(lowerSearchTerm) || 
           (log.user.middleName && log.user.middleName.toLowerCase().includes(lowerSearchTerm))))
      ));
    }
  }, [searchTerm, logs]);

  const fetchLogs = async () => {
    if (!token) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const fetchedLogs = await apiRequest<Log[]>('/logs', 'GET', undefined, token);
      setLogs(fetchedLogs);
      setFilteredLogs(fetchedLogs);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch logs');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserName = (user: User | string | null | undefined): string => {
    if (!user) {
      return 'Unknown User';
    }
    if (typeof user === 'string') {
      return 'Unknown User';
    }
    return `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}` || 'Unknown User';
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading system logs...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <div className="flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">System Logs</h1>
      
      <div className="mb-3 sm:mb-4 relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-2 sm:pl-3 pointer-events-none">
          <Search size={16} className="sm:size-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search logs..."
          className="pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span className="hidden sm:inline">Timestamp</span>
                  <span className="sm:hidden">Time</span>
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-2 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm text-gray-500">
                    {logs.length === 0 ? 'No logs found' : 'No logs match your search'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm font-medium text-gray-900">
                        {getUserName(log.user)}
                      </div>
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                      <div className="text-xs sm:text-sm text-gray-900">{log.action}</div>
                      {/* Show details on mobile */}
                      <div className="sm:hidden text-xs text-gray-600 mt-1 max-w-[150px] truncate">
                        {log.details}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <div className="text-sm text-gray-900">{log.details}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
