const INDENT = '  '; // 缩进2空格

class Element {
    constructor(name, attributes, value) {
        this.indent = '';
        this.name = name;  // 标签名
        this.attributes = attributes || {}; // 属性
        this.value = undefined; // 基础类型的内容
        this.elements = []; // 子节点

        if (value instanceof Element) {
            this.elements.push(value);
        } else {
            this.value = value;
        }
    }

    set(value) {
        this.elements = [];
        this.value = value;
    }

    add(element) {
        if (element instanceof Element) {
            this.value = undefined;
            this.elements.push(element);
            return element;
        }
    }

    getDefault(value, defaultValue) {
        return value === undefined ? defaultValue : value;
    }

    commonValue(tag, name, value, defaultValue) {
        let v = this.getDefault(value, defaultValue);
        return this.add(new Element(tag, {name: name}, v));
    }

    boolProp(name, value, defaultValue) {
        return this.commonValue('boolProp', name, value, defaultValue);
    }

    intProp(name, value, defaultValue) {
        return this.commonValue('intProp', name, value, defaultValue);
    }

    longProp(name, value, defaultValue) {
        return this.commonValue('longProp', name, value, defaultValue);
    }

    stringProp(name, value, defaultValue) {
        return this.commonValue('stringProp', name, value, defaultValue);
    }

    collectionProp(name) {
        return this.commonValue('collectionProp', name);
    }

    elementProp(name, elementType) {
        return this.add(new Element('elementProp', {name: name, elementType: elementType}));
    }

    isEmptyValue() {
        return this.value === undefined || this.value === '';
    }

    isEmptyElement() {
        return this.elements.length === 0;
    }

    isEmpty() {
        return this.isEmptyValue() && this.isEmptyElement();
    }

    replace(str) {
        if (!str || !(typeof str === 'string')) return str;
        return replaceChar(str);
    }

    toXML(indent) {
        if (indent) {
            this.indent = indent;
        }

        let str = this.start();
        str += this.content();
        str += this.end();
        return str;
    }

    start() {
        let str = this.indent + '<' + this.replace(this.name);
        for (let key in this.attributes) {
            if (this.attributes.hasOwnProperty(key)) {
                str += ' ' + this.replace(key) + '="' + this.replace(this.attributes[key]) + '"';
            }
        }
        if (this.isEmpty()) {
            str += '/>';
        } else {
            str += '>';
        }
        return str;
    }

    content() {
        if (!this.isEmptyValue()) {
            return this.replace(this.value);
        }

        let str = '';
        let parent = this;
        if (this.elements.length > 0) {
            str += '\n';
            this.elements.forEach(e => {
                e.indent += parent.indent + INDENT;
                str += e.toXML();
            });
        }
        return str;
    }

    end() {
        if (this.isEmpty()) {
            return '\n';
        }
        let str = '</' + this.replace(this.name) + '>\n';
        if (!this.isEmptyValue()) {
            return str;
        }
        if (!this.isEmptyElement()) {
            return this.indent + str;
        }
    }
}

// HashTree, 只能添加TestElement的子元素，没有基础类型内容
class HashTree extends Element {
    constructor() {
        super('hashTree');
    }

    add(te) {
        if (te instanceof TestElement) {
            super.add(te);
        }
    }
}

// TestElement包含2部分，Element 和 HashTree
class TestElement extends Element {
    constructor(name, attributes, value) {
        // Element, 只能添加Element
        super(name, attributes, value);
        // HashTree, 只能添加TestElement
        this.hashTree = new HashTree();
    }

    put(te) {
        this.hashTree.add(te);
    }

    toXML() {
        let str = super.toXML();
        str += this.hashTree.toXML(this.indent);
        return str;
    }
}

class DefaultTestElement extends TestElement {
    constructor(tag, guiclass, testclass, testname, enabled) {
        super(tag, {
            guiclass: guiclass,
            testclass: testclass,
            testname: testname === undefined ? tag + ' Name' : testname,
            enabled: enabled || true
        });
    }
}

class TestPlan extends DefaultTestElement {
    constructor(testName, props) {
        super('TestPlan', 'TestPlanGui', 'TestPlan', testName);

        props = props || {};
        this.boolProp("TestPlan.functional_mode", props.mode, false);
        this.boolProp("TestPlan.serialize_threadgroups", props.stg, false);
        this.boolProp("TestPlan.tearDown_on_shutdown", props.tos, true);
        this.stringProp("TestPlan.comments", props.comments);
        this.stringProp("TestPlan.user_define_classpath", props.classpath);
        this.add(new ElementArguments(props.args, "TestPlan.user_defined_variables", "User Defined Variables"));
    }
}

