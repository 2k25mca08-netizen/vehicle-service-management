import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, fetchWorkItems } from "../../store/slices/serviceSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

export default function MasterData({ defaultTab = "vehicles" }: { defaultTab?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, workItems } = useSelector((state: RootState) => state.service);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchWorkItems());
  }, [dispatch]);

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="p-8 border-b border-zinc-50 bg-white">
        <CardTitle className="font-display font-bold text-xl">Master Data Management</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <Tabs defaultValue={defaultTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <TabsList className="bg-zinc-50 p-1 rounded-xl border border-zinc-100 w-fit">
              <TabsTrigger value="vehicles" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Vehicles</TabsTrigger>
              <TabsTrigger value="work-items" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Work Items</TabsTrigger>
              <TabsTrigger value="customers" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Customers</TabsTrigger>
              <TabsTrigger value="advisors" className="rounded-lg px-6 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium">Advisors</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-3">
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                <Input
                  placeholder="Search records..."
                  className="pl-10 w-full md:w-[240px] h-12 rounded-xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold gap-2 shadow-lg shadow-brand-100 transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                Add New
              </Button>
            </div>
          </div>

          <TabsContent value="vehicles" className="mt-0">
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="hover:bg-transparent border-zinc-100">
                    <TableHead className="px-6 py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Model</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Reg No</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Year</TableHead>
                    <TableHead className="px-6 py-4 text-right font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((v) => (
                    <TableRow key={v.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="px-6 py-5 font-bold text-zinc-900">{v.model}</TableCell>
                      <TableCell className="font-mono text-xs font-bold text-zinc-500 uppercase">{v.regNo}</TableCell>
                      <TableCell className="text-zinc-600 font-medium">{v.year}</TableCell>
                      <TableCell className="px-6 py-5 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-zinc-100"><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="work-items" className="mt-0">
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="hover:bg-transparent border-zinc-100">
                    <TableHead className="px-6 py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Item Name</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Category</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Fixed Price</TableHead>
                    <TableHead className="px-6 py-4 text-right font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workItems.map((wi) => (
                    <TableRow key={wi.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="px-6 py-5 font-bold text-zinc-900">{wi.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-zinc-100 text-zinc-500 border-none text-[10px] font-bold uppercase tracking-widest rounded-lg">
                          {wi.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-display font-bold text-zinc-900">₹{wi.price.toLocaleString()}</TableCell>
                      <TableCell className="px-6 py-5 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-zinc-100"><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600"><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="mt-0">
            <div className="py-20 text-center bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-100">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
              <p className="text-zinc-400 font-medium italic">Customer management module coming soon...</p>
            </div>
          </TabsContent>
          
          <TabsContent value="advisors" className="mt-0">
            <div className="py-20 text-center bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-100">
              <Users className="w-12 h-12 mx-auto mb-4 text-zinc-200" />
              <p className="text-zinc-400 font-medium italic">Service advisor management module coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
