class DeviceManager {
    constructor() {
        this.deviceContainer = document.getElementById('device');
    }

    init() {
        this.renderDeviceGroups();
    }

    renderDeviceGroups() {
        let html = `
            <div class="device-groups">
                <div class="device-group">
                    <div class="group-header">
                        <h3>Device</h3>
                    </div>
                    <div class="group-content">
                        <div class="device-item">
                            <div class="device-info">
                                <span class="device-name">选择推理显卡</span>
                                <select class="device-combo-box"></select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.deviceContainer.innerHTML = html;
        this.renderComboBox();
    }

    renderComboBox() {
        const comboBox = document.querySelector('.device-combo-box');
        // 调用函数填充组合框内容
        this.updateComboBox(comboBox, []);
        // 设置组合框宽度为父容器宽度减去 10px
        this.setComboBoxWidth(comboBox);
    }

    updateComboBox(comboBox, items) {
        comboBox.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            comboBox.appendChild(option);
        });
    }

    setComboBoxWidth(comboBox) {
        // 获取父容器宽度
        const parentWidth = comboBox.parentElement.offsetWidth;
        // 设置组合框宽度为父容器宽度减去 10px
        comboBox.style.width = `${parentWidth - 10}px`;
    }
}