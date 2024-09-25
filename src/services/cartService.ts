import { cartModel } from "../models/cartModel";
import { productModel } from "../models/productModel";

interface CreateCartForUser {
  userId: string;
}

const createCartForUser = async ({ userId }: CreateCartForUser) => {
  const cart = await cartModel.create({
    userId,
    totalAmount: 0,
    status: "active",
  });
  await cart.save();
  console.log("cart from createCartForUser : ", cart);
  return cart;
};

interface GetActiveCartForUser {
  userId: string;
}
export const getActiveCartForUser = async ({
  userId,
}: GetActiveCartForUser) => {
  let cart = await cartModel.findOne({ userId, status: "active" });
  if (!cart) {
    cart = await createCartForUser({ userId });
  }
  return cart;
};

interface ClearCart {
  userId: string;
}
export const clearCart = async ({ userId }: ClearCart) => {
  const cart = await getActiveCartForUser({ userId });
  if (!cart) {
    return { data: "Cart not found!", statusCode: 400 };
  }
  cart.items = [];
  cart.totalAmount = 0;
  await cart.save();
  return { data: cart, statusCode: 200 };
};

interface AddItemToCart {
  userId: string;
  quantity: number;
  productId: any;
}

export const addItemToCart = async ({
  userId,
  quantity,
  productId,
}: AddItemToCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existCart = cart.items.find((item) => item.product == productId);

  if (existCart) {
    return { data: "Item already exists in cart !", statusCode: 400 };
  }

  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found ! ", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low stock for item", statusCode: 400 };
  }

  cart.items.push({ product: productId, unitPrice: product.price, quantity });

  //update total amount for the cart
  cart.totalAmount += product.price * quantity;

  const updatedCart = await cart.save();
  return { data: updatedCart, statusCode: 200 };
};

interface UpdateCartInCart {
  userId: string;
  quantity: number;
  productId: any;
}
export const updateItemInCart = async ({
  userId,
  quantity,
  productId,
}: UpdateCartInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existCart = cart.items.find((item) => item.product == productId);

  if (!existCart) {
    return { data: "Item does not exist in cart !", statusCode: 400 };
  }
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found ! ", statusCode: 400 };
  }

  if (product.stock < quantity) {
    return { data: "Low stock for item", statusCode: 400 };
  }

  existCart.quantity = quantity;

  const otherCartItems = cart.items.filter((p) => p.product != productId);
  let total = otherCartItems.reduce((previous, current) => {
    previous += current.quantity * current.unitPrice;
    return previous;
  }, 0);
  total += existCart.quantity * existCart.unitPrice;
  cart.totalAmount = total;
  await cart.save();
  return { data: cart, statusCode: 200 };
};

interface DeleteItemInCart {
  userId: string;
  productId: any;
}

export const deleteItemInCart = async ({
  productId,
  userId,
}: DeleteItemInCart) => {
  const cart = await getActiveCartForUser({ userId });

  const existCart = cart.items.find((item) => item.product == productId);

  if (!existCart) {
    return { data: "Item does not exist in cart !", statusCode: 400 };
  }
  const product = await productModel.findById(productId);

  if (!product) {
    return { data: "Product not found ! ", statusCode: 400 };
  }

  const otherCartItems = cart.items.filter((p) => p.product != productId);

  const total = otherCartItems.reduce((previous, current) => {
    previous += current.quantity * current.unitPrice;
    return previous;
  }, 0);

  cart.totalAmount = total;
  cart.items = otherCartItems;
  await cart.save();
  return { data: cart, statusCode: 200 };
};
