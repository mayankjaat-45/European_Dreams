"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import {
  adminLogin,
  getAdminToken,
  saveAdminSession,
} from "@/services/admin-auth.service";

const features = [
  {
    icon: GraduationCap,
    title: "Manage education content",
    description: "Universities, countries and courses in one place.",
  },
  {
    icon: BookOpenCheck,
    title: "Publish useful resources",
    description: "Create and update blogs, testimonials and SEO data.",
  },
  {
    icon: ShieldCheck,
    title: "Secure administration",
    description: "Protected access for authorised team members.",
  },
];

export default function AdminLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = getAdminToken();

    if (token) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      nextErrors.password = "Password is required.";
    } else if (form.password.length < 6) {
      nextErrors.password = "Password must contain at least 6 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      const result = await adminLogin({
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      saveAdminSession({
        token: result.token,
        user: result.user,
        remember: form.remember,
      });

      toast.success(result.message || "Welcome back!");

      router.replace("/admin/dashboard");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-background">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-dvh max-w-375 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Left brand section */}
        <section className="relative hidden overflow-hidden bg-(--hero-gradient) px-12 py-10 lg:flex lg:flex-col xl:px-20 xl:py-14">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute left-[12%] top-[18%] h-36 w-36 rounded-full border border-primary/20" />
            <div className="absolute left-[17%] top-[24%] h-20 w-20 rounded-full border border-secondary/30" />
            <div className="absolute bottom-[12%] right-[8%] h-64 w-64 rounded-full border border-primary/15" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20">
              <GraduationCap size={27} strokeWidth={2} />
            </div>

            <div>
              <p className="font-display text-2xl font-bold tracking-[-0.03em]">
                <span className="text-primary">European</span>{" "}
                <span className="text-secondary">Dreams</span>
              </p>

              <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Administration
              </p>
            </div>
          </div>

          <div className="relative z-10 my-auto max-w-xl py-16">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-secondary/20 bg-secondary-light px-4 py-2 text-sm font-semibold text-secondary">
              <Sparkles size={16} />
              Education management platform
            </div>

            <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-[-0.04em] text-foreground xl:text-6xl">
              Shape journeys that begin with a{" "}
              <span className="text-primary">European dream.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-muted xl:text-lg">
              Manage student enquiries, universities, courses, countries and
              website content through one elegant workspace.
            </p>

            <div className="mt-10 space-y-5">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className="flex max-w-lg items-start gap-4"
                  >
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/10 bg-card text-primary shadow-sm">
                      <Icon size={20} />
                    </div>

                    <div>
                      <h2 className="font-semibold text-foreground">
                        {feature.title}
                      </h2>

                      <p className="mt-1 text-sm leading-6 text-muted">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-sm text-muted">
            <CheckCircle2 size={17} className="text-success" />
            Secure access for the European Dreams team
          </div>
        </section>

        {/* Login form section */}
        <section className="flex min-h-dvh items-center justify-center px-5 py-8 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-120">
            {/* Mobile logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <GraduationCap size={24} />
              </div>

              <div>
                <p className="font-display text-xl font-bold">
                  <span className="text-primary">European</span>{" "}
                  <span className="text-secondary">Dreams</span>
                </p>

                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                  Administration
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-border bg-card p-6 shadow-[0_24px_70px_rgba(16,33,61,0.10)] sm:p-9">
              <div className="mb-8">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-primary-light text-primary">
                  <LockKeyhole size={23} />
                </div>

                <p className="text-sm font-bold uppercase tracking-[0.16em] text-secondary">
                  Admin portal
                </p>

                <h1 className="mt-2 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">
                  Welcome back
                </h1>

                <p className="mt-3 leading-7 text-muted">
                  Enter your account details to access the European Dreams
                  dashboard.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-foreground"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="admin@europeandreams.org"
                      aria-invalid={Boolean(errors.email)}
                      className={`h-13 w-full rounded-xl border bg-background py-3.5 pl-12 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted/70 ${
                        errors.email
                          ? "border-danger focus:ring-4 focus:ring-danger/10"
                          : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                      }`}
                    />
                  </div>

                  {errors.email && (
                    <p className="mt-2 text-sm font-medium text-danger">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-foreground"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-sm font-semibold text-primary transition hover:text-primary-hover"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <LockKeyhole
                      size={19}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      aria-invalid={Boolean(errors.password)}
                      className={`h-13 w-full rounded-xl border bg-background py-3.5 pl-12 pr-12 text-sm text-foreground outline-none transition placeholder:text-muted/70 ${
                        errors.password
                          ? "border-danger focus:ring-4 focus:ring-danger/10"
                          : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted transition hover:text-primary"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="mt-2 text-sm font-medium text-danger">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me */}
                <label className="flex w-fit cursor-pointer items-center gap-3 text-sm text-muted">
                  <input
                    name="remember"
                    type="checkbox"
                    checked={form.remember}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-border accent-primary"
                  />
                  Keep me signed in
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-semibold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={20} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in to dashboard
                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-7 border-t border-border pt-6">
                <div className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-muted">
                  <ShieldCheck size={16} className="shrink-0 text-success" />
                  Your connection and account information are protected.
                </div>
              </div>
            </div>

            <p className="mt-6 text-center text-xs leading-6 text-muted">
              © {new Date().getFullYear()} European Dreams. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
