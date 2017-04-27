namespace Test {
	export class Testpage implements $avna.IVisualElement{
		draw(g: $avna.Graphics): void {
			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#000000";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		}
	}
}

(() => {
	$avna.Application.Initialize("myCanvas",
		(err: $avna.AppError, app: $avna.IApplication) => {
			if (err) return;

			if (app && app.isInitialized()) {
				// resize to full-size
				let resize = () => {
					app.setSize(window.innerWidth, window.innerHeight);
				};

				window.onresize = resize;
				resize();

				// app settings
				app.setAnimating(true); // redraw per every frame
				app.setLoopInterval(20); //20ms
				app.setContent(new Test.Testpage());
				
				app.start();
			}
		});
})();