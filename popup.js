import { DEFAULT_SEARCH_ENGINES, SEARCH_ENGINE_ORDER } from './config.js';

// 初始化搜索引擎列表
function initializeSearchEngines() {
  const container = document.querySelector('.search-engines');
  
  chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
    console.log('Retrieved storage:', result); // 调试日志
    
    const searchEngines = result.searchEngines || DEFAULT_SEARCH_ENGINES;
    const order = result.engineOrder || SEARCH_ENGINE_ORDER;
    
    console.log('Using engines:', searchEngines); // 调试日志
    console.log('Using order:', order); // 调试日志
    
    container.innerHTML = '';
    
    order.forEach(url => {
      const engine = searchEngines[url];
      if (engine) {
        const div = document.createElement('div');
        div.className = 'search-engine-item';
        // 如果不是默认搜索引擎，添加custom类
        if (!DEFAULT_SEARCH_ENGINES[url]) {
          div.classList.add('custom');
        }
        
        const leftSection = document.createElement('div');
        leftSection.className = 'left-section';
        leftSection.style.display = 'flex';
        leftSection.style.alignItems = 'center';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `engine-${url}`;
        checkbox.checked = engine.enabled;
        checkbox.dataset.url = url;
        
        // 添加 change 事件监听器
        checkbox.addEventListener('change', (e) => {
          const url = e.target.dataset.url;
          chrome.storage.sync.get(['searchEngines'], (result) => {
            const updatedEngines = result.searchEngines;
            updatedEngines[url].enabled = e.target.checked;
            
            chrome.storage.sync.set({ searchEngines: updatedEngines }, () => {
              chrome.runtime.sendMessage({ type: 'updateContextMenus' });
            });
          });
        });
        
        const label = document.createElement('label');
        label.textContent = engine.name;
        label.htmlFor = `engine-${url}`;
        
        leftSection.appendChild(checkbox);
        leftSection.appendChild(label);
        div.appendChild(leftSection);

        // 只为自定义搜索引擎添加控制按钮
        if (!DEFAULT_SEARCH_ENGINES[url]) {
          const controls = document.createElement('div');
          controls.className = 'engine-controls';
          
          // 编辑按钮
          const editBtn = document.createElement('button');
          editBtn.className = 'engine-control-btn edit';
          editBtn.innerHTML = '✎';
          editBtn.title = 'Edit';
          editBtn.onclick = () => editSearchEngine(url, engine);
          
          // 删除按钮
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'engine-control-btn delete';
          deleteBtn.innerHTML = '×';
          deleteBtn.title = 'Delete';
          deleteBtn.onclick = () => deleteSearchEngine(url);
          
          controls.appendChild(editBtn);
          controls.appendChild(deleteBtn);
          div.appendChild(controls);
        }
        
        container.appendChild(div);
      } else {
        console.log('Engine not found for URL:', url); // 调试日志
      }
    });
  });
}

// 添加编辑搜索引擎的函数
function editSearchEngine(url, engine) {
  const form = document.getElementById('addEngineForm');
  const nameInput = document.getElementById('engineName');
  const urlInput = document.getElementById('engineUrl');
  const confirmBtn = document.getElementById('confirmAdd');
  const addButton = document.getElementById('addSearchEngine');
  
  nameInput.value = engine.name;
  urlInput.value = url;
  form.style.display = 'block';
  addButton.style.display = 'none';
  
  // 修改确认按钮的行为
  const originalConfirmClick = confirmBtn.onclick;
  confirmBtn.onclick = () => {
    const newName = nameInput.value.trim();
    const newUrl = urlInput.value.trim();
    
    if (newName && newUrl) {
      chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
        const searchEngines = result.searchEngines;
        const order = result.engineOrder;
        
        // 如果URL改变，需要删除旧的并添加新的
        if (newUrl !== url) {
          delete searchEngines[url];
          const urlIndex = order.indexOf(url);
          if (urlIndex > -1) {
            order.splice(urlIndex, 1);
          }
          order.push(newUrl);
        }
        
        searchEngines[newUrl] = {
          name: newName,
          enabled: engine.enabled
        };
        
        chrome.storage.sync.set({
          searchEngines: searchEngines,
          engineOrder: order
        }, () => {
          initializeSearchEngines();
          chrome.runtime.sendMessage({ type: 'updateContextMenus' });
          form.style.display = 'none';
          addButton.style.display = 'block';
          nameInput.value = '';
          urlInput.value = '';
          
          // 恢复确认按钮的原始行为
          confirmBtn.onclick = originalConfirmClick;
        });
      });
    }
  };
}

// 添加删除搜索引擎的函数
function deleteSearchEngine(url) {
  if (confirm('Are you sure you want to delete this search engine?')) {
    chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
      const searchEngines = result.searchEngines;
      const order = result.engineOrder;
      
      delete searchEngines[url];
      const urlIndex = order.indexOf(url);
      if (urlIndex > -1) {
        order.splice(urlIndex, 1);
      }
      
      chrome.storage.sync.set({
        searchEngines: searchEngines,
        engineOrder: order
      }, () => {
        initializeSearchEngines();
        chrome.runtime.sendMessage({ type: 'updateContextMenus' });
      });
    });
  }
}

// 处理添加自定义搜索引擎的逻辑
function setupAddEngineForm() {
  const addButton = document.getElementById('addSearchEngine');
  const form = document.getElementById('addEngineForm');
  const cancelButton = document.getElementById('cancelAdd');
  const confirmButton = document.getElementById('confirmAdd');
  
  addButton.addEventListener('click', () => {
    form.style.display = 'block';
    addButton.style.display = 'none';
  });
  
  cancelButton.addEventListener('click', () => {
    form.style.display = 'none';
    addButton.style.display = 'block';
    // 清空表单
    document.getElementById('engineName').value = '';
    document.getElementById('engineUrl').value = '';
  });
  
  confirmButton.addEventListener('click', () => {
    const name = document.getElementById('engineName').value.trim();
    const url = document.getElementById('engineUrl').value.trim();
    
    if (name && url) {
      chrome.storage.sync.get(['searchEngines', 'engineOrder'], (result) => {
        const searchEngines = result.searchEngines;
        const order = result.engineOrder;
        
        // 添加新的搜索引擎
        searchEngines[url] = {
          name: name,
          enabled: true
        };
        order.push(url);
        
        // 保存更新
        chrome.storage.sync.set({
          searchEngines: searchEngines,
          engineOrder: order
        }, () => {
          // 重新初始化列表
          initializeSearchEngines();
          // 更新上下文菜单
          chrome.runtime.sendMessage({ type: 'updateContextMenus' });
          // 重置表单
          form.style.display = 'none';
          addButton.style.display = 'block';
          document.getElementById('engineName').value = '';
          document.getElementById('engineUrl').value = '';
        });
      });
    }
  });
}

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
  initializeSearchEngines();
  setupAddEngineForm();
});
