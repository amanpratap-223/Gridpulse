import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { GridPulseLogo } from './logo';
import { Button } from '@/components/ui/button';
import logo from "@/assets/images/image.png"
import { 
  LayoutDashboard, 
  BarChart4, 
  FileBarChart, 
  Settings, 
  Bell, 
  Menu, 
  X ,
  FileInput,
  Zap,
  Users
} from 'lucide-react';
import { cn } from "@/lib/utils"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Data Entry",
    href: "/data-entry",
    icon: FileInput,
  },
  {
    title: "Substation Entry",
    href: "/substation-entry",
    icon: Zap,
  },
  {
    title: "Employees",
    href: "/employees",
    icon: Users,
  },
  {
    title: "Assign Employees",
    href: "/assign-employee",
    icon: Users,
  },
  // {
  //   title: "Power Analysis",
  //   href: "/power-analysis",
  //   icon: BarChart4,
  // },
  // {
  //   title: "Consumption",
  //   href: "/consumption",
  //   icon: FileBarChart,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
];

export function MainNav({ className }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile navigation trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 right-4 z-50 hover:bg-[#343230] text-[#F5FBFE]"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar navigation */}
      <div className={cn(
        "grid-pulse-glass fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col border-r border-r-[#EBEBEB]/40 p-6 transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}>
        <div className="flex items-center justify-between pb-8">
          {/* <GridPulseLogo /> */}
           <img src={logo} className="w-[269px] h-[245px]" loading="lazy"/>
        </div>

        <nav className="space-y-2 flex-1">
          {items.map((item) => (
            <Link
            key={item.href}
            to={item.href}
            className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-[#343230]/50 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
              <item.icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-[#5EC9ED] transition-colors" />
              <span className='text-white'>{item.title}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-t-[#EBEBEB]/40">
          <Button variant="ghost" size="sm" className="w-full justify-start px-3 text-white hover:bg-[#343230]/50 hover:text-white">
            <Bell className="mr-3 h-5 w-5" /> Notifications
          </Button>
        </div>
      </div>
    </>
  );
}