const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator"); // used for strings only
const User = require("./userModel");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      minLength: [10, "name must be at least 10 char"],
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      minLength: [0, "enter number between 0 and 5"],
      maxLength: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "discount wrong",
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a max group size"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "wrong",
      },
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
      select: false,
    },
    startLocation: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
    locations: [
      {
        type: {
          type: String,
          default: "point",
          enum: ["point"],
        },
        coordination: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    // added to enable virtual
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: -1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

// virtual properties are not stored in the database but are calculated on the fly when we get some data from the database
//or when we send data to the client
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// virtual populate for reviews
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });
  next();
});
// tour embedding
// tourSchema.pre("save", async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre("/^find/", function (next) {
  // /^find/ means all commands that begin with find like findOne
  this.find({ secretTour: { $ne: true } });
  next();
});

// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { $secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
