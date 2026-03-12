import adoptionModel from "./models/Adoption.js";
import mongoose from "mongoose";
export default class Adoption {
  get = (params) => {
    return adoptionModel.find(params);
  };

  getBy = (params) => {
    if (params._id && !mongoose.Types.ObjectId.isValid(params._id)) {
      return null; // devolvemos null en vez de dejar que explote
    }

    return adoptionModel.findOne(params);
  };

  save = (doc) => {
    return adoptionModel.create(doc);
  };

  update = (id, doc) => {
    return adoptionModel.findByIdAndUpdate(id, { $set: doc });
  };

  delete = (id) => {
    return adoptionModel.findByIdAndDelete(id);
  };
}
