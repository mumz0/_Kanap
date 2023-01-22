// Get ID from URL, then get the product object on JSON format and display datas needed
// to product page. handle adding item to cart on click event
function getProductDetailsAndDisplay() {
  id = getIdFromUrl("_id");
  getProductById(id)
    .then((res) => res.json())
    .then((item) => {
      displayKanapDetails(item);
      addClickEvent(item);
    });
}

// Display prodcut datas in product page
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

// Get quantity and color selected, create Cartitem object and add it to cart only if
// a color has been selected. Else an alert has been send to user.
function addItem(item) {
  const _quantity = Number(document.getElementById("quantity").value);
  const _color = document.getElementById("colors").value;
  if (_color != "") {
    let _item = new CartItem(item._id, _color, _quantity);
    addItemToCart(_item);
  }
  if (_quantity > 100) {
    alert("Veuillez choisir une quantité comprise entre 1 et 100");
  }
}


// Get Add to cart button element and call addItem function on click.
function addClickEvent(item) {
  const CartButton = document.getElementById("addToCart");
  CartButton.addEventListener("click", (event) => addItem(item, event));
}

getProductDetailsAndDisplay();
