import React from 'react';
import { Type, AlignLeft, Hash, ToggleLeft, CircleDot, CheckSquare, Calendar } from 'lucide-react';

export const QUESTION_TYPES = [
  { value: "SHORT_ANSWER", label: "Short Answer", icon: <Type className="w-4 h-4" /> },
  { value: "LONG_ANSWER", label: "Long Answer", icon: <AlignLeft className="w-4 h-4" /> },
  { value: "NUMBER", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { value: "YES_NO", label: "Yes / No", icon: <ToggleLeft className="w-4 h-4" /> },
  { value: "SINGLE_CHOICE", label: "Single Choice", icon: <CircleDot className="w-4 h-4" /> },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice", icon: <CheckSquare className="w-4 h-4" /> },
  { value: "DATE", label: "Date", icon: <Calendar className="w-4 h-4" /> },
];

export const getTypeLabel = (type) =>
  QUESTION_TYPES.find((t) => t.value === type)?.label ?? type;

export const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const copyToClipboard = (text) => navigator.clipboard.writeText(text);

export const generateId = () => Math.random().toString(36).slice(2, 9);
