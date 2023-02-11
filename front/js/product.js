/**
 * Get ID from URL, then get the product object on JSON format and display datas needed
 * to product page. handle adding item to cart on click event
 */
function ProductProcess() {
  id = getIdFromUrl("_id");
  getProductById(id).then((item) => {
    if (item._id == id) {
      displayKanapDetails(item);
      addClickEvent(item);
    } else {
      window.location.href = "./index.html";
    }
  });
} 


/**
* Display product details in DOM
* @param {{}} itemDetails 
*/
function displayKanapDetails(itemDetails) {
  let imageUrl = document.querySelector(".item__img");
  imageUrl.innerHTML = `<img src="${itemDetails.imageUrl}" alt="${itemDetails.altTxt}">`;
  let name = document.getElementById("title");
  name.innerHTML = itemDetails.name;
  let price = document.getElementById("price");
  price.innerHTML = itemDetails.price;
  let description = document.getElementById("description");
  description.innerHTML = itemDetails.description;
  let color = document.getElementById("colors");
  for (index = 0; index < itemDetails.colors.length; index++) {
      color.innerHTML += `<option value="${itemDetails.colors[index]}">${itemDetails.colors[index]}</option>`;
  }
}


/**
* Get quantity and color selected, create Cartitem object and add it to cart only if
* a color and a quantity not between 0 to 100 has been selected. Else an alert has been send to user. 
* @param {{}} item 
*/
function addItem(item) {
  const _quantity = Number(document.getElementById("quantity").value);
  const _color = document.getElementById("colors").value;
  if (_color != "" && _quantity >= 1 && _quantity <= 100) {
      let _item = new CartItem(item._id, _color, _quantity);
      addItemToCart(_item);
  } else {
    if (_color == "") {
      alert("Veuillez choisir une couleur")
  }
  else if (_quantity > 100 || _quantity < 0) {
      alert("Veuillez choisir une quantité comprise entre 1 et 100");
  }
}
} 

/**
* Get Add to cart button element and call addItem function on click.
* @param {{}} item 
*/
function addClickEvent(item) {
  const CartButton = document.getElementById("addToCart");
  CartButton.addEventListener("click", (event) => addItem(item, event));
}

ProductProcess();