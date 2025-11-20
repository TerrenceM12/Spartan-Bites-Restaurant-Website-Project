// Casey De Vera - Fixed version

document.addEventListener('DOMContentLoaded', function () {
  const menuItems = document.querySelectorAll('.menu-item');
  const cartItemsList = document.querySelector('.cart-items');
  const cartTotalEl = document.getElementById('cart-total');
  const form = document.getElementById('order-form');
  const confirmationMessage = document.getElementById('confirmation-message');

  // Stores items: { itemName: { price, qty } }
  let cart = {};

  // Add + / - functionality
  menuItems.forEach(function (item) {
    const name = item.getAttribute('data-name');
    const price = parseFloat(item.getAttribute('data-price'));
    const qtySpan = item.querySelector('.qty');
    const plusBtn = item.querySelector('.plus');
    const minusBtn = item.querySelector('.minus');

    function updateQty(change) {
      let currentQty = parseInt(qtySpan.textContent, 10) || 0;
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

    plusBtn.addEventListener('click', function () {
      updateQty(1);
    });

    minusBtn.addEventListener('click', function () {
      updateQty(-1);
    });
  });

  // Update cart display + total
  function updateCartUI() {
    cartItemsList.innerHTML = '';

    const itemNames = Object.keys(cart);

    if (itemNames.length === 0) {
      cartItemsList.innerHTML = '<li class="empty">Cart is empty</li>';
      cartTotalEl.textContent = '$0.00';
      return;
    }

    let total = 0;

    itemNames.forEach(name => {
      const item = cart[name];
      const itemTotal = item.qty * item.price;
      total += itemTotal;

      const li = document.createElement('li');
      li.textContent = `${item.qty} × ${name} - $${itemTotal.toFixed(2)}`;
      cartItemsList.appendChild(li);
    });

    cartTotalEl.textContent = '$' + total.toFixed(2);
  }

  // Form submission
  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    if (Object.keys(cart).length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

 // ===== WENDY MAGDAY CODE START =====
    
    const customerInfo = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      specialRequests: document.getElementById('special-requests').value.trim()
    };

    const items = Object.keys(cart).map(name => ({
      name,
      price: cart[name].price,
      qty: cart[name].qty,
      itemTotal: (cart[name].price * cart[name].qty).toFixed(2)
    }));

    const total = cartTotalEl.textContent.replace('$', '');

    const orderData = { customerInfo, items, total };

    try {
      const response = await fetch("https://spartan-bites-api.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

    // ===== WENDY MAGDAY CODE END =====
      
      confirmationMessage.textContent =
        `Thank you, ${customerInfo.name}! Your order${result.orderId ? ` (#${result.orderId})` : ''} has been submitted. Total: $${total}.`;
      confirmationMessage.classList.add('show');

      // Reset cart + form
      cart = {};
      document.querySelectorAll('.qty').forEach(span => {
        span.textContent = '0';
      });
      updateCartUI();
      form.reset();
    } catch (err) {
      console.error("Backend error:", err);
      confirmationMessage.textContent =
        "There was a problem submitting your order. Please try again.";
      confirmationMessage.classList.add('show');
    }
  });
});


  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('nav-open');
    navToggle.classList.toggle('nav-open');
  });