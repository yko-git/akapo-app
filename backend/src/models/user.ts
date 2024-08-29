import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
} from "sequelize";

import { Post } from "./post";
import { sequelize } from ".";
import Category from "./category";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare loginId: number;
  declare authorizeToken: string;
  declare name: string;
  declare iconUrl: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare getPosts: HasManyGetAssociationsMixin<Post>;
  async posts(status: any) {
    const where: { userId: number; status?: any } = {
      userId: this.id,
    };

    if (status) {
      where.status = status;
    }
    return this.getPosts({
      where,
      include: {
        model: Category,
        through: { attributes: [] },
      },
    });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    loginId: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: true,
      },
    },
    authorizeToken: DataTypes.STRING,
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "名前は必ず入力してください",
        },
      },
    },
    iconUrl: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        notNull: {
          msg: "iconUrlは必ず入力してください",
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  { sequelize, modelName: "User", tableName: "users" }
);

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

export { User };
