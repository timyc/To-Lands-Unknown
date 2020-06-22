bootbox.setDefaults({
    animate: false
});

let fighting = 0;
let gameName = document.title;

let autotimer;
let autorestart;
let autoing = 0;
let am = 0;
let checkAuto = '';

/*function hideHeader() {
    let detect = document.getElementById('gameHeader').style.display;
    if (detect !== 'none') {
        document.getElementById('gameHeader').style.display = 'none';
        localStorage.setItem('tlu_hideheader', '1');
    } else {
        document.getElementById('gameHeader').style.display = 'block';
        localStorage.setItem('tlu_hideheader', '0');
    }
}

function hideBG() {
    let detect = document.body.style.background;
    if (!detect) {
        document.body.style.background = '#201F22';
        document.getElementsByClassName('navbar')[0].style.background = 'linear-gradient(#3F3D69, #1A1A20)';
        for (let x = 0; x < 12; x++) {
            if (x === 1) {
                continue;
            }
            document.getElementsByClassName('card-body')[x].style.background = 'linear-gradient(#2B2A41, #21212B)';
        }
        localStorage.setItem('tlu_hidebg', '1');
    } else {
        document.body.style.background = null;
        document.getElementsByClassName('navbar')[0].style.background = 'rgba(3, 3, 13, 0.7)';
        for (let x = 0; x < 12; x++) {
            if (x === 1) {
                continue;
            }
            document.getElementsByClassName('card-body')[x].style.background = null;
        }
        localStorage.setItem('tlu_hidebg', '0');
    }
}*/

$(document).on('keypress', function(e) {
    if ($(e.target).closest("input")[0] || $(e.target).closest("textarea")[0]) {
        return;
    }
});

function toCoin(amount) {
    let total = '';
    let platinum = Math.floor(amount / 1000000);
    let gold = Math.floor((amount - (platinum * 1000000)) / 10000);
    let silver = Math.floor((amount - (platinum * 1000000) - (gold * 10000)) / 100);
    let copper = amount - (platinum * 1000000) - (gold * 10000) - (silver * 100);

    if (platinum > 0) {
        total = '<span title="platinum" style="color:#e5e4e2">' + numeral(platinum).format('0,0') + 'p</span> <span title="gold" style="color:#FFD700">' + gold + 'g</span> <span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum === 0 && gold > 0) {
        total = '<span title="gold" style="color:#FFD700">' + gold + 'g</span> <span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum === 0 && gold === 0 && silver > 0) {
        total = '<span title="silver" style="color:#C0C0C0">' + silver + 's</span> <span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    if (platinum === 0 && gold === 0 && silver === 0) {
        total = '<span title="copper" style="color:#b87333">' + copper + 'c</span>';
    }
    return total;
}

function doCheckAuto() {
    $("#mainnav").val("1");
    $("#content").html(checkAuto);
}

// Directly from The Lost Runes
function auto() {
    if (autoing === 0 && timertime <= 0 && timer2time <= 0) {
        autoing = 1;
        $.post("/auto", function(result) {
                if (result > 0) {
                    varstopauto = 0;
                    am = result;
                    let mob = $('#mob').val();
                    let mobname = $('#mob option:selected').text();
                    if (mobname !== '') {
                        let doAuto = function() {
                            let autocheck = 1;
                            $.post("/battle", {
                                        t: am,
                                        mob: mob
                                    },
                                    function(result) {
                                        am--;
                                        if (document.getElementById('bb')) {
                                            document.getElementById('bb').disabled = true;
                                        }
                                        if (document.getElementById('bb2')) {
                                            document.getElementById('bb2').disabled = true;
                                        }
                                        $(".moveBtn").attr("disabled", true);
                                        clearTimeout(timertimeout);
                                        actionprogress = 0;
                                        let xyz = result.split('[BREAK]');
                                        if (document.getElementById('mainnav').options[0].selected === true) {
                                            $("#content").html(xyz[0]);
                                        }
                                        checkAuto = xyz[0];
                                        $('#level').html(numeral(xyz[1]).format('0,0'));
                                        $('#exp').html(xyz[2]);
                                        $('#gold').html(toCoin(xyz[3]));
                                        $('#credits').html(numeral(xyz[4]).format('0,0'));
                                        $('#mithril').html(numeral(xyz[5]).format('0,0'));
                                        $('#health').html(xyz[6]);
                                        $('#attack').html(xyz[7]);
                                        $('#defense').html(xyz[8]);
                                        $('#accuracy').html(xyz[9]);
                                        $('#evasion').html(xyz[10]);
                                    }).always(function(result) {
                                    document.title = '(' + am + ') ' + gameName;
                                    autocheck = 0;
                                    if (am > 0 && varstopauto === 0) { //stop auto at 0
                                        autotimer = setTimeout(function() {
                                            doAuto();
                                        }, 6000);
                                        if (result !== '[BREAK]moblist();') {
                                            timer2(6000);
                                            progressSlider(6000);
                                        }
                                        document.getElementById('doingThing').innerHTML = '<a href="javascript:doCheckAuto()">Autoing mob (click to check)</a>';
                                    } else if (varstopauto === 1 || am === 0) {
                                        varstopauto = 0;
                                        timer2time = 0;
                                        clearTimeout(autotimer);
                                        document.title = gameName;
                                        autoing = 0;
                                        timer(6000);
                                        progressSlider(6000);
                                        document.getElementById('doingThing').innerHTML = 'Nothing';
                                    } else {
                                        document.getElementById('doingThing').innerHTML = 'Nothing';
                                    }
                                })
                                .fail(function(result) {
                                    varstopauto = 0;
                                    timer2time = 0;
                                    clearTimeout(autotimer);
                                    document.title = gameName;
                                    autoing = 0;
                                    fighting = 0;
                                    $('#content').html(result.responseText);
                                });
                        };
                        doAuto();
                    }
                }
            })
            .fail(function(result) {
                varstopauto = 0;
                timer2time = 0;
                clearTimeout(autotimer);
                document.title = gameName;
                autoing = 0;
                fighting = 0;
                $('#content').html(result.responseText);
            });
    }
}

