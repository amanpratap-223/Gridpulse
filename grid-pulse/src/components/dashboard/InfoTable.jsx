import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardCard } from "./dashboard-card";

export const InfoTable = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 6;

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/power/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      setData(result || []);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // ✅ Filter by date (search bar)
  const filteredData = data.filter((item) =>
    item.dateOfReading
      ?.toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
        {/* ✅ Search Bar */}
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#94A3B8]" />
          <Input
            placeholder="Search by date..."
            className="pl-8 bg-[#343230]/50 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Pagination Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-white">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="border rounded-md border-[#EBEBEB]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#363130]/90 text-white">
              <TableRow>
                <TableHead className="w-[80px]">S.No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>TR-1 (Power)</TableHead>
                <TableHead>TR-1 Voltage (V)</TableHead>
                <TableHead>TR-1 Current (A)</TableHead>
                <TableHead>TR-2 (Power)</TableHead>
                <TableHead>TR-2 Voltage (V)</TableHead>
                <TableHead>TR-2 Current (A)</TableHead>
                <TableHead>Total Unit Consumed (kWh)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length ? (
                currentItems.map((row, index) => (
                  <TableRow key={index} className="hover:bg-[#343230]/30">
                    {/* ✅ Serial Number generated from pagination */}
                    <TableCell className="font-medium text-white">
                      {indexOfFirstItem + index + 1}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.dateOfReading}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr1Power?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr1Voltage}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr1Current}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr2Power?.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr2Voltage}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.tr2Current}
                    </TableCell>
                    <TableCell className="text-white">
                      {row.totalUnitConsumed?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="text-center text-gray-400 py-4"
                  >
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardCard>
  );
};
