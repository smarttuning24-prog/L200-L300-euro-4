var urlParams = getParams();
var _regObject;

$(function () {
    $(document).on('contextmenu', function (e) {
        return false;
    });
    if (urlParams["print"] == "true") {
        $("body").addClass('print');
        $("img").each(function (index, img) {
            var large = $(img).attr("large");
            if (large != null) {
                $(img).attr("src", large);
            }
        });
        var userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("msie") >= 0 || userAgent.indexOf("trident") >= 0) {
            printPreviewIE11();
        } else {
            setTimeout(function () {
                window.close();
            }, 500);
            window.print();
        }
    }
});

$(window).on('load', function () {
    setTimeout(function () {
        adjustHeaderPadding(true);
    }, 10);
});
$(window).on('resize', function () {
    setTimeout(function () {
        adjustHeaderPadding(false);
    }, 10);
});

function adjustHeaderPadding(isload) {
    var header = $('.sieHeader');
    if (header != null) {
        if (urlParams["print"] == "true") {
            $('body').css('padding-top', '0');
        } else {
            $('body').css('padding-top', (header.height() + 10) + 'px');
        }
    }
    if (isload) {
        $(".prevsie").show();
        $(".servinfo").show();
        $(".nextsie").show();
    }
}

function printPreviewIE11() {
    if (document.body.insertAdjacentHTML == null)
        return;

    var sWebBrowserCode = '<object width="0" height="0" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>';
    document.body.insertAdjacentHTML('beforeEnd', sWebBrowserCode);

    var objWebBrowser = document.body.lastChild;
    if (objWebBrowser == null)
        return;

    objWebBrowser.ExecWB(7, 1);
    document.body.removeChild(objWebBrowser);
    setTimeout(function () {
        window.close();
    }, 500);
}

function printSIE() {
    window.open(location.href + '?print=true');
}

function getParams() {
    var query = location.search.substr(1);

    var params = {};
    query.split("&").forEach(function (item) {
        var s = item.split("=");
        var k = decodeURIComponent(s[0]);
        var v = decodeURIComponent(s[1]);
        (k in params) ? params[k].push(v) : params[k] = [v];
    });

    return params;
}

function ViewLargeIllust(src, name, rotate) {
    var left = parent.window.screenLeft + (parent.window.innerWidth / 2) - (820 / 2);
    var top = parent.window.screenTop + (parent.window.innerHeight / 2) - (642 / 2);
    var url = "large.html?src=" + src;
    if (rotate && rotate == 1) {
        url = url + "&rotate=1";
    }
    window.open(url, name, 'width=820,height=642,top=' + top + ',left=' + left + ',toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
}

function openSIE(sieId) {
    var title = document.title;
    var loc = document.location.href;

    if (parent && parent.content) {
        var item = { "title": title, "location": loc };
        window.parent.linkHistory.push(item);
    }

    document.location.href = sieId + ".html";
}

function getHistoryItem() {
    if (window.parent && window.parent.linkHistory && window.parent.linkHistory.length > 0) {
        return window.parent.linkHistory[window.parent.linkHistory.length - 1];
    }
    return null;
}

function historyBack() {
    if (window.parent && window.parent.linkHistory && window.parent.linkHistory.length > 0) {
        var item = window.parent.linkHistory.pop();
        window.parent.content.document.location.href = item["location"];
    }
}

function clearHistory() {
    if (window.parent && window.parent.linkHistory && window.parent.linkHistory.length > 0) {
        window.parent.linkHistory.length = 0;
    }
}

function showHistoryButton() {
    var his = getHistoryItem();
    if (his != null) {
        var isJPN = $("body.JPN").length > 0;
        var button = '';
        if (isJPN) {
            button = '<input id="btnLinkBack" name="btnLinkBack" onclick="historyBack();" type="button" value="< 「' + his["title"] + '」に戻る"></input>';
        } else {
            button = '<input id="btnLinkBack" name="btnLinkBack" onclick="historyBack();" type="button" value="< 「' + his["title"] + '」Back to"></input>';
        }
        $(".siePrintWrapper").before(button);
    }
}

function search() {
    var title = $("#searchByTitle").val();
    var text = $("#searchByText").val();
    if (text.length > 0) {
        if (title.length > 0) {
            window.parent.content.document.location.href = "searchresult.html?sw=" + encodeURIComponent(text) + "&ttl=" + encodeURIComponent(title);
        }
        else {
            window.parent.content.document.location.href = "searchresult.html?sw=" + encodeURIComponent(text);
        }
    }
    else if (title.length > 0) {
        window.parent.content.document.location.href = "search.html?text=" + encodeURIComponent(title);
    }
    else {
        var message = "";
        $(".errorMessage").children("div").each(function (i, e) {
            if (message.length > 0) {
                message += "\n";
            }
            message += $(e).text();
        });
        if (message.length > 0) {
            alert(message);
        }
    }
}

function gsitm(sieRef, text, shortdesc, tagId) {
    var data = new Array;
    data.SieRef = sieRef;
    data.Text = text;
    data.TagId = tagId;
    return data;
}

function gsttl(siePath, sieTitle) {
    var data = new Array;

    data.SiePath = siePath;
    data.SieTitle = sieTitle;

    return data;
}

function isMatch(innerText, strKey) {
    var regExp = getRegExp(strKey);
    return regExp.test(innerText);
}

function getContenWithColor(innerXml, strKey) {
    if (strKey == "" || strKey == "*") {
        return innerXml;
    }

    var elementsWithTags = innerXml.split(/(<.+?>)/);
    var hitIndexArray = getHitIndexArray(innerXml, strKey);
    var stateSetStyle =
        getStateSetStyleMulti(elementsWithTags, hitIndexArray);

    var i;
    for (i = stateSetStyle.length - 1; i >= 0 ; i--) {
        var state = stateSetStyle[i];
        var content = elementsWithTags[state.ElementIndex];
        var contentBefor = content.substring(0, state.StringStartIndex);
        var HitContent = content.substring(state.StringStartIndex, state.StringEndIndex);
        var contentAfter = content.substring(state.StringEndIndex, content.length);
        var newContent =
            contentBefor +
            "<font style=\"background-color:#FFFF99;\">" +
            HitContent +
            "</font>" +
            contentAfter;

        elementsWithTags[state.ElementIndex] = newContent;
    }

    return getJoinText(elementsWithTags);
}

function getHitIndexArray(innerXml, strKey) {
    var result = new Array();
    var resultArrayCounter = 0;

    var elements = innerXml.split(/<.+?>/);
    var innnerText = getJoinText(elements);
    var totalShift = 0;

    var i;
    while (true) {
        var regObject = getRegExp(strKey).exec(innnerText);

        if (regObject == null) {
            break;
        }

        var startIndex = regObject.index;
        var endIndex = startIndex + regObject[0].length;

        var item = new Array();
        item.StartIndex = startIndex + totalShift;
        item.EndIndex = endIndex + totalShift;
        result[resultArrayCounter] = item;
        resultArrayCounter++;

        innnerText = innnerText.substring(endIndex);
        totalShift += endIndex;
    }
    return result;
}

function getHitIndex(innerXml, strKey) {
    var elements = innerXml.split(/<.+?>/);
    var innnerText = getJoinText(elements);
    var regObject = getRegExp(strKey).exec(innnerText);

    var startIndex = regObject.index;

    var endIndex = startIndex + regObject[0].length;

    var result = new Array();
    result.StartIndex = startIndex;
    result.EndIndex = endIndex;

    return result;
}

function getStateSetStyleMulti(elementsWithTags, hitIndexArray) {
    var result = new Array();

    var i;
    for (i = 0; i < hitIndexArray.length; i++) {
        var item = hitIndexArray[i];
        var stateSetStyle = getStateSetStyle(elementsWithTags, item.StartIndex, item.EndIndex);

        var j;
        for (j = 0; j < stateSetStyle.length; j++) {
            result.push(stateSetStyle[j]);
        }
    }

    return result;
}

function getStateSetStyle(elementsWithTags, startIndex, endIndex) {
    var stateSetStyle = new Array();
    var stateSetStyleCounter = 0;
    var isHitting = false;
    var stringCounter = 0;
    var elementCounter = 0;
    var i;
    for (i = 0; i < elementsWithTags.length; i++) {
        var element = elementsWithTags[i];
        if ((! /<.+?>/.test(element)) && element != "") {
            if (isHitting) {
                stateSetStyle[stateSetStyleCounter] = new Array();
                stateSetStyle[stateSetStyleCounter].ElementIndex = elementCounter;
                stateSetStyle[stateSetStyleCounter].StringStartIndex = 0;
            }

            var j;
            for (j = 0; j < element.length; j++) {
                if (stringCounter == startIndex) {
                    stateSetStyle[stateSetStyleCounter] = new Array();
                    stateSetStyle[stateSetStyleCounter].ElementIndex = elementCounter;
                    stateSetStyle[stateSetStyleCounter].StringStartIndex = j;
                    isHitting = true;
                }

                if (stringCounter == endIndex - 1) {
                    stateSetStyle[stateSetStyleCounter].StringEndIndex = j + 1;
                    stateSetStyleCounter++;
                    isHitting = false;
                }

                stringCounter++;
            }

            if (isHitting) {
                stateSetStyle[stateSetStyleCounter].StringEndIndex = element.length;
                stateSetStyleCounter++;
            }
        }
        elementCounter++;
    }

    return stateSetStyle;
}

function getJoinText(elements) {
    var result = "";

    var i;
    for (i = 0; i < elements.length; i++) {
        result += elements[i];
    }

    return result;
}

function getRegExp(strKey) {
    if (_regObject && _regObject.Key) {
        if (strKey == _regObject.Key) {
            return _regObject.RegExp;
        }
    }

    _regObject = new Array;

    _regObject.Key = strKey;
    _regObject.RegExp = new RegExp(getPattern(strKey), "i");

    return _regObject.RegExp;
}

function getPattern(strKey) {
    var result = strKey;

    result = result.replace("\\", "\\\\");
    result = result.replace("$", "\\$");
    result = result.replace("^", "\\^");
    result = result.replace("[", "\\[");
    result = result.replace("]", "\\]");
    result = result.replace(".", "\\.");
    result = result.replace("+", "\\+");
    result = result.replace("{", "\\{");
    result = result.replace("}", "\\}");

    result = result.replace("*", ".*");

    result = result.replace("?", ".");

    return result;
}

function bookmarkSIE() {
    var pathlist = $(".pathlist").text();
    var index = pathlist.indexOf(" - ");
    var groupName = pathlist.substring(0, index);
    var sieTitle = $(".servinfo > .title > span").text();
    var sieId = $(".sieid").text();

    var subheader = $(parent.subheader.document);
    var manualName = subheader.find(".docType").text();
    var manualId = subheader.find(".subHeaderBody").attr("id");
    var vehicleName = subheader.find(".vTypeLabel").text();
    var yearManalName = subheader.find(".pubDateLabel").text();
    var year = subheader.find(".year").text();

    var result = addBookmarkCookie(manualName, manualId, vehicleName, year, sieId, groupName, sieTitle);
    if (result) {
        $(".balloonNG").hide();
        $(".balloonOK").show();
    }
    else {
        $(".balloonOK").hide();
        $(".balloonNG").show();
    }
    $("#balloon").show();
}

function closeBalloon() {
    $("#balloon").hide();
}

function openBookmark() {
    window.open("bookmark.html", null, 'width=820,height=699,toolbar=no,menubar=no,scrollbars=yes,resizable=yes');
}

var MAX = 10;
var EXPIRE = 999;
var COOKIEMAX = 3000;

var scNameLength = 54;
var configNameLength = 54;
var componentNameLength = 72;
var sieNameLength = 84;
var vehicleNameLength = 66;
var modelYearLength = 18;

var phenix_vehicleNameLength = 40;
var phenix_publishdateLength = 60;
var phenix_level1NameLength = 40;
var phenix_sieNameLength = 40;
var phenix_applicabilityLength = 30;

function setWebManualCookie(name, value, days) {
    var path = $(location).attr("pathname");
    var pathParts = path.split("/");
    path = "";
    for (var i = 0; i < pathParts.length - 3; i++) {
        if (pathParts[i].length > 0) {
            path += "/";
            path += pathParts[i];
        }
    }
    var exp = new Date();
    var month = exp.getMonth() + 1;
    var addDate = exp.getFullYear() + "/" + month + "/" + exp.getDate();
    exp.setTime(exp.getTime() + (days * 24 * 60 * 60 * 1000));
    var item = name + "=" + escape(value + ":" + addDate) + ";";
    var expStr = "path=" + path + "; expires=" + exp.toGMTString() + ";";
    document.cookie = item + expStr;
}

function bookmarkObj(bookmarkId, manualName, manualId, vehicleName, year, sieId, groupName, sieTitle, url, setDate) {
    this.bookmarkId = bookmarkId;
    this.manualName = manualName;
    this.manualId = manualId;
    this.vehicleName = vehicleName;
    this.year = year;
    this.sieId = sieId;
    this.groupName = groupName;
    this.sieTitle = sieTitle;
    this.url = url.replace(/：/g, ":");
    this.setDate = setDate;
}

function getBookmarks() {
    var bm = new Array();
    var bmList = new Array();
    var str = document.cookie;
    var cookies = str.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var param = cookies[i].split("=");
        param[0] = param[0].replace(" ", "");
        if (param[0].indexOf("phenixBookmark") != -1) {
            if (param[1].replace(" ", "") != "") {
                param[1] = unescape(param[1]);
                var values = param[1].split(":");
                bm[bm.length] = new bookmarkObj(param[0], values[0], values[1], values[2], values[3], values[4], values[5], values[6], values[7], values[8]);
            }
        }
    }
    for (var l = 0; l < bm.length; l++) {
        bmList[l] = bm[l];
    }
    return bmList;
}

function getNewNumber(bookmarkArray) {
    var maxNum = 0;
    for (var i = 0; i < bookmarkArray.length; i++) {
        var num = bookmarkArray[i].bookmarkId.substring("phenixBookmark".length);
        if (num > maxNum) {
            maxNum = new Number(num);
        }
    }
    return (maxNum + 1);
}

function addBookmarkCookie(manualName, manualId, vehicleName, year, sieId, groupName, sieTitle) {
    var bookmarks = new Array();
    bookmarks = getBookmarks();

    var count = 0;
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].bookmarkId.indexOf("phenixBookmark") != -1) {
            count++;
        }
    }
    if (count >= MAX) {
        return false;
    }
    var url = document.location.href.toString().replace(/:/g, "：");

    var i = getNewNumber(bookmarks);
    var name = "phenixBookmark" + i;
    var value = manualName + ":" + manualId + ":" + vehicleName + ":" + year + ":" + sieId + ":"
                + viewTitle.cutByteLength(groupName, phenix_level1NameLength) + ":"
				+ viewTitle.cutByteLength(sieTitle, phenix_sieNameLength) + ":" + url;
    setWebManualCookie(name, value, EXPIRE);

    return true;
}

function deleteBookmarkCookie(bookmarkId) {
    var bookmarks = getBookmarks();
    var bookmark = null;
    for (var i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].bookmarkId == bookmarkId) {
            bookmark = bookmarks[i];
            break;
        }
    }
    if (bookmark != null) {
        setWebManualCookie(bookmark.bookmarkId, "", -1)
    }
}

var viewTitle = {
    cutByteLength: function (s, len) {
        if (s == null || s.length == 0) {
            return "";
        }
        var size = 0;
        var rIndex = s.length;

        for (var i = 0; i < s.length; i++) {
            size += this.charByteSize(s.charAt(i));
            if (size == len) {
                rIndex = i + 1;
                break;
            } else if (size > len) {
                rIndex = i;
                break;
            }
        }
        return s.substring(0, rIndex);

    },
    charByteSize: function (ch) {
        if (ch == null || ch.length == 0) {
            return 0;
        }
        var charCode = ch.charCodeAt(0);
        if (charCode <= 0x00007F) {
            return 1;
        } else if (charCode <= 0x0007FF) {
            return 2;
        } else if (charCode <= 0x00FFFF) {
            return 3;
        } else {
            return 4;
        }
    }
}

