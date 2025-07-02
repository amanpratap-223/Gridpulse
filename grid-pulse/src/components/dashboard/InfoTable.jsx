
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { energyData} from '@/data/energyData';
import { DashboardCard } from './dashboard-card';

export const InfoTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 6;

  const filteredData = energyData.filter(item => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <DashboardCard 
      title="Energy Data Logs" 
      description="Daily transformer and consumption readings"
      className="col-span-full"
    >
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#94A3B8]" />
          <Input
            placeholder="Search by date..."
            className="pl-8 bg-[#343230]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="border rounded-md border-[#EBEBEB]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="">
            <TableHeader className="bg-[#363130]/90 text-white">
              <TableRow >
                <TableHead className="w-[80px]">S.No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>TR-1</TableHead>
                <TableHead>TR-1 Voltage (V)</TableHead>
                <TableHead>TR-1 Current (A)</TableHead>
                <TableHead>TR-2</TableHead>
                <TableHead>TR-2 Voltage (V)</TableHead>
                <TableHead>TR-2 Current (A)</TableHead>
                <TableHead>Total Unit Consumed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((row) => (
                <TableRow key={row.id} className="hover:bg-[#343230]/30">
                  <TableCell className="font-medium">{row.id}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>{row.tr1.toLocaleString()}</TableCell>
                  <TableCell>{row.tr1Voltage}</TableCell>
                  <TableCell>{row.tr1Current}</TableCell>
                  <TableCell>{row.tr2.toLocaleString()}</TableCell>
                  <TableCell>{row.tr2Voltage}</TableCell>
                  <TableCell>{row.tr2Current}</TableCell>
                  <TableCell>{row.totalUnitConsumed ? row.totalUnitConsumed.toLocaleString() : 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardCard>
  );
};