
namespace Test {
	export class Testpage(){
	
	}
}

(() => {
	
	$avna.Application.Initialize("myCanvas",
		(err: $avna.AppError, app: $avna.IApplication) => {
			if (err) return;

			if (app && app.isInitialized()) {
				// set something

				app.start();
			}
		});
	//let app = $avna.Application.GetApplication($avna.Application.Initialize("myCanvas"));

	//if (app.isInitialized()) {
	//	//app.setInitializePage(new TestPage());	
	//	app.start();
	//}
})();