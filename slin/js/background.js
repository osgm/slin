var dataflag = true;
var dataType = false;
//录制开关
var slinSwitch = true;
//导出时是否带返回值
var withRes =true
function testBackground() {
    alert("你好，我是background！");
}


// 初始加载时进行一次检查
//handleResize(); //只能判断当前页面 不能从popup判断 被监听页面 待优化实现方式
// 添加resize事件监听器
//window.addEventListener('resize', handleResize);
function handleResize() {
  const screenWidth = screen.width;
  const windowWidth  = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (screenWidth !== windowWidth) {
   alert('打开');
   var notification = document.getElementById('notification');
   notification.classList.add('show');
  } else if (screenWidth === windowWidth) {
   alert('未打开');
  }
}

var js_checkbox = document.getElementById('js');
var css_checkbox = document.getElementById('css');
var doc_checkbox = document.getElementById('doc');
var image_checkbox = document.getElementById('image'); 
var withRes_checkbox = document.getElementById('withRes'); 




let  ignoreSet = new Set([
    'document',
    'preflight',
    'stylesheet',
    'font',
    'script',
    'image'
        ]);




chrome.storage.local.get('ignoreSetArray', function (result) {

    if (result.ignoreSetArray && result.ignoreSetArray.length>0) {

        if(result.ignoreSetArray.includes('script')){
            js_checkbox.checked = true;
        } else { js_checkbox.checked = false;}
       
        if(result.ignoreSetArray.includes('stylesheet')||result.ignoreSetArray.includes('font')){
            css_checkbox.checked = true;
        } else { css_checkbox.checked = false;}

        if(result.ignoreSetArray.includes('preflight')||result.ignoreSetArray.includes('document')){
            doc_checkbox.checked = true;
        } else { doc_checkbox.checked = false;}
           
     
        if(result.ignoreSetArray.includes('image')){
            image_checkbox.checked = true;
        } else { image_checkbox.checked = false;}
    
   
    }else{
        js_checkbox.checked = false;
        css_checkbox.checked = false;
        doc_checkbox.checked = false;
        image_checkbox.checked = false;


    }

});



chrome.storage.local.get('withRes', function (result) {

    if (result.withRes) {
        withRes_checkbox.checked = true;
    }else{
        withRes_checkbox.checked = false;
    }

});


function filter(ignoreSet) {
// 因为存储 API 只接受可序列化的对象，所以我们需要将 Set 转换为数组
    let ignoreSetArray = Array.from(ignoreSet);
    chrome.storage.local.set({ignoreSetArray: ignoreSetArray}, function () {
        chrome.storage.local.get('ignoreSetArray', function (result) {
  
            ignoreSet= new Set(result.ignoreSetArray);

        });
    });
}

$("#doc").click((e) => {
    // js 过滤
    var checkboxJS = document.getElementById('doc');
    if (checkboxJS.checked) {
        ignoreSet.add('document')
        ignoreSet.add('preflight')
    } else {
        ignoreSet.delete('document');
        ignoreSet.delete('preflight');
    }
    //过滤器操作
    ignoreSetArray = Array.from(ignoreSet);
    chrome.storage.local.set({ignoreSetArray: ignoreSetArray}, function () {
        chrome.storage.local.get('ignoreSetArray', function (result) {
            console.info(result)
            ignoreSet= new Set(result.ignoreSetArray);

        });
    });


    this.filter(ignoreSet)
});

$("#css").click((e) => {
    // js 过滤
    var checkboxJS = document.getElementById('css');
    if (checkboxJS.checked) {
        ignoreSet.add('stylesheet')
        ignoreSet.add('font')
    } else {
        ignoreSet.delete('stylesheet');
        ignoreSet.delete('font');
    }

    //过滤器操作
    ignoreSetArray = Array.from(ignoreSet);
    chrome.storage.local.set({ignoreSetArray: ignoreSetArray}, function () {
        chrome.storage.local.get('ignoreSetArray', function (result) {
            console.info(result.ignoreSetArray)
            ignoreSet= new Set(result.ignoreSetArray);

        });
    });

    this.filter(ignoreSet)
});

$("#js").click((e) => {
 
    var checkboxJS = document.getElementById('js');
    if (checkboxJS.checked) {
        ignoreSet.add('script')
    } else {
        ignoreSet.delete('script');
    }


    //过滤器操作
    ignoreSetArray = Array.from(ignoreSet);
    chrome.storage.local.set({ignoreSetArray: ignoreSetArray}, function () {
        chrome.storage.local.get('ignoreSetArray', function (result) {
            console.info(result)
            ignoreSet= new Set(result.ignoreSetArray);

        });
    });

 
    this.filter(ignoreSet)
});

$("#image").click((e) => {
    // image 过滤
    var checkboxJS = document.getElementById('image');
    if (checkboxJS.checked) {
        ignoreSet.add('image')
    } else {
        ignoreSet.delete('image');
    }

    //过滤器操作
    ignoreSetArray = Array.from(ignoreSet);
    chrome.storage.local.set({ignoreSetArray: ignoreSetArray}, function () {
        chrome.storage.local.get('ignoreSetArray', function (result) {
            console.info(result)
            ignoreSet= new Set(result.ignoreSetArray);

        });
    });

    
    this.filter(ignoreSet)
});

$("#withRes").click((e) => {
    // image 过滤
    var checkboxJS = document.getElementById('withRes');
    if (checkboxJS.checked) {
        withRes =true
    } else {
        withRes =false
    }
    //过滤器操作
    chrome.storage.local.set({withRes: withRes}, function () {

    });
    
    this.filter(ignoreSet)
});



//录制开关
chrome.storage.local.get('slinSwitch', function (result) {
    slinSwitch = result.slinSwitch;
    try {
    if (slinSwitch) {
        // 如果slinSwitch为true，则显示span元素
        document.querySelector('#listeningStop').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
        document.querySelector('#listeningCrawl').style.display = 'inline';
        document.querySelector('#start').style.display = 'inline';
        document.querySelector('#stop').style.display = 'none';

    } else {
        document.querySelector('#listeningStop').style.display = 'inline';
        document.querySelector('#listeningCrawl').style.display = 'none';
        document.querySelector('#start').style.display = 'none';
        document.querySelector('#stop').style.display = 'inline';
    }
    } catch {
        }
});



$("#start").click((e) => {
    chrome.storage.local.set({slinSwitch: false}, function () {
            chrome.storage.local.get('slinSwitch', function (result) {
             console.info(result)
            });
        });
    document.querySelector('#listeningStop').style.display = 'inline';
    document.querySelector('#listeningCrawl').style.display = 'none';
    document.querySelector('#stop').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
    document.querySelector('#start').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
    chrome.storage.local.get('slinSwitch', function (result) {console.info(result)})

});

$("#stop").click((e) => {
    chrome.storage.local.set({slinSwitch: true}, function () {
            chrome.storage.local.get('slinSwitch', function (result) {
             console.info(result)
            });
        });
    document.querySelector('#listeningStop').style.display = 'none';
    document.querySelector('#listeningCrawl').style.display = 'inline';
    document.querySelector('#stop').style.display = 'none'; // 或者 'block', 'flex' 等，取决于你的布局需求
    document.querySelector('#start').style.display = 'inline'; // 或者 'block', 'flex' 等，取决于你的布局需求
    chrome.storage.local.get('slinSwitch', function (result) {console.info(result)})

});

//参数替换
$("#reps").click((e) => {
    const from = document.getElementById('get_from').value;
    const to = document.getElementById('get_to').value;
    console.info(from)
    console.info(to)
    reps_table_data(from,to)
});

//脚本导出
$("#export_postman").click((e) => {
    // 使用方法
    export_data().then(value => {
        const name = "测试用例"
        this.downloadPostman(name ,value)
    }).catch(error => {
        console.error('Error fetching value:', error);
        alert("导出数据异常！！")
    });
});

//脚本导出
$("#export_json").click((e) => {
    // 使用方法
    export_data().then(value => {
        const name = "测试用例"
        this.downloadJson(name ,value)
    }).catch(error => {
        console.error('Error fetching value:', error);
        alert("导出数据异常！！")
    });
});

