class CartItem {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

const cartKey = "CartItems";

/**
 * Get ID product from URL
 * @param {String} param 
 * @returns String
 */
function getIdFromUrl(param) {
    return new URL(location).searchParams.get(param);
}


/**
 * Get product object by ID
 * @param {String} id 
 * @returns Promise | null
 */
function getProductById(id) {
    if (id) {
        return fetch("http://localhost:3000/api/products/" + id);
    } else {
        return null;
    }
}


/**
 * Get cart from localstorage and create it if doesn't exist
 * @returns {CartItem[]} List of item
 */
function getCart() {
    let arrayString = localStorage.getItem(cartKey);
    if (arrayString != null) {
        return JSON.parse(arrayString);
    } else {

        return [];
    }
}

/**
 * Write cart to localStorage
 * @param {[*]} cart 
 */
function writeCart(cart) {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}


/**
 * Get item list in localStorage, find item in list and add quantity selected if 
 * item is already in list. Else add item to list and push to localstorage in string format.
 * @param {CartItem} addedItem 
 */
function addItemToCart(addedItem) {
    let cart = getCart();
    let oldItem = cart.find(
        (item) => item.id === addedItem.id && item.color === addedItem.color
    );
    if (oldItem) {
        oldItem.quantity += addedItem.quantity;
    } else {
        cart.push(addedItem);
    }
    writeCart(cart);
}



