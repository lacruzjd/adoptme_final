import petModel from "./models/Pet.js";
import mongoose from "mongoose";

export default class Pet {
  get = (params) => {
    return petModel.find(params);
  };

  getBy = (params) => {
    if (params._id && !mongoose.Types.ObjectId.isValid(params._id)) {
      return null; // devolvemos null en vez de dejar que explote
    }
    return petModel.findOne(params);
  };

  save = (doc) => {
    return petModel.create(doc);
  };

  update = (id, doc) => {
    return petModel.findByIdAndUpdate(id, { $set: doc });
  };

  delete = (id) => {
    return petModel.findByIdAndDelete(id);
  };
}
