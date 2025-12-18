/*
    * link-manager.js
    * author: CHonesetDoPa
    * version: 2.0.0 (Modularized)
 */
import { ConfigManager } from './link-manager/config-manager.js';
import { AccessibilityManager } from './link-manager/accessibility-manager.js';
import { InteractionHandler } from './link-manager/interaction-handler.js';
import { UIRenderer } from './link-manager/ui-renderer.js';

class LinkManager {
    constructor() {
        this.configManager = new ConfigManager();
        this.accessibilityManager = new AccessibilityManager();
        this.interactionHandler = new InteractionHandler();
        this.uiRenderer = new UIRenderer();
        
        this.isInitialized = false;
        this.languageSwitchTimer = null;
    }

    /**
     * 初始化所有组件
     * @param {Object} [config] - 可选的配置对象
     */
    async initializeAll(config) {
        // 如果提供了配置，或者尚未初始化，则进行初始化
        if (config || !this.isInitialized) {
            await this.configManager.init(config);
            this.isInitialized = true;
        }

        const currentConfig = this.configManager.getConfig();

        this.interactionHandler.updateGlobalFunctions(currentConfig);
        this.addCustomStyles();
        
        // 使用防抖延迟执行渲染，确保 DOM 已加载
        const renderWithDelay = window.debounce ? window.debounce(() => {
            this.renderComponents();
        }, 100) : () => setTimeout(() => this.renderComponents(), 100);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderWithDelay);
        } else {
            renderWithDelay();
        }
    }

    /**
     * 处理语言切换
     */
    handleLanguageSwitch() {
        // 使用防抖避免频繁调用
        if (this.languageSwitchTimer) {
            clearTimeout(this.languageSwitchTimer);
        }

        this.languageSwitchTimer = setTimeout(() => {
            this.renderComponents();
            this.accessibilityManager.updateAccessibilityAttributes();
        }, 50);
    }

    /**
     * 添加自定义样式（精简版）
     */
    addCustomStyles() {
        // 检查是否已经添加过样式
        if (document.getElementById('link-manager-styles')) return;
        
        // 由于主要样式已经移到 index.css 中，这里只保留必要的动态样式
        console.log('Link manager styles are now managed in index.css');
    }

    /**
     * 渲染所有组件
     */
    renderComponents() {
        const config = this.configManager.getConfig();
        if (!config) return;

        // 使用 requestAnimationFrame 优化渲染性能
        requestAnimationFrame(() => {
            // 渲染社交媒体图标
            this.uiRenderer.renderSocialMediaIcons('social-media-icons-placeholder', config, this.accessibilityManager);
            
            // 渲染社交媒体列表
            this.uiRenderer.renderSocialMediaList('social-media-list', config, this.accessibilityManager);
            
            // 渲染相关网站列表
            this.uiRenderer.renderRelatedSites('related-sites-list', config, this.accessibilityManager);

            // 其他更新操作
            this.uiRenderer.updateStatusInfo(config, this.accessibilityManager);
            this.uiRenderer.updateCopyright(config);
            
            // 延迟更新无障碍属性
            setTimeout(() => {
                this.accessibilityManager.updateAccessibilityAttributes();
            }, 50);
        });
    }
}

// 创建全局实例
window.linkManager = new LinkManager();

// 监听 i18n 系统就绪事件
document.addEventListener('i18nSystemReady', () => {
    console.log('[LinkManager] I18n system ready, updating accessibility attributes');
    window.linkManager.accessibilityManager.updateAccessibilityAttributes();
});

document.addEventListener('i18n:languageChanged', () => {
    console.log('[LinkManager] Language changed, updating accessibility attributes');
    window.linkManager.handleLanguageSwitch();
});
