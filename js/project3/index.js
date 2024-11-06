document.addEventListener("DOMContentLoaded", () => {
  const products = [
    { id: 1, name: "Product 1", price: 29.99 },
    { id: 2, name: "Product 2", price: 32.89 },
    { id: 3, name: "Product 3", price: 43.99 },
  ];

  const cart = [];

  const ProductList = document.querySelector(".product-list");
  const cartItem = document.querySelector(".cart-item");
  const emptyCartMsg = document.querySelector(".empty-cart");
  const cartTotalMsg = document.querySelector(".cart-total");
  const TotalPriceMsg = document.querySelector(".total-price");
  const CheckoutMsg = document.querySelector(".checkout-btn");

  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `<span>${product.name} - ₹${product.price.toFixed(
      2
    )}</span>
   <button data-id= "${product.id}">Add to cart </button>`;
    ProductList.appendChild(productDiv);
  });

  ProductList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const productId = parseInt(e.target.getAttribute("data-id"));
      const product = products.find((p) => p.id === productId);
      addToCart(product);
    }
  });

  function addToCart(product) {
    cart.push(product);
    renderCart();
  }

  function renderCart() {
    cartItem.innerHTML = "";
    let TotalPrice = 0;
    if (cart.length > 0) {
      emptyCartMsg.classList.add("hidden");
      cartTotalMsg.classList.remove("hidden");
      cart.forEach((item, index) => {
        TotalPrice += item.price;
        const itemCart = document.createElement("div");
        itemCart.innerHTML = `${item.name}- ₹${item.price.toFixed(2)}`;
        cartItem.appendChild(itemCart);
        TotalPriceMsg.textContent = `${TotalPrice.toFixed(2)}`;
      });
    } else {
      emptyCartMsg.classList.remove("hidden");
      TotalPriceMsg.textContent = `₹0.00`;
    }
  }
  CheckoutMsg.addEventListener("click", () => {
    cart.length = 0;
    alert("checkout successfully");
    renderCart();
  });
});
