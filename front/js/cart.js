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


function getTotalQuantity() {
  let inputsQuantity = document.getElementsByClassName("itemQuantity");
  let totalQuantity = 0;
  for (let i = 0; i < inputsQuantity.length; i++) {
    totalQuantity += Number(inputsQuantity[i].value);
  }
  return totalQuantity;
}


function getTotalPrice() {
  cartPrice = 0;
  for (product of productObjList) {
    cartPrice += product.totalPrice;
  }
  return cartPrice;
}


function DisplayTotalCart() {
  document.getElementById("totalQuantity").innerHTML = getTotalQuantity(),
  document.getElementById("totalPrice").innerHTML = getTotalPrice();
}


function changeQuantityEvent() {
  const inputsQuantity = document.getElementsByClassName("itemQuantity");
  for (let index = 0; index < inputsQuantity.length; index++) {
    inputsQuantity[index].addEventListener("change", (event) => {
      updateItem(inputsQuantity[index], event),
      DisplayTotalCart(event);
    });
  }
}


function updateItem(_input) {
  let product = _input.closest("article");
  for (let index = 0; index < itemsList.length; index++) {
    if (
      product.dataset.id === itemsList[index].id &&
      product.dataset.color === itemsList[index].color
    ) {
      itemsList[index].quantity = _input.value;
      productObjList[index].quantity = _input.value;
      productObjList[index].totalPrice =
        productObjList[index].price * _input.value;
    }
  }
  localStorage.setItem("CartItems", JSON.stringify(itemsList));
}


function deleteItemEvent() {
  const element = document.getElementsByClassName("deleteItem");
  console.log(element);
  for (let index = 0; index < element.length; index++) {
    element[index].addEventListener("click", (event) =>
      deleteItemInCart(element[index], event)
    );
  }
}


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


function modifyEmptyCart() {
  document.getElementById("cartTitle").innerHTML = "Votre panier est vide";
  let element = document.getElementsByClassName("cart__price");
  if (element.length > 0) {
    element[0].remove();
  }
}

GetObjectsFromLocalStorage();