fetch('http://localhost:5000/products')

.then(res => res.json())

.then(data => {

    const productsDiv = document.getElementById('products');

    data.forEach(product => {

        productsDiv.innerHTML += `

            <div class="card">

                <h2>${product.name}</h2>

                <p>₹${product.price}</p>

                <button onclick="addToCart('${product.name}', ${product.price})">

                    Add to Cart

                </button>

            </div>

        `;

    });

});

function addToCart(name, price){

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.push({
        name: name,
        price: price
    });

    localStorage.setItem('cart', JSON.stringify(cart));

    alert('Product Added To Cart');

}