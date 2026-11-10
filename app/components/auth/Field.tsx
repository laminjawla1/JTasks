type FieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  minLength?: number;
};

export default function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  minLength,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        minLength={minLength}
        required
        aria-invalid={!!error}
        className={`rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition focus:ring-4 ${
          error
            ? "border-red-400 focus:ring-red-100"
            : "border-slate-300 focus:border-emerald-500 focus:ring-emerald-100"
        }`}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
