import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { 
  fetchVehicles, 
  fetchWorkItems, 
  fetchCustomers, 
  fetchAdvisors,
  createVehicle,
  createWorkItem
} from "../../store/slices/serviceSlice";
import { signup } from "../../store/slices/authSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function MasterData({ defaultTab = "vehicles" }: { defaultTab?: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, workItems, customers, advisors } = useSelector((state: RootState) => state.service);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchWorkItems());
    dispatch(fetchCustomers());
    dispatch(fetchAdvisors());
  }, [dispatch]);

  const handleSave = async () => {
    try {
      if (activeTab === "vehicles") {
        await dispatch(createVehicle(formData)).unwrap();
        toast.success("Vehicle added successfully");
      } else if (activeTab === "work-items") {
        await dispatch(createWorkItem(formData)).unwrap();
        toast.success("Work item added successfully");
      } else if (activeTab === "customers" || activeTab === "advisors") {
        await dispatch(signup({ 
          ...formData, 
          role: activeTab === "customers" ? "customer" : "service_advisor" 
        })).unwrap();
        toast.success(`${activeTab === "customers" ? "Customer" : "Advisor"} added successfully`);
        // Refresh lists
        activeTab === "customers" ? dispatch(fetchCustomers()) : dispatch(fetchAdvisors());
      }
      setIsDialogOpen(false);
      setFormData({});
    } catch (err: any) {
      toast.error(err.message || "Failed to save record");
    }
  };

  return (
    <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="p-8 border-b border-zinc-50 bg-white">
        <CardTitle className="font-display font-bold text-xl">Master Data Management</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <Tabs defaultValue={defaultTab} onValueChange={setActiveTab} className="w-full">
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
              
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="h-12 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold gap-2 shadow-lg shadow-brand-100 transition-all active:scale-95"
                    onClick={() => setFormData({})}
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-3xl border-zinc-100 shadow-2xl p-8 max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-display font-bold">
                      Add New {activeTab === "vehicles" ? "Vehicle" : 
                               activeTab === "work-items" ? "Work Item" : 
                               activeTab === "customers" ? "Customer" : "Service Advisor"}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6 py-6">
                    {activeTab === "vehicles" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Model Name</Label>
                          <Input placeholder="Toyota Camry" onChange={(e) => setFormData({...formData, model: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Registration Number</Label>
                          <Input placeholder="KA-01-HH-1234" onChange={(e) => setFormData({...formData, regNo: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Manufacture Year</Label>
                          <Input type="number" placeholder="2022" onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Assigned Customer</Label>
                          <Select onValueChange={(val) => setFormData({...formData, customerId: val})}>
                            <SelectTrigger className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50">
                              <SelectValue placeholder="Select customer" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                              {customers.map((c: any) => (
                                <SelectItem key={c.id} value={c.id} className="rounded-lg">{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}

                    {activeTab === "work-items" && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Item Name</Label>
                          <Input placeholder="Engine Oil Change" onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Category</Label>
                          <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                            <SelectTrigger className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                              <SelectItem value="Engine" className="rounded-lg">Engine</SelectItem>
                              <SelectItem value="Brakes" className="rounded-lg">Brakes</SelectItem>
                              <SelectItem value="Electrical" className="rounded-lg">Electrical</SelectItem>
                              <SelectItem value="General" className="rounded-lg">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Fixed Price (₹)</Label>
                          <Input type="number" placeholder="1500" onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                      </>
                    )}

                    {(activeTab === "customers" || activeTab === "advisors") && (
                      <>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
                          <Input placeholder="John Doe" onChange={(e) => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
                          <Input type="email" placeholder="john@example.com" onChange={(e) => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</Label>
                          <Input type="password" placeholder="••••••••" onChange={(e) => setFormData({...formData, password: e.target.value})} className="h-12 rounded-xl border-zinc-100 bg-zinc-50/50" />
                        </div>
                      </>
                    )}
                  </div>
                  
                  <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl h-12 px-6 font-bold text-zinc-500">Cancel</Button>
                    <Button onClick={handleSave} className="rounded-xl h-12 px-8 bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-100">Save Record</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-9 h-9 rounded-lg hover:bg-zinc-100"
                          onClick={() => toast.info("Editing is coming soon!")}
                        >
                          <Edit2 className="w-4 h-4 text-zinc-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600"
                          onClick={() => toast.info("Deletion is coming soon!")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-9 h-9 rounded-lg hover:bg-zinc-100"
                          onClick={() => toast.info("Editing is coming soon!")}
                        >
                          <Edit2 className="w-4 h-4 text-zinc-400" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600"
                          onClick={() => toast.info("Deletion is coming soon!")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="customers" className="mt-0">
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="hover:bg-transparent border-zinc-100">
                    <TableHead className="px-6 py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Name</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Email</TableHead>
                    <TableHead className="px-6 py-4 text-right font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers?.map((c: any) => (
                    <TableRow key={c.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="px-6 py-5 font-bold text-zinc-900">{c.name}</TableCell>
                      <TableCell className="text-zinc-500">{c.email}</TableCell>
                      <TableCell className="px-6 py-5 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-zinc-100" onClick={() => toast.info("Editing coming soon")}><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600" onClick={() => toast.info("Deletion coming soon")}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="advisors" className="mt-0">
            <div className="rounded-2xl border border-zinc-100 overflow-hidden">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="hover:bg-transparent border-zinc-100">
                    <TableHead className="px-6 py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Name</TableHead>
                    <TableHead className="py-4 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Email</TableHead>
                    <TableHead className="px-6 py-4 text-right font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advisors?.map((a: any) => (
                    <TableRow key={a.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="px-6 py-5 font-bold text-zinc-900">{a.name}</TableCell>
                      <TableCell className="text-zinc-500">{a.email}</TableCell>
                      <TableCell className="px-6 py-5 text-right space-x-1">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-zinc-100" onClick={() => toast.info("Editing coming soon")}><Edit2 className="w-4 h-4 text-zinc-400" /></Button>
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-lg hover:bg-red-50 text-red-600" onClick={() => toast.info("Deletion coming soon")}><Trash2 className="w-4 h-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
