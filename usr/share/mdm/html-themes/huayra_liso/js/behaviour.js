Array.prototype.find = Array.prototype.find || function(criterio) {
    return this._filter(criterio)[0];
};

var User = function(userData, store) {
    this._name = userData.name;
    this._gecos = userData.gecos;
    this._logged = userData.logged;

    this._store = store;

    this._buildDom();
};
User.prototype._buildDom = function() {
    var that = this;

    this.$link = $(document.createElement('a'))
        .attr('href', '#')
        .click(function(e) {
            e.preventDefault();
            that.login();
        })
        .append(
            $(document.createElement('div'))
                .addClass('user_box')
                .append(
                    $(document.createElement('font'))
                        .addClass('font_username')
                        .text(that.getName())
                )
               .append(
                    $(document.createElement('font'))
                        .addClass('font_gecos')
                        .text(that.getGecos() ? '(' + that.getGecos() + ')' : '')
                )
                .append(
                    $(document.createElement('div'))
                        .attr('id', 'user_arrows')
                        .append(
                            $(document.createElement('div'))
                                .addClass('user_arrow_up')
                                .click(function(e) {
                                    e.stopPropagation();
                                    Users
                                        .selectPrevious()
                                        .login();
                                })
                        )
                        .append(
                            $(document.createElement('div'))
                                .addClass('user_arrow_dw')
                                .click(function(e) {
                                    e.stopPropagation();
                                    Users
                                        .selectNext()
                                        .login();
                                })
                        )
                )
        );

    return this;
};
User.prototype.appendTo = function($wrapper) {
    this.$link.appendTo($wrapper);
    return this;
};
User.prototype.select = function() {
    this._store.unselectAll();
    this._selected = true;
    return this;
};
User.prototype.unselect = function() {
    this._selected = false;
};
User.prototype.login = function() {
    MDM.setUser(this.getName());
    return this;
};
User.prototype.getName = function() {
    return this._name;
};
User.prototype.getGecos = function() {
    return this._gecos;
};
User.prototype.isLogged = function() {
    return this._logged;
};

var Users = {
    _users: [],
    add: function(userData) {
        var newUser = new User(userData, this);
        this._users.push(newUser);
        return newUser;
    },
    getSelected: function() {
        return this._users.find(function(aUser) {
            return aUser.isSelected();
        });
    },
    unselectAll: function() {
        this._users.forEach(function(aUser) {
            aUser.unselect();
        });
        return this;
    }
};

var mdmDisable = function() {
    $('#entry, #ok_button')
        .prop('disabled', true)
        .css('cursor', 'progress');
    $('#login-box')
        .css('cursor', 'progress');
};

var mdmEnable = function() {
    $('#entry')
        .prop('disabled', false)
        .css('cursor', 'text');
    $('#ok_button')
        .prop('disabled', false)
        .css('cursor', 'default');
    $('#login-box')
        .css('cursor', 'default');
};

// Called by MDM to disable user input
MDM.whenDisable(mdmDisable);

// Called by MDM to enable user input
MDM.whenEnable(mdmEnable);
// Called by MDM to update the clock
MDM.whenSetClock(function(time) {
    $('#clock').text(time);
});

// Called by MDM to allow the user to input a username 
MDM.whenPrompt(function(message) {
    mdmEnable();
    $('#login_box').show();
/*    for (var i = 0; i < num_users; i++) {
        $('#user' + i).appendTo('#top_users');
        $('#user' + i).show();
    }
*/
    $('#entry')
        .attr('type', 'text')
        .val('')
        .focus();

    Users.unselectAll();
});
/*
// Called by MDM to allow the user to input a password
MDM.whenNoEcho(function(message) {
    mdmEnable();
    $('#login_box').fadeIn();
    $('#entry')
        .attr('type', 'password')
        .val('')
        .focus();
});
*/
// Called by MDM to show a timed login countdown
MDM.whenTimed(function(message) {
    if(message) {
        $('#timed')
            .text(message)
            .show();
    }
    else {
        $('#timed').hide();
    }
});

