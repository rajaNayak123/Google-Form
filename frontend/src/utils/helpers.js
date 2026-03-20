export const QUESTION_TYPES = [
  { value: "SHORT_ANSWER", label: "Short Answer", icon: "✏️" },
  { value: "LONG_ANSWER", label: "Long Answer", icon: "📝" },
  { value: "NUMBER", label: "Number", icon: "🔢" },
  { value: "YES_NO", label: "Yes / No", icon: "🔘" },
  { value: "SINGLE_CHOICE", label: "Single Choice", icon: "◉" },
  { value: "MULTIPLE_CHOICE", label: "Multiple Choice", icon: "☑️" },
  { value: "DATE", label: "Date", icon: "📅" },
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