//脚本导出
$("#export_jmx").click((e) => {
    export_data().then(value => {
        const name = "测试用例";
        const transactions = convertTransactionsJson(name, value);
        downloadJMX(name, transactions);
    }).catch(error => {
        console.error('Error fetching value:', error);
        Toast('导出失败', '导出数据异常');
    });
});
//脚本导出
$("#export_har").click((e) => {
    // 使用方法
    alert("等待开发")
});

//脚本导出
$("#export_swagger2").click((e) => {
    // 使用方法
    alert("等待开发")
});

//脚本导出
$("#export_excel").click((e) => {
    export_data().then(value => {
        const name = "测试用例";
        downloadExcel(name, value);
    }).catch(error => {
        console.error('Error fetching value:', error);
        Toast('导出失败', '导出数据异常');
    });
});

$("#get_data").click((e) => {
    dataflag = true;
    dataType = false;
    get_data(dataflag, dataType);
});
$("#get_Xhr").click((e) => {
    dataflag = true;
    dataType = ['xhr', 'fetch'];
    get_data(dataflag, dataType);
});
$("#get_Doc").click((e) => {
    dataflag = true;
    dataType = ['document', 'preflight'];
    get_data(dataflag, dataType);
});
$("#get_Css").click((e) => {
    dataflag = true;
    dataType = ['stylesheet', 'font'];
    get_data(dataflag, dataType);
});
$("#get_Js").click((e) => {
    dataflag = true;
    dataType = ['script'];
    get_data(dataflag, dataType);
});
$("#get_Img").click((e) => {
    dataflag = true;
    dataType = ['image'];
    get_data(dataflag, dataType);
});
$("#get_Media").click((e) => {
    dataflag = true;
    dataType = ['media'];
    get_data(dataflag, dataType);
});
$("#get_Manifest").click((e) => {
    dataflag = true;
    dataType = ['manifest'];

    get_data(dataflag, dataType);
});
$("#get_WS").click((e) => {
    dataflag = true;
    dataType = ['websocket'];

    get_data(dataflag, dataType);
});
$("#get_Wasm").click((e) => {
    dataflag = true;
    dataType = ['wasm'];
    get_data(dataflag, dataType);
});
$("#get_Other").click((e) => {
    dataflag = true;
    dataType = ['other'];
    get_data(dataflag, dataType);
});
$("#get_data_last").click((e) => {
    dataflag = true;
    dataType = false;
    get_data(dataflag, dataType);
});

// 刷新按钮点击事件
$("#refresh_data").click((e) => {
    // 重新加载数据
    location.reload();
});

$("#clear_data").click((e) => {
    clear_data();
});
$("#del_data").click((e) => {
    del_data();
});
const db_version = 1;

function clear_data() {
    mark =[];  //清空标记池
    paramsList=[];  //清空变量池
    //Toast('清除缓存成功！')
    let tbody = document.getElementById("tbody"); // 获取表格的tbody元素
    tbody.innerHTML = "";
    var numElement = document.getElementById("num");
    numElement.innerHTML = 0;
}

