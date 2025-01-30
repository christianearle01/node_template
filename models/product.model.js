import { format as mysqlFormat } from "mysql2";
import DatabaseModel from "./database.model.js";

class ProductModel extends DatabaseModel{
    constructor(){
        super();
    }

    fetchProductRecord = async (where_clause = "", where_values = [], fields_to_select = "*") => {
        const query = mysqlFormat(`
            SELECT ${fields_to_select} 
            FROM products
            ${where_clause ? `WHERE ${where_clause}` : ""}
        `, where_values);

        const query_result = await this.executeQuery(query);  
        
        return query_result
    } 

    insertUserCartProductsData = async (products_data) => {
        return await this.executeQuery(mysqlFormat("INSERT INTO user_cart_products SET ?", [products_data]));
    }
}

export default ProductModel;