$(document).ready(function() {
     $('#cart-container')
        .on("click", ".decrease-qty-btn, .increase-qty-btn", handleChangeQuantity)
});

/* Handles the click event on quantity change buttons. */
function handleChangeQuantity(){
    const form = $(this).parent().parent();
    const change_qty_btn = $(this);    
    const qty_input = change_qty_btn.siblings("input[name='quantity']");
    const is_increase = change_qty_btn.hasClass("increase-qty-btn");
    const this_quantity = parseInt(qty_input.val());
    const price_element = change_qty_btn.parent().parent().parent().siblings("td").children(".price");
    const price = parseFloat(price_element.text().replace('₱', ''));
    const sub_total = price_element.parent().siblings("td").children(".subtotal");

    let this_updated_value = this_quantity;
    if(is_increase){
        this_updated_value += 1;
        qty_input.val(this_updated_value);
        sub_total.text((this_updated_value) * price);
        handleUpdateProductQuantity(form)
    }
    /* If minus, add checking to avoid 0 or negative quantity. */
    else if(!is_increase && this_quantity){
        this_updated_value -= 1;
        qty_input.val(this_updated_value);
        sub_total.text((this_updated_value) * price);
        handleUpdateProductQuantity(form)
    }

    return false;
}

/* Handle the updating of the product added to shopping cart */
function handleUpdateProductQuantity(form){
    $.post(form.attr("action"), form.serialize(), (result) => {
        !result.status && console.log(result.message || result.error);
    });
}