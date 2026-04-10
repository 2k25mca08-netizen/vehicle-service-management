import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

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
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-200">
          <Car className="text-white w-6 h-6" />
        </div>
        <span className="font-display font-bold text-2xl tracking-tight">AutoServe</span>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {filteredNav.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl py-6 transition-all duration-200 group"
            onClick={() => setOpen(false)}
          >
            <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:text-brand-600" />
            <span className="font-medium">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-zinc-50 rounded-2xl p-4 mb-6">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Support</p>
          <p className="text-sm text-zinc-600">Need help with your service?</p>
          <Button variant="link" className="p-0 h-auto text-zinc-900 font-semibold mt-1">Contact Support</Button>
        </div>
        <Separator className="mb-6 opacity-50" />
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-xl py-6 transition-all"
          onClick={() => {
            dispatch(logout());
            setOpen(false);
          }}
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex mechanical-bg">
      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-zinc-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-zinc-100 flex items-center justify-between px-8 sticky top-0 z-30">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
