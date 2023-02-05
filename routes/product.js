const router = require("express").Router();
const Product = require("../model/Product");
const { verifyAndAdmin } = require("./verifyToken");

router.post("/", verifyAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", verifyAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", verifyAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(201).json("Product Deleted!");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/find/:id", verifyAndAdmin, async (req, res) => {
  try {
    const users = await Product.findById(req.params.id);
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", verifyAndAdmin,  async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        category: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(201).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
