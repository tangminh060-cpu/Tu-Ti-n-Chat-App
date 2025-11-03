
import React, { useState, useEffect, useRef } from 'react';

interface EditableFieldProps {
  value: string | number;
  onSave: (value: string | number) => void;
  inputType?: 'text' | 'number' | 'textarea';
  // Fix: Specify that children's props can include className and other properties to resolve type errors.
  children: React.ReactElement<{ className?: string; [key: string]: any }>;
  className?: string;
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onSave,
  inputType = 'text',
  children,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      if (inputRef.current) {
        if(inputType !== 'textarea') {
            (inputRef.current as HTMLInputElement).select();
        }
      }
    }
  }, [isEditing, inputType]);

  const handleSave = () => {
    if (currentValue !== value) {
        onSave(inputType === 'number' ? Number(currentValue) : currentValue);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && inputType !== 'textarea') {
      handleSave();
    } else if (e.key === 'Escape') {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const commonProps = {
      ref: inputRef as any,
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentValue(e.target.value),
      onBlur: handleSave,
      onKeyDown: handleKeyDown,
      // Fix: Add fallback for className to prevent "undefined" in class string.
      className: `bg-gray-700 text-white w-full rounded p-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${children.props.className || ''}`,
    };
    
    return inputType === 'textarea' ? (
      <textarea {...commonProps} rows={4} />
    ) : (
      <input type={inputType} {...commonProps} />
    );
  }

  return React.cloneElement(children, {
    onClick: () => setIsEditing(true),
    // Fix: Add fallback for className to prevent "undefined" in class string.
    className: `${children.props.className || ''} cursor-pointer hover:bg-white/10 rounded-md p-1 -m-1 transition-colors`,
    title: 'Click to edit'
  });
};

export default EditableField;
