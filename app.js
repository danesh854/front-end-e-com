fetch("http://backend-service:3000/products")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("products");
    data.forEach(p => {
      const el = document.createElement("p");
      el.innerText = `${p.name} - ₹${p.price}`;
      container.appendChild(el);
    });
  });