class ThreadGroup extends DefaultTestElement {
    constructor(testName, props) {
        super('ThreadGroup', 'ThreadGroupGui', 'ThreadGroup', testName);

        props = props || {};
        this.intProp("ThreadGroup.num_threads", props.threads, 1);
        this.intProp("ThreadGroup.ramp_time", props.ramp, 1);
        this.longProp("ThreadGroup.delay", props.delay, 0);
        this.longProp("ThreadGroup.duration", props.delay, 0);
        this.stringProp("ThreadGroup.on_sample_error", props.error, "continue");
        this.boolProp("ThreadGroup.scheduler", props.scheduler, false);

        let loopAttrs = {
            name: "ThreadGroup.main_controller",
            elementType: "LoopController",
            guiclass: "LoopControlPanel",
            testclass: "LoopController",
            testname: "Loop Controller",
            enabled: "true"
        };
        let loopProps = props.loopProps || {};
        let loopController = this.add(new Element('elementProp', loopAttrs));
        loopController.boolProp('LoopController.continue_forever', loopProps.continue, false);
        loopController.stringProp('LoopController.loops', loopProps.loops, 1);
    }
}

class TransactionController extends DefaultTestElement {
    constructor(testName, props) {
        super('TransactionController', 'TransactionControllerGui', 'TransactionController', testName);

        props = props || {};
        this.boolProp("TransactionController.includeTimers", props.includeTimers, false);
        this.boolProp("TransactionController.parent", props.parent, true);
    }
}

class HTTPSamplerProxy extends DefaultTestElement {
    constructor(testName, request) {
        super('HTTPSamplerProxy', 'HttpTestSampleGui', 'HTTPSamplerProxy', testName);
        this.request = request || {};

        this.stringProp("HTTPSampler.domain", this.request.hostname);
        this.stringProp("HTTPSampler.protocol", this.request.protocol.split(":")[0]);
        this.stringProp("HTTPSampler.path", this.request.pathname);
        this.stringProp("HTTPSampler.method", this.request.method);
        this.stringProp("HTTPSampler.contentEncoding", this.request.encoding, "UTF-8");
        if (!this.request.port) {
            this.stringProp("HTTPSampler.port", "");
        } else {
            this.stringProp("HTTPSampler.port", this.request.port);
        }

        this.boolProp("HTTPSampler.follow_redirects", this.request.follow, true);
        this.boolProp("HTTPSampler.use_keepalive", this.request.keepalive, true);
        this.boolProp("HTTPSampler.DO_MULTIPART_POST", this.request.multipart);
    }
}

class HTTPSamplerFiles extends Element {
    constructor(files = []) {
        super('elementProp', {
            name: "HTTPsampler.Files", // s必须小写
            elementType: "HTTPFileArgs"
        });

        let collectionProp = this.collectionProp('HTTPFileArgs.files');
        files.forEach(file => {
            let elementProp = collectionProp.elementProp(file.path, 'HTTPFileArg');
            elementProp.stringProp('File.path', file.path);
            elementProp.stringProp('File.paramname', file.name);
            elementProp.stringProp('File.mimetype', file.type);
        });
    }
}

// 这是一个Element
class HTTPSamplerArguments extends Element {
    constructor(args) {
        super('elementProp', {
            name: "HTTPsampler.Arguments", // s必须小写
            elementType: "Arguments",
            guiclass: "HTTPArgumentsPanel",
            testclass: "Arguments",
            enabled: "true"
        });

        this.args = args || [];

        let collectionProp = this.collectionProp('Arguments.arguments');
        this.args.forEach(arg => {
            let elementProp = collectionProp.elementProp(arg.name, 'HTTPArgument');
            elementProp.boolProp('HTTPArgument.always_encode', arg.encode, true);
            elementProp.boolProp('HTTPArgument.use_equals', arg.equals, true);
            if (arg.name) {
                elementProp.stringProp('Argument.name', arg.name);
            }
            elementProp.stringProp('Argument.value', arg.value);
            elementProp.stringProp('Argument.metadata', arg.metadata || "=");
        });
    }
}

class DurationAssertion extends DefaultTestElement {
    constructor(testName, duration) {
        super('DurationAssertion', 'DurationAssertionGui', 'DurationAssertion', testName);
        this.duration = duration || 0;
        this.stringProp('DurationAssertion.duration', this.duration);
    }
}

