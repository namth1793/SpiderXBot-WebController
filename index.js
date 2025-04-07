let device, server, service, characteristic;
let bleDevice;
let bleServer;
let uartService;
let txChar, rxChar;

const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // ESP32 sends -> Web
const RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Web sends -> ESP32

async function connectBLE() {
    bleDevice = await navigator.bluetooth.requestDevice({
        filters: [{
            namePrefix: "ESP32S3"
        }],
        optionalServices: [NUS_SERVICE_UUID]
    });

    bleServer = await bleDevice.gatt.connect();
    uartService = await bleServer.getPrimaryService(NUS_SERVICE_UUID);
    txChar = await uartService.getCharacteristic(TX_CHAR_UUID);
    rxChar = await uartService.getCharacteristic(RX_CHAR_UUID);

    console.log("Connected to ESP32 over BLE");
}

async function sendToESP32(text) {
    const encoder = new TextEncoder();
    await rxChar.writeValue(encoder.encode(text));
    console.log("Sent:", text);
}

function moveForward() {
    console.log("Moving");
    sendToESP32("forward");
}

function moveLeft() {
    console.log("Moving");
    sendToESP32("left");
}

function moveStop() {
    console.log("Moving");
    sendToESP32("stop");
}

function moveRight() {
    console.log("Moving");
    sendToESP32("right");
}

function moveBackward() {
    console.log("Moving");
    sendToESP32("backward");
}

function voiceCommand() {
    console.log("Voice Command activated");
    sendToESP32("voice");
}

function obstacleAvoid() {
    console.log("Obstacle Avoid activated");
    sendToESP32("avoid");
}

// Function for Program Page
function startProgram() {
    console.log("Start Program");
    sendToESP32("start program");
}

function resetProgram() {
    console.log("Reset Program");
    sendToESP32("reset program");
}

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
        })
        .catch(error => console.error('Error loading page:', error));
}