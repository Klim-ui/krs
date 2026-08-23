"use client";

import { changeOrderStatus } from "@/app/admin/actions";

const labels = {
  NEW: "Новый",
  CONFIRMED: "Подтверждён",
  REJECTED: "Отказ",
  DELIVERED: "Доставлено",
};

const styles = {
  NEW: "bg-amber-50 text-amber-800",
  CONFIRMED: "bg-blue-50 text-blue-800",
  REJECTED: "bg-red-50 text-red-800",
  DELIVERED: "bg-green-50 text-green-800",
};

type Status = keyof typeof labels;

export function StatusSelect({
  id,
  status,
}: {
  id: string;
  status: Status;
}) {
  return (
    <form action={changeOrderStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        defaultValue={status}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className={`rounded-lg border-0 px-3 py-2 text-sm font-semibold outline-none ${styles[status]}`}
      >
        {Object.entries(labels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </form>
  );
}
