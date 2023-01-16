fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((data) => {
    // console.log(data);
    displayKanapList(data);
  });

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
