// @ts-nocheck
export const buildWardPayload = (ward) => ({
  wardName: ward.wardName,
  area: Number(ward.area),
  population: Number(ward.population),
  household: Number(ward.household),
  wasteGenerationPerDay: Number(ward.wasteGenerationPerDay),
  collectionFrequency:
    ward.collectionFrequency.charAt(0).toUpperCase() +
    ward.collectionFrequency.slice(1),
  supervisorName: ward.supervisorName,
  supervisorPhone: ward.supervisorPhone,
});
