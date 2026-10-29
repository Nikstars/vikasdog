// Kennel Vikas-Dog – общи скриптове за всички страници

document.addEventListener("DOMContentLoaded", function () {
    var header = document.getElementById("siteHeader");
    var navToggle = document.getElementById("navToggle");
    var mainNav = document.getElementById("mainNav");
    var backToTop = document.getElementById("backToTop");
    var isEnglish = document.documentElement.lang === "en";
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Тънка златиста лента, която показва докъде е прочетена страницата
    var progress = document.createElement("div");
    progress.className = "scroll-progress";
    document.body.appendChild(progress);

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

        var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (maxScroll > 0 ? window.scrollY / maxScroll : 0) + ")";
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
                    entry.target.querySelectorAll("[data-count]").forEach(function (number) {
                        countUp(number, reduceMotion);
                    });
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

    initRipple();

    if (!reduceMotion) {
        initPageTransitions();
    }
});

// Брояч: числото „нараства“ от 0 до стойността в data-count
function countUp(element, instant) {
    var target = parseInt(element.getAttribute("data-count"), 10);
    var duration = 1600;
    var start = null;

    if (instant) {
        element.textContent = target;
        return;
    }

    function step(time) {
        if (start === null) {
            start = time;
        }
        var progress = Math.min((time - start) / duration, 1);
        // забавяне към края (ease-out)
        var eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.round(target * eased);

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    element.textContent = "0";
    requestAnimationFrame(step);
}

// Вълна от мястото на клика върху всеки бутон
function initRipple() {
    document.querySelectorAll(".btn").forEach(function (button) {
        button.addEventListener("click", function (event) {
            var rect = button.getBoundingClientRect();
            var wave = document.createElement("span");
            wave.className = "ripple";
            wave.style.left = (event.clientX - rect.left) + "px";
            wave.style.top = (event.clientY - rect.top) + "px";
            button.appendChild(wave);
            setTimeout(function () {
                wave.remove();
            }, 700);
        });
    });
}

// Завеса с логото при преминаване към друга страница от сайта
function initPageTransitions() {
    var curtain = document.createElement("div");
    var logo = document.querySelector(".brand img");

    curtain.className = "page-curtain";
    curtain.setAttribute("aria-hidden", "true");
    curtain.innerHTML = '<img src="' + logo.getAttribute("src") + '" alt="">';
    document.body.appendChild(curtain);

    document.querySelectorAll("a[href]").forEach(function (link) {
        link.addEventListener("click", function (event) {
            var href = link.getAttribute("href");
            var isInternalPage = /\.html(#.*)?$/.test(href) && !/^https?:/.test(href);

            // нов раздел, Ctrl/Cmd клик или връзка към котва – без завеса
            if (!isInternalPage || link.target === "_blank" || event.ctrlKey || event.metaKey || event.shiftKey) {
                return;
            }

            event.preventDefault();
            curtain.classList.add("active");
            setTimeout(function () {
                window.location.href = link.href;
            }, 500);
        });
    });

    // при връщане с бутона „Назад“ браузърът може да покаже старата страница – махаме завесата
    window.addEventListener("pageshow", function () {
        curtain.classList.remove("active");
    });
}

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

    // новата снимка се показва плавно, след като се зареди
    image.addEventListener("load", function () {
        image.classList.remove("switching");
    });

    function show(index) {
        // въртене в кръг – след последната снимка идва първата
        current = (index + links.length) % links.length;
        var thumb = links[current].querySelector("img");
        image.classList.add("switching");
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
