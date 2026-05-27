export default class DepartmentService {
  async init(db) {
    this.Model = db.models;
  }

  async getDepartmentList(filter = {}) {
    const where = {};
    // allow optional filters in the future (e.g., by name)
    return await this.Model.DepartmentModel.findAll({
      where,
      attributes: ["id", "name"],
      order: [["id", "DESC"]],
    });
  }
}
