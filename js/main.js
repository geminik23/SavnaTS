(function () {
    var aid = $avna.Application.Initialize("myCanvas");
    var app = $avna.Application.GetApplication(aid);
    if (app.isInitialized()) {
        //app.setInitializePage(new Justpage());	
        app.start();
    }
})();
//# sourceMappingURL=main.js.map