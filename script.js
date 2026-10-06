/* =====================================================
   APNA FOOD - COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   LOCAL STORAGE
===================================================== */

const KEY = {
    cart: "apnaFoodCart",
    orders: "apnaFoodOrders",
    users: "apnaFoodUsers",
    currentUser: "apnaFoodCurrentUser",
    coupon: "apnaFoodCoupon"
};


let cart = JSON.parse(localStorage.getItem(KEY.cart)) || [];
let orders = JSON.parse(localStorage.getItem(KEY.orders)) || [];
let users = JSON.parse(localStorage.getItem(KEY.users)) || [];
let currentUser = JSON.parse(
    localStorage.getItem(KEY.currentUser)
) || null;

let appliedCoupon =
    localStorage.getItem(KEY.coupon) || "";


/* =====================================================
   FOOD DATA
===================================================== */

const foods = [

    {
        id: 1,
        name: "Margherita Pizza",
        price: 249,
        emoji: "🍕",
        category: "pizza",
        rating: 4.7,
        restaurant: "Pizza House",
        description: "Fresh cheese pizza with tomato sauce."
    },

    {
        id: 2,
        name: "Cheese Burger",
        price: 179,
        emoji: "🍔",
        category: "burger",
        rating: 4.6,
        restaurant: "Burger Point",
        description: "Juicy burger with cheese and fresh vegetables."
    },

    {
        id: 3,
        name: "Veg Noodles",
        price: 149,
        emoji: "🍜",
        category: "noodles",
        rating: 4.5,
        restaurant: "Apna Kitchen",
        description: "Delicious noodles with fresh vegetables."
    },

    {
        id: 4,
        name: "Paneer Thali",
        price: 229,
        emoji: "🍛",
        category: "indian",
        rating: 4.8,
        restaurant: "Apna Kitchen",
        description: "Complete Indian meal with paneer and dal."
    },

    {
        id: 5,
        name: "French Fries",
        price: 99,
        emoji: "🍟",
        category: "snacks",
        rating: 4.4,
        restaurant: "Burger Point",
        description: "Crispy golden fries with seasoning."
    },

    {
        id: 6,
        name: "Chocolate Cake",
        price: 129,
        emoji: "🍰",
        category: "dessert",
        rating: 4.7,
        restaurant: "Pizza House",
        description: "Soft and delicious chocolate cake."
    }

];


/* =====================================================
   ELEMENTS
===================================================== */

const cartButton =
    document.querySelector(".cart-btn");

const cartCount =
    document.getElementById("cart-count");

const cartDrawer =
    document.getElementById("cart-drawer");

const cartOverlay =
    document.getElementById("cart-overlay");

const closeCartButton =
    document.getElementById("close-cart");

const cartItems =
    document.getElementById("cart-items");

const cartSubtotal =
    document.getElementById("cart-subtotal");

const deliveryFee =
    document.getElementById("delivery-fee");

const cartDiscount =
    document.getElementById("cart-discount");

const cartTotal =
    document.getElementById("cart-total");

const discountRow =
    document.getElementById("discount-row");

const checkoutButton =
    document.getElementById("checkout-btn");

const checkoutSection =
    document.getElementById("checkout-section");

const checkoutForm =
    document.getElementById("checkout-form");

const backToCart =
    document.getElementById("back-to-cart");

const searchInput =
    document.getElementById("food-search");

const categorySelect =
    document.getElementById("category-filter");

const sortSelect =
    document.getElementById("sort-food");

const foodGrid =
    document.getElementById("food-grid");

const authModal =
    document.getElementById("auth-modal");

const profileModal =
    document.getElementById("profile-modal");

const toastElement =
    document.getElementById("toast");


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function saveCart() {
    localStorage.setItem(
        KEY.cart,
        JSON.stringify(cart)
    );
}


function saveOrders() {
    localStorage.setItem(
        KEY.orders,
        JSON.stringify(orders)
    );
}


