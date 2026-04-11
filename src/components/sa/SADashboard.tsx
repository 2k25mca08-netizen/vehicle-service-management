import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceRecords, fetchWorkItems, fetchVehicles, updateServiceRecord } from "../../store/slices/serviceSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Car, 
  Wrench, 
  CheckCircle2, 
  ChevronRight,
  Users,
  History,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function SADashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceRecords, workItems, vehicles } = useSelector((state: RootState) => state.service);
  const { user } = useSelector((state: RootState) => state.auth);

  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchServiceRecords());
    dispatch(fetchWorkItems());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const assignedRecords = serviceRecords.filter(r => r.advisorId === user?.id && r.status === "In Progress");

  const handleAddItem = async (itemId: string) => {
    if (!selectedRecord) return;
    
    const workItem = workItems.find(wi => wi.id === itemId);
    if (!workItem) return;

    const currentItems = selectedRecord.items || [];
    const updatedItems = [...currentItems, { 
      itemId, 
      quantity: 1, 
      price: workItem.price,
      name: workItem.name
    }];
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
      const result = await dispatch(updateServiceRecord({ 
        id: selectedRecord.id, 
        data: { items: updatedItems, totalAmount } 
      })).unwrap();
      setSelectedRecord(result);
      toast.success("Item added to BOM");
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const handleRemoveItem = async (idx: number) => {
    const updatedItems = [...(selectedRecord.items || [])];
    updatedItems.splice(idx, 1);
    
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    try {
      const result = await dispatch(updateServiceRecord({ 
        id: selectedRecord.id, 
        data: { items: updatedItems, totalAmount } 
      })).unwrap();
      setSelectedRecord(result);
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleComplete = async (recordId: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { status: "Completed" } 
      })).unwrap();
      toast.success("Service marked as complete");
      setSelectedRecord(null);
    } catch (err) {
      toast.error("Failed to complete service");
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold text-zinc-900 tracking-tight">Advisor Console</h2>
          <p className="text-zinc-500 mt-1">Manage your assigned vehicles and coordinate service delivery.</p>
        </div>
        <div className="flex gap-3">
          <div className="h-14 px-6 rounded-2xl bg-zinc-50 flex items-center gap-3 border border-zinc-100">
            <Users className="w-5 h-5 text-zinc-400" />
            <span className="text-sm font-bold text-zinc-600">{assignedRecords.length} Active Tasks</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Assigned Vehicles List */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Wrench className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="text-xl font-display font-bold text-zinc-900">Assigned Tasks</h3>
          </div>
          
          <div className="space-y-4">
            {assignedRecords.map((record, idx) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card 
                  className={`border-none cursor-pointer transition-all duration-300 rounded-[2rem] overflow-hidden ${
                    selectedRecord?.id === record.id 
                      ? "ring-2 ring-zinc-900 shadow-xl bg-white" 
                      : "shadow-sm hover:shadow-md card-indigo"
                  }`}
                  onClick={() => setSelectedRecord(record)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedRecord?.id === record.id ? "bg-zinc-900 text-white" : "bg-white/20 text-white"
                      }`}>
                        <Car className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-display font-bold truncate ${selectedRecord?.id === record.id ? "text-zinc-900" : "text-white"}`}>
                          {vehicles.find(v => v.id === record.vehicleId)?.model || record.vehicleId}
                        </p>
                        <p className={`text-[10px] font-mono font-bold uppercase tracking-widest ${selectedRecord?.id === record.id ? "text-zinc-400" : "text-white/70"}`}>
                          {vehicles.find(v => v.id === record.vehicleId)?.regNo || "REG-PENDING"}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${selectedRecord?.id === record.id ? "translate-x-1 text-zinc-900" : "text-white/80"}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {assignedRecords.length === 0 && (
              <div className="py-12 px-6 bg-zinc-50 rounded-[2rem] border border-dashed border-zinc-200 text-center text-zinc-400 italic font-medium">
                No active assignments.
              </div>
            )}
          </div>
        </div>

        {/* Service Details & BOM */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedRecord ? (
              <motion.div
                key={selectedRecord.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="p-10 bg-zinc-900 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="bg-white/10 text-white border-none rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4">
                          Service in Progress
                        </Badge>
                        <CardTitle className="text-4xl font-display font-bold">
                          {vehicles.find(v => v.id === selectedRecord.vehicleId)?.model || selectedRecord.vehicleId}
                        </CardTitle>
                        <p className="text-zinc-400 font-mono text-sm mt-1">
                          REG: {vehicles.find(v => v.id === selectedRecord.vehicleId)?.regNo || "PENDING"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Booking Date</p>
                        <p className="text-lg font-display font-bold">
                          {new Date(selectedRecord.bookingDate).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10 space-y-10">
                    {/* Bill of Materials */}
                    <div>
                      <h4 className="text-xl font-display font-bold text-zinc-900 mb-6">Current Bill of Materials</h4>
                      <div className="space-y-3">
                        {selectedRecord.items?.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100 group">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="text-xs font-bold text-zinc-400">{idx + 1}</span>
                              </div>
                              <div>
                                <p className="font-bold text-zinc-900">{item.name}</p>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <p className="font-display font-bold text-zinc-900">₹{item.price.toLocaleString()}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="w-8 h-8 rounded-lg text-zinc-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                onClick={() => handleRemoveItem(idx)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {(!selectedRecord.items || selectedRecord.items.length === 0) && (
                          <div className="py-10 text-center text-zinc-400 italic text-sm bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-100">
                            No items added to the bill yet.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Add Items Selection */}
                    <div>
                      <h4 className="text-xl font-display font-bold text-zinc-900 mb-6">Available Services & Parts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {workItems.map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => handleAddItem(item.id)}
                            className="p-5 rounded-2xl border border-zinc-100 bg-white hover:border-zinc-900 hover:shadow-lg transition-all cursor-pointer flex justify-between items-center group"
                          >
                            <div>
                              <p className="font-bold text-sm text-zinc-900 group-hover:text-zinc-900">{item.name}</p>
                              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{item.category}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className="font-display font-bold text-zinc-900">₹{item.price.toLocaleString()}</p>
                              <div className="w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                <Plus className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-zinc-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Amount</p>
                        <p className="text-4xl font-display font-bold text-zinc-900">
                          ₹{(selectedRecord.totalAmount || 0).toLocaleString()}
                        </p>
                      </div>
                      <Button 
                        onClick={() => handleComplete(selectedRecord.id)} 
                        className="h-16 px-10 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg shadow-2xl shadow-brand-200 transition-all active:scale-95 btn-mechanical"
                      >
                        Complete Service
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 text-zinc-300">
                <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mb-6">
                  <Car className="w-10 h-10 opacity-20" />
                </div>
                <p className="text-xl font-display font-bold">Select a vehicle to begin servicing</p>
                <p className="text-sm font-medium mt-2">Assigned tasks will appear in the left panel</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
