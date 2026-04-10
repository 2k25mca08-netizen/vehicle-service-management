import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { login } from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      toast.success("Login successful!");
    } else {
      toast.error(error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mechanical-bg">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-900/20">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop" 
              alt="Mechanical Background" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-600/80 to-zinc-900/90" />
          </div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/10">
              <Car className="text-white w-7 h-7" />
            </div>
            <h2 className="text-5xl font-display font-bold leading-tight mb-6">
              Precision <br />
              <span className="text-brand-400">Service</span> <br />
              Management.
            </h2>
            <p className="text-zinc-300 max-w-xs leading-relaxed">
              The ultimate platform for vehicle maintenance, tracking, and advisor management.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 font-medium">Trusted by 500+ service centers</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10">
              <h3 className="text-3xl font-display font-bold text-zinc-900 mb-2">Welcome Back</h3>
              <p className="text-zinc-500">Sign in to manage your vehicle services</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all px-6"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs font-bold text-zinc-400">Forgot?</Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all px-6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg shadow-xl shadow-brand-200 transition-all active:scale-[0.98]" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <div className="mt-10 p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4">Demo Access</p>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { role: "Admin", email: "admin@autoserve.com" },
                  { role: "Advisor", email: "advisor1@autoserve.com" },
                  { role: "Customer", email: "customer@gmail.com" }
                ].map((demo) => (
                  <div key={demo.role} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-600">{demo.role}</span>
                    <span className="text-zinc-400 font-mono">{demo.email}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
