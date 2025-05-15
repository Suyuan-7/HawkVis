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
                                <span class="device-name">显卡</span>
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
        // 设置组合框宽度自适应
        this.makeComboBoxAdaptive(comboBox);
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

    makeComboBoxAdaptive(comboBox) {
        // 获取组合框中的选项
        const options = comboBox.options;
        let maxWidth = 0;

        // 计算选项中的最大宽度
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const width = option.text.length * 8; // 简单估算宽度，根据实际需要调整
            if (width > maxWidth) {
                maxWidth = width;
            }
        }

        // 设置组合框宽度为最大选项宽度
        if (maxWidth > 0) {
            comboBox.style.width = maxWidth + 'px';
        } else {
            // 如果没有选项，设置一个默认宽度
            comboBox.style.width = '150px';
        }
    }
}