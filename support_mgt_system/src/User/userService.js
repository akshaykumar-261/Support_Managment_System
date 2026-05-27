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
      raw: true,
    });
  };
 
  getUserById = async (id) => {
    return this.Model.Users.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
      raw: true,
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
        return user;
    }
    async deleteUserById(id){
      const payload = { deletedAt: new Date(), is_active: 0 };
        return this.Model.Users.update(payload, { where: { id: id } });
    }
    async getUserList({ offset = 0, limit = 10,role_id,search,name,email,is_active }) {
        const query = {
        where: { deletedAt: null },
            order: [["id", "DESC"]],
            raw: true,
            attributes: {
                exclude:["password","otp",]
            }
        }
        if (role_id) {
            query.where.role_id = role_id;
        }
        if (name) {
            query.where.name = {[Op.like]: `%${name}%`};
        }
        if (email) {
            query.where.email = {[Op.like]: `%${email}%`};
        }
        if(is_active !== undefined){
            query.where.is_active = is_active;
        }
        const { count, rows } = await this.Model.Users.findAndCountAll({
            ...query,
            offset,
            limit,
        });
        return { count, rows };
    }
    
}
