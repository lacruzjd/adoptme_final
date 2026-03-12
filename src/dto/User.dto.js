import { id_ID } from "@faker-js/faker";

export default class UserDTO {
  static getUserTokenFrom = (user) => {
    return {
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      email: user.email,
    };
  };

  static getUserOutputFrom = (user) => {
    return {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
      pets: user.pets,
    };
  };
}
