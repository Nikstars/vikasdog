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
    initStoryRail();

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

// Странична лента с главите на началната страница
function initStoryRail() {
    var rail = document.getElementById("storyRail");

    if (!rail || !("IntersectionObserver" in window)) {
        return;
    }

    var links = rail.querySelectorAll("a");
    var chapters = [];

    links.forEach(function (link) {
        chapters.push(document.querySelector(link.getAttribute("href")));
    });

    // активна е главата, която минава през средата на екрана
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var index = chapters.indexOf(entry.target);
                links.forEach(function (link, i) {
                    link.classList.toggle("active", i === index);
                });
            }
        });
    }, { rootMargin: "-45% 0px -54% 0px" });

    chapters.forEach(function (chapter) {
        observer.observe(chapter);
    });

    // лентата се показва след началния екран, а линията се запълва до текущата глава
    function update() {
        var first = chapters[0].getBoundingClientRect().top + window.scrollY;
        var last = chapters[chapters.length - 1].getBoundingClientRect().top + window.scrollY;
        var middle = window.scrollY + window.innerHeight / 2;
        var progress = Math.min(Math.max((middle - first) / (last - first), 0), 1);

        rail.classList.toggle("show", window.scrollY > window.innerHeight * 0.6);
        rail.style.setProperty("--progress", progress);
    }

    window.addEventListener("scroll", update);
    update();
}

// Отпечатък от лапа: голяма възглавничка и четири пръста
var PAW_SVG = '<svg viewBox="0 0 64 64">' +
    '<path d="M32 60c-10 0-18-5-18-12 0-9 9-17 18-17s18 8 18 17c0 7-8 12-18 12z"/>' +
    '<ellipse cx="11" cy="28" rx="6" ry="8" transform="rotate(-25 11 28)"/>' +
    '<ellipse cx="23" cy="15" rx="6.5" ry="9" transform="rotate(-8 23 15)"/>' +
    '<ellipse cx="41" cy="15" rx="6.5" ry="9" transform="rotate(8 41 15)"/>' +
    '<ellipse cx="53" cy="28" rx="6" ry="8" transform="rotate(25 53 28)"/>' +
    '</svg>';

// Следа от лапи през екрана по плавна дъга, сякаш куче минава отляво надясно
function buildPawTrail(curtain) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var count = 9;
    // дъгата е квадратична крива на Безие: начало, контролна точка, край
    var p0 = { x: width * 0.06, y: height * 0.84 };
    var p1 = { x: width * 0.42, y: height * 0.05 };
    var p2 = { x: width * 0.94, y: height * 0.5 };

    // на висок екран (телефон) следата върви нагоре с лека дъга надясно
    if (height > width) {
        p0 = { x: width * 0.18, y: height * 0.94 };
        p1 = { x: width * 1.05, y: height * 0.5 };
        p2 = { x: width * 0.3, y: height * 0.06 };
    }
    // колко встрани от пътя стъпва всяка лапа
    var stride = Math.min(width, height) * 0.018;
    var html = "";

    for (var i = 0; i < count; i++) {
        var t = (i + 0.5) / count;
        var u = 1 - t;
        var x = u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x;
        var y = u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y;
        // посоката на движение в тази точка (производна на кривата)
        var dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
        var dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
        var angle = Math.atan2(dy, dx);
        // лява и дясна лапа се редуват встрани от пътя
        var side = i % 2 === 0 ? -1 : 1;
        x -= Math.sin(angle) * side * stride;
        y += Math.cos(angle) * side * stride;
        var rotation = angle * 180 / Math.PI + 90;

        html += '<span class="paw-step" style="left:' + Math.round(x) + 'px;top:' + Math.round(y) +
            'px;transform:rotate(' + Math.round(rotation) + 'deg)">' +
            PAW_SVG.replace("<svg", '<svg style="animation-delay:' + (i * 60) + 'ms"') + '</span>';
    }

    curtain.innerHTML = html;
}

// Следа от лапи при преминаване към друга страница от сайта
function initPageTransitions() {
    var curtain = document.createElement("div");

    curtain.className = "page-curtain";
    curtain.setAttribute("aria-hidden", "true");
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
            buildPawTrail(curtain);
            curtain.classList.add("active");
            setTimeout(function () {
                window.location.href = link.href;
            }, 800);
        });
    });

    // при връщане с бутона „Назад“ браузърът може да покаже старата страница – махаме следата
    window.addEventListener("pageshow", function () {
        curtain.classList.remove("active");
        curtain.innerHTML = "";
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