function saveUsers() {
    localStorage.setItem(
        KEY.users,
        JSON.stringify(users)
    );
}


function money(amount) {
    return "₹" + Number(amount).toFixed(0);
}


function showToast(message) {

    if (!toastElement) return;

    toastElement.textContent = message;

    toastElement.classList.add("show");

    setTimeout(function() {

        toastElement.classList.remove("show");

    }, 2500);
}


/* =====================================================
   CART CALCULATION
===================================================== */

function calculateCart() {

    let subtotal = 0;

    cart.forEach(function(item) {

        subtotal +=
            item.price * item.quantity;

    });


    let delivery = cart.length > 0 ? 40 : 0;

    let discount = 0;


    if (
        appliedCoupon === "WELCOME50" &&
        subtotal >= 399
    ) {

        discount = 50;

    }


    if (
        appliedCoupon === "FOOD10" &&
        subtotal >= 499
    ) {

        discount =
            Math.round(subtotal * 0.10);

    }


    if (
        appliedCoupon === "FREEDEL" &&
        subtotal >= 299
    ) {

        delivery = 0;

    }


    const total =
        Math.max(
            0,
            subtotal + delivery - discount
        );


    return {
        subtotal,
        delivery,
        discount,
        total
    };
}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(id) {

    const food =
        foods.find(function(item) {
            return item.id === id;
        });


    if (!food) return;


    const existingItem =
        cart.find(function(item) {
            return item.id === id;
        });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            ...food,
            quantity: 1
        });

    }


    updateCart();

    openCart();

    showToast(
        food.name + " added to cart 🛒"
    );
}


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(id, change) {

    const item =
        cart.find(function(item) {
            return item.id === id;
        });


    if (!item) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        removeFromCart(id);

        return;
    }


    updateCart();
}


/* =====================================================
   REMOVE FROM CART
===================================================== */

function removeFromCart(id) {

    cart =
        cart.filter(function(item) {
            return item.id !== id;
        });


    updateCart();

    showToast("Item removed from cart");
}


/* =====================================================
   UPDATE CART
===================================================== */

