class ProductCart {
  constructor(_id, _name, _price, _image, _color, _quantity) {
    this.id = _id;
    this.name = _name;
    this.price = _price;
    this.image = _image;
    this.color = _color;
    this.quantity = _quantity;
  }
}

async function GetObjectsFromLocalStorage() {
  items = getCart();

  if (items.length > 0) {
    for (item of items) {
      const productObj = await getProductById(item.id)
        .then((res) => res.json())
        .then((cartItem) => {
          const _productObj = new ProductCart(
            cartItem._id,
            cartItem.name,
            cartItem.price * item.quantity,
            cartItem.imageUrl,
            item.color,
            item.quantity
          );
          return _productObj;
        });
      DisplayItemInCart(productObj);
    }
  }
}
GetObjectsFromLocalStorage();

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
  productPrice.innerHTML = cartItem.price;
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
  inputQuantity.setAttribute("min", 0);
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
