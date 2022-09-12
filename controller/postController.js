import mongoose from "mongoose";
import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      tags: req.body.tags.split(","),
      imageUrl: req.body.imageUrl,
      viewsCount: req.body.viewsCount,
      comment: req.body.comment,
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось создать статью",
    });
  }
};
export const setComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const postComment = { comment: req.body.comment, user: req.body.user };

    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $push: { comment: postComment },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            massage: "Не удалось вернуть комментарии",
          });
        }
        if (!doc) {
          return res.status(404).json({
            massage: "комментария не найдена",
          });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось создать статью",
    });
  }
};
export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const getPopular = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    const popular = posts.sort(function (a, b) {
      if (a.viewsCount < b.viewsCount) {
        return 1;
      }
      if (a.viewsCount > b.viewsCount) {
        return -1;
      }
      // a должно быть равным b
      return 0;
    });

    res.json(popular);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить статьи",
    });
  }
};
export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts.map((obj) => obj.tags).flat();

    let uniqueTags = tags.filter((element, index) => {
      return tags.indexOf(element) === index;
    });

    res.json(uniqueTags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить тэги",
    });
  }
};
export const getTagsPost = async (req, res) => {
  try {
    const tagsName = req.params.name;

    const posts = await PostModel.find().populate("user").exec();

    const tagsPost = posts.map((arr) => {
      const array1 = arr.tags;
      const array2 = [tagsName];
      array1.length;
      array2.length;
      var cache;
      const ln1 = array1.length;
      const ln2 = array2.length;
      for (var i = 0; i < ln1; ++i) {
        cache = array1[i];
        for (var j = 0; j < ln2; ++j) {
          if (cache == array2[j]) {
            return cache === tagsName ? arr : false;
          }
        }
      }
    });

    var filtered = tagsPost.filter(function (el) {
      return el != null;
    });
    res.json(filtered);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось получить тэг",
    });
  }
};
export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            massage: "Не удалось вернуть статью",
          });
        }
        if (!doc) {
          return res.status(404).json({
            massage: "Статью не найдена",
          });
        }
        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось создать статью",
    });
  }
};
export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findByIdAndDelete({ _id: postId }, (err, doc) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          massage: "Не удалось удалить статью",
        });
      }
      if (!doc) {
        return res.status(404).json({
          massage: "Статью не найдена",
        });
      }
      res.json({ success: true });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось удалить статью",
    });
  }
};
export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        tags: req.body.tags.split(","),
        imageUrl: req.body.imageUrl,
        user: req.userId,
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      massage: "Не удалось обновить статью",
    });
  }
};