function updateCart() {

    let totalItems = 0;


    cart.forEach(function(item) {

        totalItems += item.quantity;

    });


    if (cartCount) {

        cartCount.textContent =
            totalItems;

    }


    if (!cartItems) return;


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <div>🛒</div>

                <p>
                    Your cart is empty
                </p>

                <small>
                    Add some delicious food!
                </small>

            </div>

        `;

    } else {

        cartItems.innerHTML = "";


        cart.forEach(function(item) {

            const itemTotal =
                item.price * item.quantity;


            cartItems.innerHTML += `

                <div class="cart-item">

                    <div class="cart-item-image">
                        ${item.emoji}
                    </div>

                    <div class="cart-item-info">

                        <h4>
                            ${item.name}
                        </h4>

                        <div class="cart-item-price">
                            ${money(itemTotal)}
                        </div>

                        <div class="quantity-control">

                            <button
                                type="button"
                                onclick="changeQuantity(${item.id}, -1)">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                onclick="changeQuantity(${item.id}, 1)">
                                +
                            </button>

                            <button
                                type="button"
                                class="remove-item"
                                onclick="removeFromCart(${item.id})">
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            `;

        });

    }


    const totals =
        calculateCart();


    cartSubtotal.textContent =
        money(totals.subtotal);

    deliveryFee.textContent =
        money(totals.delivery);

    cartDiscount.textContent =
        "-" + money(totals.discount);

    cartTotal.textContent =
        money(totals.total);


    if (
        discountRow &&
        totals.discount > 0
    ) {

        discountRow.classList.remove(
            "hidden"
        );

    } else if (discountRow) {

        discountRow.classList.add(
            "hidden"
        );

    }


    saveCart();

    localStorage.setItem(
        KEY.coupon,
        appliedCoupon
    );
}


/* =====================================================
   CART OPEN / CLOSE
===================================================== */

function openCart() {

    if (cartDrawer) {

        cartDrawer.classList.add(
            "active"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.add(
            "active"
        );

    }

}


function closeCart() {

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "active"
        );

    }


    if (cartOverlay) {

        cartOverlay.classList.remove(
            "active"
        );

    }

}


if (cartButton) {

    cartButton.addEventListener(
        "click",
        openCart
    );

}


if (closeCartButton) {

    closeCartButton.addEventListener(
        "click",
        closeCart
    );

}


if (cartOverlay) {

    cartOverlay.addEventListener(
        "click",
        closeCart
    );

}


/* =====================================================
   FOOD RENDERING
===================================================== */

function renderFoods() {

    if (!foodGrid) return;


    const searchValue =
        searchInput
            ? searchInput.value
                .toLowerCase()
                .trim()
            : "";


    const categoryValue =
        categorySelect
            ? categorySelect.value
            : "all";


    const sortValue =
        sortSelect
            ? sortSelect.value
            : "default";


    let filteredFoods =
        foods.filter(function(food) {

            const matchesSearch =
                food.name
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                categoryValue === "all" ||
                food.category === categoryValue;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    if (sortValue === "low") {

        filteredFoods.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    if (sortValue === "high") {

        filteredFoods.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    if (sortValue === "rating") {

        filteredFoods.sort(
            (a, b) =>
                b.rating - a.rating
        );

    }


    if (filteredFoods.length === 0) {

        foodGrid.innerHTML = `

            <div class="no-orders">

                <div>🔍</div>

                <h3>
                    No Food Found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;
    }


    foodGrid.innerHTML = "";


    filteredFoods.forEach(function(food) {

        foodGrid.innerHTML += `

            <div
                class="food-card"
                data-category="${food.category}">

                <div class="food-image">
                    ${food.emoji}
                </div>


                <div class="food-details">

                    <h3>
                        ${food.name}
                    </h3>

                    <p>
                        ${food.description}
                    </p>

                    <div class="food-rating">
                        ⭐ ${food.rating}
                        • ${food.restaurant}
                    </div>


                    <div class="food-bottom">

                        <strong>
                            ${money(food.price)}
                        </strong>


                        <button
                            type="button"
                            onclick="addToCart(${food.id})">

                            Add to Cart

                        </button>

                    </div>

                </div>

            </div>

        `;

    });

}


/* =====================================================
   SEARCH / FILTER / SORT
===================================================== */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderFoods
    );

}


if (categorySelect) {

    categorySelect.addEventListener(
        "change",
        renderFoods
    );

}


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        renderFoods
    );

}


/* =====================================================
   CATEGORY BUTTONS
===================================================== */

document
    .querySelectorAll(".category")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const category =
                    button.dataset.cat;


                if (categorySelect) {

                    categorySelect.value =
                        category;

                }


                renderFoods();


                const menu =
                    document.getElementById(
                        "menu"
                    );


                if (menu) {

                    menu.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


/* =====================================================
   RESTAURANT MENU BUTTONS
===================================================== */

document
    .querySelectorAll(".restaurant-menu-btn")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const restaurant =
                    button.dataset.restaurant;


                if (restaurant === "Pizza House") {

                    searchInput.value = "";

                    categorySelect.value =
                        "pizza";

                }


                if (restaurant === "Burger Point") {

                    searchInput.value = "";

                    categorySelect.value =
                        "burger";

                }


                if (restaurant === "Apna Kitchen") {

                    searchInput.value = "";

                    categorySelect.value =
                        "indian";

                }


                renderFoods();


                const menu =
                    document.getElementById(
                        "menu"
                    );


                if (menu) {

                    menu.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }
        );

    });


/* =====================================================
   ORDER NOW
===================================================== */

const orderNow =
    document.querySelector(".order-btn");


if (orderNow) {

    orderNow.addEventListener(
        "click",
        function() {

            const menu =
                document.getElementById(
                    "menu"
                );


            if (menu) {

                menu.scrollIntoView({
                    behavior: "smooth"
                });

            }

        }
    );

}


