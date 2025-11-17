document.addEventListener('DOMContentLoaded', function () {
  var menuItems = document.querySelectorAll('.menu-item');
  var cartItemsList = document.querySelector('.cart-items');
  var cartTotalEl = document.getElementById('cart-total');
  var form = document.getElementById('order-form');
  var confirmationMessage = document.getElementById('confirmation-message');

  var cart = {}; // Stores items: { itemName: { price, qty } }

  // Add + / - functionality
  menuItems.forEach(function (item) {
    var name = item.getAttribute('data-name');
    var price = parseFloat(item.getAttribute('data-price'));
    var qtySpan = item.querySelector('.qty');
    var plusBtn = item.querySelector('.plus');
    var minusBtn = item.querySelector('.minus');

    plusBtn.addEventListener('click', function () {
      updateQty(1);
    });

    minusBtn.addEventListener('click', function () {
      updateQty(-1);
    });

    function updateQty(change) {
      let currentQty = parseInt(qtySpan.textContent);
      currentQty += change;

      if (currentQty < 0) currentQty = 0;
      qtySpan.textContent = currentQty;

      if (currentQty === 0) {
        delete cart[name];
      } else {
        cart[name] = { price: price, qty: currentQty };
      }
      updateCartUI();
    }
  });

  // Update cart display + total
  function updateCartUI() {
    cartItemsList.innerHTML = '';

    let itemNames = Object.keys(cart);

    if (itemNames.length === 0) {
      cartItemsList.innerHTML = '<li class="empty">Cart is empty</li>';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    let total = 0;

    itemNames.forEach(name => {
      let item = cart[name];
      let itemTotal = (item.qty * item.price);
      total += itemTotal;

      let li = document.createElement('li');
      li.textContent = `${item.qty} × ${name} - $${itemTotal.toFixed(2)}`;
      cartItemsList.appendChild(li);
    });

    cartTotalEl.textContent = '$' + total.toFixed(2);
  }

  // Form submission
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    let name = document.getElementById('name').value;
    let total = cartTotalEl.textContent;

    confirmationMessage.textContent =
      `Thank you, ${name}! Your order has been received. Total: ${total}.`;
    confirmationMessage.classList.add('show');

    // Reset cart + form
    cart = {};
    document.querySelectorAll('.qty').forEach(span => span.textContent = '0');
    updateCartUI();
    form.reset();
  });
});
