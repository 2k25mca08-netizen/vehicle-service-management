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
  Calendar, 
  History, 
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench
} from "lucide-react";
import { toast } from "sonner";

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
      case "Booked": return <Clock className="w-4 h-4 text-blue-500" />;
      case "In Progress": return <Wrench className="w-4 h-4 text-amber-500" />;
      case "Completed": return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "Ready for Pickup": return <Car className="w-4 h-4 text-indigo-500" />;
      default: return <AlertCircle className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.name}</h2>
          <p className="text-zinc-500">Track your vehicle services and book new appointments.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Book Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book a New Service</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Vehicle</Label>
                <Select onValueChange={(val) => setBooking({ ...booking, vehicleId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {myVehicles.map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.model} ({v.regNo})</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <input 
                  type="date" 
                  className="w-full p-2 border rounded-md"
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleBookService}>Confirm Booking</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Services */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Active Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRecords.filter(r => r.status !== "Ready for Pickup").map((record) => (
            <Card key={record.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="gap-1">
                    {getStatusIcon(record.status)}
                    {record.status}
                  </Badge>
                  <span className="text-xs text-zinc-500 font-medium">
                    {new Date(record.bookingDate).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="mt-2">
                  {myVehicles.find(v => v.id === record.vehicleId)?.model}
                </CardTitle>
                <CardDescription>
                  Reg No: {myVehicles.find(v => v.id === record.vehicleId)?.regNo}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mt-4 p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                  <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Current Status</p>
                  <p className="text-sm font-medium">
                    {record.status === "Booked" && "Awaiting assignment to advisor"}
                    {record.status === "In Progress" && "Our experts are working on your vehicle"}
                    {record.status === "Completed" && "Service done! Awaiting final checks"}
                  </p>
                </div>
                {record.status === "Booked" && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleCancel(record.id)}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
          {myRecords.filter(r => r.status !== "Ready for Pickup").length === 0 && (
            <p className="text-zinc-500 italic">No active services.</p>
          )}
        </div>
      </section>

      {/* Service History */}
      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Service History
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {myRecords.filter(r => r.status === "Ready for Pickup").map((record) => (
                <div key={record.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{myVehicles.find(v => v.id === record.vehicleId)?.model}</p>
                      <p className="text-sm text-zinc-500">{new Date(record.bookingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{record.totalAmount}</p>
                    <Button variant="link" size="sm" className="h-auto p-0 text-blue-600">Download Invoice</Button>
                  </div>
                </div>
              ))}
              {myRecords.filter(r => r.status === "Ready for Pickup").length === 0 && (
                <div className="p-8 text-center text-zinc-500">No past records found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
