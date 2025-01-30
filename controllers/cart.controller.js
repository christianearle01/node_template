import UserCartProductModel from "../models/user_cart_product.model.js";

class CartController {
    user_id = 1;

    index = async (req, res) => {
        let products_on_cart = [];

        try{
            const userCartProductModel = new UserCartProductModel();
            products_on_cart = await userCartProductModel.fetchProductsInCart(this.user_id);    
        }
        catch(error){
            console.log(error);
        }

        res.render("cart", { user: this.user_id, products_on_cart, page: "cart" });
    }

    updateCartData = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const { product_id, quantity = 1 } = req.body;
            const userCartProductModel = new UserCartProductModel();
    
            const [ cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                "user_id = ? AND product_id = ?",
                [this.user_id, product_id],
                "id"
            );

            if(cart_product?.id){
                const { affectedRows } = await userCartProductModel.updateUserCartProductsData(cart_product.id, { quantity });
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Product not found in the cart.";
            }
        }
        catch(error){
            console.log(error);
            response_data.error = error;
        }

        res.json(response_data);
    }

    removeProductToCart = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const { product_id } = req.body;
            const userCartProductModel = new UserCartProductModel();

            const [ cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                "user_id = ? AND product_id = ?",
                [this.user_id, product_id],
                "id"
            );

            if(cart_product?.id){
                const { affectedRows } = await userCartProductModel.deleteUserCartProductsData(cart_product.id);
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Product not found in the cart.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }

    checkout = async (req, res) => {
        const response_data = { status: false, message: "" };

        try{
            const userCartProductModel = new UserCartProductModel();
            const { affectedRows } = await userCartProductModel.clearUserCartProducts(this.user_id);
            
            if(affectedRows){
                response_data.status = !!affectedRows;
            }
            else{
                response_data.message = "Failed to checkout products on cart.";
            }
        }
        catch(error){
            console.log(error);
        }

        res.json(response_data);
    }
}

export default new CartController;