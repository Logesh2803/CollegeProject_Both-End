const router = require("express").Router();
const firebase = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const uid = firebase.firestore().collection("users").doc().id;

  const users = await firebase
    .firestore()
    .collection("users")
    .get()
    .then((res) => res.docs.map((doc) => doc.data()));

  if (users.some((user) => user.email == email || user.userName == userName))
    return res.status(400).send("User Already Created");

  await firebase.firestore().collection("users").doc(uid).create({
    uid: uid,
    firebase: firstName,
    lastName: lastName,
    userName: userName,
    email: email,
    password: hashedPassword,
  });

  const privateKey = process.env.PRIVATE_KEY;

  const token = jwt.sign({ uid: uid, ...req.body }, privateKey);

  res
    .cookie("token", token, { maxAge: 1000 * 60 * 15, httpOnly: true })
    .status(200)
    .send({ status: 200, message: "New User Created" });
});

const verifyUser = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(403).send("Unauthorized");

  const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

  const verify = await firebase
    .firestore()
    .collection("users")
    .doc(decodedToken.uid)
    .get()
    .then((res) => res.data());

  if (!verify) return res.status(403).send("Unauthorized");
  next();
};

router.get("/verify", verifyUser, (req, res) => {
  return res.status(200).send({ message: "Logged in" });
});

router.get("/logout", (req, res) => {
  res.cookie("token", "").send("Logout Success");
});

router.get("/cart", verifyUser, async (req, res) => {
  const token = req.cookies.token;

  const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

  const products = await firebase
    .firestore()
    .collection("users")
    .doc(decodedToken.uid)
    .collection("cart")
    .get()
    .then((res) => res.docs.map((doc) => doc.data()));

  return res.status(200).send({
    status: 200,
    data: products,
  });
});

router.post("/cart", verifyUser, async (req, res) => {
  const token = req.cookies.token;

  const { productId } = req.body;

  const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

  const product = await firebase
    .firestore()
    .collection("products")
    .doc(productId)
    .get()
    .then((res) => {
      const id = res.id;
      return {
        id: id,
        ...res.data(),
      };
    });

  await firebase
    .firestore()
    .collection("users")
    .doc(decodedToken.uid)
    .collection("cart")
    .add(product);

  return res.status(200).send("Success");
});

router.post("/login", async (req, res) => {
  const token = req.cookies.token;
  const { userName, password } = req.body;
  //   if (token) {
  //     const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

  //     const verify = await firebase
  //       .firestore()
  //       .collection("users")
  //       .doc(decodedToken.uid)
  //       .get()
  //       .then((res) => res.data());

  //     if (verify) return res.status(208).send({ message: "Already Login" });
  //   }

  const user = await firebase
    .firestore()
    .collection("users")
    .where("userName", "==", userName)
    .get()
    .then((res) => res.docs.map((res) => res.data()));

  const verifyPassword = await bcrypt.compare(password, user[0].password);

  if (verifyPassword) {
    const token = jwt.sign(user[0], process.env.PRIVATE_KEY);
    return res
      .cookie("token", token, { maxAge: 1000 * 60 * 15, httpOnly: true })
      .status(200)
      .send({ status: 200, message: "Login Success" });
  } else {
    return res.status(403).send({ message: "Incorrect Password" });
  }
});

module.exports = router;
