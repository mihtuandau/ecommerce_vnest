export function animateFlyToCart(e: React.MouseEvent, imageUrl: string) {
  // Prevent default just in case
  if (e.preventDefault) e.preventDefault();

  const targetId = "cart-icon";
  const cartElement = document.getElementById(targetId);
  if (!cartElement) return;

  const targetRect = cartElement.getBoundingClientRect();

  // Find the closest image element to the click event
  let sourceElement: Element | null = null;
  const buttonElement = e.currentTarget as HTMLElement;
  const cardElement = buttonElement.closest(".group"); // Find the parent card

  if (cardElement) {
    sourceElement = cardElement.querySelector("img");
  }

  if (!sourceElement) return;

  const sourceRect = sourceElement.getBoundingClientRect();

  // Create a clone of the image
  const clone = document.createElement("img");
  clone.src = imageUrl;
  clone.style.position = "fixed";
  clone.style.top = `${sourceRect.top}px`;
  clone.style.left = `${sourceRect.left}px`;
  clone.style.width = `${sourceRect.width}px`;
  clone.style.height = `${sourceRect.height}px`;
  clone.style.objectFit = "contain";
  clone.style.borderRadius = "50%"; // Make it circular for the flying effect
  clone.style.zIndex = "9999";
  clone.style.transition = "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)"; // Smooth easing
  clone.style.pointerEvents = "none"; // Don't block clicks

  document.body.appendChild(clone);

  // Trigger reflow to ensure the initial state is applied before animating
  clone.getBoundingClientRect();

  // Animate to the cart
  requestAnimationFrame(() => {
    clone.style.top = `${targetRect.top + targetRect.height / 2 - 15}px`; // Center to cart
    clone.style.left = `${targetRect.left + targetRect.width / 2 - 15}px`;
    clone.style.width = "30px";
    clone.style.height = "30px";
    clone.style.opacity = "0.5";
    clone.style.transform = "scale(0.5)";
  });

  // Clean up and trigger cart bounce
  setTimeout(() => {
    clone.remove();
    // Optional: add a little bounce effect to the cart icon
    cartElement.classList.add("scale-110", "text-primary");
    setTimeout(() => {
      cartElement.classList.remove("scale-110", "text-primary");
    }, 200);
  }, 800);
}
