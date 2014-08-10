define(function () {

	var webcastor = {

		STATUS: {
			CONNECTED: "connected",
			NOT_CONNECTED: "notConnected",
			ERROR: "error",
			AUTHENTICATED: "authenticated",
			AUTHENTICATION_ERROR: "authenticationError",
		},

		EVENT: {
			CONNECT: "connect",
			CONNECT_ERROR: "connect_error",
			CONNECT_TIMEOUT: "connect_timeout",
			RECONNECT: "reconnect",
			RECONNECT_ATTEMPT: "reconnect_attempt",
			RECONNECTING: "reconnecting",
			RECONNECT_ERROR: "reconnect_error",
			RECONNECT_FAILED: "reconnect_failed",
			AUTHENTICATED: "authenticated",
			AUTHENTICATION_ERROR: "authentication_error",
		},

		init: function (settings, callback) {
			if (this.callbacks === undefined) {
				this.callbacks = [];
			}

			this.callbacks.push(callback);

			if (this.callbacks.length > 1) {
				return;
			}

			this.createIndicator();
			this.updateIndicator(this.STATUS.NOT_CONNECTED);

			var url = settings.control.remote.webcastorUrl;
			var channel = settings.control.remote.channelId;
			var broadcasterKey = settings.key;

			require([url + "/socket.io/socket.io.js"], function (io) {
				webcastor.io = io;
				webcastor.socket = webcastor.connect(url, channel, broadcasterKey);

				for (var i = 0; i < webcastor.callbacks.length; i++) {
					webcastor.callbacks[i]();
				}
			});
		},

		getColorFromStatus: function (status) {
			switch (status) {
				case this.STATUS.CONNECTED:
					return "transparent";

				case this.STATUS.NOT_CONNECTED:
					return "yellow";

				case this.STATUS.ERROR:
					return "red";

				case this.STATUS.AUTHENTICATED:
					return "green";

				case this.STATUS.AUTHENTICATION_ERROR:
					return "orange";
			}
		},

		getStatusFromEvent: function (event) {
			switch (event) {
				case this.EVENT.CONNECT:
				case this.EVENT.RECONNECT:
					return this.STATUS.CONNECTED;

				case this.EVENT.RECONNECTING:
					return this.STATUS.NOT_CONNECTED;

				case this.EVENT.CONNECT_ERROR:
				case this.EVENT.CONNECT_TIMEOUT:
				case this.EVENT.RECONNECT_ATTEMPT:
				case this.EVENT.RECONNECT_ERROR:
				case this.EVENT.RECONNECT_FAILED:
				case this.EVENT.AUTHENTICATION_ERROR:
					return this.STATUS.ERROR;

				case this.EVENT.AUTHENTICATED:
					return this.STATUS.AUTHENTICATED;

				case this.EVENT.AUTHENTICATION_ERROR:
					return this.STATUS.AUTHENTICATION_ERROR;
			}
		},

		createIndicator: function () {
			this.indicator = document.createElement("s-indicator");

			this.indicator.style.width = "1px";
			this.indicator.style.height = "1px";
			this.indicator.style.position = "absolute";
			this.indicator.style.top = "-1px";
			this.indicator.style.right = "-1px";
			this.indicator.style.transition = "box-shadow 1s";

			document.body.appendChild(this.indicator);
		},

		updateIndicator: function (status) {
			this.indicator.style.boxShadow = "0 0 40px 15px " + this.getColorFromStatus(status);
		},

		bindStatusEvent: function (event, status) {
			this.socket.on(event, function (eventDetail) {
				webcastor.updateIndicator(status);
			});
		},

		bindStatusEvents: function () {
			for (var event in this.EVENT) {
				var eventValue = this.EVENT[event];
				this.bindStatusEvent(eventValue, this.getStatusFromEvent(eventValue));
			}
		},

		connect: function (url, channel, broadcasterKey) {
			if (this.socket !== undefined) {
				return this.socket;
			}

			this.socket = this.io.connect(url, {
				"query": "channel=" + channel + (broadcasterKey !== undefined ? "&password=" + broadcasterKey : ""),
				"force new connection": true,
			});

			this.bindStatusEvents();

			return this.socket;
		},

		on: function (event, handler) {
			this.socket.on(event, function (eventDetail) {
				handler(eventDetail);
			});
		},

		send: function (message) {
			this.socket.send(message);
		},
	};

	return webcastor;

});
