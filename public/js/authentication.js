let uName = $('#usernameReg');
uName.on('keypress', function (e) {
    let regex = new RegExp("^[a-zA-Z0-9]+$");
    let str = e.key;
    if (regex.test(str)) {
        return true;
    }

    e.preventDefault();
    return false;
});

$('#regClick').on('click', function () {
    document.getElementById('loginSection').style.display = "none";
    document.getElementById('loginSection').style.opacity = "0";
    $('#registrationSection').fadeTo(1000, 1, function () {
        document.getElementById('registrationSection').style.display = "block";
    });
});

$('#logClick').on('click', function () {
    document.getElementById('registrationSection').style.display = "none";
    document.getElementById('registrationSection').style.opacity = "0";
    $('#loginSection').fadeTo(1000, 1, function () {
        document.getElementById('loginSection').style.display = "block";
    });
});

let register_attempt = 0;

// noinspection JSUnusedGlobalSymbols
function register() {
    $(':button').prop('disabled', true);
    setTimeout(function () {
        $(':button').prop('disabled', false);
    }, 3000);
    let now = Date.now();
    if (now - register_attempt < 3000) {
        return;
    }
    register_attempt = now;
    if (document.getElementById("g-recaptcha-response").value) {
        if (document.getElementById('tos').checked) {
            if (document.getElementById('passwordReg').value === document.getElementById('passwordRegConfirm').value) {
                $.ajax({
                    type: "POST",
                    url: "/regAuth",
                    data: {
                        username: uName.val(),
                        password: $('#passwordReg').val(),
                        email: $('#emailReg').val(),
                        gender: $('#gender option:selected').val(),
                        captchaResponse: $('#g-recaptcha-response').val(),
                        ref: $('#referralReg').val()
                    },
                    success: function () {
                        $('#usernameLogin').val(uName.val());
                        $('#passwordLogin').val($('#passwordReg').val());
                        login();
                    },
                    error: function (response) {
                        document.getElementById('regOutput').innerHTML = response.responseText;
                        grecaptcha.reset();
                    },
                }).error(console.log('error'));
            } else {
                document.getElementById('regOutput').innerHTML = "<div class='text-danger'>Passwords do not match!</div>";
            }
        } else {
            document.getElementById('regOutput').innerHTML = "<div class='text-danger'>You must accept the Terms of Service to register.</div>";
        }
    } else {
        document.getElementById('regOutput').innerHTML = "<div class='text-danger'>Invalid reCAPTCHA.</div>";
    }
}

let login_attempt = 0;

function login() {
    $(':button').prop('disabled', true);
    setTimeout(function () {
        $(':button').prop('disabled', false);
    }, 5000);
    let now = Date.now();
    if (now - login_attempt < 5000) {
        return;
    }
    login_attempt = now;
    $.ajax({
        type: "POST",
        url: "/loginAuth",
        data: {
            username: $('#usernameLogin').val(),
            password: $('#passwordLogin').val()
        },
        success: function () {
            window.location.href = '/main';
        },
        error: function (response) {
            document.getElementById('logOutput').innerHTML = response.responseText;
            setTimeout(function() {
                document.getElementById('logOutput').innerHTML = '';
            }, 5000);
        },
    }).error(console.log('error'));
}

function keyup(arg1) {
    if (arg1 === 13) {
        login();
    }
}
