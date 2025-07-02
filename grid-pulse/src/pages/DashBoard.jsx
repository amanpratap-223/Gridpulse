import React, {useEffect} from 'react'
import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { VoltageChart, CurrentChart, ConsumptionChart, ConsumptionByAreaChart, TR1SupplyChart, TR2SupplyChart,KWHChart } from '@/components/dashboard/Power-Charts';
import { toast } from 'sonner'

import logo from "../assets/images/image.png";
import {MainNav} from "@/components/dashboard/Navbar"
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { InfoTable } from '@/components/dashboard/InfoTable';

const DashBoard = () => {
    // useEffect(() => {
    //     toast.success('Welcome to Grid Pulse', {
    //       description: 'Your dashboard is ready',
    //       duration: 5000,
    //     });
    //   }, []);
  return (
    <div className="min-h-screen bg-[#211F1E] text-[#F5FBFE] flex">
        <MainNav/>
        <div className="flex-1 pl-0 md:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="fixed w-full top-0 z-30 grid-pulse-glass backdrop-blur-md border-b border-[#EBEBEB]/40 px-6 py-3">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                 <img src={logo} className="w-28 aspect-auto" loading="lazy"/>
                {/* <GridPulseLogo size="small" /> */}
              </div>
              <h1 className="text-xl font-semibold hidden md:block text-white">Dashboard Overview</h1>
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
              
              <Button variant="ghost" size="icon" className="rounded-full bg-[#343230]">
                <User className="h-5 w-5 z-50" />
              </Button>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="px-6 py-8 space-y-8 animate-fade-in mt-16">
          <StatsOverview />
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
            <VoltageChart />
            <CurrentChart />
          </div>

          <div className="grid gap-6 grid-cols-1 mt-8">
            <KWHChart />
          </div>
          
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
            <ConsumptionChart />
            <ConsumptionByAreaChart />
          </div>
          
          {/* New Supply Charts Section */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 mt-8">
            <TR1SupplyChart />
            <TR2SupplyChart />
          </div>
          
          <div className="grid gap-6 grid-cols-1 mt-8">
            <InfoTable />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="py-6 px-6 border-t border-[#EBEBEB]/40">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              {/* <GridPulseLogo size="small" /> */}
              <img src={logo} className="w-28 aspect-square" loading="lazy"/>
              <p className="text-sm text-[#94A3B8] mt-4 md:mt-0">
                © 2024 Grid Pulse. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DashBoard
