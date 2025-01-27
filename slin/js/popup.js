// 添加兼容性处理
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

$(function () {
    // 加载设置
    var defaultConfig = {color: "white"}; // 默认配置
    browserAPI.storage.sync.get(defaultConfig, function (items) {
        document.body.style.backgroundColor = items.color;
    });
    
    // 初始化国际化
    $("#test_i18n").html(browserAPI.i18n.getMessage("helloWorld"));

    // 检查录制状态并更新UI
    browserAPI.storage.local.get('slinSwitch', function (result) {
        updateUIState(result.slinSwitch);
    });
});

// 更新UI状态
function updateUIState(slinSwitch) {
    try {
        if (slinSwitch) {
            document.querySelector('#listeningStop').style.display = 'none';
            document.querySelector('#listeningCrawl').style.display = 'inline';
            document.querySelector('#start').style.display = 'inline';
            document.querySelector('#stop').style.display = 'none';
        } else {
            document.querySelector('#listeningStop').style.display = 'inline';
            document.querySelector('#listeningCrawl').style.display = 'none';
            document.querySelector('#start').style.display = 'none';
            document.querySelector('#stop').style.display = 'inline';
        }
    } catch (e) {
        console.error('UI更新失败:', e);
    }
}

// 打开后台页
$("#open_background").click((e) => {
    browserAPI.storage.local.set({slinSwitch: true}, function () {
        browserAPI.storage.local.get('slinSwitch', function (result) {
            if(!result.slinSwitch) {
                alert("监听参数设置失败");
            }
        });
    });
    // 使用tabs.create代替window.open
    browserAPI.tabs.create({
        url: browserAPI.runtime.getURL("background.html")
    });
});

// 开始录制
$("#start").click((e) => {
    browserAPI.storage.local.set({slinSwitch: false}, function () {
        updateUIState(false);
    });
});

// 停止录制
$("#stop").click((e) => {
    browserAPI.storage.local.set({slinSwitch: true}, function () {
        updateUIState(true);
    });
});

// 自定义窗体大小
$("#custom_window_size").click(() => {
    browserAPI.windows.getCurrent({}, (currentWindow) => {
        browserAPI.windows.update(currentWindow.id, {
            left: 100,
            top: 100,
            width: 800,
            height: 600
        });
    });
});

// 最大化窗口
$("#max_current_window").click(() => {
    browserAPI.windows.getCurrent({}, (currentWindow) => {
        browserAPI.windows.update(currentWindow.id, {state: "maximized"});
    });
});

// 最小化窗口
$("#min_current_window").click(() => {
    browserAPI.windows.getCurrent({}, (currentWindow) => {
        browserAPI.windows.update(currentWindow.id, {state: "minimized"});
    });
});

// 打开新窗口
$("#open_new_window").click(() => {
    browserAPI.windows.create({state: "maximized"});
});

// 关闭当前窗口
$("#close_current_window").click(() => {
    browserAPI.windows.getCurrent({}, (currentWindow) => {
        browserAPI.windows.remove(currentWindow.id);
    });
});

// 调用后台JS
$("#invoke_background_js").click((e) => {
    var bg = browserAPI.extension.getBackgroundPage();
    bg.testBackground();
});

// 获取后台页标题
$("#get_background_title").click((e) => {
    var bg = browserAPI.extension.getBackgroundPage();
    alert(bg.document.title);
});

// 设置后台页标题
$("#set_background_title").click((e) => {
    var title = prompt("请输入background的新标题：", "这是新标题");
    var bg = browserAPI.extension.getBackgroundPage();
    bg.document.title = title;
    alert("修改成功！");
});

// 新标签打开网页
$("#open_url_new_tab").click(() => {
    // 保持抓包状态
    browserAPI.storage.local.get('slinSwitch', function (result) {
        const currentState = result.slinSwitch;
        browserAPI.tabs.create({url: "https://www.baidu.com"}, function(tab) {
            browserAPI.storage.local.set({slinSwitch: currentState});
        });
    });
});

