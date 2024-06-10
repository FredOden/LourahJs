Lourah.jsFramework.setOnBackButtonListener(() => {
    console.log("Back Button pressed");
    try {
      Activity.setContentView(null);
      } catch(e) {
      console.log("OnBackButton::" + e);
      }
    return false
    });

var context = Activity.getApplicationContext();
var Matrix = android.opengl.Matrix;


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
var GL10 = android.opengl.GL10;

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
        /*
        console.log("moved::("
            + me.getX()
            + ","
            + me.getY()
            + ")"
          );
        /**/
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

        var angle = myRenderer.getAngle()
        - (dx + dy)*TOUCH_SCALE_FACTOR;

        //console.log("angle::" + angle + "::(" + [dx, dy] + ")");

        previousX = x;
        previousY = y;

        myRenderer.setAngle(angle);
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
  var cube;

  var vPMatrix = java.nio.FloatBuffer.allocate(16).array();
  var projectionMatrix = java.nio.FloatBuffer.allocate(16).array();
  var viewMatrix = java.nio.FloatBuffer.allocate(16).array();
  var rotationMatrix = java.nio.FloatBuffer.allocate(16).array();

  this.onSurfaceCreated = (gl10, eglConfig) => {
    try {
      console.log("onSurfaceCreated::" + gl10);
      GLES20.glClearColor($F(0), $F(.3), $F(0), $F(1));
      //GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT);
      Matrix.setLookAtM(
        viewMatrix, 0
        , 0, 0, -3
        , 0, 0, 0
        , 0, 1, 0
        );

      if (!cube) {
        cube = new Cube();
        }

      console.log("glGetError::" + GLES20.glGetError());
      } catch (e) {
      console.log("MyRenderer::onSurfaceCreated::" + e + "::" + e.stack);
      }
    };

  this.onDrawFrame = (gl10) => {
    try {
      //console.log("onDrawFrame");
      GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);

      Matrix.multiplyMM(
        vPMatrix, 0
        , projectionMatrix, 0
        , viewMatrix, 0
        );

      var scratch = java.nio.FloatBuffer.allocate(16).array();

      Matrix.setRotateM(
        rotationMatrix, 0
        , angle
        , 1, 1, -1
        );

      Matrix.multiplyMM(
        scratch, 0
        , vPMatrix, 0
        , rotationMatrix, 0
        );


      cube.draw(scratch);
      } catch(e) {
      console.log("MyRenderer::onDrawFrame::" + e + "::" + e.stack);
      }
    };

  this.onSurfaceChanged = (gl10, width, height) => {
    try {
      console.log("onSurfaceChanged::(" + width + "," + height + ")");
      GLES20.glViewport(0, 0, width, height);
      var ratio = width/height;
      Matrix.frustumM(
        projectionMatrix, 0
        , -ratio, ratio
        ,-1, 1
        , 1, 10
        );
      } catch(e) {
      console.log("MyRenderer::onSurfaceChanged::" + e + "::" + e.stack);
      }
    };
  this.getAngle = () => angle;
  this.setAngle = (a) => angle = a;

  }



