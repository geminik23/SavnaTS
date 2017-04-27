var Test;
(function (Test) {
    var Testpage = (function () {
        function Testpage() {
        }
        Testpage.prototype.draw = function (g) {
            var ctx = g.context;
            var rect = g.boundRect;
            ctx.fillStyle = "#000000";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        };
        return Testpage;
    }());
    Test.Testpage = Testpage;
})(Test || (Test = {}));
(function () {
    $avna.Application.Initialize("myCanvas", function (err, app) {
        if (err)
            return;
        if (app && app.isInitialized()) {
            // resize to full-size
            var resize = function () {
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
//# sourceMappingURL=main.js.map