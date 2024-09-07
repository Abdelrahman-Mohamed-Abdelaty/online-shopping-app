const submitBtn = document.querySelector('.submit-product')
function Alert(type,msg,notReload) {
    const div = document.createElement('div');
    div.classList.add(`${type}-alert`);
    div.textContent = msg;
    document.body.appendChild(div);
    setTimeout(()=>{
        div.remove();
        if(!notReload)
            location.reload();
    },2000)

}
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
async function updateProduct(e) {
    e.preventDefault();
    const id = document.querySelector('.photo-id').getAttribute('id')
    const url = 'api/v1/products/'+id;
    console.log(url)
    const price = document.querySelector('#price'+id).value;
    const offer = document.querySelector('#offer'+id).value
    const name = document.querySelector('#name'+id).value
    const sizes = document.querySelector('#sizes'+id).value
    const discountedPrice = price * 1 * (1 - offer / 100);
    // Create a FormData object
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('offer', offer);
    formData.append('sizes', sizes);
    formData.append('discountedPrice', discountedPrice)

    const fileInput = document.querySelector('#images'+id);
    formData.append('images', fileInput.files[0]);
    formData.append('images', fileInput.files[1]);

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            body: formData,
        });
        const responseData = await response.json();
        if(!response.ok)
            throw new Error(responseData.message);

        document.querySelector('.product-container').remove();
        document.body.classList.remove('blurred');
        Alert('success',`Product with name ${responseData.data.document.name} was updated successfully`);
    } catch (error) {
        document.querySelector('.product-container').remove();
        document.body.classList.remove('blurred');
        Alert('error',error.message);
    }

}
async function deleteProduct(e) {
    e.preventDefault();
    const id = document.querySelector('.photo-id').getAttribute('id')
    const url = 'api/v1/products/' + id;

    try {
        const response = await fetch(url, {
            method: 'DELETE',
        });
        if(!response.ok)
            throw new Error('error in deleting the product');
        document.querySelector('.product-container').remove();
        document.body.classList.remove('blurred');
        Alert('success',`Product was deleted successfully`);
    } catch (error) {
        document.querySelector('.product-container').remove();
        document.body.classList.remove('blurred');
        Alert('error',error.message);
    }
}
function createProductForm(product){
    const form = document.createElement("form");
    form.className = "add-products-form";

    // Array of form fields with their respective attributes
    const fields = [
        { label: "Name", id: "name"+product._id, type: "text",value:product.name},
        { label: "Price", id: "price"+product._id, type: "number", min: "0",value: product.price },
        { label: "Sizes", id: "sizes"+product._id, type: "number", min: "0",value: product.sizes},
        { label: "Offer", id: "offer"+product._id, type: "number", min: "0" ,value: product.offer},
        { label: "Images", id: "images"+product._id, placeholder: "Enter the product images", type: "file", multiple: true, accept: "image/*" }
    ];

    // Function to create and append input fields to the form
    const divForInputs = document.createElement('div');
    divForInputs.classList.add('product-grid-form')
    fields.forEach(field => {
        const label = document.createElement("label");
        label.setAttribute("for", field.id);
        label.textContent = field.label;

        const input = document.createElement("input");
        input.id = field.id;
        input.placeholder = field.placeholder;
        input.type = field.type;

        // Set additional attributes if present
        if (field.min) input.min = field.min;
        if (field.multiple) input.multiple = field.multiple;
        if (field.accept) input.accept = field.accept;
        if(field.value) input.value = field.value;
        divForInputs.appendChild(label);
        divForInputs.appendChild(input);
    });
    form.appendChild(divForInputs)
    const div = document.createElement('div')
    // Create and append the submit button
    const submitButton = document.createElement("button");
    submitButton.className = "submit-product";
    submitButton.textContent = "Update";
    submitButton.addEventListener('click',updateProduct)
    // Create and append the submit button
    const cancelButton = document.createElement("button");
    cancelButton.className = "delete-product";
    cancelButton.textContent = "Delete";
    cancelButton.addEventListener('click',deleteProduct)

    div.appendChild(submitButton);
    div.appendChild(cancelButton);

    form.appendChild(div);
    return form;
}

