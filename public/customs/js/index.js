$(document).ready(function() {
     $('#products-container')
        .on('click', '.product-image', handleProductInfoModal)
        .on("click", ".decrease-qty-btn, .increase-qty-btn", handleChangeQuantity)
        .on("submit", ".add-to-cart-form", handleAddToCart)
});

/* Put the clicked image in the modal-image */
function handleProductInfoModal(){
    let image = $(this).attr('src');
    $('#modal-image').attr('src', image);
    $('#modal-title').text($(this).siblings('div').children('h6').text());
}

/* Handles the submission of the add-to-cart form. */
function handleAddToCart(){
    const form = $(this);
    const quantity_input_field = form.find("input[name='quantity']");
    const quantity = parseInt(quantity_input_field.val());

    quantity_input_field.val((quantity > 0) ? quantity : 1);

    $.post(form.attr("action"), form.serialize(), (result) => {
        alert(result.message);
        result.status && form.find("input[name='quantity']").val(1);
    });

    return false;
}

/* Handles the click event on quantity change buttons. */
function handleChangeQuantity(){
    const change_qty_btn = $(this);    
    const qty_input = change_qty_btn.siblings("input[name='quantity']");
    const is_increase = change_qty_btn.hasClass("increase-qty-btn");
    const this_quantity = parseInt(qty_input.val());
    
    if(is_increase){
        qty_input.val(this_quantity + 1);
    }
    /* If minus, add checking to avoid 0 or negative quantity. */
    else if(!is_increase && this_quantity){
        qty_input.val(this_quantity - 1);
    }
}