function del_data() {
    // 检查数据库是否存在并删除
    clear_data();
    const request = indexedDB.open("myDatabase", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        const store = transaction.objectStore("myDataStore");
        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;
            console.log(cursor);
            if (cursor) {
                // 为当前数据创建一个新的表格行
                cursor.delete();
                console.log("记录已删除:", cursor.value);
                // 继续移动游标到下一个记录
                cursor.continue();
            } else {
                // 所有记录都已处理完毕
                console.log("没有更多数据了！");
            }
        };

        cursorRequest.onerror = function (event) {
            console.error("读取数据时发生错误:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}

let lc = 1;
//jsonpath计算

function findJsonPaths(jsonObj, targetValue, basePath = [], paths = []) {
    try {
        // 成功转换后的操作
        for (const key in  jsonObj) {

            if (jsonObj.hasOwnProperty(key)) {
                const currentPath = [...basePath, key];
                const currentValue = jsonObj[key];
                if (currentValue == targetValue) {
                    // 如果找到匹配的值，则记录当前路径
                    paths.push(currentPath.join('.'));
                    console.log(JSON.stringify(paths))
                    return JSON.stringify(paths[0])
                } else if (typeof currentValue === 'object' && currentValue !== null) {
                    // 如果当前值是一个对象，则递归查找
                    findJsonPaths(currentValue, targetValue, currentPath, paths);
                    }
            }
        }
        return paths[0];
    } catch (e) {
        console.error('解析JSON字符串出错:', e);
        return ""
        // 处理错误的操作
    }

    }



var mark =[];      //提取参数标记[{name:变量名,value:对应的id}] 统一id可能对应多个变量名，但变量名是唯一的
var paramsList =[];  //变量池子
function get_data(e, getType = null,reps={key:'',value:''}) {
    lc = 0;
    var numElement = document.getElementById("num");
    numElement.innerHTML = 0;
    var searchValue = search()
    let tbody = document.getElementById("tbody"); // 获取表格的tbody元素
    tbody.innerHTML = "";
    const request = indexedDB.open("myDatabase", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        var store = transaction.objectStore("myDataStore");
        var cursorRequest = null;
        if (e) {
            cursorRequest = store.openCursor();
        } else {
            cursorRequest = store.openCursor(null, "prev");
        }
        cursorRequest.onsuccess = function (event) {
            const cursor = event.target.result;
            if (cursor) {
            //替换变量更新数据
            //替换所有的请求内容的变量
            //从返回值按顺序查，如果找到了，标记接口并替换
            valueStr = JSON.stringify(cursor.value)
            contentStr=cursor.value.content
            responseStr = JSON.stringify(cursor.value.response)
            cursor.value.api_name ="未定义接口:"
            cursor.value.api_desc =""
            if (searchValue == false) {
                if(reps.key !='' && reps.value != '' ){
                    if(responseStr !="" && responseStr != undefined ){
                        if(responseStr.includes(reps.key) && !paramsList.includes(reps.value)){
                            cursor.value.api_name ="参数提取接口:"
                            if(cursor.value._resourceType =='xhr'){
                                let jsonpath=findJsonPaths(JSON.parse(contentStr),reps.key)
                                cursor.value.api_desc =cursor.value.api_desc +"参数提取："+reps.value.toString()+"|"+jsonpath.toString()
                                mark.push={name:reps.value,value:cursor.id};
                                paramsList.push(reps.value)
                              }
                            }
                    }
                    if(contentStr !="" && contentStr != undefined && contentStr != [] && contentStr.length>0){
                        if(contentStr.includes(reps.key)  && !paramsList.includes(reps.value)){
                            cursor.value.api_name ="参数提取接口:"
                            if(cursor.value._resourceType =='xhr'){
                                let jsonpath=findJsonPaths(JSON.parse(contentStr),reps.key)
                                cursor.value.api_desc =cursor.value.api_desc +"参数提取："+reps.value.toString()+"|"+jsonpath.toString()
                                mark.push={name:reps.value,value:cursor.id};
                                paramsList.push(reps.value)
                              }
                        }
                    }

                    Object.keys(cursor.value.request.headers).forEach(key => {
                        cursor.value.request.headers[key].value=cursor.value.request.headers[key].value.replace(reps.key,reps.value).toString()
                    })

                    Object.keys(cursor.value.request.queryString).forEach(key => {
                        cursor.value.request.queryString[key].value=cursor.value.request.queryString[key].value.replace(reps.key,reps.value).toString()
                    })
                    if( cursor.value.request.hasOwnProperty("postData") ){
                        if(cursor.value.request.postData.mimeType.includes('multipart/form-data')){
                            Object.keys(cursor.value.request.postData.params).forEach(key => {
                                cursor.value.request.postData.params[key].value=cursor.value.request.postData.params[key].value.replace(reps.key,reps.value).toString()
                            })
                    }else{
                        cursor.value.request.postData.text =cursor.value.request.postData.text.replace(reps.key,reps.value).toString()
                    }
                    }
                    cursor.value.request.url=cursor.value.request.url.replace(reps.key,reps.value).toString()
                    store.put(cursor.value)
            }
                //console.info(cursor.value)
                make_data(cursor, getType)
            } else {
                if (valueStr.includes(searchValue)) {
                    //console.info(cursor.value)
                    make_data(cursor, getType)
                } else {
                    }
                }
            cursor.continue();
            } else {
                // 所有记录都已处理完毕
                //console.log("没有更多数据了！");
                const uniqueArray = [...new Set(typeMap)];
                //console.log(uniqueArray);
            }

        };

        cursorRequest.onerror = function (event) {
            console.error("读取数据时发生错误:", event.target.errorCode);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}

let typeMap = [];

function make_data(cursor, getType) {
    if (getType) {
        if (!(getType.includes(cursor.value._resourceType))) {
            return
        }
    }
    const row = tbody.insertRow();

    // 创建复选框单元格
    const checkboxCell = row.insertCell();
    checkboxCell.innerHTML = `<input style="width: 15px;height: 15px" type="checkbox" class="select-checkbox" pid="${cursor.value.id}">`;
    checkboxCell.style.cursor = 'pointer';

    // 为整行添加点击事件处理
    row.style.cursor = 'pointer';  // 添加手型光标样式
    row.addEventListener('click', function(e) {
        // 如果点击的是复选框本身，让浏览器处理默认行为
        if (e.target.type === 'checkbox') {
            return;
        }
        
        // 获取点击的单元格
        const clickedCell = e.target.closest('td');
        
        // 如果点击的是URL单元格（带有tooltip的单元格），不处理复选框
        if (clickedCell && (clickedCell.querySelector('[data-toggle="tooltip"]') || e.target.hasAttribute('data-toggle'))) {
            return;
        }
        
        // 切换复选框状态
        const checkbox = this.querySelector('.select-checkbox');
        if (checkbox) {
            checkbox.checked = !checkbox.checked;
            // 触发change事件以更新全选框状态和删除按钮显示
            checkbox.dispatchEvent(new Event('change'));
        }
    });

    row.insertCell().innerHTML = `<td style="width: 10px;">${lc}</td>`;
    
    // 创建可编辑的接口名单元格
    const apiNameCell = row.insertCell();
 
 
    apiNameCell.innerHTML = `<td style="width: 10px;" class="editable-cell" data-id="${cursor.value.id}">${cursor.value.api_name}</td>`;
    apiNameCell.style.cursor = 'text';

    
    // 添加双击事件监听器
    apiNameCell.addEventListener('dblclick', function(e) {
        console.log(e.target)
        const cell = e.target;
        const originalText = cell.textContent;
        //const recordId = cell.getAttribute('data-id');
        
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.border = '1px solid #4dabf7'; // 添加浅蓝色边框
        input.style.borderRadius = '3px'; // 添加圆角使其更美观
        input.style.padding = '2px';
        input.style.boxSizing = 'border-box';
        input.style.outline = 'none'; // 移除默认的focus轮廓
        
        // 替换单元格内容为输入框
        cell.textContent = '';
        cell.appendChild(input);
        input.focus();
        
        // 处理输入框失去焦点和按下回车的情况
        function handleEdit() {
            const newValue = input.value.trim();
            cell.textContent = newValue;
            recordId=0 
            console.log(recordId)
            // 更新数据库中的值
            updateApiName(recordId, newValue);
        }
        
        input.addEventListener('blur', handleEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleEdit();
            }
        });
    });

    // 创建可编辑的接口描述单元格
    const apiDescCell = row.insertCell();
    apiDescCell.innerHTML = `<td style="width: 10px;" class="editable-cell" data-id="${cursor.value.id}">${cursor.value.api_desc}</td>`;
    apiDescCell.style.cursor = 'text';
    
    // 添加双击事件监听器
    apiDescCell.addEventListener('dblclick', function(e) {
        const cell = e.target;
        const originalText = cell.textContent;
        const recordId = cell.getAttribute('data-id');

        console.log(recordId)
        
        // 创建输入框
        const input = document.createElement('input');
        input.type = 'text';
        input.value = originalText;
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.border = '1px solid #4dabf7'; // 添加浅蓝色边框
        input.style.borderRadius = '3px'; // 添加圆角使其更美观
        input.style.padding = '2px';
        input.style.boxSizing = 'border-box';
        input.style.outline = 'none'; // 移除默认的focus轮廓
        
        // 替换单元格内容为输入框
        cell.textContent = '';
        cell.appendChild(input);
        input.focus();
        
        // 处理输入框失去焦点和按下回车的情况
        function handleEdit() {
            const newValue = input.value.trim();
            cell.textContent = newValue;

         
            console.log(cursor.value.id )
            // 更新数据库中的值
            updateApiDesc(recordId, newValue);
        }
        
        input.addEventListener('blur', handleEdit);
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleEdit(recordId);
            }
        });
    });

    row.insertCell().innerHTML = `<td><div style="width: 50px">
${get_time(cursor.value.timestamp)}
</div></td>`;
    row.insertCell().innerHTML = `<td><div style="width: 50px">${cursor.value.request.httpVersion}</div></td>`;
    row.insertCell().textContent = cursor.value.request.method;
    docDomain(row, extractDomain(cursor.value.request.url))
    urlParse(cursor.value.request.url, cursor.value._resourceType, row, cursor);
    row.insertCell().innerHTML = `<td>${cursor.value.response.status}</td>`;
    row.insertCell().textContent = cursor.value.response.content.size;
    
    // 添加响应时长列
    const responseTime =  cursor.value.response.time ||cursor.value.time || 0;
    const timeCell = row.insertCell();
    timeCell.innerHTML = `<td style="text-align: right;">${responseTime} ms</td>`;
    timeCell.style.color = responseTime > 1000 ? '#ff4444' : (responseTime > 500 ? '#ffa700' : '#00C851');
    
    typeMap.push(cursor.value._resourceType);
    if (cursor.value._resourceType == "image" && cursor.value.content) {
        var img = document.createElement("img");
        if (cursor.value.content.startsWith('data:') || cursor.value.content.startsWith('<?xml')) {
            img.src = cursor.value.content; // 设置图片源为Base64字符串
        } else {
            img.src = "data:image/png;base64," + cursor.value.content; // 设置图片源为Base64字符串
        }
        img.alt = "Base64 Image"; // 设置图片的替代文本
        if (cursor.value.content.startsWith('<?xml')) {
            row.insertCell().innerHTML = `<div style="max-width: 80px;">${cursor.value.content}</div>`;
        } else {
            row.insertCell().innerHTML = `<div style="max-width: 80px;"><img style="max-width: 80px; max-height: 100px;" src="data:image/png;base64,${cursor.value.content}" alt="Base64 Image"></div>`;
        }
    } else {
        row.insertCell().textContent = cursor.value._resourceType;
    }
    // row.insertCell().innerHTML  = action();

    lc = lc + 1;
    var numElement = document.getElementById("num");
    numElement.innerHTML = lc;

    // 初始化tooltip
    $(function () {
        $('[data-toggle="tooltip"]').tooltip({
            container: "body",
            height: 100,
        });
    });
}

function get_time(timestamp) {
    // 假设我们有一个时间戳
    timestamp = Number(timestamp);
    // 使用 toISOString 方法转换为 ISO 格式的字符串
    var isoString = new Date(timestamp).toISOString();

    // 截取我们需要的部分，去掉 'Z' 表示的 UTC 时区
    //var formattedDate = isoString.slice(0, -1).replace(/T/, " ");

    var formattedDate =this.formattedTime()


    // 输出结果
    return formattedDate;
}

function truncatedUrl(url) {
    const maxNum = 80;
    const minNum = 40;
    if (url && url.length > maxNum) {
        // 截取前30位和后30位，中间用...连接
        return (
            url.substring(0, minNum) + "..." + url.substring(url.length - minNum)
        );
    }
    return url;
}

function ModalAction(action) {
    var rowData = action;
    console.log(rowData.id);
    db_search(rowData.id, function (result) {
        if (result) {
            console.log("Data retrieved:");
            // // 使用行数据填充模态框
            GeneralModalBody(result);
            ParamsModalBody(result);
            HeadersModel(result.request.headers);
            RespHeadersModel(result.response.headers)
            ResponseModalBody(result);
        } else {
            console.log("No data or error occurred.");
        }
    });
    // 显示模态框
    $("#exampleModal").modal("show");
}