async function createProduct() {
    const url = 'api/v1/products';
    const price = document.querySelector('#price').value;
    const offer = document.querySelector('#offer').value
    const name = document.querySelector('#name').value
    const sizes = document.querySelector('#sizes').value
    const discountedPrice = price*1*(1-offer/100);
    // Create a FormData object
    const formData = new FormData();
    formData.append('name',name);
    formData.append('price',price);
    formData.append('offer', offer);
    formData.append('sizes', sizes);
    formData.append('discountedPrice',discountedPrice)

    const fileInput = document.querySelector('input[type="file"]');
    formData.append('images', fileInput.files[0]);
    formData.append('images', fileInput.files[1]);
    console.log(formData);
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });
        const responseData = await  response.json();
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(responseData.message);
        }
        Alert('success',`Product with name ${responseData.data.document.name} was created successfully`);
    } catch (error) {
        console.error('Error creating product:', error);
        Alert('error',error.message,true);
    }

}


if(submitBtn){
    submitBtn.addEventListener('click',async (e)=>{
        e.preventDefault();
        console.log('hello')
        await createProduct();

    })
}
/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

const cardsGrid = document.querySelector('.grid');
function changeImage(id,imageSrc) {
    document.getElementById('mainImage'+id).src = imageSrc;
}
async function start (){
    const response = await fetch('api/v1/products?page=1&limit=100')
    const data = await response.json(); // Parses the response as JSON
    const products = data.data.documents
    console.log(products);

    //Build the product card
    products.forEach((product)=>{
        createProductCart(product);
    })
}
start();
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
    if(product.images&&product.images.length>1) {
        img.src = `img/products/${product.images[0]}`;
    }
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
    if(product.images&&product.images.length>1) {
        mainImage.src = `img/products/${product.images[0]}`
    }
    mainImage.alt = "Product Image";
    mainImage.id = "mainImage"+product.id;

// Create thumbnails container
    const thumbnails = document.createElement("div");
    thumbnails.classList.add("thumbnails");

// Create thumbnails
    const thumbnail1 = document.createElement("img");
    if(product.images&&product.images.length>1) {
        thumbnail1.src = `img/products/${product.images[0]}`
    }
    thumbnail1.alt = "Thumbnail 1";
    thumbnail1.onclick = function () {
        changeImage(product.id,thumbnail1.src);
    };

    const thumbnail2 = document.createElement("img");
    if(product.images&&product.images.length>1) {
        thumbnail2.src = `img/products/${product.images[1]}`;
    }
    thumbnail2.alt = "Thumbnail 2";
    thumbnail2.onclick = function () {
        changeImage(product.id,thumbnail2.src);x
    };

// Append images to thumbnails
    thumbnails.appendChild(thumbnail1);
    thumbnails.appendChild(thumbnail2);

// Append main image and thumbnails to productImages
    productImages.appendChild(mainImage);
    productImages.appendChild(thumbnails);

// Create product title
    const productTitle = document.createElement("h2");
    productTitle.classList.add("product-title");
    productTitle.id = "product-title"
    productTitle.textContent = product.name;

    const productForm = createProductForm(product);
    const cancelContainer = document.createElement('div');
    const a = document.createElement('a')
    console.log(product._id)
    a.setAttribute('id',product._id);
    a.setAttribute("class",'photo-id');
    productContainer.appendChild(a)
    //Create cancel button
    const cancelButton = document.createElement("button");
    cancelButton.classList.add('cancel-btn');
    cancelButton.textContent ='X'
    cancelButton.addEventListener('click',()=>{
        document.body.classList.remove('blurred');
        document.body.removeChild(productContainer)
    })
    cancelContainer.appendChild(cancelButton);
    cancelContainer.appendChild(a);
    cancelContainer.classList.add('cancel-btn-container')
// Append productImages and productDetails to productContainer
    productContainer.appendChild(productImages);
    productContainer.appendChild(productForm);
    productContainer.appendChild(cancelContainer)


// Append productContainer to body or a specific container
    document.body.appendChild(productContainer);
    document.body.classList.add("blurred");
    e.stopPropagation();
}

function handleClickOutside(event) {
    const overlayElement = document.querySelector(".product-container");
    if (overlayElement && !overlayElement.contains(event.target)) {
        overlayElement.remove();
        document.body.classList.remove("blurred");
    }
}

document.addEventListener("click", handleClickOutside);
