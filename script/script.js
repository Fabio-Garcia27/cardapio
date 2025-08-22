const cardapio = document.getElementById("cardapio") //menu
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")
const contactInput = document.getElementById("contact")
const contactWarn = document.getElementById("contact-warn")

let cart = [];

//Limpar input
function clearinput() {
    addressInput.value = "";
    contactInput.value = "";
}

//abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    clearinput();
    cartModal.style.display = "flex"   //ativar meu carrinho 
})
//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {//desativar meu carrinho
        cartModal.style.display = "none"
    }
})
//botão fechar meu carrinho
closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})
// clicou no carrinho na frente do produto ou no produto
cardapio.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        //Adicionar no carrinho
        addToCart(name, price)

    }
})
// function adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    //Se o item já existe, aumenta a quantidade para + 1
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal();
}
//Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemsContainer.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p class="font-medium">Qtd: ${item.quantity}</p>
                    <p class="font-medium">R$ ${item.price.toFixed(2)}</p>
                    <p class="mt-2"></p>
                </div>
                    <button class="font-medium remove-from-cart-btn" data-name="${item.name}">
                        Remover
                    </button>
            </div>
        `
        //Total do carrinho
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })
    //Mostrar o Total do carrinho
    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    //Mostrar total de itens no carrinho
    cartCounter.innerHTML = cart.length;
}
//Função para identificar item para ser removido do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})
//Função para remover item do carrinho
function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}
//Digitar endereço no carrinho
addressInput.addEventListener("input", function (event) {
    let ainputValue = event.target.value;

    if (ainputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})
//Digitar contato no carrinho
contactInput.addEventListener("input", function (event) {
    let cinputValue = event.target.value;

    if (cinputValue !== "") {
        contactInput.classList.remove("border-red-500")
        contactWarn.classList.add("hidden")
    }
})
//Finalizar o carrinho
checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        //Aviso
        Toastify({
            text: "A Garcia Burguer está fechada!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }

    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    if (contactInput.value === "") {
        contactWarn.classList.remove("hidden")
        contactInput.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para api whats
    const cartItems = cart.map((item) => {
        return (
            ` ${item.name} Quantidade: (${item.quantity}) Preço: R$ ${item.price} /`
        )
    }).join("")
    //Enviar mensagem do pedido em string acima 
    const message = encodeURIComponent(cartItems)
    const phone = "44997220216"
    //Enviar a mensagem do pedido para celular
    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value} Fone: ${contactInput.value}`, "_blank")
    //Limpar o carrinho depois de finalizar o pedido
    cart = [];
    updateCartModal();
    clearinput();
})
//Não aceitar pesdido fora do horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22; //true aberto
}
//Id horário aberto
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
