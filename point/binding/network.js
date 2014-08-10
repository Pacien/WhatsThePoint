/*
 *	This file is part of "What's The Point" <https://github.com/Pacien/WhatsThePoint>
 *	Copyright (C) 2014  Pacien TRAN-GIRARD
 *
 *	"What's The Point" is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU Affero General Public License as
 *	published by the Free Software Foundation, either version 3 of the
 *	License, or (at your option) any later version.
 *
 *	"What's The Point" is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU Affero General Public License for more details.
 *
 *	You should have received a copy of the GNU Affero General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

define(["control/control", "libs/webcastor/webcastor"], function (control, webcastor) {

	var network = {

		init: function (settings) {
			webcastor.init(settings, function (socket) {
				network.bindEvents();
			});
		},

		/* network -> local */
		bindEvents: function () {
			webcastor.on("message", function (message) {
				var event = JSON.parse(message);
				control.dispatchEvent(event.event, event.eventDetail, false);
			});
		},
	};

	return network;

});
