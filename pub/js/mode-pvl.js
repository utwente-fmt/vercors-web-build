ace.define("ace/mode/doc_comment_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var DocCommentHighlightRules = function () {
    this.$rules = {
        "start": [
            {
                token: "comment.doc.tag",
                regex: "@\\w+(?=\\s|$)"
            }, DocCommentHighlightRules.getTagRule(), {
                defaultToken: "comment.doc.body",
                caseInsensitive: true
            }
        ]
    };
};
oop.inherits(DocCommentHighlightRules, TextHighlightRules);
DocCommentHighlightRules.getTagRule = function (start) {
    return {
        token: "comment.doc.tag.storage.type",
        regex: "\\b(?:TODO|FIXME|XXX|HACK)\\b"
    };
};
DocCommentHighlightRules.getStartRule = function (start) {
    return {
        token: "comment.doc", // doc comment
        regex: /\/\*\*(?!\/)/,
        next: start
    };
};
DocCommentHighlightRules.getEndRule = function (start) {
    return {
        token: "comment.doc", // closing comment
        regex: "\\*\\/",
        next: start
    };
};
exports.DocCommentHighlightRules = DocCommentHighlightRules;

});

ace.define("ace/mode/pvl_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var specTypeKeywords = ("int|boolean|resource|process|frac|zfrac|bool|ref|" +
    "rational|seq|set|vector|bag|pointer|map|option|either|tuple|type|" +
    "any|nothing|string" +
    "axiom|model|adt|prover_type|prover_function");
var specTypeModifiers = ("pure|thread_local|bip_annotation|opaque|unique|" +
    "unique_pointer_field");
var specStatementKeywords = ("modifies|accessible|decreases|signals|" +
    "requires|ensures|context|context_everywhere|loop_invariant|" +
    "kernel_invariant|lock_invariant|" +
    "with|then|given|yields|reveal|" +
    "apply|fold|unfold|open|close|assert|assume|inhale|exhale|label|" +
    "extract|extract_body|frame|outline|refute|witness|ghost|send|recv|" +
    "transfer|csl_subject|spec_ignore|action|" +
    "atomic|commit");
var specSlashKeywords = ("replacing_done|replacing" +
    "unfolding|Unfolding|in|memberof|current_thread|forall|exists|" +
    "forperm|forpermwithvalue|let|sum|choose|choose_fresh|length|old|" +
    "asserting|assuming|typeof|type|matrix|array|pointer|pointer_index|" +
    "pointer_block|pointer_block_length|pointer_block_offset|" +
    "pointer_length|shared_mem_size|values|vcmp|vrep|msum|mcmp|mrep|result|" +
    "ltid|gtid|nd_index|nd_length|nd_partial_index|polarity_dependent|" +
    "smtlib|boogie|euclidean_div|euclidean_mod|pow|is_int|");
var specExpressionKeywords = ("Reducible|AddsTo|APerm|ArrayPerm|Contribution|held|committed|HPerm|" +
    "idle|perm|Perm|PointsTo|running|Some|Left|Right|Value|AutoValue|" +
    "false|true|" +
    "none|None|write|read|empty");
