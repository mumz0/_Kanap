function confirmation() {
    orderid = getIdFromUrl("id")
    console.log(orderid)
    localStorage.clear();
    document.getElementById("orderId").innerHTML = orderid;
} confirmation()