import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  Wrench, 
  LogOut, 
  Bell,
  Menu,
  User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "motion/react";
import MasterData from "../admin/MasterData";
import CustomerVehicles from "../customer/CustomerVehicles";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");

  const notifications = [
    { id: 1, title: "Service Scheduled", message: "Your Toyota Camry service is scheduled for tomorrow.", time: "2h ago", unread: true },
    { id: 2, title: "Payment Successful", message: "Payment for record #SR-123 has been processed.", time: "5h ago", unread: true },
    { id: 3, title: "Welcome to AutoServe", message: "Thank you for choosing us for your vehicle needs.", time: "1d ago", unread: false },
  ];

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "service_advisor", "customer"] },
    { label: "Vehicles", icon: Car, roles: ["admin", "customer"] },
    { label: "Customers", icon: Users, roles: ["admin"] },
    { label: "Advisors", icon: User, roles: ["admin"] },
    { label: "Work Items", icon: Wrench, roles: ["admin"] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role || ""));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-white">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30">
          <Car className="text-white w-6 h-6" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight text-white">AutoServe</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto min-h-0 custom-scrollbar">
        {filteredNav.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={`w-full justify-start gap-3 rounded-xl py-6 transition-all duration-200 group ${
              activeView === item.label 
                ? "text-white bg-brand-600 shadow-lg shadow-brand-600/30" 
                : "text-zinc-400 hover:text-white hover:bg-white/5"
            }`}
            onClick={() => {
              setActiveView(item.label);
              setOpen(false);
            }}
          >
            <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
              activeView === item.label ? "text-white" : "group-hover:text-white"
            }`} />
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
          <p className="text-xs font-bold text-brand-400 uppercase tracking-widest mb-2">Support</p>
          <p className="text-sm text-zinc-300">Need help with your service?</p>
          <Button 
            variant="link" 
            className="p-0 h-auto text-white font-semibold mt-1"
            onClick={() => toast.info("Support ticket system is coming soon!")}
          >
            Contact Support
          </Button>
        </div>
        <Separator className="mb-6 opacity-20 bg-white" />
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-zinc-400 hover:text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/30 rounded-xl py-6 transition-all group"
          onClick={() => {
            dispatch(logout());
            setOpen(false);
            toast.success("Logged out successfully");
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-zinc-50 relative pointer-events-auto">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-zinc-950 border-r border-zinc-900 hidden lg:flex flex-col sticky top-0 h-screen shadow-2xl shadow-zinc-900/20">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mechanical-bg-dark z-0" />
        
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-4">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                }
              />
              <SheetContent side="left" className="p-0 w-72 border-r-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="font-display font-bold text-xl lg:text-2xl text-zinc-900 capitalize">
              {user?.role.replace("_", " ")} <span className="text-zinc-400 font-normal">Overview</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2 lg:gap-6">
            <Popover>
              <PopoverTrigger
                render={
                  <Button variant="ghost" size="icon" className="relative hover:bg-zinc-50 rounded-full w-10 h-10">
                    <Bell className="w-5 h-5 text-zinc-600" />
                    {notifications.some(n => n.unread) && (
                      <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
                    )}
                  </Button>
                }
              />
              <PopoverContent className="w-96 p-0 rounded-2xl shadow-2xl border-zinc-100 overflow-hidden" align="end">
                <div className="p-5 border-b border-zinc-50 bg-zinc-50/50">
                  <h3 className="font-display font-bold text-lg">Notifications</h3>
                </div>
                <ScrollArea className="h-[400px]">
                  <div className="flex flex-col">
                    {notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={`p-5 border-b border-zinc-50 last:border-0 hover:bg-zinc-50 transition-colors cursor-pointer relative group ${n.unread ? "bg-white" : "bg-zinc-50/30"}`}
                      >
                        {n.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                        <div className="flex justify-between items-start mb-1.5">
                          <p className={`text-sm font-bold ${n.unread ? "text-zinc-900" : "text-zinc-500"}`}>{n.title}</p>
                          <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{n.time}</span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-3 border-t border-zinc-50 text-center bg-zinc-50/50">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-zinc-500 hover:text-zinc-900">
                    Mark all as read
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-4 pl-6 border-l border-zinc-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-zinc-900">{user?.name}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{user?.role.replace("_", " ")}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-zinc-900 text-white text-xs font-bold">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-10 overflow-auto">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeView === "Dashboard" ? children : (
              <div className="space-y-6">
                {activeView === "Vehicles" && user?.role === "admin" && <MasterData defaultTab="vehicles" />}
                {activeView === "Vehicles" && user?.role === "customer" && <CustomerVehicles />}
                {activeView === "Work Items" && user?.role === "admin" && <MasterData defaultTab="work-items" />}
                {activeView === "Customers" && user?.role === "admin" && <MasterData defaultTab="customers" />}
                {activeView === "Advisors" && user?.role === "admin" && <MasterData defaultTab="advisors" />}
                
                {/* Fallback for views not yet fully implemented for specific roles */}
                {((activeView === "Work Items" || activeView === "Customers" || activeView === "Advisors") && user?.role !== "admin") && (
                  <div className="p-12 bg-white rounded-[2.5rem] border border-dashed border-zinc-200 text-center text-zinc-400 italic">
                    {activeView} management module coming soon for {user?.role.replace("_", " ")}s...
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
