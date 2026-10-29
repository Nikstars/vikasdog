// Валидация на формуляра за резервация на кученце

var messages = {
    bg: {
        required: "Това поле е задължително.",
        name: "Използвайте само букви (от 2 до 30 символа).",
        email: "Въведете валиден имейл адрес, например ivan@mail.bg.",
        phone: "Въведете валиден телефон, например 0893 416 137.",
        datePast: "Изберете дата от днес нататък.",
        dateFar: "Можем да планираме посещение до 6 месеца напред.",
        time: "Посещенията са между 09:00 и 18:00 ч.",
        gender: "Изберете пол на кученцето.",
        color: "Изберете предпочитан цвят.",
        purpose: "Отбележете поне една цел.",
        messageLong: "Съобщението е твърде дълго (максимум 600 символа).",
        password: "Паролата не отговаря на всички изисквания.",
        confirm: "Паролите не съвпадат.",
        terms: "Необходимо е съгласие за обработка на данните.",
        sending: "Изпращане...",
        submit: "Изпрати заявката",
        success: "Благодарим Ви! Заявката е изпратена. На Вашия имейл ще получите потвърждение, а ние ще се свържем с Вас, когато котилото се роди.",
        fail: "Възникна проблем при изпращането. Моля, пишете ни на info@vikasdog.com или се обадете на 0893 416 137.",
        invalid: "Моля, коригирайте маркираните полета.",
        weak: "Слаба",
        medium: "Средна",
        strong: "Силна"
    },
    en: {
        required: "This field is required.",
        name: "Use letters only (2 to 30 characters).",
        email: "Enter a valid email address, e.g. john@mail.com.",
        phone: "Enter a valid phone number, e.g. +359 893 416 137.",
        datePast: "Choose a date from today onwards.",
        dateFar: "We can schedule visits up to 6 months ahead.",
        time: "Visits are between 09:00 and 18:00.",
        gender: "Choose the puppy's sex.",
        color: "Choose a preferred colour.",
        purpose: "Tick at least one purpose.",
        messageLong: "The message is too long (600 characters max).",
        password: "The password does not meet all requirements.",
        confirm: "Passwords do not match.",
        terms: "Please agree to the processing of your data.",
        sending: "Sending...",
        submit: "Send request",
        success: "Thank you! Your request has been sent. You will receive a confirmation email, and we will contact you when the litter is born.",
        fail: "Something went wrong. Please email us at info@vikasdog.com or call +359 893 416 137.",
        invalid: "Please correct the highlighted fields.",
        weak: "Weak",
        medium: "Medium",
        strong: "Strong"
    }
};

// Данни от профила в EmailJS (emailjs.com) – услугата изпраща заявката
// на info@vikasdog.com и автоматичен отговор до клиента
var EMAILJS = {
    serviceId: "service_h4vs7zj",
    templateId: "template_ho3kpjr",
    publicKey: "chs-id8hOJ7lwSzX7"
};

var lang = document.documentElement.lang === "en" ? "en" : "bg";
var text = messages[lang];

var form = document.getElementById("reservationForm");
var statusBox = document.getElementById("formStatus");
var submitButton = document.getElementById("submitButton");

// Регулярни изрази за проверка
var namePattern = /^[A-Za-zА-Яа-яЁё]+([ -][A-Za-zА-Яа-яЁё]+)*$/;
var emailPattern = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
var phonePattern = /^\+?[0-9]{8,15}$/;

// Правилата за сигурна парола
var passwordRules = {
    length: /.{8,}/,
    upper: /[A-ZА-Я]/,
    lower: /[a-zа-я]/,
    digit: /[0-9]/,
    symbol: /[^A-Za-zА-Яа-я0-9]/
};

// Показва или изчиства грешката под дадено поле
function setError(field, message) {
    var box = document.getElementById(field + "Field");
    var errorText = document.getElementById(field + "Error");

    if (message) {
        box.classList.add("invalid");
        box.classList.remove("valid");
        errorText.textContent = message;
        return false;
    }

    box.classList.remove("invalid");
    box.classList.add("valid");
    errorText.textContent = "";
    return true;
}

