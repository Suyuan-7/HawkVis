class ModelLoader {
    static LOCAL_MODELS = ['CFM.webp', 'DeltaForce.webp']; // 在此添加新的模型文件名
    currentSelection = null;
    container = document.getElementById('model-container');
    selectModelBtn = document.getElementById('select-model-btn');
    isLoaded = false; // 添加一个标志来检查模型是否已经加载
    canNavigate = false; // 添加一个标志来控制是否允许导航
    isModelLocked = false; // 添加一个标志来检查模型是否已被锁定

    constructor() {
        this.initSelectionHandler();
        this.initSelectModelBtnHandler();
    }

    async load() {
        if (this.isLoaded) return; // 如果模型已经加载，则不再加载
        this.showLoading();
        try {
            await this.renderModels();
            this.isLoaded = true; // 设置模型已加载标志
        } catch (error) {
            this.showError('模型加载失败，请检查images目录');
            this.dispatchEvent(error);
        }
    }

    async renderModels() {
        if(!this.isLoaded)
            return this.isLoaded;
        return new Promise((resolve) => {
            // 模拟模型加载延迟
            setTimeout(() => {
                this.container.innerHTML = this.generateModelCards();
                resolve();
            }, 1000); // 增加延迟时间以模拟模型加载
        });
    }

    generateModelCards() {
        return ModelLoader.LOCAL_MODELS.map(file => `
            <div class="model-card" data-model="${file}">
                <div class="model-image-container">
                    <img src="images/${file}" class="model-image" alt="${this.formatName(file)}" loading="lazy" onerror="this.src='images/default.png'">
                    <img src="icons/chosen.svg" class="chosen-icon" alt="Chosen" style="display:none; position: absolute; bottom: 4px; right: 4px;">
                </div>
                <span class="model-title">${this.formatName(file)}</span>
            </div>
        `).join('');
    }

    initSelectionHandler() {
        this.container.addEventListener('click', (e) => {
            // 检查模型是否已被锁定
            if (this.isModelLocked) {
                this.showToast('模型已锁定，不能选择其他模型');
                return;
            }
            
            const card = e.target.closest('.model-card');
            if (!card) return;

            this.clearSelections();
            this.selectCard(card);
            this.updateSelectModelBtn();
        });
    }

    clearSelections() {
        document.querySelectorAll('.model-card').forEach(card => {
            card.classList.remove('selected');
            const chosenIcon = card.querySelector('.chosen-icon');
            if (chosenIcon) {
                chosenIcon.style.display = 'none';
            }
            card.style.transform = '';
        });
    }

    selectCard(card) {
        card.classList.add('selected');
        const chosenIcon = card.querySelector('.chosen-icon');
        if (chosenIcon) {
            chosenIcon.style.display = 'block';
        }
        this.currentSelection = card.dataset.model;
    }

    formatName(filename) {
        return filename
            .replace(/\.[^.]+$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/(?:^\w|\s\w)/g, m => m.toUpperCase());
    }

    showLoading() {
        this.container.innerHTML = `
            <div class="loading-status">
                <div class="spinner"></div>
                <p>正在加载模型...</p>
            </div>
        `;
    }

    showError(message) {
        this.container.innerHTML = `
            <div class="loading-status">
                <h2 style="color: #ff5555">⚠️ ${message}</h2>
                <button class="reload-button" onclick="location.reload()">重新加载</button>
            </div>
        `;
    }

    dispatchModelSelected() {
        const event = new CustomEvent('model-selected', {
            detail: {
                filename: this.currentSelection,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    dispatchErrorEvent(error) {
        const event = new CustomEvent('model-error', {
            detail: {
                message: error.message,
                stack: error.stack
            }
        });
        document.dispatchEvent(event);
    }

    updateSelectModelBtn() {
        if (this.currentSelection) {
            this.selectModelBtn.disabled = false;
            this.selectModelBtn.style.display = 'flex'; // 显示按钮并设置为flex布局
        } else {
            this.selectModelBtn.disabled = true;
            this.selectModelBtn.style.display = 'flex'; // 即使未选择模型也显示按钮
        }
    }

    initSelectModelBtnHandler() {
        if(!this.isLoaded)
            return;
        this.selectModelBtn.addEventListener('click', () => {
            if (this.currentSelection) {
                this.selectModel();
            } else {
                this.showToast('请先选择模型!');
            }
        });
    }

    selectModel() {
        // 逻辑来处理选定模型后的操作
        console.log('选定模型:', this.currentSelection);
        this.selectModelBtn.style.display = 'none'; // 隐藏按钮
        this.canNavigate = true; // 允许导航到其他菜单分类
        this.isModelLocked = true; // 锁定模型选择
        this.showToast(`已选择${this.getModelSelection()}模型，如需切换模型请刷新页面!`);
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000); // 显示3秒后自动隐藏
    }

    getModelSelection() {
        if (!this.currentSelection) return '';
        const parts = this.currentSelection.split('.');
        return parts[0];
    }
}

// 导入 DeviceManager 类
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
}

class NavigationController {
    constructor() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.panels = document.querySelectorAll('.content-panel');
        this.errorContainer = document.getElementById('global-error');
        this.modelLoader = new ModelLoader();
        this.deviceManager = new DeviceManager(); // 创建 DeviceManager 实例
        this.init();
    }

    init() {
        this.bindEvents();
        this.switchPanel('model-select');
        this.modelLoader.load();
    }

    bindEvents() {
        this.navItems.forEach(item => item.addEventListener('click', (e) => this.handleNavigation(e)));
        this.errorContainer.querySelector('.close-btn').addEventListener('click', () => this.toggleErrorPanel(false));
        document.addEventListener('model-error', (e) => this.showErrorPanel(e.detail.message));
        document.addEventListener('model-selected', () => {
            this.modelLoader.canNavigate = true;
        });
    }

    handleNavigation(e) {
        if (!this.modelLoader.currentSelection && e.currentTarget.dataset.target !== 'model-select') {
            this.modelLoader.showToast('请先选择模型!');
            return;
        }
        if (!this.modelLoader.canNavigate && e.currentTarget.dataset.target !== 'model-select') {
            this.modelLoader.showToast('请先点击“选定模型”按钮!');
            return;
        }
        const target = e.currentTarget.dataset.target;
        this.switchPanel(target);
        if (target !== 'model-select') {
            this.loadContent(target);
        }
    }

    loadContent(target) {
        switch(target) {
            case 'device':
                this.loadDeviceManagement();
                break;
            case 'params':
                this.loadParameterControls();
                break;
            case 'preview':
                this.loadInferencePreview();
                break;
        }
    }

    switchPanel(targetId) {
        this.navItems.forEach(item => {
            item.classList.remove('active');
            const panel = document.getElementById(item.dataset.target);
            if (panel) {
                panel.style.display = 'none'; // 隐藏非活动面板
            }
        });
        document.querySelector(`[data-target="${targetId}"]`).classList.add('active');
        const activePanel = document.getElementById(targetId);
        if (activePanel) {
            activePanel.style.display = 'block'; // 显示活动面板
        }
        // 允许在任何时候导航到其他菜单分类
        this.modelLoader.canNavigate = this.modelLoader.currentSelection !== null;
    }

    toggleErrorPanel(show = true) {
        this.errorContainer.style.display = show ? 'block' : 'none';
    }

    showErrorPanel(message) {
        this.errorContainer.querySelector('.error-message').textContent = message;
        this.toggleErrorPanel(true);
    }

    loadDeviceManagement() {
        this.deviceManager.init(); // 初始化设备管理面板
    }

    loadParameterControls() {
        document.getElementById('params').innerHTML = '<p>参数设置面板内容</p>';
    }

    loadInferencePreview() {
        document.getElementById('preview').innerHTML = '<p>推理预览面板内容</p>';
    }
}

// 添加刷新页面时的警告逻辑
window.onbeforeunload = function(e) {
    var confirmationMessage = '是否继续刷新?\n刷新后需要重启后端服务!';
    (e || (e = window.event)).returnValue = confirmationMessage; // 对IE, Chrome, Safari, Firefox等浏览器进行兼容性处理
    return confirmationMessage; // 对Firefox进行兼容性处理
};

new NavigationController();
const modelLoader = new ModelLoader();
