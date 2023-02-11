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


/**
 * Get cart from Local storage, create ProductCart objects and display datas on cart.
 * Handle change quantity, delete event and modify the look when empty cart.
 */
let productObjList = [];
let itemsList = [];
async function CartProcess() {
  changeFormEvent();
  OrderEvent();
  itemsList = getCart();
  if (itemsList.length > 0) {
    itemsList.forEach(async (item) => {
      await getProductById(item.id)
        .then((cartItem) => {
          const _productObj = new ProductCart(
            cartItem._id,
            cartItem.name,
            cartItem.price,
            cartItem.imageUrl,
            item.color,
            item.quantity,
            cartItem.totalPrice = cartItem.price * item.quantity
          );
          return _productObj;
        })
        .then((productObj) => {
          DisplayItemInCart(productObj);
          productObjList.push(productObj);
          DisplayTotalCart();
        });
    });
  } else {
    ModifiedCart();
  }
}
  

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
  productPrice.innerHTML = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(cartItem.price);
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
  inputQuantity.addEventListener("change", (event) => updateItem(event))
  cartItemContentSettingsQuantity.appendChild(inputQuantity);
  cartItemContentSettings.appendChild(cartItemContentSettingsQuantity);

  var deleteCart = document.createElement("div");
  deleteCart.classList.add("cart__item__content__settings__delete");
  var deleteTitle = document.createElement("p");
  deleteTitle.classList.add("deleteItem");
  deleteTitle.innerHTML = "Supprimer";
  deleteTitle.addEventListener("click", (event) => deleteItemInCart(event));
  deleteCart.appendChild(deleteTitle);
  cartItemContentSettings.appendChild(deleteCart);

  cartItemContent.appendChild(cartItemContentSettings);
  article.appendChild(cartItemContent);
  document.getElementById("cart__items").appendChild(article);
}


/**
* Get total price and total quantity and display them to cart
*/
function ModifiedCart() {
  if (itemsList.length == 0) {
      document.getElementById("cartTitle").innerHTML = "<p>Votre panier est vide</p>";
      let element = document.getElementsByClassName("cart__price");
      if (element.length > 0) {
          element[0].remove();
      }
  } 
}


/**
 * Get total price, total quantity and display them to cart
 */ 
function DisplayTotalCart() {
  let cartQuantity = 0;
  let cartPrice = 0;
  for (product of productObjList) {
    cartQuantity += product.quantity;
    cartPrice += product.totalPrice;
  }
  if (cartQuantity && cartPrice != null){
  document.getElementById("totalQuantity").innerHTML = cartQuantity,
  document.getElementById("totalPrice").innerHTML = cartPrice;
}
}

/**
* Get "article" HTML tag from input, if item is find in itemList,
* update values in itemList and productObjList
* @param {Event} event 
*/
function updateItem(event) {
  let product = event.target.closest("article");
  let itemCart = itemsList.find(item => item.id === product.dataset.id && item.color === product.dataset.color)
  let itemObj = productObjList.find(item => item.id === product.dataset.id && item.color === product.dataset.color)
  if (Number(event.target.value) < 0) {
    deleteItemInCart(event)
  }
  if (itemCart && itemObj) {
      const value = Number(event.target.value)
      itemCart.quantity = value;
      itemObj.quantity = value;
      itemObj.totalPrice = itemObj.price * value;
      writeCart(itemsList);
      DisplayTotalCart();
  }
}


/**
* Get Item color and id, find and delete Item in itemsList, and productsObjList
* push the list updated to localstorage, remove item from DOM, display new totals 
* or display empty cart if no items in cart left.
* @param {click} event 
*/
function deleteItemInCart(event) {
  let itemToDelete = event.target.closest("article");
  const index = itemsList.findIndex(item => item.id === itemToDelete.dataset.id && item.color === itemToDelete.dataset.color);
  const indexObj = productObjList.findIndex(item => item.id === itemToDelete.dataset.id && item.color === itemToDelete.dataset.color);
  if (index > -1) {
      itemsList.splice(index, 1);
  }
  if (indexObj > -1) {
      productObjList.splice(indexObj, 1);
  }
  writeCart(itemsList);
  itemToDelete.remove();
  ModifiedCart();

  if(itemsList.length != 0) {
    DisplayTotalCart();
  }
}