// Called by MDM to show an error
MDM.whenError(function(message) {
    if (message) {
        $('#error')
            .text(message)
            .show();
    }
    else {
        $('#error').hide();
    }
});

// Called by MDM to add a user to the list of users
MDM.whenAddUser(function(userName, gecos, status) {
    Users.add({
        name: userName,
        gecos: gecos,
        logged: status
    }).appendTo('#top_users');
});

// Called by MDM to add a session to the list of sessions
MDM.whenAddSession(function(sessionName, sessionFile) {
    sessionName = sessionName
        .replace('Ubuntu', 'Unity')
        .replace('Sesión de XFCE', 'XFCE');

    var filename = sessionName
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/\(/g, '')
        .replace(/\)/g, '');

    var $link1 = $(document.createElement('a'))
        .attr('href', '#')
        .click(function(e) {
            e.preventDefault();
            MDM.setSession(sessionName, sessionFile);
        });
    $link1.setAttribute('href', "javascript:alert('SESSION###" + sessionName + "###" + session_file + "');select_session('" + sessionName + "','" + session_file + "');");
    
    var picture = document.createElement('img');
    picture.setAttribute('class', "session-picture");
    picture.setAttribute('src', "img/sessions/" + filename + ".svg");
    picture.setAttribute('onerror', "this.src='img/session_generic.svg';");

    var name_div = document.createTextNode(sessionName);

    link1.appendChild(picture);
    link2.appendChild(name_div);

    var table = document.getElementById("sessions");

    var rowCount = table.rows.length;
    var row = table.insertRow(rowCount);

    var cell1 = row.insertCell(0);
    cell1.width = "32px";
    cell1.height = "32px";
    cell1.appendChild(link1);

    var cell2 = row.insertCell(1);
    cell2.width = "100%";
    cell2.height = "32px";
    cell2.appendChild(link2);
});

var getCountryCode = function(languageCode) {
    return languageCode.toLowerCase().replace('.utf-8', '').split('_')[1];
};

// Called by MDM to add a language to the list of languages
MDM.whenAddLanguage(function(languageName, languageCode) {
    debugMsg('addLanguage ' + languageCode);
    var $picture = $(document.createElement('img'))
        .addClass('language-picture')
        .attr({
            src: 'img/languages/' + getCountryCode(languageCode) + '.svg',
            title: languageName
        });
    $picture.get(0).onerror = function() {
        this.src = 'img/lang_generic.svg';
    };

    var $link1 = $(document.createElement('a'))
        .attr('href', '#')
        .click(function(e) {
            e.preventDefault();
            MDM.setLanguage(languageCode);
        }).append(
        );

    var $link2 = $(document.createElement('a'))
        .attr('href', '#')
        .click(function(e) {
            e.preventDefault();
            MDM.setLanguage(languageCode);
        })
        .text(languageName);

    $('#languages')
        .append(
            $(document.createElement('tr'))
                .append(
                    $(document.createElement('td'))
                        .width(25)
                        .append($link1)
                )
                .append(
                    $(document.createElement('td'))
                        .append($link2)
                )
        );
});

MDM.whenSetCurrentLanguage(function(languageName, languageCode) {
    debugMsg(languageCode);
    $('#current_language_flag')
        .attr({
            src: '../../common/img/languages/' + getCountryCode(languageCode) + '.png',
            title: languageName
        });
});
/*
MDM.whenSetCurrentUser(function(username) {
    for (var i = 0; i < num_users; i++) {
        var user = document.getElementById("user" + i);
        if (user.username == username) {
            select_user_at_index(i, false);
            return;
        }
    }
    select_user_at_index(0, true);
});

*/
// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
MDM.whenHideShutdown(function() {
    $('#shutdown').hide();
});

// Called by MDM if the SUSPEND command shouldn't appear in the greeter
MDM.whenHideSuspend(function() {
    $('#suspend').hide();
});