/* =====================================================
   COUPON SYSTEM
===================================================== */

function applyCouponCode(code) {

    const totals =
        calculateCart();


    if (cart.length === 0) {

        showToast(
            "Add food to cart first!"
        );

        return;

    }


    if (code === "WELCOME50") {

        if (totals.subtotal < 399) {

            showToast(
                "WELCOME50 requires ₹399 minimum order."
            );

            return;

        }

    }


    if (code === "FOOD10") {

        if (totals.subtotal < 499) {

            showToast(
                "FOOD10 requires ₹499 minimum order."
            );

            return;

        }

    }


    if (code === "FREEDEL") {

        if (totals.subtotal < 299) {

            showToast(
                "FREEDEL requires ₹299 minimum order."
            );

            return;

        }

    }


    if (
        ![
            "WELCOME50",
            "FOOD10",
            "FREEDEL"
        ].includes(code)
    ) {

        showToast(
            "Invalid coupon code."
        );

        return;

    }


    appliedCoupon = code;

    localStorage.setItem(
        KEY.coupon,
        appliedCoupon
    );


    updateCart();


    const message =
        document.getElementById(
            "coupon-message"
        );


    if (message) {

        message.textContent =
            "Coupon applied successfully ✓";

        message.style.color =
            "#20a045";

    }


    showToast(
        code + " applied 🎉"
    );

}


const applyCouponButton =
    document.getElementById(
        "apply-coupon"
    );


if (applyCouponButton) {

    applyCouponButton.addEventListener(
        "click",
        function() {

            const input =
                document.getElementById(
                    "coupon-input"
                );


            const code =
                input.value
                    .trim()
                    .toUpperCase();


            applyCouponCode(code);

        }
    );

}


document
    .querySelectorAll(".coupon-card")
    .forEach(function(button) {

        button.addEventListener(
            "click",
            function() {

                const code =
                    button.dataset.coupon;


                const input =
                    document.getElementById(
                        "coupon-input"
                    );


                if (input) {

                    input.value = code;

                }


                openCart();


                applyCouponCode(code);

            }
        );

    });
/* =====================================================
   CHECKOUT
===================================================== */

function showCheckout() {

    if (cart.length === 0) {

        showToast(
            "Your cart is empty!"
        );

        return;

    }


    if (checkoutSection) {

        checkoutSection.classList.add(
            "active"
        );

    }


    closeCart();


    updateCheckoutSummary();

}


function updateCheckoutSummary() {

    const summary =
        document.getElementById(
            "checkout-summary"
        );


    if (!summary) return;


    const totals =
        calculateCart();


    let itemsHTML = "";


    cart.forEach(function(item) {

        itemsHTML += `

            <div style="
                display:flex;
                justify-content:space-between;
                margin:7px 0;
            ">

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ${money(
                        item.price *
                        item.quantity
                    )}
                </strong>

            </div>

        `;

    });


    summary.innerHTML = `

        ${itemsHTML}

        <hr style="margin:12px 0;border:none;border-top:1px solid #ddd;">

        <div style="
            display:flex;
            justify-content:space-between;
        ">

            <strong>
                Total
            </strong>

            <strong>
                ${money(totals.total)}
            </strong>

        </div>

    `;

}


if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        showCheckout
    );

}


if (backToCart) {

    backToCart.addEventListener(
        "click",
        function() {

            checkoutSection.classList.remove(
                "active"
            );

            openCart();

        }
    );

}


/* =====================================================
   PAYMENT EXTRA FIELDS
===================================================== */

const paymentInputs =
    document.querySelectorAll(
        'input[name="payment"]'
    );


