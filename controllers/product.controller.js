import ProductModel from "../models/product.model.js";
import UserCartProductModel from "../models/user_cart_product.model.js";

class ProductController {
    user_id = 1;

    index = async (req, res) => {
        let products = [];

        try{
            const productModel = new ProductModel();
            products = await productModel.fetchProductRecord();
        }
        catch(error){
            console.log(error);
        }
       

        res.render("index", { products, page: "home" });
    }

    addProductToCart = async (req, res) => {
        const response_data = { status: false, message: "" }

        try{
            const productModel = new ProductModel();
            const { product_id, quantity: item_quantity } = req.body;
            const [ fetch_product ] = await productModel.fetchProductRecord("id = ?", [product_id], "id, name");;

            if(fetch_product?.id){
                /* Check if the product to be added is already in the cart. */
                const userCartProductModel = new UserCartProductModel();
                const [ fetch_cart_product ] = await userCartProductModel.fetchUserCartProductRecord(
                    "user_id = ? AND product_id = ?", 
                    [this.user_id, product_id]
                );

                /* If the product already exist on user's cart, increase the quantity. */
                if(fetch_cart_product?.id){
                    const { affectedRows } = await userCartProductModel.updateUserCartProductsData(
                        fetch_cart_product.id, 
                        { quantity: fetch_cart_product.quantity + parseInt(item_quantity) }
                    );

                    if(!affectedRows){
                        throw new Error("Failed to update cart product quantity.");
                    }
                }
                /* If the product is not yet on the user's cart, create new cart product record. */
                else{
                    const { insertId } = await userCartProductModel.insertUserCartProductsData({ product_id, quantity: item_quantity, user_id: this.user_id });

                    if(!insertId){
                        throw new Error("Failed to add product to cart.");
                    }
                }

                response_data.status = true;
                response_data.message = `${item_quantity} ${fetch_product.name} item added to cart.`;
            }
            else{
                response_data.message = "Product does not exist.";
            }
        }
        catch(error){
            console.log(error);
            response_data.message = "Error encountered in adding a product to cart.";
        }

        res.json(response_data);
    }
}

export default new ProductController;