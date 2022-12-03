import {
	getInstrument,
	startNote,
	stopNote,
	instrumentNames,
} from "music-instrument-js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function playInstrument(note) {
	if (note == "Next") {
		index += 1;
		instrumentName = instrumentNames[index];
		getInstrument(instrumentName);
		return;
	}
	if (note == "Previous") {
		index -= 1;
		instrumentName = instrumentNames[index];
		getInstrument(instrumentName);
		return;
	}

	startNote(instrumentName, note, {});
	await delay(500);
	stopNote(instrumentName, note);
}

WL.registerComponent(
	"button",
	{
		hoverMaterial: {type: WL.Type.Material},
	},
	{
		init: function () {
			instrumentNamesTemp = [];
			index = 0;
			instrumentName = "xylophone";
		},
		start: function () {
			this.mesh = this.object.getComponent("mesh");
			this.defaultMaterial = this.mesh.material;

			this.target = this.object.getComponent("cursor-target");
			this.target.addHoverFunction(this.onHover.bind(this));
			this.target.addUnHoverFunction(this.onUnHover.bind(this));
			this.target.addDownFunction(this.onDown.bind(this));
			this.target.addUpFunction(this.onUp.bind(this));

			this.soundClick = this.object.addComponent("howler-audio-source", {
				src: "sfx/click.wav",
				spatial: true,
				volume: 0,
			});
			this.soundUnClick = this.object.addComponent("howler-audio-source", {
				src: "sfx/unclick.wav",
				spatial: true,
				volume: 0,
			});

			let children = this.object.parent.children;
			for (let i = 0; i < children.length; ++i) {
				if (children[i].name == "ToneName") {
					text = children[i].getComponent("text");
				}
			}
		},

		update: function () {
			if (index < 0 || index == null) index = 0;
			if (text) text.text = instrumentName;
		},

		onHover: function (_, cursor) {
			this.mesh.material = this.hoverMaterial;
			if (cursor.type == "finger-cursor") {
				this.onDown(_, cursor);
			}

			this.hapticFeedback(cursor.object, 0.5, 50);

			playInstrument(this.object.name);
		},

		onDown: function (_, cursor) {
			this.soundClick.play();
			this.object.translate([0.0, 0.0, 0.0]);
			this.hapticFeedback(cursor.object, 1.0, 20);
		},

		onUp: function (_, cursor) {
			this.soundUnClick.play();
			this.object.translate([0.0, 0.0, 0.0]);
			this.hapticFeedback(cursor.object, 0.7, 20);
		},

		onUnHover: function (_, cursor) {
			this.mesh.material = this.defaultMaterial;
			if (cursor.type == "finger-cursor") {
				this.onUp(_, cursor);
			}

			this.hapticFeedback(cursor.object, 0.3, 50);
		},

		hapticFeedback: function (object, strength, duration) {
			const input = object.getComponent("input");
			if (input && input.xrInputSource) {
				const gamepad = input.xrInputSource.gamepad;
				if (gamepad && gamepad.hapticActuators)
					gamepad.hapticActuators[0].pulse(strength, duration);
			}
		},
	},
);
