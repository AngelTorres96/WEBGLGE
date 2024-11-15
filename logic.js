var canvas = document.getElementById("glcanvas");
var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
    alert("Imposible inicializar WebGL. Tu navegador puede no soportarlo.");
}

gl.clearColor(0.0, 0.0, 0.0, 1.0); // Negro opaco
gl.enable(gl.DEPTH_TEST); // Habilitar prueba de profundidad
gl.depthFunc(gl.LEQUAL); // Objetos cercanos opacan objetos lejanos
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Limpiar el buffer de color y profundidad

//funciones vertex y grafment shader
var vertexShaderSource = `
attribute vec4 aVertexPosition;
void main(void) {
    gl_Position = aVertexPosition;
}`;

var fragmentShaderSource = `
void main(void) {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); // Blanco
}`;


function compileShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Error compilando shader:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

var vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
var fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

var shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.error("Error enlazando programa:", gl.getProgramInfoLog(shaderProgram));
}
gl.useProgram(shaderProgram);

var vertices = new Float32Array([
    0.0,  1.0,  0.0,
   -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
]);

var vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var position = gl.getAttribLocation(shaderProgram, "aVertexPosition");
gl.enableVertexAttribArray(position);
gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);

gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, 3);