const mongoose = require("mongoose");
require("dotenv").config();

const models = require("../modelData/models.js");

const User = require("../db/userModel.js");
const Photo = require("../db/photoModel.js");
const PostList = require("../db/postModel.js");
const SchemaInfo = require("../db/schemaInfo.js");

const versionString = "1.0";

async function dbLoad() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB Atlas!");
  } catch (error) {
    console.log("Unable connecting to MongoDB Atlas!");
  }

  await User.deleteMany({});
  await Photo.deleteMany({});
  await PostList.deleteMany({});
  await SchemaInfo.deleteMany({});

  const userModels = models.userListModel();
  const mapFakeId2RealId = {};
  for (const user of userModels) {
    userObj = new User({
      login_name: user.login_name,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
    try {
      await userObj.save();
      mapFakeId2RealId[user._id] = userObj._id;
      user.objectID = userObj._id;
      console.log(
        "Adding user:",
        user.first_name + " " + user.last_name,
        " with ID ",
        user.objectID
      );
    } catch (error) {
      console.error("Error create user", error);
    }
  }
  const photoModels = [];
  const userIDs = Object.keys(mapFakeId2RealId);
  userIDs.forEach(function (id) {
    photoModels.push(...models.photoOfUserModel(id));
  });
  for (const photo of photoModels) {
    photoObj = await Photo.create({
      file_name: photo.file_name,
      date_time: photo.date_time,
      user_id: mapFakeId2RealId[photo.user_id],
    });
    photo.objectID = photoObj._id;
    if (photo.comments) {
      photo.comments.forEach(function (comment) {
        photoObj.comments = photoObj.comments.concat([
          {
            comment: comment.comment,
            date_time: comment.date_time,
            user_id: comment.user.objectID,
          },
        ]);
        console.log(
          "Adding comment of length %d by user %s to photo %s",
          comment.comment.length,
          comment.user.objectID,
          photo.file_name
        );
      });
    }
    try {
      await photoObj.save();
      console.log(
        "Adding photo:",
        photo.file_name,
        " of user ID ",
        photoObj.user_id
      );
    } catch (error) {
      console.error("Error create photo", error);
    }
  }
  const postData = [
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd7"], // Ian Malcolm
      title: "Bài viết số 1 của Ian Malcolm",
      description: "Cuộc sống luôn tìm được cách.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd7"], // Ian Malcolm
      title: "Bài viết số 2 của Ian Malcolm",
      description: "Bạn thật sự đã làm được điều đó.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd8"], // Ellen Ripley
      title: "Bài viết số 1 của Ellen Ripley",
      description: "Tôi là người sống sót cuối cùng trên Nostromo.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd8"], // Ellen Ripley
      title: "Bài viết số 2 của Ellen Ripley",
      description: "Chúng ta nên tiêu diệt nơi đó để đảm bảo an toàn.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd9"], // Peregrin Took
      title: "Bài viết số 1 của Peregrin Took",
      description: "Nhà là nơi ta bắt đầu, thế giới là nơi ta hướng tới.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bd9"], // Peregrin Took
      title: "Bài viết số 2 của Peregrin Took",
      description: "Mọi thứ rồi sẽ phai nhạt theo thời gian.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bda"], // Rey Kenobi
      title: "Bài viết số 1 của Rey Kenobi",
      description: "Hy vọng vẫn còn, không bao giờ mất đi.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bda"], // Rey Kenobi
      title: "Bài viết số 2 của Rey Kenobi",
      description: "Mỗi thế hệ đều có người hùng của riêng mình.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bdb"], // April Ludgate
      title: "Bài viết số 1 của April Ludgate",
      description: "Tôi đã yểm bùa phòng kiểm soát động vật.",
    },
    {
      user_id: mapFakeId2RealId["57231f1a30e4351f4e9f4bdc"], // John Ousterhout
      title: "Bài viết số 1 của John Ousterhout",
      description: "Hãy cùng nói về ngôn ngữ lập trình đơn giản.",
    },
  ];

  for (const post of postData) {
    try {
      const postObj = await PostList.create(post);
      console.log(`Added post '${post.title}' for user ID ${post.user_id}`);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  }
  try {
    schemaInfo = await SchemaInfo.create({
      version: versionString,
    });
    console.log("SchemaInfo object created with version ", schemaInfo.version);
  } catch (error) {
    console.error("Error create schemaInfo", reportError);
  }
  mongoose.disconnect();
}

dbLoad();