class ResponseAssertion extends DefaultTestElement {
    constructor(testName, assertion) {
        super('ResponseAssertion', 'AssertionGui', 'ResponseAssertion', testName);
        this.assertion = assertion || {};

        this.stringProp('Assertion.test_field', this.assertion.field);
        this.boolProp('Assertion.assume_success', false);
        this.intProp('Assertion.test_type', this.assertion.type);
        this.stringProp('Assertion.custom_message', this.assertion.message);

        let collectionProp = this.collectionProp('Asserion.test_strings');
        let random = Math.floor(Math.random() * 10000);
        collectionProp.stringProp(random, this.assertion.value);
    }
}

class ResponseCodeAssertion extends ResponseAssertion {
    constructor(testName, type, value, message) {
        let assertion = {
            field: 'Assertion.response_code',
            type: type,
            value: value,
            message: message,
        }
        super(testName, assertion)
    }
}

class ResponseDataAssertion extends ResponseAssertion {
    constructor(testName, type, value, message) {
        let assertion = {
            field: 'Assertion.response_data',
            type: type,
            value: value,
            message: message,
        }
        super(testName, assertion)
    }
}

class ResponseHeadersAssertion extends ResponseAssertion {
    constructor(testName, type, value, message) {
        let assertion = {
            field: 'Assertion.response_headers',
            type: type,
            value: value,
            message: message,
        }
        super(testName, assertion)
    }
}

class HeaderManager extends DefaultTestElement {
    constructor(testName, headers) {
        super('HeaderManager', 'HeaderPanel', 'HeaderManager', testName);
        this.headers = headers || [];

        let collectionProp = this.collectionProp('HeaderManager.headers');
        this.headers.forEach(header => {
            let elementProp = collectionProp.elementProp('', 'Header');
            elementProp.stringProp('Header.name', header.name);
            elementProp.stringProp('Header.value', header.value);
        });
    }
}

class AuthManager extends DefaultTestElement {
    constructor(testName, auths, props) {
        super("AuthManager", "AuthPanel", "AuthManager", testName || "HTTP Authorization Manager");
        this.auths = auths || [];
        this.props = props || {};

        this.boolProp('AuthManager.clearEachIteration', this.props.clear, false);
        this.boolProp('AuthManager.controlledByThreadGroup', this.props.control, false);

        let collectionProp = this.collectionProp('AuthManager.auth_list');
        this.auths.forEach(auth => {
            let elementProp = collectionProp.elementProp('', 'Authorization')
            elementProp.stringProp('Authorization.url', auth.url);
            elementProp.stringProp('Authorization.username', auth.username);
            elementProp.stringProp('Authorization.password', auth.password);
            elementProp.stringProp('Authorization.domain', auth.domain);
            elementProp.stringProp('Authorization.realm', auth.realm);
        });
    }
}

class DNSCacheManager extends DefaultTestElement {
    constructor(testName, servers, hosts, props) {
        super("DNSCacheManager", "DNSCachePanel", "DNSCacheManager", testName || "DNS Cache Manager");
        this.servers = servers || [];
        this.hosts = hosts || [];
        this.props = props || {};

        this.boolProp('DNSCacheManager.clearEachIteration', this.props.clear, false);
        this.boolProp('DNSCacheManager.isCustomResolver', this.props.custom, false);

        let serversCollectionProp = this.collectionProp('DNSCacheManager.servers');
        this.servers.forEach(server => {
            let random = Math.floor(Math.random() * 10000);
            serversCollectionProp.stringProp(random, server)
        });

        let hostsCollectionProp = this.collectionProp('DNSCacheManager.hosts');
        this.hosts.forEach(host => {
            let elementProp = hostsCollectionProp.elementProp(host.name, 'StaticHost')
            elementProp.stringProp('StaticHost.Name', host.name);
            elementProp.stringProp('StaticHost.Address', host.value);
        });
    }
}

class CookieManager extends DefaultTestElement {
    constructor(testName, cookies, props) {
        super("CookieManager", "CookiePanel", "CookieManager", testName || "HTTP Cookie Manager");
        this.cookies = cookies || [];
        this.props = props || {};

        this.boolProp('CookieManager.clearEachIteration', this.props.clear, false);
        this.boolProp('CookieManager.controlledByThreadGroup', this.props.control, false);

        let collectionProp = this.collectionProp('CookieManager.cookies');
        this.cookies.forEach(cookie => {
            let elementProp = collectionProp.elementProp(cookie.name, 'Cookie')
            elementProp.stringProp('Cookie.value', cookie.value);
            elementProp.stringProp('Cookie.path', cookie.path);
            elementProp.boolProp('Cookie.secure', cookie.secure, false);
            elementProp.longProp('Cookie.value', cookie.expires, 0);
            elementProp.boolProp('Cookie.path_specified', true);
            elementProp.boolProp('Cookie.domain_specified', cookie.true);
        });
    }
}

