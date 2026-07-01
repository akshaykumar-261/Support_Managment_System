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
  async getUserList({ offset = 0, limit = 10, role, name, email, is_active,search}) {
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
     if (search) {
    query.where[Op.or] = [
      {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        phoneNo: {
          [Op.like]: `%${search}%`,
        },
      },
      {
        address: {
          [Op.like]: `%${search}%`,
        },
      },
    ];
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
      "deletedAt",
    ],
  },
});

const modifiedRows = rows.map((user) => {
  const userData = user.toJSON ? user.toJSON() : user;
 userData.is_verified = Boolean(userData.is_verified);
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
  async findCreateSocialUser(name, email,provider, socialId) {
    // check wether social login user's provider aur socialId exists
    let user = await this.Model.Users.findOne({
      where: {
        social_id: socialId,
        provider: provider,
        deletedAt: null
      }
    })
    //if social user not found then check wether this email's any local user registered
    if (!user && email) {
      user = await this.Model.Users.findOne({
        where: {
          email: email.toLowerCase().trim(),
          deletedAt:null
        }
      })
    }
   if (user) {
      await this.Model.Users.update(
        {
          social_id: socialId,
          provider: provider,
          is_verified: true,
        },
        { where: { id: user.id } }
      );
      user = await this.Model.Users.findByPk(user.id);
    }
    if (!user) {
    const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const newUser = await this.Model.Users.create({
      name: name,
      email:   email.toLowerCase().trim(),
      password: randomPassword,
      is_verified: true, 
      role_Id: 3,
      provider: provider,
      social_id: socialId,
      is_active: true
    });
    user = newUser;
    }
    return user;
  }



















//    async findCreateSocialUser(name, email, provider, socialId) {
//     const transaction = await this.Model.sequelize.transaction();

// try {
//   let user = await this.Model.Users.findOne({
//     where: {
//       social_id: socialId,
//       provider,
//       deletedAt: null,
//     },
//     transaction,
//   });

//   if (!user && email) {
//     user = await this.Model.Users.findOne({
//       where: {
//         email: email.toLowerCase().trim(),
//         deletedAt: null,
//       },
//       transaction,
//     });
//   }

//   if (user) {
//     await this.Model.Users.update(
//       {
//         social_id: socialId,
//         provider,
//         is_verified: true,
//       },
//       {
//         where: { id: user.id },
//         transaction,
//       }
//     );

//     user = await this.Model.Users.findByPk(user.id, {
//       transaction,
//     });
//   }

//   if (!user) {
//     user = await this.Model.Users.create(
//       {
//         name,
//         email: email.toLowerCase().trim(),
//         password: randomPassword,
//         is_verified: true,
//         role_Id: 3,
//         provider,
//         social_id: socialId,
//         is_active: true,
//       },
//       {
//         transaction,
//       }
//     );
//   }

//   await transaction.commit();

//   return user;
// } catch (error) {
//   await transaction.rollback();
//   throw error;
// }
//   }
}
