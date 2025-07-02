import React, { useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Trash2, Plus } from 'lucide-react';
import { MainNav } from '@/components/dashboard/Navbar';
import axios from 'axios';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema } from '../schemas/formSchema'; // or wherever you saved it


const DataEntry = () => {
const form = useForm({
  resolver: zodResolver(formSchema),
  mode: 'onSubmit',
  defaultValues: {
    SNo: '',
    substation: '',
    totalUnitConsumed: '',
    temperature: '',
    dateOfReading: '',
    transformers: [{ transformerId: '', voltage: '', current: '', power: '' }],
    areas: []
  }
});

  const { fields: transformerFields, append: appendTransformer, remove: removeTransformer } = useFieldArray({
    control: form.control,
    name: 'transformers'
  });

  const { fields: areaFields, append: appendArea, remove: removeArea } = useFieldArray({
    control: form.control,
    name: 'areas'
  });

  const onSubmit = async (data) => {
    if (data.transformers.length === 0) {
      toast.error('At least one transformer is required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/power/submit', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        toast.success('Power data submitted successfully!');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error?.response?.data?.error || 'Failed to submit power data');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#1A1A1A] text-[#F5FBFE]">
      <MainNav />
      <div className="flex-1 pl-72 pr-10 py-10 bg-[#1A1A1A]">
        <div className="max-w-5xl mx-auto bg-[#1E1E1E] p-10 rounded-2xl shadow-lg border border-[#343230]">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <h2 className="text-3xl font-bold mb-6 text-center text-[#5EC9ED]">Enter Power Data</h2>

              <div className="grid grid-cols-2 gap-6">
                <FormField control={form.control} name="SNo" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#2C2A28] border border-[#444] rounded-lg px-3 py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="substation" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Substation</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} value={field.value ?? ''} placeholder="Substation Name" className="bg-[#2C2A28] border border-[#444] rounded-lg px-3 py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="dateOfReading" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Reading</FormLabel>
                    <FormControl>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-[#444] rounded-lg bg-[#2C2A28] text-white"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="temperature" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#2C2A28] border border-[#444] rounded-lg px-3 py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="totalUnitConsumed" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Units Consumed</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#2C2A28] border border-[#444] rounded-lg px-3 py-2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              {/* Transformers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Transformers</h3>
                  <Button type="button" onClick={() => appendTransformer({ transformerId: '', voltage: '', current: '', power: '' })}>
                    <Plus size={16} className="mr-1" /> Add Transformer
                  </Button>
                </div>

                {transformerFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-4 gap-4 p-4 bg-[#2C2A28] rounded-xl border border-[#444]">
                    <FormField name={`transformers.${index}.transformerId`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transformer ID</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} value={field.value ?? ''} placeholder="TR-1" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name={`transformers.${index}.voltage`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voltage (V)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name={`transformers.${index}.current`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current (A)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name={`transformers.${index}.power`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power (W)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="col-span-4 flex justify-end">
                      <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeTransformer(index)}>
                        <Trash2 size={16} className="inline mr-1" /> Remove Transformer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Areas Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Areas</h3>
                  <Button type="button" onClick={() => appendArea({ name: '', power: '' })}>
                    <Plus size={16} className="mr-1" /> Add Area
                  </Button>
                </div>

                {areaFields.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-2 gap-4 p-4 bg-[#2C2A28] rounded-xl border border-[#444]">
                    <FormField name={`areas.${index}.name`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Area Name</FormLabel>
                        <FormControl>
                          <Input type="text" {...field} value={field.value ?? ''} placeholder="Area A" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField name={`areas.${index}.power`} control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Power Consumption (W)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} value={field.value ?? ''} placeholder="0" className="bg-[#1A1A1A] border border-[#555] rounded-lg px-3 py-2" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="col-span-2 flex justify-end">
                      <Button type="button" variant="ghost" className="text-red-500" onClick={() => removeArea(index)}>
                        <Trash2 size={16} className="inline mr-1" /> Remove Area
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-[#5EC9ED] hover:bg-[#4AC4DA] text-white px-6 py-2 rounded-lg">
                  Submit Data
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default DataEntry;
