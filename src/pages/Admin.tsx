
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import Header from '@/components/Header';
import { ArrowUpDown, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type RsvpEntry = {
  id: string;
  name: string;
  phone: string;
  aimScreenName: string;
  attendance: 'yes' | 'no' | 'maybe';
  guests: string;
  comment?: string;
  date: string;
  type: 'rsvp' | 'comment';
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [rsvps, setRsvps] = useState<RsvpEntry[]>([]);
  const [sortField, setSortField] = useState<keyof RsvpEntry>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterAttendance, setFilterAttendance] = useState<'all' | 'yes' | 'no' | 'maybe'>('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load RSVPs from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const storedRsvps = JSON.parse(localStorage.getItem('rsvps') || '[]');
        setRsvps(storedRsvps);
      } catch (error) {
        console.error('Error loading RSVPs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load RSVPs from storage',
          variant: 'destructive',
        });
      }
    }
  }, [isAuthenticated, toast]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SaMmIe&&hAnEdA') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      toast({
        title: 'Success',
        description: 'Welcome to the admin panel',
      });
    } else {
      toast({
        title: 'Access Denied',
        description: 'Invalid password',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  const handleSort = (field: keyof RsvpEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredRsvps = useMemo(() => {
    return rsvps
      .filter(rsvp => filterAttendance === 'all' || rsvp.attendance === filterAttendance)
      .sort((a, b) => {
        let valueA = a[sortField];
        let valueB = b[sortField];
        
        if (sortField === 'date') {
          return sortDirection === 'asc' 
            ? new Date(valueA).getTime() - new Date(valueB).getTime()
            : new Date(valueB).getTime() - new Date(valueA).getTime();
        }
        
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc'
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
        
        return 0;
      });
  }, [rsvps, sortField, sortDirection, filterAttendance]);

  // Calculate statistics
  const stats = useMemo(() => {
    const yesResponses = rsvps.filter(r => r.attendance === 'yes').length;
    const noResponses = rsvps.filter(r => r.attendance === 'no').length;
    const maybeResponses = rsvps.filter(r => r.attendance === 'maybe').length;
    
    const expectedGuests = rsvps
      .filter(r => r.attendance === 'yes' || r.attendance === 'maybe')
      .reduce((sum, r) => sum + (parseInt(r.guests) || 0), 0);
      
    return {
      yes: yesResponses,
      no: noResponses,
      maybe: maybeResponses,
      total: rsvps.length,
      expectedGuests,
    };
  }, [rsvps]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="spacehey-panel max-w-md w-full">
            <div className="spacehey-panel-header">Admin Access</div>
            
            <div className="p-8">
              <div className="flex justify-center mb-4">
                <Lock size={40} className="text-red-600" />
              </div>
              
              <h2 className="text-xl font-bold mb-3 text-center">Restricted Area</h2>
              
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-1">Password</label>
                  <Input 
                    id="password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full" 
                    autoComplete="off"
                  />
                </div>
                
                <Button type="submit" className="w-full">Access Admin Panel</Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 p-4">
        <div className="spacehey-panel mb-4">
          <div className="spacehey-panel-header flex justify-between items-center">
            <div>RSVP Admin Panel</div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>Log Out</Button>
          </div>
          
          <div className="p-4">
            <div className="spacehey-table mb-5">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td>Total RSVPs:</td>
                    <td>{stats.total}</td>
                  </tr>
                  <tr>
                    <td>Going:</td>
                    <td>{stats.yes}</td>
                  </tr>
                  <tr>
                    <td>Not Going:</td>
                    <td>{stats.no}</td>
                  </tr>
                  <tr>
                    <td>Maybe:</td>
                    <td>{stats.maybe}</td>
                  </tr>
                  <tr>
                    <td>Expected Guests:</td>
                    <td>{stats.expectedGuests}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="mb-4">
              <label className="block mb-2">Filter by attendance:</label>
              <div className="flex space-x-2">
                <Button 
                  variant={filterAttendance === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterAttendance('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button 
                  variant={filterAttendance === 'yes' ? 'default' : 'outline'}
                  onClick={() => setFilterAttendance('yes')}
                  size="sm"
                >
                  Going
                </Button>
                <Button 
                  variant={filterAttendance === 'no' ? 'default' : 'outline'}
                  onClick={() => setFilterAttendance('no')}
                  size="sm"
                >
                  Not Going
                </Button>
                <Button 
                  variant={filterAttendance === 'maybe' ? 'default' : 'outline'}
                  onClick={() => setFilterAttendance('maybe')}
                  size="sm"
                >
                  Maybe
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100" 
                      onClick={() => handleSort('name')}
                    >
                      Name <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>AIM Screen Name</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100" 
                      onClick={() => handleSort('attendance')}
                    >
                      Attendance <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                    <TableHead>Guests</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-100" 
                      onClick={() => handleSort('date')}
                    >
                      Date <ArrowUpDown className="ml-1 h-4 w-4 inline" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRsvps.length > 0 ? (
                    filteredRsvps.map((rsvp) => (
                      <TableRow key={rsvp.id}>
                        <TableCell className="font-medium">{rsvp.name}</TableCell>
                        <TableCell>{rsvp.phone}</TableCell>
                        <TableCell>{rsvp.aimScreenName}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            rsvp.attendance === 'yes' 
                              ? 'bg-green-100 text-green-800' 
                              : rsvp.attendance === 'no' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {rsvp.attendance.charAt(0).toUpperCase() + rsvp.attendance.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{rsvp.guests}</TableCell>
                        <TableCell>
                          {rsvp.comment ? (
                            <div className="max-w-xs truncate">{rsvp.comment}</div>
                          ) : (
                            <span className="text-gray-400">No comment</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(rsvp.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No RSVPs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
