// @ts-nocheck
import api from "../api";

export const getWasteCollections = () =>
  api.get("/waste-collections/getwastecollection");

export const createWasteCollection = (payload) =>
  api.post("/waste-collections/createwastecollection", payload);

export const updateWasteCollection = (id, payload) =>
  api.patch(`/waste-collections/updatewastecollection/${id}`, payload);

export const deleteWasteCollection = (id) =>
  api.delete(`/waste-collections/deletewastecollection/${id}`);
