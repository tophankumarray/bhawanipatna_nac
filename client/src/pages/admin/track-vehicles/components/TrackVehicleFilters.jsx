// @ts-nocheck
const TrackVehicleFilters = ({ filters, setFilters, wards }) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        placeholder="Vehicle number, Driver..."
        value={filters.search}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
        className="w-full px-4 py-2 rounded-xl border"
      />

      <select
        value={filters.status}
        onChange={e => setFilters({ ...filters, status: e.target.value })}
        className="w-full px-4 py-2 rounded-xl border"
      >
        <option value="all">All Status</option>
        <option value="running">Running</option>
        <option value="standing">Standing</option>
        <option value="stopped">Stopped</option>
        <option value="dataNotRetrieving">Offline</option>
      </select>

      {/* <select
        value={filters.ward}
        onChange={e => setFilters({ ...filters, ward: e.target.value })}
        className="w-full px-4 py-2 rounded-xl border"
      >
        <option value="all">All Wards</option>
        {wards.map(w => (
          <option key={w} value={w}>{w}</option>
        ))}
      </select> */}
    </div>
  </div>
);

export default TrackVehicleFilters;
