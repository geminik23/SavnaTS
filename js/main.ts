

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
				app.setInitialPage(TestApp.MainPage); // set Initial Stage
				app.start();
				
			}
		});
})();