var specOperators = ("\\?\\.|\\\\|\\*\\*|==>|-\\*|\\.\\.|<-|:\\|");
var PVLHighlightRules = function () {
    var identifierRe = "[a-zA-Z_$][a-zA-Z0-9_$]*";
    var keywords = ("class|kernel|global|local|static|thread_local|inline|" +
        "in|id|new|unfolding|return|lock|unlock|wait|notify|" +
        "fork|join|if|else|barrier|par|and|vec|while|for|goto|void|atomic|invariant");
    var builtinConstants = "true|false|null|this";
    var keywordMapper = this.createKeywordMapper({
        "variable.language": "this",
        "constant.language": builtinConstants,
        "storage.type": specTypeKeywords
    }, "identifier");
    this.$rules = {
        "start": [
            { include: "specs" },
            { include: "spec-body" },
            { include: "comments" },
            { include: "strings" },
            { include: "constants" },
            { include: "statements" }
        ],
        "comments": [
            {
                token: "comment",
                regex: "\\/\\/(?!@).*$"
            },
            {
                token: "comment.doc",
                regex: /\/\*\*(?![\/@])/,
                push: "doc-start"
            },
            {
                token: "comment",
                regex: "\\/\\*(?!@)",
                push: [
                    {
                        token: "comment",
                        regex: "\\*\\/",
                        next: "pop"
                    }, {
                        defaultToken: "comment"
                    }
                ]
            }
        ],
        "specs": [
            {
                token: "support.constant.spec",
                regex: "\\/\\/@",
                push: [
                    {
                        token: "text",
                        regex: /$/,
                        next: "pop"
                    },
                    { include: "spec-body" },
                    { include: "comments" },
                    { include: "strings" },
                    { include: "constants" },
                    { include: "statements" }
                ]
            }, {
                token: "support.constant.spec",
                regex: "\\/\\*@",
                push: [
                    {
                        token: "support.constant.spec",
                        regex: /@?\*\//,
                        next: "pop"
                    },
                    { include: "spec-body" },
                    { include: "comments" },
                    { include: "strings" },
                    { include: "constants" },
                    { include: "statements" }
                ]
            }
        ],
        "spec-body": [
            {
                token: "support.constant",
                regex: "\\b(?:" + specStatementKeywords + ")\\b"
            }, {
                token: "constant.language",
                regex: "\\b(?:" + specExpressionKeywords + ")\\b"
            }, {
                token: "storage.modifier",
                regex: "\\b(?:" + specTypeModifiers + ")\\b"
            }, {
                token: "keyword.other",
                regex: "\\\\(?:" + specSlashKeywords + ")\\b"
            }, {
                token: "keyword.operator",
                regex: specOperators
            }
        ],
        "strings": [
            {
                token: "string",
                regex: '"(?:(?:\\\\.)|(?:[^"\\\\]))*?"'
            }, {
                token: "string",
                regex: "'(?:\\\\.|[^'\\\\])*?'"
            }
        ],
        "constants": [
            {
                token: "constant.numeric",
                regex: /\b(?:0|[1-9][0-9]*)\b/
            }, {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b"
            }, {
                token: "constant.language",
                regex: "(?:null|this)\\b"
            }
        ],
        "statements": [{
                token: "keyword",
                regex: "\\b(?:" + specExpressionKeywords + ")\\b"
            },
            {
                token: "keyword",
                regex: "\\b(?:" + keywords + ")\\b"
            }, {
                token: "storage.type",
                regex: "\\b(?:" + specTypeKeywords + ")\\b"
            }, {
                token: "storage.type.annotation",
                regex: "@" + identifierRe + "\\b"
            }, {
                token: "entity.name.function",
                regex: identifierRe + "(?=\\()"
            }, {
                token: keywordMapper,
                regex: identifierRe + "\\b"
            }, {
                token: "keyword.operator",
                regex: "&&|\\*\\*|!|%|&|\\||\\^|\\*|\\/|\\-|\\+|~|==|=|!=|<=|>=|<|>|\\?|\\:|\\*=|\\/=|%=|\\+=|\\-=|&=|\\|=|\\^=|:\\|"
            }, {
                token: "paren.lparen",
                regex: "[\\[({]"
            }, {
                token: "paren.rparen",
                regex: "[\\])}]"
            }, {
                token: "texts",
                regex: "\\s+"
            }
        ]
    };
    this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule("pop")]);
    this.normalizeRules();
};
oop.inherits(PVLHighlightRules, TextHighlightRules);
exports.PVLHighlightRules = PVLHighlightRules;

});

ace.define("ace/mode/folding/cstyle",[], function(require, exports, module){"use strict";
var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var BaseFoldMode = require("./fold_mode").FoldMode;
var FoldMode = exports.FoldMode = function (commentRegex) {
    if (commentRegex) {
        this.foldingStartMarker = new RegExp(this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.start));
        this.foldingStopMarker = new RegExp(this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end));
    }
};
oop.inherits(FoldMode, BaseFoldMode);
(function () {
    this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
    this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
    this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
    this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
    this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
    this._getFoldWidgetBase = this.getFoldWidget;
    this.getFoldWidget = function (session, foldStyle, row) {
        var line = session.getLine(row);
        if (this.singleLineBlockCommentRe.test(line)) {
            if (!this.startRegionRe.test(line) && !this.tripleStarBlockCommentRe.test(line))
                return "";
        }
        var fw = this._getFoldWidgetBase(session, foldStyle, row);
        if (!fw && this.startRegionRe.test(line))
            return "start"; // lineCommentRegionStart
        return fw;
    };
    this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        if (this.startRegionRe.test(line))
            return this.getCommentRegionBlock(session, line, row);
        var match = line.match(this.foldingStartMarker);
        if (match) {
            var i = match.index;
            if (match[1])
                return this.openingBracketBlock(session, match[1], row, i);
            var range = session.getCommentFoldRange(row, i + match[0].length, 1);
            if (range && !range.isMultiLine()) {
                if (forceMultiline) {
                    range = this.getSectionRange(session, row);
                }
                else if (foldStyle != "all")
                    range = null;
            }
            return range;
        }
        if (foldStyle === "markbegin")
            return;
        var match = line.match(this.foldingStopMarker);
        if (match) {
            var i = match.index + match[0].length;
            if (match[1])
                return this.closingBracketBlock(session, match[1], row, i);
            return session.getCommentFoldRange(row, i, -1);
        }
    };
    this.getSectionRange = function (session, row) {
        var line = session.getLine(row);
        var startIndent = line.search(/\S/);
        var startRow = row;
        var startColumn = line.length;
        row = row + 1;
        var endRow = row;
        var maxRow = session.getLength();
        while (++row < maxRow) {
            line = session.getLine(row);
            var indent = line.search(/\S/);
            if (indent === -1)
                continue;
            if (startIndent > indent)
                break;
            var subRange = this.getFoldWidgetRange(session, "all", row);
            if (subRange) {
                if (subRange.start.row <= startRow) {
                    break;
                }
                else if (subRange.isMultiLine()) {
                    row = subRange.end.row;
                }
                else if (startIndent == indent) {
                    break;
                }
            }
            endRow = row;
        }
        return new Range(startRow, startColumn, endRow, session.getLine(endRow).length);
    };
    this.getCommentRegionBlock = function (session, line, row) {
        var startColumn = line.search(/\s*$/);
        var maxRow = session.getLength();
        var startRow = row;
        var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
        var depth = 1;
        while (++row < maxRow) {
            line = session.getLine(row);
            var m = re.exec(line);
            if (!m)
                continue;
            if (m[1])
                depth--;
            else
                depth++;
            if (!depth)
                break;
        }
        var endRow = row;
        if (endRow > startRow) {
            return new Range(startRow, startColumn, endRow, line.length);
        }
    };
}).call(FoldMode.prototype);

});

