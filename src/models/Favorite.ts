import { model, models, Schema, type Model, type Types } from "mongoose";

export interface FavoriteDocument {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  recipe: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipe: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

favoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

export const Favorite: Model<FavoriteDocument> =
  (models.Favorite as Model<FavoriteDocument>) ??
  model<FavoriteDocument>("Favorite", favoriteSchema);

export default Favorite;