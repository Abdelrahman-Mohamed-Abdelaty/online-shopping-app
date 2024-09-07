const cardsGrid = document.querySelector('.grid');
function changeImage(id,imageSrc) {
    document.getElementById('mainImage'+id).src = imageSrc;
}

async function start (){
    const response = await fetch('https://gym-clothes-online-production.up.railway.app/api/v1/products?page=1&limit=6')
    const data = await response.json(); // Parses the response as JSON
    const products = data.data.documents
    console.log(products);
    //Build the product card
    products.forEach((product)=>{
        createProductCart(product);
    })
}
start();

function updateCart(e,product,size){
    e.stopPropagation();
    const count = document.querySelector('.purchase-options input').value
    console.log("count",count);
    product.count = count;
    product.size = size;
    // add the product to localstorage
    let cart=JSON.parse(localStorage.getItem('cart'));
    if(!cart)
        cart = [];
    cart = cart.filter((cartItem)=>cartItem.name !==product.name)
    cart.push(product);
    localStorage.setItem('cart',JSON.stringify(cart));
    window.location.href = 'checkout.html'
}
// create product cards
function createProductCart(product){
    const card = document.createElement("div");
    card.classList.add("card");
    // card.setAttribute("onclick", "getProductInfoPage('Cobra')");
    card.addEventListener("click", (e)=>{
        getProductInfoPage(e,product)
    })

// Create the card image container
    const cardImage = document.createElement("div");
    cardImage.classList.add("card-image");

// Create the image element
    const img = document.createElement("img");
    img.src = `https://gym-clothes-online-production.up.railway.app/img/products/${product.images[0]}`;
    img.alt = "image for trousers";

// Append the image to the card image container
    cardImage.appendChild(img);

// Create the card text container
    const cardText = document.createElement("div");
    cardText.classList.add("card-text");

// Create the text elements
    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = product.name;

    const sizesParagraph = document.createElement("p");
    sizesParagraph.textContent = `${product.sizes} Sizes`;

    const priceParagraph = document.createElement("p");
    priceParagraph.innerHTML = `EGP <strong>${product.discountedPrice}</strong>`;

    const discountParagraph = document.createElement("p");
    discountParagraph.innerHTML = `<span>EGP ${product.price} </span><strong>-${product.offer}%</strong>`;

// Append the text elements to the card text container
    cardText.appendChild(nameParagraph);
    cardText.appendChild(sizesParagraph);
    cardText.appendChild(priceParagraph);
    cardText.appendChild(discountParagraph);

// Append the image container and text container to the card
    card.appendChild(cardImage);
    card.appendChild(cardText);

    cardsGrid.appendChild(card);
}