ace.define("ace/mode/folding/annotated_cstyle",[], function(require, exports, module){"use strict";
var oop = require("../../lib/oop");
var Range = require("../../range").Range;
var CStyleFoldMode = require("./cstyle").FoldMode;
var FoldMode = exports.FoldMode = function () {
    CStyleFoldMode.call(this, {
        start: "^\\s*(\\/\\*\\@)",
        end: "^[\\s\\*]*(\\@?\\*\\/)"
    });
    this.annotationStartRe = /^\s*\/\*@/;
    this.annotationStopRe = /^\s*@?\*\/\s*$/;
};
oop.inherits(FoldMode, CStyleFoldMode);
(function () {
    this.getCStyleFoldWidgetRange = this.getFoldWidgetRange;
    this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
        var line = session.getLine(row);
        if (this.annotationStartRe.test(line))
            return this.getAnnotationFoldRangeFromStart(session, row, foldStyle, forceMultiline);
        if (foldStyle !== "markbegin" && this.annotationStopRe.test(line))
            return this.getAnnotationFoldRangeFromEnd(session, row);
        return this.getCStyleFoldWidgetRange(session, foldStyle, row, forceMultiline);
    };
    this.getAnnotationFoldRangeFromStart = function (session, row, foldStyle, forceMultiline) {
        var line = session.getLine(row);
        var startIndex = line.indexOf("/*@");
        if (startIndex === -1)
            return;
        var startColumn = startIndex + 3;
        var maxRow = session.getLength();
        for (var endRow = row; endRow < maxRow; endRow++) {
            var endLine = session.getLine(endRow);
            var searchFrom = endRow === row ? startColumn : 0;
            var closeIndex = endLine.indexOf("@*/", searchFrom);
            var plainCloseIndex = endLine.indexOf("*/", searchFrom);
            if (plainCloseIndex !== -1 && (closeIndex === -1 || plainCloseIndex < closeIndex))
                closeIndex = plainCloseIndex;
            if (closeIndex === -1)
                continue;
            var range = new Range(row, startColumn, endRow, closeIndex);
            if (!range.isMultiLine()) {
                if (forceMultiline && this.getSectionRange)
                    return this.getSectionRange(session, row);
                if (foldStyle != "all")
                    return null;
            }
            return range;
        }
    };
    this.getAnnotationFoldRangeFromEnd = function (session, row) {
        for (var startRow = row - 1; startRow >= 0; startRow--) {
            if (!this.annotationStartRe.test(session.getLine(startRow)))
                continue;
            var range = this.getAnnotationFoldRangeFromStart(session, startRow, "all", false);
            if (range && range.end.row === row)
                return range;
        }
    };
}).call(FoldMode.prototype);

});

ace.define("ace/mode/pvl",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var PVLHighlightRules = require("./pvl_highlight_rules").PVLHighlightRules;
var FoldMode = require("./folding/annotated_cstyle").FoldMode;
var Mode = function () {
    this.HighlightRules = PVLHighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);
(function () {
    this.lineCommentStart = "//";
    this.blockComment = { start: "/*", end: "*/" };
    this.$id = "ace/mode/pvl";
}).call(Mode.prototype);
exports.Mode = Mode;

});                (function() {
                    ace.require(["ace/mode/pvl"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            