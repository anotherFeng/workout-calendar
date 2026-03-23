export default function VitaminChecklist({ vitamins, vitaminChecks, onToggle }) {
  return (
    <div className="space-y-2">
      {vitamins.map(vitamin => {
        const check = vitaminChecks.find(vc => vc.vitaminId === vitamin.id);
        const isChecked = check?.checked || false;

        return (
          <label
            key={vitamin.id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              isChecked ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onToggle(vitamin.id, !isChecked)}
              className="w-5 h-5 rounded accent-green-500"
            />
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm ${isChecked ? 'text-green-700' : 'text-gray-700'}`}>
                {vitamin.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {vitamin.dose} — {vitamin.timing}
              </div>
            </div>
          </label>
        );
      })}
    </div>
  );
}
