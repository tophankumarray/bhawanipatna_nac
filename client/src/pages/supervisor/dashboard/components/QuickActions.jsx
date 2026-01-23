const QuickActions = ({ actions, onNavigate }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map((a, i) => {
        const Icon = a.icon;

        return (
          <button
            key={i}
            onClick={() => onNavigate(a.path)}
            className={`bg-gradient-to-r ${a.color} text-white rounded-xl px-6 py-4 flex items-center gap-3 shadow hover:opacity-90`}
          >
            <Icon />
            {a.label}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActions;
