// 添加兼容性处理
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.storage.local.get('slinSwitch', function (result) {
    if (result.slinSwitch === undefined) {
        browserAPI.storage.local.set({slinSwitch: true}, function() {
            console.log("------------------初始化网络监听状态------------------");
        });
    }
    if (result.slinSwitch) {
        console.log("------------------正在监听网络请求------------------");
    }
});
