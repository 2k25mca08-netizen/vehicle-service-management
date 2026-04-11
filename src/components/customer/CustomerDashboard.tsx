import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceRecords, fetchVehicles, createServiceRecord, updateServiceRecord } from "../../store/slices/serviceSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  History, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function CustomerDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceRecords, vehicles } = useSelector((state: RootState) => state.service);
  const { user } = useSelector((state: RootState) => state.auth);

  const [booking, setBooking] = useState({ vehicleId: "", date: "" });

  useEffect(() => {
    dispatch(fetchServiceRecords());
    dispatch(fetchVehicles());
  }, [dispatch]);

  const myVehicles = vehicles.filter(v => v.customerId === user?.id);
  const myRecords = serviceRecords.filter(r => r.customerId === user?.id);

  const handleBookService = async () => {
    if (!booking.vehicleId || !booking.date) return;
    
    try {
      await dispatch(createServiceRecord({
        vehicleId: booking.vehicleId,
        customerId: user?.id,
        bookingDate: new Date(booking.date).toISOString(),
        status: "Booked"
      })).unwrap();
      toast.success("Service booked successfully!");
      setBooking({ vehicleId: "", date: "" });
    } catch (err) {
      toast.error("Failed to book service");
    }
  };

  const handleCancel = async (recordId: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { status: "Cancelled" } 
      })).unwrap();
      toast.success("Service cancelled");
    } catch (err) {
      toast.error("Failed to cancel service");
    }
  };

  const handleFeedback = async (recordId: string, rating: number, feedback: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { rating, feedback } 
      })).unwrap();
      toast.success("Thank you for your feedback!");
    } catch (err) {
      toast.error("Failed to submit feedback");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Booked": return <Clock className="w-5 h-5 text-blue-500" />;
      case "In Progress": return <Wrench className="w-5 h-5 text-amber-500" />;
      case "Completed": return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "Ready for Pickup": return <Car className="w-5 h-5 text-indigo-500" />;
      default: return <AlertCircle className="w-5 h-5 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold text-zinc-900 tracking-tight">Welcome, {user?.name.split(" ")[0]}</h2>
          <p className="text-zinc-500 mt-1">Manage your fleet and track service progress in real-time.</p>
        </div>
        <Dialog>
          <DialogTrigger
            render={
              <Button className="h-14 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xl shadow-brand-200 transition-all active:scale-95 gap-3 btn-mechanical">
                <Plus className="w-5 h-5" />
                Book New Service
              </Button>
            }
          />
          <DialogContent className="rounded-[2rem] border-zinc-100 p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Book a New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Select Vehicle</Label>
                <Select 
                  value={booking.vehicleId} 
                  onValueChange={(val) => setBooking({ ...booking, vehicleId: val })}
                >
                  <SelectTrigger className="h-14 w-full rounded-xl border-zinc-100 bg-zinc-50/50">
                    <SelectValue placeholder="Choose vehicle" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                    {myVehicles.length > 0 ? (
                      myVehicles.map(v => (
                        <SelectItem key={v.id} value={v.id} className="rounded-lg">
                          {v.model} ({v.regNo})
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-zinc-400 italic">
                        No vehicles found. Please add one in "My Garage".
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Preferred Date</Label>
                <input 
                  type="date" 
                  className="w-full h-14 px-4 border border-zinc-100 rounded-xl bg-zinc-50/50 focus:bg-white transition-all outline-none"
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleBookService} className="h-14 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-100 transition-all">Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Services */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-xl font-display font-bold text-zinc-900">Active Services</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myRecords.filter(r => r.status !== "Ready for Pickup").map((record, idx) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className={`border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden group ${
                record.status === "In Progress" ? "card-amber" : "card-blue"
              }`}>
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start mb-6">
                    <Badge className={`rounded-xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest border-none gap-2 ${
                      record.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {getStatusIcon(record.status)}
                      {record.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {new Date(record.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-display font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {myVehicles.find(v => v.id === record.vehicleId)?.model}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs font-bold text-zinc-400 uppercase">
                    {myVehicles.find(v => v.id === record.vehicleId)?.regNo}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <div className="p-5 bg-zinc-50 rounded-2xl border border-zinc-100/50">
                    <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest mb-2">Current Status</p>
                    <p className="text-sm font-medium text-zinc-700 leading-relaxed">
                      {record.status === "Booked" && "Awaiting assignment to our expert advisor"}
                      {record.status === "In Progress" && "Our certified technicians are working on your vehicle"}
                      {record.status === "Completed" && "Service finalized! Performing quality checks"}
                    </p>
                  </div>
                  {record.status === "Booked" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full mt-6 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs uppercase tracking-widest h-12"
                      onClick={() => handleCancel(record.id)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
          {myRecords.filter(r => r.status !== "Ready for Pickup").length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
              <Car className="w-12 h-12 mb-4 opacity-10" />
              <p className="font-medium italic">No active services at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Service History */}
      <section>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <History className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-display font-bold text-zinc-900">Service History</h3>
        </div>
        <Card className="border-none shadow-sm rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-50">
              {myRecords.filter(r => r.status === "Ready for Pickup").map((record) => (
                <div key={record.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-emerald-50/30 transition-colors group border-b border-zinc-50 last:border-0">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xl font-display font-bold text-zinc-900">{myVehicles.find(v => v.id === record.vehicleId)?.model}</p>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">
                        {new Date(record.bookingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-zinc-900">₹{record.totalAmount.toLocaleString()}</p>
                      <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">Download Invoice</Button>
                    </div>
                  </div>
                </div>
              ))}
              {myRecords.filter(r => r.status === "Ready for Pickup").length === 0 && (
                <div className="p-20 text-center text-zinc-400 italic font-medium">No past records found in your history.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
