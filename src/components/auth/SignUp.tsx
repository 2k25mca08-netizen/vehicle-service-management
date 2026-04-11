import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { signup } from "../../store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";

interface SignUpProps {
  onBackToLogin: () => void;
}

export default function SignUp({ onBackToLogin }: SignUpProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const result = await dispatch(signup({ name, email, password, role: "customer" }));
    if (signup.fulfilled.match(result)) {
      toast.success("Account created successfully! Please sign in.");
      onBackToLogin();
    } else {
      toast.error(error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 mechanical-bg">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-zinc-900/20">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img 
              src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=2000&auto=format&fit=crop" 
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
              Join the <br />
              <span className="text-brand-400">Future</span> <br />
              of Service.
            </h2>
            <p className="text-zinc-300 max-w-xs leading-relaxed">
              Create an account to track your vehicle maintenance and book services with ease.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <p className="text-xs text-zinc-500 font-medium italic">"The best way to keep your car running like new."</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center relative">
          <Button 
            variant="ghost" 
            className="absolute top-8 left-8 text-zinc-400 hover:text-zinc-900 gap-2"
            onClick={onBackToLogin}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Button>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-10 mt-8">
              <h3 className="text-3xl font-display font-bold text-zinc-900 mb-2">Create Account</h3>
              <p className="text-zinc-500">Start your journey with AutoServe today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all px-6"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all px-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-widest text-zinc-400">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="h-14 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white transition-all px-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg shadow-xl shadow-brand-200 transition-all active:scale-[0.98] mt-4" type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Account"}
              </Button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <button 
                onClick={onBackToLogin}
                className="text-brand-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