function updatePaymentFields() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    const paymentExtra =
        document.getElementById(
            "payment-extra"
        );


    if (!selected || !paymentExtra)
        return;


    if (selected.value === "upi") {

        paymentExtra.innerHTML = `

            <input
                type="text"
                id="upi-id"
                placeholder="Enter UPI ID"
            >

        `;

    } else if (selected.value === "card") {

        paymentExtra.innerHTML = `

            <input
                type="text"
                id="card-number"
                placeholder="Card Number"
                maxlength="16"
            >

            <input
                type="text"
                id="card-name"
                placeholder="Name on Card"
            >

            <input
                type="text"
                id="card-expiry"
                placeholder="MM/YY"
                maxlength="5"
            >

        `;

    } else {

        paymentExtra.innerHTML = "";

    }

}


paymentInputs.forEach(
    function(input) {

        input.addEventListener(
            "change",
            updatePaymentFields
        );

    }
);


/* =====================================================
   PLACE ORDER
===================================================== */

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            if (cart.length === 0) {

                showToast(
                    "Your cart is empty!"
                );

                return;

            }


            const name =
                document
                    .getElementById(
                        "customer-name"
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        "customer-phone"
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        "customer-address"
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        "customer-city"
                    )
                    .value
                    .trim();


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (
                !name ||
                !phone ||
                !address ||
                !city
            ) {

                showToast(
                    "Please fill all details."
                );

                return;

            }


            if (
                !/^[0-9]{10}$/.test(phone)
            ) {

                showToast(
                    "Enter a valid 10-digit mobile number."
                );

                return;

            }


            if (!payment) {

                showToast(
                    "Select a payment method."
                );

                return;

            }


            /* UPI validation */

            if (
                payment.value === "upi"
            ) {

                const upi =
                    document
                        .getElementById(
                            "upi-id"
                        );


                if (
                    !upi ||
                    !upi.value.trim()
                ) {

                    showToast(
                        "Enter your UPI ID."
                    );

                    return;

                }
            }/* Card validation */

            if (
                payment.value === "card"
            ) {

                const cardNumber =
                    document
                        .getElementById(
                            "card-number"
                        );


                const cardName =
                    document
                        .getElementById(
                            "card-name"
                        );


                const cardExpiry =
                    document
                        .getElementById(
                            "card-expiry"
                        );


                if (
                    !cardNumber ||
                    !/^[0-9]{16}$/.test(
                        cardNumber.value.trim()
                    )
                ) {

                    showToast(
                        "Enter a valid 16-digit card number."
                    );

                    return;

                }


                if (
                    !cardName ||
                    !cardName.value.trim()
                ) {

                    showToast(
                        "Enter card holder name."
                    );

                    return;

                }


                if (
                    !cardExpiry ||
                    !cardExpiry.value.trim()
                ) {

                    showToast(
                        "Enter card expiry."
                    );

                    return;

                }

            }


            const totals =
                calculateCart();


            const orderId =
                "AF" +
                Date.now()
                    .toString()
                    .slice(-8);


            const orderDate =
                new Date()
                    .toLocaleString(
                        "en-IN"
                    );


            const orderItems =
                cart.map(function(item) {

                    return {

                        id: item.id,

                        name: item.name,

                        quantity:
                            item.quantity,

                        price:
                            item.price,

                        restaurant:
                            item.restaurant,

                        emoji:
                            item.emoji

                    };

                });


            const newOrder = {

                id: orderId,

                date: orderDate,

                customer: name,

                phone: phone,

                address: address,

                city: city,

                payment:
                    payment.value,

                coupon:
                    appliedCoupon,

                subtotal:
                    totals.subtotal,

                delivery:
                    totals.delivery,

                discount:
                    totals.discount,

                total:
                    totals.total,

                items:
                    orderItems,

                status:
                    "Preparing"

            };


            orders.unshift(
                newOrder
            );


            saveOrders();


            document
                .getElementById(
                    "order-id"
                )
                .textContent =
                orderId;


            document
                .getElementById(
                    "order-date"
                )
                .textContent =
                orderDate;


            document
                .getElementById(
                    "order-amount"
                )
                .textContent =
                money(totals.total);


            const confirmation =
                document.getElementById(
                    "order-confirmation"
                );


            if (checkoutSection) {

                checkoutSection.classList.remove(
                    "active"
                );

            }


            closeCart();


            if (confirmation) {

                confirmation.classList.add(
                    "active"
                );

            }


            cart = [];

            appliedCoupon = "";

            localStorage.removeItem(
                KEY.coupon
            );


            updateCart();


            checkoutForm.reset();


            updatePaymentFields();


            showToast(
                "Order placed successfully 🎉"
            );


            startOrderTracking(
                newOrder.id
            );

        }
    );

}
/* =====================================================
   ORDER TRACKING
===================================================== */

