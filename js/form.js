// Валидация на формуляра за резервация на кученце

var messages = {
    bg: {
        required: "Това поле е задължително.",
        name: "Използвайте само букви (от 2 до 30 символа).",
        email: "Въведете валиден имейл адрес, например ivan@mail.bg.",
        phone: "Въведете валиден телефон, например 0893 416 137.",
        datePast: "Изберете дата от днес нататък.",
        time: "Посещенията са между 09:00 и 18:00 ч.",
        messageLong: "Съобщението е твърде дълго (максимум 600 символа).",
        terms: "Необходимо е съгласие за обработка на данните.",
        sending: "Изпращане...",
        submit: "Изпрати заявката",
        success: "Благодарим Ви! Заявката е изпратена. На Вашия имейл ще получите потвърждение, а ние ще се свържем с Вас, когато котилото се роди.",
        fail: "Възникна проблем при изпращането. Моля, пишете ни на info@vikasdog.com или се обадете на 0893 416 137.",
        invalid: "Моля, коригирайте маркираните полета.",
        any: "Без значение"
    },
    en: {
        required: "This field is required.",
        name: "Use letters only (2 to 30 characters).",
        email: "Enter a valid email address, e.g. john@mail.com.",
        phone: "Enter a valid phone number, e.g. +359 893 416 137.",
        datePast: "Choose a date from today onwards.",
        time: "Visits are between 09:00 and 18:00.",
        messageLong: "The message is too long (600 characters max).",
        terms: "Please agree to the processing of your data.",
        sending: "Sending...",
        submit: "Send request",
        success: "Thank you! Your request has been sent. You will receive a confirmation email, and we will contact you when the litter is born.",
        fail: "Something went wrong. Please email us at info@vikasdog.com or call +359 893 416 137.",
        invalid: "Please correct the highlighted fields.",
        any: "No preference"
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

// Датата и часът на посещението не са задължителни
function checkDate() {
    var value = document.getElementById("visitDate").value;
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    if (value !== "" && new Date(value + "T00:00:00") < today) {
        return setError("visitDate", text.datePast);
    }
    return setError("visitDate", "");
}

function checkTime() {
    var value = document.getElementById("visitTime").value;

    if (value !== "" && (value < "09:00" || value > "18:00")) {
        return setError("visitTime", text.time);
    }
    return setError("visitTime", "");
}

function checkMessage() {
    var value = document.getElementById("message").value;
    document.getElementById("messageCount").textContent = value.length;
    return setError("message", value.length > 600 ? text.messageLong : "");
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
    message: checkMessage,
    terms: checkTerms
};

// Проверка при напускане на поле и при писане след първата грешка
Object.keys(checks).forEach(function (id) {
    var input = document.getElementById(id);

    input.addEventListener("blur", checks[id]);
    input.addEventListener("input", function () {
        if (document.getElementById(id + "Field").classList.contains("invalid") || id === "message") {
            checks[id]();
        }
    });
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
        checkMessage(),
        checkTerms()
    ];

    return results.indexOf(false) === -1;
}

// Събира данните от формуляра в обект за имейла
function getRequestData() {
    var purposes = [];
    var gender = form.querySelector('input[name="gender"]:checked');

    form.querySelectorAll('input[name="purpose"]:checked').forEach(function (box) {
        purposes.push(box.value);
    });

    return {
        language: lang === "en" ? "English" : "Български",
        first_name: document.getElementById("firstName").value.trim(),
        last_name: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        visit_date: document.getElementById("visitDate").value || "–",
        visit_time: document.getElementById("visitTime").value || "–",
        gender: gender ? gender.value : text.any,
        color: document.getElementById("color").value || text.any,
        purpose: purposes.join(", ") || "–",
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
