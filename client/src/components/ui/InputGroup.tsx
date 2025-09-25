'use client';

import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

interface Option {
  label: string;
  value: string | number;
}

interface InputGroupProps {
  icon?: string;
  type?: 'text' | 'dropdown';
  value: string | number;
  options?: Option[];
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
  error?: string;
}

export const InputGroup = ({
  icon = 'pi-filter',
  type = 'dropdown',
  value,
  options = [],
  onChange,
  placeholder,
  className = 'flex-1',
  disabled = false,
  label,
  required = false,
  error,
}: InputGroupProps) => {
  return (
    <div className={`field mb-4 ${className}`}>
      {label && (
        <label className="font-bold text-gray-700">
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="p-inputgroup">
        <span className="p-inputgroup-addon" style={{ background: 'white' }}>
          <i className={`pi ${icon}`}></i>
        </span>
        {type === 'dropdown' ? (
          <Dropdown
            value={value}
            options={options}
            onChange={(e) => onChange(e.value)}
            placeholder={placeholder}
            className={`w-full ${error ? 'p-invalid' : ''}`}
            disabled={disabled}
          />
        ) : (
          <InputText
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${error ? 'p-invalid' : ''}`}
            disabled={disabled}
          />
        )}
      </div>
      {error && <small className="p-error">{error}</small>}
    </div>
  );
};
