
import orders from "../models/ordersModel.js";
import products from "../models/productModel.js";
import { ObjectId } from "mongodb";
import users from "../models/usersModel.js";

import cart from "../models/cartModel.js";
import { loginControl } from "./admin.js";


export async function createCart(req, res) {
    try {
        console.log("request body:", req.body);
        console.log("session:", req.session);



        const { product_id, quantity, user_id } = req.body;
        // const user_id = req.session.username
        console.log('product_id:', product_id);
        console.log('quantity:', quantity);
        console.log('user_id:', user_id);

        if (!user_id) {
            return res.status(400).json("error: user_id required in body")
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
        // console.log(cart_id);

        const { productId, update } = req.body;
        // console.log(req.body);

        const carts = await cart.findOne({ _id: cart_id }).populate("items.productId")
        // console.log(carts);

        if (!carts) {
            return res.json("carts not found")
        }
        const item = carts.items.filter(i => i.productId._id.toString() === productId);



        console.log(item);

        if (!item) {
            return res.json("product not in this cart")
        }

        if (update === "increment") {
            item[0].quantity += 1
        }

        else if (update === "decrement" && item[0].quantity > 1) {
            item[0].quantity -= 1

        }
        else if (update === "decrement" && item.quantity === 1) {
            carts.items.filter(element => element.productId.toString() !== productId)
        }
        else {
            res.json("not able to update")
        }

        carts.totalAmount = carts.items.reduce((sum, element) => sum + element.quantity * element.price, 0)

        await carts.save()
        await carts.populate("items.productId")
        res.json(carts)


    }

    catch (errr) {
        console.log(errr);
        res.json("something went wrong")


    }
}



// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************

export async function deleteCart(req, res) {
    try {
        const cart_id = req.params.id
        const selectedCart = await cart.findByIdAndDelete(cart_id)

        if (!selectedCart) {
            return res.json('cart not found')
        }
        if (selectedCart) {
            res.json(selectedCart)
        }
    }
    catch (err) {
        console.log(err);
        res.json("something went wrong")

    }
}
// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************

export async function CreateOrder(req, res) {
    try {
        const { user_id, orderStatus } = req.body;
       
        if (!user_id) {
            return res.json('user not found')
        }
        const cartFound = await cart.findOne({ user_id: user_id });
       

        if (cartFound.items.length === 0) {
            return res.status(404).json("cart is empty")
        }
        

        let itemsOrder = [];

        cartFound.items.forEach(item => {
            itemsOrder.push({
                product_id: item.productId,
                quantity: item.quantity,
                price: item.price,
                total_item: item.quantity * item.price

            })

        });
        console.log(itemsOrder);


        const order = await orders.create({
            user_id: user_id,
            items: itemsOrder,
            total_price: cartFound.totalAmount,
            orderStatus: orderStatus
        })

        res.status(200).json(order);

    } catch (error) {
        console.error(error);
        res.json("something went wrong")
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
    const order_Id = req.params._id;
    console.log(order_Id);
    


    const order = await orders.findOne(order_Id);
    console.log(order);
    

    if (!order) {
     
        return res.status(404).json("Order not found" );
    }

    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}

// *****************************************//////////////////////////////////////////////////////////////////////////////////*********************************************



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