function moveMap(x) {
    $(".moveBtn").attr("disabled", true);
    $.ajax({
        type: "POST",
        url: "/move",
        data: {
            x: x
        },
        success: function(response) {
            document.getElementById('place').innerHTML = response;
            nav('battle');
            setTimeout(function() {
                $(".moveBtn").attr("disabled", false);
            }, 1050);
        },
        error: function(response) {
            document.getElementById('place').innerHTML = response.responseText;
        },
    });
}

function toPlace(x) {
    $(".moveBtn").attr("disabled", '1');
    $.ajax({
        type: "POST",
        url: "/toPlace",
        data: {
            x: x
        },
        success: function(response) {
            document.getElementById('place').innerHTML = response;
            nav('battle');
            setTimeout(function() {
                $(".moveBtn").attr("disabled", '0');
            }, 1000);
        },
        error: function(response) {
            document.getElementById('place').innerHTML = response.responseText;
        },
    });
}

function keyup(arg1) {
    if (arg1 == 13) {
        sortchat();
        document.getElementById('inputchat').style.color = document.getElementById('chatwindow').style.color;
    } else if (document.getElementById('inputchat').value.substr(0, 2) == '/g' || document.getElementById('inputchat').value.substr(0, 2) == '/c') {
        document.getElementById('inputchat').style.color = '#33CC33';
    } else if (document.getElementById('inputchat').value.substr(0, 2) == '/s' && document.getElementById('inputchat').value.substr(0, 3) != '/sp') {
        document.getElementById('inputchat').style.color = '#FF6666';
    } else if (document.getElementById('inputchat').value.substr(0, 2) == '/p') {
        document.getElementById('inputchat').style.color = '#6666CC';
    } else if (document.getElementById('inputchat').value.substr(0, 2) == '/m' && document.getElementById('inputchat').value.substr(0, 3) != '/me') {
        document.getElementById('inputchat').style.color = '#FFAAAA';
    } else if (document.getElementById('inputchat').value.substr(0, 3) == '/w ' || document.getElementById('inputchat').value.substr(0, 3) == '/v ' || document.getElementById('inputchat').value.substr(0, 3) == '/r ') {
        document.getElementById('inputchat').style.color = '#DD77DD';
    } else {
        document.getElementById('inputchat').style.color = document.getElementById('chatwindow').style.color;
    }
}

var timertimeout = 0;
var varstopauto = 0;
var timeout2;
timertime = 0;

function timer(time, auto, mob, mobname) {
    timertime = time;
    if (time == 500) {
        document.title = gameName;
    }
    if (document.getElementById('bb')) {
        document.getElementById('bb').disabled = true;
    }
    if (document.getElementById('ab')) {
        document.getElementById('ab').disabled = true;
    }
    if (document.getElementById('bb2')) {
        document.getElementById('bb2').disabled = true;
    }
    $(".moveBtn").attr("disabled", true);
    var showtime = Math.ceil(time / 1000);
    document.getElementById('timer').innerHTML = 'Action Timer: ' + showtime;
    if (time <= 0) {
        timertimeout = 0;
        if (document.getElementById('bb')) {
            document.getElementById('bb').disabled = false;
        }
        if (document.getElementById('ab')) {
            document.getElementById('ab').disabled = false;
        }
        if (document.getElementById('bb2')) {
            document.getElementById('bb2').disabled = false;
        }
        $(".moveBtn").attr("disabled", false);
    } else {
        time -= 500;
        if (auto) {
            time = time + ',' + auto + ',' + mob + ',"' + mobname + '"';
        }
        timertimeout = setTimeout('timer(' + time + ');', 500);
    }
}
timer2time = 0;

function timer2(time) {
    timer2time = time;
    if (time == 500) {
        document.title = gameName;
    }
    if (document.getElementById('bb')) {
        document.getElementById('bb').disabled = true;
    }
    $(".moveBtn").attr("disabled", true);
    var showtime = Math.ceil(time / 1000);
    document.getElementById('timer').innerHTML = 'Action Timer: ' + showtime;
    if (time <= 0) {
        timer2time = 0;
        timertimeout = 0;
        if (document.getElementById('bb')) {
            document.getElementById('bb').disabled = false;
        }
        $(".moveBtn").attr("disabled", false);
    } else {
        time -= 500;
        timertimeout = setTimeout('timer2(' + time + ');', 500);
    }
}

