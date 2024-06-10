/**
 * Lourah.android.games.Screen
 *
 * manage a "game" screen for grphical
 * app like game or other utility
 *
 * provides: screen height & width
 *.          and (Image)View registration
 *.          and placement.
 */
var Lourah = Lourah || {};
( function () {
	Lourah.android = Lourah.android || {};
	Lourah.android.games = Lourah.android.games || {};
	if (Lourah.android.games.Screen) {return;}

	Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.graphics.g2d.js');
    Activity.importScript(Lourah.jsFramework.parentDir() + '/Lourah.android.graphics.Paint.js');
    

	var context = Activity.getApplicationContext();

	Lourah.android.games.Screen = function (activity) {
		var panes = [];
		var metrics = new android.util.DisplayMetrics();
		activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
		var layout = new android.widget.RelativeLayout(context);
		//layout.setOrientation(android.widget.LinearLayout.VERTICAL);
		this.getWidth = () => metrics.widthPixels;
		this.getHeight = () => metrics.heightPixels;
		this.getMetrics = () => metrics;
		this.getContext = () => context;
		this.getLayout = () => layout;
		this.getPanes = () => panes;
		this.addPane = (pane) => {
			try {
				if (!pane.getFrame.relativePane) {
					layout.addView(pane.getView(), pane.getFrame().layoutParams);
				} else {
					layout.addView(pane.getView(), pane.getFrame().layoutParams, pane.getFrame().relativePane.getId());
				}
				pane.create();
				panes.push(pane);
			} catch(e) {
				Activity.reportError("Lourah.android.games.Screen::addPane::" + e);
			}
		}
	}
	Lourah.android.games.Screen.Pane = function(widget) {
      
		var imageView = widget?new widget(context):new android.widget.ImageView(context);
		var bitmap;
		var canvas;
		var handler;
      var source;
      this.setSource = (sourceFile) => source = sourceFile;
  var name = "pane";
      this.getName = () => name;
      this.setName = (n) => name = n;
		var onTouchListener;
		var id = android.view.View.generateViewId();
		imageView.setId(id);
		this.getId = () => id;
		var frame = null;
		var self = this;
		this.getView = () => imageView;
		this.getCanvas = () => canvas;
		this.setHeigth = (height) => imageView.getLayoutParams().setHeight = height;
		this.setWidth = (width) => imageView.getLayoutParams().setWidth = width;
		this.getFrame = () => frame;
		this.getWidth = () => frame.width
		this.getHeight = () => frame.height
		this.setFrame = (x, y, width, height, rPane) => {
			frame = {
				layoutParams : new android.widget.RelativeLayout.LayoutParams(width, height)
			};
			frame.layoutParams.leftMargin = x;
			frame.layoutParams.topMargin = y;
			frame.relativePane = rPane;
			if (rPane) {
				// Add a rule to layoutParams for alignment
			}
			frame.x =x;
			frame.y =y;
			frame.width = width;
			frame.height = height;
		}

		this.setHandler = (h) => handler = h;
		this.updateFrame = () => imageView.setLayoutParams(frame.layoutParams);

		this.setOnTouchListener = (otl) => {
			onTouchListener = otl;
			imageView.setOnTouchListener({
				onTouch: (view, motionEvent) => {
					try {
						var r = onTouchListener(self, motionEvent);
						if (typeof r !== "boolean") throw "onTouch must return a boolean, returned value is <" + r + ">";
						return r;
					} catch(e) {
						console.log("Lourah.android.games.Screen.Pane:;" + "pane" + "::onTouch::" + e + "::" + e.stack);
						return false;
					}
				}
			});
		}

		this.flush = () => Lourah.jsFramework.uiThread(() => imageView.setImageBitmap(bitmap));

		this.rotate = (degree) => (Lourah.jsFramework.uiThread(() => {
			try {
				var matrix = new android.graphics.Matrix();
				imageView.setScaleType(android.widget.ImageView.ScaleType.MATRIX)
				matrix["postRotate(float,float,float)"](
					degree
					,frame.width/2
					,frame.height/2
				);
				imageView.setImageMatrix(matrix);
			} catch(e) {
				Activity.reportError("Lourah.android.games.Screen.Pane::rotate::" + e + "::" + e.stack);
			}
		}))

		this.create = () => {
			try {
				var viewTreeObserver = imageView.getViewTreeObserver();
				if (!viewTreeObserver.isAlive()) {
					viewTreeObserver = imageView.getViewTreeObserver();
				}
				var gll;
				viewTreeObserver.addOnGlobalLayoutListener(gll = {
					onGlobalLayout:() => {
						try {
							// BEWARE the variable viewTreeObserver might not reference the appropriate ViewTreeObserver instance
							//        better to require the correct one from view.getViewTreeObserver()
							imageView.getViewTreeObserver().removeOnGlobalLayoutListener(gll);
                  if (source) {
                    var sBitmap = android.graphics.BitmapFactory.decodeFile(source.getAbsolutePath());
                    // to mutable
                    //bitmap = sBitmap.copy(android.graphics.Bitmap.Config.ARGB_8888, true);
                    bitmap = android.graphics.Bitmap.createScaledBitmap(sBitmap, imageView.width, imageView.height, false);
                    } else {
							bitmap = android.graphics.Bitmap.createBitmap(imageView.width, imageView.height, android.graphics.Bitmap.Config.ARGB_8888);
                    }
							canvas = new android.graphics.Canvas(bitmap);
							//imageView.setImageBitmap(bitmap);
							if (handler) {
								var tHandler = new java.lang.Thread({
									run:() => {
										try {
											handler(self);
										}  catch(e) {
											Activity.reportError("Lourah.android.games.Screen.Pane::threaded handler::" + e);
										}
									}
								});
								tHandler.start();
							}
						} catch (e) {
							Activity.reportError("Lourah.android.games.Screen.Pane::onGlobalLayout::Error::" + e);
						}
					}
				});
			} catch(e) {
				Activity.reportError("Lourah.android.games.Screen.Pane::Error::" + e);
			}
		}
	}

})();
