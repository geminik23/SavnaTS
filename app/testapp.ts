namespace TestApp {

	export class Rectangle extends $avna.ui.core.UIComponent {
		protected drawOverride(g: $avna.Graphics): boolean {
			
			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(rect.x, rect.y, 100,100);
			return false;
		}
	}

	export class MainPage extends $avna.ui.core.Page {
		
		initializeUI(): void {
			let rect = new Rectangle();
			rect.x = 100;
			rect.y = 200;
			this.addChild(rect);
		}

		drawOverride(g: $avna.Graphics): boolean {
			let ctx = g.context;
			let rect = g.boundRect;
			ctx.fillStyle = "#000000";
			ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
			
			return false;
		}
	}
}