function progressSlider(time) {
    var el = document.getElementById('testTimer');
    void el.offsetWidth;
    el.style.transition = 'none';
    el.style.width = '100%';
    void el.offsetWidth;
    el.style.transition = 'width ' + (time / 1000) + 's linear';
    el.style.width = '0%';
}

function stopauto() {
    if (varstopauto == 0) {
        varstopauto = 1;
        autoing = 0;
        am = 0;
        clearTimeout(autotimer);
        clearInterval(autorestart);
        document.getElementById('stopauto').innerHTML = 'Stopping...';
        document.getElementById('doingThing').innerHTML = 'Nothing';
        $("#stopautoB").attr("disabled", true);
    }
}

function nav(arg1) {
    if (arg1 == 'battle') {
        if (document.getElementById('bb')) {
            document.getElementById('bb').disabled = true;
        }
        if (document.getElementById('ab')) {
            document.getElementById('ab').disabled = true;
        }
        if (document.getElementById('bb2')) {
            document.getElementById('bb2').disabled = true;
        }
        moblist(0);
        actionprogress = 0;
    } else if (arg1 == 'settings') {
        settings(0);
    }
}

function settings(choice) {
    var newsetting = 'none';
    $.ajax({
        type: "POST",
        url: "/settings",
        data: {
            setting: choice,
            newsetting: newsetting
        },
        success: function(response) {
            document.getElementById('content').innerHTML = response;
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    });
}

function verify() {
    $.ajax({
        type: "POST",
        url: "/verify",
        data: {
            response: $('#secQ').val()
        },
        success: function(response) {
            nav('battle');
        }
    });
}

function replenish() {
    $.ajax({
        type: "POST",
        url: "/replenish",
        success: function() {
            varstopauto = 1;
            autoing = 0;
            am = 0;
            clearTimeout(autotimer);
            clearInterval(autorestart);
            nav('battle');
        },
        error: function(result) {
            varstopauto = 1;
            autoing = 0;
            am = 0;
            clearTimeout(autotimer);
            clearInterval(autorestart);
            $('#content').html(result.responseText);
        }
    });
}

function switchToGuildNav() {
    $("#mainnav").val("4");
}

function switchToInventoryNav() {
    $("#mainnav").val("5");
}

function switchToStoryNav() {
    $("#mainnav").val("3");
}

function switchToDungeonsNav() {
    $("#mainnav").val("9");
}

function guildpage(arg1, arg2, arg3) {
    if (arg1 == 2) {
        arg2 = document.getElementById('guildname').value;
    }
    if (arg1 == 14) {
        arg2 = document.getElementById('gMOTD').value;
    }
    if (arg1 == 15) {
        arg2 = document.getElementById('inviteUser').value;
    }
    $.ajax({
        type: "POST",
        url: "/guilds",
        data: {
            x: arg1,
            y: arg2,
            z: arg3
        },
        success: function(response) {
            if (arg1 == 2) {
                var xyz = response.split('[BREAK]');
                $('#content').html(xyz[0]);
                $('#gold').html(xyz[1]);
                $('#gName').html(xyz[2]);
            }
            document.getElementById('content').innerHTML = response;
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    });
}

function teleportpage() {
    $.ajax({
        type: "POST",
        url: "/teleporter",
        success: function(response) {
            document.getElementById('content').innerHTML = response;
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    });
}

function chatinput(xmessage, arg, arg2) {
    $.ajax({
        type: "POST",
        url: "/input",
        data: {
            message: xmessage,
            arg: arg,
            arg2: arg2
        },
        success: function(response) {
            addChatLines(response.split('[BREAK]'));
        }
    });
}

function openpage(pagenumber, arg2, arg3) {
    if (pagenumber == 1) {
        arg = 'online';
    }
    if (pagenumber == 2) {
        arg = 'rankings';
    }
    if (pagenumber == 3) {
        arg = 'updates';
    }
    if (pagenumber == 4) {
        arg = 'rules';
    }
    if (pagenumber == 5) {
        arg = 'commands';
    }
    if (pagenumber == 6) {
        arg = 'purchase';
    }
    if (pagenumber == 7) {
        arg = 'shop';
    }
    if (pagenumber == 8) {
        arg = 'ranks';
    }
    if (pagenumber == 9) {
        arg = 'faq';
    }
    if (pagenumber == 10) {
        arg = 'redeem';
    }
    if (pagenumber == 11) {
        arg = 'mail';
    }
    if (pagenumber == 12) {
        arg = 'market';
    }
    if (pagenumber == 13) {
        arg = 'referral';
    }
    if (pagenumber == 14) {
        arg = 'online';
    }
    $.ajax({
        type: "POST",
        url: "/popup",
        data: {
            x: arg,
            y: arg2,
            z: arg3
        },
        success: function(response) {
            var xyz = response.split('[BREAK]');
            $('#popup').html(xyz[0]);
            document.getElementById('popupholder').style.visibility = 'visible';
        },
        error: function(response) {
            document.getElementById('popup').innerHTML = response.responseText;
            document.getElementById('popupholder').style.visibility = 'visible';
        },
    });
}

function whisper(n) {
    closepage();
    document.getElementById('inputchat').value = '/w ' + n + ' ';
    document.getElementById('inputchat').focus();
    document.getElementById('inputchat').style.color = '#DD77DD';
}

function commands(arg, arg2) {
    $.ajax({
        type: "POST",
        url: "/commands",
        data: {
            x: arg.replace(/&/, "%26"),
            y: arg2
        },
        success: function(response) {
            if (arg === 'inventoryCount') {
                bootbox.alert(response);
            } else {
                addChatLines(response.split('[BREAK]'));
            }
        },
        error: function(response) {
            addChatLines(response.split('[BREAK]'));
        },
    });
}

function sortchat() {
    if (document.getElementById('inputchat').value !== '' && document.getElementById('inputchat').value !== ' ') {
        let message = document.getElementById('inputchat').value;
        document.getElementById('inputchat').value = '';
        message = message.replace(/</g, '&lt;');
        message = message.replace(/>/g, '&gt;');
        if (message[0] == ' ') {
            message = message.replace(' ', '');
        }
        let messageparts = message.split(' ');
        if (messageparts[0].toLowerCase() == '/w') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'w';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/g' || messageparts[0].toLowerCase() == '/c' || messageparts[0].toLowerCase() == '/guild') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'guild';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/s') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'staff';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/m') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'market';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/p') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'pub';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/me') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'me';
                message = messageparts.join(' ');
                chatinput(message, arg);
            }
        } else if (messageparts[0].toLowerCase() == '/ban') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'ban';
                commands(arg, messageparts[1]);
            }
        } else if (messageparts[0].toLowerCase() == '/mute') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'mute';
                commands(arg, messageparts[1]);
            }
        } else if (messageparts[0].toLowerCase() == '/unmute') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'unmute';
                commands(arg, messageparts[1]);
            }
        } else if (messageparts[0].toLowerCase() == '/kick') {
            if (messageparts[1]) {
                messageparts[0] = '';
                let arg = 'kick';
                commands(arg, messageparts[1]);
            }
        } else if (messageparts[0].substr(0, 1) == '/') {
            let arg = messageparts[0].slice(1);
            messageparts.shift();
            commands(arg);
        } else {
            arg = '';
            message = messageparts.join(' ');
            chatinput(message, arg);
        }
    }
}

