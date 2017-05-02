namespace TestApp {
	export class MainPage extends $avna.ui.core.Page {

		initializeUI(): void {

		}

		drawOverride(g: $avna.Graphics): boolean {
			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#000000";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);

			return true;
		}
	}
}