// --- Elementos del DOM ---
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const message = document.getElementById('message');
const attemptsInfo = document.getElementById('attempts');
const playAgainButton = document.getElementById('playAgainButton');
const guessesList = document.getElementById('guessesList');
const niveleSelect = document.getElementById('difficultySelect');


// --- Variables del Juego ---
let secretNumber;
let attempts;
let MAX_NUMBER = 50
let MIN_NUMBER = 1;
let previousGuess = null;

setDifficulty("facil");

niveleSelect.addEventListener("change", function () {
    setDifficulty(this.value);
    startGame();
});

function setDifficulty(level) {
    if (level === "facil") {
        MAX_NUMBER = 50;
    } else if (level === "medio") {
        MAX_NUMBER = 100;
    } else if (level === "dificil") {
        MAX_NUMBER = 200;
    }
    guessInput.setAttribute("max", MAX_NUMBER);
    guessInput.max = MAX_NUMBER;
}

// --- Funciones ---

// Función para iniciar o reiniciar el juego
function startGame() {
    // Genera un número secreto entre MIN_NUMBER y MAX_NUMBER
    secretNumber = Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
    attempts = 0; // Reinicia los intentos
    previousGuess = null; 

    // Mensajes iniciales y estado de la UI
    guessesList.innerHTML = '';
    message.textContent = '';
    message.className = 'message'; // Quita clases de color
    attemptsInfo.textContent = '';
    guessInput.value = ''; // Limpia el input
    guessInput.disabled = false; // Habilita el input
    guessButton.disabled = false; // Habilita el botón de adivinar
    playAgainButton.style.display = 'none'; // Oculta el botón de jugar de nuevo
    guessInput.focus(); // Pone el foco en el input

    console.log(`Pssst... el número secreto es ${secretNumber}`); // Ayuda para depurar
}

// Función para manejar el intento del usuario
// Función para manejar el intento del usuario
function handleGuess() {
    const userGuessText = guessInput.value;

    // Validar si la entrada está vacía
    if (userGuessText === '') {
        setMessage('Por favor, introduce un número.', 'info');
        return;
    }

    const userGuess = parseInt(userGuessText);

    // Validar si la entrada es un número válido y está en el rango
    if (isNaN(userGuess) || userGuess < MIN_NUMBER || userGuess > MAX_NUMBER) {
        setMessage(`Introduce un número válido entre ${MIN_NUMBER} y ${MAX_NUMBER}.`, 'info');
        guessInput.value = ''; // Limpiar el input inválido
        guessInput.focus();
        return;
    }

    // Incrementar el contador de intentos
    attempts++;
    attemptsInfo.textContent = `Intentos: ${attempts}`;

    const listItem = document.createElement('li');
    listItem.textContent = userGuess;
    guessesList.appendChild(listItem);

    if (attempts < 10) {
        if (userGuess === secretNumber) {
            setMessage(`¡Correcto! 🎉 El número era ${secretNumber}. Lo adivinaste en ${attempts} intentos.`, 'correct');
            endGame();
        } else {
            let hint = "";
            const currentDiff = Math.abs(userGuess - secretNumber);

            // Solo damos pistas de temperatura si no es el primer intento
            if (previousGuess !== null) {
                const previousDiff = Math.abs(previousGuess - secretNumber);

                if (currentDiff < previousDiff) {
                    hint = " ¡Más caliente! 🔥";
                } else if (currentDiff > previousDiff) {
                    hint = " ¡Más frío! 🥶";
                }
            }

            if (userGuess < secretNumber) {
                setMessage("¡Demasiado alto!" + hint, "wrong");
            } else {
                setMessage("¡Demasiado bajo!" + hint, "wrong");
            }
        }
    } else {
        setMessage(`¡Has perdido! El número era ${secretNumber}.`, "wrong");
        endGame();
    }

    // Guardar el intento actual para la próxima comparación
    previousGuess = userGuess; // ¡Esta línea es crucial y faltaba!

    // Limpiar el input para el siguiente intento (si no ha ganado)
    if (userGuess !== secretNumber) {
        guessInput.value = '';
        guessInput.focus();
    }
}

// Función para mostrar mensajes al usuario
function setMessage(msg, type) {
    message.textContent = msg;
    message.className = `message ${type}`; // Añade clase para el color (correct, wrong, info)
}

// Función para terminar el juego (cuando se adivina el número)
function endGame() {
    guessInput.disabled = true; // Deshabilita el input
    guessButton.disabled = true; // Deshabilita el botón de adivinar
    playAgainButton.style.display = 'inline-block'; // Muestra el botón de jugar de nuevo
}

// --- Event Listeners ---

// Escuchar clics en el botón "Adivinar"
guessButton.addEventListener('click', handleGuess);

// Escuchar la tecla "Enter" en el campo de entrada
guessInput.addEventListener('keyup', function (event) {
    // Si la tecla presionada es Enter (código 13)
    if (event.key === 'Enter') {
        event.preventDefault(); // Evita comportamiento por defecto (si estuviera en un form)
        handleGuess(); // Llama a la función de adivinar
    }
});

// Escuchar clics en el botón "Jugar de Nuevo"
playAgainButton.addEventListener('click', startGame);

// --- Iniciar el juego al cargar la página ---
startGame();