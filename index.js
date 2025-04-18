let device, server, service, characteristic;
let bleDevice;
let bleServer;
let uartService;
let txChar, rxChar;

const NUS_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
const TX_CHAR_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e'; // ESP32 sends -> Web
const RX_CHAR_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e'; // Web sends -> ESP32

async function connectBLE() {
    try {
        bleDevice = await navigator.bluetooth.requestDevice({
            filters: [{
                namePrefix: "SpiderXBot"
            }],
            optionalServices: [NUS_SERVICE_UUID]
        });

        bleServer = await bleDevice.gatt.connect();
        uartService = await bleServer.getPrimaryService(NUS_SERVICE_UUID);
        txChar = await uartService.getCharacteristic(TX_CHAR_UUID);
        rxChar = await uartService.getCharacteristic(RX_CHAR_UUID);

        console.log("Đã kết nối Bluetooth");
    } catch (error) {
        console.log("Chưa kết nối Bluetooth");
    }
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
    console.log("Voice Command Activated!");
    sendToESP32("voice");
}

function obstacleAvoid() {
    console.log("Obstacle Avoid Activated!");
    sendToESP32("avoid");
}

// Function for Program Page
function startProgram() {
    console.log("Start Program");
    sendToESP32("start program");
}

function program() {
    console.log("Connect to Wifi")
    sendToESP32("connect wifi")
}

function reset() {
    console.log("Reset and Disconnect wifi")
    sendToESP32("reset")
}

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            // Trigger event contentLoaded sau khi tải xong
            document.dispatchEvent(new Event('contentLoaded'));
        })
        .catch(error => console.error('Error loading page:', error));
}

// Khởi tạo editor khi nội dung mới được tải
document.addEventListener('contentLoaded', function() {
    initializeEditor();
});