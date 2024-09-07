// Function to create and append the HTML structure
function createCheckoutSection(product) {
    // Create main container div with class "grid grid-2-columns left-part-checkout"
    const mainDiv = document.createElement('div');
    mainDiv.className = 'grid grid-2-columns left-part-checkout';

    // Create product info container div with class "product-cart-info grid grid-2-columns"
    const productInfoDiv = document.createElement('div');
    productInfoDiv.className = 'product-cart-info grid grid-2-columns';

    // Create and append image container div
    const imageDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = `https://gym-clothes-online-production.up.railway.app/img/products/${product.images[0]}`;
    imageDiv.appendChild(img);
    productInfoDiv.appendChild(imageDiv);

    // Create and append product summary container div
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'checkout-product-summary';
    summaryDiv.innerHTML = `
        <p>${product.name}</p>
        <p>
            <strong>EGP ${product.discountedPrice}</strong>
            <span class="line-through">EGP ${product.price}</span>
        </p>
        <p>${product.size}</p>
    `;
    productInfoDiv.appendChild(summaryDiv);

    // Append product info container to the main container
    mainDiv.appendChild(productInfoDiv);

    // Create product icons container div with class "product-cart-icons"
    const iconsDiv = document.createElement('div');
    iconsDiv.className = 'product-cart-icons';

    // Create and append first SVG icon
    const svg1 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg1.setAttribute('viewBox', '0 0 24 24');
    svg1.setAttribute('fill', 'none');
    svg1.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg1.setAttribute('stroke', '#767474');
    svg1.innerHTML = `
        <path d="M10 12V17" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M14 12V17" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M4 7H20" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
        <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    `;
    svg1.addEventListener('click',(e)=>{
        mainDiv.remove();
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart = cart.filter((item)=>item.name!==product.name)
        if(cart.length>0)
            localStorage.setItem('cart',JSON.stringify(cart));
        else
            localStorage.removeItem('cart')
        updateCheckoutState(cart);
        e.stopPropagation();
    })
    iconsDiv.appendChild(svg1);

    // Create and append input element
    const input = document.createElement('input');
    input.type = 'number';
    input.value = product.count;
    input.min = 1;
    input.classList.add(`input-${product.name}`)
    input.addEventListener('change',(e)=>{
        e.stopPropagation();
        let x = document.querySelector(`.input-${product.name}`).value *1;
        let toDelete = -1;
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.map((item,index)=>{
            if(item.name===product.name){
                item.count=x;
                toDelete =index;
            }
        })
        if(x===0){
            cart.splice(toDelete,1);
            mainDiv.remove();
        }
        updateCheckoutState(cart);
        if(cart.length>0)
            localStorage.setItem('cart',JSON.stringify(cart));
        else
            localStorage.removeItem('cart')
    })
    iconsDiv.appendChild(input);

    // Create and append second SVG icon
    const svg2 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg2.setAttribute('viewBox', '0 0 24 24');
    svg2.setAttribute('fill', 'none');
    svg2.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg2.innerHTML = `
        <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke="#767474" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    `;
    svg2.addEventListener('click',(e)=>{
        e.stopPropagation();
        let x = document.querySelector(`.input-${product.name}`).value *1;
        document.querySelector(`.input-${product.name}`).value = ++x;
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.map((item)=>{
            if(item.name===product.name){
                item.count++;
            }
        })
        updateCheckoutState(cart);
        localStorage.setItem('cart',JSON.stringify(cart));

    })

    iconsDiv.appendChild(svg2);

    // Append icons container to the main container
    mainDiv.appendChild(iconsDiv);

    document.querySelector('.checkout-products-summary').appendChild(mainDiv);

}


const cart = JSON.parse(localStorage.getItem('cart'));
const placeOrder = document.querySelector('.place-order');
const totalpriceElements = document.querySelectorAll('.total-price')
const discounts = ['abdo','ali','alia'];
const discountElemnt = document.querySelector('.discount-input input')
const applyDiscountBtn = document.querySelector('.apply-discount-btn')

applyDiscountBtn.addEventListener('click',()=>{
    const cart = JSON.parse(localStorage.getItem('cart'));
    updateCheckoutState(cart)
})

function handleNoProducts() {
    placeOrder.classList.add('place-order--not-active');
    const addProductsBtn = document.querySelector('.add-new-product-to-cart')
    if(addProductsBtn) return;
    const div = document.createElement('div');
    div.classList.add('add-new-product-to-cart');
    div.textContent = 'Add products'
    div.addEventListener('click',()=>{
        window.location.href='index.html'
    })
    document.querySelector('.checkout-products-summary').appendChild(div)
}

function updateCheckoutState(cart) {
    let price = 0;
    if(!cart || cart.length<1)
        handleNoProducts();
    else
        cart.forEach((item,index)=>{
            price += item.discountedPrice* item.count;
        })
    console.log(price);
    console.log(discountElemnt.value);
    if(price&&discounts.includes(discountElemnt.value)){
        price = Math.max(50,price - 50);
    }
    totalpriceElements.forEach((priceContainer)=>{
        priceContainer.textContent = `EGP ${price}`
    })
}

updateCheckoutState(cart);

if(cart){
    cart.forEach((item,index)=> createCheckoutSection(item))
}

const returnBtn = document.querySelector('.checkout-return');
if(returnBtn){
    returnBtn.addEventListener('click',(e)=>{
        window.location.href='index.html'
    })
}
