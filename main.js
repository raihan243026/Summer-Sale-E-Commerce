
        document.addEventListener('DOMContentLoaded', () => {
            const productCards       = document.querySelectorAll('.product-card');
            const buyNowButtons      = document.querySelectorAll('.buy-now-btn');
            const applyCouponBtn     = document.getElementById('apply-coupon-btn');
            const makePurchaseBtn    = document.getElementById('make-purchase-btn');
            const couponCodeInput    = document.getElementById('coupon-code');

            const totalPriceSpan     = document.getElementById('total-price');
            const discountAmountSpan = document.getElementById('discount-amount');
            const finalTotalSpan     = document.getElementById('final-total');
            const couponMessageDiv   = document.getElementById('coupon-message');
            const cartItemsList      = document.getElementById('cart-items-list');
            const cartEmptyMessage   = document.getElementById('cart-empty-message');
            const purchaseMessageDiv = document.getElementById('purchase-message');
            const promoCodeCopyBtn   = document.getElementById('promo-code-btn');
            const copyMessageDiv     = document.getElementById('copy-message');

            const PROMO_CODE    = "SELL200";
            const DISCOUNT_RATE = 0.20;
            const MIN_PURCHASE  = 200;

            let cartItems     = [];
            let couponApplied = false;

            const formatPrice = (price) => price.toFixed(2);
            const updateCartAndTotals = () => {
                let total      = cartItems.reduce((sum, item) => sum + item.price, 0);
                let discount   = 0;
                let finalTotal = total;

                if (couponApplied) {
                    if (total >= MIN_PURCHASE) {
                        discount = total * DISCOUNT_RATE;
                        finalTotal = total - discount;
                        couponMessageDiv.className = 'mb-3 small fw-bold text-success';
                        couponMessageDiv.textContent = `20% discount applied! You saved ${formatPrice(discount)} TK.`;
                    } else {
                        discount = 0;
                        couponMessageDiv.className = 'mb-3 small fw-bold text-danger';
                        couponMessageDiv.textContent = `Coupon valid, but requires a minimum purchase of ${MIN_PURCHASE} TK.`;
                    }
                } else {
                    couponMessageDiv.textContent = '';
                }
                
                totalPriceSpan.textContent = formatPrice(total);
                discountAmountSpan.textContent = formatPrice(discount);
                finalTotalSpan.textContent = formatPrice(finalTotal);

                cartItemsList.innerHTML = '';
                if (cartItems.length === 0) {
                    cartItemsList.innerHTML = `<li class="list-group-item d-flex justify-content-between align-items-center py-1 text-muted" id="cart-empty-message">Cart is empty.</li>`;
                    makePurchaseBtn.disabled = true;
                    makePurchaseBtn.classList.remove('btn-success');
                    makePurchaseBtn.classList.add('btn-warning');
                } else {
                    const groupedItems = cartItems.reduce((acc, item) => {
                        acc[item.name] = (acc[item.name] || 0) + 1;
                        return acc;
                    }, {});

                    Object.keys(groupedItems).forEach(name => {
                        const count = groupedItems[name];
                        const itemPrice = cartItems.find(i => i.name === name).price;
                        const itemTotal = count * itemPrice;
                        
                        const listItem = document.createElement('li');
                        listItem.className = 'list-group-item d-flex justify-content-between align-items-center py-1';
                        listItem.innerHTML = `
                            <span>${name} (${itemPrice} TK x ${count})</span>
                            <span class="fw-semibold">${formatPrice(itemTotal)} TK</span>
                        `;
                        cartItemsList.appendChild(listItem);
                    });

                    makePurchaseBtn.disabled = false;
                    makePurchaseBtn.classList.add('btn-success');
                    makePurchaseBtn.classList.remove('btn-warning');
                }
            };

            buyNowButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const card = event.target.closest('.product-card');
                    const name = card.getAttribute('data-name');
                    const price = parseFloat(card.getAttribute('data-price'));

                    cartItems.push({ name, price });

                    button.textContent = 'Added!';
                    button.classList.add('btn-success');
                    button.classList.remove('btn-buy-now');
                    setTimeout(() => {
                        button.textContent = 'Buy Now';
                        button.classList.add('btn-buy-now');
                        button.classList.remove('btn-success');
                    }, 500);

                    updateCartAndTotals();
                });
            });

            applyCouponBtn.addEventListener('click', () => {
                const enteredCode = couponCodeInput.value.toUpperCase().trim();
                
                if (enteredCode === PROMO_CODE) {
                    couponApplied = true;
                } else {
                    couponApplied = false;
                    couponMessageDiv.className = 'mb-3 small fw-bold text-danger';
                    couponMessageDiv.textContent = 'Invalid promo code.';
                }
                updateCartAndTotals();
            });

            makePurchaseBtn.addEventListener('click', () => {
                purchaseMessageDiv.textContent = `Successfully purchased ${formatPrice(parseFloat(finalTotalSpan.textContent))} TK worth of items!`;
                purchaseMessageDiv.style.opacity = '1';
                
                setTimeout(() => {
                    cartItems = [];
                    couponApplied = false;
                    couponCodeInput.value = '';
                    purchaseMessageDiv.style.opacity = '0';
                    updateCartAndTotals();
                }, 2500);
            });

            promoCodeCopyBtn.addEventListener('click', () => {
                const promoCode = promoCodeCopyBtn.textContent.trim();
                const tempInput = document.createElement('input');
                tempInput.value = promoCode;
                document.body.appendChild(tempInput);
                tempInput.select();
                try {
                    document.execCommand('copy');
                    copyMessageDiv.style.opacity = '1';
                    setTimeout(() => copyMessageDiv.style.opacity = '0', 1500);
                } catch (err) {
                    console.error('Could not copy text: ', err);
                }
                document.body.removeChild(tempInput);
            });

            updateCartAndTotals();
        });
    