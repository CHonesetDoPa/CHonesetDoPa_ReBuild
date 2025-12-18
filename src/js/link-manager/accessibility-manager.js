/**
 * AccessibilityManager
 * 负责无障碍属性和 i18n 更新
 */
export class AccessibilityManager {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // 监听 i18n 系统就绪事件
        const handleI18nReady = () => {
            this.updateAccessibilityAttributes();
            // 注意：这里不移除监听器，因为可能需要多次更新
        };
        
        document.addEventListener('i18nSystemReady', handleI18nReady);
        document.addEventListener('i18n:initialized', handleI18nReady);
    }

    /**
     * 为元素添加无障碍属性 (优化版)
     * @param {HTMLElement} element - 要添加属性的元素
     * @param {string} i18nKey - i18n键名
     */
    addAccessibilityAttributes(element, i18nKey) {
        // 设置 aria-label 和 title 属性，支持i18n
        element.setAttribute('data-i18n-title', i18nKey);
        element.setAttribute('data-i18n-aria-label', i18nKey);
        
        // 立即尝试设置属性
        this.setImmediateAccessibilityAttributes(element, i18nKey);
        
        // 如果 i18n 系统还没加载，设置监听器
        if (!window.t || typeof window.t !== 'function') {
            // 设置延迟检查作为后备
            setTimeout(() => {
                if (window.t && typeof window.t === 'function') {
                    this.setImmediateAccessibilityAttributes(element, i18nKey);
                }
            }, 100);
        }
    }

    /**
     * 立即设置可访问性属性
     * @param {HTMLElement} element - 要设置属性的元素
     * @param {string} i18nKey - i18n键名
     */
    setImmediateAccessibilityAttributes(element, i18nKey) {
        if (window.t && typeof window.t === 'function') {
            const text = window.t(i18nKey);
            if (text && text !== i18nKey) {
                element.setAttribute('title', text);
                element.setAttribute('aria-label', text);
            }
        }
    }

    /**
     * 批量更新所有无障碍属性（优化版）
     */
    updateAccessibilityAttributes() {
        if (!window.t || typeof window.t !== 'function') return;
        
        // 使用 requestAnimationFrame 优化性能
        requestAnimationFrame(() => {
            // 批量处理所有需要更新的元素
            const elementsToUpdate = [
                ...document.querySelectorAll('[data-i18n-title]'),
                ...document.querySelectorAll('[data-i18n-aria-label]')
            ];

            // 使用 DocumentFragment 减少重排
            elementsToUpdate.forEach(element => {
                const titleKey = element.getAttribute('data-i18n-title');
                const ariaKey = element.getAttribute('data-i18n-aria-label');
                
                if (titleKey) {
                    const text = window.t(titleKey);
                    if (element.getAttribute('title') !== text) {
                        element.setAttribute('title', text);
                    }
                }
                
                if (ariaKey) {
                    const text = window.t(ariaKey);
                    if (element.getAttribute('aria-label') !== text) {
                        element.setAttribute('aria-label', text);
                    }
                }
            });
        });
    }
}