function GeneralModalBody(Data) {
    var ModalBody = document.getElementById("GeneralModalBody");
    ModalBody.innerHTML = `
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Request URL:</div> <div style="color: blue"> ${Data.request.url}</div></div>
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Request MethodL:</div><div style="color: red"> ${Data.request.method}</div></div>
    <div style="display: flex;align-items: center;">
    <div style="min-width: 20%;">Status Code:</div> <div style="color: green"> ${Data.response.status}</div></div>
  `;
}

function ResponseModalBody(Data) {
    PreviewModalBody(Data);
    ActionModalBody(Data)
    var ModalBody = document.getElementById("ResponseModalBody");
    ModalBody.textContent = Data.content || "";
}

function ActionModalBody(Data) {
    var ModalBody = document.getElementById("ActionModalBody");
    var curlData = curlApi(Data.request)
    ModalBody.innerHTML = `<button type="button" class="btn btn-outline-success" id="crul${Data.id}">获取Curl命令</button>`;
    var curlButton = document.getElementById(`crul${Data.id}`);
    curlButton.addEventListener('click', function () {
        // 调用copyApi函数，并传递所需的参数
        copyApi(curlData);
    });

}

function PreviewModalBody(Data) {
    const resourceType = Data._resourceType;
    var ModalBody = document.getElementById("PreviewModalBody");
    ModalBody.textContent = "";
    var htmlString = Data.content || "";
    if (resourceType == "document") {
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, "text/html");
        var bodyContent = doc.body.innerHTML;
        var div = document.createElement("div");
        div.innerHTML = bodyContent;
        ModalBody.appendChild(div);
    } else if (resourceType == "image") {
        var img = document.createElement("img");
        if (htmlString.startsWith('data:')) {
            img.src = htmlString; // 设置图片源为Base64字符串
        } else {
            img.src = "data:image/png;base64," + htmlString; // 设置图片源为Base64字符串
        }
        if (htmlString.startsWith('<?xml')) {
            ModalBody.innerHTML = `<div style="max-width: 80px;">${htmlString}</div>`;
        } else {
            img.alt = "Base64 Image";
            try {
                ModalBody.appendChild(img);
            } catch {
                ModalBody.textContent = Data.content;
            }
        }

    } else {
        try {
            var jsonData = JSON.parse(htmlString);
            jsoneditorApi(jsonData, 'PreviewModalBody')
        } catch {
            ModalBody.textContent = Data.content;
        }
    }
}

function ParamsModalBody(Data) {
    var ParamsBody = document.getElementById("ParamsModalBody");
    var DataBody = document.getElementById("DataModalBody");
    ParamsBody.textContent = ""
    DataBody.textContent = ""
    try {
        ParamsBody.textContent = param_to_string(Data.request.queryString);
    } catch (error) {
        console.error("Error parsing JSON:", error);
    }
    try {
        var htmlString = Data.request.postData.text;
        try {
            var jsonData = JSON.parse(htmlString);
            jsoneditorApi(jsonData, 'DataModalBody')
        } catch {
            DataBody.textContent = htmlString;
        }
    } catch {
    }
}

function HeadersModel(Data) {
    var ModalBody = document.getElementById("HeadersModalBody");
    ModalBody.innerHTML = "";
    Data.forEach((item, index) => {
        ModalBody.appendChild(document.createElement("div")).innerHTML = `
    <div style="
    display: flex;
    align-items: center;
    font-size: 13px;
    ">
      <div style="min-width: 20%;">${item.name.replace(/^:/, "")}:</div>
      <div>${item.value}</div>
    </div>
    `;
    });
}

function RespHeadersModel(Data) {
    var ModalBody = document.getElementById("RespHeadersModalBody");
    ModalBody.innerHTML = "";
    Data.forEach((item, index) => {
        ModalBody.appendChild(document.createElement("div")).innerHTML = `
    <div style="
    display: flex;
    align-items: center;
    font-size: 13px;
    ">
      <div style="min-width: 20%;">${item.name.replace(/^:/, "")}:</div>
      <div>${item.value}</div>
    </div>
    `;
    });
}

function extractDomain(url) {
    // 正则表达式匹配 URL 中的域名部分
    var domainPattern = /[^:\/?#]+:\/\/([^\/?#:]+)[^\/?#:]*/;
    var match = url.match(domainPattern);
    if (!url.startsWith("http")) {
        return "";
    }
    if (match && match[1]) {
        // 如果匹配成功，返回域名部分
        return match[1];
    }

    // 如果不是有效的 URL 或匹配失败，返回空字符串
    return "";
}

function db_search(idToSearch, callback) {
    const request = indexedDB.open("myDatabase", db_version);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // 检查对象存储是否存在，如果不存在则创建它
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        console.log("Database opened successfully with version: ", db.version);

        // 执行查询操作
        const transaction = db.transaction("myDataStore", "readonly");
        const objectStore = transaction.objectStore("myDataStore");

        // 创建一个请求来获取指定id的数据
        const getRequest = objectStore.get(idToSearch);

        getRequest.onsuccess = function () {
            if (getRequest.result) {
                callback(getRequest.result);
            } else {
                console.log("No data found with id: ", idToSearch);
                callback(null);
            }
        };

        getRequest.onerror = function (event) {
            console.error(
                "Error occurred while retrieving data: ",
                event.target.errorCode
            );
        };
    };

    request.onerror = function (event) {
        console.error("Error opening database: ", event.target.errorCode);
    };
}

$(document).ready(function () {
    // 监听collapse的show和hide事件
    $("#Headerscollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#toggleIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#toggleIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
    $("#Generalcollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#GeneralIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#GeneralIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
    $("#RespHeaderscollapse")
        .on("show.bs.collapse", function () {
            // 当collapse显示时，改变图标
            $("#ResptoggleIcon")
                .removeClass("bi bi-caret-right-fill")
                .addClass("bi bi-caret-down-fill");
        })
        .on("hide.bs.collapse", function () {
            $("#ResptoggleIcon")
                .removeClass("bi bi-caret-down-fill")
                .addClass("bi bi-caret-right-fill");
        });
});

function search() {
    const searchInput = document.getElementById('search');
    return searchInput ? searchInput.value : '';
}

function docDomain(row, data) {
    var div = document.createElement('td');
    div.innerHTML = `<div style="width: 100px; word-wrap: break-word;">${data}</div>`;
    row.appendChild(div)
}

function urlParse(url, resourceType, row, cursor) {
    map = {
        "script": '#FF1744',
        "image": 'gray',
        "document": 'green',
        "xhr": 'blue',
        "stylesheet": '#424242',
    }
    var colorStr = map[resourceType] || 'blue';
    var div = document.createElement('td');
    var p = document.createElement('p');

    p.setAttribute('data-toggle', 'tooltip');
    p.setAttribute('data-placement', 'top');
    p.setAttribute('title', url); // 假设url是有效的URL字符串
    p.style.color = colorStr;
    p.style.fontSize = '16px';
    p.innerHTML = truncatedUrl(url); // 设置p元素的innerHTML为截断后的URL

    // 将p元素添加到div中
    div.appendChild(p);

    // 将当前行的数据添加到div的data属性中
    div.dataset.row = JSON.stringify({id: cursor.value.id});

    // 为div添加点击事件监听器
    div.addEventListener("click", function () {
        ModalAction(JSON.parse(div.dataset.row)); // 传递行数据给ModalAction函数
    });
    row.appendChild(div)
}

function param_to_string(data) {
    var param = new URLSearchParams();

    // 遍历数据数组，将每一项添加到URLSearchParams对象中
    data.forEach(item => {
        param.append(item.name, item.value);
    });

    return param.toString();
}


$(function () {
    $("#Headerscollapse").collapse({
        toggle: true,
    });
    $("#RespHeaderscollapse").collapse({
        toggle: true,
    });
    $("#Generalcollapse").collapse({
        toggle: true,
    });
});
let ctrlPressed = false;
let shiftPressed = false;
let lastKeyPress = null;
document.addEventListener("keydown", function (event) {
    // 检查是否同时按下了Ctrl和X
    if (event.key === 'Control' || event.key === 'ControlLeft') {
        ctrlPressed = true;
    } else if (event.key === 'Shift' || event.key === 'ShiftLeft') {
        shiftPressed = true;
    }

    // 如果按下了 X 键，并且 Ctrl 和 Shift 都已被按下
    if (event.key === 'x' || event.key === 'X') {
        if (ctrlPressed && shiftPressed) {
            // 执行特定函数
            del_data();
        }
        lastKeyPress = event.key;
    }

    // 重置状态
    if (event.key === lastKeyPress) {
        ctrlPressed = false;
        shiftPressed = false;
    }
});

function jsoneditorApi(initialJson, bid) {
    const container = document.getElementById(bid)
    container.innerText = ''
    const options = {
        'mode': 'code',
        'enableTransform': false,
    }
    const editor = new JSONEditor(container, options)
    editor.set(initialJson)
}

$(function () {
    get_data(true);
})


function curlApi(request) {
    console.log(request);
    const method = request.method;
    const url = request.url;
    const headers = request.headers;
    var body = ""
    try {
        body = request.postData.text;
    } catch {
    }
    var curlCommand = `curl '${url}'`;

    if (headers) {
        headers.forEach((value, key) => {
            curlCommand += ` -H '${value.name.replace(/^:/, "")}: ${value.value}'`;
        });
    }

    if (body) {
        curlCommand += ` --data-raw '${body}'`;
    }
    return curlCommand
}

// curlApi({
//     method: method,
//     url: url,
//     headers: cursor.value.request.headers,
//     body: bodydata,
// })
function copyApi(e) {
    console.log(e)
    // 获取toast的引用
    Toast('Curl', '复制成功')
    navigator.clipboard.writeText(e).then(function () {
        console.log('Text copied to clipboard');
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

function del_one_data(pid) {
    try{
          mark.forEach(index => {
            if(mark[index].value == Number(pid)){
               mark.splice(index, 1);
               paramsList.splice(paramsList.indexOf(mark[index].key), 1);
            }
          });
    }catch{
    }
    const request = indexedDB.open("myDatabase", db_version);
    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true,
            });
        }
    };
    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        const store = transaction.objectStore("myDataStore");
        const request = store.delete(Number(pid));
        request.onsuccess = function (e) {
            console.log('Item deleted successfully');
        };

        request.onerror = function (e) {
            console.error('Delete error:', e);
        };
        transaction.oncomplete = function () {
            // 可选：关闭数据库连接
            db.close();
        };
        transaction.onerror = function (e) {
            console.error('Transaction error:', e);
        };
    };

    request.onerror = function (event) {
        console.error("打开IndexedDB时发生错误:", event.target.errorCode);
    };
}



