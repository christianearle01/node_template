import { format as mysqlFormat } from "mysql2";
import DatabaseModel from "./database.model.js";

class UserCartProductModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchUserCartProductRecord = async (where_clause = "", where_values = [], fields_to_select = "*") => {
        const query = mysqlFormat(
            `SELECT ${fields_to_select} FROM user_cart_products
            ${where_clause ? `WHERE ${where_clause}` : ""}
            `, where_values
        );
        const query_result = await this.executeQuery(query);

        return query_result;
    }

    fetchProductsInCart = async (user_id) => {
        const query = mysqlFormat(`
            SELECT products.id, products.name, products.description, products.price, user_cart_products.quantity
            FROM products
            JOIN user_cart_products
            ON products.id = user_cart_products.product_id
            WHERE user_cart_products.user_id = ?
        `, [user_id]);
        const query_result = await this.executeQuery(query);

        return query_result;
    }

    insertUserCartProductsData = async (products_data) => {
        const query = mysqlFormat("INSERT INTO user_cart_products SET ?", [products_data]);
        const query_result = await this.executeQuery(query);

        return query_result;
    }
    
    updateUserCartProductsData = async (user_cart_id, products_data) => {
        const query = mysqlFormat("UPDATE user_cart_products SET ? WHERE id = ?", [products_data, user_cart_id]);
        const query_result = await this.executeQuery(query);

        return query_result;
    }
    
    deleteUserCartProductsData = async (user_cart_id) => {
        const query = mysqlFormat("DELETE FROM user_cart_products WHERE id = ?", [user_cart_id]);
        const query_result = await this.executeQuery(query);

        return query_result;
    }
    
    clearUserCartProducts = async (user_id) => {
        const query = mysqlFormat("DELETE FROM user_cart_products WHERE user_id = ?", [user_id]);
        const query_result = await this.executeQuery(query);

        return query_result;
    }
}

export default UserCartProductModel;