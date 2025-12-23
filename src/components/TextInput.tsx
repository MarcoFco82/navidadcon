'use client';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  description?: string;
  rows?: number;
}

export default function TextInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  maxLength,
  multiline = false,
  description,
  rows = 3
}: TextInputProps) {
  const commonClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--christmas-wine)] focus:border-transparent transition-all";

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <label className="block text-sm font-medium text-christmas-wine">
          {label}
        </label>
        {maxLength && (
          <span className="text-xs text-gray-400">
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={rows}
          className={`${commonClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={commonClasses}
        />
      )}
    </div>
  );
}