/**
* Get elements coressponding to cart__order__form__question class in DOM, get
* input value and attribut ID of the targeted element on change
*/
function changeFormEvent() {
  let formElements = document.getElementsByClassName("cart__order__form__question");
  let changeEvent = (event) => {
      getData(event)
  }
  Array.from(formElements).forEach((elem) => {
      elem.addEventListener('change', changeEvent)
  });
}


/**
* Get input value and attribut ID of form element targeted and check conformity of the input form
* @param {change} event 
*/
function getData(event) {
  let _inputValue = event.target.value;
  let _attributeId = event.target.id;
  checkConformity(_inputValue, _attributeId)
}


/**
* Test input value with the right regular expression to check the conformity 
* @param {String} inputValue 
* @param {String} attributeId 
* @returns {Boolean} Boolean
*/
function checkConformity(inputValue, attributeId) {
  if (inputValue != "") {
      if (attributeId == "email") {
          const emailRegexp = new RegExp("^[a-zA-Z0-9.]+[@][a-z]+[.][[a-z]{2,10}$");
          return inputTest(emailRegexp, inputValue, attributeId);
      } else if (attributeId == "firstName") {
          const firstNameRegexp = new RegExp("^[a-zéèçàA-Z-' ]{2,20}$");
          return inputTest(firstNameRegexp, inputValue, attributeId);
      } else {
          const textRegexp = new RegExp("^[a-z-éèçàA-Z0-9.-_' ]{2,50}$");
          return inputTest(textRegexp, inputValue, attributeId);
      }
  }
}


/**
* Test input value with the regular expression and create an error message in DOM element if
* the input value doesn't
* @param {String} regexp 
* @param {String} _inputValue 
* @param {String} __attributeId 
* @returns {Boolean} Boolean
*/
function inputTest(regexp, _inputValue, __attributeId) {
  if (regexp.test(_inputValue)) {
      document.getElementById(__attributeId + "ErrorMsg").innerHTML = "<span></span>";
      return true;
  } else {
      document.getElementById(__attributeId + "ErrorMsg").innerHTML = "<span>Veuillez entrer un texte valide</span>";
      return false;
  }
}


/**
* On click on submit element, lock it and verify the Cart conformity
*/
function OrderEvent() {
  let submitElement = document.getElementById("order");
  submitElement.addEventListener("click", (event) => {
      event.preventDefault();
      order();
  });
}


/**
* Check if empty cart and return an alert if he is.
* Check the conformity of inputs in form. If they are all validated, get datas to post,
* else return an alert 
* @returns alert
*/
function order() {
  let formElements = document.getElementsByClassName(
      "cart__order__form__question"
  );
  if (itemsList.length == 0) {
      return alert("Votre panier est vide");
  } else {
      for (let index = 0; index < formElements.length; index++) {
          inputValue = formElements[index].querySelector("input").value;
          attributeId = formElements[index]
              .querySelector("input")
              .getAttribute("id");
          if (checkConformity(inputValue, attributeId)) {
              continue;
          } else {
              return alert("Veuillez vérifier le formulaire");
          }
      }
  }
  getDataToPost();
}


/**
* Get item list, add ids of products ordered in a list and construct the order form to POST
*/
function getDataToPost() {
  let orderIdList = [];
  for (let index = 0; index < itemsList.length; index++) {
      orderIdList.push(itemsList[index].id);
  }
  let orderForm = {
      contact: {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
      },
      products: orderIdList,
  };
  orderInformation = JSON.stringify(orderForm);
  postOrder(orderInformation);
}


/**
* Execute POST request, if succesfull status, construct url and go to confirmation page, 
* else it gives an alert
* @param {{}} orderInformation 
*/
function postOrder(orderInformation) {
  fetch("http://localhost:3000/api/products/order/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: orderInformation,
  })
      .then((response) => {
          if (response.status == 201) {
              return response.json();
          } else {
              alert("La validation a échoué. Veuillez réessayer");
              console.error("Echec de la requête POST, status : " + response.status);
          }
      })
      .then((data) => {
          window.location.href = "./confirmation.html?id=" + data.orderId;
      });

}


CartProcess();