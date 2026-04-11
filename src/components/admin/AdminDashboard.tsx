import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceRecords, fetchAdvisors, updateServiceRecord } from "../../store/slices/serviceSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MasterData from "./MasterData";
import { 
  Car, 
  Wrench, 
  CheckCircle2, 
  Clock,
  FileText,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceRecords, advisors } = useSelector((state: RootState) => state.service);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        dispatch(fetchServiceRecords()),
        dispatch(fetchAdvisors())
      ]);
      setLoading(false);
    };
    loadData();
  }, [dispatch]);

  const stats = [
    { label: "Due this Week", value: serviceRecords.filter(r => r.status === "Booked").length, icon: Clock, color: "text-white", bg: "bg-white/20", trend: "+2 from yesterday", cardClass: "card-blue" },
    { label: "Under Servicing", value: serviceRecords.filter(r => r.status === "In Progress").length, icon: Wrench, color: "text-white", bg: "bg-white/20", trend: "4 mechanics active", cardClass: "card-amber" },
    { label: "Completed", value: serviceRecords.filter(r => r.status === "Completed").length, icon: CheckCircle2, color: "text-white", bg: "bg-white/20", trend: "98% satisfaction", cardClass: "card-emerald" },
  ];

  const handleAssign = async (recordId: string, advisorId: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { advisorId, status: "In Progress" } 
      })).unwrap();
      toast.success("Advisor assigned successfully");
    } catch (err) {
      toast.error("Failed to assign advisor");
    }
  };

  const handleProcessPayment = async (recordId: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { status: "Ready for Pickup" } 
      })).unwrap();
      toast.success("Payment processed and invoice generated");
    } catch (err) {
      toast.error("Failed to process payment");
    }
  };

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={`border-none shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group ${stat.cardClass}`}>
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={`${stat.bg} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`${stat.color} w-7 h-7`} />
                  </div>
                  <Badge variant="secondary" className="bg-white/20 text-white border-none text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                    Live
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-white/80 font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-display font-bold text-white">{stat.value}</p>
                    <p className="text-[10px] font-bold text-white/70">{stat.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <div className="flex items-center justify-between mb-8">
          <TabsList className="bg-white p-1.5 rounded-xl border border-zinc-100 shadow-sm">
            <TabsTrigger value="overview" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all font-medium">Overview</TabsTrigger>
            <TabsTrigger value="master-data" className="rounded-lg px-6 py-2.5 data-[state=active]:bg-zinc-900 data-[state=active]:text-white transition-all font-medium">Master Data</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="rounded-xl border-zinc-200 font-semibold px-6 hover:bg-zinc-50 btn-mechanical"
              onClick={() => toast.info("PDF Exporting is coming soon!")}
            >
              Export PDF
            </Button>
            <Button 
              className="rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 shadow-lg shadow-brand-100 transition-all active:scale-95 btn-mechanical"
              onClick={() => toast.info("New Booking modal is coming soon!")}
            >
              New Booking
            </Button>
          </div>
        </div>

        <TabsContent value="overview">
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="p-8 border-b border-zinc-50 bg-white">
              <CardTitle className="font-display font-bold text-xl">Recent Service Records</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-zinc-50/50">
                  <TableRow className="hover:bg-transparent border-zinc-50">
                    <TableHead className="px-8 py-5 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Vehicle ID</TableHead>
                    <TableHead className="py-5 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="py-5 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Advisor</TableHead>
                    <TableHead className="py-5 font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Total Amount</TableHead>
                    <TableHead className="px-8 py-5 text-right font-bold text-zinc-400 uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRecords.map((record: any) => (
                    <TableRow key={record.id} className="border-zinc-50 hover:bg-zinc-50/30 transition-colors">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                            <Car className="w-4 h-4 text-zinc-500" />
                          </div>
                          <span className="font-bold text-zinc-900">{record.vehicleId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider border-none ${
                          record.status === "Completed" ? "bg-green-100 text-green-700" : 
                          record.status === "In Progress" ? "bg-amber-100 text-amber-700" : 
                          record.status === "Booked" ? "bg-blue-100 text-blue-700" : "bg-zinc-100 text-zinc-600"
                        }`}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === "Booked" ? (
                          <Select onValueChange={(val: string) => handleAssign(record.id as string, val)}>
                            <SelectTrigger className="w-[180px] rounded-xl border-zinc-100 bg-zinc-50/50">
                              <SelectValue placeholder="Assign Advisor" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-zinc-100 shadow-xl">
                              {advisors.map((a: any) => (
                                <SelectItem key={a.id} value={a.id} className="rounded-lg">{a.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-zinc-900 rounded-full flex items-center justify-center text-[10px] text-white font-bold">
                              {advisors.find((a: any) => a.id === record.advisorId)?.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-zinc-600">
                              {advisors.find((a: any) => a.id === record.advisorId)?.name || "Unassigned"}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-display font-bold text-zinc-900">₹{record.totalAmount.toLocaleString()}</TableCell>
                      <TableCell className="px-8 text-right space-x-2">
                        {record.status === "Completed" && (
                          <Button size="sm" variant="outline" className="rounded-xl border-zinc-200 font-bold text-xs" onClick={() => handleProcessPayment(record.id)}>
                            <CreditCard className="w-3.5 h-3.5 mr-2" />
                            Process
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="rounded-xl w-9 h-9 p-0 hover:bg-zinc-100"
                          onClick={() => toast.info("Invoice viewing is coming soon!")}
                        >
                          <FileText className="w-4 h-4 text-zinc-400" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="master-data">
          <MasterData />
        </TabsContent>
      </Tabs>
    </div>
  );
}
