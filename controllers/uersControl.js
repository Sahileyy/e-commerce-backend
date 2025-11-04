
import orders from "../models/ordersModel.js";
import products from "../models/productModel.js";
import { ObjectId } from "mongodb";
import users from "../models/usersModel.js";

import cart from "../models/cartModel.js";
import { loginControl } from "./admin.js";




export async function getSingleProduct(req, res) {
  try {
    const id = req.params.id;
    console.log(id);
    
    const selectedProduct = await products.findOne({_id:id});
    if (!selectedProduct) {
      return res.status(404).json("Product not found");
    }
    res.status(200).json(selectedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json("Error fetching product");
  }
}


export async function viewCart(req, res) {
  try {
    const userCart = await cart
      .findOne({ user_id: req.session.user_id })
      .populate("items.productId");

    if (!userCart) {
      return res.status(200).json({ items: [], totalAmount: 0 });
    }

    // console.log(userCart);
    res.status(200).json(userCart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart" });
  }
}

export async function getCartCount(req, res) {
  try {
    const user_id = req.session.user_id;
    if (!user_id) return res.status(401).json({ count: 0 });

    const userCart = await cart.findOne({ user_id });
    const count = userCart
      ? userCart.items.reduce((sum, i) => sum + i.quantity, 0)
      : 0;

    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ count: 0 });
  }
}






export async function createCart(req, res) {
    try {
        console.log("request body:", req.body);
        console.log("session:", req.session);


          const user_id = req.session.user_id;
        const { product_id, quantity} = req.body;
        // const user_id = req.session.username
        console.log('product_id:', product_id);
        console.log('quantity:', quantity);
        console.log('user_id:', user_id);

        if (!user_id) {
            return res.status(401).json("error: user_id required in body")
        }

        if (!product_id) {
            return res.status(400).json('error: product_id is required');
        }

        if (!quantity) {
            return res.status(400).json('error: quantity is required');
        }
        const product = await products.findById(product_id);
        if (!product) {
            return res.json('invalid product')
        }

        let carts = await cart.findOne({ user_id })
        if (!carts) {
            carts = await cart.create({
                user_id,
                items: [],
                totalAmount: 0

            })

        }
        const qty = Number(quantity);
        const itemExist = carts.items.find(element => element.productId.toString() === product_id);


        // console.log(itemExist);

        if (itemExist) {
            itemExist.quantity += qty;
        }
        else {
            carts.items.push({ productId: product_id, quantity: qty, price: product.price })

        }
        carts.totalAmount = await carts.items.reduce((sum, element) => sum + (element.quantity * element.price), 0)
        await carts.save();
        await carts.populate("items.productId");
        res.json("cart created succefully");



    }
    catch (err) {
        console.log(err);
        res.status(404).json('its an errrrorr')

    }
}

// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************

export async function updateCart(req, res) {
  try {
    const cart_id = req.params.id;
    const { productId, update } = req.body;

    const carts = await cart.findOne({ _id: cart_id }).populate("items.productId");
    if (!carts) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // find the item in the cart
    const item = carts.items.find(i => i.productId._id.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not in this cart" });
    }

    // update logic
    if (update === "increment") {
      item.quantity += 1;
    } else if (update === "decrement" && item.quantity > 1) {
      item.quantity -= 1;
    } else if (update === "decrement" && item.quantity === 1) {
      carts.items = carts.items.filter(
        element => element.productId._id.toString() !== productId
      );
    } else {
      return res.status(400).json({ message: "Invalid update action" });
    }

    // recalculate total
    carts.totalAmount = carts.items.reduce(
      (sum, element) => sum + element.quantity * element.productId.price,
      0
    );

    await carts.save();
    await carts.populate("items.productId");

    res.status(200).json({
      message: "Cart updated successfully",
      cart: carts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
}



// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************

export async function deleteCart(req, res) {
    try {
        const cart_id = req.params.id;
        const { product_id } = req.body;
        
        const mycart = await cart.findById(cart_id);
        
        if (!mycart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        
        // Filter out the item - convert ObjectId to string for comparison
        const newItems = mycart.items.filter(
            (item) => item.productId.toString() !== product_id
        );
        
        // Calculate new total
        const newTotal = newItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );
        
        // Update the cart
        mycart.items = newItems;
        mycart.totalAmount = newTotal;
        
        // Save to database
        await mycart.save();
        
        res.json({ 
            message: "Item removed successfully", 
            cart: mycart 
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}
// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************
export async function CreateOrder(req, res) {
  try {
    const user_id = req.session.user_id; 
    const { orderStatus } = req.body;

    if (!user_id) {
      return res.status(401).json("User not logged in");
    }

    const cartFound = await cart.findOne({ user_id }).populate("items.productId");

    if (!cartFound || cartFound.items.length === 0) {
      return res.status(404).json("Cart is empty");
    }

    const itemsOrder = cartFound.items.map((item) => ({
      product_id: item.productId._id,
      quantity: item.quantity,
      price: item.price,
      total_item: item.quantity * item.price,
    }));

    const order = await orders.create({
      user_id,
      items: itemsOrder,
      total_price: cartFound.totalAmount,
      status: orderStatus || "pending",
    });
      return res.status(200).json({
      message: "Order placed successfully",
      order,});

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json("Something went wrong");
  }
}

// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************
export async function updateOrder(req, res) {
  try {
    const orderId = req.params.id;
    const { orderStatus, items, user_id } = req.body;

   
    const existingOrder = await orders.findById(orderId);

    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

 
    if (orderStatus) {
      existingOrder.orderStatus = orderStatus;
    }

    if (user_id) {
      existingOrder.user_id = user_id;
    }

    if (items && Array.isArray(items)) {
      existingOrder.items = items;

     }

 
    await existingOrder.save();

    res.status(200).json(existingOrder);
  } catch (error) {
    console.error(error);
    res.status(404).json( "Something went wrong" );
  }
}

// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************


export async function getOrderById(req, res) {
  try {
    const orderId = req.params.id;
    console.log("Order ID:", orderId);

    const order = await orders.findById(orderId).populate("items.product_id"); 

    if (!order) {
      return res.status(404).json("Order not found");
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************

export async function getUserOrders(req, res) {
  try {
    const user_id = req.session.user_id; 
    if (!user_id) {
      return res.status(401).json("User not logged in");
    }

    const userOrders = await orders
      .find({ user_id })
      .populate({path:"items.product_id",model:"products"}) 
      .sort({ createdAt: -1 });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json("No orders found for this user");
    }

    res.status(200).json(userOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Something went wrong while fetching orders" });
  }
}


export async function deleteOrderById(req, res) {
  try {
    const orderId = req.params.id;
    console.log(orderId)

    const deletedOrder = await orders.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
      deletedOrder: deletedOrder
    });
  } catch (error) {
    console.error( error);
    res.status(500).json( "Something went wrong" );
  }
}