function checkName(field) {
    var value = document.getElementById(field).value.trim();

    if (value === "") {
        return setError(field, text.required);
    }
    if (value.length < 2 || value.length > 30 || !namePattern.test(value)) {
        return setError(field, text.name);
    }
    return setError(field, "");
}

function checkEmail() {
    var value = document.getElementById("email").value.trim();

    if (value === "") {
        return setError("email", text.required);
    }
    if (!emailPattern.test(value)) {
        return setError("email", text.email);
    }
    return setError("email", "");
}

function checkPhone() {
    // премахваме интервали, тирета и скоби преди проверката
    var value = document.getElementById("phone").value.replace(/[\s()-]/g, "");

    if (value === "") {
        return setError("phone", text.required);
    }
    if (!phonePattern.test(value)) {
        return setError("phone", text.phone);
    }
    return setError("phone", "");
}

function checkDate() {
    var value = document.getElementById("visitDate").value;

    if (value === "") {
        return setError("visitDate", text.required);
    }

    var chosen = new Date(value + "T00:00:00");
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 6);

    if (chosen < today) {
        return setError("visitDate", text.datePast);
    }
    if (chosen > maxDate) {
        return setError("visitDate", text.dateFar);
    }
    return setError("visitDate", "");
}

function checkTime() {
    var value = document.getElementById("visitTime").value;

    if (value === "") {
        return setError("visitTime", text.required);
    }
    if (value < "09:00" || value > "18:00") {
        return setError("visitTime", text.time);
    }
    return setError("visitTime", "");
}

function checkGender() {
    var checked = form.querySelector('input[name="gender"]:checked');
    return setError("gender", checked ? "" : text.gender);
}

function checkColor() {
    var value = document.getElementById("color").value;
    return setError("color", value === "" ? text.color : "");
}

function checkPurpose() {
    var checked = form.querySelectorAll('input[name="purpose"]:checked');
    return setError("purpose", checked.length === 0 ? text.purpose : "");
}

function checkMessage() {
    var value = document.getElementById("message").value;
    document.getElementById("messageCount").textContent = value.length;
    return setError("message", value.length > 600 ? text.messageLong : "");
}

// Отбелязва изпълнените правила и връща броя им
function updatePasswordRules(value) {
    var passed = 0;

    for (var rule in passwordRules) {
        var item = document.getElementById("rule-" + rule);
        var ok = passwordRules[rule].test(value);
        item.classList.toggle("ok", ok);
        if (ok) {
            passed++;
        }
    }

    updateStrength(value === "" ? 0 : passed);
    return passed;
}

function checkPassword() {
    var value = document.getElementById("password").value;
    var passed = updatePasswordRules(value);

    if (value === "") {
        return setError("password", text.required);
    }
    if (passed < 5) {
        return setError("password", text.password);
    }
    return setError("password", "");
}

// Цветна лента, която показва колко сигурна е паролата
function updateStrength(passed) {
    var bar = document.getElementById("strengthBar");
    var label = document.getElementById("strengthLabel");
    var percent = passed * 20;
    var color = "#e9877a";
    var word = text.weak;

    if (passed >= 5) {
        color = "#94cf9f";
        word = text.strong;
    } else if (passed >= 3) {
        color = "#e4cc97";
        word = text.medium;
    }

    bar.style.width = percent + "%";
    bar.style.backgroundColor = color;
    label.textContent = passed === 0 ? "" : word;
}

function checkConfirm() {
    var password = document.getElementById("password").value;
    var confirm = document.getElementById("confirmPassword").value;

    if (confirm === "") {
        return setError("confirmPassword", text.required);
    }
    if (confirm !== password) {
        return setError("confirmPassword", text.confirm);
    }
    return setError("confirmPassword", "");
}

function checkTerms() {
    var checked = document.getElementById("terms").checked;
    return setError("terms", checked ? "" : text.terms);
}

