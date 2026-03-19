import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ 
  id, 
  label, 
  value, 
  onChange, 
  disabled = false, 
  placeholder = "••••••••",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="block text-sm font-medium text-gray-300" htmlFor={id}>
          {label}
        </label>
        {/* Forgot password link has been disabled/removed based on assessment */}
      </div>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-quantum-900/50 border border-white/10 rounded-lg pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-quantum-primary/50 focus:border-transparent transition-all"
          required
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-quantum-accent focus:outline-none transition-colors"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};