function Toast(title = "", content = "") {
    var myToast = $('#myToast');
    // 将标题和内容合并成单行显示
    const message = title + (content ? ' ' + content : '');
    document.getElementById('toastTitle').innerText = '';  // 清空标题
    document.getElementById('toastBody').innerText = message;  // 将完整消息放在 body 中
    
    // 设置 toast 的样式
    myToast.css({
        'position': 'fixed',
        'top': '70px',  // 距离顶部70px
        'left': '50%',
        'transform': 'translateX(-50%)',
        'z-index': '9999',
        'margin': '0 auto',
        'white-space': 'nowrap',  // 确保文本在一行显示
        'overflow': 'hidden',     // 隐藏溢出内容
        'text-overflow': 'ellipsis'  // 超出部分显示省略号
    });
    
    // 配置 toast 选项
    $('#myToast').toast({
        delay: 3000,
        animation: true
    });
    
    myToast.toast('show');
}




document.addEventListener('DOMContentLoaded', function () {

});

function export_table_data() {
 // 假设表格有一个ID，如<table id="myTable">
 var table = document.querySelector('#tableData');
 var rows = table.querySelectorAll('tr');

 var tableData = [];
 let num=0;
 rows.forEach(function(row) {
  if(num>0){
     var columns = row.querySelectorAll('td');
     var rowData = [];

     columns.forEach(function(column) {
         rowData.push(column.textContent.trim());
     });

     tableData.push(rowData);
     }
     num=num+1;
 });

 console.log(tableData);
}
//替换表格式件
function reps_table_data(from, to) {
    if (!from || !to) {
        Toast('替换失败', '请输入要替换的内容和替换后的内容');
        return;
    }

    let hasMatches = false;
    const searchValue = search();  // 获取当前搜索值
    const request = indexedDB.open("myDatabase", db_version);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("myDataStore")) {
            db.createObjectStore("myDataStore", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        try {
            const transaction = db.transaction("myDataStore", "readwrite");
            const store = transaction.objectStore("myDataStore");
            const cursorRequest = store.openCursor();

            cursorRequest.onsuccess = function (event) {
                const cursor = event.target.result;
                if (cursor) {
                    let data = cursor.value;
                    let needsUpdate = false;

                    // 检查是否符合搜索条件
                    const valueStr = JSON.stringify(data);
                    
                    if (searchValue && !valueStr.includes(searchValue)) {
                        cursor.continue();
                        return;
                    }
                    console.log
                    try {
                        // 替换请求体
                        if (data.request && data.request.postData && data.request.postData.text) {
                            if (data.request.postData.text.includes(from)) {
                                data.request.postData.text = data.request.postData.text.replace(new RegExp(from, 'g'), to);
                                needsUpdate = true;
                                hasMatches = true;
                            }
                        }

                        // 替换请求头
                        if (data.request && data.request.headers) {
                            Object.keys(data.request.headers).forEach(key => {
                                if (data.request.headers[key].value.includes(from)) {
                                    data.request.headers[key].value = data.request.headers[key].value.replace(new RegExp(from, 'g'), to);
                                    needsUpdate = true;
                                    hasMatches = true;
                                }
                            });
                        }

                        // 替换查询参数
                        if (data.request && data.request.queryString) {
                            Object.keys(data.request.queryString).forEach(key => {
                                if (data.request.queryString[key].value.includes(from)) {
                                    data.request.queryString[key].value = data.request.queryString[key].value.replace(new RegExp(from, 'g'), to);
                                    needsUpdate = true;
                                    hasMatches = true;
                                }
                            });
                        }

                        // 替换URL
                        if (data.request && data.request.url && data.request.url.includes(from)) {
                            data.request.url = data.request.url.replace(new RegExp(from, 'g'), to);
                            needsUpdate = true;
                            hasMatches = true;
                        }

                        // 如果有更新，保存更改
                        if (needsUpdate) {
                            cursor.update(data).onsuccess = function() {
                                console.log('数据更新成功');
                            };
                        }
                    } catch (error) {
                        console.log("处理数据时发生错误:", error);
                    }

                    cursor.continue();
                } else {
                    // 所有记录处理完毕
                    if (hasMatches) {
                        Toast('替换成功', `已将 "${from}" 替换为 "${to}"`);
                        // 刷新数据显示，保持当前搜索和过滤状态
                        get_data(true);
                    } else {
                        Toast('替换失败', '在当前条件下未找到匹配内容');
                    }
                }
            };

            cursorRequest.onerror = function (event) {
                console.error("读取数据时发生错误:", event.target.error);
                Toast('替换失败', '数据读取错误');
            };

            transaction.oncomplete = function() {
                db.close();
            };

            transaction.onerror = function(event) {
                console.error("事务错误:", event.target.error);
                Toast('替换失败', '数据库事务错误');
            };
        } catch (error) {
            console.error("数据库操作错误:", error);
            Toast('替换失败', '数据库操作错误');
        }
    };

    request.onerror = function (event) {
        console.error("打开数据库失败:", event.target.error);
        Toast('替换失败', '数据库打开错误');
    };
}

function convertTransactionsJson(name,transactions) {
      var item=[]
      let keys = Object.keys(transactions);
      keys.forEach(key => {
            //求获取过滤类型条件
            if ((dataType != false  && dataType.includes(transactions[key]._resourceType))||dataType ==false) {
                if (withRes === true){
                   transactions[key].content=''
                }
                item.push(transactions[key])
            }

            });
      return item;
    }

