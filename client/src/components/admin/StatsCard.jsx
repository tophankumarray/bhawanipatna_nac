// @ts-nocheck
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon, gradient, link, showButton = true }) => {
  return (
    <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl shadow-xl p-5 sm:p-7 text-white hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group overflow-hidden`}>
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative animated circles */}
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
      <div className="absolute -right-3 -bottom-3 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700 ease-out"></div>
      <div className="absolute -left-4 top-1/2 w-20 h-20 bg-white/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-700"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold opacity-95 tracking-wide uppercase">{title}</h3>
          <div className="text-3xl sm:text-4xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">{icon}</div>
        </div>
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-extrabold mb-1 drop-shadow-lg">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className="h-1 w-16 bg-white/30 rounded-full group-hover:w-24 transition-all duration-500"></div>
        </div>
        {showButton && (
          link ? (
            <Link to={link} className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl transition-all backdrop-blur-sm font-semibold hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2">
              View Details 
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          ) : (
            <div className="text-sm bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm font-semibold flex items-center gap-2 opacity-50">
              View Details 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default StatsCard;
