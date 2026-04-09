import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchVehicles, fetchWorkItems } from "../../store/slices/serviceSlice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function MasterData() {
  const dispatch = useDispatch<AppDispatch>();
  const { vehicles, workItems } = useSelector((state: RootState) => state.service);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchVehicles());
    dispatch(fetchWorkItems());
  }, [dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Master Data Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vehicles">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="work-items">Work Items</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="advisors">Service Advisors</TabsTrigger>
            </TabsList>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
                <Input
                  placeholder="Search..."
                  className="pl-9 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
          </div>

          <TabsContent value="vehicles">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model</TableHead>
                  <TableHead>Reg No</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.model}</TableCell>
                    <TableCell>{v.regNo}</TableCell>
                    <TableCell>{v.year}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="work-items">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Fixed Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workItems.map((wi) => (
                  <TableRow key={wi.id}>
                    <TableCell className="font-medium">{wi.name}</TableCell>
                    <TableCell>₹{wi.price}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="sm"><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          {/* Other tabs would follow similar pattern */}
          <TabsContent value="customers">
            <div className="p-8 text-center text-zinc-500 italic">Customer management view...</div>
          </TabsContent>
          <TabsContent value="advisors">
            <div className="p-8 text-center text-zinc-500 italic">Advisor management view...</div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
