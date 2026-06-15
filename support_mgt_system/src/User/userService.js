import { Op } from "sequelize";

export default class UserService {
  async init(db) {
    this.Model = db.models;
  }
  getByEmail = async (email) => {
    if (!email) return null;
    return await this.Model.Users.findOne({
      where: {
        email: email.toLowerCase().trim(),
        deletedAt: null,
      },
    });
  };

  getUserById = async (id) => {
    return this.Model.Users.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
    });
  };
  updateUser = async (id, payload) => {
    return this.Model.Users.update(payload, { where: { id: id } });
  };
  async clearRefreshToken(id) {
    return this.Model.Users.update({ refreshToken: null }, { where: { id } });
  }
  async createUser(payload) {
    const user = await this.Model.Users.create(payload);
    return await this.Model.Users.findByPk(user.id, {
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "otp",
          "otp_expire",
          "otp_type",
          "is_active",
          "is_verified",
          "deletedAt"
        ],
      },
    });
  }
  async deleteUserById(id) {
    const payload = { deletedAt: new Date(), is_active: 0 };
    return this.Model.Users.update(payload, { where: { id: id } });
  }
  async getUserList({ offset = 0, limit = 10, role, name, email, is_active }) {
    const query = {
      where: {
        deletedAt: null,
      },

      order: [["id", "DESC"]],

      raw: true,

      nest: true,

      attributes: {
        exclude: ["password", "otp"],
      },
    };
   if (role) {
  query.where.role_Id = Number(role);
}
    if (name) {
      query.where.name = {
        [Op.like]: `%${name}%`,
      };
    }

    if (email) {
      query.where.email = {
        [Op.like]: `%${email}%`,
      };
    }

    if (is_active !== undefined) {
      query.where.is_active = is_active;
    }

const { count, rows } = await this.Model.Users.findAndCountAll({
  ...query,
  offset,
  limit,
  attributes: {
    exclude: [
      "password",
      "createdAt",
      "updatedAt",
      "refreshToken",
      "otp",
      "otp_expire",
      "otp_type",
      "is_active",
      "is_verified",
      "deletedAt",
    ],
  },
});

const modifiedRows = rows.map((user) => {
  const userData = user.toJSON ? user.toJSON() : user;

  if (userData.role_Id !== 2) {
    delete userData.department_Id;
  }
  return userData;
});

return {
  count,
  rows: modifiedRows,
};

    return { count, rows };
  }
  async getProfile(id) {
    return await this.Model.Users.findOne({
      where: {
        id,
        deletedAt: null,
      },
      attributes: {
        exclude: [
          "password",
          "otp",
          "refreshToken",
          "createdAt",
          "updatedAt",
          "deletedAt",
          "is_active",
          "department_Id",
        ],
      },
    });
  }
  async saveOtp(userId, otp, otptype) {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes From Now
    console.log("Saving OTP:", otp);
    console.log("Saving Expire Time:", expireTime);
    return await this.Model.Users.update(
      {
        otp: otp,
        otp_expire: expireTime,
        otp_type: otptype,
      },
      {
        where: { id: userId },
      },
    );
  }
  async getUserWithPassword(id) {
  return await this.Model.Users.findOne({
    where: {
      id,
      deletedAt: null,
    },
  });
}
}
