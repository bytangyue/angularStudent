/**  description
 *   author tangyue
 *   date 2015/10/14
 */
var utils = {};
(function () {
    /*设置导航高和主内容高*/
    utils.setDivSize = function () {//angular.element("#b-content")
        $("#content").css({"height": window.innerHeight - 72 - 30 - 54});
        $("#panel-div").css({"height": window.innerHeight - 72 - 10 - 54});
    }
    /*初始化tip*/
    utils.initTip = function () {
        $('[data-toggle="tooltip"]').tooltip({
            container: 'body',
            trigger: 'hover'
        });
    }
    /**
     * 添加选中颜色
     * @param thisstr
     * @param strLis
     */
    utils.setNavigationColor = function (thisstr, strLis) {
        $(strLis).each(function () {
            $(this).removeClass('sidebar-active');
        });
        $(thisstr).addClass("sidebar-active");
    }
    /**
     * 启用模态窗口
     */
    utils.showModal = function () {
        $('#myModal').modal({
            show: true
        });
    }
    var dummy = {
        attrs: {
            id: null,
            class: null,
            name: ["day", "jiaose", "shichang", "time", "dt", "lv","online_time","cdt"],
            type: ["date", "int"],
            format: ["yyyy-MM-dd", "yyyy-MM-dd HH:mm:ss"],
            ref: ["jiaose", "shichang", "time", "dt_time", "lv"]
        },
        children: []
    };
    var tags = {
        "!top": ["input", "rdd"],
        "!attrs": {
            id: null,
            class: ["A", "B", "C"]
        },
        input: {
            attrs: {
                id: null,
                class: null
            },
            children: ["item"]
        },
        item: dummy,
        rdd: {
            attrs: {
                id: ["logout_records","user_logout","user_online","new_user_online","new_active_user_online"],
                class: null
            },
            children: ["source", "map","filter","groupby","reduce"]
        },
        source: dummy,
        map: {
            attrs: {
                id: null,
                class: null
            },
            children: ["item"]
        },
        item: dummy,
        filter:{
            attrs:{
                method:["smallOrEqual","small"]
            },
            children:["param"]
        },
        param:dummy,
        groupby:{},
        reduce:{
            attrs:{
                method:["sum","max"],
                ref:["lv","online_time"]
            },
            children:[]
        }
    };

    function completeAfter(cm, pred) {
        var cur = cm.getCursor();
        if (!pred || pred()) setTimeout(function () {
            if (!cm.state.completionActive)
                cm.showHint({completeSingle: false});
        }, 100);
        return CodeMirror.Pass;
    }

    function completeIfAfterLt(cm) {
        return completeAfter(cm, function () {
            var cur = cm.getCursor();
            return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) == "<";
        });
    }

    function completeIfInTag(cm) {
        return completeAfter(cm, function () {
            var tok = cm.getTokenAt(cm.getCursor());
            if (tok.type == "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length == 1)) return false;
            var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
            return inner.tagName;
        });
    }

    var editor;
    utils.selectmodeType = function () {
        var select = document.getElementById("mirrselect");
        var modeType = select.options[select.selectedIndex].textContent;
        editor.setOption("mode", modeType);
    }
    /*codemirror编辑器*/
    var i = 0;
    utils.codeMirrorEdit = function () {
        $('#codemirrModal').modal({
            show: true
        });
        i++;
        if (i == 1) {
            editor = CodeMirror.fromTextArea(document.getElementById("mirrcode"), {
                lineNumbers: true,
                extraKeys: {
                    "'<'": completeAfter,
                    "'/'": completeIfAfterLt,
                    "' '": completeIfInTag,
                    "'='": completeIfInTag,
                    "Ctrl-0": "autocomplete"
                },
                hintOptions: {schemaInfo: tags},
                theme: "monokai",
                scrollbarStyle: "simple"
            });
        }
        utils.selectmodeType();
    }
    /**
     * 年月日时分只能输入数字
     * */
    utils.clearNoNum = function (obj, sign) {
        var regExp = /^\d*$/;
        if (sign == 'm' || sign == 'd') {
            if (obj.value == '00') {
                obj.value = '';
            }
        } else {
            if (sign == 'y') {
                regExp = /^[1-9]\d*$/;
            }
        }
        if (!regExp.exec(obj.value)) {
            obj.value = '';
        }
    }

})();
