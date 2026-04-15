"use client";
import { useState } from "react";

const features = [
  { label: "Number of Pages", min: 1, max: 20, step: 1, base: 1, price: 100 },
  { label: "E-commerce", type: "checkbox", price: 500 },
  { label: "Blog", type: "checkbox", price: 200 },
  { label: "Custom Design", type: "checkbox", price: 300 },
  { label: "SEO Optimization", type: "checkbox", price: 150 },
  { label: "CMS Integration", type: "checkbox", price: 250 },
];

export default function PricingCalculatorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [pages, setPages] = useState(1);
  const [options, setOptions] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const handleOption = (feature: string, checked: boolean) => {
    setOptions((prev) => ({ ...prev, [feature]: checked }));
  };

  const total =
    pages * features[0].price +
    features
      .slice(1)
      .reduce((sum, f) => sum + (options[f.label] ? f.price : 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 w-full max-w-xl relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 text-2xl"
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">Website Pricing Calculator</h2>
        <div className="mb-4 flex items-center justify-between">
          <label className="font-medium text-black dark:text-white">Number of Pages</label>
          <input
            type="range"
            min={features[0].min}
            max={features[0].max}
            step={features[0].step}
            value={pages}
            onChange={(e) => setPages(Number(e.target.value))}
            className="w-2/3 accent-blue-500"
          />
          <span className="ml-4 text-black dark:text-white">{pages}</span>
        </div>
        {features.slice(1).map((f) => (
          <div key={f.label} className="mb-4 flex items-center justify-between">
            <label className="font-medium text-black dark:text-white">{f.label}</label>
            <input
              type="checkbox"
              checked={!!options[f.label]}
              onChange={(e) => handleOption(f.label, e.target.checked)}
              className="accent-blue-500"
            />
            <span className="ml-4 text-black dark:text-white">+${f.price}</span>
          </div>
        ))}
        <div className="mt-8 text-xl font-semibold text-center text-black dark:text-white">
          Estimated Total: <span className="text-blue-600 dark:text-blue-400">${total}</span>
        </div>
      </div>
    </div>
  );
}