function Cube() {

  function loadShader(type, shaderCode) {
    var shader = GLES20.glCreateShader(type);
    GLES20.glShaderSource(shader, shaderCode);
    GLES20.glCompileShader(shader);
    //console.log("shader::" + shader + "::" + type.toString(16) + "::" + shaderCode);
    return shader;
    }


  var vertexShaderCode =
  "uniform mat4 uMVPMatrix;"
  + "attribute vec4 vPosition;"
  + "void main() {"
    + " gl_Position = uMVPMatrix * vPosition;"
    + "}"
  ;

  var fragmentShaderCode =
  "precision mediump float;"
  + "uniform vec4 vColor;"
  + "void main() {"
    + " gl_FragColor = vColor;"
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

  //console.log("mProgram::" + mProgram);
  GLES20.glLinkProgram(mProgram);
  ;



  var COORDS_PER_VERTEX = 3;



  /*
  var triangleCoords = makeFloatArray([
      0, 0.62200845, 0
      , -0.5, -0.311004243, 0
      , 0.5, -0.311004243, 0
      ]);
  /**/



  var verticeCoords = makeFloatArray([
      -0.5, 0.5, -.5 // top left
      ,-0.5, -0.5, -.5 // bottom left
      ,0.5, -0.5, -.5 // bottom right
      ,0.5, 0.5, -.5 // top right

      ,-0.5, 0.5, 0.5 // top left
      ,-0.5, -0.5, 0.5 // bottom left
      ,0.5, -0.5, 0.5 // bottom right
      ,0.5, 0.5, 0.5 // top right

      ]);

  /**/
  var drawOrder = makeShortArray([
      //p.f.tl, p.f.tr, p.f.br, p.f.tl, p.f.br, p.f.bl
      0, 1, 2, 0, 2, 3
      ,4, 5, 1, 4, 1, 0
      ,6, 4, 7, 6, 5, 4
      ,7, 3, 2, 7, 2, 6
      ,4, 0, 3, 4, 3, 7
      ,1, 5, 6, 1, 6, 2
      ]);


  var color =
    [ 
      makeFloatArray([1, 0.5, 0, 1]) // orange
      , makeFloatArray([1, 0, 1, 1]) // magenta
      , makeFloatArray([0, 1, 0, 1]) // green
      , makeFloatArray([0, 0, 1, 1]) // blue
      , makeFloatArray([1, 0, 0, 1]) // red
      , makeFloatArray([1, 1, 0, 1]) // yellow
      ]
    

  var bb = java.nio.ByteBuffer.allocateDirect(
    verticeCoords.length * 4
    );
  bb.order(java.nio.ByteOrder.nativeOrder());
  var vertexBuffer = bb.asFloatBuffer();
  vertexBuffer.put(verticeCoords);
  vertexBuffer.position(0);


  /*
  var cbb = java.nio.ByteBuffer.allocateDirect(
    color.length * 4
    );
  cbb.order(java.nio.ByteOrder.nativeOrder());
  var colorBuffer = cbb.asFloatBuffer();
  colorBuffer.put(color);
  colorBuffer.position(0);
  /**/

  // Initialize byte buffer for drawing list ByteBuffer
  var dlb = java.nio.ByteBuffer.allocateDirect(
    // (Number of coordinates in corresponding order * 2)short is 2 bytes
    drawOrder.length * 2
    );
  dlb.order(java.nio.ByteOrder.nativeOrder());
  var drawListBuffer = dlb.asShortBuffer();
  drawListBuffer.put(drawOrder);
  drawListBuffer.position(0);


  var positionHandle;
  var colorHandle;

  var vertexCount = verticeCoords.length/COORDS_PER_VERTEX;
  var vertexStride = COORDS_PER_VERTEX * 4;

  this.draw = (mvpMatrix) => {
    GLES20.glUseProgram(mProgram);
    GLES20.glFrontFace(GLES20.GL_CW);
    GLES20.glEnable(GLES20.GL_CULL_FACE);
    GLES20.glCullFace(GLES20.GL_BACK);
    
    positionHandle = GLES20.glGetAttribLocation(mProgram, "vPosition");
    //console.log("positionHandle::" + positionHandle);
    GLES20.glEnableVertexAttribArray(positionHandle);
    GLES20.glVertexAttribPointer(
      positionHandle
      , COORDS_PER_VERTEX
      , GLES20.GL_FLOAT
      , false
      , vertexStride
      , vertexBuffer
      );

    vPMatrixHandle = GLES20.glGetUniformLocation(mProgram, "uMVPMatrix");
    //console.log("vPMatrixHandle::" + vPMatrixHandle);
    GLES20.glUniformMatrix4fv(
      vPMatrixHandle
      , 1
      , false
      , mvpMatrix
      ,0
      );

    colorHandle = GLES20.glGetUniformLocation(mProgram, "vColor");
    //console.log("colorHandle::" + colorHandle);

    faces = drawOrder.length / 6;
    
    for(var face = 0; face < faces; face++) {
      GLES20.glUniform4fv(
        colorHandle
        , 1
        , color[face]
        , 0
        );

      /*
      GLES20.glDrawArrays(
        GLES20.GL_TRIANGLES
        , 0
        , vertexCount
        );
      */

      drawListBuffer.position(face*6);

      GLES20.glDrawElements(
        GLES20.GL_TRIANGLES
        , 6//drawOrder.length
        , GLES20.GL_UNSIGNED_SHORT
        , drawListBuffer
        );
      }

    GLES20.glDisableVertexAttribArray(positionHandle);
    }


  }

// for future Lourah.opengl.js

function $F(v) {
  return (new java.lang.Float(v)).floatValue();
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

function $S(v) {
  return (new java.lang.Short(v)).shortValue();
  }

function makeShortArray(jsArray) {

  var sb = java.nio.ShortBuffer.allocate(
    jsArray.length
    );
  for (var i = 0; i < jsArray.length; i++) {
    sb.put($S(jsArray[i]));
    }
  return sb.array();
  }


function Vertice() {
  var vertice = [];
  var order = [];
  var VERTEX_LENGTH = 3;
  var fVertice;
  var sOrder;

  var buffer;
  var count;
  var stride;

  this.add = function() {
    for (var i = 0; i < arguments.length; i++) {
      var vertex = arguments[i];
      var iv = vertice.indexOf(vertex);
      if (iv === -1) {
        vertice = vertice.concat(arguments[i]);
        iv = vertice.length -1
        }
      order.push(iv);
      }
    };

  this.build= function () {
    var bb = java.nio.ByteBuffer.allocateDirect(
      vertice.length * 4
      );

    fVertice = makeFloatArray(vertice);

    bb.order(java.nio.ByteOrder.nativeOrder());
    buffer = bb.asFloatBuffer();
    buffer.put(fVertice);
    buffer.position(0);

    count = fVertice.length/VERTEX_LENGTH;
    stride = VERTEX_LENGTH * 4;
    };
  }

/*
var MyGLSurfaceView = new JavaAdapter(
  GLSurfaceView
  , {

    }
  );
*/
