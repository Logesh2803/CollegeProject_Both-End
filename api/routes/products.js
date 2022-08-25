const router = require("express").Router();
const firebase = require("../config/db");

router.post("/product", async (req, res) => {
  console.log(req.body);
  
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await firebase
    .firestore()
    .collection("products")
    .doc(id.trim())
    .get()
    .then((res) => {
      return {
        id: id,
        ...res.data(),
      };
    });

  if (!product)
    return res
      .status(404)
      .send({ status: 404, data: [], message: "Not found" });

  return res.status(200).send({
    status: 200,
    data: product,
  });
});

router.get("/", async (req, res) => {
  const products = await firebase
    .firestore()
    .collection("products")
    .get()
    .then((res) =>
      res.docs.map((doc) => {
        const id = doc.id;

        return {
          id: id,
          ...doc.data(),
        };
      })
    );

  return res.status(200).send({
    status: 200,
    data: products,
  });
});

module.exports = router;
