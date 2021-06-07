/**
* Variables de configuración del juego
*/

const opciones = {
	top_left: {
		id: "top_left"
	},
	top_right: {
		id: "top_right"
	},
	bottom_left: {
		id: "bottom_left"
	},
	bottom_right: {
		id: "bottom_right"
	},
};

const estadoJuego = {
	intervalos: {
		inicio: 1000,
		paso: 400
	},
	segundosInicio: 3,
	interaciones: false,
	secuenciaJuego: [],
	secuenciaUsuario: [],
	nivelJuego: 0,
	nivelUsuario: 0,
	opciones,
};

/**
* Referencias del DOM
*/

const botonesDelJuego = document.querySelectorAll(".simon-button");

/**
 * Funciones de referencia
*/

const activarElemento = (elementoDOM) => {
	elementoDOM.classList.add('active');
};

const mostrarElemento = (elementoDOM) => {	
	elementoDOM.classList.add('show');
	elementoDOM.classList.remove('hide');
};

const desactivarElemento = (elementoDOM) => {
	elementoDOM.classList.remove('active')
}

const ocultarElemento = (elementoDOM) => {
	elementoDOM.classList.add('hide');
	elementoDOM.classList.remove('show');
};

const activarElementos = (elementos) => {
	elementos.forEach(activarElemento);
};

const desactivarElementos = (elementos) => {
	elementos.forEach(desactivarElemento);
};

// iteracciones

function activarInteracciones () {
	const elementoApp = window.document.getElementById('app');
	elementoApp.classList.remove('app-background-dark');

	const elementoTexto = window.document.getElementById('turno_texto');
	mostrarElemento(elementoTexto);
	elementoTexto.textContent = 'tu turno';

	estadoJuego.interaciones = true; 
};

function desactivarInteracciones () {
	const elementoApp = window.document.getElementById('app');
	elementoApp.classList.add('app-background-dark');

	const elementoTexto = window.document.getElementById('turno_texto');
	ocultarElemento(elementoTexto);

	estadoJuego.interaciones = false; 
};

function accionModalInicio () {
	const inputDom = window.document.getElementById('nombre_jugador');
	const nombreJugador = inputDom.value;

	const permitirAcceso = nombreJugador.length;

	if (permitirAcceso) {
		const elementoModalInicio = window.document.getElementById('inicio_juego');
		ocultarElemento(elementoModalInicio); 

		const elementoNombre = window.document.getElementById('nombre_usuario');
		elementoNombre.textContent = nombreJugador;
		window.localStorage.setItem('nombre', nombreJugador);

		inicializacion();
	};
};

function accionModalFin () {
	const elementoModalFinal = window.document.getElementById('fin_juego');
	ocultarElemento(elementoModalFinal);

	inicializacion();
};



const clickBoton = (id) => {

	if (!estadoJuego.interaciones) {
		return;
	};

	estadoJuego.secuenciaUsuario.push(id);

	const secuenciaJuegoEstaEtapa = estadoJuego.secuenciaJuego[estadoJuego.nivelUsuario];
	const secuenciaUsuarioEstaEtapa = estadoJuego.secuenciaUsuario[estadoJuego.nivelUsuario];

	if (secuenciaJuegoEstaEtapa === secuenciaUsuarioEstaEtapa) { //Se validan resultados y se pasa al siguiente nivel
		estadoJuego.nivelUsuario = estadoJuego.nivelUsuario + 1;	
	} else { //Aca el juego termina
		const elementoJuego = window.document.getElementById('juego');
		ocultarElemento(elementoJuego);
	

		desactivarInteracciones();

		const elementoModalFinal = document.getElementById('fin_juego');
		mostrarElemento(elementoModalFinal);

		const puntajeDom = window.document.getElementById('puntaje');
		const puntaje = estadoJuego.nivelUsuario
		const puntajeFinal = puntaje - 1
		puntajeDom.textContent = ("Tu puntaje es: " + puntajeFinal);

		return ;
		
	};
	
	if (estadoJuego.nivelJuego === estadoJuego.nivelUsuario) {
		desactivarInteracciones();

		estadoJuego.secuenciaUsuario = [];

		estadoJuego.nivelUsuario = 0;
	
		reproducirSecuencia();	

	};
};


const obtenerElementoAleatorio = () => {
	const opcionesIds = Object.keys(estadoJuego.opciones);
	const idAleatorio = opcionesIds[Math.floor(Math.random() * opcionesIds.length)];

	return estadoJuego.opciones[idAleatorio];
};

const reproducirSecuencia = () => {
	let paso = 0;

	estadoJuego.secuenciaJuego.push(obtenerElementoAleatorio().id);
	estadoJuego.nivelJuego = estadoJuego.nivelJuego + 1;

	const intervalo = setInterval(() => {
		const pausaPaso = paso % 2 === 1;

		const finReproduccion = paso === (estadoJuego.secuenciaJuego.length * 2);

		if (pausaPaso) {
			desactivarElementos(botonesDelJuego);
			paso++;
			return;
		}

		if (finReproduccion) {
			clearInterval(intervalo);
			desactivarElementos(botonesDelJuego);
			activarInteracciones();
			return;
		};

		const id = estadoJuego.secuenciaJuego[paso / 2];
		const referenciaDOM = window.document.getElementById(id);
		activarElemento(referenciaDOM);
		
		paso++;

		return;

	}, estadoJuego.intervalos.paso);
};

const inicializacion = () => {
	let segundosInicio = estadoJuego.segundosInicio;

	estadoJuego.secuenciaJuego = [];
	estadoJuego.secuenciaUsuario = [];
	estadoJuego.nivelJuego = 0;
	estadoJuego.nivelUsuario = 0;

	const elementoJuego = window.document.getElementById('juego');
	mostrarElemento(elementoJuego);

	const elementoCuentaRegresiva = document.getElementById('cuenta_regresiva');
	mostrarElemento(elementoCuentaRegresiva);
	elementoCuentaRegresiva.textContent = segundosInicio;

	const intervalo = setInterval (() => {
		segundosInicio--;

		elementoCuentaRegresiva.textContent = segundosInicio;

		if (segundosInicio === 0) {
			ocultarElemento(elementoCuentaRegresiva);
			reproducirSecuencia();
			clearInterval(intervalo);
		}
	}, estadoJuego.intervalos.inicio);
};

const nombreJugadorStorage = window.localStorage.getItem('nombre');
const nombre = document.getElementById('nombre_jugador');
nombre.value = nombreJugadorStorage || '';
