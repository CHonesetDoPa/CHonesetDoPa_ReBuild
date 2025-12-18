/**
 * 赞助者列表管理
 * 动态管理和显示赞助者信息
 */
(function() {
    'use strict';

    // 赞助者数据
    const sponsorData = [
        ['Nyaworks', '6 CNY'],
        ['Tymappo', '44 CNY'],
        ['IO2303', '5 USD'],
        ['CenterReduction', '6 CNY']
    ];

    /**
     * 填充赞助者表格
     */
    function populateSponsors() {
        const table = document.getElementById('sponsor');
        if (!table) {
            console.warn('Sponsor table not found');
            return;
        }

        // 获取tbody元素
        const tbody = table.querySelector('tbody');
        if (!tbody) {
            console.warn('Table tbody not found');
            return;
        }

        // 清空现有的tbody内容（除了可能的默认行）
        tbody.innerHTML = '';

        // 添加赞助者数据
        sponsorData.forEach(([sponsor, price]) => {
            const row = tbody.insertRow();
            const sponsorCell = row.insertCell(0);
            const priceCell = row.insertCell(1);
            
            sponsorCell.textContent = sponsor;
            priceCell.textContent = price;
            
            // 添加一些样式类（如果需要）
            row.className = 'sponsor-row';
        });

        console.log(`Loaded ${sponsorData.length} sponsors`);
    }

    /**
     * 初始化赞助者列表
     */
    function initSponsorList() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', populateSponsors);
        } else {
            populateSponsors();
        }
    }

    // 导出函数到全局作用域（供其他脚本使用）
    window.SponsorList = {
        init: initSponsorList
    };

    // 自动初始化
    initSponsorList();

})();