function startOrderTracking(orderId) {

    setTimeout(
        function() {

            const order =
                orders.find(
                    function(item) {
                        return item.id === orderId;
                    }
                );


            if (!order) return;


            if (
                order.status ===
                "Preparing"
            ) {

                order.status =
                    "Out for Delivery";


                saveOrders();


                displayOrders();


                updateConfirmationStatus(
                    "Out for Delivery"
                );

            }

        },
        15000
    );


    setTimeout(
        function() {

            const order =
                orders.find(
                    function(item) {
                        return item.id === orderId;
                    }
                );


            if (!order) return;


            if (
                order.status ===
                "Out for Delivery"
            ) {

                order.status =
                    "Delivered";


                saveOrders();


                displayOrders();


                updateConfirmationStatus(
                    "Delivered"
                );

            }

        },
        35000
    );

}


function restartTracking() {

    orders.forEach(
        function(order) {

            if (
                order.status ===
                "Preparing"
            ) {

                startOrderTracking(
                    order.id
                );

            }

        }
    );

}


function updateConfirmationStatus(
    status
) {

    const statusElement =
        document.querySelector(
            ".order-status"
        );


    if (statusElement) {

        statusElement.textContent =
            status;

    }

}


/* =====================================================
   ORDER HISTORY
===================================================== */