function convertTransactionsPostman(name,transactions) {
      var  data={}
      var  info={}
      info.name=name
      info._postman_id=this.uuid()
      info.schema='https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      info._exporter_id=this.formattedDate()
      data.info=info
      var item=[]
      var num =1;

      let keys = Object.keys(transactions);
      keys.forEach(key => {
            //求获取过滤类型条件
            if ((dataType != false  && dataType.includes(transactions[key]._resourceType))||dataType ==false) {
               num=num+1;
               var array={}
               var rst={}
               array.name=name+"_未定义接口_序号"+num
               num=num+1;
               console.info(transactions[key])
               rst.method=transactions[key].request.method
               rst.header=transactions[key].request.headers
               Object.keys(rst.header).forEach(k => {
                    rst.header[k].key= rst.header[k].name
                    rst.header[k].value= rst.header[k].value
                    rst.header[k].type='text'
                    delete rst.header[k].name
               });

               rst.body={}

               if( transactions[key].request.hasOwnProperty("postData") ){

                  if(transactions[key].request.postData.hasOwnProperty("params") && transactions[key].request.postData.mimeType.includes('multipart/form-data') && transactions[key].request.postData.mimeType.includes('boundary=')){
                    //上传文件处理
                    rst.body.mode="formdata"
                    rst.body.formdata=transactions[key].request.postData.params
                    Object.keys(rst.body.formdata).forEach(k => {
                           rst.body.formdata[k].key=rst.body.formdata[k].name
                           delete rst.body.formdata[k].name
                           rst.body.formdata[k].value=rst.body.formdata[k].value
                           rst.body.formdata[k].type='file'
                    });

                  }else if(transactions[key].request.postData.hasOwnProperty("params")){

                    //上传文件处理
                    rst.body.mode="formdata"
                    rst.body.formdata=transactions[key].request.postData.params
                    Object.keys(rst.body.formdata).forEach(k => {
                           rst.body.formdata[k].key=rst.body.formdata[k].name
                           delete rst.body.formdata[k].name
                           rst.body.formdata[k].value=rst.body.formdata[k].value
                           rst.body.formdata[k].type='default'
                    });
                  }else{
                    rst.body.mode="raw"
                    rst.body.raw=transactions[key].request.postData.text
                  }
               }

                const str = transactions[key].request.url
 		        var index = str.indexOf(":")
 		        var resolve = str.substring(0, index);
 		        console.log(resolve)
 		        if(resolve==""){ resolve="http"}

 		        // url转变量
 		        var query =[]

 		        if(transactions[key].request.queryString.length>0){
                    Object.keys(transactions[key].request.queryString).forEach(k => {
                       query.push({"key":transactions[key].request.queryString[k].name,"value":transactions[key].request.queryString[k].value})
                    });
 		        }

 		        let urlStr=str //.replace(this.getDomain(str),"$$${domain}")
                rst.url={"raw":urlStr.substring(0, 255),"protocol":resolve,"host":[{"domain":this.getDomain(urlStr),"IP":transactions[key].serverIPAddress}],"query":query}
                if (withRes === true){
                                rst.response={}
                                rst.response.headers=transactions[key].response.headers
                                rst.response.status=transactions[key].response.status
                                rst.response.time=transactions[key].response.time
                                rst.response.content=transactions[key].content
                }

                array.request=rst


                item.push(array)
                num=num+1;

            }
            });
      data.item=item;
      return data;
    }


function   convertTransactionsEXCEL(transactions) {
        var deviceList = [
                ["*用例名称","用例描述","*请求类型","请求头参数","*请求地址","环境分组","IP变量名","请求体类型","请求体","检查点匹配方式","检查点期望值"]
                       ]
        let keys = Object.keys(transactions);
        keys.forEach(key => {
        if (!transactions[key].hasOwnProperty("url")) {
             let name = key.split(" [")[0];
             let request = [];
             let traffic = Object.keys(transactions[key]);
             let num=1;
             traffic.forEach(index => {
             let headers=""
             let hds=transactions[key][index]['headers']
             hds.forEach(key => {
                  headers=headers+key['name']+"="+key['value']+"&"
                      });
        let array=[]
        array.push(name)
        array.push(name+num)
        array.push(transactions[key][index]['method'])
        array.push(headers)
        array.push(transactions[key][index]['url'])
        array.push("alpha")
        array.push("")
        array.push("json")
        array.push(JSON.stringify(transactions[key][index]['body']))
        array.push("精确匹配")
        array.push("success")
        deviceList.push(array)
        num=num+1;
                    })
            } else {
                 alert("数据异常，未抓取响应的请求数据")
            }
        });

        var sheet = XLSX.utils.aoa_to_sheet(deviceList);
        return this.sheet2blob(sheet,name);
    }


 

function download(name, str) {
        let blob = new Blob([str], {type: "application/octet-stream"});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }


    function downloadJson(name, transactions) {
        let blob=  this.convertTransactionsJson(name,transactions);
        this.download(name+'_'+this.formattedDate() + ".json", JSON.stringify(blob, null, 4));
    }


function downloadPostman(name, transactions) {
        let blob=  this.convertTransactionsPostman(name,transactions);
        this.download(name+'_'+this.formattedDate() + ".json", JSON.stringify(blob, null, 4));
    }


