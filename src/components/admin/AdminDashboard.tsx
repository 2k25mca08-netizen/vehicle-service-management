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
  UserPlus,
  FileText,
  CreditCard
} from "lucide-react";
import { toast } from "sonner";

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
    { label: "Due this Week", value: serviceRecords.filter(r => r.status === "Booked").length, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Under Servicing", value: serviceRecords.filter(r => r.status === "In Progress").length, icon: Wrench, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Completed", value: serviceRecords.filter(r => r.status === "Completed").length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
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
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`${stat.bg} p-3 rounded-xl`}>
                <stat.icon className={`${stat.color} w-6 h-6`} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="master-data">Master Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Service Records Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Service Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Advisor</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceRecords.map((record: any) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.vehicleId}</TableCell>
                      <TableCell>
                        <Badge variant={
                          record.status === "Completed" ? "success" : 
                          record.status === "In Progress" ? "warning" : "default"
                        }>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {record.status === "Booked" ? (
                          <Select onValueChange={(val: string) => handleAssign(record.id as string, val)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Assign Advisor" />
                            </SelectTrigger>
                            <SelectContent>
                              {advisors.map((a: any) => (
                                <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          advisors.find((a: any) => a.id === record.advisorId)?.name || "Unassigned"
                        )}
                      </TableCell>
                      <TableCell>₹{record.totalAmount}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {record.status === "Completed" && (
                          <Button size="sm" variant="outline" onClick={() => handleProcessPayment(record.id)}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Process Payment
                          </Button>
                        )}
                        <Button size="sm" variant="ghost">
                          <FileText className="w-4 h-4" />
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
