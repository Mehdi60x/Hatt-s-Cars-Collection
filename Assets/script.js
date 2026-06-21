/* ============ Modal focus trap ============ */

function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const openModal = document.querySelector('.modal-overlay.show, .detail-overlay.show');
    if (!openModal) return;
    const focusable = openModal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

document.addEventListener('keydown', trapFocus);

/* ============ Preloader ============ */

window.addEventListener('load', () => {
    const preloader = document.querySelector('#preloader');
    if (preloader) preloader.classList.add('loaded');
});

/* ============ Navigation ============ */

const btnBurger = document.querySelector('#burger-menu');
const menu = document.querySelector('.navigation');
const linkNav = document.querySelectorAll('.navigation a');
const sections = document.querySelectorAll('section');
const nav = document.querySelector('nav');

btnBurger.addEventListener('click', () => {
    menu.classList.toggle('active');
    btnBurger.classList.toggle('bx-x');
});

linkNav.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('active');
        btnBurger.classList.remove('bx-x');
    });
});

window.addEventListener('scroll', () => {
    nav.classList.toggle('active', window.scrollY > 0);
});

const scrollActive = () => {
    sections.forEach(section => {
        const top = window.scrollY;
        const offset = section.offsetTop - 150;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        if (!id) return;

        if (top >= offset && top < offset + height) {
            linkNav.forEach(link => {
                link.classList.remove('active');
                const activeLink = document.querySelector(`.navigation a[href*="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            });
        }
    });
};

window.addEventListener('scroll', scrollActive);

/* ============ Reveal on scroll ============ */

const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

/* ============ Animated counters ============ */

const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 1400;
        const start = performance.now();

        const step = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const value = target * progress;
            el.textContent = isDecimal ? (value / 10).toFixed(1) : Math.floor(value);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = isDecimal ? (target / 10).toFixed(1) : target;
            }
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
    });
}, { threshold: 0.4 });

counters.forEach(el => counterObserver.observe(el));

/* ============ Toast ============ */

let toastTimeout;
function showToast(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ============ Back to top ============ */

const backToTop = document.querySelector('#backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 500);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============ Booking modal ============ */

const bookingModal = document.querySelector('#bookingModal');
const modalCar = document.querySelector('.modal-car');
const modalClose = document.querySelector('#modalClose');
const bookingForm = document.querySelector('#bookingForm');

function openBooking(car, price) {
    modalCar.textContent = `${car} — ${price}`;
    bookingModal.classList.add('show');
    document.body.classList.add('no-scroll');
}

function closeModal() {
    bookingModal.classList.remove('show');
    if (!document.querySelector('.detail-overlay.show')) {
        document.body.classList.remove('no-scroll');
    }
}

document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeDetail();
        openBooking(btn.dataset.car, btn.dataset.price);
    });
});

modalClose.addEventListener('click', closeModal);
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeDetail();
    }
    if (productDetail.classList.contains('show')) {
        if (e.key === 'ArrowLeft') showImage(galleryIndex - 1);
        if (e.key === 'ArrowRight') showImage(galleryIndex + 1);
    }
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal();
    bookingForm.reset();
    showToast('Demande envoyée ! Notre équipe vous contactera sous 24h.');
});

/* ============ Product detail overlay ============ */

const productDetail = document.querySelector('#productDetail');
const detailClose = document.querySelector('#detailClose');
const detailMainImg = document.querySelector('#detailMainImg');
const detailThumbs = document.querySelector('#detailThumbs');
const detailTitle = document.querySelector('.detail-title');
const detailYear = document.querySelector('.detail-year');
const detailSpecs = document.querySelector('.detail-specs');
const detailDescription = document.querySelector('.detail-description');
const detailFeatures = document.querySelector('.detail-features');
const detailPrice = document.querySelector('.detail-price');
const detailBookBtn = document.querySelector('.detail-book');

const galleryPrev = document.querySelector('#galleryPrev');
const galleryNext = document.querySelector('#galleryNext');
const galleryCounter = document.querySelector('#galleryCounter');

let galleryImages = [];
let galleryIndex = 0;

function showImage(index) {
    if (!galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[galleryIndex];
    detailMainImg.src = img.src;
    detailMainImg.alt = img.alt;
    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
    detailThumbs.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('active', i === galleryIndex));
}

function openDetail(card) {
    const btn = card.querySelector('.btn-book');
    const data = card.querySelector('.car-detail-data').content;

    detailTitle.textContent = btn.dataset.car;
    detailYear.textContent = card.querySelector('.box p').textContent;
    detailSpecs.innerHTML = card.querySelector('.specs').innerHTML;
    detailDescription.textContent = data.querySelector('.full-description').textContent;
    detailFeatures.innerHTML = data.querySelector('.features').innerHTML;
    detailPrice.innerHTML = card.querySelector('.box-footer h5').innerHTML;
    detailBookBtn.dataset.car = btn.dataset.car;
    detailBookBtn.dataset.price = btn.dataset.price;

    galleryImages = Array.from(data.querySelectorAll('.gallery-imgs img'));
    detailThumbs.innerHTML = '';
    galleryImages.forEach((img, i) => {
        const thumb = document.createElement('div');
        thumb.className = 'thumb';
        thumb.appendChild(img.cloneNode());
        thumb.addEventListener('click', () => showImage(i));
        detailThumbs.appendChild(thumb);
    });
    showImage(0);

    productDetail.classList.add('show');
    document.body.classList.add('no-scroll');
    detailClose.focus();
}

galleryPrev.addEventListener('click', () => showImage(galleryIndex - 1));
galleryNext.addEventListener('click', () => showImage(galleryIndex + 1));

let touchStartX = null;
const mainImgBox = document.querySelector('.detail-main-img');
mainImgBox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
mainImgBox.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) showImage(galleryIndex + (delta < 0 ? 1 : -1));
    touchStartX = null;
});

function closeDetail() {
    productDetail.classList.remove('show');
    if (!bookingModal.classList.contains('show')) {
        document.body.classList.remove('no-scroll');
    }
}

document.querySelectorAll('.box.open-detail').forEach(card => {
    const carName = card.querySelector('.box-info h4')?.textContent || 'ce véhicule';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Découvrir ${carName}`);

    const hint = document.createElement('span');
    hint.className = 'discover-hint';
    hint.innerHTML = "<i class='bx bx-show'></i> Découvrir le véhicule";
    card.querySelector('.box-img').appendChild(hint);

    card.addEventListener('click', () => openDetail(card));
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openDetail(card);
        }
    });
});

detailClose.addEventListener('click', closeDetail);
productDetail.addEventListener('click', (e) => {
    if (e.target === productDetail) closeDetail();
});

detailBookBtn.addEventListener('click', () => {
    closeDetail();
    openBooking(detailBookBtn.dataset.car, detailBookBtn.dataset.price);
});

/* ============ Search form ============ */

const searchForm = document.querySelector('#searchForm');
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Recherche en cours... nous vous recontactons rapidement.');
});