class CacheManager extends DefaultTestElement {
    constructor(testName, props) {
        super("CacheManager", "CacheManagerGui", "CacheManager", testName || "HTTP Cache Manager");
        this.props = props || {};

        this.boolProp('clearEachIteration', this.props.clear, false);
        this.boolProp('CacheManager.controlledByThreadGroup', this.props.control, false);
        this.boolProp('useExpires', this.props.expires, true);
    }
}

class Arguments extends DefaultTestElement {
    constructor(testName, args) {
        super('Arguments', 'ArgumentsPanel', 'Arguments', testName);
        this.args = args || [];

        let collectionProp = this.collectionProp('Arguments.arguments');
        this.args.forEach(arg => {
            let elementProp = collectionProp.elementProp(arg.name, 'Argument');
            elementProp.stringProp('Argument.name', arg.name);
            elementProp.stringProp('Argument.value', arg.value);
            elementProp.stringProp('Argument.desc', arg.desc);
            elementProp.stringProp('Argument.metadata', arg.metadata, "=");
        });
    }
}

class ElementArguments extends Element {
    constructor(args, name, testName) {
        super('elementProp', {
            name: name || "arguments",
            elementType: "Arguments",
            guiclass: "ArgumentsPanel",
            testclass: "Arguments",
            testname: testName || "",
            enabled: "true"
        });

        let collectionProp = this.collectionProp('Arguments.arguments');
        if (args) {
            args.forEach(arg => {
                let elementProp = collectionProp.elementProp(arg.name, 'Argument');
                elementProp.stringProp('Argument.name', arg.name);
                elementProp.stringProp('Argument.value', arg.value);
                elementProp.stringProp('Argument.metadata', arg.metadata, "=");
            });
        }
    }
}

class RegexExtractor extends DefaultTestElement {
    constructor(testName, props) {
        super('RegexExtractor', 'RegexExtractorGui', 'RegexExtractor', testName);
        this.props = props || {}
        this.stringProp('RegexExtractor.useHeaders', props.headers);
        this.stringProp('RegexExtractor.refname', props.name);
        this.stringProp('RegexExtractor.regex', props.expression);
        this.stringProp('RegexExtractor.template', props.template);
        this.stringProp('RegexExtractor.default', props.default);
        this.stringProp('RegexExtractor.match_number', props.match);
    }
}

class JSONPostProcessor extends DefaultTestElement {
    constructor(testName, props) {
        super('JSONPostProcessor', 'JSONPostProcessorGui', 'JSONPostProcessor', testName);
        this.props = props || {}
        this.stringProp('JSONPostProcessor.referenceNames', props.name);
        this.stringProp('JSONPostProcessor.jsonPathExprs', props.expression);
        this.stringProp('JSONPostProcessor.match_numbers', props.match);
    }
}

class XPath2Extractor extends DefaultTestElement {
    constructor(testName, props) {
        super('XPath2Extractor', 'XPath2ExtractorGui', 'XPath2Extractor', testName);
        this.props = props || {}
        this.stringProp('XPathExtractor2.default', props.default);
        this.stringProp('XPathExtractor2.refname', props.name);
        this.stringProp('XPathExtractor2.xpathQuery', props.expression);
        this.stringProp('XPathExtractor2.namespaces', props.namespaces);
        this.stringProp('XPathExtractor2.matchNumber', props.match);
    }
}


class JMXRequest {
    constructor(item, domains) {
        let url = new URL(item.url);
        this.method = item.method;
        this.hostname = "${" + domains[url.hostname] + "}";
        this.pathname = url.pathname;
        this.port = url.port;
        this.protocol = url.protocol.split(":")[0];
        this.parameters = [];
        if (this.method.toUpperCase() !== "GET") {
            this.pathname += url.search.replaceAll('&', '&amp;');
        }
        url.searchParams.forEach((value, key) => {
            if (key && value) {
                this.parameters.push({name: key, value: value});
            }
        });
        item.headers.forEach(header => {
            if (header.name.toLowerCase() === 'content-type') {
                if (header.value.includes("multipart/form-data")) {
                    this.multipart = true;
                }
            }
        })
    }
}

