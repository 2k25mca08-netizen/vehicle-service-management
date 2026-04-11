import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  if (isLogin) {
    return <Login onSignUpClick={() => setIsLogin(false)} />;
  }

  return <SignUp onBackToLogin={() => setIsLogin(true)} />;
}
