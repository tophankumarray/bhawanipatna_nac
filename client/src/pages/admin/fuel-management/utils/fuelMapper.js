// @ts-nocheck
export const mapFuelRecord = (item) => ({
  _id: item._id,
  vehicle: item.vehicleNumber,
  driver: item.driverName,
  refuelDate: item.date.split("T")[0],
  fuelType: item.fuelType.toLowerCase(),
  quantity: item.quantityLiters,
  pricePerLiter: item.pricePerLiter,
  odometer: item.odometerReading,
  efficiency: item.efficiency,
  fillingStation: item.fillingStation,
  totalCost: (item.quantityLiters * item.pricePerLiter).toFixed(2),
});