class JMeterTestPlan extends Element {
    constructor() {
        super('jmeterTestPlan', {
            version: "1.2", properties: "5.0", jmeter: "5.2.1"
        });

        this.add(new HashTree());
    }

    put(te) {
        if (te instanceof TestElement) {
            this.elements[0].add(te);
        }
    }
}
class JMXGenerator {
    constructor(data, name) {
        this.data = data;
        this.name = name;
        let domains = {};
        let ds=['test.com']
        ds.forEach((name, index) => {
            domains[name] = "BASE_URL_" + index;
        });
        this.domains = domains;

        let testPlan = new TestPlan(this.name);
        testPlan.put(this.getVariables());
        testPlan.put(this.getHeaderManager());
        testPlan.put(this.getDNSCacheManager());
        testPlan.put(this.getAuthManager());
        testPlan.put(this.getCookieManager());
        testPlan.put(this.getCacheManager());

        let threadGroup = new ThreadGroup("Thread Group");
        this.getTransactionController().forEach(sampler => {
            threadGroup.put(sampler);
        })
        testPlan.put(threadGroup);
        this.jmeterTestPlan = new JMeterTestPlan();
        this.jmeterTestPlan.put(testPlan);
    }

    getVariables() {
        let args = [];
        for (let host in this.domains) {
            if (this.domains.hasOwnProperty(host)) {
                args.push({name: this.domains[host], value: host});
            }
        }
        return new Arguments("User Defined Variables", args);
    }

    getHeaderManager() {
        return new HeaderManager("Header Manager");
    }

    getDNSCacheManager() {
        return new DNSCacheManager('DNS Cache Manager');
    }

    getAuthManager() {
        return new AuthManager('HTTP Authorization Manager');
    }

    getCookieManager() {
        return new CookieManager('HTTP Cookie Manager');
    }

    getCacheManager() {
        return new CacheManager('HTTP Cache Manager');
    }

    getTransactionController() {
        let result = [];
        if (this.data.length > 1) {
            this.data.forEach(item => {
                if (item.hasOwnProperty("url")) {
                    result.push(this.getRequestSampler(item));
                } else {
                    let tc = new TransactionController(item.name);
                    this.getRequestSamplers(item.request).forEach(request => {
                        tc.put(request);
                    });
                    result.push(tc);
                }
            });
        } else {
            let item = this.data[0];
            if (item.hasOwnProperty("url")) {
                result.push(this.getRequestSampler(item));
            } else {
                return this.getRequestSamplers(item.request);
            }
        }
        return result;
    }

    getRequestSampler(item) {
        let url = new URL(item.url);
        if (this.domains[url.hostname]) {
            let name = item.label;
            let request = new JMXRequest(item, this.domains);
            let httpSamplerProxy = new HTTPSamplerProxy(name || "", request);
            httpSamplerProxy.put(new HeaderManager(name + " Headers", item.headers));

            if (item.method.toUpperCase() === 'GET') {
                httpSamplerProxy.add(new HTTPSamplerArguments(request.parameters));
            } else {
                let args = [];
                // raw
                if (item.body instanceof Array) {
                    httpSamplerProxy.boolProp('HTTPSampler.postBodyRaw', true);
                    args.push({name: '', value: item.body[0], encode: false});
                } else {
                    // form-data, x-www-form-urlencoded
                    for (let key in item.body) {
                        if (item.body.hasOwnProperty(key)) {
                            args.push({name: key, value: item.body[key], encode: false});
                        }
                    }
                }
                httpSamplerProxy.add(new HTTPSamplerArguments(args));
                if (item.files && item.files.length > 0) {
                    httpSamplerProxy.add(new HTTPSamplerFiles(item.files));
                }
            }
            return httpSamplerProxy;
        }
    }

    getRequestSamplers(data) {
        let samplers = [];
        data.forEach(item => {
            let sampler = this.getRequestSampler(item);
            if (sampler) {
                samplers.push(sampler);
            }
        });
        return samplers;
    }

    replace(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;");
    }

    toXML() {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += this.jmeterTestPlan.toXML();
        return xml;
    }
}


class DownloadRecording {
    getDomains(object) {
        let domains = [];
        if (object.hasOwnProperty("url")) {
            try {
                let url = new URL(object.url);
                if (!domains.includes(url.hostname)) {
                    domains.push(url.hostname);
                }
            } catch (e) {
                alert("url格式错误: " + object.url)
            }
        } else {
            let keys = Object.keys(object);
            keys.forEach(key => {
                this.getDomains(object[key]).forEach(domain => {
                    if (!domains.includes(domain)) {
                        domains.push(domain);
                    }
                })
            })
        }
        return domains;
    }

