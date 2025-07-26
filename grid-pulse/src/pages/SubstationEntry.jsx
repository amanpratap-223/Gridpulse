import React, { useState } from "react";
import axios from "axios";
import { MainNav } from "@/components/dashboard/Navbar";
import { Bell, User, Save, MapPin, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";



export const substationFormSchema = z.object({
  name: z
    .union([z.string(), z.number()])
    .transform((val) => String(val)) // ✅ converts numbers to string for backend compatibility
    .refine((val) => val.trim().length > 0, "Substation name is required"),

  location: z
    .string()
    .min(2, "Location is required")
    .max(100, "Location name too long"),

  temperature: z
    .coerce
    .number() // ✅ converts "32" (string from input) into 32 (number)
    .nonnegative("Temperature cannot be negative")
    .optional(),
});


const SubstationEntry = () => {
  const form = useForm({
    resolver: zodResolver(substationFormSchema),
    defaultValues: {
      name: "",
      location: "",
      temperature: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/substations",
        {
          name: data.name,
          location: data.location,
          temperature: Number(data.temperature) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Substation created successfully", {
        description: `${response.data.substation.name} has been added`,
      });

      form.reset();
    } catch (error) {
      console.error("Error creating substation:", error);
      toast.error(
        error.response?.data?.message || "Failed to create substation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#272522] text-[#F5FBFE] flex">
      <MainNav />

      <div className="flex-1 pl-0 md:pl-72 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-30 grid-pulse-glass backdrop-blur-md border-b border-border/40 px-6 py-3">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-xl font-semibold hidden md:block">
              Substation Entry
            </h1>
            <div className="flex items-center gap-2">
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
                className="rounded-full bg-secondary/50"
              >
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="px-6 py-8 pb-20 animate-fade-in">
          <Card className="grid-pulse-card max-w-2xl mx-auto border-none">
            <CardHeader>
              <CardTitle className="text-xl">Add New Substation</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Substation Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter substation name"
                              {...field}
                              className="bg-[#201E1D] h-10 rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#5EC9ED] border-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Enter location"
                                {...field}
                                className="bg-[#201E1D] h-10 rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#5EC9ED] border-none pl-10"
                              />
                              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#F5FBFE]/70" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Temperature */}
                  <FormField
                    control={form.control}
                    name="temperature"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperature (°C)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="Optional"
                              {...field}
                              className="bg-[#201E1D] h-10 rounded-md px-3 py-2 focus-visible:ring-2 focus-visible:ring-[#5EC9ED] border-none pl-10"
                            />
                            <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#F5FBFE]/70" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="flex items-center gap-2"
                      disabled={isSubmitting}
                    >
                      <Save size={18} />
                      {isSubmitting ? "Saving..." : "Save Substation"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>

        {/* Footer */}
        <footer className="py-6 px-6 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2024 Grid Pulse. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SubstationEntry;
