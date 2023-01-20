class ProductCart {
  constructor(_id, _name, _price, _image, _color, _quantity, _totalPrice) {
    this.id = _id;
    this.name = _name;
    this.price = _price;
    this.image = _image;
    this.color = _color;
    this.quantity = _quantity;
    this.totalPrice = _totalPrice;
  }
}

// Get cart from Local storage, create ProductCart objects and display datas on cart. 
// Handle change quantity, delete event and modify the look when empty cart.
let productObjList = [];
let itemsList = [];
async function GetObjectsFromLocalStorage() {
  itemsList = getCart();
  if (itemsList.length > 0) {
    for (item of itemsList) {
      const productObj = await getProductById(item.id)
        .then((res) => res.json())
        .then((cartItem) => {
          const _productObj = new ProductCart(
            cartItem._id,
            cartItem.name,
            cartItem.price,
            cartItem.imageUrl,
            item.color,
            item.quantity,
            (cartItem.totalPrice = cartItem.price * item.quantity)
          );
          return _productObj;
        });

      DisplayItemInCart(productObj);
      productObjList.push(productObj);
      DisplayTotalCart();
    }
    changeQuantityEvent();
    deleteItemEvent();
  } else {
    modifyEmptyCart()
  }
}


//  
/**
 * Create HTML of each item in cart and add it to the DOM
 * @param {ProductCart} cartItem Item to be added to the DOM
 */
function DisplayItemInCart(cartItem) {
  var article = document.createElement("article");
  article.classList.add("cart__item");
  article.setAttribute("data-id", cartItem.id);
  article.setAttribute("data-color", cartItem.color);

  var cartItemImg = document.createElement("div");
  cartItemImg.classList.add("cart__item__img");

  var image = document.createElement("img");
  image.setAttribute("src", cartItem.image);
  image.setAttribute("alt", cartItem.altTxt);

  cartItemImg.appendChild(image);
  article.appendChild(cartItemImg);

  var cartItemContent = document.createElement("div");
  cartItemContent.classList.add("cart__item__content");

  var cartItemContentDescription = document.createElement("div");
  cartItemContentDescription.classList.add("cart__item__content__description");

  var paroductName = document.createElement("h2");
  paroductName.innerHTML = cartItem.name;
  cartItemContentDescription.appendChild(paroductName);
  var productColor = document.createElement("p");
  productColor.innerHTML = cartItem.color;
  cartItemContentDescription.appendChild(productColor);
  var productPrice = document.createElement("p");
  productPrice.innerHTML = cartItem.price + " €";
  cartItemContentDescription.appendChild(productPrice);

  cartItemContent.appendChild(cartItemContentDescription);

  var cartItemContentSettings = document.createElement("div");
  cartItemContentSettings.classList.add("cart__item__content__settings");
  var cartItemContentSettingsQuantity = document.createElement("div");
  cartItemContentSettingsQuantity.classList.add(
    "cart__item__content__settings__quantity"
  );
  var quantityTitle = document.createElement("p");
  quantityTitle.innerHTML = "Qté: ";
  cartItemContentSettingsQuantity.appendChild(quantityTitle);

  var inputQuantity = document.createElement("input");
  inputQuantity.setAttribute("type", "number");
  inputQuantity.classList.add("itemQuantity");
  inputQuantity.setAttribute("name", "itemQuantity");
  inputQuantity.setAttribute("min", 1);
  inputQuantity.setAttribute("max", 100);
  inputQuantity.value = cartItem.quantity;
  cartItemContentSettingsQuantity.appendChild(inputQuantity);
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  var deleteCart = document.createElement("div");
  deleteCart.classList.add("cart__item__content__settings__delete");
  var deleteTitle = document.createElement("p");
  deleteTitle.classList.add("deleteItem");
  deleteTitle.innerHTML = "Supprimer";
  deleteCart.appendChild(deleteTitle);
  cartItemContentSettings.appendChild(deleteCart);

  cartItemContent.appendChild(cartItemContentSettings);
  article.appendChild(cartItemContent);
  document.getElementById("cart__items").appendChild(article);
}



// Get total quantity and return it
function getTotalQuantity() {
  let inputsQuantity = document.getElementsByClassName("itemQuantity");
  let totalQuantity = 0;
  for (let i = 0; i < inputsQuantity.length; i++) {
    totalQuantity += Number(inputsQuantity[i].value);
  }
  return totalQuantity;
}


// Get total price and return it
function getTotalPrice() {
  cartPrice = 0;
  for (product of productObjList) {
    cartPrice += product.totalPrice;
  }
  return cartPrice;
}


/** 
 * Get inputs list from HTML class, update item when one of the inputs has been changed.
 * Then display total quantity of items and total price in cart.
*/
function changeQuantityEvent() {
  const inputsQuantity = document.getElementsByClassName("itemQuantity");
  for (let index = 0; index < inputsQuantity.length; index++) {
    inputsQuantity[index].addEventListener("change", (event) => {
      updateItem(inputsQuantity[index], event),
      DisplayTotalCart(event);
    });
  }
}

// Get total price and total quantity and display them to cart
function DisplayTotalCart() {
  document.getElementById("totalQuantity").innerHTML = getTotalQuantity(),
  document.getElementById("totalPrice").innerHTML = getTotalPrice();
}


// Get "article" HTML tag from input, if item is find in itemList, 
// update values in itemList and productObjList
function updateItem(_input) {
  let product = _input.closest("article");
  for (let index = 0; index < itemsList.length; index++) {
    if (
      product.dataset.id === itemsList[index].id &&
      product.dataset.color === itemsList[index].color
    ) {
      itemsList[index].quantity = _input.value;
      productObjList[index].quantity = _input.value;
      productObjList[index].totalPrice = productObjList[index].price * _input.value;
    }
  }
  localStorage.setItem("CartItems", JSON.stringify(itemsList));
}

// Get elements coressponding to deletItem class in DOM and call the 
// delete function with the right element on click
function deleteItemEvent() {
  const elements = document.getElementsByClassName("deleteItem");
  for (let index = 0; index < elements.length; index++) {
    elements[index].addEventListener("click", (event) =>
      deleteItemInCart(elements[index], event)
    );
  }
}

// Change the look of the cart when empty. "Votre panier est vide" is showed instead of "votre panier"
// and the total quantity and total price is removed
function modifyEmptyCart() {
  document.getElementById("cartTitle").innerHTML = "Votre panier est vide";
  let element = document.getElementsByClassName("cart__price");
  if (element.length > 0) {
    element[0].remove();
  }
}

// Get Item color and id, find and delete Item in itemsList, 
// push the list updated to localstorage and reload page
function deleteItemInCart(_element) {
  console.log(_element);
  let elementId = _element.closest("article").getAttribute("data-id");
  let elementColor = _element.closest("article").getAttribute("data-color");
  console.log(elementId, elementColor);
  for (let index = 0; index < itemsList.length; index++) {
    if (
      itemsList[index].id === elementId &&
      itemsList[index].color === elementColor
    ) {
      itemsList.splice(index, 1);
    }
  }
  localStorage.setItem("CartItems", JSON.stringify(itemsList));
  location.reload();
}




GetObjectsFromLocalStorage();