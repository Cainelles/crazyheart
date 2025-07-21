// focus the cursor on the email-address input
const emailField = document.getElementById("email-address-input");
emailField.focus({
  preventScroll: true,
});

 // Adiciona o efeito de destaque ao item mais central
  document.querySelectorAll('.pro-collection').forEach(container => {
    const updateZoom = () => {
      const center = container.scrollLeft + container.offsetWidth / 2;
      container.querySelectorAll('.product-cart').forEach(card => {
        const boxCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(center - boxCenter);
        if (distance < card.offsetWidth / 2) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    };

    container.addEventListener('scroll', updateZoom);
    window.addEventListener('load', updateZoom);
  });