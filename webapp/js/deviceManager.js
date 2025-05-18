class DeviceManager_Wrapper {
    constructor() {
        this.deviceContainer = document.getElementById('device');
        this.comboBox = null;
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
        this.comboBox = document.querySelector('.device-combo-box');
        this.updateComboBox([]);
        this.setComboBoxWidth(this.comboBox);
    }

    updateComboBox(items) {
        if (!this.comboBox) return;
        this.comboBox.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.value;
            option.textContent = item.text;
            this.comboBox.appendChild(option);
        });
    }

    setComboBoxWidth(comboBox) {
        if (!comboBox) return;
        const parentWidth = comboBox.parentElement.offsetWidth;
        comboBox.style.width = `${parentWidth - 10}px`;
    }

    updateGpuComboBox(gpuList) {
        if (!this.comboBox) return;

        const gpuOptions = gpuList.map(gpu => ({
            value: gpu,
            text: gpu
        }));

        this.updateComboBox(gpuOptions);
    }
}