/* ============ Contact form ============ */

const contactForm = document.querySelector('#contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactForm.reset();
    showToast('Message envoyé ! Nous vous répondrons rapidement.');
});

/* ============ Newsletter ============ */

const newsletterForm = document.querySelector('#newsletterForm');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    newsletterForm.reset();
    showToast('Merci pour votre inscription à la newsletter !');
});

/* ============ Fleet card tilt ============ */

document.querySelectorAll('.box.open-detail').forEach(card => {
    const img = card.querySelector('.box-img img');

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        img.style.transform = `scale(1.08) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        img.style.transform = '';
    });
});

/* ============ Fleet filters ============ */

const filterChips = document.querySelectorAll('.filter-chip');
const fleetCards = document.querySelectorAll('.services-container .box');
const resultsCount = document.querySelector('.results-count');

function applyFilter(filter) {
    let visible = 0;
    fleetCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
            visible++;
            card.style.display = '';
            requestAnimationFrame(() => card.classList.remove('filtered-out'));
        } else {
            card.classList.add('filtered-out');
            setTimeout(() => {
                if (card.classList.contains('filtered-out')) card.style.display = 'none';
            }, 280);
        }
    });
    if (resultsCount) {
        resultsCount.textContent = `${visible} véhicule${visible === 1 ? '' : 's'} disponible${visible === 1 ? '' : 's'}`;
    }
}

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => {
            c.classList.remove('active');
            c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        applyFilter(chip.dataset.filter);
    });
});

/* ============ Favorites ============ */

const FAVORITES_KEY = 'hatts-favorites';
const getFavorites = () => JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');

function setFavoriteState(btn, isActive) {
    btn.classList.toggle('active', isActive);
    const icon = btn.querySelector('.bx');
    icon.classList.toggle('bx-heart', !isActive);
    icon.classList.toggle('bxs-heart', isActive);
}

const savedFavorites = getFavorites();
document.querySelectorAll('.favorite-btn').forEach(btn => {
    setFavoriteState(btn, savedFavorites.includes(btn.dataset.car));

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const favorites = getFavorites();
        const car = btn.dataset.car;
        const index = favorites.indexOf(car);
        const isNowActive = index === -1;

        if (isNowActive) {
            favorites.push(car);
            showToast(`${car} ajouté à vos favoris`);
        } else {
            favorites.splice(index, 1);
            showToast(`${car} retiré de vos favoris`);
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        setFavoriteState(btn, isNowActive);
    });
});
