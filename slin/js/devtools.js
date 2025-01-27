// 添加兼容性处理
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// 初始化变量
const CD = browserAPI.devtools;
let db = null;
let slinSwitch = true;
let ignoreSetArray = [];

// 监听存储变化
browserAPI.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.ignoreSetArray) {
        ignoreSetArray = changes.ignoreSetArray.newValue || [];
        console.log('过滤设置已更新:', ignoreSetArray);
    }
    if (changes.slinSwitch !== undefined) {
        slinSwitch = changes.slinSwitch.newValue;
    }
});

// 获取资源类型
function getResourceType(request) {
    // 首先从请求对象的 _resourceType 属性获取类型（Chrome）
    // 或者从 request.type 获取类型（Firefox）
    if (request._resourceType || request.type) {
        return request._resourceType || request.type;
    }

    // 从请求头中获取 Content-Type
    const contentType = request.response.headers.find(
        header => header.name.toLowerCase() === 'content-type'
    );

    if (contentType) {
        const mimeType = contentType.value.toLowerCase();
        if (mimeType.includes('javascript')) return 'script';
        if (mimeType.includes('css')) return 'stylesheet';
        if (mimeType.includes('html')) return 'document';
        if (mimeType.includes('image')) return 'image';
        if (mimeType.includes('font')) return 'font';
        if (mimeType.includes('json') || mimeType.includes('xml') || request.request.method !== 'GET') return 'xhr';
    }

    // 从URL后缀判断
    const url = request.request.url.toLowerCase();
    if (url.endsWith('.js')) return 'script';
    if (url.endsWith('.css')) return 'stylesheet';
    if (url.endsWith('.html') || url.endsWith('.htm')) return 'document';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|otf|eot)$/)) return 'font';

    // 根据请求方法判断
    if (request.request.method !== 'GET') return 'xhr';

    // 检查是否是 API 请求
    if (url.includes('/api/') || url.includes('/rest/') || url.includes('/v1/') || url.includes('/v2/')) {
        return 'xhr';
    }

    return 'other';
}

// 初始化数据库
async function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("myDatabase", 1);
        
        request.onerror = function(event) {
            console.error("数据库打开失败:", event.target.error);
            reject(event.target.error);
        };
        
        request.onsuccess = function(event) {
            db = event.target.result;
            console.log("数据库连接成功");
            resolve(db);
        };
        
        request.onupgradeneeded = function(event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("myDataStore")) {
                db.createObjectStore("myDataStore", {
                    keyPath: "id",
                    autoIncrement: true
                });
            }
        };
    });
}

// 保存数据到数据库
async function saveToIndexedDB(data) {
    try {
        if (!db) {
            await initDB();
        }

        // 检查是否应该过滤掉这个请求
        if (Array.isArray(ignoreSetArray) && ignoreSetArray.length > 0) {
            const resourceType = data._resourceType;
            
            // 检查是否需要过滤
            const shouldFilter = ignoreSetArray.some(type => {

                if (type== resourceType){
                    return true
                }
   
            });
            console.log('已过滤111请求:', shouldFilter);
            if (shouldFilter) {
                console.log('已过滤请求:', resourceType);
                return;
            }
        }

        const transaction = db.transaction(["myDataStore"], "readwrite");
        const store = transaction.objectStore("myDataStore");
        await store.add(data);
        console.log('数据已保存到 IndexedDB:', data._resourceType);
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 初始化设置
async function initSettings() {
    return new Promise((resolve) => {
        browserAPI.storage.local.get(['slinSwitch', 'ignoreSetArray'], function(result) {
            slinSwitch = result.slinSwitch !== undefined ? result.slinSwitch : true;
            ignoreSetArray = Array.isArray(result.ignoreSetArray) ? result.ignoreSetArray : [];
            console.log('初始化设置:', { slinSwitch, ignoreSetArray });
            resolve();
        });
    });
}

// 初始化网络请求监听
async function initNetworkListener() {
    try {
        await initDB();
        await initSettings();
        
        CD.network.onRequestFinished.addListener(async function(request) {
            if (!slinSwitch) return;
            
            try {
                const timestamp = new Date().getTime();
                
                // 获取响应内容
                const content = await new Promise((resolve) => {
                    request.getContent((content) => resolve(content));
                });
                
                // 获取资源类型
                const resourceType = getResourceType(request);
                
                // 构建通用的请求数据结构
                const data = {
                    request: {
                        method: request.request.method,
                        url: request.request.url,
                        headers: Array.isArray(request.request.headers) ? request.request.headers : 
                               Object.entries(request.request.headers).map(([name, value]) => ({name, value})),
                        queryString: request.request.queryString || [],
                        postData: request.request.postData,
                        httpVersion: request.request.httpVersion || "HTTP/1.1"
                    },
                    response: {
                        status: request.response.status,
                        statusText: request.response.statusText,
                        headers: Array.isArray(request.response.headers) ? request.response.headers :
                                Object.entries(request.response.headers).map(([name, value]) => ({name, value})),
                        content: {
                            size: request.response.content ? request.response.content.size : 0
                        },
                        time: request.time || 0
                    },
                    content: content,
                    _resourceType: resourceType,
                    timestamp: timestamp.toString(),
                    api_name: "未定义接口",
                    api_desc: ""
                };
                
                // 排除扩展自身的请求
                if (!data.request.url.includes('moz-extension://') && 
                    !data.request.url.includes('chrome-extension://')) {
                    await saveToIndexedDB(data);
                }
            } catch (error) {
                console.error('处理请求失败:', error);
            }
        });
        
        console.log('网络监听器已初始化');
    } catch (error) {
        console.error('初始化网络监听器失败:', error);
    }
}

// 启动监听
initNetworkListener();

// 检查 IndexedDB 支持
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
if (!indexedDB) {
    console.error("当前浏览器不支持 IndexedDB");
} else {
    console.log("支持 IndexedDB");
}

// DevTools Extension中不能使用console.log，使用自定义log函数
const log = (...params) => CD.inspectedWindow.eval(`console.log(...${JSON.stringify(params)})`);


