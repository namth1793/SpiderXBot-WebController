// Initialize CodeMirror
function initializeEditor() {
    if (document.getElementById("codeEditor")) {
        // Kiểm tra xem editor đã tồn tại chưa
        if (window.editor) {
            window.editor.toTextArea(); // Hủy editor cũ
        }
        
        var editor = CodeMirror.fromTextArea(document.getElementById("codeEditor"), {
            mode: "python",
            theme: "monokai",
            lineNumbers: true,
            indentUnit: 4,
            smartIndent: true,
            lineWrapping: true
        });
        window.editor = editor; // Lưu editor vào window để có thể truy cập từ các hàm khác
    }
}

function showStatus(message, isError = false) {
    const statusDiv = document.getElementById("status");
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = "status " + (isError ? "error" : "success");
    }
}

async function uploadCode() {
    sendToESP32("upload");
    if (!window.editor) {
        showStatus("Editor not initialized", true);
        return;
    }

    const code = window.editor.getValue();
    try {
        showStatus("Connecting to robot...");
        
        // Send code to ESP32S3 via HTTP POST
        const response = await fetch('http://192.168.1.1/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: code
        });

        if (!response.ok) {
            throw new Error('Failed to upload code');
        }

        showStatus("Code uploaded and running successfully!");
    } catch (error) {
        showStatus("Error: " + error.message, true);
    }
}

function modelAI() {
    alert("Open AI Model!");
}

// Khởi tạo editor khi trang được tải lần đầu
document.addEventListener('DOMContentLoaded', function() {
    initializeEditor();
});

// Khởi tạo editor khi nội dung mới được tải
document.addEventListener('contentLoaded', function() {
    initializeEditor();
});

// Khởi tạo editor khi trang được tải lại
window.addEventListener('load', function() {
    initializeEditor();
});