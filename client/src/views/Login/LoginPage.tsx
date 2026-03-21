import { useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { login, LoginRequest } from "../../api/authApi";
import useCurrentUser from "../../hooks/useCurrentUser";
import PageLoader from "../../components/PageLoader";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<LoginRequest>({});
  const queryClient = useQueryClient();
  const { user, status } = useCurrentUser();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      localStorage.setItem("token", response.token);
      enqueueSnackbar(response.message || "Login successful", {
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      navigate("/home");
    },
    onError: (error: any) => {
      const message =
        error?.data?.error ||
        error?.data?.message ||
        error?.message ||
        "Unable to login. Please try again.";
      enqueueSnackbar(message, { variant: "error" });
    },
  });

  const onSubmit: SubmitHandler<LoginRequest> = ({ email, password }) => {
    if (!email.trim() || !password.trim()) {
      enqueueSnackbar("Please enter both email and password", {
        variant: "warning",
      });
      return;
    }
    mutate({ email, password });
  };

  if (status === "loading" || status === "idle" || status === "pending") {
    return <PageLoader />;
  }
  if (user) {
    navigate("/home");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_90%_10%,rgba(16,185,129,0.15),transparent_32%),radial-gradient(circle_at_55%_95%,rgba(251,146,60,0.15),transparent_28%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12 md:px-10">
        <div className="grid w-full items-stretch gap-8 lg:grid-cols-2">
          <article className="hidden rounded-3xl border border-white/10 bg-white/4 p-8 backdrop-blur lg:block">
            <p className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
              CTSE Platform
            </p>
            <h1 className="mt-6 text-4xl font-black leading-tight text-white font-['Space_Grotesk',sans-serif]">
              Welcome back.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-300">
              Sign in to access your inventory, order pipeline, and service
              analytics from one place.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-3">
              {["Inventory", "Orders", "Users"].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/4 px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/60 backdrop-blur-xl sm:p-8">
            <h2 className="text-2xl font-bold text-white font-['Space_Grotesk',sans-serif]">
              Login to your account
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Use your registered email and password.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-200"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/30"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Login;
