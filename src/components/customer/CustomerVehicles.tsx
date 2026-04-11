import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, createVehicle } from "../../store/slices/serviceSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { motion } from "motion/react";
import { toast } from "sonner";

export default function CustomerVehicles() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, loading } = useSelector((state: RootState) => state.service);
  const { user } = useSelector((state: RootState) => state.auth);

  const [newVehicle, setNewVehicle] = useState({ model: "", regNo: "", year: new Date().getFullYear() });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const myVehicles = vehicles.filter(v => v.customerId === user?.id);

  const handleAddVehicle = async () => {
    if (!newVehicle.model || !newVehicle.regNo) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await dispatch(createVehicle({
        ...newVehicle,
        customerId: user?.id
      })).unwrap();
      toast.success("Vehicle added to your garage!");
      setNewVehicle({ model: "", regNo: "", year: new Date().getFullYear() });
      setIsDialogOpen(false);
    } catch (err) {
      toast.error("Failed to add vehicle");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-display font-bold text-zinc-900 tracking-tight">My Garage</h2>
          <p className="text-zinc-500 mt-1">Manage your registered vehicles and their service history.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger
            render={
              <Button className="h-14 px-8 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-xl shadow-brand-200 transition-all active:scale-95 gap-3 btn-mechanical">
                <Plus className="w-5 h-5" />
                Add Vehicle
              </Button>
            }
          />
          <DialogContent className="rounded-[2rem] border-zinc-100 p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display font-bold">Add New Vehicle</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Vehicle Model</Label>
                <Input 
                  placeholder="e.g. Toyota Camry" 
                  className="h-14 rounded-xl border-zinc-100 bg-zinc-50/50"
                  value={newVehicle.model}
                  onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Registration Number</Label>
                <Input 
                  placeholder="e.g. KA-01-HH-1234" 
                  className="h-14 rounded-xl border-zinc-100 bg-zinc-50/50 font-mono"
                  value={newVehicle.regNo}
                  onChange={(e) => setNewVehicle({ ...newVehicle, regNo: e.target.value.toUpperCase() })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-zinc-400">Manufacture Year</Label>
                <Input 
                  type="number"
                  placeholder="2023" 
                  className="h-14 rounded-xl border-zinc-100 bg-zinc-50/50"
                  value={newVehicle.year}
                  onChange={(e) => setNewVehicle({ ...newVehicle, year: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddVehicle} 
                disabled={loading}
                className="h-14 w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold shadow-lg shadow-brand-100 transition-all"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Vehicle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {myVehicles.map((vehicle, idx) => (
          <motion.div
            key={vehicle.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2.5rem] overflow-hidden group bg-white card-emerald">
              <CardHeader className="p-8 pb-4">
                <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white/30 transition-colors">
                  <Car className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-display font-bold text-white">
                  {vehicle.model}
                </CardTitle>
                <p className="font-mono text-xs font-bold text-white/80 uppercase tracking-widest">
                  {vehicle.regNo}
                </p>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/70 font-medium">Year</span>
                  <span className="font-bold text-white">{vehicle.year}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-3">
                  <span className="text-white/70 font-medium">Last Service</span>
                  <span className="font-bold text-white">12 Oct 2023</span>
                </div>
                <Button variant="outline" className="w-full mt-8 h-12 rounded-xl border-white/20 font-bold text-white hover:bg-white/20 hover:border-white/30 hover:text-white transition-all">
                  View History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {myVehicles.length === 0 && (
          <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400">
            <Car className="w-12 h-12 mb-4 opacity-10" />
            <p className="font-medium italic">No vehicles registered in your garage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
