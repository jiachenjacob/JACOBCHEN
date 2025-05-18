// 博客分类切换功能
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有下拉菜单项
    const menuItems = document.querySelectorAll('.dropdown-item');
    const titleElement = document.querySelector('.blogs-title h2');
    const allBlogCards = document.querySelectorAll('.blog-card');
    const allPostsContainer = document.getElementById('all-posts');
    let currentCategory = null; // 记录当前分类
    
    // 默认展开下拉菜单
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        dropdownContent.style.display = 'block';
    }
    
    // 过滤文章函数 - 被所有过滤行为调用
    function filterPostsByCategory(category) {
        // 设置当前分类
        currentCategory = category;
        
        // 更新标题
        if (category === 'all') {
            titleElement.textContent = 'All Blogs';
            // 不再添加可点击的类
            // 显示所有文章
            allBlogCards.forEach(card => {
                card.style.display = 'block';
            });
        } else {
            // 根据点击元素上的data-title属性或文本内容设置标题
            const clickedItem = Array.from(menuItems).find(item => item.getAttribute('data-category') === category);
            if (clickedItem) {
                titleElement.textContent = clickedItem.getAttribute('data-title') || category;
            } else {
                titleElement.textContent = category;
            }
            
            // 过滤文章
            allBlogCards.forEach(card => {
                const cardCategory = card.querySelector('.blog-category').getAttribute('data-category') || 
                                   card.querySelector('.blog-category').textContent.trim();
                if (category === cardCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }
        
        // 更新菜单项激活状态
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (category !== 'all' && item.getAttribute('data-category') === category) {
                item.classList.add('active');
            }
        });
    }
    
    // 为每个菜单项添加点击事件
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.location.pathname.includes('blog.html')) {
                e.preventDefault();
                
                // 获取目标分类
                const category = this.getAttribute('data-category') || this.textContent.trim();
                
                // 显示所有文章区域（如果有其他区域被显示）
                const contentSections = document.querySelectorAll('.content-section');
                contentSections.forEach(section => {
                    section.classList.remove('active-section');
                });
                allPostsContainer.classList.add('active-section');
                
                // 调用统一的过滤函数
                filterPostsByCategory(category);
            }
        });
    });
    
    // 为文章上的分类标签添加点击事件
    const categoryTags = document.querySelectorAll('.blog-category');
    categoryTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // 阻止事件冒泡
            
            // 获取分类
            const category = this.getAttribute('data-category') || this.textContent.trim();
            
            // 调用统一的过滤函数
            filterPostsByCategory(category);
        });
    });
    
    // 移除标题的点击事件
    // 为All Blogs标题添加点击事件 - 仅当显示的是"All Blogs"时才处理点击
    if (titleElement) {
        // 移除点击功能
        // titleElement.addEventListener('click', function() {
        //     // 只有当前已经被过滤，并且点击的是All Blogs标题时才执行
        //     if (this.classList.contains('all-blogs-title')) {
        //         filterPostsByCategory('all');
        //     }
        // });
    }
    
    // 初始显示所有文章
    if (window.location.pathname.includes('blog.html')) {
        document.getElementById('all-posts').classList.add('active-section');
        filterPostsByCategory('all');
    }

    // 处理阅读更多链接点击，防止过滤重置
    const readMoreLinks = document.querySelectorAll('.blog-read-more');
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 如果有当前过滤器，阻止点击行为
            if (currentCategory) {
                e.preventDefault();
                console.log('Read more clicked, but filtered view maintained');
            }
        });
    });

    // 处理BLOG导航点击 - 添加返回All Blogs的功能
    const blogNavItem = document.querySelector('.blog-container > .nav-item');
    if (blogNavItem) {
        blogNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            // 返回"All Blogs"视图
            filterPostsByCategory('all');
        });
    }

    // 处理导航点击
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (!item.classList.contains('active') && !item.closest('.blog-container')) {
            item.addEventListener('click', function(e) {
                // No specific actions needed for now
            });
        }
    });
    
    // 处理BLOG下拉菜单显示逻辑 - 始终显示
    const blogContainer = document.querySelector('.blog-container');
    if (blogContainer && dropdownContent) {
        blogContainer.addEventListener('click', function(e) {
            // 如果点击的是菜单项而不是下拉选项，阻止默认行为 (但允许点击主BLOG导航项)
            if (e.target.closest('.nav-item') && !e.target.closest('.dropdown-item') && 
                e.target !== blogNavItem && !blogNavItem.contains(e.target)) {
                e.preventDefault();
            }
        });
    }
    
    // 处理搜索功能
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', function() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            if (searchTerm) {
                filterBlogsBySearch(searchTerm);
            } else {
                // 如果搜索框为空，则恢复当前分类的所有文章或所有文章
                if (currentCategory && currentCategory !== 'all') {
                    filterPostsByCategory(currentCategory);
                } else {
                    filterPostsByCategory('all');
                }
            }
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.toLowerCase().trim();
                if (searchTerm) {
                    filterBlogsBySearch(searchTerm);
                } else {
                    // 如果搜索框为空，则恢复当前分类的所有文章或所有文章
                    if (currentCategory && currentCategory !== 'all') {
                        filterPostsByCategory(currentCategory);
                    } else {
                        filterPostsByCategory('all');
                    }
                }
            }
        });

        // 添加即时搜索功能，当用户删除搜索框内容时恢复全部文章
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm === '') {
                // 如果搜索框为空，则恢复当前分类的所有文章或所有文章
                if (currentCategory && currentCategory !== 'all') {
                    filterPostsByCategory(currentCategory);
                } else {
                    filterPostsByCategory('all');
                }
            }
        });
    }
    
    // 博客搜索过滤功能 - 不清除分类过滤器
    function filterBlogsBySearch(term) {
        const blogCards = document.querySelectorAll('.blog-card');
        let hasResults = false;
        
        // 如果有分类过滤器，只在该分类中搜索
        blogCards.forEach(card => {
            // 如果当前有分类过滤且不匹配，跳过该卡片
            if (currentCategory && currentCategory !== 'all') {
                const cardCategory = card.querySelector('.blog-category').getAttribute('data-category') || 
                                   card.querySelector('.blog-category').textContent.trim();
                if (cardCategory !== currentCategory) {
                    card.style.display = 'none';
                    return;
                }
            }
            
            const title = card.querySelector('h2').textContent.toLowerCase();
            const content = card.querySelector('.blog-excerpt').textContent.toLowerCase();
            const category = card.querySelector('.blog-category').textContent.toLowerCase();
            
            if (title.includes(term) || content.includes(term) || category.includes(term)) {
                card.style.display = 'block';
                hasResults = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示没有结果的提示
        const noResultsMsg = document.querySelector('.no-results-message');
        if (!hasResults) {
            if (!noResultsMsg) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.textContent = '没有找到相关结果';
                message.style.textAlign = 'center';
                message.style.padding = '40px 0';
                message.style.fontSize = '18px';
                message.style.color = '#888';
                
                const blogGrid = document.querySelector('.blog-grid.active-section');
                if (blogGrid) {
                    blogGrid.appendChild(message);
                }
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
    
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    
    if (menuToggle && mainNavigation) {
        menuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNavigation.classList.toggle('active');
        });
    }
    
    // 处理下拉菜单项的初始化 - 匹配当前页面
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    if (dropdownItems.length > 0) {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop();
        
        dropdownItems.forEach(item => {
            const itemHref = item.getAttribute('href');
            if (itemHref === currentPage) {
                item.classList.add('active');
                // 如果在子页面上，自动应用过滤器
                const category = item.getAttribute('data-category');
                if (category) {
                    filterPostsByCategory(category);
                }
            }
        });
    }
}); 