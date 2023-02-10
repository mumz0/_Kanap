/**
 * Get all product from API on JSON format and display them to index page.
 */
function indexProcess() {
  fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((data) => {
      displayKanapList(data);
    });
} 

/**
 * Créate HTML and display datas needed
 * @param {[]} cardList 
 */
function displayKanapList(cardList) {
  for (let card of cardList) {
    var link = document.createElement("a");
    link.href = `./product.html?_id=${card._id}`;

    var article = document.createElement("article");

    var image = document.createElement("img");
    image.setAttribute("src", card.imageUrl);
    image.setAttribute("alt", card.altTxt);
    article.appendChild(image);

    var productName = document.createElement("h3");
    productName.classList.add("productName");
    productName.innerText = card.name;
    article.appendChild(productName);

    var productDescription = document.createElement("p");
    productDescription.classList.add("productDescription");
    productDescription.innerText = card.description;
    article.appendChild(productDescription);
    link.appendChild(article);

    document.getElementById("items").appendChild(link);
  }
}

indexProcess()