function downloadJMX(name, transactions) {
    // 转换数据为JMeter格式
    const jmxContent = generateJMX(name, transactions);
    
    // 创建Blob对象
    const blob = new Blob([jmxContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // 创建下载链接并触发下载
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name}_${formattedDate()}.jmx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function generateJMX(name, transactions) {
    // JMeter测试计划的基本结构
    let jmx = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.4.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="${name}" enabled="true">
      <stringProp name="TestPlan.comments"></stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments"/>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Thread Group" enabled="true">
        <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <stringProp name="LoopController.loops">1</stringProp>
        </elementProp>
        <stringProp name="ThreadGroup.num_threads">1</stringProp>
        <stringProp name="ThreadGroup.ramp_time">1</stringProp>
        <boolProp name="ThreadGroup.scheduler">false</boolProp>
        <stringProp name="ThreadGroup.duration"></stringProp>
        <stringProp name="ThreadGroup.delay"></stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <boolProp name="ThreadGroup.delayedStart">false</boolProp>
      </ThreadGroup>
      <hashTree>
        <ResultCollector guiclass="ViewResultsFullVisualizer" testclass="ResultCollector" testname="View Results Tree" enabled="true">
          <boolProp name="ResultCollector.error_logging">false</boolProp>
          <objProp>
            <name>saveConfig</name>
            <value class="SampleSaveConfiguration">
              <time>true</time>
              <latency>true</latency>
              <timestamp>true</timestamp>
              <success>true</success>
              <label>true</label>
              <code>true</code>
              <message>true</message>
              <threadName>true</threadName>
              <dataType>true</dataType>
              <encoding>false</encoding>
              <assertions>true</assertions>
              <subresults>true</subresults>
              <responseData>false</responseData>
              <samplerData>false</samplerData>
              <xml>false</xml>
              <fieldNames>true</fieldNames>
              <responseHeaders>false</responseHeaders>
              <requestHeaders>false</requestHeaders>
              <responseDataOnError>false</responseDataOnError>
              <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
              <assertionsResultsToSave>0</assertionsResultsToSave>
              <bytes>true</bytes>
              <sentBytes>true</sentBytes>
              <url>true</url>
              <threadCounts>true</threadCounts>
              <idleTime>true</idleTime>
              <connectTime>true</connectTime>
            </value>
          </objProp>
          <stringProp name="filename"></stringProp>
        </ResultCollector>
        <hashTree/>`;

    // 遍历所有请求，生成HTTP采样器
    transactions.forEach((transaction, index) => {
        if(transaction._resourceType === 'xhr' || transaction._resourceType === 'fetch') {
            const url = new URL(transaction.request.url);
            const headers = transaction.request.headers;
            const method = transaction.request.method;
            const postData = transaction.request.postData;

            jmx += `
        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="${escapeXml(transaction.api_name || url.pathname)}" enabled="true">
          <elementProp name="HTTPsampler.Arguments" elementType="Arguments" guiclass="HTTPArgumentsPanel" testclass="Arguments" enabled="true">
            <collectionProp name="Arguments.arguments">`;

            // 添加POST数据
            if (postData && postData.text) {
                if (postData.mimeType && postData.mimeType.includes('application/json')) {
                    jmx += `
              <elementProp name="" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">false</boolProp>
                <stringProp name="Argument.value">${escapeXml(postData.text)}</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
                <boolProp name="HTTPArgument.use_equals">true</boolProp>
              </elementProp>`;
                } else if (postData.params) {
                    // 处理form数据
                    postData.params.forEach(param => {
                        jmx += `
              <elementProp name="${escapeXml(param.name)}" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">true</boolProp>
                <stringProp name="Argument.name">${escapeXml(param.name)}</stringProp>
                <stringProp name="Argument.value">${escapeXml(param.value)}</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
                <boolProp name="HTTPArgument.use_equals">true</boolProp>
              </elementProp>`;
                    });
                }
            }

            // 添加查询参数
            if (url.search) {
                const searchParams = new URLSearchParams(url.search);
                for (const [key, value] of searchParams) {
                    jmx += `
              <elementProp name="${escapeXml(key)}" elementType="HTTPArgument">
                <boolProp name="HTTPArgument.always_encode">true</boolProp>
                <stringProp name="Argument.name">${escapeXml(key)}</stringProp>
                <stringProp name="Argument.value">${escapeXml(value)}</stringProp>
                <stringProp name="Argument.metadata">=</stringProp>
                <boolProp name="HTTPArgument.use_equals">true</boolProp>
              </elementProp>`;
                }
            }

            jmx += `
            </collectionProp>
          </elementProp>
          <stringProp name="HTTPSampler.domain">${escapeXml(url.hostname)}</stringProp>
          <stringProp name="HTTPSampler.port">${url.port || ""}</stringProp>
          <stringProp name="HTTPSampler.protocol">${url.protocol.replace(':', '')}</stringProp>
          <stringProp name="HTTPSampler.contentEncoding">UTF-8</stringProp>
          <stringProp name="HTTPSampler.path">${escapeXml(url.pathname)}</stringProp>
          <stringProp name="HTTPSampler.method">${method}</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
          <boolProp name="HTTPSampler.DO_MULTIPART_POST">${postData && postData.mimeType && postData.mimeType.includes('multipart/form-data')}</boolProp>
          <stringProp name="HTTPSampler.embedded_url_re"></stringProp>
          <stringProp name="HTTPSampler.connect_timeout"></stringProp>
          <stringProp name="HTTPSampler.response_timeout"></stringProp>
          <stringProp name="TestPlan.comments">${escapeXml(transaction.api_desc || '')}</stringProp>
        </HTTPSamplerProxy>
        <hashTree>
          <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
            <collectionProp name="HeaderManager.headers">`;

            // 添加请求头
            Object.keys(headers).forEach(key => {
                jmx += `
              <elementProp name="" elementType="Header">
                <stringProp name="Header.name">${escapeXml(headers[key].name)}</stringProp>
                <stringProp name="Header.value">${escapeXml(headers[key].value)}</stringProp>
              </elementProp>`;
            });

            jmx += `
            </collectionProp>
          </HeaderManager>
          <hashTree/>
          <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Response Assertion" enabled="true">
            <collectionProp name="Asserion.test_strings">
              <stringProp name="49586">200</stringProp>
            </collectionProp>
            <stringProp name="Assertion.custom_message"></stringProp>
            <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
            <boolProp name="Assertion.assume_success">false</boolProp>
            <intProp name="Assertion.test_type">8</intProp>
          </ResponseAssertion>
          <hashTree/>
        </hashTree>`;
        }
    });

    // 关闭测试计划
    jmx += `
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>`;

    return jmx;
}

// 辅助函数：XML转义
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/[<>&'"]/g, function (c) {
            switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
            }
        });
}

function export_data() {
  var  list=[]
    return new Promise((resolve, reject) => {
     const request = indexedDB.open("myDatabase", db_version);
     request.onupgradeneeded = function (event) {
         const db = event.target.result;
         if (!db.objectStoreNames.contains("myDataStore")) {
             db.createObjectStore("myDataStore", {
                 keyPath: "id",
                 autoIncrement: true,
             });
         }
     };

     request.onsuccess = function (event) {
         const db = event.target.result;
         const transaction = db.transaction("myDataStore", "readwrite");
         const objectStore = transaction.objectStore("myDataStore");
          // 获取所有记录
          var getAll = objectStore.getAll();
          getAll.onerror = (event) => {
              console.log("查询失败");

              reject(event.target.errorCode);
          };
          getAll.onsuccess= (event) => {
              //list就是查询到的所有数据
              list = getAll.result
              console.log(list);
              console.log("查询成功");
              resolve(event.target.result);


          };

     };

     request.onerror = function (event) {
         console.error("打开IndexedDB时发生错误:", event.target.errorCode);
     };

  });
    return list;
}



    // 将一个sheet转成最终的excel文件的blob对象
function sheet2blob(sheet, sheetName) {

    sheetName = sheetName || 'sheet1';
    var workbook = {
    SheetNames: [sheetName],
    Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // 字符串转ArrayBuffer
    function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
    }
    return blob;
    }
function uuid() {
	   var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
		    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    return uuid;
    }
function getDomain(url) {
        var domain=""
        try {
            domain = new URL(url).hostname;
            //const domain = url.split('/')[2];
          } catch (e) {
             console.info("url格式错误: " + domain)
          }
	    return domain
    }
function getUrlParams(url) {
        // 通过 ? 分割获取后面的参数字符串
        let urlStr = url.split('?')[1]
        // 创建空对象存储参数

	    let params = [];
        // 再通过 & 将每一个参数单独分割出来
	    let paramsArr = urlStr.split('&')
	    for(let i = 0,len = paramsArr.length;i < len;i++){
            // 再通过 = 将每一个参数分割为 key:value 的形式
		    let arr = paramsArr[i].split('=')
		    console.log(arr)
		    let obj  ={"key":arr[0],"value":arr[1]}
			params.push(obj)

	    }
        console.log(params)
	    return params
    }
function getUrlParamsNew(url) {
        const searchParams = new URLSearchParams(new URL(url).search);
        const params = {};

        searchParams.forEach((value, name) => {
        params[name] = value;
            });

        return params;
    }
function getUrlPath(url) {
        var path=""
        try {
            var path = new URL(url).pathname;
          } catch (e) {
             console.info("path格式错误: " + path)
          }
	    return path
    }
function formattedDate() {
        let currentTime = new Date();

        // 获取年份
        let year = currentTime.getFullYear();

        // 获取月份（注意月份是从0开始计数的，所以需要加1）
        let month = currentTime.getMonth() + 1;

        // 获取日期
        let day = currentTime.getDate();

        // 获取小时
        let hours = currentTime.getHours();

        // 获取分钟
        let minutes = currentTime.getMinutes();

        // 获取秒数
        let seconds = currentTime.getSeconds();

        // 格式化时间为 YYYYMMDDHHMMSS
        let formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
	    return formattedDate;
    }

function formattedTime() {
        let currentTime = new Date();

        // 获取年份
        let year = currentTime.getFullYear();

        // 获取月份（注意月份是从0开始计数的，所以需要加1）
        let month = currentTime.getMonth() + 1;

        // 获取日期
        let day = currentTime.getDate();

        // 获取小时
        let hours = currentTime.getHours();

        // 获取分钟
        let minutes = currentTime.getMinutes();

        // 获取秒数
        let seconds = currentTime.getSeconds();

        // 格式化时间为 YYYYMMDDHHMMSS
        let formattedDate = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        let  timestamp = new Date().getTime();

	    return formattedDate+":"+timestamp.toString().substring(10,13);
    }


function getDict(){
      let obj ={}
      obj["/contract/api/"]="接口自动命名列表"

      return obj
    }
// 监听整个document的click事件
document.addEventListener('click', function (event) {
    // 检查点击的是否是复选框
    const checkedBoxes = document.querySelectorAll('.select-checkbox:checked');
    const checkedCount = checkedBoxes.length;
    
    // 根据是否有复选框被选中，显示或隐藏删除按钮
    const deleteButton = document.getElementById('deleteButton');
    if (checkedCount > 0) {
        deleteButton.style.display = 'inline-block';
        deleteButton.textContent = `删除选中(${checkedCount})`;
    } else {
        deleteButton.style.display = 'none';
        deleteButton.textContent = '删除选中';
    }
    
    // 检查点击的是否是删除按钮
    if (event.target.id === 'deleteButton') {
        // 找到所有选中的复选框所在的行并删除它们
        checkedBoxes.forEach(checkbox => {
            var pid = checkbox.getAttribute('pid');
            del_one_data(pid);
            var numElement = document.getElementById("num");
            lc = lc - 1;
            numElement.innerHTML = lc;
            checkbox.closest('tr').remove();
        });
        // 删除后隐藏删除按钮
        deleteButton.style.display = 'none';
        deleteButton.textContent = '删除选中';
        // 取消全选框的选中状态
        document.getElementById('selectAll').checked = false;
    }
});

// 添加全选功能
document.getElementById('selectAll').addEventListener('change', function(e) {
    const checkboxes = document.querySelectorAll('.select-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = e.target.checked;
    });
    // 更新删除按钮状态和文本
    const deleteButton = document.getElementById('deleteButton');
    if (e.target.checked) {
        deleteButton.style.display = 'inline-block';
        deleteButton.textContent = `删除选中(${checkboxes.length})`;
    } else {
        deleteButton.style.display = 'none';
        deleteButton.textContent = '删除选中';
    }
});

// 监听单个复选框的变化，更新全选框状态和删除按钮文本
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('select-checkbox')) {
        const checkboxes = document.querySelectorAll('.select-checkbox');
        const checkedBoxes = document.querySelectorAll('.select-checkbox:checked');
        const selectAll = document.getElementById('selectAll');
        const deleteButton = document.getElementById('deleteButton');
        
        selectAll.checked = checkboxes.length === checkedBoxes.length;
        
        if (checkedBoxes.length > 0) {
            deleteButton.style.display = 'inline-block';
            deleteButton.textContent = `删除选中(${checkedBoxes.length})`;
        } else {
            deleteButton.style.display = 'none';
            deleteButton.textContent = '删除选中';
        }
    }
});

// 监听标签页创建，保持抓包状态
chrome.tabs.onCreated.addListener(function(tab) {
    chrome.storage.local.get('slinSwitch', function (result) {
        if (result.slinSwitch !== undefined) {
            chrome.storage.local.set({slinSwitch: result.slinSwitch});
        }
    });
});

function downloadExcel(name, transactions) {
    // 创建表头
    const headers = [
        "序号",
        "接口名",
        "接口描述",
        "请求时间",
        "请求方法",
        "域名",
        "URL",
        "状态码",
        "响应大小",
        "响应时间(ms)",
        "类型",
        "请求头",
        "请求参数",
        "请求体",
        "Cookies"
    ];

    // 创建数据行
    const rows = [];
    rows.push(headers); // 添加表头

    let index = 1;
    transactions.forEach(transaction => {
        try {
            // 检查是否符合当前过滤条件
            if ((dataType && dataType.includes(transaction._resourceType)) || !dataType) {
                // 处理请求头
                let headersStr = '';
                if (transaction.request && transaction.request.headers) {
                    headersStr = Object.values(transaction.request.headers)
                        .map(h => `${h.name}: ${h.value}`)
                        .join('\n');
                }

                // 处理请求参数（URL参数）
                let queryParamsStr = '';
                if (transaction.request && transaction.request.queryString) {
                    queryParamsStr = transaction.request.queryString
                        .map(param => `${param.name}=${param.value}`)
                        .join('\n');
                }

                // 处理请求体
                let requestBodyStr = '';
                if (transaction.request && transaction.request.postData) {
                    if (transaction.request.postData.text) {
                        requestBodyStr = transaction.request.postData.text;
                    } else if (transaction.request.postData.params) {
                        requestBodyStr = transaction.request.postData.params
                            .map(param => `${param.name}=${param.value}`)
                            .join('\n');
                    }
                }

                // 处理Cookies
                let cookiesStr = '';
                if (transaction.request && transaction.request.cookies) {
                    cookiesStr = transaction.request.cookies
                        .map(cookie => `${cookie.name}=${cookie.value}`)
                        .join('\n');
                }

                const row = [
                    index++,
                    transaction.api_name || "未定义接口",
                    transaction.api_desc || "",
                    get_time(transaction.timestamp),
                    transaction.request.method,
                    extractDomain(transaction.request.url),
                    transaction.request.url,
                    transaction.response ? transaction.response.status : "",
                    transaction.response && transaction.response.content ? transaction.response.content.size : 0,
                    transaction.response ? (transaction.response.time || transaction.time || 0) : 0,
                    transaction._resourceType || "",
                    headersStr,
                    queryParamsStr,
                    requestBodyStr,
                    cookiesStr
                ];
                rows.push(row);
            }
        } catch (error) {
            console.error('Error processing transaction:', error);
            // 继续处理下一条数据
        }
    });

    // 如果没有数据，显示提示
    if (rows.length <= 1) {
        Toast('导出失败', '没有符合条件的数据');
        return;
    }

    try {
        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(rows);

        // 设置列宽
        const colWidths = [
            { wch: 8 },  // 序号
            { wch: 20 }, // 接口名
            { wch: 30 }, // 接口描述
            { wch: 20 }, // 请求时间
            { wch: 10 }, // 请求方法
            { wch: 25 }, // 域名
            { wch: 60 }, // URL
            { wch: 10 }, // 状态码
            { wch: 12 }, // 响应大小
            { wch: 15 }, // 响应时间
            { wch: 12 }, // 类型
            { wch: 50 }, // 请求头
            { wch: 40 }, // 请求参数
            { wch: 50 }, // 请求体
            { wch: 40 }  // Cookies
        ];
        ws['!cols'] = colWidths;

        // 设置单元格自动换行
        for (let i = 1; i < rows.length; i++) {
            for (let j = 11; j <= 14; j++) { // 请求头、请求参数、请求体和Cookies列
                const cellRef = XLSX.utils.encode_cell({r: i, c: j});
                if (!ws[cellRef]) continue;
                if (!ws[cellRef].s) ws[cellRef].s = {};
                ws[cellRef].s.alignment = { wrapText: true, vertical: 'top' };
            }
        }

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "抓包数据");

        // 生成Excel文件并下载
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}_${formattedDate()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Toast('导出成功', `已导出 ${rows.length - 1} 条数据`);
    } catch (error) {
        console.error('Error generating Excel:', error);
        Toast('导出失败', '生成Excel文件时发生错误');
    }
}

// 添加更新数据库中API名称的函数
function updateApiName(recordId, newName) {

    console.log("aaaaaaaaaaaaaaa")
    const request = indexedDB.open("myDatabase", db_version);
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        const store = transaction.objectStore("myDataStore");
        
        // 获取记录
        console.log(recordId)
        const getRequest = store.get(Number(recordId));
        

      
        getRequest.onsuccess = function(event) {
            const record = event.target.result;
            if (record) {
                // 更新API名称
                record.api_name = newName;
                
                // 保存更新后的记录
                const updateRequest = store.put(record);
                
                updateRequest.onsuccess = function() {
                    Toast('更新成功', '接口名称已更新');
                    // 刷新表格数据
                    get_data(true);
                };
                
                updateRequest.onerror = function() {
                    Toast('更新失败', '保存接口名称时出错');
                };
            }
        };
        
        getRequest.onerror = function() {
            Toast('更新失败', '获取记录时出错');
        };
    };
    
    request.onerror = function() {
        Toast('更新失败', '打开数据库时出错');
    };
}

// Add the updateApiDesc function at the end of the file
function updateApiDesc(recordId, newDesc) {
    const request = indexedDB.open("myDatabase", db_version);
    
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction("myDataStore", "readwrite");
        const store = transaction.objectStore("myDataStore");
        
        // 获取记录
        const getRequest = store.get(Number(recordId));
        
        getRequest.onsuccess = function(event) {
            const record = event.target.result;
            if (record) {
                // 更新API描述
                record.api_desc = newDesc;
                
                // 保存更新后的记录
                const updateRequest = store.put(record);
                
                updateRequest.onsuccess = function() {
                    Toast('更新成功', '接口描述已更新');
                    // 刷新表格数据
                    get_data(true);
                };
                
                updateRequest.onerror = function() {
                    Toast('更新失败', '保存接口描述时出错');
                };
            }
        };
        
        getRequest.onerror = function() {
            Toast('更新失败', '获取记录时出错');
        };
    };
}