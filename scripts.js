document.addEventListener('DOMContentLoaded', function () {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.banner-images img');
    const totalSlides = slides.length;
    const bannerImages = document.querySelector('.banner-images');
    let slideInterval;

    // Função para mostrar o slide baseado no índice atual
    function showSlide(index) {
        const slideWidth = slides[0].clientWidth;
        bannerImages.style.transform = `translateX(${-index * slideWidth}px)`;
    }

    // Função para ir para o próximo slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Função para ir para o slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Reiniciar o intervalo para os slides automáticos
    function restartSlideInterval() {
        clearInterval(slideInterval); // Para o intervalo atual
        slideInterval = setInterval(nextSlide, 5000); // Reinicia o intervalo de 5 segundos
    }

    // Evento para os botões de navegação
    document.querySelector('.next').addEventListener('click', () => {
        nextSlide();
        restartSlideInterval(); // Reinicia o intervalo ao clicar
    });

    document.querySelector('.prev').addEventListener('click', () => {
        prevSlide();
        restartSlideInterval(); // Reinicia o intervalo ao clicar
    });

    // Troca automática de slide a cada 5 segundos
    slideInterval = setInterval(nextSlide, 5000);

    // Exibe o primeiro slide ao carregar a página
    showSlide(currentSlide);

    // Atualiza o tamanho dos slides se a janela for redimensionada
    window.addEventListener('resize', () => showSlide(currentSlide));

    // Função para atualizar o contador do carrinho
    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        document.querySelector('.cart-count').textContent = cartItems.length;
    }

    // Função para adicionar um item ao carrinho
    function addToCart(productName, productPrice, productImage, sizes) {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        const newItem = {
            name: productName,
            price: productPrice,
            image: productImage,
            sizes
        };

        cartItems.push(newItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        updateCartCount(); // Atualiza o contador do carrinho

        // Reproduz o som de notificação
        const audio = document.getElementById('add-to-cart-sound');
        audio.currentTime = 0; // Rewind to the start
        audio.play(); // Play the sound
    }
    // Função para limpar o carrinho
    function clearCart() {
        localStorage.removeItem('cartItems'); // Remove o item do localStorage
        updateCartCount(); // Atualiza o contador do carrinho para refletir a limpeza
        alert('Carrinho limpo!'); // Exibe uma mensagem de confirmação (opcional)
    }

    // Modal para seleção de tamanho e quantidade
    const modal = document.getElementById('cartModal');
    const closeModal = document.querySelector('.modal .close');
    let selectedProduct = {};
    let productType = ''; // Variável para armazenar se é "conjunto" ou "plus"

    // Função para abrir o modal
    function openModal(productName, productPrice, productImage, type) {
        selectedProduct = { productName, productPrice, productImage };
        productType = type; // Define o tipo de produto ("conjunto" ou "plus")

        // Atualiza o modal de acordo com o tipo de produto
        if (type === 'conjunto') {
            document.getElementById('size-options-conjunto').style.display = 'block';
            document.getElementById('size-options-plus').style.display = 'none';
        } else if (type === 'plus') {
            document.getElementById('size-options-conjunto').style.display = 'none';
            document.getElementById('size-options-plus').style.display = 'block';
        }

        resetModalFields(); // Redefine os campos do modal
        modal.style.display = 'flex';
    }

    // Função para fechar o modal
    closeModal.onclick = function () {
        modal.style.display = 'none';
    };

    // Evento para fechar o modal ao clicar fora dele
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Evento para o clique no botão "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.getAttribute('data-name');
            const productPrice = this.getAttribute('data-price');
            const productImage = this.getAttribute('data-image');

            // Verificar se o produto é "conjunto" ou "plus"
            if (this.classList.contains('conjunto')) {
                openModal(productName, productPrice, productImage, 'conjunto');
            } else if (this.classList.contains('plus')) {
                openModal(productName, productPrice, productImage, 'plus');
            } else {
                addToCart(productName, productPrice, productImage, {}); // Adicionar diretamente ao carrinho para outros produtos
            }
        });
    });

    // Atualiza o total de quantidade e valida se é maior que 100
    const sizeInputsConjunto = document.querySelectorAll('#size-options-conjunto input[type="number"]');
    const sizeInputsPlus = document.querySelectorAll('#size-options-plus input[type="number"]');
    const totalQuantityEl = document.getElementById('totalQuantity');
    const submitBtn = document.getElementById('submitBtn');

    function updateTotalQuantity() {
        let totalQuantity = 0;
        const sizeInputs = productType === 'conjunto' ? sizeInputsConjunto : sizeInputsPlus;

        sizeInputs.forEach(input => {
            totalQuantity += parseInt(input.value, 10) || 0; // Adiciona um valor padrão de 0
        });

        totalQuantityEl.textContent = `Total: ${totalQuantity}`;

        // Ativa o botão de envio apenas se a quantidade total for maior ou igual a 100
        if (totalQuantity >= 100) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    }

    // Evento para atualizar o total de quantidade ao alterar os inputs
    sizeInputsConjunto.forEach(input => {
        input.addEventListener('input', updateTotalQuantity);
    });

    sizeInputsPlus.forEach(input => {
        input.addEventListener('input', updateTotalQuantity);
    });

    // Função para redefinir os campos do modal
    function resetModalFields() {
        // Para tamanhos conjunto
        const sizeInputsConjunto = document.querySelectorAll('#size-options-conjunto input[type="number"]');
        sizeInputsConjunto.forEach(input => {
            input.value = 0; // Redefine todos os campos de entrada para 0
        });

        // Para tamanhos plus
        const sizeInputsPlus = document.querySelectorAll('#size-options-plus input[type="number"]');
        sizeInputsPlus.forEach(input => {
            input.value = 0; // Redefine todos os campos de entrada para 0
        });

        // Redefine o total exibido
        totalQuantityEl.textContent = 'Total: 0';
        // Desabilita o botão de envio inicialmente
        submitBtn.disabled = true;
    }

    // Lógica para adicionar ao carrinho quando o formulário do modal for enviado
    document.getElementById('cartForm').addEventListener('submit', function (event) {
        event.preventDefault();
        let sizes = {};

        if (productType === 'conjunto') {
            const sizeP = document.getElementById('size-p').value;
            const sizeM = document.getElementById('size-m').value;
            const sizeG = document.getElementById('size-g').value;

            sizes = {
                P: sizeP,
                M: sizeM,
                G: sizeG
            };
        } else if (productType === 'plus') {
            const size48 = document.getElementById('size-48').value;
            const size50 = document.getElementById('size-50').value;
            const size52 = document.getElementById('size-52').value;

            sizes = {
                '48': size48,
                '50': size50,
                '52': size52
            };
        }

        addToCart(
            selectedProduct.productName,
            selectedProduct.productPrice,
            selectedProduct.productImage,
            sizes
        );

        modal.style.display = 'none'; // Fecha o modal após adicionar ao carrinho
    });

    // Atualiza o contador do carrinho ao carregar a página
    updateCartCount();

    // Adiciona o comando clearCart no console
    window.clearCart = clearCart; // Torna a função clearCart acessível no console
});
