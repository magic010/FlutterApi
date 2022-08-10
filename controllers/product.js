import asyncHandler from "express-async-handler";
import Product from "../models/product";

// @desc Fetch all pro ducts
// @route GET /api/products
// @access Public
export const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // res.status(401)
  // throw new Error('Product not found')
  res.json(products);
});

// @desc Fetch a product
// @route GET /api/products/:id
// @access Public
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    // res.status(404).json({ message: 'Product not found' }) not required anymore because error handler middleware was created
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Fetch all products
// @route GET /api/admin/products
// @access Private/Admin
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc Fetch all products
// @route GET /api/admin/products
// @access Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product deleted successfully" });
  } else {
    res.json({ message: "Product not found" });
  }
});

// @desc Fetch product by id
// @route GET /api/admin/products/:id
// @access Private/Admin
export const getProductByIdAdmin = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.json({ message: "Product not found" });
  }
});

// @desc Create new product
// @route POST /api/admin/products
// @access Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    images,
    brand,
    category,
    description,
    price,
    countInStock,
    thumbnail,
    isFavorite,
  } = req.body.productData;
  const product = new Product({
    user: req.user._id,
    name: name,
    images: images,
    brand: brand,
    category: category,
    description: description,
    price: price,
    countInStock: countInStock,
    thumbnail: thumbnail,
    isFavorite: isFavorite,
  });

  try {
    const createdProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product created successfully", createdProduct });
  } catch (error) {
    res.status(400).json({ message: "Product creation failed" });
  }
});

export const createMultipleProducts = asyncHandler(async (req, res) => {
  const products = req.body.products;
  const createdProducts = [];
  for (let i = 0; i < products.length; i++) {
    const {
      name,
      images,
      brand,
      category,
      description,
      price,
      countInStock,
      thumbnail,
      isFavorite,
    } = products[i];
    const product = new Product({
      user: req.user._id,
      name: name,
      images: images,
      brand: brand,
      category: category,
      description: description,
      price: price,
      countInStock: countInStock,
      thumbnail: thumbnail,
      isFavorite: isFavorite,
    });

    try {
      const createdProduct = await product.save();
      createdProducts.push(createdProduct);
    } catch (error) {
      res.status(400).json({ message: "Product creation failed" });
    }
  }
  res.json({ message: "Products created successfully", createdProducts });
});

// @desc Update product by id
// @route PUT /api/admin/products/:id
// @access Private/Admin
export const updateProductByAdmin = asyncHandler(async (req, res) => {
  const {
    name,
    images,
    brand,
    category,
    description,
    price,
    countInStock,
    thumbnail,
    isFavorite,
  } = req.body.productData;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.images = images;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;
    product.thumbnail = thumbnail;
    product.isFavorite = isFavorite;

    const updatedProduct = await product.save();
    res.json({ message: "Product updated successfully", updatedProduct });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Product.find().distinct("brand");
  res.json(brands);
});

export const getBrandsAndThumbnails = asyncHandler(async (req, res) => {
  const brands = await Product.find().distinct("brand");

  const brandsAndThumbnails = [];
  for (let i = 0; i < brands.length; i++) {
    const brand = brands[i];
    const products = await Product.find({ brand: brand });
    const thumbnail = products[0].thumbnail;
    brandsAndThumbnails.push({ brand, thumbnail });
  }
  res.json(brandsAndThumbnails);
});

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find().distinct("category");

  // key name and  value of category
  const categoriesWithKey = [];
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    categoriesWithKey.push({ key: "name", value: category });
  }
  res.json(getCategories);
});

export const checkProductIsFavorite = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json({ isFavorite: product.isFavorite });
  } else {
    res.json({ message: "Product not found" });
  }
});

export const toggleProductFavorite = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.isFavorite = !product.isFavorite;
    const updatedProduct = await product.save();
    res.json({ message: "Product updated successfully", updatedProduct });
  } else {
    res.json({ message: "Product not found" });
  }
});

export const patchAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    product.isFavorite = false;
    await product.save();
  }
  res.json({ message: "All products updated successfully" });
});
