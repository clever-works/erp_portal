"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";
import { demoUsers } from "@/lib/data";
import type { DemoUser } from "@/lib/types";
import Brand from "@/components/layout/Brand";
import LoginShowcase from "./LoginShowcase";

type LoginScreenProps = {
  /** Follows the theme chosen inside the portal. */
  dark?: boolean;
  email: string;
  password: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onDemoFill: (user: DemoUser) => void;
};

/** Sign-in page: animated colour backdrop, floating product preview, and a glass sign-in card with a role switch. */
export default function LoginScreen({ dark = false, email, password, error, onEmailChange, onPasswordChange, onSubmit, onDemoFill }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const activeRole = demoUsers.find((user) => user.email === email.trim().toLowerCase())?.role;

  return <main className={`auth-page${dark ? " dark" : ""}`}>
    <div className="auth-blob blob-1" aria-hidden="true" />
    <div className="auth-blob blob-2" aria-hidden="true" />
    <div className="auth-blob blob-3" aria-hidden="true" />

    <section className="auth-intro-side">
      <Brand className="auth-brand" />
      <div className="auth-headline">
        <p className="auth-kicker"><span className="pulse-dot" aria-hidden="true" /> Nexus ERP · People &amp; operations</p>
        <h1>Your whole company, <em>one calm</em> workspace.</h1>
        <p>HR, attendance, leave, projects, inventory and finance, all in one fast, friendly portal.</p>
      </div>
      <LoginShowcase />
      <p className="auth-foot">© {new Date().getFullYear()} Nexus ERP · Designed by Clever Works</p>
    </section>

    <section className="auth-form-side">
      <div className="auth-card" aria-labelledby="sign-in-title">
        <Brand className="auth-card-brand" />
        <h2 id="sign-in-title">Welcome back</h2>
        <p className="auth-sub">Choose how you want to sign in.</p>

        <div className="role-switch" role="group" aria-label="Demo role">
          {demoUsers.map((user) => {
            const Icon = user.role === "admin" ? ShieldCheck : UserRound;
            return <button key={user.email} type="button" className={activeRole === user.role ? "active" : ""} aria-pressed={activeRole === user.role} onClick={() => onDemoFill(user)}>
              <Icon size={16} aria-hidden="true" />{user.role === "admin" ? "Administrator" : "Employee"}
            </button>;
          })}
        </div>

        <form onSubmit={onSubmit}>
          <label className="field">
            <span>Work email</span>
            <span className="field-box"><Mail size={16} aria-hidden="true" /><input id="login-email" type="email" autoComplete="username" placeholder="you@company.com" required value={email} onChange={(event) => onEmailChange(event.target.value)} /></span>
          </label>
          <label className="field">
            <span>Password</span>
            <span className="field-box"><Lock size={16} aria-hidden="true" />
              <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" required value={password} onChange={(event) => onPasswordChange(event.target.value)} />
              <button type="button" className="reveal" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </span>
          </label>
          {error && <p className="auth-error" role="alert">{error}</p>}
          <button className="primary auth-submit" type="submit">Sign in <ArrowRight size={16} aria-hidden="true" /></button>
        </form>

        <div className="demo-logins">
          <p>Demo logins</p>
          {demoUsers.map((user) => <button type="button" key={user.email} onClick={() => onDemoFill(user)}>
            <b>{user.role === "admin" ? "Admin" : "Employee"}</b><span>{user.email}</span><code>{user.password}</code>
          </button>)}
        </div>
        <p className="auth-note">Demo sign-in only. It is stored in this browser and not connected to a server.</p>
      </div>
    </section>
  </main>;
}