function getProductInfoPage(e,product){

// Create the main container
    const productContainer = document.createElement("div");
    productContainer.classList.add("product-container");

// Create the product images container
    const productImages = document.createElement("div");
    productImages.classList.add("product-images");

// Create the main image
    const mainImage = document.createElement("img");
    mainImage.src = `https://gym-clothes-online-production.up.railway.app/img/products/${product.images[0]}`
    mainImage.alt = "Product Image";
    mainImage.id = "mainImage"+product.id;

// Create thumbnails container
    const thumbnails = document.createElement("div");
    thumbnails.classList.add("thumbnails");

// Create thumbnails
    const thumbnail1 = document.createElement("img");
    thumbnail1.src = `https://gym-clothes-online-production.up.railway.app/img/products/${product.images[0]}`
    thumbnail1.alt = "Thumbnail 1";
    thumbnail1.onclick = function () {
        changeImage(product.id,thumbnail1.src);
    };

    const thumbnail2 = document.createElement("img");
    thumbnail2.src = `https://gym-clothes-online-production.up.railway.app/img/products/${product.images[1]}`;
    thumbnail2.alt = "Thumbnail 2";
    thumbnail2.onclick = function () {
        changeImage(product.id,thumbnail2.src);
    };

// Append images to thumbnails
    thumbnails.appendChild(thumbnail1);
    thumbnails.appendChild(thumbnail2);

// Append main image and thumbnails to productImages
    productImages.appendChild(mainImage);
    productImages.appendChild(thumbnails);

// Create product details container
    const productDetails = document.createElement("div");
    productDetails.classList.add("product-details");

// Create product title
    const productTitle = document.createElement("h2");
    productTitle.classList.add("product-title");
    productTitle.id = "product-title";
    productTitle.textContent = product.name;

// Create product price
    const productPrice = document.createElement("p");
    productPrice.classList.add("product-price");

    const currentPrice = document.createElement("span");
    currentPrice.classList.add("current-price");
    currentPrice.textContent = `EGP ${product.discountedPrice}`;

    const originalPrice = document.createElement("span");
    originalPrice.classList.add("original-price");
    originalPrice.textContent = `EGP ${product.price}`

    const discountTag = document.createElement("span");
    discountTag.classList.add("ant-tag");
    discountTag.innerHTML = `<span role="img" class="anticon ant-icon-sm"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" focusable="false" class=""><path fill="#660000" fill-rule="evenodd" d="m6.771 13.066.018.018a1.08 1.08 0 0 0 1.528 0L13.4 8V2.6H8L2.916 7.683a1.08 1.08 0 0 0 0 1.528z" clip-rule="evenodd"></path></svg></span>Save ${product.offer}%`;

// Append price details to productPrice
    productPrice.appendChild(currentPrice);
    productPrice.appendChild(originalPrice);
    productPrice.appendChild(discountTag);

// Create product options (size selection)
    const productOptions = document.createElement("div");
    productOptions.classList.add("product-options");
    const sizeText = document.createElement("p");
    sizeText.textContent = "Size:";

    const sizes = document.createElement("div");
    sizes.classList.add("sizes");
    let index = 0;
    ["S", "M", "L", "XL", "XXL"].forEach(size => {
        const sizeButton = document.createElement("button");
        sizeButton.textContent = size;
        sizeButton.addEventListener('click',()=>{
            sizeButton.classList.add(`button-clicked-${++index}`)
        })
        sizes.appendChild(sizeButton);
    });

    productOptions.appendChild(sizeText);
    productOptions.appendChild(sizes);

// Create purchase options
    const purchaseOptions = document.createElement("div");
    purchaseOptions.classList.add("purchase-options");

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = "1";
    quantityInput.min = "1";
    quantityInput.max = "10";
    quantityInput.classList.add("input");

    const buyNowButton = document.createElement("button");
    buyNowButton.classList.add("buy-now");
    buyNowButton.textContent = "Buy now";
    buyNowButton.addEventListener('click',(e)=>{
        console.log(`.button-clicked-${index}`)
        const chozenSize = document.querySelector(`.button-clicked-${index}`)
        if(!chozenSize)
            return updateCart(e,product,'M')
        updateCart(e,product,chozenSize.textContent);
    })


    const addToCartButton = document.createElement("button");
    addToCartButton.classList.add("add-to-cart");
    addToCartButton.textContent = "Add to shopping bag";
    addToCartButton.addEventListener('click',(e)=>{
        const chozenSize = document.querySelector(`.button-clicked-${index}`)
        if(!chozenSize)
            return updateCart(e,product,'M')
        updateCart(e,product,chozenSize.textContent);
    })

    purchaseOptions.appendChild(quantityInput);
    purchaseOptions.appendChild(buyNowButton);

// Create extra info section
    const extraInfo = document.createElement("div");
    extraInfo.classList.add("extra-info");
    extraInfo.innerHTML = `
        <p>Shipping fees calculated at checkout</p><hr>
        <p>Estimated delivery within 6–10 working days</p><hr>
        <p>Returns allowed within 3 days from delivery for EGP 100</p><hr>
        <p>Cash on delivery</p><hr>
    `;

// Create sold-by text
    const soldBy = document.createElement("p");
    soldBy.classList.add("sold-by");
    soldBy.innerHTML = 'Sold by <strong>H B A</strong>';


    //Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.classList.add('cancel-btn');
    cancelButton.textContent ='X'
    cancelButton.addEventListener('click',()=>{
         document.body.classList.remove('blurred');
         document.body.removeChild(productContainer)
    })
// Append all elements to productDetails
    productDetails.appendChild(productTitle);
    productDetails.appendChild(productPrice);
    productDetails.appendChild(productOptions);
    productDetails.appendChild(purchaseOptions);
    productDetails.appendChild(addToCartButton);
    productDetails.appendChild(extraInfo);
    productDetails.appendChild(soldBy);

// Append productImages and productDetails to productContainer
    productContainer.appendChild(productImages);
    productContainer.appendChild(productDetails);
    productContainer.appendChild(cancelButton)

// Append productContainer to body or a specific container
    document.body.appendChild(productContainer);
    document.body.classList.add("blurred");
    e.stopPropagation();
}

function handleClickOutside(event) {
    const overlayElement = document.querySelector(".product-container");

    // Check if the click is outside the overlay element
    if (overlayElement && !overlayElement.contains(event.target)) {
        // Remove the overlay element
        overlayElement.remove();
        // Remove the blur effect from the body
        document.body.classList.remove("blurred");
        // Remove the event listener since it's no longer needed
        // document.removeEventListener("click", handleClickOutside);
    }
}

document.addEventListener("click", handleClickOutside);


function toggleNav() {
    const menu = document.getElementById('menu');
    const body = document.body;
    if (menu.classList.contains('open')) {
        menu.classList.remove('open');
        body.style.overflow = 'auto';
    } else {
        menu.classList.add('open');
        body.style.overflow = 'hidden';
    }
}
const shopNowBtn = document.querySelector('.mainbuttonshopnow')
if(shopNowBtn){
    shopNowBtn.addEventListener('click',(e)=>{
        e.stopPropagation();
        window.location.href = 'shop.html'
    })
}