// [open sb notification script start]

function lazyLoadJavascript(url, callback) {
    var success = false;
    var headTag = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;
    headTag.appendChild(script);

    script.onload = script.onreadystatechange = function () {
        if (!success && (!this.readyState ||
            this.readyState === "loaded" ||
            this.readyState === "complete")) {

            success = true;

            callback();

            script.onload = script.onreadystatechange = null;
            if (headTag && script.parentNode) {
                headTag.removeChild(script);
            }
        }
    };
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

$(document).ready(function() {

    // sie-id
    var url = window.location.href;
    if (endsWith(url, '?print')) return;
    var paths = url.split('/');
    var file_name = paths[paths.length - 1];
    var pointIndex = file_name.lastIndexOf('.');
    if (pointIndex === -1) {
        return;
    }
    var sieId = file_name.substring(0, pointIndex);

    // search sblist
    var sblist = getSbList(sieId);
    if (sblist === null) {
        // nothing
        return;
    }

    // jQuery CSS Load
    $("head").append("<link>");
    css = $("head").children(":last");
    css.attr({
        rel: "stylesheet",
        type: "text/css",
        href: "/MSBv2/js/jquery-ui.min.css"
    });

    // jQueryUI JS Load
    lazyLoadJavascript("/MSBv2/js/jquery-ui.min.js", function () {
        // sb window
        var sbwin = $('<div id="dialog" style="margin-top:1;margin-right:1;" >');
        sbwin.html('<p style="font-size: 16px">MSB is released as follows:</p>');

        var sbTableHtml = '<table class="all"><thead><tr><td width="90" align="left" class="entry botright" valign="top"><span style="font-size: 14px">Release Date</span></td><td width="200" align="left" class="entry botright" valign="top"><span style="font-size: 14px">Title</span></td><td width="100" align="left" class="entry botright" valign="top"><span style="font-size: 14px">File</span></td></tr></thead><tbody>';
        sblist.forEach(function (sb) {
            sbTableHtml += '<tr><td align="left" class="entry botright" valign="top"><span style="font-size: 14px">' + sb.releaseDate + '</span></td><td align="left" class="entry botright" valign="top"><span style="font-size: 14px">' + sb.sbTitle + '</span></td><td align="left" class="entry botright" valign="top"><a href="' + sb.href + '" style="font-size: 14px;color:#0000ff;text-decoration:none" target="_blank">' + sb.sbRecFile + '</a></td></tr>';
        });
        sbTableHtml += '</tbody></table>';
        sbwin.append(sbTableHtml);

        $('body').append(sbwin);

        // dialog setting
        $('#dialog').dialog({
            autoOpen: false,
            width: 460,
            title: 'Display MSB',
            modal: false,
            resizable: true,
            show: 'blind',
            position: {
                at: 'right top',
                my: 'right top'
            }
        });

        // show dialog
        $('#dialog').dialog('open');
    });
});

function getSbList(sieId) {
    var sieid_sblist_map = Object.create(null);

sieid_sblist_map['M111303700001400ENG'] = [{ sbRecFile: "MSB-18EXML11_13-501.pdf", sbTitle: "Correction of the oil application instruction for \"Seal ring\" of FUEL INJECTOR (HIGH PRESSURE)", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML11_13-501.pdf" }];
sieid_sblist_map['M113102790001201ENG'] = [{ sbRecFile: "MSB-18EXML11_13-501.pdf", sbTitle: "Correction of the oil application instruction for \"Seal ring\" of FUEL INJECTOR (HIGH PRESSURE)", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML11_13-501.pdf" }];
sieid_sblist_map['M151102500025701ENG'] = [{ sbRecFile: "MSB-19EXML51-002.pdf", sbTitle: "Change of the Removal and Installation procedure about License Plate Garnish due to establish the service part of Tailgate Moulding", releaseDate: "2019/10/07", href: "/MSBv2/SATSU/MSB-19EXML51-002.pdf" },{ sbRecFile: "MSB-18EXML51-002.pdf", sbTitle: "Correction of the removal and installation procedure about LICENSE PLATE GARNISH", releaseDate: "2018/05/18", href: "/MSBv2/SATSU/MSB-18EXML51-002.pdf" }];
sieid_sblist_map['M151103190002200ENG'] = [{ sbRecFile: "MSB-18EXML51-002.pdf", sbTitle: "Correction of the removal and installation procedure about LICENSE PLATE GARNISH", releaseDate: "2018/05/18", href: "/MSBv2/SATSU/MSB-18EXML51-002.pdf" }];
sieid_sblist_map['M154010480020000ENG'] = [{ sbRecFile: "MSB-18EXML54-001.pdf", sbTitle: "Addition of the repair procedure of Headlamp Bracket", releaseDate: "2018/02/19", href: "/MSBv2/SATSU/MSB-18EXML54-001.pdf" }];
sieid_sblist_map['M190102640245500ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290376400ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370023700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190032100ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290384900ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370028200ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370029300ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190041700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190102640246600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290381600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290382700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370026000ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190038700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190039800ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190102640247700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290383800ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370027100ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190040600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "/MSBv2/SATSU/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M136100090142800ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "/MSBv2/SATSU/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M136100130132200ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "/MSBv2/SATSU/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M152101770003600ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "/MSBv2/SATSU/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M123121250088201ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "/MSBv2/SATSU/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M123121250089300ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "/MSBv2/SATSU/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M123121250090100ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "/MSBv2/SATSU/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M142100730095500ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "/MSBv2/SATSU/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M142100160276101ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "/MSBv2/SATSU/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M142100160283500ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "/MSBv2/SATSU/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M154402090069900ENG'] = [{ sbRecFile: "MSB-23E54-503.pdf", sbTitle: "Correction of description about DIAGNOSIS MODE ITEM of SMARTPHONE LINK DISPLAY AUDIO", releaseDate: "2023/08/07", href: "/MSBv2/SATSU/MSB-23E54-503.pdf" },{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "/MSBv2/SATSU/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154601660152000ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "/MSBv2/SATSU/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154601661401001ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "/MSBv2/SATSU/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154402090071800ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "/MSBv2/SATSU/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M17200890022500ENG'] = [{ sbRecFile: "MSB-18EXML17-500.pdf", sbTitle: "Correction of Inspection Procedure on Diagnosis code.P1566 regarding Cruse Control Output from the Engine ECU", releaseDate: "2018/07/04", href: "/MSBv2/SATSU/MSB-18EXML17-500.pdf" }];
sieid_sblist_map['M1511004702462ENG'] = [{ sbRecFile: "MSB-18EXML51-001.pdf", sbTitle: "Modification of the removal and installation procedure of MOULDINGS", releaseDate: "2018/03/26", href: "/MSBv2/SATSU/MSB-18EXML51-001.pdf" }];
sieid_sblist_map['M1540202000261ENG'] = [{ sbRecFile: "MSB-18EXML54-502.pdf", sbTitle: "Correction of the Switch resistance check about MULTI-INFORMATION DISPLAY SWITCH CHECK", releaseDate: "2018/09/06", href: "/MSBv2/SATSU/MSB-18EXML54-502.pdf" }];
sieid_sblist_map['M100102590001600ENG'] = [{ sbRecFile: "MSB-18EXML00-501A.pdf", sbTitle: "Correction of \“INITIALIZATION PROCEDURE FOR LEARNING VALUE IN DFI AND MFI ENGINE\” of the vehicles equipped with CVT type F1CAC or W1CAC", releaseDate: "2019/02/06", href: "/MSBv2/SATSU/MSB-18EXML00-501A.pdf" }];
sieid_sblist_map['M113100030375900ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "/MSBv2/SATSU/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113115200641000ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "/MSBv2/SATSU/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113100190327100ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "/MSBv2/SATSU/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113100090307400ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "/MSBv2/SATSU/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M100102530008101ENG'] = [{ sbRecFile: "MSB-18EXML00-502.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/11", href: "/MSBv2/SATSU/MSB-18EXML00-502.pdf" }];
sieid_sblist_map['M154010850051300ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of the INSTALLATION procedure about LIGHTING CONTROL SENSOR REMOVAL AND INSTALLATION due to establish the service parts of Silicone Pad", releaseDate: "2018/12/18", href: "/MSBv2/SATSU/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M154010850054600ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of the INSTALLATION procedure about LIGHTING CONTROL SENSOR REMOVAL AND INSTALLATION due to establish the service parts of Silicone Pad", releaseDate: "2018/12/18", href: "/MSBv2/SATSU/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M100100030977900ENG'] = [{ sbRecFile: "MSB-18E00-001.pdf", sbTitle: "New Information of 2019MY i-MiEV", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00-001.pdf" }];
sieid_sblist_map['M10010056A000500ENG'] = [{ sbRecFile: "MSB-18E00-001.pdf", sbTitle: "New Information of 2019MY i-MiEV", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00-001.pdf" }];
sieid_sblist_map['M100100031040500ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M100102450013400ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M100100091122800ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M142010000103500ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M142016010095000ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M14201611A000100ENG'] = [{ sbRecFile: "MSB-18E00_42-001A.pdf", sbTitle: "Information about additional models of 2019MY SPACE STAR_MIRAGE", releaseDate: "2017/08/03", href: "/MSBv2/SATSU/MSB-18E00_42-001A.pdf" }];
sieid_sblist_map['M123122360035500ENG'] = [{ sbRecFile: "MSB-18EXML23-001.pdf", sbTitle: "Correction of the illustration and reference table about OIL STRAINER INSTALLATION of CVT Oil Pan", releaseDate: "2018/09/11", href: "/MSBv2/SATSU/MSB-18EXML23-001.pdf" }];
sieid_sblist_map['M123320800160101ENG'] = [{ sbRecFile: "MSB-18EXML23-001.pdf", sbTitle: "Correction of the illustration and reference table about OIL STRAINER INSTALLATION of CVT Oil Pan", releaseDate: "2018/09/11", href: "/MSBv2/SATSU/MSB-18EXML23-001.pdf" }];
sieid_sblist_map['M123122360051500ENG'] = [{ sbRecFile: "MSB-18EXML23-001.pdf", sbTitle: "Correction of the illustration and reference table about OIL STRAINER INSTALLATION of CVT Oil Pan", releaseDate: "2018/09/11", href: "/MSBv2/SATSU/MSB-18EXML23-001.pdf" }];
sieid_sblist_map['M123320800173100ENG'] = [{ sbRecFile: "MSB-18EXML23-001.pdf", sbTitle: "Correction of the illustration and reference table about OIL STRAINER INSTALLATION of CVT Oil Pan", releaseDate: "2018/09/11", href: "/MSBv2/SATSU/MSB-18EXML23-001.pdf" }];
sieid_sblist_map['M113120640001601ENG'] = [{ sbRecFile: "MSB-19EX13_17-501.pdf", sbTitle: "Addition and correction of the diagnosis procedure of DTC No P1617 regarding Troubleshooting for the vehicles with AS and G", releaseDate: "2019/03/21", href: "/MSBv2/SATSU/MSB-19EX13_17-501.pdf" }];
sieid_sblist_map['M113120640002700ENG'] = [{ sbRecFile: "MSB-19EX13_17-501.pdf", sbTitle: "Addition and correction of the diagnosis procedure of DTC No P1617 regarding Troubleshooting for the vehicles with AS and G", releaseDate: "2019/03/21", href: "/MSBv2/SATSU/MSB-19EX13_17-501.pdf" }];
sieid_sblist_map['M11312064A000300ENG'] = [{ sbRecFile: "MSB-19EX13_17-501.pdf", sbTitle: "Addition and correction of the diagnosis procedure of DTC No P1617 regarding Troubleshooting for the vehicles with AS and G", releaseDate: "2019/03/21", href: "/MSBv2/SATSU/MSB-19EX13_17-501.pdf" }];
sieid_sblist_map['M100100031074000ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M100100560516000ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M100100550392900ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M100100091121700ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M152100010269600ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M152101150061400ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M155100010168500ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M155100040215100ENG'] = [{ sbRecFile: "MSB-18E00_52_55-001", sbTitle: "New Information of 2019MY L200/L200 SPORTERO", releaseDate: "2018/06/04", href: "/MSBv2/SATSU/MSB-18E00_52_55-001" }];
sieid_sblist_map['M152200150233301ENG'] = [{ sbRecFile: "MSB-19E52-001.pdf", sbTitle: "Addition of the description about Front Seat Lumber Support Assembly", releaseDate: "2019/06/26", href: "/MSBv2/SATSU/MSB-19E52-001.pdf" }];
sieid_sblist_map['M154760310005501ENG'] = [{ sbRecFile: "MSB-19E54-501.pdf", sbTitle: "Correction of the description of Input Signal Check about Acoustic Vehicle Alerting System (AVAS)", releaseDate: "2019/05/27", href: "/MSBv2/SATSU/MSB-19E54-501.pdf" }];
sieid_sblist_map['M154760060005100ENG'] = [{ sbRecFile: "MSB-19E54-501.pdf", sbTitle: "Correction of the description of Input Signal Check about Acoustic Vehicle Alerting System (AVAS)", releaseDate: "2019/05/27", href: "/MSBv2/SATSU/MSB-19E54-501.pdf" }];
sieid_sblist_map['M223100140027700ENG'] = [{ sbRecFile: "MSB-19EXML23-501.pdf", sbTitle: "", releaseDate: "2019/07/03", href: "/MSBv2/SATSU/MSB-19EXML23-501.pdf" }];
sieid_sblist_map['M123120260122300ENG'] = [{ sbRecFile: "MSB-19EXML23-501.pdf", sbTitle: "", releaseDate: "2019/07/03", href: "/MSBv2/SATSU/MSB-19EXML23-501.pdf" }];
sieid_sblist_map['M22310014A000200ENG'] = [{ sbRecFile: "MSB-19EXML23-501.pdf", sbTitle: "", releaseDate: "2019/07/03", href: "/MSBv2/SATSU/MSB-19EXML23-501.pdf" }];
sieid_sblist_map['M12312026A000400ENG'] = [{ sbRecFile: "MSB-19EXML23-501.pdf", sbTitle: "", releaseDate: "2019/07/03", href: "/MSBv2/SATSU/MSB-19EXML23-501.pdf" }];
sieid_sblist_map['M100102530018800ENG'] = [{ sbRecFile: "MSB-19EXML00-001.pdf", sbTitle: "Change of the Modification method about Turn signal Sound Change using the multi information display", releaseDate: "2019/07/08", href: "/MSBv2/SATSU/MSB-19EXML00-001.pdf" }];
sieid_sblist_map['M10010253A000100ENG'] = [{ sbRecFile: "MSB-19EXML00-001.pdf", sbTitle: "Change of the Modification method about Turn signal Sound Change using the multi information display", releaseDate: "2019/07/08", href: "/MSBv2/SATSU/MSB-19EXML00-001.pdf" }];
sieid_sblist_map['M135302500001500ENG'] = [{ sbRecFile: "MSB-19EXL37-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19EXL37-501.pdf" }];
sieid_sblist_map['M13620025A000700ENG'] = [{ sbRecFile: "MSB-19EXL37-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19EXL37-501.pdf" }];
sieid_sblist_map['M112100030129100ENG'] = [{ sbRecFile: "MSB-19E12_17-501.pdf", sbTitle: "Correction of the Service Specification of Engine Lubrication and Diagnosis Procedure of UERA SCR System for 4N14 Engine", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19E12_17-501.pdf" }];
sieid_sblist_map['M11793109A000700ENG'] = [{ sbRecFile: "MSB-19E12_17-501.pdf", sbTitle: "Correction of the Service Specification of Engine Lubrication and Diagnosis Procedure of UERA SCR System for 4N14 Engine", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19E12_17-501.pdf" }];
sieid_sblist_map['M11793110A000600ENG'] = [{ sbRecFile: "MSB-19E12_17-501.pdf", sbTitle: "Correction of the Service Specification of Engine Lubrication and Diagnosis Procedure of UERA SCR System for 4N14 Engine", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19E12_17-501.pdf" }];
sieid_sblist_map['M11793111A000600ENG'] = [{ sbRecFile: "MSB-19E12_17-501.pdf", sbTitle: "Correction of the Service Specification of Engine Lubrication and Diagnosis Procedure of UERA SCR System for 4N14 Engine", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19E12_17-501.pdf" }];
sieid_sblist_map['M11793112A000900ENG'] = [{ sbRecFile: "MSB-19E12_17-501.pdf", sbTitle: "Correction of the Service Specification of Engine Lubrication and Diagnosis Procedure of UERA SCR System for 4N14 Engine", releaseDate: "2019/07/18", href: "/MSBv2/SATSU/MSB-19E12_17-501.pdf" }];
sieid_sblist_map['M11330042A001100ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" },{ sbRecFile: "MSB-19E13-501.pdf", sbTitle: "Correction of the service data No 67 of Supply pump target value for 4N14 Engine", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19E13-501.pdf" }];
sieid_sblist_map['M117201910001800ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201920001500ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201930001200ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201940001900ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201200010600ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201210009500ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201220009200ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117201230009900ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M117200240279000ENG'] = [{ sbRecFile: "MSB-19EXML17-501.pdf", sbTitle: "Change the service procedure of Power Steering Hose, Correction the description about Power steering oil pump suction hose", releaseDate: "2019/07/23", href: "/MSBv2/SATSU/MSB-19EXML17-501.pdf" }];
sieid_sblist_map['M12350070A003100ENG'] = [{ sbRecFile: "MSB-19EXML23-503.pdf", sbTitle: "Correction of the Diagnostic Procedure about DTC:U1426 for S-AWC", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19EXML23-503.pdf" }];
sieid_sblist_map['M12350070A003500ENG'] = [{ sbRecFile: "MSB-19EXML23-503.pdf", sbTitle: "Correction of the Diagnostic Procedure about DTC:U1426 for S-AWC", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19EXML23-503.pdf" }];
sieid_sblist_map['M123500700011300ENG'] = [{ sbRecFile: "MSB-19EXML23-503.pdf", sbTitle: "Correction of the Diagnostic Procedure about DTC:U1426 for S-AWC", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19EXML23-503.pdf" }];
sieid_sblist_map['M190100620539500ENG'] = [{ sbRecFile: "MSB-19E90-001.pdf", sbTitle: "Addition of the connector number for Rear Wiper Motor about Circuit Diagrams", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19E90-001.pdf" }];
sieid_sblist_map['M190100620544700ENG'] = [{ sbRecFile: "MSB-19E90-001.pdf", sbTitle: "Addition of the connector number for Rear Wiper Motor about Circuit Diagrams", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19E90-001.pdf" }];
sieid_sblist_map['M19010062A001000ENG'] = [{ sbRecFile: "MSB-19E90-001.pdf", sbTitle: "Addition of the connector number for Rear Wiper Motor about Circuit Diagrams", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19E90-001.pdf" }];
sieid_sblist_map['M19010062A000900ENG'] = [{ sbRecFile: "MSB-19E90-001.pdf", sbTitle: "Addition of the connector number for Rear Wiper Motor about Circuit Diagrams", releaseDate: "2019/08/21", href: "/MSBv2/SATSU/MSB-19E90-001.pdf" }];
sieid_sblist_map['M100102350032400ENG'] = [{ sbRecFile: "MSB-19EXML00-501.pdf", sbTitle: "Correction of the descriptions about Relay", releaseDate: "2019/08/23", href: "/MSBv2/SATSU/MSB-19EXML00-501.pdf" }];
sieid_sblist_map['M10010235A000300ENG'] = [{ sbRecFile: "MSB-19EXML00-501.pdf", sbTitle: "Correction of the descriptions about Relay", releaseDate: "2019/08/23", href: "/MSBv2/SATSU/MSB-19EXML00-501.pdf" }];
sieid_sblist_map['M136200250002800ENG'] = [{ sbRecFile: "MSB-19EXML36-501.pdf", sbTitle: "Correction of the Inspection items of Brake auto hold switch about the vehicles which equipped with Electric Parking Brake", releaseDate: "2019/09/02", href: "/MSBv2/SATSU/MSB-19EXML36-501.pdf" }];
sieid_sblist_map['M134100010245600ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" },{ sbRecFile: "MSB-19EXL34-001.pdf", sbTitle: "Addition of the SPECIFICATION of LEAF SPRING", releaseDate: "2019/09/03", href: "/MSBv2/SATSU/MSB-19EXL34-001.pdf" }];
sieid_sblist_map['M122200060143000ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201340083100ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201700005100ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201730002900ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201340084200ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201700006200ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M122201730003000ENG'] = [{ sbRecFile: "MSB-19EXL22-501.pdf", sbTitle: "Correction of the overhaul procedure about Manual Transmission R6M5A and V6M5A", releaseDate: "2019/10/02", href: "/MSBv2/SATSU/MSB-19EXL22-501.pdf" }];
sieid_sblist_map['M11410015A000900ENG'] = [{ sbRecFile: "MSB-19E14-001.pdf", sbTitle: "Addition of Radiator Condenser Tank for the vehicles which equipped with 4J1 Engine", releaseDate: "2019/09/19", href: "/MSBv2/SATSU/MSB-19E14-001.pdf" }];
sieid_sblist_map['M11335600A000400ENG'] = [{ sbRecFile: "MSB-19EXL13-001.pdf", sbTitle: "Change the diagnosis procedure of DTC No P2463 regarding Troubleshooting for the vehicles equipped with 4N1 series Engine", releaseDate: "2019/10/07", href: "/MSBv2/SATSU/MSB-19EXL13-001.pdf" }];
sieid_sblist_map['M100102320006600ENG'] = [{ sbRecFile: "MSB-19EXL00-501.pdf", sbTitle: "Correction and addition of the description about Continuous Idling Mode", releaseDate: "2019/10/15", href: "/MSBv2/SATSU/MSB-19EXL00-501.pdf" }];
sieid_sblist_map['M151102500025700ENG'] = [{ sbRecFile: "MSB-19EXML51-002.pdf", sbTitle: "Change of the Removal and Installation procedure about License Plate Garnish due to establish the service part of Tailgate Moulding", releaseDate: "2019/10/07", href: "/MSBv2/SATSU/MSB-19EXML51-002.pdf" }];
sieid_sblist_map['M15110250A000200ENG'] = [{ sbRecFile: "MSB-19EXML51-002.pdf", sbTitle: "Change of the Removal and Installation procedure about License Plate Garnish due to establish the service part of Tailgate Moulding", releaseDate: "2019/10/07", href: "/MSBv2/SATSU/MSB-19EXML51-002.pdf" }];
sieid_sblist_map['M15110250A000700ENG'] = [{ sbRecFile: "MSB-19EXML51-002.pdf", sbTitle: "Change of the Removal and Installation procedure about License Plate Garnish due to establish the service part of Tailgate Moulding", releaseDate: "2019/10/07", href: "/MSBv2/SATSU/MSB-19EXML51-002.pdf" }];
sieid_sblist_map['M123111790075800ENG'] = [{ sbRecFile: "MSB-19EXL23-001.pdf", sbTitle: "Addition of the procedure about Disassembly and　Reassembly about Selector Lever Assembly due to　establish the service parts of Gearshift Lever Cover", releaseDate: "2019/10/18", href: "/MSBv2/SATSU/MSB-19EXL23-001.pdf" }];
sieid_sblist_map['M123111790076900ENG'] = [{ sbRecFile: "MSB-19EXL23-001.pdf", sbTitle: "Addition of the procedure about Disassembly and　Reassembly about Selector Lever Assembly due to　establish the service parts of Gearshift Lever Cover", releaseDate: "2019/10/18", href: "/MSBv2/SATSU/MSB-19EXL23-001.pdf" }];
sieid_sblist_map['M20000380A000100ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M20000011A004400ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M20000350A001300ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M20000300A003900ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M40600002A002100ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M40600020A004300ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M40600070A000800ENG'] = [{ sbRecFile: "MSB-19E00_6-001.pdf", sbTitle: "Information about additional models of 2020MY ASX", releaseDate: "2019/10/25", href: "/MSBv2/SATSU/MSB-19E00_6-001.pdf" }];
sieid_sblist_map['M242001000123600ENG'] = [{ sbRecFile: "MSB-19EXML42-502.pdf", sbTitle: "Correction of the descriptions about Transmitter of Keyless Entry", releaseDate: "2019/10/23", href: "/MSBv2/SATSU/MSB-19EXML42-502.pdf" }];
sieid_sblist_map['M24200100A000500ENG'] = [{ sbRecFile: "MSB-19EXML42-502.pdf", sbTitle: "Correction of the descriptions about Transmitter of Keyless Entry", releaseDate: "2019/10/23", href: "/MSBv2/SATSU/MSB-19EXML42-502.pdf" }];
sieid_sblist_map['M11311520A001700ENG'] = [{ sbRecFile: "MSB-19EXL13-503.pdf", sbTitle: "Correction of the value of Normal condition about Throttle position sensor (sub) for the vehicles which are equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXL13-503.pdf" }];
sieid_sblist_map['M113115610068200ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" },{ sbRecFile: "MSB-19EXL13-503.pdf", sbTitle: "Correction of the value of Normal condition about Throttle position sensor (sub) for the vehicles which are equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXL13-503.pdf" }];
sieid_sblist_map['M111302340588700ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M111301190138800ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130234A002000ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130119A000700ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11510033A001300ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M111302340625501ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130119A000900ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130234A001500ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130119A000600ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11510033A000800ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130234A001400ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M11130119A001000ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M115100330375000ENG'] = [{ sbRecFile: "MSB-19EXML11_15-001.pdf", sbTitle: "Change of the procedure of Disassembly and Assembly about Heat Protector of Exhaust Manifold due to establish the service part for the vehicles which equipped with 4B1 and 4J1 Engine", releaseDate: "2019/10/28", href: "/MSBv2/SATSU/MSB-19EXML11_15-001.pdf" }];
sieid_sblist_map['M13110083A000300ENG'] = [{ sbRecFile: "MSB-19E31-501.pdf", sbTitle: "Correction of the Diagnostic Procedure about several DTC’s for TYRE PRESSURE MONITORING SYSTEM", releaseDate: "2019/11/15", href: "/MSBv2/SATSU/MSB-19E31-501.pdf" }];
sieid_sblist_map['M133200060135300ENG'] = [{ sbRecFile: "MSB-19EXL33-501.pdf", sbTitle: "Correction and addition of the procedure of replacement about Upper Arm and Lower Arm Bushing for Front Suspension", releaseDate: "2019/11/18", href: "/MSBv2/SATSU/MSB-19EXL33-501.pdf" }];
sieid_sblist_map['M133200440019800ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" },{ sbRecFile: "MSB-19EXL33-501.pdf", sbTitle: "Correction and addition of the procedure of replacement about Upper Arm and Lower Arm Bushing for Front Suspension", releaseDate: "2019/11/18", href: "/MSBv2/SATSU/MSB-19EXL33-501.pdf" }];
sieid_sblist_map['M133200170130800ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" },{ sbRecFile: "MSB-19EXL33-501.pdf", sbTitle: "Correction and addition of the procedure of replacement about Upper Arm and Lower Arm Bushing for Front Suspension", releaseDate: "2019/11/18", href: "/MSBv2/SATSU/MSB-19EXL33-501.pdf" }];
sieid_sblist_map['M11310330A000600ENG'] = [{ sbRecFile: "MSB-19EXML13-501.pdf", sbTitle: "Correction of the continuity of Relay for MFI Injection, Fuel Pump and Throttle Actuator Control Motor", releaseDate: "2019/12/09", href: "/MSBv2/SATSU/MSB-19EXML13-501.pdf" }];
sieid_sblist_map['M11310330A001000ENG'] = [{ sbRecFile: "MSB-19EXML13-501.pdf", sbTitle: "Correction of the continuity of Relay for MFI Injection, Fuel Pump and Throttle Actuator Control Motor", releaseDate: "2019/12/09", href: "/MSBv2/SATSU/MSB-19EXML13-501.pdf" }];
sieid_sblist_map['M14220010A000200ENG'] = [{ sbRecFile: "MSB-19EXML42-503.pdf", sbTitle: "Correction and addition of the procedure of Removal and Installation about Windshield for the vehicles which equipped with FCM, LDW, AHB", releaseDate: "2019/12/11", href: "/MSBv2/SATSU/MSB-19EXML42-503.pdf" }];
sieid_sblist_map['M14220010A000300ENG'] = [{ sbRecFile: "MSB-19EXML42-503.pdf", sbTitle: "Correction and addition of the procedure of Removal and Installation about Windshield for the vehicles which equipped with FCM, LDW, AHB", releaseDate: "2019/12/11", href: "/MSBv2/SATSU/MSB-19EXML42-503.pdf" }];
sieid_sblist_map['M14220010A000700ENG'] = [{ sbRecFile: "MSB-19EXML42-503.pdf", sbTitle: "Correction and addition of the procedure of Removal and Installation about Windshield for the vehicles which equipped with FCM, LDW, AHB", releaseDate: "2019/12/11", href: "/MSBv2/SATSU/MSB-19EXML42-503.pdf" }];
sieid_sblist_map['M126100060234800ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100170264900ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100350359200ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100190143500ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M135100030306700ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M135100040202701ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M13510174A007600ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M135101860048400ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M135101720086900ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M135100620270801ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100060185100ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100170240100ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100190099301ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M126100350288901ENG'] = [{ sbRecFile: "MSB-19EX26_35-501.pdf", sbTitle: "Addition and correction of the procedure of Removal and Installation about Front Axle parts for the vehicles with 17inch brake disc", releaseDate: "2019/12/16", href: "/MSBv2/SATSU/MSB-19EX26_35-501.pdf" }];
sieid_sblist_map['M151102390019100ENG'] = [{ sbRecFile: "MSB-19EXL51-501.pdf", sbTitle: "Correction and addition of the procedure of Disassembly and Reassembly about Outside Mirror", releaseDate: "2019/12/23", href: "/MSBv2/SATSU/MSB-19EXL51-501.pdf" }];
sieid_sblist_map['M135302330002100ENG'] = [{ sbRecFile: "MSB-20EXL35-001.pdf", sbTitle: "Addition of the NEW DTC No. C1283", releaseDate: "2020/01/09", href: "/MSBv2/SATSU/MSB-20EXL35-001.pdf" }];
sieid_sblist_map['M135500100191300ENG'] = [{ sbRecFile: "MSB-20EXL35-001.pdf", sbTitle: "Addition of the NEW DTC No. C1283", releaseDate: "2020/01/09", href: "/MSBv2/SATSU/MSB-20EXL35-001.pdf" }];
sieid_sblist_map['M135500110232200ENG'] = [{ sbRecFile: "MSB-20EXL35-001.pdf", sbTitle: "Addition of the NEW DTC No. C1283", releaseDate: "2020/01/09", href: "/MSBv2/SATSU/MSB-20EXL35-001.pdf" }];
sieid_sblist_map['M135300930012400ENG'] = [{ sbRecFile: "MSB-20EXL35-001.pdf", sbTitle: "Addition of the NEW DTC No. C1283", releaseDate: "2020/01/09", href: "/MSBv2/SATSU/MSB-20EXL35-001.pdf" }];
sieid_sblist_map['M403000230034600ENG'] = [{ sbRecFile: "MSB-20EXL3-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Side Gate Panel and Rear End Sill due to change the specification of Bolts", releaseDate: "2020/01/24", href: "/MSBv2/SATSU/MSB-20EXL3-001.pdf" }];
sieid_sblist_map['M403000230035700ENG'] = [{ sbRecFile: "MSB-20EXL3-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Side Gate Panel and Rear End Sill due to change the specification of Bolts", releaseDate: "2020/01/24", href: "/MSBv2/SATSU/MSB-20EXL3-001.pdf" }];
sieid_sblist_map['M403000230036800ENG'] = [{ sbRecFile: "MSB-20EXL3-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Side Gate Panel and Rear End Sill due to change the specification of Bolts", releaseDate: "2020/01/24", href: "/MSBv2/SATSU/MSB-20EXL3-001.pdf" }];
sieid_sblist_map['M403000220007100ENG'] = [{ sbRecFile: "MSB-20EXL3-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Side Gate Panel and Rear End Sill due to change the specification of Bolts", releaseDate: "2020/01/24", href: "/MSBv2/SATSU/MSB-20EXL3-001.pdf" }];
sieid_sblist_map['M40600020A003200ENG'] = [{ sbRecFile: "MSB-20EXL6-501.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2020/01/15", href: "/MSBv2/SATSU/MSB-20EXL6-501.pdf" }];
sieid_sblist_map['M40600020A002900ENG'] = [{ sbRecFile: "MSB-20EXL6-501.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2020/01/15", href: "/MSBv2/SATSU/MSB-20EXL6-501.pdf" }];
sieid_sblist_map['M406000200520200ENG'] = [{ sbRecFile: "MSB-20EXL6-501.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2020/01/15", href: "/MSBv2/SATSU/MSB-20EXL6-501.pdf" }];
sieid_sblist_map['M406000200526800ENG'] = [{ sbRecFile: "MSB-20EXL6-501.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2020/01/15", href: "/MSBv2/SATSU/MSB-20EXL6-501.pdf" }];
sieid_sblist_map['M406000200527900ENG'] = [{ sbRecFile: "MSB-20EXL6-501.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2020/01/15", href: "/MSBv2/SATSU/MSB-20EXL6-501.pdf" }];
sieid_sblist_map['M40100100A000005ENG'] = [{ sbRecFile: "MSB-20EXML1_2-501.pdf", sbTitle: "Correction of the descriptions of Body Construction and Body Dimensions about Body Repair Manual", releaseDate: "2020/01/28", href: "/MSBv2/SATSU/MSB-20EXML1_2-501.pdf" }];
sieid_sblist_map['M40200060A000500ENG'] = [{ sbRecFile: "MSB-20EXML1_2-501.pdf", sbTitle: "Correction of the descriptions of Body Construction and Body Dimensions about Body Repair Manual", releaseDate: "2020/01/28", href: "/MSBv2/SATSU/MSB-20EXML1_2-501.pdf" }];
sieid_sblist_map['M151100190362000ENG'] = [{ sbRecFile: "MSB-18EXML51-501A.pdf", sbTitle: "Correction of the illustration of the electric wave penetration areas", releaseDate: "2020/02/24", href: "/MSBv2/SATSU/MSB-18EXML51-501A.pdf" }];
sieid_sblist_map['M15110019A000700ENG'] = [{ sbRecFile: "MSB-18EXML51-501A.pdf", sbTitle: "Correction of the illustration of the electric wave penetration areas", releaseDate: "2020/02/24", href: "/MSBv2/SATSU/MSB-18EXML51-501A.pdf" }];
sieid_sblist_map['M19010008A010900ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010008A011000ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010015A008100ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010015A008200ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010017A006800ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010017A006900ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010307A005200ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010307A005300ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010119A006000ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010446A001200ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010446A001300ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010177A000700ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010177A000900ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010029A007900ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010029A008000ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010278A001100ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010278A001200ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010156A004700ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010427A002500ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010361A005300ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010434A001700ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010424A000600ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010395A003300ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010333A005700ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010210A003800ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010210A003900ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010256A005500ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010190A005000ENG'] = [{ sbRecFile: "MSB-20E90-001.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-001.pdf" }];
sieid_sblist_map['M19010008A010700ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010015A007800ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010017A006500ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010307A004900ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010446A001000ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010119A005700ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010178A001400ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010029A007600ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010424A000400ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010333A005500ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M19010210A003700ENG'] = [{ sbRecFile: "MSB-20E90-002.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/03/27", href: "/MSBv2/SATSU/MSB-20E90-002.pdf" }];
sieid_sblist_map['M11793041A000200ENG'] = [{ sbRecFile: "MSB-23E17-001.pdf", sbTitle: "Changed of maintenance procedures when replacing DCU of UERA SCR SYSTEM", releaseDate: "2023/05/09", href: "/MSBv2/SATSU/MSB-23E17-001.pdf" },{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793034A000100ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793120A000200ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793121A000200ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793130A000100ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793131A000100ENG'] = [{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" },{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793135A000200ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793136A000200ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793172A000200ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793034A000600ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793120A000600ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793121A000600ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793130A000500ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" },{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793131A000500ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" },{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" },{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793135A000600ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793136A000600ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793172A000700ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M11793054A000300ENG'] = [{ sbRecFile: "MSB-20E17-501.pdf", sbTitle: "Correction of the maintenance procedure about UREA SCR System", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20E17-501.pdf" }];
sieid_sblist_map['M151101910366300ENG'] = [{ sbRecFile: "MSB-20EXML51-502.pdf", sbTitle: "Correction of the Injection Area of rear wiper about the procedure of Adjustment of the jet type washer nozzle injection position", releaseDate: "2020/04/30", href: "/MSBv2/SATSU/MSB-20EXML51-502.pdf" }];
sieid_sblist_map['M137201110220700ENG'] = [{ sbRecFile: "MSB-20EXL37-501.pdf", sbTitle: "Correction of the description of Removal and Installation procedure about Rack Support Cover/ Lock Nut and the name of Specified Sealant", releaseDate: "2020/05/27", href: "/MSBv2/SATSU/MSB-20EXL37-501.pdf" }];
sieid_sblist_map['M602040010104101ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M60204001A003200ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M60204001A002600ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M60204001A003400ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M60204001A002400ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M602040010159100ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M602040010182500ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M602040010174000ENG'] = [{ sbRecFile: "MSB-20EX2-501.pdf", sbTitle: "Correction of the description of Height Check, Clearance Check and Adjustment about Brake Pedal", releaseDate: "2020/06/02", href: "/MSBv2/SATSU/MSB-20EX2-501.pdf" }];
sieid_sblist_map['M111200370113700ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M123111700086300ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M123111700087400ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M123310010029500ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M123310030011400ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M123311700006300ENG'] = [{ sbRecFile: "MSB-20EXL11_23-001B.pdf", sbTitle: "Addition of the maintenance procedure about New Torque Converter Assembly – Type B", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-20EXL11_23-001B.pdf" }];
sieid_sblist_map['M11750003A077000ENG'] = [{ sbRecFile: "MSB-20E17-502.pdf", sbTitle: "Correction of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2020/07/23", href: "/MSBv2/SATSU/MSB-20E17-502.pdf" }];
sieid_sblist_map['M11793035A000100ENG'] = [{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" },{ sbRecFile: "MSB-20E17-502.pdf", sbTitle: "Correction of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2020/07/23", href: "/MSBv2/SATSU/MSB-20E17-502.pdf" }];
sieid_sblist_map['M11750003A077500ENG'] = [{ sbRecFile: "MSB-20E17-502.pdf", sbTitle: "Correction of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2020/07/23", href: "/MSBv2/SATSU/MSB-20E17-502.pdf" }];
sieid_sblist_map['M11793035A000600ENG'] = [{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" },{ sbRecFile: "MSB-20E17-502.pdf", sbTitle: "Correction of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2020/07/23", href: "/MSBv2/SATSU/MSB-20E17-502.pdf" }];
sieid_sblist_map['M154980110019000ENG'] = [{ sbRecFile: "MSB-20EXML54-501.pdf", sbTitle: "Correction of the description of about Data List Reference Table of FCM LDW AHB-ECU", releaseDate: "2020/08/03", href: "/MSBv2/SATSU/MSB-20EXML54-501.pdf" }];
sieid_sblist_map['M15498011A000100ENG'] = [{ sbRecFile: "MSB-20EXML54-501.pdf", sbTitle: "Correction of the description of about Data List Reference Table of FCM LDW AHB-ECU", releaseDate: "2020/08/03", href: "/MSBv2/SATSU/MSB-20EXML54-501.pdf" }];
sieid_sblist_map['M10010178A000300ENG'] = [{ sbRecFile: "MSB-20EX00_17-501.pdf", sbTitle: "Deletion of the unnecessary description of diesel engine learning value initialization in the work after replacing the EGR cooler assembly", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20EX00_17-501.pdf" }];
sieid_sblist_map['M11750072A000400ENG'] = [{ sbRecFile: "MSB-20EX00_17-501.pdf", sbTitle: "Deletion of the unnecessary description of diesel engine learning value initialization in the work after replacing the EGR cooler assembly", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20EX00_17-501.pdf" }];
sieid_sblist_map['M11750072A000700ENG'] = [{ sbRecFile: "MSB-20EX00_17-501.pdf", sbTitle: "Deletion of the unnecessary description of diesel engine learning value initialization in the work after replacing the EGR cooler assembly", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20EX00_17-501.pdf" }];
sieid_sblist_map['M152100260095800ENG'] = [{ sbRecFile: "MSB-20EXML52-001A.pdf", sbTitle: "Addition of the service procedure about Automatic Anti-Dazzling Inside Rear View Mirror", releaseDate: "2020/01/06", href: "/MSBv2/SATSU/MSB-20EXML52-001A.pdf" }];
sieid_sblist_map['M152100260111100ENG'] = [{ sbRecFile: "MSB-20EXML52-001A.pdf", sbTitle: "Addition of the service procedure about Automatic Anti-Dazzling Inside Rear View Mirror", releaseDate: "2020/01/06", href: "/MSBv2/SATSU/MSB-20EXML52-001A.pdf" }];
sieid_sblist_map['M142900130215100ENG'] = [{ sbRecFile: "MSB-20EXML42-002.pdf", sbTitle: "Modification of Removal and Installation procedure about Door Window Glass and Power Window Regulator", releaseDate: "2020/10/01", href: "/MSBv2/SATSU/MSB-20EXML42-002.pdf" }];
sieid_sblist_map['M14290013A000700ENG'] = [{ sbRecFile: "MSB-20EXML42-002.pdf", sbTitle: "Modification of Removal and Installation procedure about Door Window Glass and Power Window Regulator", releaseDate: "2020/10/01", href: "/MSBv2/SATSU/MSB-20EXML42-002.pdf" }];
sieid_sblist_map['M19010008A013500ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010008A013600ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010446A001700ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010446A001800ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010177A001500ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010177A001600ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010029A010200ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010278A001500ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010156A006700ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010427A002800ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010361A006200ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010434A002000ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010424A000800ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010395A004200ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010333A006400ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010210A005100ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010210A005200ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010256A007100ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M19010190A005800ENG'] = [{ sbRecFile: "MSB-20E90-003.pdf", sbTitle: "Change the wire diameter and color of circuit diagram", releaseDate: "2020/09/28", href: "/MSBv2/SATSU/MSB-20E90-003.pdf" }];
sieid_sblist_map['M111200160558900ENG'] = [{ sbRecFile: "MSB-20EXL11-502.pdf", sbTitle: "Change and correction of the Installation procedure about Drive Belt for the vehicles equipped with 4N14 and 4N15 type engine", releaseDate: "2020/10/29", href: "/MSBv2/SATSU/MSB-20EXL11-502.pdf" }];
sieid_sblist_map['M154946010005401ENG'] = [{ sbRecFile: "MSB-20EXML54-0022.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about Main Drive Lithium-Ion Battery", releaseDate: "2020/10/30", href: "/MSBv2/SATSU/MSB-20EXML54-0022.pdf" }];
sieid_sblist_map['M154940520014600ENG'] = [{ sbRecFile: "MSB-20EXML54-0022.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about Main Drive Lithium-Ion Battery", releaseDate: "2020/10/30", href: "/MSBv2/SATSU/MSB-20EXML54-0022.pdf" }];
sieid_sblist_map['M115100240150900ENG'] = [{ sbRecFile: "MSB-20EXL15-001.pdf", sbTitle: "Change the tightening torque of the bolts for connecting Air Pipes and Intercooler Assembly for the vehicles equipped with 4N1 series engine", releaseDate: "2020/11/16", href: "/MSBv2/SATSU/MSB-20EXL15-001.pdf" }];
sieid_sblist_map['M11335284A000300ENG'] = [{ sbRecFile: "MSB-20E13-501.pdf", sbTitle: "Correction of the Troubleshooting Procedure about DTC No. P0401 for the vehicles equipped with 4N14 engine", releaseDate: "2020/12/03", href: "/MSBv2/SATSU/MSB-20E13-501.pdf" }];
sieid_sblist_map['M11330040A000900ENG'] = [{ sbRecFile: "MSB-20E13-501.pdf", sbTitle: "Correction of the Troubleshooting Procedure about DTC No. P0401 for the vehicles equipped with 4N14 engine", releaseDate: "2020/12/03", href: "/MSBv2/SATSU/MSB-20E13-501.pdf" }];
sieid_sblist_map['M11335284A000400ENG'] = [{ sbRecFile: "MSB-20E13-501.pdf", sbTitle: "Correction of the Troubleshooting Procedure about DTC No. P0401 for the vehicles equipped with 4N14 engine", releaseDate: "2020/12/03", href: "/MSBv2/SATSU/MSB-20E13-501.pdf" }];
sieid_sblist_map['M113103380275300ENG'] = [{ sbRecFile: "MSB-20EX13_17-001.pdf", sbTitle: "Addition of the description of CAUTION about Removal and installation procedure about Learning Procedure for Starter Counter", releaseDate: "2020/12/10", href: "/MSBv2/SATSU/MSB-20EX13_17-001.pdf" }];
sieid_sblist_map['M11310338A000300ENG'] = [{ sbRecFile: "MSB-20EX13_17-001.pdf", sbTitle: "Addition of the description of CAUTION about Removal and installation procedure about Learning Procedure for Starter Counter", releaseDate: "2020/12/10", href: "/MSBv2/SATSU/MSB-20EX13_17-001.pdf" }];
sieid_sblist_map['M11770051A001100ENG'] = [{ sbRecFile: "MSB-20EX13_17-001.pdf", sbTitle: "Addition of the description of CAUTION about Removal and installation procedure about Learning Procedure for Starter Counter", releaseDate: "2020/12/10", href: "/MSBv2/SATSU/MSB-20EX13_17-001.pdf" }];
sieid_sblist_map['M15402019A003400ENG'] = [{ sbRecFile: "MSB-20E54-501.pdf", sbTitle: "Correction of the description CHECK ENGINE OIL LEVEL of Warning Screen about Multi Information Display Screen for the vehicles equipped with 4N1 series engine", releaseDate: "2020/12/23", href: "/MSBv2/SATSU/MSB-20E54-501.pdf" }];
sieid_sblist_map['M15401048A002400ENG'] = [{ sbRecFile: "MSB-20EXL54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about Headlamp and Front Combination Lamp", releaseDate: "2020/12/23", href: "/MSBv2/SATSU/MSB-20EXL54-001.pdf" }];
sieid_sblist_map['M15401163A000200ENG'] = [{ sbRecFile: "MSB-20EXL54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about Headlamp and Front Combination Lamp", releaseDate: "2020/12/23", href: "/MSBv2/SATSU/MSB-20EXL54-001.pdf" }];
sieid_sblist_map['M151102800094402ENG'] = [{ sbRecFile: "MSB-21EXL51-501.pdf", sbTitle: "Correction of the Diagnosis Procedure about Windshield Wiper vehicles with rain AUTO wiper", releaseDate: "2021/01/11", href: "/MSBv2/SATSU/MSB-21EXL51-501.pdf" }];
sieid_sblist_map['M151102810086602ENG'] = [{ sbRecFile: "MSB-21EXL51-501.pdf", sbTitle: "Correction of the Diagnosis Procedure about Windshield Wiper vehicles with rain AUTO wiper", releaseDate: "2021/01/11", href: "/MSBv2/SATSU/MSB-21EXL51-501.pdf" }];
sieid_sblist_map['M155100060144200ENG'] = [{ sbRecFile: "MSB-21EXL55-001.pdf", sbTitle: "Added the disassembly and reassembly procedure about Air-con Compressor Assembly due to addition of the Ring Spring Armature type Air-con Compressor Assembly", releaseDate: "2021/01/11", href: "/MSBv2/SATSU/MSB-21EXL55-001.pdf" }];
sieid_sblist_map['M155200460408201ENG'] = [{ sbRecFile: "MSB-21EXL55-001.pdf", sbTitle: "Added the disassembly and reassembly procedure about Air-con Compressor Assembly due to addition of the Ring Spring Armature type Air-con Compressor Assembly", releaseDate: "2021/01/11", href: "/MSBv2/SATSU/MSB-21EXL55-001.pdf" }];
sieid_sblist_map['M11335252A000300ENG'] = [{ sbRecFile: "MSB-21E13-501.pdf", sbTitle: "Correction of reference regarding Diagnosis Procedure of DTC No. P252F", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13-501.pdf" }];
sieid_sblist_map['M21730002A000100ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330044A000200ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330045A000600ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11750108A038700ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330042A001400ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M217300020045500ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330042A001600ENG'] = [{ sbRecFile: "MSB-21E13-001.pdf", sbTitle: "Add the description of Note about DATA LIST REFERENCE TABLE No. 16 and No.17 for the vehicles equipped with 4N1 series engine", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E13-001.pdf" },{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330044A000500ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11330045A001100ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" },{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M11750108A039300ENG'] = [{ sbRecFile: "MSB-21E13_17-501.pdf", sbTitle: "Correction of operating conditions for EGR cooler bypass system", releaseDate: "2021/01/25", href: "/MSBv2/SATSU/MSB-21E13_17-501.pdf" }];
sieid_sblist_map['M15110021A003000ENG'] = [{ sbRecFile: "MSB-21E51-001.pdf", sbTitle: "Change of the Removal and Installation procedure about Rear Bumper due to abolition of fixing Bolt", releaseDate: "2021/02/18", href: "/MSBv2/SATSU/MSB-21E51-001.pdf" }];
sieid_sblist_map['M15110021A004500ENG'] = [{ sbRecFile: "MSB-21E51-001.pdf", sbTitle: "Change of the Removal and Installation procedure about Rear Bumper due to abolition of fixing Bolt", releaseDate: "2021/02/18", href: "/MSBv2/SATSU/MSB-21E51-001.pdf" }];
sieid_sblist_map['M11750068A005700ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11750068A005800ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793031A000500ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793134A000600ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793158A000500ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793159A000500ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793171A000500ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M11793184A000500ENG'] = [{ sbRecFile: "MSB-21E17-501A.pdf", sbTitle: "Correction of the description of service procedure of EMISSION CONTROL DIESEL for the vehicles equipped with 4N14 and 4N15 Engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-501A.pdf" }];
sieid_sblist_map['M15110014A001400ENG'] = [{ sbRecFile: "MSB-21E51-002.pdf", sbTitle: "Addition of Removal and Installation procedure of Front Bumper Assembly due to abolition of Front Bumper Core", releaseDate: "2021/03/05", href: "/MSBv2/SATSU/MSB-21E51-002.pdf" }];
sieid_sblist_map['M12610037A000800ENG'] = [{ sbRecFile: "MSB-21E26_27-002.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about DRIVESHAFT", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E26_27-002.pdf" }];
sieid_sblist_map['M12610037A000900ENG'] = [{ sbRecFile: "MSB-21E26_27-002.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about DRIVESHAFT", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E26_27-002.pdf" }];
sieid_sblist_map['M12610085A000200ENG'] = [{ sbRecFile: "MSB-21E26_27-002.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about DRIVESHAFT", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E26_27-002.pdf" }];
sieid_sblist_map['M12710035A000600ENG'] = [{ sbRecFile: "MSB-21E26_27-002.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure about DRIVESHAFT", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E26_27-002.pdf" }];
sieid_sblist_map['M11330042A002500ENG'] = [{ sbRecFile: "MSB-21E13-001.pdf", sbTitle: "Add the description of Note about DATA LIST REFERENCE TABLE No. 16 and No.17 for the vehicles equipped with 4N1 series engine", releaseDate: "2021/03/26", href: "/MSBv2/SATSU/MSB-21E13-001.pdf" }];
sieid_sblist_map['M11130234A001100ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M11130261A000800ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M11510030A000400ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M11130234A002500ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M11130261A001600ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M11510030A002000ENG'] = [{ sbRecFile: "MSB-21E11_15-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Inlet Manifold Bolt due to added the flange bolt type", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E11_15-001.pdf" }];
sieid_sblist_map['M154940770002800ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154940810001800ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154940820002600ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941010002600ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941020001200ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941030001900ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941210001100ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941000001801ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M154941060001001ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M15494081A025700ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M15494121A025700ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M15494100A012900ENG'] = [{ sbRecFile: "MSB-21E54-001.pdf", sbTitle: "Change of the Disassembly and Reassembly procedure when replaced the Main Drive Lithium-Ion Battery", releaseDate: "2021/04/01", href: "/MSBv2/SATSU/MSB-21E54-001.pdf" }];
sieid_sblist_map['M11793035A001100ENG'] = [{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" }];
sieid_sblist_map['M11793131A000600ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" },{ sbRecFile: "MSB-21E17-502.pdf", sbTitle: "Correction and addition of the procedure about UREA LINE TUBE HEATER CHECK", releaseDate: "2021/03/31", href: "/MSBv2/SATSU/MSB-21E17-502.pdf" }];
sieid_sblist_map['M142961300016400ENG'] = [{ sbRecFile: "MSB-21E42-001.pdf", sbTitle: "Addition of the procedure of Disassembly and Reassembly about TPMS Transmitter due to change of the specification of TPMS Transmitter", releaseDate: "2021/04/02", href: "/MSBv2/SATSU/MSB-21E42-001.pdf" }];
sieid_sblist_map['M142750930012500ENG'] = [{ sbRecFile: "MSB-21E42-001.pdf", sbTitle: "Addition of the procedure of Disassembly and Reassembly about TPMS Transmitter due to change of the specification of TPMS Transmitter", releaseDate: "2021/04/02", href: "/MSBv2/SATSU/MSB-21E42-001.pdf" }];
sieid_sblist_map['M15494002A029200ENG'] = [{ sbRecFile: "MSB-21E54-002.pdf", sbTitle: "Change of the replacement procedure of Drive Battery Module due to set up the special tools", releaseDate: "2021/04/09", href: "/MSBv2/SATSU/MSB-21E54-002.pdf" }];
sieid_sblist_map['M15494064A001000ENG'] = [{ sbRecFile: "MSB-21E54-002.pdf", sbTitle: "Change of the replacement procedure of Drive Battery Module due to set up the special tools", releaseDate: "2021/04/09", href: "/MSBv2/SATSU/MSB-21E54-002.pdf" }];
sieid_sblist_map['M122110240069300ENG'] = [{ sbRecFile: "MSB-21E22_23-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Transfer Under Guard due to change the length of bolts", releaseDate: "2021/04/20", href: "/MSBv2/SATSU/MSB-21E22_23-001.pdf" }];
sieid_sblist_map['M122111380001501ENG'] = [{ sbRecFile: "MSB-21E22_23-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Transfer Under Guard due to change the length of bolts", releaseDate: "2021/04/20", href: "/MSBv2/SATSU/MSB-21E22_23-001.pdf" }];
sieid_sblist_map['M12211024A000400ENG'] = [{ sbRecFile: "MSB-21E22_23-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Transfer Under Guard due to change the length of bolts", releaseDate: "2021/04/20", href: "/MSBv2/SATSU/MSB-21E22_23-001.pdf" }];
sieid_sblist_map['M127200460123300ENG'] = [{ sbRecFile: "MSB-21E27-001.pdf", sbTitle: "Add the NOTE of procedure of Gear Oil Change about Differential Carrier assembly", releaseDate: "2021/04/26", href: "/MSBv2/SATSU/MSB-21E27-001.pdf" }];
sieid_sblist_map['M12720046A000300ENG'] = [{ sbRecFile: "MSB-21E27-001.pdf", sbTitle: "Add the NOTE of procedure of Gear Oil Change about Differential Carrier assembly", releaseDate: "2021/04/26", href: "/MSBv2/SATSU/MSB-21E27-001.pdf" }];
sieid_sblist_map['M12720046A001100ENG'] = [{ sbRecFile: "MSB-21E27-001.pdf", sbTitle: "Add the NOTE of procedure of Gear Oil Change about Differential Carrier assembly", releaseDate: "2021/04/26", href: "/MSBv2/SATSU/MSB-21E27-001.pdf" }];
sieid_sblist_map['M155100030203500ENG'] = [{ sbRecFile: "MSB-21E55-001.pdf", sbTitle: "Change of the Inspection Procedure about Heater Water Valve", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E55-001.pdf" }];
sieid_sblist_map['M155100630113700ENG'] = [{ sbRecFile: "MSB-21E55-001.pdf", sbTitle: "Change of the Inspection Procedure about Heater Water Valve", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E55-001.pdf" }];
sieid_sblist_map['M15510097A000100ENG'] = [{ sbRecFile: "MSB-21E55-001.pdf", sbTitle: "Change of the Inspection Procedure about Heater Water Valve", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E55-001.pdf" }];
sieid_sblist_map['M15440048A004200ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15440132A001700ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15440209A002300ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15440129A001700ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15440223A000100ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15483002A001100ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15483037A000500ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M15483003A001300ENG'] = [{ sbRecFile: "MSB-21E54-003.pdf", sbTitle: "Add the description of “Smartphone Link Display Audio without CAN Communication Function” due to added the type of Smartphone Link Display Audio", releaseDate: "2021/05/28", href: "/MSBv2/SATSU/MSB-21E54-003.pdf" }];
sieid_sblist_map['M40300050A000900ENG'] = [{ sbRecFile: "MSB-21E3-501.pdf", sbTitle: "Correction of the description of Maintenance points about FRONT PILLAR and FENDER SHIELD", releaseDate: "2021/06/04", href: "/MSBv2/SATSU/MSB-21E3-501.pdf" }];
sieid_sblist_map['M40300160A000100ENG'] = [{ sbRecFile: "MSB-21E3-501.pdf", sbTitle: "Correction of the description of Maintenance points about FRONT PILLAR and FENDER SHIELD", releaseDate: "2021/06/04", href: "/MSBv2/SATSU/MSB-21E3-501.pdf" }];
sieid_sblist_map['M40300050A001900ENG'] = [{ sbRecFile: "MSB-21E3-501.pdf", sbTitle: "Correction of the description of Maintenance points about FRONT PILLAR and FENDER SHIELD", releaseDate: "2021/06/04", href: "/MSBv2/SATSU/MSB-21E3-501.pdf" }];
sieid_sblist_map['M11311555A001600ENG'] = [{ sbRecFile: "MSB-21E13-002.pdf", sbTitle: "Deletion of the description about Diagnosis Trouble Code P170E", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21E13-002.pdf" }];
sieid_sblist_map['M11311510A002700ENG'] = [{ sbRecFile: "MSB-21E13-002.pdf", sbTitle: "Deletion of the description about Diagnosis Trouble Code P170E", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21E13-002.pdf" }];
sieid_sblist_map['M133200860122700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320011A000500ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200120024700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200140018800ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134101100146100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134101630023703ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320011A000600ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410110A001300ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133201320018100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200110177100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200120040700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134101910002700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410025A000400ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134100260024601ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410025A000500ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200080018300ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320011A000700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200120057100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134100080016900ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134100250089601ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134100260028000ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320132A000100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320011A000400ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320012A000100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410191A000100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410026A000100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13320011A002100ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410025A001500ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M13410025A000900ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200860119700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200430050000ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200460033000ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200470006900ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200490005200ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M133200160231500ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134100100042300ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M134101550022700ENG'] = [{ sbRecFile: "MSB-21EX33_34-001.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure about Front and Rear Suspension", releaseDate: "2021/06/14", href: "/MSBv2/SATSU/MSB-21EX33_34-001.pdf" }];
sieid_sblist_map['M10010009A007100ENG'] = [{ sbRecFile: "MSB-21EX33-501.pdf", sbTitle: "Correction of the description about Ground clearance", releaseDate: "2021/06/15", href: "/MSBv2/SATSU/MSB-21EX33-501.pdf" }];
sieid_sblist_map['M11330037A000200ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330092A000500ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330037A000300ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330092A000900ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330092A001000ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330092A001400ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11330092A001500ENG'] = [{ sbRecFile: "MSB-21E13-003.pdf", sbTitle: "Add the description of Forcible DPF regeneration as the procedure after Engine ECU replacement for the vehicles equipped with 4N1, 4M4 series Engine", releaseDate: "2021/06/17", href: "/MSBv2/SATSU/MSB-21E13-003.pdf" }];
sieid_sblist_map['M11311561A002900ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210006A001200ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210060A000700ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210129A000400ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210025A000400ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210026A000100ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M15402019A007000ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210006A000800ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M14210129A000300ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M142100250148500ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M142100260009200ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M15402019A003000ENG'] = [{ sbRecFile: "MSB-21E13_42_54-501.pdf", sbTitle: "Correction of the description of Service Procedure about Fuel Filler Lid", releaseDate: "2021/07/05", href: "/MSBv2/SATSU/MSB-21E13_42_54-501.pdf" }];
sieid_sblist_map['M111303290072200ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M111303290074400ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M114100240374200ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M111303290087401ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M114100240355900ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M111303290081800ENG'] = [{ sbRecFile: "MSB-21E11_14-001.pdf", sbTitle: "Change of the description of Service Point for Installation Procedure about Thermostat due to abolished the Jiggle-Valve of Thermostat", releaseDate: "2021/07/06", href: "/MSBv2/SATSU/MSB-21E11_14-001.pdf" }];
sieid_sblist_map['M11310050A004800ENG'] = [{ sbRecFile: "MSB-21E16-001.pdf", sbTitle: "Change the specification of Spark Plug for the 22MY vehicles for RUSSIA equipped with 4B11 engine", releaseDate: "2021/07/21", href: "/MSBv2/SATSU/MSB-21E16-001.pdf" }];
sieid_sblist_map['M15210057A002600ENG'] = [{ sbRecFile: "MSB-21E52-003.pdf", sbTitle: "Change the quantity of fixing Bolts of Rear Console ASSY", releaseDate: "2021/08/18", href: "/MSBv2/SATSU/MSB-21E52-003.pdf" }];
sieid_sblist_map['M15210057A003500ENG'] = [{ sbRecFile: "MSB-21E52-003.pdf", sbTitle: "Change the quantity of fixing Bolts of Rear Console ASSY", releaseDate: "2021/08/18", href: "/MSBv2/SATSU/MSB-21E52-003.pdf" }];
sieid_sblist_map['M154030420040600ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M154030430052200ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M154030270070600ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M15403042A000100ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M15403043A000200ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M15403027A000200ENG'] = [{ sbRecFile: "MSB-21E54-005.pdf", sbTitle: "Addition of the description of “CAUTION” of Headlamp Automatic Levelling System", releaseDate: "2021/09/09", href: "/MSBv2/SATSU/MSB-21E54-005.pdf" }];
sieid_sblist_map['M15402002A005000ENG'] = [{ sbRecFile: "MSB-21E54-006.pdf", sbTitle: "Addition of the description of the tolerances of Standard Value about the Height of Fuel Gauge Unit Float", releaseDate: "2021/10/11", href: "/MSBv2/SATSU/MSB-21E54-006.pdf" }];
sieid_sblist_map['M15402016A002300ENG'] = [{ sbRecFile: "MSB-21E54-006.pdf", sbTitle: "Addition of the description of the tolerances of Standard Value about the Height of Fuel Gauge Unit Float", releaseDate: "2021/10/11", href: "/MSBv2/SATSU/MSB-21E54-006.pdf" }];
sieid_sblist_map['M11793052A000400ENG'] = [{ sbRecFile: "MSB-21E17-001.pdf", sbTitle: "Addition of the Removal and Installation Procedure of the NOx Sensor about No2 Exhaust Muffler depending on the specification change of NOx Sensor", releaseDate: "2021/10/20", href: "/MSBv2/SATSU/MSB-21E17-001.pdf" }];
sieid_sblist_map['M11793013A000800ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" }];
sieid_sblist_map['M11793016A000600ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" }];
sieid_sblist_map['M11793130A000600ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" }];
sieid_sblist_map['M11793134A000800ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" }];
sieid_sblist_map['M11793171A000800ENG'] = [{ sbRecFile: "MSB-21E17-002.pdf", sbTitle: "Change the Troubleshooting Procedure of UERA SCR for the vehicles equipped with 4N14 engine", releaseDate: "2021/11/11", href: "/MSBv2/SATSU/MSB-21E17-002.pdf" }];
sieid_sblist_map['M111302530046100ENG'] = [{ sbRecFile: "MSB-21E11-501.pdf", sbTitle: "Correction of the description of Service Procedure about Solenoid Valve and Vacuum Hose", releaseDate: "2021/12/06", href: "/MSBv2/SATSU/MSB-21E11-501.pdf" }];
sieid_sblist_map['M11130253A000200ENG'] = [{ sbRecFile: "MSB-21E11-501.pdf", sbTitle: "Correction of the description of Service Procedure about Solenoid Valve and Vacuum Hose", releaseDate: "2021/12/06", href: "/MSBv2/SATSU/MSB-21E11-501.pdf" }];
sieid_sblist_map['M40400010A000200ENG'] = [{ sbRecFile: "MSB-21E4-002.pdf", sbTitle: "Addition the procedure to apply the ANTICORROSION PRIMER to ANTICORROSION PRIMER LOCATIONS", releaseDate: "2021/12/07", href: "/MSBv2/SATSU/MSB-21E4-002.pdf" }];
sieid_sblist_map['M151100210162100ENG'] = [{ sbRecFile: "MSB-21E51-003A.pdf", sbTitle: "Change of the Procedure of Disassembly and Reassembly about REAR BUMPER", releaseDate: "2022/01/07", href: "/MSBv2/SATSU/MSB-21E51-003A.pdf" }];
sieid_sblist_map['M151100210160900ENG'] = [{ sbRecFile: "MSB-21E51-003A.pdf", sbTitle: "Change of the Procedure of Disassembly and Reassembly about REAR BUMPER", releaseDate: "2022/01/07", href: "/MSBv2/SATSU/MSB-21E51-003A.pdf" }];
sieid_sblist_map['M142300310250801ENG'] = [{ sbRecFile: "MSB-22E42-501.pdf", sbTitle: "Correction and addition of the description of Removal and Installation procedure about Window Glass Runchannel and Door Opening Weatherstrip", releaseDate: "2022/01/12", href: "/MSBv2/SATSU/MSB-22E42-501.pdf" }];
sieid_sblist_map['M14230031A000200ENG'] = [{ sbRecFile: "MSB-22E42-501.pdf", sbTitle: "Correction and addition of the description of Removal and Installation procedure about Window Glass Runchannel and Door Opening Weatherstrip", releaseDate: "2022/01/12", href: "/MSBv2/SATSU/MSB-22E42-501.pdf" }];
sieid_sblist_map['M14230031A000900ENG'] = [{ sbRecFile: "MSB-22E42-501.pdf", sbTitle: "Correction and addition of the description of Removal and Installation procedure about Window Glass Runchannel and Door Opening Weatherstrip", releaseDate: "2022/01/12", href: "/MSBv2/SATSU/MSB-22E42-501.pdf" }];
sieid_sblist_map['M14230031A004300ENG'] = [{ sbRecFile: "MSB-22E42-501.pdf", sbTitle: "Correction and addition of the description of Removal and Installation procedure about Window Glass Runchannel and Door Opening Weatherstrip", releaseDate: "2022/01/12", href: "/MSBv2/SATSU/MSB-22E42-501.pdf" }];
sieid_sblist_map['M14230031A003000ENG'] = [{ sbRecFile: "MSB-22E42-501.pdf", sbTitle: "Correction and addition of the description of Removal and Installation procedure about Window Glass Runchannel and Door Opening Weatherstrip", releaseDate: "2022/01/12", href: "/MSBv2/SATSU/MSB-22E42-501.pdf" }];
sieid_sblist_map['M123120040084400ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123120060069900ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123120640047700ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123121770022300ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123121780015600ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123122000021300ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123122010021000ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123122020025100ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123122030023600ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M123210030062700ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M12312004A003700ENG'] = [{ sbRecFile: "MSB-22E23-002A.pdf", sbTitle: "Change and addition of the Maintenance Procedure to improve the maintenance of CVT", releaseDate: "2022/02/09", href: "/MSBv2/SATSU/MSB-22E23-002A.pdf" }];
sieid_sblist_map['M142960060037101ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M14296006A000300ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M14296006A000700ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M142800590003700ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M142960060037102ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M14240018A002000ENG'] = [{ sbRecFile: "MSB-22E42-001.pdf", sbTitle: "Addition of diagnostic procedure for Keyless Operation System (KOS) diagnosis code No. B1A08, B1A09, B1A0A, B1A0B", releaseDate: "2022/02/07", href: "/MSBv2/SATSU/MSB-22E42-001.pdf" }];
sieid_sblist_map['M116300030202300ENG'] = [{ sbRecFile: "MSB-22E16-501.pdf", sbTitle: "Correction of the description of Limit Value of SPARK PLUG", releaseDate: "2022/02/18", href: "/MSBv2/SATSU/MSB-22E16-501.pdf" }];
sieid_sblist_map['M11630043A002300ENG'] = [{ sbRecFile: "MSB-22E16-501.pdf", sbTitle: "Correction of the description of Limit Value of SPARK PLUG", releaseDate: "2022/02/18", href: "/MSBv2/SATSU/MSB-22E16-501.pdf" }];
sieid_sblist_map['M116300430332900ENG'] = [{ sbRecFile: "MSB-22E16-501.pdf", sbTitle: "Correction of the description of Limit Value of SPARK PLUG", releaseDate: "2022/02/18", href: "/MSBv2/SATSU/MSB-22E16-501.pdf" }];
sieid_sblist_map['M11630043A001100ENG'] = [{ sbRecFile: "MSB-22E16-501.pdf", sbTitle: "Correction of the description of Limit Value of SPARK PLUG", releaseDate: "2022/02/18", href: "/MSBv2/SATSU/MSB-22E16-501.pdf" }];
sieid_sblist_map['M135100030335700ENG'] = [{ sbRecFile: "MSB-22E35-501.pdf", sbTitle: "Addition and correction of the description about Front Brake Disc", releaseDate: "2022/02/23", href: "/MSBv2/SATSU/MSB-22E35-501.pdf" }];
sieid_sblist_map['M135100030336800ENG'] = [{ sbRecFile: "MSB-22E35-501.pdf", sbTitle: "Addition and correction of the description about Front Brake Disc", releaseDate: "2022/02/23", href: "/MSBv2/SATSU/MSB-22E35-501.pdf" }];
sieid_sblist_map['M135101860074100ENG'] = [{ sbRecFile: "MSB-22E35-501.pdf", sbTitle: "Addition and correction of the description about Front Brake Disc", releaseDate: "2022/02/23", href: "/MSBv2/SATSU/MSB-22E35-501.pdf" }];
sieid_sblist_map['M123120060098900ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312065A000300ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123122240002401ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123122050007000ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123210030061600ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123120060115300ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123120650046300ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123122240001301ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123210030054200ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123120060099000ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123120650039900ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123122240004600ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123210030063801ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M123120060099001ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312006A000500ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312065A000100ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312224A000100ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312205A000100ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12321003A000100ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M12312006A002200ENG'] = [{ sbRecFile: "MSB-22E23-003.pdf", sbTitle: "Addition of the Maintenance Procedure about CVT BELT CHECK for the vehicles equipped with CVT type F1CJC and W1CJC", releaseDate: "2022/02/24", href: "/MSBv2/SATSU/MSB-22E23-003.pdf" }];
sieid_sblist_map['M15492603A000100ENG'] = [{ sbRecFile: "MSB-22E54-501.pdf", sbTitle: "Correction of the Diagnostic Procedure about DTC:P10C1 for PHEV-ECU", releaseDate: "2022/03/22", href: "/MSBv2/SATSU/MSB-22E54-501.pdf" }];
sieid_sblist_map['M151102570203600ENG'] = [{ sbRecFile: "MSB-22E51-002.pdf", sbTitle: "Change the Troubleshooting Procedure of Windshield Wiper", releaseDate: "2022/03/30", href: "/MSBv2/SATSU/MSB-22E51-002.pdf" }];
sieid_sblist_map['M151102570203601ENG'] = [{ sbRecFile: "MSB-22E51-002.pdf", sbTitle: "Change the Troubleshooting Procedure of Windshield Wiper", releaseDate: "2022/03/30", href: "/MSBv2/SATSU/MSB-22E51-002.pdf" }];
sieid_sblist_map['M15110257A000500ENG'] = [{ sbRecFile: "MSB-22E51-002.pdf", sbTitle: "Change the Troubleshooting Procedure of Windshield Wiper", releaseDate: "2022/03/30", href: "/MSBv2/SATSU/MSB-22E51-002.pdf" }];
sieid_sblist_map['M15110257A001400ENG'] = [{ sbRecFile: "MSB-22E51-002.pdf", sbTitle: "Change the Troubleshooting Procedure of Windshield Wiper", releaseDate: "2022/03/30", href: "/MSBv2/SATSU/MSB-22E51-002.pdf" }];
sieid_sblist_map['M135101500091101ENG'] = [{ sbRecFile: "MSB-22E35-001.pdf", sbTitle: "Change of the Inspection Procedure about STOP LAMP SWITCH CHECK due to change the Stop Lamp Switch", releaseDate: "2022/04/26", href: "/MSBv2/SATSU/MSB-22E35-001.pdf" }];
sieid_sblist_map['M135100890072900ENG'] = [{ sbRecFile: "MSB-22E35-001.pdf", sbTitle: "Change of the Inspection Procedure about STOP LAMP SWITCH CHECK due to change the Stop Lamp Switch", releaseDate: "2022/04/26", href: "/MSBv2/SATSU/MSB-22E35-001.pdf" }];
sieid_sblist_map['M135100890124900ENG'] = [{ sbRecFile: "MSB-22E35-001.pdf", sbTitle: "Change of the Inspection Procedure about STOP LAMP SWITCH CHECK due to change the Stop Lamp Switch", releaseDate: "2022/04/26", href: "/MSBv2/SATSU/MSB-22E35-001.pdf" }];
sieid_sblist_map['M13510089A003800ENG'] = [{ sbRecFile: "MSB-22E35-001.pdf", sbTitle: "Change of the Inspection Procedure about STOP LAMP SWITCH CHECK due to change the Stop Lamp Switch", releaseDate: "2022/04/26", href: "/MSBv2/SATSU/MSB-22E35-001.pdf" }];
sieid_sblist_map['M40600020A011400ENG'] = [{ sbRecFile: "MSB-20EXL6-501A.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2023/03/30", href: "/MSBv2/SATSU/MSB-20EXL6-501A.pdf" },{ sbRecFile: "MSB-22E6-001.pdf", sbTitle: "Addition of the description about BODY COLOUR CHARTS (WHITE)", releaseDate: "2022/06/07", href: "/MSBv2/SATSU/MSB-22E6-001.pdf" }];
sieid_sblist_map['M40600020A014900ENG'] = [{ sbRecFile: "MSB-20EXL6-501A.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2023/03/30", href: "/MSBv2/SATSU/MSB-20EXL6-501A.pdf" },{ sbRecFile: "MSB-22E6-001.pdf", sbTitle: "Addition of the description about BODY COLOUR CHARTS (WHITE)", releaseDate: "2022/06/07", href: "/MSBv2/SATSU/MSB-22E6-001.pdf" }];
sieid_sblist_map['M132100660004200ENG'] = [{ sbRecFile: "MSB-22E32-001.pdf", sbTitle: "Add the description about fixing torque of the Bolts for Engine Mounting", releaseDate: "2022/06/23", href: "/MSBv2/SATSU/MSB-22E32-001.pdf" }];
sieid_sblist_map['M122200880041300ENG'] = [{ sbRecFile: "MSB-22E22_23-001.pdf", sbTitle: "Addition of the Service Point of Disassembly and Reassembly when replacing the Transfer Actuator for Transmission type V6M5A, V5AWF and V8AWG", releaseDate: "2022/06/29", href: "/MSBv2/SATSU/MSB-22E22_23-001.pdf" }];
sieid_sblist_map['M135503040011200ENG'] = [{ sbRecFile: "MSB-22E35-502.pdf", sbTitle: "Correction of Diagnosis Procedure about Wheel Speed Sensor Circuit", releaseDate: "2022/07/20", href: "/MSBv2/SATSU/MSB-22E35-502.pdf" }];
sieid_sblist_map['M13550304A000400ENG'] = [{ sbRecFile: "MSB-22E35-502.pdf", sbTitle: "Correction of Diagnosis Procedure about Wheel Speed Sensor Circuit", releaseDate: "2022/07/20", href: "/MSBv2/SATSU/MSB-22E35-502.pdf" }];
sieid_sblist_map['M13550304A000700ENG'] = [{ sbRecFile: "MSB-22E35-502.pdf", sbTitle: "Correction of Diagnosis Procedure about Wheel Speed Sensor Circuit", releaseDate: "2022/07/20", href: "/MSBv2/SATSU/MSB-22E35-502.pdf" }];
sieid_sblist_map['M13550304A002000ENG'] = [{ sbRecFile: "MSB-22E35-502.pdf", sbTitle: "Correction of Diagnosis Procedure about Wheel Speed Sensor Circuit", releaseDate: "2022/07/20", href: "/MSBv2/SATSU/MSB-22E35-502.pdf" }];
sieid_sblist_map['M13550304A000800ENG'] = [{ sbRecFile: "MSB-22E35-502.pdf", sbTitle: "Correction of Diagnosis Procedure about Wheel Speed Sensor Circuit", releaseDate: "2022/07/20", href: "/MSBv2/SATSU/MSB-22E35-502.pdf" }];
sieid_sblist_map['M12312180A000300ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312223A000400ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M123121800006700ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312223A011300ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312223A000500ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M123121800016400ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M123122230007200ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312180A000100ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312223A000100ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312223A000300ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M12312180A001200ENG'] = [{ sbRecFile: "MSB-22E23_90-501A.pdf", sbTitle: "Correction of Diagnosis Procedure of DTC No. P0843, P0848 and Circuit Diagrams about CVT-ECU (F1CJC, W1CJC)", releaseDate: "2022/07/27", href: "/MSBv2/SATSU/MSB-22E23_90-501A.pdf" }];
sieid_sblist_map['M142750530020800ENG'] = [{ sbRecFile: "MSB-22E42-502.pdf", sbTitle: "Correction of reference page about Inspection Procedure of Troubleshooting of Wireless Control Module", releaseDate: "2022/07/29", href: "/MSBv2/SATSU/MSB-22E42-502.pdf" }];
sieid_sblist_map['M11720076A001900ENG'] = [{ sbRecFile: "MSB-22E17_37_54-001.pdf", sbTitle: "Add the service procedure about Steering Wheel Switch Lamp Lens", releaseDate: "2022/08/08", href: "/MSBv2/SATSU/MSB-22E17_37_54-001.pdf" }];
sieid_sblist_map['M15440156A000900ENG'] = [{ sbRecFile: "MSB-22E17_37_54-001.pdf", sbTitle: "Add the service procedure about Steering Wheel Switch Lamp Lens", releaseDate: "2022/08/08", href: "/MSBv2/SATSU/MSB-22E17_37_54-001.pdf" }];
sieid_sblist_map['M21320020A000500ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M21320281A000100ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M21710002A000300ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M11730051A000500ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M21320020A001600ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M21320281A000300ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M21710002A000900ENG'] = [{ sbRecFile: "MSB-22E13_17-501A.pdf", sbTitle: "Correction of the description about Evaporative Emission Control System and Wiring Diagram of Fuel Tank Solenoid Valve", releaseDate: "2022/08/23", href: "/MSBv2/SATSU/MSB-22E13_17-501A.pdf" }];
sieid_sblist_map['M111100130009600ENG'] = [{ sbRecFile: "MSB-22E11-001.pdf", sbTitle: "Change the description of CAUTION about the procedure of Tension Check and Adjustment for Drive Belts", releaseDate: "2022/09/02", href: "/MSBv2/SATSU/MSB-22E11-001.pdf" }];
sieid_sblist_map['M123114280008300ENG'] = [{ sbRecFile: "MSB-22E23-501.pdf", sbTitle: "Correction of the A/T Initial Learning Procedure for the vehicle equipped with Automatic Transmission Type R6AWH, V6AWH, R8AWG, V8AWG", releaseDate: "2022/08/30", href: "/MSBv2/SATSU/MSB-22E23-501.pdf" }];
sieid_sblist_map['M10010003A019500ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M10010056A013300ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M126100010210500ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M126100030225100ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M126100150022900ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M126200450038400ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M180100031205400ENG'] = [{ sbRecFile: "MSB-22E00_26_80-001A.pdf", sbTitle: "New Information of 23MY L200", releaseDate: "2022/08/05", href: "/MSBv2/SATSU/MSB-22E00_26_80-001A.pdf" }];
sieid_sblist_map['M11330003A000500ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M11335357A000100ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M11335358A000100ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M11336071A000400ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M11330154A000100ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M180100260134700ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M190100081520400ENG'] = [{ sbRecFile: "MSB-22E13_80_90-501.pdf", sbTitle: "Correction of the description of Oil Pressure and Temperature Sensor for 4N14 engine", releaseDate: "2022/09/12", href: "/MSBv2/SATSU/MSB-22E13_80_90-501.pdf" }];
sieid_sblist_map['M125100030076000ENG'] = [{ sbRecFile: "MSB-22E25-001.pdf", sbTitle: "Add the service procedure about Propeller Shaft front and rear due to setting the component parts as spare parts", releaseDate: "2022/09/19", href: "/MSBv2/SATSU/MSB-22E25-001.pdf" }];
sieid_sblist_map['M125100040082000ENG'] = [{ sbRecFile: "MSB-22E25-001.pdf", sbTitle: "Add the service procedure about Propeller Shaft front and rear due to setting the component parts as spare parts", releaseDate: "2022/09/19", href: "/MSBv2/SATSU/MSB-22E25-001.pdf" }];
sieid_sblist_map['M125100110091800ENG'] = [{ sbRecFile: "MSB-22E25-001.pdf", sbTitle: "Add the service procedure about Propeller Shaft front and rear due to setting the component parts as spare parts", releaseDate: "2022/09/19", href: "/MSBv2/SATSU/MSB-22E25-001.pdf" }];
sieid_sblist_map['M113115200641001ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M113115200657300ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M113115200661400ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M11311520A001000ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M11311520A002100ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M11311520A005700ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M11311520A006300ENG'] = [{ sbRecFile: "MSB-22E33-501.pdf", sbTitle: "Correction of the service procedure about Lower Arm Bushing Replacement ", releaseDate: "2022/09/25", href: "/MSBv2/SATSU/MSB-22E33-501.pdf" }];
sieid_sblist_map['M10010294A003600ENG'] = [{ sbRecFile: "MSB-22E00-002A.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON-VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2023/07/14", href: "/MSBv2/SATSU/MSB-22E00-002A.pdf" },{ sbRecFile: "MSB-22E00-002.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON-VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2022/10/05", href: "/MSBv2/SATSU/MSB-22E00-002.pdf" }];
sieid_sblist_map['M15473004A000200ENG'] = [{ sbRecFile: "MSB-22E54-001.pdf", sbTitle: "Change the Replacement Procedure of Inlet Packing due to change the shape of spare parts", releaseDate: "2022/10/14", href: "/MSBv2/SATSU/MSB-22E54-001.pdf" }];
sieid_sblist_map['M21700020A001100ENG'] = [{ sbRecFile: "MSB-22E17-501.pdf", sbTitle: "Correction of the description of Auto stop prohibition condition about AUTO STOP and GO SYSTEM", releaseDate: "2022/10/24", href: "/MSBv2/SATSU/MSB-22E17-501.pdf" }];
sieid_sblist_map['M142100970114500ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M151100160378200ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M151100160379300ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M142100970117800ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M14210097A004600ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M15110016A005000ENG'] = [{ sbRecFile: "MSB-22E42_51-001A.pdf", sbTitle: "Change of Removal and Installation procedure about Splash Shield and Disassembly and Reassembly procedure about Front Bumper assembly", releaseDate: "2022/11/02", href: "/MSBv2/SATSU/MSB-22E42_51-001A.pdf" }];
sieid_sblist_map['M18010019A000700ENG'] = [{ sbRecFile: "MSB-22E80_90-501.pdf", sbTitle: "Correction of the “number of connector pin” and “connector symbol” about Electric Tailgate", releaseDate: "2022/11/21", href: "/MSBv2/SATSU/MSB-22E80_90-501.pdf" }];
sieid_sblist_map['M19010238A001000ENG'] = [{ sbRecFile: "MSB-22E80_90-501.pdf", sbTitle: "Correction of the “number of connector pin” and “connector symbol” about Electric Tailgate", releaseDate: "2022/11/21", href: "/MSBv2/SATSU/MSB-22E80_90-501.pdf" }];
sieid_sblist_map['M18010019A003900ENG'] = [{ sbRecFile: "MSB-22E80_90-501.pdf", sbTitle: "Correction of the “number of connector pin” and “connector symbol” about Electric Tailgate", releaseDate: "2022/11/21", href: "/MSBv2/SATSU/MSB-22E80_90-501.pdf" }];
sieid_sblist_map['M123310040013300ENG'] = [{ sbRecFile: "MSB-22E23-004.pdf", sbTitle: "Addition of the length of fixing Bolt of Temperature Sensor Clamp about Automatic Transmission R6AWH and V6AWH", releaseDate: "2022/11/28", href: "/MSBv2/SATSU/MSB-22E23-004.pdf" }];
sieid_sblist_map['M123311540006500ENG'] = [{ sbRecFile: "MSB-22E23-004.pdf", sbTitle: "Addition of the length of fixing Bolt of Temperature Sensor Clamp about Automatic Transmission R6AWH and V6AWH", releaseDate: "2022/11/28", href: "/MSBv2/SATSU/MSB-22E23-004.pdf" }];
sieid_sblist_map['M123310040012200ENG'] = [{ sbRecFile: "MSB-22E23-004.pdf", sbTitle: "Addition of the length of fixing Bolt of Temperature Sensor Clamp about Automatic Transmission R6AWH and V6AWH", releaseDate: "2022/11/28", href: "/MSBv2/SATSU/MSB-22E23-004.pdf" }];
sieid_sblist_map['M123311540005400ENG'] = [{ sbRecFile: "MSB-22E23-004.pdf", sbTitle: "Addition of the length of fixing Bolt of Temperature Sensor Clamp about Automatic Transmission R6AWH and V6AWH", releaseDate: "2022/11/28", href: "/MSBv2/SATSU/MSB-22E23-004.pdf" }];
sieid_sblist_map['M152101130118501ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M154150100059600ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M155202370002000ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M152101130123700ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M152101130118502ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15210113A000500ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15415010A000100ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15520237A000100ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15210113A001100ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15210113A004300ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15210113A003600ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15520237A000500ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M15520237A001500ENG'] = [{ sbRecFile: "MSB-22E55-001B.pdf", sbTitle: "Change the fixing torque of the Bolts for Air-Con Control Unit and Hazard Warning Lamp Switch", releaseDate: "2023/06/02", href: "/MSBv2/SATSU/MSB-22E55-001B.pdf" }];
sieid_sblist_map['M155400500344000ENG'] = [{ sbRecFile: "MSB-22E55-501.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure and Trouble Symptom Chart about Air Conditioner", releaseDate: "2022/12/13", href: "/MSBv2/SATSU/MSB-22E55-501.pdf" }];
sieid_sblist_map['M155401590173800ENG'] = [{ sbRecFile: "MSB-22E55-501.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure and Trouble Symptom Chart about Air Conditioner", releaseDate: "2022/12/13", href: "/MSBv2/SATSU/MSB-22E55-501.pdf" }];
sieid_sblist_map['M155010720003701ENG'] = [{ sbRecFile: "MSB-22E55-501.pdf", sbTitle: "Correction and addition of the description of Inspection Procedure and Trouble Symptom Chart about Air Conditioner", releaseDate: "2022/12/13", href: "/MSBv2/SATSU/MSB-22E55-501.pdf" }];
sieid_sblist_map['M154940780003600ENG'] = [{ sbRecFile: "MSB-23E54-501.pdf", sbTitle: "Correction the description of Diagnosis Procedure about Electric Motor Unit and Traction Battery", releaseDate: "2023/03/08", href: "/MSBv2/SATSU/MSB-23E54-501.pdf" }];
sieid_sblist_map['M154940790001101ENG'] = [{ sbRecFile: "MSB-23E54-501.pdf", sbTitle: "Correction the description of Diagnosis Procedure about Electric Motor Unit and Traction Battery", releaseDate: "2023/03/08", href: "/MSBv2/SATSU/MSB-23E54-501.pdf" }];
sieid_sblist_map['M151102470081100ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M15110247A000600ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M15110247A003300ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M15110247A003900ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M15110247A004500ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M15110247A002200ENG'] = [{ sbRecFile: "MSB-19E51-001A.pdf", sbTitle: "Addition of the Service Point of Front and Rear Wheel Arch Moulding Removal", releaseDate: "2023/05/08", href: "/MSBv2/SATSU/MSB-19E51-001A.pdf" }];
sieid_sblist_map['M40600020A016800ENG'] = [{ sbRecFile: "MSB-20EXL6-501A.pdf", sbTitle: "Correction of the Body Colour Charts", releaseDate: "2023/03/30", href: "/MSBv2/SATSU/MSB-20EXL6-501A.pdf" }];
sieid_sblist_map['M10010155A001000ENG'] = [{ sbRecFile: "MSB-23E00-001.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON-VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2023/05/16", href: "/MSBv2/SATSU/MSB-23E00-001.pdf" }];
sieid_sblist_map['M10010294A000400ENG'] = [{ sbRecFile: "MSB-23E00-001.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON-VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2023/05/16", href: "/MSBv2/SATSU/MSB-23E00-001.pdf" }];
sieid_sblist_map['M11793041A000700ENG'] = [{ sbRecFile: "MSB-23E17-001.pdf", sbTitle: "Changed of maintenance procedures when replacing DCU of UERA SCR SYSTEM", releaseDate: "2023/05/09", href: "/MSBv2/SATSU/MSB-23E17-001.pdf" }];
sieid_sblist_map['M114100150498700ENG'] = [{ sbRecFile: "MSB-23E14-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Radiator Cooling Fan Shroud", releaseDate: "2023/06/19", href: "/MSBv2/SATSU/MSB-23E14-001.pdf" }];
sieid_sblist_map['M11410015A000400ENG'] = [{ sbRecFile: "MSB-23E14-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Radiator Cooling Fan Shroud", releaseDate: "2023/06/19", href: "/MSBv2/SATSU/MSB-23E14-001.pdf" }];
sieid_sblist_map['M11410015A000500ENG'] = [{ sbRecFile: "MSB-23E14-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Radiator Cooling Fan Shroud", releaseDate: "2023/06/19", href: "/MSBv2/SATSU/MSB-23E14-001.pdf" }];
sieid_sblist_map['M11410015A002700ENG'] = [{ sbRecFile: "MSB-23E14-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Radiator Cooling Fan Shroud", releaseDate: "2023/06/19", href: "/MSBv2/SATSU/MSB-23E14-001.pdf" }];
sieid_sblist_map['M11410015A002900ENG'] = [{ sbRecFile: "MSB-23E14-001.pdf", sbTitle: "Change the fixing torque of the Bolts for Radiator Cooling Fan Shroud", releaseDate: "2023/06/19", href: "/MSBv2/SATSU/MSB-23E14-001.pdf" }];
sieid_sblist_map['M12312001A007300ENG'] = [{ sbRecFile: "MSB-23E42-002.pdf", sbTitle: "Change the fixing method of the Front Splash Shield", releaseDate: "2023/07/14", href: "/MSBv2/SATSU/MSB-23E42-002.pdf" }];
sieid_sblist_map['M11410076A002000ENG'] = [{ sbRecFile: "MSB-23E42-002.pdf", sbTitle: "Change the fixing method of the Front Splash Shield", releaseDate: "2023/07/14", href: "/MSBv2/SATSU/MSB-23E42-002.pdf" }];
sieid_sblist_map['M154940640007903ENG'] = [{ sbRecFile: "MSB-23E54-001.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON-VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2023/06/01", href: "/MSBv2/SATSU/MSB-23E54-001.pdf" }];
sieid_sblist_map['M15440209A000300ENG'] = [{ sbRecFile: "MSB-23E54-503.pdf", sbTitle: "Correction of description about DIAGNOSIS MODE ITEM of SMARTPHONE LINK DISPLAY AUDIO", releaseDate: "2023/08/07", href: "/MSBv2/SATSU/MSB-23E54-503.pdf" }];
sieid_sblist_map['M15440209A158500ENG'] = [{ sbRecFile: "MSB-23E54-503.pdf", sbTitle: "Correction of description about DIAGNOSIS MODE ITEM of SMARTPHONE LINK DISPLAY AUDIO", releaseDate: "2023/08/07", href: "/MSBv2/SATSU/MSB-23E54-503.pdf" }];
sieid_sblist_map['M15440209A158600ENG'] = [{ sbRecFile: "MSB-23E54-503.pdf", sbTitle: "Correction of description about DIAGNOSIS MODE ITEM of SMARTPHONE LINK DISPLAY AUDIO", releaseDate: "2023/08/07", href: "/MSBv2/SATSU/MSB-23E54-503.pdf" }];
sieid_sblist_map['M15440209A157800ENG'] = [{ sbRecFile: "MSB-23E54-503.pdf", sbTitle: "Correction of description about DIAGNOSIS MODE ITEM of SMARTPHONE LINK DISPLAY AUDIO", releaseDate: "2023/08/07", href: "/MSBv2/SATSU/MSB-23E54-503.pdf" }];
sieid_sblist_map['M152401650140600ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152401660146900ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152401670143300ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152401680141800ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152405090021400ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152405100021400ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152405110021100ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152405120021800ENG'] = [{ sbRecFile: "MSB-23E52-501.pdf", sbTitle: "Correction of the diagnosis procedure of troubleshooting about SRS-ECU", releaseDate: "2023/05/10", href: "/MSBv2/SATSU/MSB-23E52-501.pdf" }];
sieid_sblist_map['M152200150248500ENG'] = [{ sbRecFile: "MSB-23E52-003.pdf", sbTitle: "Addition of the description of Service Point of Disassembly and Reassembly about Seatback Heater and Seat Cushion Heater", releaseDate: "2023/09/29", href: "/MSBv2/SATSU/MSB-23E52-003.pdf" }];
sieid_sblist_map['M15220015A012400ENG'] = [{ sbRecFile: "MSB-23E52-003.pdf", sbTitle: "Addition of the description of Service Point of Disassembly and Reassembly about Seatback Heater and Seat Cushion Heater", releaseDate: "2023/09/29", href: "/MSBv2/SATSU/MSB-23E52-003.pdf" }];
sieid_sblist_map['M15220015A013900ENG'] = [{ sbRecFile: "MSB-23E52-003.pdf", sbTitle: "Addition of the description of Service Point of Disassembly and Reassembly about Seatback Heater and Seat Cushion Heater", releaseDate: "2023/09/29", href: "/MSBv2/SATSU/MSB-23E52-003.pdf" }];
sieid_sblist_map['M123115790002000ENG'] = [{ sbRecFile: "MSB-23E23-502.pdf", sbTitle: "Correction of the description of Diagnosis Pressure about DTC No.P0741, P0742", releaseDate: "2023/05/23", href: "/MSBv2/SATSU/MSB-23E23-502.pdf" }];
sieid_sblist_map['M123115790003100ENG'] = [{ sbRecFile: "MSB-23E23-502.pdf", sbTitle: "Correction of the description of Diagnosis Pressure about DTC No.P0741, P0742", releaseDate: "2023/05/23", href: "/MSBv2/SATSU/MSB-23E23-502.pdf" }];
sieid_sblist_map['M123110350043400ENG'] = [{ sbRecFile: "MSB-23E23-504.pdf", sbTitle: "Correction of the description of TORQUE CONVERTER STALL CHECK", releaseDate: "2023/08/29", href: "/MSBv2/SATSU/MSB-23E23-504.pdf" }];
sieid_sblist_map['M123110350044500ENG'] = [{ sbRecFile: "MSB-23E23-504.pdf", sbTitle: "Correction of the description of TORQUE CONVERTER STALL CHECK", releaseDate: "2023/08/29", href: "/MSBv2/SATSU/MSB-23E23-504.pdf" }];


sieid_sblist_map['M602010010310900ENG'] = [{ sbRecFile: "MSB-17X2-501.pdf", sbTitle: "Corrections of the errors in writing of the description about the Maintenance Schedule of the automatic transmission fluid", releaseDate: "2017/08/29", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-17X2-501.pdf" }];
sieid_sblist_map['M115100870449900ENG'] = [{ sbRecFile: "MSB-17X15-001.pdf", sbTitle: "Additional descriptions regarding the setting as service parts of Heat protector panel for Exhaust front pipe", releaseDate: "2017/10/20", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-17X15-001.pdf" }];
sieid_sblist_map['M111303700001400ENG'] = [{ sbRecFile: "MSB-18EXML11_13-501.pdf", sbTitle: "Correction of the oil application instruction for \"Seal ring\" of FUEL INJECTOR (HIGH PRESSURE)", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML11_13-501.pdf" }];
sieid_sblist_map['M113102790001201ENG'] = [{ sbRecFile: "MSB-18EXML11_13-501.pdf", sbTitle: "Correction of the oil application instruction for \"Seal ring\" of FUEL INJECTOR (HIGH PRESSURE)", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML11_13-501.pdf" }];
sieid_sblist_map['M151102500025701ENG'] = [{ sbRecFile: "MSB-18EXML51-002.pdf", sbTitle: "Correction of the removal and installation procedure about LICENSE PLATE GARNISH", releaseDate: "2018/05/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML51-002.pdf" }];
sieid_sblist_map['M151103190002200ENG'] = [{ sbRecFile: "MSB-18EXML51-002.pdf", sbTitle: "Correction of the removal and installation procedure about LICENSE PLATE GARNISH", releaseDate: "2018/05/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML51-002.pdf" }];
sieid_sblist_map['M151100190362001ENG'] = [{ sbRecFile: "MSB-18EXML51-501.pdf", sbTitle: "Correction of the illustration of the electric wave penetration areas", releaseDate: "2018/04/26", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML51-501.pdf" }];
sieid_sblist_map['M154010480020000ENG'] = [{ sbRecFile: "MSB-18EXML54-001.pdf", sbTitle: "Addition of the repair procedure of Headlamp Bracket", releaseDate: "2018/02/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-001.pdf" }];
sieid_sblist_map['M190102640245500ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290376400ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370023700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190032100ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290384900ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370028200ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370029300ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190041700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190102640246600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290381600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290382700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370026000ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190038700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190039800ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190102640247700ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190103290383800ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104370027100ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M190104190040600ENG'] = [{ sbRecFile: "MSB-18EXML90-501.pdf", sbTitle: "Correction of the CIRCUIT DIAGRAMS of STOP LAMP SWITCH", releaseDate: "2018/05/14", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML90-501.pdf" }];
sieid_sblist_map['M100100560475800ENG'] = [{ sbRecFile: "MSB-18X00-001.pdf", sbTitle: "Additional information about CODE CHART of VEHICLE IDENTIFICATION NUMBER (CHASSIS NUMBER)", releaseDate: "2018/02/05", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X00-001.pdf" }];
sieid_sblist_map['M100100560501800ENG'] = [{ sbRecFile: "MSB-18X00-001.pdf", sbTitle: "Additional information about CODE CHART of VEHICLE IDENTIFICATION NUMBER (CHASSIS NUMBER)", releaseDate: "2018/02/05", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X00-001.pdf" }];
sieid_sblist_map['M100100560494100ENG'] = [{ sbRecFile: "MSB-18X00-501.pdf", sbTitle: "Correction of the description of Vehicle identification for 18MY ECLIPSE CROSS / OUTLANDER CROSS", releaseDate: "2018/05/10", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X00-501.pdf" }];
sieid_sblist_map['M100100550377000ENG'] = [{ sbRecFile: "MSB-18X00-501.pdf", sbTitle: "Correction of the description of Vehicle identification for 18MY ECLIPSE CROSS / OUTLANDER CROSS", releaseDate: "2018/05/10", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X00-501.pdf" }];
sieid_sblist_map['M142100160271600ENG'] = [{ sbRecFile: "MSB-18X42-001.pdf", sbTitle: "Addition of the Protector Film for Hood", releaseDate: "2018/05/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X42-001.pdf" }];
sieid_sblist_map['M142100160290900ENG'] = [{ sbRecFile: "MSB-18X42-001.pdf", sbTitle: "Addition of the Protector Film for Hood", releaseDate: "2018/05/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X42-001.pdf" }];
sieid_sblist_map['M112100040366900ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M112100100439900ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M602060030249500ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M112100040367000ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M112100100440700ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M602060030248400ENG'] = [{ sbRecFile: "MSB-18XL12-501.pdf", sbTitle: "Correction of the Specifications of Engine Oil", releaseDate: "2018/03/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL12-501.pdf" }];
sieid_sblist_map['M136100090142800ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M136100130132200ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M152101770003600ENG'] = [{ sbRecFile: "MSB-18EXML36_52-001.pdf", sbTitle: "Addition of \"CAUTION\" for maintenance procedure about parking brake lever stroke check and adjustment", releaseDate: "2018/06/05", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML36_52-001.pdf" }];
sieid_sblist_map['M100101210038800ENG'] = [{ sbRecFile: "MSB-18X00-003.pdf", sbTitle: "Addition of PRECAUTIONS FOR INSTALLATION OF ON VEHICLE RADIO TRANSMISSION EQUIPMENT", releaseDate: "2018/06/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X00-003.pdf" }];
sieid_sblist_map['M100100091002100ENG'] = [{ sbRecFile: "MSB-18XL00-002.pdf", sbTitle: "Modification of 2018MY ECLIPSE CROSS / OUTLANDER CROSS", releaseDate: "2018/07/02", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-002.pdf" }];
sieid_sblist_map['M100100031042700ENG'] = [{ sbRecFile: "MSB-18XL00-002.pdf", sbTitle: "Modification of 2018MY ECLIPSE CROSS / OUTLANDER CROSS", releaseDate: "2018/07/02", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-002.pdf" }];
sieid_sblist_map['M100100091094600ENG'] = [{ sbRecFile: "MSB-18XL00-002.pdf", sbTitle: "Modification of 2018MY ECLIPSE CROSS / OUTLANDER CROSS", releaseDate: "2018/07/02", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-002.pdf" }];
sieid_sblist_map['M123121250088201ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M123121250089300ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M123121250090100ENG'] = [{ sbRecFile: "MSB-18EXML23-501.pdf", sbTitle: "Correction of Caution on Removal and Installation of CVT Fluid Cooler and Cooler Line", releaseDate: "2018/07/03", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML23-501.pdf" }];
sieid_sblist_map['M142100730095500ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M142100160276101ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M142100160283500ENG'] = [{ sbRecFile: "MSB-18EXML42-001.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML42-001.pdf" }];
sieid_sblist_map['M154402090069900ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154601660152000ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154601661401001ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M154402090071800ENG'] = [{ sbRecFile: "MSB-18EXML54-003.pdf", sbTitle: "Addition of the type of hood latch mounting bolt and the tightening torque", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-003.pdf" }];
sieid_sblist_map['M142800430061200ENG'] = [{ sbRecFile: "MSB-17EXML42-501.pdf", sbTitle: "Correction of the Diagnosis Procedure about Keyless Entry System (Vehicles without Keyless operation system)", releaseDate: "2017/12/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-17EXML42-501.pdf" }];
sieid_sblist_map['M17200890022500ENG'] = [{ sbRecFile: "MSB-18EXML17-500.pdf", sbTitle: "Correction of Inspection Procedure on Diagnosis code.P1566 regarding Cruse Control Output from the Engine ECU", releaseDate: "2018/07/04", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML17-500.pdf" }];
sieid_sblist_map['M1511004702462ENG'] = [{ sbRecFile: "MSB-18EXML51-001.pdf", sbTitle: "Modification of the removal and installation procedure of MOULDINGS", releaseDate: "2018/03/26", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML51-001.pdf" }];
sieid_sblist_map['M1251000600244ENG'] = [{ sbRecFile: "MSB-18EXML25-001A.pdf", sbTitle: "Correction of the maintenance procedure when using special tool PLUG MB991193 for PROPELLER SHAFT of FF type AWD (4WD) vehicles", releaseDate: "2018/07/17", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML25-001A.pdf" }];
sieid_sblist_map['M1251001001594ENG'] = [{ sbRecFile: "MSB-18EXML25-001A.pdf", sbTitle: "Correction of the maintenance procedure when using special tool PLUG MB991193 for PROPELLER SHAFT of FF type AWD (4WD) vehicles", releaseDate: "2018/07/17", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML25-001A.pdf" }];
sieid_sblist_map['M1540202000261ENG'] = [{ sbRecFile: "MSB-18EXML54-502.pdf", sbTitle: "Correction of the Switch resistance check about MULTI-INFORMATION DISPLAY SWITCH CHECK", releaseDate: "2018/09/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-502.pdf" }];
sieid_sblist_map['M100102590001600ENG'] = [{ sbRecFile: "MSB-18EXML00-501.pdf", sbTitle: "Correction of \“INITIALIZATION PROCEDURE FOR LEARNING VALUE IN DFI AND MFI ENGINE\” of the vehicles equipped with CVT type F1CAC or W1CAC", releaseDate: "2018/10/09", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-501.pdf" }];
sieid_sblist_map['M100102590002700ENG'] = [{ sbRecFile: "MSB-18EXML00-501.pdf", sbTitle: "Correction of \“INITIALIZATION PROCEDURE FOR LEARNING VALUE IN DFI AND MFI ENGINE\” of the vehicles equipped with CVT type F1CAC or W1CAC", releaseDate: "2018/10/09", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-501.pdf" }];
sieid_sblist_map['M100101170193700ENG'] = [{ sbRecFile: "MSB-18EXML00-501.pdf", sbTitle: "Correction of \“INITIALIZATION PROCEDURE FOR LEARNING VALUE IN DFI AND MFI ENGINE\” of the vehicles equipped with CVT type F1CAC or W1CAC", releaseDate: "2018/10/09", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-501.pdf" }];
sieid_sblist_map['M113100030375900ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113115200641000ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113115200653900ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113115200654000ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113100190327100ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M113100090307400ENG'] = [{ sbRecFile: "MSB-18EXML13-501.pdf", sbTitle: "Correction of pressure value of service data No.124 and No.125 about DIRECT INJECTION AND MULTIPOINT FUEL INJECTION", releaseDate: "2018/09/19", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML13-501.pdf" }];
sieid_sblist_map['M155402230010000ENG'] = [{ sbRecFile: "MSB-18X55-001.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/11/08", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18X55-001.pdf" }];
sieid_sblist_map['M100102530008101ENG'] = [{ sbRecFile: "MSB-18EXML00-502.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-502.pdf" }];
sieid_sblist_map['M100102530018800ENG'] = [{ sbRecFile: "MSB-18EXML00-502.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-502.pdf" }];
sieid_sblist_map['M10010253A000100ENG'] = [{ sbRecFile: "MSB-18EXML00-502.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-502.pdf" }];
sieid_sblist_map['M100102530024100ENG'] = [{ sbRecFile: "MSB-18EXML00-502.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/11", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML00-502.pdf" }];
sieid_sblist_map['M154010850051300ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M154010850054600ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M154010850053500ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M154010850055700ENG'] = [{ sbRecFile: "MSB-18EXML54-004.pdf", sbTitle: "Addition of packing for Rear Cooler Unit", releaseDate: "2018/12/18", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18EXML54-004.pdf" }];
sieid_sblist_map['M100100031082500ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M100100031090000ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M100100560533100ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M100100550399600ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M10010009A002700ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M10010009A002900ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M10010084A000800ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M131100010240800ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M151100010432300ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M19010039A000900ENG'] = [{ sbRecFile: "MSB-19X00_31_51-001.pdf", sbTitle: "New Information of 2019MY L200 / TRITON", releaseDate: "2019/02/12", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19X00_31_51-001.pdf" }];
sieid_sblist_map['M100100031055700ENG'] = [{ sbRecFile: "MSB-18XL00_42-002.pdf", sbTitle: "Information about additional models of 2019MY MIRAGE", releaseDate: "2018/12/07", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00_42-002.pdf" }];
sieid_sblist_map['M100100560504100ENG'] = [{ sbRecFile: "MSB-18XL00_42-002.pdf", sbTitle: "Information about additional models of 2019MY MIRAGE", releaseDate: "2018/12/07", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00_42-002.pdf" }];
sieid_sblist_map['M100100091105701ENG'] = [{ sbRecFile: "MSB-18XL00_42-002.pdf", sbTitle: "Information about additional models of 2019MY MIRAGE", releaseDate: "2018/12/07", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00_42-002.pdf" }];
sieid_sblist_map['M14210001A001200ENG'] = [{ sbRecFile: "MSB-18XL00_42-002.pdf", sbTitle: "Information about additional models of 2019MY MIRAGE", releaseDate: "2018/12/07", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00_42-002.pdf" }];
sieid_sblist_map['M10010003A001200ENG'] = [{ sbRecFile: "MSB-18L00-001.pdf", sbTitle: "New Information of 2019MY MIRAGE", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18L00-001.pdf" }];
sieid_sblist_map['M10010056A000300ENG'] = [{ sbRecFile: "MSB-18L00-001.pdf", sbTitle: "New Information of 2019MY MIRAGE", releaseDate: "2018/07/06", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18L00-001.pdf" }];
sieid_sblist_map['M10010003A002300ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M10010056A001100ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M10010055A000300ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M10010009A001600ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M10010009A001700ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M112100010222300ENG'] = [{ sbRecFile: "MSB-18XL00-001A.pdf", sbTitle: "New Information of 2019MY PAJERO/MONTERO", releaseDate: "2018/10/25", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-18XL00-001A.pdf" }];
sieid_sblist_map['M100100031106600ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M100100560546100ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M100100550415900ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M10010009A006400ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M100100091172300ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M155200010149500ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
sieid_sblist_map['M155201540226800ENG'] = [{ sbRecFile: "MSB-19XL00_55-001.pdf", sbTitle: "New information about 2020MY PAJERO / MONTERO", releaseDate: "2019/03/13", href: "../../../../../../SATSU_PACKAGE/20190410170000/MSB-19XL00_55-001.pdf" }];
    
    if (sieId in sieid_sblist_map) {
        return sieid_sblist_map[sieId];
    }

    return null;
}
// [open sb notification script end]
