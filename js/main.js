// Kennel Vikas-Dog – общи скриптове за всички страници

document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("siteHeader");
    var navToggle = document.getElementById("navToggle");
    var mainNav = document.getElementById("mainNav");
    var backToTop = document.getElementById("backToTop");
    var isEnglish = document.documentElement.lang === "en";

    // Мобилно меню
    navToggle.addEventListener("click", function () {
        var isOpen = mainNav.classList.toggle("open");
        navToggle.classList.toggle("open", isOpen);
        header.classList.toggle("menu-open", isOpen);
        navToggle.setAttribute("aria-expanded", isOpen);
    });

    // Фон на заглавната лента и бутон „нагоре“ при скролиране
    function onScroll() {
        var scrolled = window.scrollY > 60;
        header.classList.toggle("scrolled", scrolled);
        backToTop.classList.toggle("show", window.scrollY > 600);
    }

    window.addEventListener("scroll", onScroll);
    onScroll();

    // Текуща година във footer-а
    document.getElementById("year").textContent = new Date().getFullYear();

    // Плавно появяване на секциите
    var revealItems = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add("visible");
        });
    }

    // Галерия с lightbox (само на страницата с изложбата)
    var galleryLinks = document.querySelectorAll(".gallery a");

    if (galleryLinks.length > 0) {
        initLightbox(galleryLinks, isEnglish);
    }
});

function initLightbox(links, isEnglish) {
    var current = 0;
    var lightbox = document.createElement("div");

    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.innerHTML =
        '<button type="button" class="lightbox-close" aria-label="' + (isEnglish ? "Close" : "Затвори") + '">&times;</button>' +
        '<button type="button" class="lightbox-prev" aria-label="' + (isEnglish ? "Previous" : "Предишна") + '">&#8592;</button>' +
        '<figure><img src="" alt=""><figcaption></figcaption></figure>' +
        '<button type="button" class="lightbox-next" aria-label="' + (isEnglish ? "Next" : "Следваща") + '">&#8594;</button>';
    document.body.appendChild(lightbox);

    var image = lightbox.querySelector("img");
    var caption = lightbox.querySelector("figcaption");

    function show(index) {
        // въртене в кръг – след последната снимка идва първата
        current = (index + links.length) % links.length;
        var thumb = links[current].querySelector("img");
        image.src = links[current].getAttribute("href");
        image.alt = thumb.alt;
        caption.textContent = (current + 1) + " / " + links.length + " – " + thumb.alt;
    }

    function open(index) {
        show(index);
        lightbox.classList.add("open");
        document.body.classList.add("no-scroll");
    }

    function close() {
        lightbox.classList.remove("open");
        document.body.classList.remove("no-scroll");
        links[current].focus();
    }

    links.forEach(function (link, index) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            open(index);
        });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", function () {
        show(current - 1);
    });
    lightbox.querySelector(".lightbox-next").addEventListener("click", function () {
        show(current + 1);
    });

    // Клик извън снимката затваря прозореца
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) {
            close();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!lightbox.classList.contains("open")) {
            return;
        }

        switch (event.key) {
            case "Escape":
                close();
                break;
            case "ArrowLeft":
                show(current - 1);
                break;
            case "ArrowRight":
                show(current + 1);
                break;
        }
    });
}
