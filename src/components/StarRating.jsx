import { useState } from 'react';

export default function StarRating({ value, onChange, size = 'text-2xl' }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          className={`${size} transition-colors cursor-pointer ${
            star <= (hover || value) ? 'text-yellow-400' : 'text-gray-300'
          }`}
          onClick={() => onChange(star === value ? 0 : star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
