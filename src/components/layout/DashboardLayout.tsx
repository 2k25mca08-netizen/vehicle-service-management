import React from "react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "service_advisor", "customer"] },
    { label: "Vehicles", icon: Car, roles: ["admin", "customer"] },
    { label: "Customers", icon: Users, roles: ["admin"] },
    { label: "Advisors", icon: User, roles: ["admin"] },
    { label: "Work Items", icon: Wrench, roles: ["admin"] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user?.role || ""));

  return (
    <div className="min-h-screen flex bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Car className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight">AutoServe</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {filteredNav.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="p-4">
          <Separator className="mb-4" />
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => dispatch(logout())}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-bottom border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-lg capitalize">{user?.role.replace("_", " ")} Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-zinc-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-zinc-500 capitalize">{user?.role.replace("_", " ")}</p>
              </div>
              <Avatar>
                <AvatarFallback className="bg-zinc-900 text-white">
                  {user?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
