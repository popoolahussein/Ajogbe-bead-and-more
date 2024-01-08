let label = document.getElementById("label");
let shoppingCart = document.getElementById("shopping-cart");
let basket = JSON.parse(localStorage.getItem("data")) || [];

let calculation = () => {
    let cartIcon = document.getElementById("cartAmount");
    cartIcon.innerHTML = basket.map((h) => h.item).reduce((h,i)=>h + i, 0);   
};

calculation();

let generateCartItems = () => {
    if (basket.length !==0) {
        return (shoppingCart.innerHTML = basket.map((h) => {
            let { id, item } = h;
            let search = shopItemsData.find((y) => y.id === id) || [];
            let {img, name, price} = search
            return `
            <div class="cart-item">
              <img width="100" src="${img}" alt="" />
              <div class="details">

               <div class="title-price-x">
                    <h4 class="title-price">
                     <p>${name}</p>
                     <p class="cart-item-price"># ${price}</p>

                    </h4>
                 <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
               </div>

               <div class="cart-buttons"></div>

               <div class="buttons">
                    <i onclick="decrement(${id})" class="bi bi-dash-lg"></i>
                    <div id=${id} class="quantity">${item}</div> 
                    <i onclick="increment(${id})" class="bi bi-plus-lg"></i>
                </div>

               <h3># ${item * search.price}</h3>
              </div>
            </div>
            `;
        }).join(""));
    } else {
        shoppingCart.innerHTML = ``;
        label.innerHTML = `
        <h2>Cart is Empty</h2>
        <a href="index.html">
          <button class="HomeBtn">Back to Home</button>
        </a>
        `;
    }
};

generateCartItems();

let increment = (id) => {
    let selectedItem = id;
    let search = basket.find((h)=> h.id === selectedItem.id);

    if(search === undefined){
        basket.push({
            id: selectedItem.id,
            item: 1,
        });
    } else {
        search.item += 1;
    }
    generateCartItems();
    // console.log(basket);
    update(selectedItem.id);
    localStorage.setItem("data", JSON.stringify(basket));
};

let decrement = (id) => {
    let selectedItem = id;
    let search = basket.find((h)=> h.id === selectedItem.id);

    if(search === undefined) return;
    else if(search.item === 0) return;
    else {
        search.item -= 1;
    }
    update(selectedItem.id);
    basket = basket.filter((h) => h.item !== 0);
    generateCartItems();

    localStorage.setItem("data", JSON.stringify(basket));
};

let update = (id) => {
    let search = basket.find((h) => h.id === id);
    // console.log(search.item);
    document.getElementById(id).innerHTML = search.item;
    calculation();
    TotalAmount();
};

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((h) => h.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    basket = []
    generateCartItems();
    calculation();
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
if(basket.length !==0){
    let amount = basket.map((h) => {
        let { item, id } = h;
        let search = shopItemsData.find((i) => i.id === id) || [];
        return item * search.price;
    }).reduce((h,i) => h + i, 0 );
   // console.log(amount)
   label.innerHTML = `
   <h2>Total Bill : # ${amount}</h2>
   <button class="checkout"><a href="tel:+2347035258447">Checkout</a></button>
   <button onclick="clearCart()" class="removeAll">Clear Cart</button>
   `
}
else return
};

TotalAmount();