// Кои функции проверяват кое поле
var checks = {
    firstName: function () { return checkName("firstName"); },
    lastName: function () { return checkName("lastName"); },
    email: checkEmail,
    phone: checkPhone,
    visitDate: checkDate,
    visitTime: checkTime,
    color: checkColor,
    message: checkMessage,
    password: checkPassword,
    confirmPassword: checkConfirm,
    terms: checkTerms
};

// Проверка при напускане на поле и при писане след първата грешка
Object.keys(checks).forEach(function (id) {
    var input = document.getElementById(id);

    input.addEventListener("blur", checks[id]);
    input.addEventListener("input", function () {
        if (document.getElementById(id + "Field").classList.contains("invalid") || id === "message") {
            checks[id]();
        } else if (id === "password") {
            updatePasswordRules(input.value);
        }
    });
});

form.querySelectorAll('input[name="gender"]').forEach(function (radio) {
    radio.addEventListener("change", checkGender);
});

form.querySelectorAll('input[name="purpose"]').forEach(function (box) {
    box.addEventListener("change", checkPurpose);
});

// Най-ранната дата в календара е днешната
var todayValue = new Date();
todayValue.setMinutes(todayValue.getMinutes() - todayValue.getTimezoneOffset());
document.getElementById("visitDate").min = todayValue.toISOString().slice(0, 10);

// Бутонът „Изчисти“ премахва и съобщенията за грешки
form.addEventListener("reset", function () {
    form.querySelectorAll(".field").forEach(function (field) {
        field.classList.remove("valid", "invalid");
    });
    form.querySelectorAll(".error-msg").forEach(function (error) {
        error.textContent = "";
    });
    form.querySelectorAll(".password-rules li").forEach(function (rule) {
        rule.classList.remove("ok");
    });
    updateStrength(0);
    document.getElementById("messageCount").textContent = "0";
    statusBox.className = "form-status";
});

function validateForm() {
    var results = [
        checks.firstName(),
        checks.lastName(),
        checkEmail(),
        checkPhone(),
        checkDate(),
        checkTime(),
        checkGender(),
        checkColor(),
        checkPurpose(),
        checkMessage(),
        checkPassword(),
        checkConfirm(),
        checkTerms()
    ];

    return results.indexOf(false) === -1;
}

// Събира данните от формуляра в обект за имейла
function getRequestData() {
    var purposes = [];

    form.querySelectorAll('input[name="purpose"]:checked').forEach(function (box) {
        purposes.push(box.value);
    });

    return {
        language: lang === "en" ? "English" : "Български",
        first_name: document.getElementById("firstName").value.trim(),
        last_name: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        visit_date: document.getElementById("visitDate").value,
        visit_time: document.getElementById("visitTime").value,
        gender: form.querySelector('input[name="gender"]:checked').value,
        color: document.getElementById("color").value,
        purpose: purposes.join(", "),
        message: document.getElementById("message").value.trim()
    };
}

form.addEventListener("submit", function (event) {
    event.preventDefault();
    statusBox.className = "form-status";

    if (!validateForm()) {
        statusBox.textContent = text.invalid;
        statusBox.classList.add("fail");
        form.querySelector(".invalid input, .invalid select, .invalid textarea").focus();
        return;
    }

    // Скритото поле се попълва само от спам ботове
    if (document.getElementById("website").value !== "") {
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = text.sending;

    // Паролата не се изпраща – тя се проверява само в браузъра
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: EMAILJS.serviceId,
            template_id: EMAILJS.templateId,
            user_id: EMAILJS.publicKey,
            template_params: getRequestData()
        })
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error(response.status);
            }
            form.reset();
            statusBox.textContent = text.success;
            statusBox.classList.add("success");
        })
        .catch(function () {
            statusBox.textContent = text.fail;
            statusBox.classList.add("fail");
        })
        .finally(function () {
            submitButton.disabled = false;
            submitButton.textContent = text.submit;
        });
});
