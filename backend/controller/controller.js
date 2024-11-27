const express = require("express");
const app = express();
const zod = require("zod");
const { User, Account } = require("../schema/schema");
const jwt = require("jsonwebtoken");
const JWT_Secret = require("../config");
const { default: mongoose } = require("mongoose");
const signUpBody = zod.object({
  firstname: zod.string({ message: "hi" }),
  lastname: zod.string({ message: "hi" }),
  email: zod.string().email({ message: "invalid email address" }),
  password: zod
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});
const signupController = async (req, res) => {
  const { success, err } = signUpBody.safeParse(req.body);
  try {
    if (!success) {
      if (!success) {
        // Send the detailed error messages from Zod back to the client
        res.status(400).json({ message: err });
      }
    }

    const existingUsers = await User.findOne({
      email: req.body.email,
    });

    if (existingUsers) {
      return res.status(411).json({
        message: "email already taken",
      });
    }

    const user = await User.create(req.body);
    const userId = user._id;
    await Account.create({
      userId,
      balance: 1 + Math.floor(Math.random() * 1000),
    });

    const token = jwt.sign(
      {
        userId,
      },
      JWT_Secret
    );
    res.json({ message: "user Created Successfully", token: token });
  } catch (error) {
    res.status(411).send(err);
  }
};

const signInBody = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});
const signinController = async (req, res) => {
  try {
    const { success } = signInBody.safeParse(req.body);
    if (!success) {
      res.status(411).json({ message: "error in credentials" });
    }

    const emailCheck = await User.findOne({ email: req.body.email });
    if (!emailCheck) {
      res.status(400).json({ message: "Incorrect Email" });
    } else {
      if (emailCheck.password == req.body.password) {
        const token = jwt.sign({ userId: emailCheck._id }, JWT_Secret);
        res
          .status(200)
          .json({
            message: "login successful",
            token: token,
            id: emailCheck._id,
          });
      } else {
        res.status(400).json({ message: "incorrect password" });
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

const updateController = async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(400).json({ message: "error updating" });
  }
  try {
    await User.updateOne({ _id: req.id }, req.body);
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "error updating body" });
  }
};

const filterController = async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstname: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastname: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.json({
    user: users.map((i) => ({
      email: i.email,
      firstname: i.firstname,
      lastname: i.lastname,
      id: i._id,
    })),
  });
};

const balanceCheck = async (req, res) => {
  try {
    // console.log(req.id)
    const acc = await Account.findOne({ userId: req.id });
    res.status(200).json({ balance: acc.balance });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};
const profileController = async (req, res) => {
  const profile = await User.findOne({ _id: req.id });
  res.send({ message: profile });
};
const transectionCheck = zod.object({
  amount: zod.number(),
  to: zod.string().email({ message: "invalid email address" }),
});
const transferController = async (req, res) => {
  try {
    const { success, error } = transectionCheck.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: error.errors[0] });
    }
    const session = await mongoose.startSession();
    session.startTransaction();

    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.id }).session(session);

    if (!account) {
      await session.abortTransaction();
      return res.status(400).send({ message: "something went wrong" });
    }
    if (account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }
    const toAccount = await User.findOne({ email: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({ message: "receiver email donot exist" });
    }
    const receiverId = toAccount._id;
    if (receiverId == req.id) {
      await session.abortTransaction();
      return res.status(400).json({ message: "cannot send to own account" });
    }

    await Account.updateOne(
      { userId: req.id },
      { $inc: { balance: -amount } }
    ).session(session);
    await Account.updateOne(
      { userId: receiverId },
      { $inc: { balance: amount } }
    ).session(session);

    await session.commitTransaction();

    res.json({
      message: "Transfer Successful",
    });
  } catch (error) {
    res.status(400).json({ message: "error in transection" });
  }
};

module.exports = {
  signupController,
  transferController,
  signinController,
  updateController,
  profileController,
  filterController,
  balanceCheck,
};