    convertTransactions(transactions) {
        let result = [];
        let domains = [];
        let keys = Object.keys(transactions);
        keys.forEach(key => {
            if (!transactions[key].hasOwnProperty("url")) {
                let name = key.split(" [")[0];
                let request = [];
                let traffic = Object.keys(transactions[key]);
                traffic.forEach(index => {
                    request.push(transactions[key][index]);


                })
                result.push({name: name, request: request});
            } else {
                result.push(transactions[key]);
            }
        });
        return result;
    }

    downloadEXCEL(name, transactions) {
      let blob=  this.convertTransactionsEXCEL(transactions);
      this.download(name + ".json", JSON.stringify(transactions));

    }

    // 将一个sheet转成最终的excel文件的blob对象
    sheet2blob(sheet, sheetName) {

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
    formatJson(json, options) {
        var reg = null,
        formatted = "",
        pad = 0,
        PADDING = "    "; // one can also use '\t' or a different number of spaces

        // optional settings
        options = options || {};
        // remove newline where '{' or '[' follows ':'
        options.newlineAfterColonIfBeforeBraceOrBracket =
        options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
        // use a space after a colon
        options.spaceAfterColon = options.spaceAfterColon === false ? false : true;

        // begin formatting...

        // make sure we start with the JSON as a string
        if (typeof json !== "string") {
            json = JSON.stringify(json);
        }
        // parse and stringify in order to remove extra whitespace
        // json = JSON.stringify(JSON.parse(json));可以除去多余的空格
        json = JSON.parse(json);
        json = JSON.stringify(json);

        // add newline before and after curly braces
        reg = /([\{\}])/g;
        json = json.replace(reg, "\r\n$1\r\n");

        // add newline before and after square brackets
        reg = /([\[\]])/g;
        json = json.replace(reg, "\r\n$1\r\n");

        // add newline after comma
        reg = /(\},)/g;
        json = json.replace(reg, "$1\r\n");
        // add newline after comma
        reg = /(\],)/g;
        json = json.replace(reg, "$1\r\n");
        // remove multiple newlines
        reg = /(\r\n\r\n)/g;
        json = json.replace(reg, "\r\n");

        // remove newlines before commas
        reg = /\r\n\,/g;
        json = json.replace(reg, ",");

        // optional formatting...
        if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
            reg = /\:\r\n\{/g;
            json = json.replace(reg, ":{");
            reg = /\:\r\n\[/g;
            json = json.replace(reg, ":[");
        }
        // if (options.spaceAfterColon) {
                // reg = /\:/g;
        //json = json.replace(reg, ": ");
        //}

        $.each(json.split("\r\n"), function(index, node) {
            var i = 0,
            indent = 0,
            padding = "";

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
            pad -= 1;
            }
        } else {
            indent = 0;
            }

        for (i = 0; i < pad; i++) {
                padding += PADDING;
            }

        formatted += padding + node + "\r\n";
        pad += indent;
        });

        return formatted;
    }
    uuid() {
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
    getDomain(url) {
        var domain=""
        try {
            domain = new URL(url).hostname;
            //const domain = url.split('/')[2];
          } catch (e) {
             console.info("url格式错误: " + domain)
          }
	    return domain
    }
    getUrlParams(url) {
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
    getUrlParamsNew(url) {
        const searchParams = new URLSearchParams(new URL(url).search);
        const params = {};

        searchParams.forEach((value, name) => {
        params[name] = value;
            });

        return params;
    }
    getUrlPath(url) {
        var path=""
        try {
            var path = new URL(url).pathname;
          } catch (e) {
             console.info("path格式错误: " + path)
          }
	    return path
    }
    formattedDate() {
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

        // 格式化时间为 YYYYMMDDHH:MM:SS
        let formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;
	    return formattedDate;
    }

    convertTransactionsEXCEL(transactions) {
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

    downloadJMX(name,transactions) {
        let data = this.convertTransactions(transactions);
        let jmx = new JMXGenerator(data, name);
        this.download1(name + ".jmx", jmx.toXML());
    }

    download1(name, str) {
        let blob = new Blob([str], {type: "application/octet-stream"});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = name;
        link.click();
        window.URL.revokeObjectURL(link.href);
    }


}