// 当前标签打开网页
$("#open_url_current_tab").click(() => {
    // 保持抓包状态
    browserAPI.storage.local.get('slinSwitch', function (result) {
        const currentState = result.slinSwitch;
        getCurrentTabId((tabId) => {
            browserAPI.tabs.update(tabId, {url: "http://www.so.com"}, function(tab) {
                browserAPI.storage.local.set({slinSwitch: currentState});
            });
        });
    });
});

// 获取当前标签ID
$("#get_current_tab_id").click(() => {
    getCurrentTabId((tabId) => {
        alert("当前标签ID：" + tabId);
    });
});

// 高亮tab
$("#highlight_tab").click(() => {
    browserAPI.tabs.highlight({tabs: 0});
});

// popup主动发消息给content-script
$("#send_message_to_content_script").click(() => {
    sendMessageToContentScript("你好，我是popup！", (response) => {
        if (response) alert("收到来自content-script的回复：" + response);
    });
});

// 监听来自content-script的消息
browserAPI.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("收到来自content-script的消息：");
    console.log(request, sender, sendResponse);
    sendResponse("我是popup，我已收到你的消息：" + JSON.stringify(request));
});

// popup与content-script建立长连接
$("#connect_to_content_script").click(() => {
    getCurrentTabId((tabId) => {
        var port = browserAPI.tabs.connect(tabId, {name: "test-connect"});
        port.postMessage({question: "你是谁啊？"});
        port.onMessage.addListener(function (msg) {
            alert("收到长连接消息：" + msg.answer);
            if (msg.answer && msg.answer.startsWith("我是")) {
                port.postMessage({question: "哦，原来是你啊！"});
            }
        });
    });
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
    browserAPI.tabs.query({active: true, currentWindow: true}, function (tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null);
    });
}

// 这2个获取当前选项卡id的方法大部分时候效果都一致，只有少部分时候会不一样
function getCurrentTabId2() {
    browserAPI.windows.getCurrent(function (currentWindow) {
        browserAPI.tabs.query(
            {active: true, windowId: currentWindow.id},
            function (tabs) {
                if (callback) callback(tabs.length ? tabs[0].id : null);
            }
        );
    });
}

// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
    getCurrentTabId((tabId) => {
        browserAPI.tabs.sendMessage(tabId, message, function (response) {
            if (callback) callback(response);
        });
    });
}

// 向content-script注入JS片段
function executeScriptToCurrentTab(code) {
    getCurrentTabId((tabId) => {
        browserAPI.tabs.executeScript(tabId, {code: code});
    });
}

// 演示2种方式操作DOM

// 修改背景色
$("#update_bg_color").click(() => {
    executeScriptToCurrentTab('document.body.style.backgroundColor="red";');
});

// 修改字体大小
$("#update_font_size").click(() => {
    sendMessageToContentScript(
        {cmd: "update_font_size", size: 42},
        function (response) {
        }
    );
});

// 显示badge
$("#show_badge").click(() => {
    browserAPI.browserAction.setBadgeText({text: "New"});
    browserAPI.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
});

// 隐藏badge
$("#hide_badge").click(() => {
    browserAPI.browserAction.setBadgeText({text: ""});
    browserAPI.browserAction.setBadgeBackgroundColor({color: [0, 0, 0, 0]});
});

// 显示桌面通知
$("#show_notification").click((e) => {
    browserAPI.notifications.create(null, {
        type: "image",
        iconUrl: "img/icon.png",
        title: "祝福",
        message: "骚年，祝你圣诞快乐！Merry christmas!",
        imageUrl: "img/sds.png",
    });
});

$("#check_media").click((e) => {
    alert("即将打开一个有视频的网站，届时将自动检测是否存在视频！");
    browserAPI.tabs.create({
        url: "http://www.w3school.com.cn/tiy/t.asp?f=html5_video",
    });
});

