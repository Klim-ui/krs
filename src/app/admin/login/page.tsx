import { Beef } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAuthenticated()) redirect("/admin");
  const params = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center bg-[#f4eee3] px-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl shadow-black/10 sm:p-9">
        <span className="grid size-12 place-items-center rounded-full bg-[#47733d] text-white">
          <Beef className="size-6" />
        </span>
        <h1 className="mt-6 font-serif text-3xl font-semibold">Вход в CRM</h1>
        <p className="mt-2 text-sm text-[#71685b]">
          Управление бронями и пулами
        </p>
        <form action={login} className="mt-7 grid gap-4">
          <label className="grid gap-2 text-sm font-medium">
            Пароль
            <input
              name="password"
              type="password"
              required
              autoFocus
              autoComplete="current-password"
              className="h-14 rounded-xl border border-[#d8cdbd] px-4 text-base outline-none focus:border-[#47733d] focus:ring-3 focus:ring-[#47733d]/10"
            />
          </label>
          {params.error && (
            <p className="text-sm text-red-700">Неверный пароль</p>
          )}
          <button className="h-14 rounded-xl bg-[#27231e] font-semibold text-white transition hover:bg-black">
            Войти
          </button>
        </form>
        <Link
          href="/"
          className="mt-5 block text-center text-sm text-[#71685b] hover:text-[#27231e]"
        >
          Вернуться на сайт
        </Link>
      </div>
    </main>
  );
}