function displayOrders() {

    const ordersList =
        document.getElementById(
            "orders-list"
        );


    if (!ordersList) return;


    if (orders.length === 0) {

        ordersList.innerHTML = `

            <div class="no-orders">

                <div>📦</div>

                <h3>
                    No Orders Yet
                </h3>

                <p>
                    Your previous orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    ordersList.innerHTML = "";


    orders.forEach(
        function(order) {

            let foodHTML = "";


            order.items.forEach(
                function(item) {

                    foodHTML += `

                        <div class="order-food">

                            ${item.emoji || "🍽️"}
                            ${item.name}
                            × ${item.quantity}

                            <span style="float:right">
                                ${money(
                                    item.price *
                                    item.quantity
                                )}
                            </span>

                        </div>

                    `;

                }
            );


            const preparingActive =
                true;


            const deliveryActive =
                order.status ===
                    "Out for Delivery" ||
                order.status ===
                    "Delivered";


            const deliveredActive =
                order.status ===
                "Delivered";


            let deliveryText =
                "25–35 min";


            if (
                order.status ===
                "Out for Delivery"
            ) {

                deliveryText =
                    "10–15 min";

            }


            if (
                order.status ===
                "Delivered"
            ) {

                deliveryText =
                    "Delivered";

            }


            ordersList.innerHTML += `

                <div class="order-card">

                    <div class="order-card-header">

                        <div>

                            <div class="order-id">
                                ${order.id}
                            </div>

                            <small>
                                ${order.date}
                            </small>

                        </div>


                        <span class="history-status">

                            ${order.status}

                        </span>

                    </div>


                    ${foodHTML}


                    <div class="order-total">

                        Total:
                        ${money(order.total)}

                    </div>


                    <div class="order-delivery-time">

                        Estimated Delivery:
                        ${deliveryText}

                    </div>


                    <div class="order-progress">


                        <div class="
                            progress-step
                            ${preparingActive
                                ? "active"
                                : ""}
                        ">

                            <div class="progress-dot">
                            </div>

                            Preparing

                        </div>


                        <div class="
                            progress-step
                            ${deliveryActive
                                ? "active"
                                : ""}
                        ">

                            <div class="progress-dot">
                            </div>

                            Out for Delivery

                        </div>


                        <div class="
                            progress-step
                            ${deliveredActive
                                ? "active"
                                : ""}
                        ">

                            <div class="progress-dot">
                            </div>

                            Delivered

                        </div>

                    </div>

                </div>

            `;

        }
    );

}
/* =====================================================
   ORDER HISTORY BUTTONS
===================================================== */

const viewOrdersButton =
    document.getElementById(
        "view-orders-btn"
    );


if (viewOrdersButton) {

    viewOrdersButton.addEventListener(
        "click",
        function() {

            const confirmation =
                document.getElementById(
                    "order-confirmation"
                );


            const history =
                document.getElementById(
                    "order-history"
                );


            if (confirmation) {

                confirmation.classList.remove(
                    "active"
                );

            }


            if (history) {

                history.classList.add(
                    "active"
                );

            }


            displayOrders();

        }
    );

}


const continueShoppingButton =
    document.getElementById(
        "continue-shopping-btn"
    );


if (continueShoppingButton) {

    continueShoppingButton.addEventListener(
        "click",
        function() {

            const confirmation =
                document.getElementById(
                    "order-confirmation"
                );


            if (confirmation) {

                confirmation.classList.remove(
                    "active"
                );

            }


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


const backHomeFromOrders =
    document.getElementById(
        "back-home-from-orders"
    );


if (backHomeFromOrders) {

    backHomeFromOrders.addEventListener(
        "click",
        function() {

            const history =
                document.getElementById(
                    "order-history"
                );


            if (history) {

                history.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* =====================================================
   LOGIN / REGISTER
===================================================== */

const loginButton =
    document.getElementById(
        "login-btn"
    );


const closeAuth =
    document.getElementById(
        "close-auth"
    );


const showLogin =
    document.getElementById(
        "show-login"
    );


const showRegister =
    document.getElementById(
        "show-register"
    );


const loginForm =
    document.getElementById(
        "login-form"
    );


const registerForm =
    document.getElementById(
        "register-form"
    );


function openAuth() {

    if (authModal) {

        authModal.classList.add(
            "active"
        );

    }

}


function closeAuthModal() {

    if (authModal) {

        authModal.classList.remove(
            "active"
        );

    }

}


function switchAuth(type) {

    if (!loginForm ||
        !registerForm ||
        !showLogin ||
        !showRegister
    ) return;


    if (type === "login") {

        loginForm.classList.remove(
            "hidden"
        );

        registerForm.classList.add(
            "hidden"
        );

        showLogin.classList.add(
            "active"
        );

        showRegister.classList.remove(
            "active"
        );

    } else {

        loginForm.classList.add(
            "hidden"
        );

        registerForm.classList.remove(
            "hidden"
        );

        showLogin.classList.remove(
            "active"
        );

        showRegister.classList.add(
            "active"
        );

    }

}


if (loginButton) {

    loginButton.addEventListener(
        "click",
        function() {

            if (currentUser) {

                openProfile();

            } else {

                openAuth();

            }

        }
    );

}


if (closeAuth) {

    closeAuth.addEventListener(
        "click",
        closeAuthModal
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        function() {

            switchAuth("login");

        }
    );

}


if (showRegister) {

    showRegister.addEventListener(
        "click",
        function() {

            switchAuth("register");

        }
    );

}


/* =====================================================
   REGISTER
===================================================== */

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "register-name"
                    )
                    .value
                    .trim();


            const email =
                document
                    .getElementById(
                        "register-email"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const phone =
                document
                    .getElementById(
                        "register-phone"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "register-password"
                    )
                    .value;


            if (
                !/^[0-9]{10}$/.test(phone)
            ) {

                showToast(
                    "Enter valid 10-digit mobile number."
                );

                return;

            }


            const exists =
                users.some(
                    function(user) {
                        return user.email === email;
                    }
                );


            if (exists) {

                showToast(
                    "Email already registered."
                );

                return;

            }


            const newUser = {

                id:
                    Date.now(),

                name:
                    name,

                email:
                    email,

                phone:
                    phone,

                password:
                    password

            };


            users.push(
                newUser
            );


            saveUsers();


            currentUser = {

                id:
                    newUser.id,

                name:
                    newUser.name,

                email:
                    newUser.email,

                phone:
                    newUser.phone

            };


            localStorage.setItem(
                KEY.currentUser,
                JSON.stringify(
                    currentUser
                )
            );


            registerForm.reset();


            closeAuthModal();


            updateUserUI();


            showToast(
                "Account created successfully 🎉"
            );

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById(
                        "login-email"
                    )
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById(
                        "login-password"
                    )
                    .value;


            const user =
                users.find(
                    function(item) {

                        return (
                            item.email === email &&
                            item.password === password
                        );

                    }
                );


            if (!user) {

                showToast(
                    "Invalid email or password."
                );

                return;

            }


            currentUser = {

                id:
                    user.id,

                name:
                    user.name,

                email:
                    user.email,

                phone:
                    user.phone

            };


            localStorage.setItem(
                KEY.currentUser,
                JSON.stringify(
                    currentUser
                )
            );


            loginForm.reset();


            closeAuthModal();


            updateUserUI();


            showToast(
                "Login successful 👋"
            );

        }
    );

}


/* =====================================================
   USER UI
===================================================== */

function updateUserUI() {

    const greeting =
        document.getElementById(
            "user-greeting"
        );


    if (
        currentUser &&
        greeting
    ) {

        greeting.textContent =
            "Hi, " +
            currentUser.name;

    } else if (greeting) {

        greeting.textContent = "";

    }


    if (loginButton) {

        loginButton.textContent =
            currentUser
                ? "Profile"
                : "Login";

    }

}
/* =====================================================
   PROFILE
===================================================== */

const profileButton =
    document.getElementById(
        "nav-profile"
    );


const closeProfile =
    document.getElementById(
        "close-profile"
    );


const logoutButton =
    document.getElementById(
        "logout-btn"
    );


function openProfile() {

    if (!currentUser) {

        openAuth();

        return;

    }


    const content =
        document.getElementById(
            "profile-content"
        );


    if (content) {

        content.innerHTML = `

            <div class="profile-info">

                <p>
                    <strong>
                        Name:
                    </strong>

                    ${currentUser.name}
                </p>


                <p>
                    <strong>
                        Email:
                    </strong>

                    ${currentUser.email}
                </p>


                <p>
                    <strong>
                        Mobile:
                    </strong>

                    ${currentUser.phone}
                </p>

            </div>

        `;

    }


    if (profileModal) {

        profileModal.classList.add(
            "active"
        );

    }

}


if (profileButton) {

    profileButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            openProfile();

        }
    );

}


if (closeProfile) {

    closeProfile.addEventListener(
        "click",
        function() {

            profileModal.classList.remove(
                "active"
            );

        }
    );

}


/* =====================================================
   LOGOUT
===================================================== */

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function() {

            currentUser = null;


            localStorage.removeItem(
                KEY.currentUser
            );


            if (profileModal) {

                profileModal.classList.remove(
                    "active"
                );

            }


            updateUserUI();


            showToast(
                "Logged out successfully."
            );

        }
    );

}


/* =====================================================
   NAV ORDERS
===================================================== */

const navOrders =
    document.getElementById(
        "nav-orders"
    );


if (navOrders) {

    navOrders.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            const history =
                document.getElementById(
                    "order-history"
                );


            if (history) {

                history.classList.add(
                    "active"
                );

            }


            displayOrders();

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

renderFoods();

updateCart();

updateUserUI();

updatePaymentFields();

displayOrders();

restartTracking();