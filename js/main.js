//namespace Test {
//	export class Testpage{
//	}
//}
(function () {
    $avna.Application.Initialize("myCanvas", function (err, app) {
        if (err)
            return;
        if (app && app.isInitialized()) {
            // resize to full-size
            var resize = function () {
                app.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight);
            };
            window.onresize = resize;
            resize();
            // app settings
            app.setAnimating(true); // redraw per every frame
            app.setLoopInterval(20); //20ms
            app.start();
        }
    });
})();
//# sourceMappingURL=main.js.map