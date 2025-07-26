import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import logo from "../assets/images/image.png";
import { MainNav } from "@/components/dashboard/Navbar";
import { StatsOverview } from "@/components/dashboard/StatsOverview";
import { InfoTable } from "@/components/dashboard/InfoTable";

import {
  TransformerVoltageChart,
  TransformerCurrentChart,
  TransformerLoadChart,
  TotalConsumptionChart,
  TemperatureVsConsumptionChart,
  AreaWiseConsumptionChart,
} from "@/components/dashboard/Power-Charts";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const DashBoard = () => {
  const [substations, setSubstations] = useState([]);
  const [selectedSubstation, setSelectedSubstation] = useState("");
  const [powerData, setPowerData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch Substations
  useEffect(() => {
    const fetchSubstations = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/substations", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubstations(response.data);
        if (response.data.length > 0) {
          setSelectedSubstation(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching substations:", error);
        toast.error("Failed to fetch substations");
      }
    };
    fetchSubstations();
  }, []);

  // ✅ Fetch Power Data When Substation Changes
  useEffect(() => {
    if (!selectedSubstation) return;

    const fetchPowerData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:3000/power/charts?substationId=${selectedSubstation}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPowerData(response.data);
      } catch (error) {
        console.error("Error fetching power data:", error);
        toast.error("Failed to fetch power data");
      } finally {
        setLoading(false);
      }
    };

    fetchPowerData();
  }, [selectedSubstation]);

  return (
    <div className="min-h-screen bg-[#211F1E] text-[#F5FBFE] flex">
      <MainNav />
      <div className="flex-1 pl-0 md:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="fixed w-full top-0 z-30 grid-pulse-glass backdrop-blur-md border-b border-[#EBEBEB]/40 px-6 py-3">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                <img src={logo} className="w-28 aspect-auto" loading="lazy" />
              </div>
              <h1 className="text-xl font-semibold hidden md:block text-white">
                Dashboard Overview
              </h1>
            </div>

            <div className="flex items-center gap-2 z-40">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2 rounded-full bg-red-500"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-[#343230]"
              >
                <User className="h-5 w-5 z-50" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="px-6 py-8 space-y-8 animate-fade-in mt-20">
          {/* ✅ Substation Dropdown with Label */}
          <div className="mb-6 w-64">
            <p className="text-sm text-gray-300 mb-2 font-medium tracking-wide">
              Switch Substation
            </p>
            <Select
              value={selectedSubstation}
              onValueChange={(value) => setSelectedSubstation(value)}
            >
              <SelectTrigger className="bg-[#201E1D] text-white h-11 rounded-md shadow-sm border border-[#3A3836] hover:border-[#5EC9ED] focus:ring-2 focus:ring-[#5EC9ED] transition-all">
                <SelectValue placeholder="Select Substation" />
              </SelectTrigger>
              <SelectContent className="bg-[#2A2725] text-white rounded-md shadow-md">
                {substations.map((s) => (
                  <SelectItem
                    key={s._id}
                    value={s._id}
                    className="hover:bg-[#3C3937] cursor-pointer transition-all"
                  >
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ Conditional Rendering */}
          {loading ? (
            <Card className="p-4 bg-[#201E1D] text-white">
              <p className="text-center text-gray-400">Loading...</p>
            </Card>
          ) : powerData.length === 0 ? (
            <Card className="p-4 bg-[#201E1D] text-white min-h-[300px]">
              <p className="text-center text-gray-400 text-lg">
                No power readings available for this substation yet.
              </p>
            </Card>
          ) : (
            <>
              <StatsOverview data={powerData} />

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
                <TransformerVoltageChart data={powerData} />
                <TransformerCurrentChart data={powerData} />
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
                <TransformerLoadChart data={powerData} />
                <TotalConsumptionChart data={powerData} />
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
                <TemperatureVsConsumptionChart data={powerData} />
                <AreaWiseConsumptionChart data={powerData} />
              </div>

              <div className="grid gap-6 grid-cols-1 mt-8">
                <InfoTable data={powerData} />
              </div>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-[#EBEBEB]/40">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <img src={logo} className="w-28 aspect-square" loading="lazy" />
              <p className="text-sm text-[#94A3B8] mt-4 md:mt-0">
                © 2024 Grid Pulse. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashBoard;
