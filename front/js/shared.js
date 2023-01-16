class CartItem {
  constructor(id, color, quantity) {
    this.id = id;
    this.color = color;
    this.quantity = quantity;
  }
}

function getIdFromUrl() {
  return new URL(location).searchParams.get("_id");
}

function getProductById(id) {
  if (id) {
    return fetch("http://localhost:3000/api/products/" + id);
  } else {
    return null;
  }
}

function getCart() {
  let arrayString = localStorage.getItem("CartItems");
  if (arrayString != null) {
    return JSON.parse(arrayString);
  } else {
    return [];
  }
}

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
  localStorage.setItem("CartItems", JSON.stringify(cart));
}
