import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchServiceRecords, fetchWorkItems, updateServiceRecord } from "../../store/slices/serviceSlice";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  Wrench, 
  Plus, 
  CheckCircle,
  ClipboardList,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

export default function SADashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { serviceRecords, workItems } = useSelector((state: RootState) => state.service);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [newItem, setNewItem] = useState({ itemId: "", quantity: 1 });

  useEffect(() => {
    dispatch(fetchServiceRecords());
    dispatch(fetchWorkItems());
  }, [dispatch]);

  const assignedRecords = serviceRecords.filter(r => r.advisorId === user?.id && r.status === "In Progress");

  const handleAddItem = async () => {
    if (!newItem.itemId) return;
    
    const workItem = workItems.find(wi => wi.id === newItem.itemId);
    const updatedItems = [...(selectedRecord.items || []), { 
      ...newItem, 
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
      setNewItem({ itemId: "", quantity: 1 });
      toast.success("Item added to BOM");
    } catch (err) {
      toast.error("Failed to add item");
    }
  };

  const handleComplete = async (recordId: string) => {
    try {
      await dispatch(updateServiceRecord({ 
        id: recordId, 
        data: { status: "Completed" } 
      })).unwrap();
      toast.success("Service marked as complete");
    } catch (err) {
      toast.error("Failed to complete service");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assigned Vehicles</h2>
          <p className="text-zinc-500">Manage Bill of Materials for your assigned vehicles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {assignedRecords.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-12 flex flex-col items-center justify-center text-zinc-500">
              <ClipboardList className="w-12 h-12 mb-4 opacity-20" />
              <p>No vehicles currently assigned to you.</p>
            </CardContent>
          </Card>
        ) : (
          assignedRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>{record.vehicleId}</CardTitle>
                  <CardDescription>Booking Date: {new Date(record.bookingDate).toLocaleDateString()}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Items
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Service Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Service / Part</Label>
                          <Select onValueChange={(val) => setNewItem({ ...newItem, itemId: val })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select item" />
                            </SelectTrigger>
                            <SelectContent>
                              {workItems.map(wi => (
                                <SelectItem key={wi.id} value={wi.id}>{wi.name} (₹{wi.price})</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Quantity</Label>
                          <Input 
                            type="number" 
                            min="1" 
                            value={newItem.quantity} 
                            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddItem}>Add to Bill</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" onClick={() => handleComplete(record.id)}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {record.items?.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{workItems.find(wi => wi.id === item.itemId)?.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>₹{item.price}</TableCell>
                        <TableCell className="text-right font-medium">₹{item.price * item.quantity}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold text-lg">₹{record.totalAmount}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
