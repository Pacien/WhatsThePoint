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

define(["control/control"], function (control) {

	var speech = {

		init: function (settings) {
			if ("speechRecognition" in window || "webkitSpeechRecognition" in window) {
				var recognition = new webkitSpeechRecognition();

				recognition.continuous = true;
				recognition.interimResults = true;
				recognition.lang = settings.speechSettings.lang;

				recognition.onresult = this.onResult;

				recognition.onend = function () {
					recognition.start();
				};

				recognition.start();
			}

			this.sleepDelay = 1500;
			this.wakeupTime = 0;

			this.command = {
				NEXT_SLIDE: settings.speechSettings.keywords.NEXT_SLIDE,
				PREVIOUS_SLIDE: settings.speechSettings.keywords.PREVIOUS_SLIDE,
			};
		},

		onResult: function (speechEvent) {
			var result = event.results[event.resultIndex];

			if (result.isFinal) {
				return;
			}

			var sentence = result[0].transcript.split(" ");
			var command = sentence[sentence.length - 1];
			speech.processCommand(command);
		},

		processCommand: function (speechCommand) {
			if (Date.now() < speech.wakeupTime) {
				return;
			}

			var command = speech.translateCommand(speechCommand);

			if (command === undefined) {
				return;
			}

			speech.wakeupTime = Date.now() + speech.sleepDelay;
			control.dispatchEvent(control.EVENT.GOTO, control.GOTO[command]);
		},

		translateCommand: function (speechCommand) {
			for (var command in speech.command) {
				for (var index in speech.command[command]) {
					if (speechCommand.indexOf(speech.command[command][index]) > -1) {
						return command;
					}
				}
			}
		},
	};

	return speech;

});
