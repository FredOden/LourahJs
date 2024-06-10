
console = {
  log : (t) => {Activity.reportError(t);}
  }


Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    return false
    });

var context = Activity.getApplicationContext();

try {
  Activity. importScript(Lourah.jsFramework.dir() + '/EGL20.LightingColoredCubeDemo.js');
  } catch(e) {
  Activity. reportError("Opengl::" + e);
  }

/*
Activity.requestWindowFeature(
  android.view.Window.FEATURE_NO_TITLE
  );
*/

/*
function $F(v) {
  return (new java.lang.Float(v)).floatValue();
  }

console.log(
  "android.app.Context.ACTIVITY_SERVICE::"
  + context.ACTIVITY_SERVICE);

var am = context.getSystemService(
  context.ACTIVITY_SERVICE
  );

var info = am.getDeviceConfigurationInfo();


console.log("info.reqGlEsVersion::" + info.reqGlEsVersion.toString(16));


var GLSurfaceView = android.opengl.GLSurfaceView;

var GLES20 = android.opengl.GLES20;

var previousX = 0;
var previousY = 0;
var TOUCH_SCALE_FACTOR = 180/320;

var myRenderer = new MyRenderer();

var glSurfaceView = new GLSurfaceView(context);
glSurfaceView.setEGLContextClientVersion(2);
glSurfaceView.setRenderer(
  myRenderer
  );
glSurfaceView.setRenderMode(
  GLSurfaceView.RENDERMODE_WHEN_DIRTY
  );
glSurfaceView.setOnTouchListener({
    onTouch: (view, me) => {
      var action = me.getAction() & android.view.MotionEvent.ACTION_MASK;
      //console.log("action::" + action + "::(" + me.getX() + "," + me.getY() + ")");
      if (action === android.view.MotionEvent.ACTION_MOVE){
        console.log("moved::("
            + me.getX()
            + ","
            + me.getY()
            + ")"
          );

        var x = me.getX();
        var y = me.getY();

        var dx = x - previousX;
        var dy = y - previousY;

        if (y > view.getHeight() / 2) {
          dx = dx * -1;
          }

        if (x < view.getWidth() / 2) {
          dy = dy * -1;
          }

        myRenderer.setAngle(
          myRenderer.getAngle()
          + (dx + dy)*TOUCH_SCALE_FACTOR
          );
        view.requestRender();

        return true;
        }
      return true;
      }
    });

Activity.setTitle("OpenGL test");
Activity.setContentView(glSurfaceView);


function MyRenderer() {
  var angle = 0;
  var triangle = new Triangle();
  this.onSurfaceCreated = (gl10, eglConfig) => {
    try {
      console.log("onSurfaceCreated");
      GLES20.glClearColor(
        $F(.1), $F(1), $F(.1), $F(1)
        );
      } catch (e) {
      console.log("MyRenderer::onSurfaceCreated::" + e + "::" + e.stack);
      }
    };
  this.onDrawFrame = (gl10) => {
    try {
      console.log("onDrawFrame");
      triangle.draw();
      } catch(e) {
      console.log("MyRenderer::onDrawFrame::" + e + "::" + e.stack);
      }
    };
  this.onSurfaceChanged = (gl10, width, height) => {
    try {
      console.log("onSurfaceChanged::(" + width + "," + height + ")");
      GLES20.glViewport(0, 0, width, height);
      } catch(e) {
      console.log("MyRenderer::onSurfaceChanged::" + e + "::" + e.stack);
      }
    };
  this.getAngle = () => angle;
  this.setAngle = (a) => angle = a;

  }

function loadShader(type, shaderCode) {
  var shader = GLES20.glCreateShader(type);
  GLES20.glShaderSource(shader, shaderCode);
  GLES20.glCompileShader(shader);
  return shader;
  }

function makeFloatArray(jsArray) {

  var fb = java.nio.FloatBuffer.allocate(
    jsArray.length
    );
  for (var i = 0; i < jsArray.length; i++) {
    fb.put($F(jsArray[i]));
    }
  return fb.array();
  }

function Triangle() {

  var vertexShaderCode =
  "attribute vec4 vPosition;"
  + "void main() {"
    + "gl_position = vPosition"
    + "}"
  ;

  var fragmentShaderCode =
  "precision mediump float;"
  + "uniform vec4 vColor;"
  + "void main() {"
    + "gl_FragColor = vColor;"
    + "}"
  ;

  var mProgram;

  var vertexShader = loadShader(
    GLES20.GL_VERTEX_SHADER
    , vertexShaderCode
    );

  var fragmentShader = loadShader(
    GLES20.GL_FRAGMENT_SHADER
    , fragmentShaderCode
    );

  mProgram = GLES20.glCreateProgram();
  GLES20.glAttachShader(mProgram, vertexShader);
  GLES20.glAttachShader(mProgram, fragmentShader);

  GLES20.glLinkProgram(mProgram);


  var COORDS_PER_VERTEX = 3;


  var triangleCoords = makeFloatArray([
      0, 0.62200845, 0
      , -0.5, -0.311004243, 0
      , 0.5, -0.311004243, 0
      ]);

  console.log(triangleCoords[3]);

  var color = makeFloatArray(
    [ 1.0, 0, 0, 1.0 ]
    );

  var bb = java.nio.ByteBuffer.allocateDirect(
    triangleCoords.length * 4
    );
  bb.order(java.nio.ByteOrder.nativeOrder());
  var vertexBuffer = bb.asFloatBuffer();
  vertexBuffer.put(triangleCoords);
  vertexBuffer.position(0);

  var positionHandle;
  var colorHandle;

  var vertexCount = triangleCoords.length/COORDS_PER_VERTEX;
  var vertexStride = COORDS_PER_VERTEX * 4;

  this.draw = () => {
    GLES20.glUseProgram(mProgram);
    positionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition");
    GLES20.glEnableVertexAttribArray(positionHandle);
    GLES20.glVertexAttribPointer(
      positionHandle
      , COORDS_PER_VERTEX
      , GLES20.GL_FLOAT
      , false
      , vertexStride
      , vertexBuffer
      );

    colorHandle = GLES20.glGetUniformLocation(mProgram, "vColor");
    GLES20.glUniform4fv(
      colorHandle
      , 1
      , color
      , 0
      );

    GLES20.glDrawArrays(
      GLES20.GL_TRIANGLES
      , 0
      , vertexCount
      );

    GLES20.glDisableVertexAttribArray(positionHandle);
    }


  }

/**/

/*
var MyGLSurfaceView = new JavaAdapter(
  GLSurfaceView
  , {

    }
  );
*/