// Called by MDM if the RESTART command shouldn't appear in the greeter
MDM.whenHideRestart(function() {
    $('#restart').hide();
});

// Called by MDM if the QUIT command shouldn't appear in the greeter
MDM.whenHideQuit(function() {
    $('#quit').hide();
});

// Called by MDM if the XDMCP command shouldn't appear in the greeter
MDM.whenHideXdmcp(function() {
    $('#xdmcp').hide();
});

$(document).ready(function() {
    $('#error, #timed, #login_box').hide();
    $('#current_session_picture').width(16);

    $('body').on('keydown', function(e) {
        switch(e.keyCode) {
            case 38:
                // up
                select_user_at_index(selected_user - 1, true);
                break;
            case 40:
                // down
                select_user_at_index(selected_user + 1, true);
                break;
            case 9:
                // tab    
                $('#entry').focus();
                break;
            case 13:
                // enter
                if ($('#login_box').is(':hidden')) {
                    return false;
                } else {
                    send_login();
                    return false;
                }
                break;
        }
    });

    $('#quit_shutdown').click(function(e) {
        e.preventDefault();
        MDM.shutdown(true);
    });

    $('#quit_suspend').click(function(e) {
        e.preventDefault();
        MDM.suspend(true);
    });

    $('#quit_restart').click(function(e) {
        e.preventDefault();
        MDM.restart(true);
    });


    $('#current_session_picture').popover({
        html: true,
        title: function() {
            return $('#sessions-title').html();
        },
        content: function() {
            return $('#sessions-body').detach();
        }
    });

    $('#current_language_flag').popover({
        html: true,
        title: function() {
            return $('#languages-title').html();
        },
        content: function() {
            return $('#languages-body').detach();
        }
    });

    $('#quit_dialog').popover({
        html: true,
        title: function() {
            return $('#quit-title').html();
        },
        content: function() {
            return $('#quit-body').detach();
        }
    });
});
/*

// ESTE NO!
function select_session(session_name, session_file) {
    var filename = session_name.toLowerCase();
    filename = filename.replace(/ /g, "-");
    filename = filename.replace(/\(/g, "");
    filename = filename.replace(/\)/g, "");
    document.getElementById("current_session_picture").src = "img/sessions/" + filename + ".svg";
    document.getElementById("current_session_picture").title = session_name;
    document.getElementById("current_session_picture").width = 16;
    $('#current_session_picture').popover('hide');
}

// ESTE NO!
// Send user input to MDM
function send_login() {
    // read the value before we disable the field, as it will be changed to "disabled"
    var value = document.getElementById("entry").value;
    mdmDisable();
    alert("LOGIN###" + value);
    return false;
}

// ESTE NO!
function select_user_at_index(index, alert_mdm) {

    var index_to_select = index;
    if (index_to_select < 0) {
        index_to_select = num_users - 1;
    }
    if (index_to_select >= num_users) {
        index_to_select = 0;
    }

    var username = null;

    for (var i = 0; i < num_users; i++) {
        if (i < index_to_select) {

            $('#user' + i).appendTo('#top_users');
            //$('#user' + i).show();
        } else if (i == index_to_select) {
            var user = document.getElementById("user" + i);
            var current_gecos = document.getElementById("current_gecos");
            var current_username = document.getElementById("current_username");
            var selected_status = document.getElementById("selected_status");
            username = user.username;
            current_username.innerHTML = user.username;
            current_gecos.innerHTML = user.gecos;
            selected_status.innerHTML = user.current_status;
            var picture = document.getElementById('selected_avatar');
            picture.setAttribute('src', "file:///home/" + username + "/.face");
            //$('#user' + i).hide();
            $('#user' + i).appendTo('#selected_user');
        } else {
            $('#user' + i).appendTo('#bottom_users');
            //$('#user' + i).show();
        }
        selected_user = index_to_select;
    }

    if (alert_mdm) {
        alert('USER###' + username);
    }
}
*/