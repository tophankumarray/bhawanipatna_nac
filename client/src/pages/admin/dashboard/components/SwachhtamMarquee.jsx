// @ts-nocheck
const SwachhtamMarquee = () => {
  const now = new Date();
  const startDate = new Date("2026-01-20");
  const endDate = new Date("2026-02-25");

  const isSwachhtamPeriod = now >= startDate && now <= endDate;

  if (!isSwachhtamPeriod) return null;

  return (
    <div className="w-full bg-linear-to-r from-orange-500 via-red-500 to-pink-600 shadow-lg mb-6 rounded-xl overflow-hidden">
      <div className="overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap py-3 px-6">
          <div className="flex items-center gap-8">
            <span className="text-white font-bold text-lg flex items-center gap-3">
              🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
            </span>

            <a
              href="https://admin.sbmurban.org/u/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold text-lg flex items-center gap-3 hover:text-orange-200 underline decoration-2 underline-offset-2 transition-all duration-200 hover:scale-105"
            >
              📱 https://admin.sbmurban.org/u/login 📱
            </a>

            <span className="text-white font-bold text-lg flex items-center gap-3">
              🚨 LOGIN TO SWACHHTAM PORTAL NOW 🚨
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwachhtamMarquee;