function closepage() {
    document.getElementById('popupholder').style.visibility = 'hidden';
    document.getElementById('popupresponse').innerHTML = '';
}

function equip(choice) {
    $.ajax({
        type: "POST",
        url: "/equip",
        data: {
            equip: choice
        },
        success: function(response) {
            document.getElementById('equipstuff').innerHTML = response;
            var addclass = 'highlight';
            $('p').removeClass(addclass);
            $('.equipment' + choice).addClass(addclass);
        },
        error: function(response) {
            document.getElementById('equipstuff').innerHTML = response.responseText;
        },
    });
}

function equipupgrade(choice) {
    $.ajax({
        type: "POST",
        url: "/equip",
        data: {
            upgrade: choice
        },
        success: function(response) {
            var xyz = response.split('[BREAK]');
            $('#equipstuff').html(xyz[0]);
            $('#gold').html(toCoin(xyz[1]));
            if (choice == 1) {
                $('#equip1').html(xyz[2]);
            }
            if (choice == 2) {
                $('#equip2').html(xyz[2]);
            }
            if (choice == 3) {
                $('#equip3').html(xyz[2]);
            }
            if (choice == 4) {
                $('#equip4').html(xyz[2]);
            }
            if (choice == 5) {
                $('#equip5').html(xyz[2]);
            }
            if (choice == 6) {
                $('#equip6').html(xyz[2]);
            }
            if (choice == 7) {
                $('#equip7').html(xyz[2]);
            }
            if (choice == 8) {
                $('#equip8').html(xyz[2]);
            }
            if (choice == 9) {
                $('#equip9').html(xyz[2]);
            }
        },
        error: function(response) {
            document.getElementById('equipstuff').innerHTML = response.responseText;
        },
    });
}

function augment(choice) {
    $.ajax({
        type: "POST",
        url: "/augment",
        data: {
            x: choice
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            bootbox.alert(xyz[0]);
            if (xyz[1]) {
                if (choice === 1) {
                    $('#aug1').html(xyz[1]);
                }
                if (choice === 2) {
                    $('#aug2').html(xyz[1]);
                }
                if (choice === 3) {
                    $('#aug3').html(xyz[1]);
                }
                if (choice === 4) {
                    $('#aug4').html(xyz[1]);
                }
                if (choice === 5) {
                    $('#aug5').html(xyz[1]);
                }
                if (choice === 6) {
                    $('#aug6').html(xyz[1]);
                }
                if (choice === 7) {
                    $('#aug7').html(xyz[1]);
                }
                if (choice === 8) {
                    $('#aug8').html(xyz[1]);
                }
                if (choice === 9) {
                    $('#aug9').html(xyz[1]);
                }
            }

        },
        error: function(response) {
            document.getElementById('equipstuff').innerHTML = response.responseText;
        },
    });
}

