// Documentación: https://github.com/linuxmint/mdm/issues/134

var MDM = (function(global) {
	'use strict';

	var createListener = function(eventName) {
		var callbacks = [];

		global[eventName] = function(a, b, c) {
			debugMsg('llamado ' + eventName);
			callbacks.forEach(function(aCallback) {
				aCallback(a, b, c);
			});
		};

		return function(aCallback) {
			debugMsg('suscripto a ' + eventName);
			callbacks.push(aCallback);
			return this;
		};
	};


	return {
		// listeners:
		whenAddLanguage: createListener('mdm_add_language'),				// Called by MDM to add a language to the list of languages
		whenAddSession: createListener('mdm_add_session'),					// Called by MDM to add a session to the list of sessions
		whenAddUser: createListener('mdm_add_user'),						// Called by MDM to add a user to the list of users
		whenDisable: createListener('mdm_disable'),							// Called by MDM to disable user input
		whenEnable: createListener('mdm_enable'),							// Called by MDM to enable user input
		whenError: createListener('mdm_error'),								// Called by MDM to show an error
		whenHideShutdown: createListener('mdm_hide_shutdown'),				// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
		whenHideSuspend: createListener('mdm_hide_suspend'),				// Called by MDM if the SUSPEND command shouldn't appear in the greeter
		whenHideRestart: createListener('mdm_hide_restart'),				// Called by MDM if the RESTART command shouldn't appear in the greeter
		whenHideQuit: createListener('mdm_hide_quit'),						// Called by MDM if the QUIT command shouldn't appear in the greeter
		whenHideXdmcp: createListener('mdm_hide_xdmcp'),					// Called by MDM if the XDMCP command shouldn't appear in the greeter
		whenMessage: createListener('mdm_msg'),								// Called by MDM to show a message (usually "Please enter your username")
		whenNoEcho: createListener('mdm_noecho'),							// Called by MDM to allow the user to input a password
		whenPrompt: createListener('mdm_prompt'),							// Called by MDM to allow the user to input a username 
		whenSetClock: createListener('set_clock'),							// Called by MDM to update the clock
		whenSetCurrentLanguage: createListener('mdm_set_current_language'),	// Called by MDM to set the current language
		whenSetCurrentUser: createListener('mdm_set_current_user'),			// Called by MDM to set the current user
		whenSetWelcomeMessage: createListener('set_welcome_message'),		// Called by MDM to set the welcome message
		whenTimed: createListener('mdm_timed'),								// Called by MDM to show a timed login countdown

		// actions:
		setUser: function(userName) {
			alert('USER###' + userName);
			return this;
		},
		setPassword: function(password) {
			alert('LOGIN###' + password);
			return this;
		},
		setSession: function(sessionName, sessionFile) {
			alert('SESSION###' + sessionName + '###' + sessionFile);
			return this;
		},
		setLanguage: function(languageCode) {
			alert('LANGUAGE###' + languageCode);
			return this;
		},
		shutdown: function(force) {
			alert((force ? 'FORCE-': '') + 'SHUTDOWN###');
			return this;
		},
		restart: function(force) {
			alert((force ? 'FORCE-': '') + 'RESTART###');
			return this;
		},
		suspend: function(force) {
			alert((force ? 'FORCE-': '') + 'SUSPEND###');
			return this;
		},
		quit: function() {
			alert('QUIT###');
			return this;
		}
	};
})(new Function('return this')());
