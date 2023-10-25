require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserModel = require("./model/userSchema");
// const PORT = 5000;

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DB_URI = process.env.DB_URI;
mongoose.connect(DB_URI);
mongoose.connection.on("connected", () => console.log("MongoDB Connected"));
mongoose.connection.on("error", (err) => console.log("MongoDB Error", err));

app.get("/", (req, res) => {
  res.json({
    message: "serverup",
  });
});

// login Api
app.post("/api/signup", async (req, res) => {
  try {
    const body = req.body;
    const { firstName, lastName, age, gender, email, password, phoneNo } = body;
    if (
      !firstName ||
      !lastName ||
      !age ||
      !gender ||
      !email ||
      !password ||
      !phoneNo
    ) {
      res.json({
        status: false,
        message: "Required fields are missing",
        data: null,
      });
      return;
    }
    const hashpass = await bcrypt.hash(password, 10);
    const objToSend = {
      first_name: firstName,
      last_name: lastName,
      phone_no: phoneNo,
      age,
      gender,
      email,
      password: hashpass,
    };
    const emailExist = await UserModel.findOne({ email });
    console.log(emailExist, "emailExist");
    if (emailExist) {
      res.json({
        status: false,
        message: "this email address has been already exists Please try again",
        data: null,
      });
      return;
    }
    const userSave = await UserModel.create(objToSend);

    res.json({
      status: true,
      message: "user successfully signup",
      data: userSave,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
      data: null,
    });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  const emailExist = await UserModel.findOne({email})
  if (!emailExist) {
    res.json({
      message: "Invalid Credential",
      status: false,
      data: null,
    });
    return;
  }
  const comparePass = await bcrypt.compare(password, emailExist.password);
  if (comparePass) {
    res.json({
      message: "user login",
      status: true,
      data: emailExist,
    });
    return;
  } else {
    res.json({
      message: "Invalid Credential",
      status: false,
      data: null,
    });
    return;
  }
});

const globalPORT = process.env.PORT;
// console.log(process.env)

app.listen(globalPORT, () => {
  console.log(`server running on localhost:${globalPORT}`);
});