function quest(x, y) {
    $.ajax({
        type: "POST",
        url: "/quest",
        data: {
            x: x,
            y: y
        },
        success: function(response) {
            document.getElementById('popupholder').style.visibility = 'visible';
            if (x == 0) {
                $('#popup').html(response);
            }
            if (x == 1) {
                var xyz = response.split('[BREAK]');
                $('#popup').html(xyz[0]);
                $('#gold').html(toCoin(xyz[1]));
                $('#mithril').html(numeral(xyz[2]).format('0,0'));
                $('#qNum').html(numeral(xyz[3]).format('0,0'));
                $('#qInfo').html(xyz[4]);
            }
            if (x == 2 || x == 3) {
                var xyz = response.split('[BREAK]');
                $('#popup').html(xyz[0]);
                $('#qInfo').html(xyz[1]);
            }
        },
        error: function(response) {
            alert('Request timed out. Please try again. If problem persist, try refreshing.');
        },
    });
}

function buy(x, y) {
    if (x == 1) {
        y = document.getElementById('minutesToBuy').value;
    }
    if (x == 20) {
        y = document.getElementById('ranklist').value;
    }
    $.ajax({
        type: "POST",
        url: "/purchase",
        data: {
            x: x,
            thing: y
        },
        success: function(response) {
            document.getElementById('popupholder').style.visibility = 'visible';
            let xyz = response.split('[BREAK]');
            if (xyz[0] === 'status1') {
                openpage(8);
                $('#repRank').html(xyz[1]);
            }
            if (x === 1) {
                bootbox.alert(xyz[0]);
                openpage(6, 2);
                $('#credits').html(numeral(xyz[1]).format('0,0'));
            }
            if (x === 2 || x === 3 || x === 4 || x === 5 || x === 7 || x === 8) {
                bootbox.alert(xyz[0]);
                openpage(6, 3);
                $('#credits').html(numeral(xyz[1]).format('0,0'));
            }
            if (x === 6) {
                bootbox.alert(xyz[0]);
                openpage(6, 4);
                $('#credits').html(numeral(xyz[1]).format('0,0'));
            }
            if (x === 21) {
                bootbox.alert(xyz[0]);
                $('#gold').html(toCoin(xyz[1]));
                $('#credits').html(numeral(xyz[2]).format('0,0'));
            }
        },
        error: function() {
            if (x === 21) {
                bootbox.alert('Do you have enough items?');
            } else {
                bootbox.alert('Error.');
            }
        },
    }).catch(console.error);
}

function profile(x, y, z) {
    $.ajax({
        type: "POST",
        url: "/profile",
        data: {
            x: x,
            y: y,
            z: z
        },
        success: function(response) {
            document.getElementById('popupholder').style.visibility = 'visible';
            document.getElementById('popup').innerHTML = response;
        },
        error: function() {
            alert('Request timed out. Please try again. If problem persist, try refreshing.');
        },
    }).catch(console.error);
}

function mail(x, y, z, w, v) {
    if (x === 1) {
        y = document.getElementById('toUser').value;
        z = document.getElementById('toTitle').value;
        w = document.getElementById('toMessage').value;
        v = document.getElementById('toGold').value;
    }
    $.ajax({
        type: "POST",
        url: "/mail",
        data: {
            x: x,
            y: y,
            z: z,
            w: w,
            v: v
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            bootbox.alert('<span class="font-weight-bold">' + xyz[0] + '</span>');
            $('#gold').html(toCoin(xyz[1]));
            openpage(11, 1);
        },
        error: function() {
            alert('Request timed out. Please try again. If problem persist, try refreshing.');
        },
    }).catch(console.error);
}


function closeequip() {
    let addclass = 'highlight';
    $('p').removeClass(addclass);
    document.getElementById('equipstuff').innerHTML = 'No equipment selected.';
}

function inventory(x, y, z) {
    if (y === 2) {
        bootbox.confirm({
            size: "small",
            message: "Are you sure you want to delete this item?",
            callback: function(result) {
                if (result === false) {
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: "/inventory",
                    data: {
                        x: x,
                        y: y,
                        z: z
                    },
                    success: function(response) {
                        var xyz = response.split('[BREAK]');
                        if ((x == 0 && z == 0) || (x > 0 && y == 1 && z == 0) || (x > 0 && y == 2)) {
                            $('#content').html(xyz[0]);
                            $('#health').html(xyz[1]);
                            $('#attack').html(xyz[2]);
                            $('#defense').html(xyz[3]);
                            $('#accuracy').html(xyz[4]);
                            $('#evasion').html(xyz[5]);
                        }
                    },
                    error: function(response) {
                        document.getElementById('content').innerHTML = response.responseText;
                    },
                }).catch(console.error);
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/inventory",
            data: {
                x: x,
                y: y,
                z: z
            },
            success: function(response) {
                let xyz = response.split('[BREAK]');
                $('#content').html(xyz[0]);
                $('#health').html(xyz[1]);
                $('#attack').html(xyz[2]);
                $('#defense').html(xyz[3]);
                $('#accuracy').html(xyz[4]);
                $('#evasion').html(xyz[5]);
            },
            error: function(response) {
                document.getElementById('content').innerHTML = response.responseText;
            },
        }).catch(console.error);
    }
}

