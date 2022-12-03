WL.registerComponent(
	"stick",
	{},
	{
		start: function () {
			this.collider = this.object.getComponent("collision");
			this.objects = [];
			this.check = false;
		},
		update: function () {
			//Collision Detection & Material Change
			let collidingComps = this.collider.queryOverlaps();
			for (let i = 0; i < collidingComps.length; ++i) {
				if (this.check == false) {
					let name = collidingComps[i].object.parent.name || "no name";
					if (name == "bars") {
						collidingComps[i].object
							.getComponent("button")
							.playNote(collidingComps[i].object.name);
						this.hapticFeedback(cursor.object, 0.5, 50);
					}

					this.objects.push(collidingComps[i]);
					this.check = true;
				}
			}
			if (collidingComps.length == 0) {
				this.check = false;
				for (var i = 0; i < this.objects.length; i++) {
					this.objects[i].object.getComponent("button").stopnote();
				}

				this.objects = [];
			}
		},
	},
);
