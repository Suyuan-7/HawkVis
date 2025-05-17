document.addEventListener('DOMContentLoaded', () => {
    // 页面加载完成后立即连接 WebSocket
    ljws();
});

var isopen = false, ws;

function createWebSocketErrorStyles() {
    const style = document.createElement('style');
    style.id = 'ws-error-styles';
    style.textContent = `
        .ws-error-message-box {
            position: fixed;
            top: 70%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff3cd; /* 橙色背景 */
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            padding: 20px;
            z-index: 9999;
            width: 80%;
            max-width: 400px;
            text-align: center;
        }
        .ws-error-header {
            margin: 0 0 15px 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .ws-error-header h3 {
            margin: 0;
            color: #ff9500;
            font-size: 18px;
        }
        .ws-error-icon {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            color: #ff9500;
        }
        .ws-error-content {
            margin: 0;
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

function rizhi(neirong, color) {
    const cmdElement = document.getElementById('cmd');
    cmdElement.innerHTML += `<div style='color: ${color};font-size: 12px;'>${neirong}</div>`;
}

function ljws() {
    const ID = "ws://127.0.0.1:48690";
    if ("WebSocket" in window) {
        ws = new WebSocket(ID);
        ws.onerror = function() {
            createWebSocketErrorMessageBox("连接服务端失败,请检查后端是否已经启动!");
        };
        ws.onopen = function() {
            //连接成功
            isopen = true;
        };
        ws.onmessage = function(evt) {
            //接收信息
            const received_msg = evt.data;
            rizhi("服务器发送：","blue");
			rizhi(received_msg,"blue");
            isopen = true;
        };
        ws.onclose = function() {
            //连接断开
            isopen = false;
        };
    } else {
        createWebSocketErrorMessageBox("你的浏览器不支持 WebSocket");
        isopen = false;
    }
}

function createWebSocketErrorMessageBox(message) {
    const existingBox = document.getElementById('ws-error-message-box');
    if (existingBox) return;
    const existingStyle = document.getElementById('ws-error-styles');
    if (!existingStyle) createWebSocketErrorStyles();
    const messageBox = document.createElement('div');
    messageBox.id = 'ws-error-message-box';
    messageBox.className = 'ws-error-message-box';
    messageBox.innerHTML = `
        <div class="ws-error-header">
            <div class="ws-error-icon" style="transform: translateY(-20px);">
                <svg t="1747410431734" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6890" width="64" height="64">
                    <path d="M160.8 833c-37.8 0-63-36.9-44.1-66.6L468 176.6c18.9-32.6 69.3-32.6 88.2 0L906 766.4c18.9 29.8-6.3 66.6-44.1 66.6H160.8z" fill="#FECE31" p-id="6891"></path>
                    <path d="M475.1 672.1c-44.1 44.1 26.8 115 70.9 70.9 47.2-47.2-23.7-118.1-70.9-70.9zM460.9 557.1c0 64.6 100.8 64.6 100.8 0V355.4c0-66.2-100.8-66.2-100.8 0v201.7z" fill="#020202" p-id="6892"></path>
                </svg>
            </div>
        </div>
        <div class="ws-error-content">
            <h3>WebSocket 错误消息</h3>
            <p>${message}</p>
        </div>
    `;
    document.body.appendChild(messageBox);
}

// 模型选择功能
function selectModelHandler() {
    const selectedModel = modelLoader.getModelSelection();
    if (selectedModel) {
        if (isopen && ws) {
            ws.send(`mods<:>${selectedModel}</:>`);
        } else {
            createWebSocketErrorMessageBox("错误: WebSocket 连接未就绪!");
        }
    } else {
        this.showError('未选择模型!')
    }
}