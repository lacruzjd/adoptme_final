import userModel from "./models/User.js";
import mongoose from "mongoose";

export default class Users {
  get = (params) => {
    return userModel.find(params);
  };

  getBy = (params) => {
    if (params._id && !mongoose.Types.ObjectId.isValid(params._id)) {
      return null; // devolvemos null en vez de dejar que explote
    }
    return userModel.findOne(params);
  };

  save = (doc) => {
    return userModel.create(doc);
  };

  update = (id, doc) => {
    return userModel.findByIdAndUpdate(id, { $set: doc });
  };

  delete = (id) => {
    return userModel.findByIdAndDelete(id);
  };
}
