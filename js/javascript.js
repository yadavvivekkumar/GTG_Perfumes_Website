function toggleMenu() {
  var menu = document.getElementById("navMenu");
  var button = document.querySelector(".menu-icon");

  var isOpen = menu.classList.contains("open");

  menu.classList.toggle("open");
  button.setAttribute("aria-expanded", !isOpen);

  // Change icon (bars ↔ close)
  var icon = button.querySelector("i");
  icon.className = isOpen ? "fa-solid fa-bars" : "fa-solid fa-xmark";
}

/* Close menu when pressing ESC */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    var menu = document.getElementById("navMenu");
    var button = document.querySelector(".menu-icon");

    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.querySelector("i").className = "fa-solid fa-bars";
      button.focus();
    }
  }
});


const images = [
  "./assets/perfume 1.webp",
  "./assets/perfume-2.webp",
  "./assets/perfume-3.webp",
  "./assets/perfume-4.webp",
  "./assets/perfume-5.webp"
];

let currentIndex = 0;


const mainImage = document.getElementById("productImage");
const dots = document.querySelectorAll(".dot");
const thumbs = document.querySelectorAll(".thumb");
const prevBtn = document.querySelector(".left");
const nextBtn = document.querySelector(".right");

// Map thumbnail index (0-7) to image index (0-4)
// Thumbs: [P1, P2, P3, P4, P5, P2, P3, P4]
// Images: [P1, P2, P3, P4, P5]
const thumbToImageMap = [0, 1, 2, 3, 4, 1, 2, 3];


function updateCarousel(index) {
  // Ensure index is valid
  if (index < 0 || index >= images.length) return;

  mainImage.src = images[index];

  // Update dots
  dots.forEach(dot => dot.classList.remove("active"));
  if (dots[index]) {
    dots[index].classList.add("active");
  }

  // Update thumbnails - Only highlight the primary thumbnail (0-4)
  thumbs.forEach(thumb => thumb.classList.remove("active"));
  if (thumbs[index]) {
    thumbs[index].classList.add("active");
  }
}

/* NEXT */
nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % images.length;
  updateCarousel(currentIndex);
});

/* PREVIOUS */
prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  updateCarousel(currentIndex);
});

/* DOT CLICK */
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    updateCarousel(index);
  });
});

/* THUMB CLICK */
thumbs.forEach((thumb, index) => {
  thumb.addEventListener("click", () => {
    // Use the map to always get the valid image index
    // Fallback to index if outside map (though map covers all current thumbs)
    const targetImageIndex = thumbToImageMap[index] !== undefined ? thumbToImageMap[index] : index;

    // Safety check if target is valid
    if (targetImageIndex < images.length) {
      currentIndex = targetImageIndex;
      updateCarousel(currentIndex);
    }
  });
});



// --- PRODUCT OPTIONS LOGIC ---

const addToCartBtn = document.getElementById("addToCartBtn");
const subOptions = document.querySelectorAll('input[name="subscription"]');
const cardSingle = document.getElementById("card-single");
const cardDouble = document.getElementById("card-double");

// Inputs
const singleFragOptions = document.querySelectorAll('input[name="fragrance-single"]');
const doubleFrag1Options = document.querySelectorAll('input[name="fragrance-double-1"]');
const doubleFrag2Options = document.querySelectorAll('input[name="fragrance-double-2"]');

function handleSubscriptionChange() {
  let selectedSub = 'single';
  subOptions.forEach(opt => {
    if (opt.checked) selectedSub = opt.value;
  });

  // Toggle Accordions
  if (selectedSub === 'single') {
    if (cardSingle) cardSingle.classList.add('active');
    if (cardDouble) cardDouble.classList.remove('active');
  } else if (selectedSub === 'double') {
    if (cardDouble) cardDouble.classList.add('active');
    if (cardSingle) cardSingle.classList.remove('active');
  }

  updateCartButton();
}

function updateCartButton() {
  let selectedSub = 'single';
  subOptions.forEach(opt => {
    if (opt.checked) selectedSub = opt.value;
  });

  let price = "$99.99";
  let details = "";

  if (selectedSub === 'single') {
    price = "$99.99";

    let frag = 'original';
    singleFragOptions.forEach(opt => { if (opt.checked) frag = opt.value; });

    details = `Type: Single\nFragrance: ${frag}`;

  } else if (selectedSub === 'double') {
    price = "$169.99";

    let frag1 = 'original';
    let frag2 = 'original';

    doubleFrag1Options.forEach(opt => { if (opt.checked) frag1 = opt.value; });
    doubleFrag2Options.forEach(opt => { if (opt.checked) frag2 = opt.value; });

    details = `Type: Double\nFragrance 1: ${frag1}\nFragrance 2: ${frag2}`;
  }

  if (addToCartBtn) {
    addToCartBtn.innerText = `Add to Cart - ${price}`;
    addToCartBtn.onclick = (e) => {
      e.preventDefault();
      alert(`Added to cart:\n${details}\nPrice: ${price}`);
    };
  }
}

// Attach Listeners
subOptions.forEach(opt => {
  opt.addEventListener('change', handleSubscriptionChange);
});

// Attach listeners to all fragrance inputs
const allFragrances = [...singleFragOptions, ...doubleFrag1Options, ...doubleFrag2Options];
allFragrances.forEach(opt => {
  opt.addEventListener('change', updateCartButton);
});

// Initialize on load
handleSubscriptionChange();


const collectionItemHeaders = document.querySelectorAll(".collection-item-header");

collectionItemHeaders.forEach(header => {
  header.addEventListener("click", () => {

    // Close all other accordions
    collectionItemHeaders.forEach(item => {
      if (item !== header) {
        item.classList.remove("active");
        item.nextElementSibling.style.maxHeight = null;
      }
    });

    // Toggle current accordion
    header.classList.toggle("active");
    const body = header.nextElementSibling;

    if (header.classList.contains("active")) {
      body.style.maxHeight = body.scrollHeight + "px";
    } else {
      body.style.maxHeight = null;
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const counters = document.querySelectorAll(".count h1");

  const animateCounter = (counter) => {
    const target = parseInt(counter.innerText);
    let current = 0;

    counter.innerText = "0%";

    const update = () => {
      if (current < target) {
        current++;
        counter.innerText = current + "%";
        requestAnimationFrame(update);
      } else {
        counter.innerText = target + "%";
      }
    };

    update();
  };

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
});