function story(x) {
    $.ajax({
        type: "POST",
        url: "/story",
        data: {
            x: x
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            $('#content').html(xyz[0]);
            $('#gold').html(toCoin(xyz[1]));
            $('#credits').html(numeral(xyz[2]).format('0,0'));
            $('#mithril').html(numeral(xyz[3]).format('0,0'));
            setTimeout(function() {
                document.getElementById('mainnav').focus();
            }, 200);
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function teleportBeast() {
    bootbox.confirm({
        size: "small",
        message: "Are you sure you want to teleport to the nearest beast for 1,500,000 gold?",
        callback: function(result) {
            if (result === false) {
                return;
            }
            $.ajax({
                type: "POST",
                url: "/teleportBeast",
                success: function(response) {
                    var xyz = response.split('[BREAK]');
                    bootbox.alert('<span class="font-weight-bold">' + xyz[0] + '</span>');
                    $('#gold').html(toCoin(xyz[1]));
                    moveMap();
                    nav('battle');
                    varstopauto = 0;
                    timer2time = 0;
                    clearTimeout(autotimer);
                    document.title = gameName;
                    autoing = 0;
                    fighting = 0;
                },
                error: function(response) {
                    bootbox.alert('<span class="text-danger font-weight-bold">' + response.responseText + '</span>');
                },
            }).catch(console.error);
        }
    });
}

function teleport() {
    bootbox.confirm({
        size: "small",
        message: "Are you sure you want to teleport for 1,000,000 gold?",
        callback: function(result) {
            if (result === false) {
                return;
            }
            $.ajax({
                type: "POST",
                url: "/teleportLoc",
                data: {
                    x: $('#teleportList').val()
                },
                success: function(response) {
                    let xyz = response.split('[BREAK]');
                    bootbox.alert('<span class="font-weight-bold">' + xyz[0] + '</span>');
                    $('#gold').html(toCoin(xyz[1]));
                    moveMap();
                    nav('battle');
                    varstopauto = 0;
                    timer2time = 0;
                    clearTimeout(autotimer);
                    document.title = gameName;
                    autoing = 0;
                    fighting = 0;
                },
                error: function(response) {
                    bootbox.alert('<span class="text-danger font-weight-bold">' + response.responseText + '</span>');
                },
            }).catch(console.error);
        }
    });
}

function marketbuy(x, y, z) {
    let sMessage;
    if (x === 1) {
        sMessage = 'Are you sure you want to purchase this?';
    } else if (x === 2) {
        sMessage = 'Click OK to confirm.';
    } else if (x === 3) {
        sMessage = 'Click OK to confirm.';
    } else {
        sMessage = 'Are you sure you want to list this?';
    }
    bootbox.confirm({
        size: "small",
        message: sMessage,
        callback: function(result) {
            if (result === false) {
                return;
            }
            if (x === 4) {
                y = document.getElementById('creditsToSell').value;
                z = document.getElementById('creditsSellPrice').value;
            }
            $.ajax({
                type: "POST",
                url: "/market",
                data: {
                    x: x,
                    y: y,
                    z: z
                },
                success: function(response) {
                    let xyz = response.split('[BREAK]');
                    bootbox.alert('<span class="font-weight-bold">' + xyz[0] + '</span>');
                    $('#gold').html(toCoin(xyz[1]));
                    $('#credits').html(numeral(xyz[2]).format('0,0'));
                    if (x === 1) {
                        setTimeout(function() {
                            openpage(12, 1, 0);
                        }, 500);
                    } else if (x === 2) {
                        setTimeout(function() {
                            openpage(12, 2, 0);
                        }, 500);
                    } else if (x === 3) {
                        setTimeout(function() {
                            openpage(12, 3, 0);
                        }, 500);
                    } else {
                        setTimeout(function() {
                            openpage(12, 4);
                        }, 500);
                    }
                },
                error: function(response) {
                    bootbox.alert('<span class="text-danger font-weight-bold">' + response.responseText + '</span>');
                },
            }).catch(console.error);
        }
    });
}

function mithrilupgrades(x) {
    $.ajax({
        type: "POST",
        url: "/mithrilupgrades",
        data: {
            x: x
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            $('#content').html(xyz[0]);
            $('#mithril').html(numeral(xyz[1]).format('0,0'));
            setTimeout(function() {
                document.getElementById('mainnav').focus();
            }, 200);
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function dungeons(x, y) {
    $.ajax({
        type: "POST",
        url: "/dungeons",
        data: {
            x: x,
            y: y
        },
        success: function(response) {
            if (y) {
                dungeons(1);
            } else {
                $('#content').html(response);
                timer(1000);
                progressSlider(1000);
            }
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function dungeonBattle() {
    $.ajax({
        type: "POST",
        url: "/dungeons/battle",
        success: function(response) {
            if (document.getElementById('bb')) {
                document.getElementById('bb').disabled = true;
            }
            fighting = 0;
            document.getElementById('mainnav').options[0].selected = true;
            if (document.getElementById('bb2')) {
                document.getElementById('bb2').disabled = true;
            }
            $(".moveBtn").attr("disabled", true);
            timer2(2000);
            progressSlider(2000);
            actionprogress = 0;
            $('#content').html(response);
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function milestones(x, y) {
    $.ajax({
        type: "POST",
        url: "/milestones",
        data: {
            x: x,
            y: y
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            $('#content').html(xyz[0]);
            $('#gold').html(toCoin(xyz[1]));
            $('#credits').html(numeral(xyz[2]).format('0,0'));
            $('#mithril').html(numeral(xyz[3]).format('0,0'));
            setTimeout(function() {
                document.getElementById('mainnav').focus();
            }, 200);
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function moblist(x) {
    varstopauto = 0;
    autoing = 0;
    document.getElementById('mainnav').options[0].selected = true;
    $.ajax({
        type: "POST",
        url: "/moblist",
        data: {
            x: x
        },
        success: function(response) {
            document.getElementById('content').innerHTML = response;
            if (localStorage.getItem('tlu_lastMon') && $("#mob option[value='" + (localStorage.getItem('tlu_lastMon')) + "']").length !== 0) {
                $("#mob option[value='" + (localStorage.getItem('tlu_lastMon')) + "']").prop('selected', true);
            }
            timer(1000);
            progressSlider(1000);
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function changePass() {
    if (document.getElementById('newpass').value === '' || document.getElementById('newpass').value !== document.getElementById('newpassconfirm').value) {
        return bootbox.alert('<span class="text-danger font-weight-bold">Passwords do not match!</span>');
    }
    $.ajax({
        type: 'POST',
        url: '/passwordUpdate',
        data: {
            password: document.getElementById('newpass').value
        },
        success: function(res) {
            bootbox.alert(res);
            document.getElementById('newpass').value = '';
            document.getElementById('newpassconfirm').value = '';
        },
        error: function(res) {
            bootbox.alert(res.responseText);
            document.getElementById('newpass').value = '';
            document.getElementById('newpassconfirm').value = '';
        }
    }).catch(console.error);
}

function redeemCode() {
    $.ajax({
        type: "POST",
        url: "/redeem",
        data: {
            x: document.getElementById('redeem').value
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            document.getElementById('redeem').value = '';
            document.getElementById('redeemResponse').innerHTML = xyz[0];
            $('#gold').html(toCoin(xyz[1]));
            $('#credits').html(numeral(xyz[2]).format('0,0'));
            $('#mithril').html(numeral(xyz[3]).format('0,0'));
        },
        error: function(response) {
            document.getElementById('redeem').value = '';
            document.getElementById('redeemResponse').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

function guildDonate(y) {
    let donateAmount;
    if (y === 1) {
        donateAmount = document.getElementById('donateGold').value;
    } else if (y === 2) {
        donateAmount = document.getElementById('donateCredits').value;
    } else if (y === 3) {
        donateAmount = document.getElementById('donateMithril').value;
    } else if (y === 4) {
        donateAmount = document.getElementById('donateTimber').value;
    } else {
        donateAmount = document.getElementById('donateStones').value;
    }
    $.ajax({
        type: "POST",
        url: "/guilds",
        data: {
            x: 7,
            y: y,
            z: donateAmount
        },
        success: function(response) {
            let xyz = response.split('[BREAK]');
            document.getElementById('content').innerHTML = xyz[0];
            if (y === 1) {
                $('#gold').html(toCoin(xyz[1]));
            } else if (y === 2) {
                $('#credits').html(numeral(xyz[1]).format('0,0'));
            } else if (y === 3) {
                $('#mithril').html(numeral(xyz[1]).format('0,0'));
            } else if (y === 4) {
                $('#timber').html(numeral(xyz[1]).format('0,0'));
            } else if (y === 5) {
                $('#stones').html(numeral(xyz[1]).format('0,0'));
            }
        },
        error: function(response) {
            document.getElementById('content').innerHTML = response.responseText;
        },
    }).catch(console.error);
}

$(document).on('submit', '#avatarForm', function(e) {
    e.preventDefault();
    if (document.getElementById('avatarToUpload').value === '') {
        return bootbox.alert('Cannot upload empty avatar');
    }
    let fSize = document.getElementById('avatarToUpload').files[0].size;
    if (fSize > 1000000) {
        return bootbox.alert('Avatar size was greater than 1MB! Choose something smaller!');
    }
    $.ajax({
        url: '/uploadAvatar',
        type: 'post',
        data: new FormData($('#avatarForm').get(0)),
        processData: false,
        contentType: false,
        success: function(data) {
            bootbox.alert(data);
            document.getElementById('avatarToUpload').value = '';
        },
        error: function(data) {
            bootbox.alert(data.responseText);
            document.getElementById('avatarToUpload').value = '';
        }
    }).catch(console.error);
    return false;
});

function userStuffChange(navx) {
    navx = parseInt(document.getElementById('userSelect').value);
    if (navx === 1) {
        document.getElementById('option1').style.display = 'block';
        document.getElementById('option2').style.display = 'none';
        document.getElementById('option3').style.display = 'none';
    }
    if (navx === 2) {
        document.getElementById('option2').style.display = 'block';
        document.getElementById('option1').style.display = 'none';
        document.getElementById('option3').style.display = 'none';
    }
    if (navx === 3) {
        document.getElementById('option3').style.display = 'block';
        document.getElementById('option1').style.display = 'none';
        document.getElementById('option2').style.display = 'none';
    }
}

function online() {
    $.ajax({
        url: '/commands',
        type: 'post',
        data: {x: 'online'},
        success: function(data) {
            $('#onlinecount').html(data);
        },
        error: function() {
            $('#onlinecount').html('error');
        }
    }).catch(console.error);
    $('#poDesc').popover({
        trigger: "hover"
    });
}

let actionprogress = 0;

function battle() {
    if (document.getElementById('bb')) {
        document.getElementById('bb').disabled = true;
        document.getElementById('bb').value = 'Wait...';
    }
    if (document.getElementById('bb2')) {
        document.getElementById('bb2').disabled = true;
        document.getElementById('bb2').value = 'Wait...';
    }
    if (document.getElementById('ab')) {
        document.getElementById('ab').disabled = true;
        document.getElementById('ab').value = 'Wait...';
    }
    let mob = $('#mob').val();
    if (fighting === 0) {
        fighting = 1;
        lastMonS();
        $.ajax({
            type: "POST",
            url: "/battle",
            data: {
                t: 0,
                mob: mob
            },
            success: function(result) {
                if (document.getElementById('bb')) {
                    document.getElementById('bb').disabled = true;
                }
                fighting = 0;
                document.getElementById('mainnav').options[0].selected = true;
                if (document.getElementById('bb2')) {
                    document.getElementById('bb2').disabled = true;
                }
                $(".moveBtn").attr("disabled", true);
                timer2(2000);
                progressSlider(2000);
                actionprogress = 0;
                let xyz = result.split('[BREAK]');
                $('#content').html(xyz[0]);
                $('#level').html(numeral(xyz[1]).format('0,0'));
                $('#exp').html(xyz[2]);
                $('#gold').html(toCoin(xyz[3]));
                $('#credits').html(numeral(xyz[4]).format('0,0'));
                $('#mithril').html(numeral(xyz[5]).format('0,0'));
                $('#health').html(xyz[6]);
                $('#attack').html(xyz[7]);
                $('#defense').html(xyz[8]);
                $('#accuracy').html(xyz[9]);
                $('#evasion').html(xyz[10]);
            },
            error: function(result) {
                fighting = 0;
                $('#content').html(result.responseText);
            }
        }).catch(console.error);
    }
}

function battleBeast(arg, arg2) {
    let beast = $('#beast').val();
    let beastname = $('#beast option:selected').text();
    if (fighting === 0) {
        fighting = 1;
        $.ajax({
            type: "POST",
            url: "/battleBeast",
            data: {
                t: 0,
                check: arg2,
                beast: beast,
                beastname: beastname
            },
            success: function(result) {
                fighting = 0;
                document.getElementById('mainnav').options[0].selected = true;
                if (document.getElementById('bb')) {
                    document.getElementById('bb').disabled = true;
                }
                if (document.getElementById('bb2')) {
                    document.getElementById('bb2').disabled = true;
                }
                $(".moveBtn").attr("disabled", true);
                timer2(2000);
                progressSlider(2000);
                actionprogress = 0;
                var xyz = result.split('[BREAK]');
                $('#content').html(xyz[0]);
                $('#gold').html(toCoin(xyz[1]));
                $('#credits').html(numeral(xyz[2]).format('0,0'));
                $('#mithril').html(numeral(xyz[3]).format('0,0'));
                $('#timber').html(numeral(xyz[4]).format('0,0'));
                $('#stones').html(numeral(xyz[5]).format('0,0'));
            }
        });
    }
}

function lastMonS() {
    localStorage.setItem('tlu_lastMon', $('#mob').val());
}

function mainnav() {
    var navx = document.getElementById('mainnav').value;
    performnav(navx);
}

function performnav(navx) {

    document.getElementById('mainnav').value = navx;
    if (navx == 1) { //Battle
        closepage();
        nav('battle');
    }
    if (navx == 2) { //Quests
        quest(0, 0);
    }
    if (navx == 3) {
        story(0);
    }
    if (navx == 4) {
        guildpage(0);
    }
    if (navx == 5) {
        inventory(0, 0, 0);
    }
    if (navx == 6) {
        teleportpage();
    }
    if (navx == 7) {
        mithrilupgrades(0);
    }
    if (navx == 8) {
        milestones(1);
    }
    if (navx == 9) {
        dungeons(1);
    }
    if (navx == 11) {
        nav('settings');
    }
}

function addChatLines(lines) {
    if (Array.isArray(lines)) {
        lines.reverse();
        for (var i = 0; i < lines.length; ++i) {
            if (lines[i] != '') {
                $("#chatwindow").prepend(lines[i]);
            }
        }
    } else {
        $("#chatwindow").prepend(lines);
    }
    $("#chatwindow").children(':nth-child(n+23)').remove();
}

function chatWindow() {
    $("#chatwindow").load("/chat");
}

function chat(starting) {
    $.post(
        '/chat', {
            arg: starting
        },
        function(result) {
            addChatLines(result.split('[BREAK]'));
        }
    ).always(
        function() {
            chattimer = setTimeout(chat, 2000);
        }
    );
}

function startchat() {
    chat('start');
}

document.addEventListener('DOMContentLoaded', function(ev) {
    ev.stopPropagation();
}, false);
window.addEventListener = null;
