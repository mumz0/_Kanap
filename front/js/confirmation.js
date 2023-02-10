/**
 * Get order Id from URL, clear the local storage and display the order id in the DOM
 */
function confirmation() {
    orderid = getIdFromUrl("id")
    localStorage.clear();
    document.getElementById("orderId").innerHTML = orderid;
} confirmation()