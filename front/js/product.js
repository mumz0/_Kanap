function getProductDetailsAndDisplay() {
  id = getIdFromUrl();
  getProductById(id)
    .then((res) => res.json())
    .then((item) => {
      // console.log(item);
      displayKanapDetails(item);
      addClickEvent(item);
    });
}

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

function addItem(item) {
  const _quantity = Number(document.getElementById("quantity").value);
  const _color = document.getElementById("colors").value;
  let _item = new CartItem(item._id, _color, _quantity);
  addItemToCart(_item);
}

function addClickEvent(item) {
  const CartButton = document.getElementById("addToCart");
  CartButton.addEventListener("click", (event) => addItem(item, event));
}

getProductDetailsAndDisplay();
