ace.define("ace/mode/spec_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
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
var specOperators = ("\\?\\.|\\\\|\\*\\*|==>|-\\*|\\.\\.|<-|:\\|{:|:}");
function createSpecBodyRules() {
    return [{
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
            regex: "\\\\(?:" + specSlashKeywords + ")\\b|∀\\*|∀|∃"
        }, {
            token: "keyword.operator",
            regex: specOperators
        }];
}
function createSpecRules() {
    return {
        "start": [
            { include: "specs" },
            { include: "spec-body" }
        ],
        "specs": [{
                token: "support.constant",
                regex: "\\/\\/@",
                push: [{
                        token: "text",
                        regex: /$/,
                        next: "pop"
                    }, {
                        include: "spec-body"
                    }]
            }, {
                token: "support.constant",
                regex: "\\/\\*@",
                push: [{
                        token: "support.constant",
                        regex: /@?\*\//,
                        next: "pop"
                    }, {
                        include: "spec-body"
                    }]
            }],
        "spec-body": createSpecBodyRules()
    };
}
var SpecHighlightRules = function () {
    this.$rules = createSpecRules();
    this.normalizeRules();
};
oop.inherits(SpecHighlightRules, TextHighlightRules);
exports.SpecHighlightRules = SpecHighlightRules;
exports.createSpecRules = createSpecRules;
exports.getSpecBodyRules = function () {
    return deepCopy(createSpecBodyRules());
};

});

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

ace.define("ace/mode/c_cpp_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var DocCommentHighlightRules = require("./doc_comment_highlight_rules").DocCommentHighlightRules;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var cFunctions = exports.cFunctions = "hypot|hypotf|hypotl|sscanf|system|snprintf|scanf|scalbn|scalbnf|scalbnl|scalbln|scalblnf|scalblnl|sin|sinh|sinhf|sinhl|sinf|sinl|signal|signbit|strstr|strspn|strncpy|strncat|strncmp|strcspn|strchr|strcoll|strcpy|strcat|strcmp|strtoimax|strtod|strtoul|strtoull|strtoumax|strtok|strtof|strtol|strtold|strtoll|strerror|strpbrk|strftime|strlen|strrchr|strxfrm|sprintf|setjmp|setvbuf|setlocale|setbuf|sqrt|sqrtf|sqrtl|swscanf|swprintf|srand|nearbyint|nearbyintf|nearbyintl|nexttoward|nexttowardf|nexttowardl|nextafter|nextafterf|nextafterl|nan|nanf|nanl|csin|csinh|csinhf|csinhl|csinf|csinl|csqrt|csqrtf|csqrtl|ccos|ccosh|ccoshf|ccosf|ccosl|cimag|cimagf|cimagl|ctime|ctan|ctanh|ctanhf|ctanhl|ctanf|ctanl|cos|cosh|coshf|coshl|cosf|cosl|conj|conjf|conjl|copysign|copysignf|copysignl|cpow|cpowf|cpowl|cproj|cprojf|cprojl|ceil|ceilf|ceill|cexp|cexpf|cexpl|clock|clog|clogf|clogl|clearerr|casin|casinh|casinhf|casinhl|casinf|casinl|cacos|cacosh|cacoshf|cacoshl|cacosf|cacosl|catan|catanh|catanhf|catanhl|catanf|catanl|calloc|carg|cargf|cargl|cabs|cabsf|cabsl|creal|crealf|creall|cbrt|cbrtf|cbrtl|time|toupper|tolower|tan|tanh|tanhf|tanhl|tanf|tanl|trunc|truncf|truncl|tgamma|tgammaf|tgammal|tmpnam|tmpfile|isspace|isnormal|isnan|iscntrl|isinf|isdigit|isunordered|isupper|ispunct|isprint|isfinite|iswspace|iswcntrl|iswctype|iswdigit|iswupper|iswpunct|iswprint|iswlower|iswalnum|iswalpha|iswgraph|iswxdigit|iswblank|islower|isless|islessequal|islessgreater|isalnum|isalpha|isgreater|isgreaterequal|isgraph|isxdigit|isblank|ilogb|ilogbf|ilogbl|imaxdiv|imaxabs|div|difftime|_Exit|ungetc|ungetwc|pow|powf|powl|puts|putc|putchar|putwc|putwchar|perror|printf|erf|erfc|erfcf|erfcl|erff|erfl|exit|exp|exp2|exp2f|exp2l|expf|expl|expm1|expm1f|expm1l|vsscanf|vsnprintf|vscanf|vsprintf|vswscanf|vswprintf|vprintf|vfscanf|vfprintf|vfwscanf|vfwprintf|vwscanf|vwprintf|va_start|va_copy|va_end|va_arg|qsort|fscanf|fsetpos|fseek|fclose|ftell|fopen|fdim|fdimf|fdiml|fpclassify|fputs|fputc|fputws|fputwc|fprintf|feholdexcept|fesetenv|fesetexceptflag|fesetround|feclearexcept|fetestexcept|feof|feupdateenv|feraiseexcept|ferror|fegetenv|fegetexceptflag|fegetround|fflush|fwscanf|fwide|fwprintf|fwrite|floor|floorf|floorl|fabs|fabsf|fabsl|fgets|fgetc|fgetpos|fgetws|fgetwc|freopen|free|fread|frexp|frexpf|frexpl|fmin|fminf|fminl|fmod|fmodf|fmodl|fma|fmaf|fmal|fmax|fmaxf|fmaxl|ldiv|ldexp|ldexpf|ldexpl|longjmp|localtime|localeconv|log|log1p|log1pf|log1pl|log10|log10f|log10l|log2|log2f|log2l|logf|logl|logb|logbf|logbl|labs|lldiv|llabs|llrint|llrintf|llrintl|llround|llroundf|llroundl|lrint|lrintf|lrintl|lround|lroundf|lroundl|lgamma|lgammaf|lgammal|wscanf|wcsstr|wcsspn|wcsncpy|wcsncat|wcsncmp|wcscspn|wcschr|wcscoll|wcscpy|wcscat|wcscmp|wcstoimax|wcstod|wcstoul|wcstoull|wcstoumax|wcstok|wcstof|wcstol|wcstold|wcstoll|wcstombs|wcspbrk|wcsftime|wcslen|wcsrchr|wcsrtombs|wcsxfrm|wctob|wctomb|wcrtomb|wprintf|wmemset|wmemchr|wmemcpy|wmemcmp|wmemmove|assert|asctime|asin|asinh|asinhf|asinhl|asinf|asinl|acos|acosh|acoshf|acoshl|acosf|acosl|atoi|atof|atol|atoll|atexit|atan|atanh|atanhf|atanhl|atan2|atan2f|atan2l|atanf|atanl|abs|abort|gets|getc|getchar|getenv|getwc|getwchar|gmtime|rint|rintf|rintl|round|roundf|roundl|rename|realloc|rewind|remove|remquo|remquof|remquol|remainder|remainderf|remainderl|rand|raise|bsearch|btowc|modf|modff|modfl|memset|memchr|memcpy|memcmp|memmove|mktime|malloc|mbsinit|mbstowcs|mbsrtowcs|mbtowc|mblen|mbrtowc|mbrlen";
var c_cppHighlightRules = function (extraKeywords) {
    var keywordControls = ("break|case|continue|default|do|else|for|goto|if|_Pragma|" +
        "return|switch|while|catch|operator|try|throw|using");
    var storageType = ("asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|" +
        "_Imaginary|int|int8_t|int16_t|int32_t|int64_t|long|short|signed|size_t|struct|typedef|uint8_t|uint16_t|uint32_t|uint64_t|union|unsigned|void|" +
        "class|wchar_t|template|char16_t|char32_t");
    var storageModifiers = ("const|extern|register|restrict|static|volatile|inline|private|" +
        "protected|public|friend|explicit|virtual|export|mutable|typename|" +
        "constexpr|new|delete|alignas|alignof|decltype|noexcept|thread_local");
    var keywordOperators = ("and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eq|" +
        "const_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace");
    var builtinConstants = ("NULL|true|false|TRUE|FALSE|nullptr");
    var keywordMap = {
        "keyword.control": keywordControls,
        "storage.type": storageType,
        "storage.modifier": storageModifiers,
        "keyword.operator": keywordOperators,
        "variable.language": "this",
        "constant.language": builtinConstants,
        "support.function.C99.c": cFunctions
    };
    if (extraKeywords) {
        Object.keys(extraKeywords).forEach(function (key) {
            if (keywordMap[key])
                keywordMap[key] += "|" + extraKeywords[key];
            else
                keywordMap[key] = extraKeywords[key];
        });
    }
    var keywordMapper = this.$keywords = this.createKeywordMapper(keywordMap, "identifier");
    var identifierRe = "[a-zA-Z\\$_\u00a1-\uffff][a-zA-Z\\d\\$_\u00a1-\uffff]*\\b";
    var escapeRe = /\\(?:['"?\\abfnrtv]|[0-7]{1,3}|x[a-fA-F\d]{2}|u[a-fA-F\d]{4}U[a-fA-F\d]{8}|.)/.source;
    var formatRe = "%"
        + /(\d+\$)?/.source // field (argument #)
        + /[#0\- +']*/.source // flags
        + /[,;:_]?/.source // separator character (AltiVec)
        + /((-?\d+)|\*(-?\d+\$)?)?/.source // minimum field width
        + /(\.((-?\d+)|\*(-?\d+\$)?)?)?/.source // precision
        + /(hh|h|ll|l|j|t|z|q|L|vh|vl|v|hv|hl)?/.source // length modifier
        + /(\[[^"\]]+\]|[diouxXDOUeEfFgGaACcSspn%])/.source; // conversion type
    this.$rules = {
        "start": [
            {
                token: "comment",
                regex: "//$",
                next: "start"
            }, {
                token: "comment",
                regex: "//",
                next: "singleLineComment"
            },
            DocCommentHighlightRules.getStartRule("doc-start"),
            {
                token: "comment", // multi line comment
                regex: "\\/\\*",
                next: "comment"
            }, {
                token: "string", // character
                regex: "'(?:" + escapeRe + "|.)?'"
            }, {
                token: "string.start",
                regex: '"',
                stateName: "qqstring",
                next: [
                    { token: "string", regex: /\\\s*$/, next: "qqstring" },
                    { token: "constant.language.escape", regex: escapeRe },
                    { token: "constant.language.escape", regex: formatRe },
                    { token: "string.end", regex: '"|$', next: "start" },
                    { defaultToken: "string" }
                ]
            }, {
                token: "string.start",
                regex: 'R"\\(',
                stateName: "rawString",
                next: [
                    { token: "string.end", regex: '\\)"', next: "start" },
                    { defaultToken: "string" }
                ]
            }, {
                token: "constant.numeric", // hex
                regex: "0[xX][0-9a-fA-F]+(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            }, {
                token: "constant.numeric", // float
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?(L|l|UL|ul|u|U|F|f|ll|LL|ull|ULL)?\\b"
            }, {
                token: "keyword", // pre-compiler directives
                regex: "#\\s*(?:include|import|pragma|line|define|undef)\\b",
                next: "directive"
            }, {
                token: "keyword", // special case pre-compiler directive
                regex: "#\\s*(?:endif|if|ifdef|else|elif|ifndef)\\b"
            }, {
                token: keywordMapper,
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*"
            }, {
                token: "keyword.operator",
                regex: /--|\+\+|<<=|>>=|>>>=|<>|&&|\|\||\?:|[*%\/+\-&\^|~!<>=]=?/
            }, {
                token: "punctuation.operator",
                regex: "\\?|\\:|\\,|\\;|\\."
            }, {
                token: "paren.lparen",
                regex: "[[({]"
            }, {
                token: "paren.rparen",
                regex: "[\\])}]"
            }, {
                token: "text",
                regex: "\\s+"
            }
        ],
        "comment": [
            {
                token: "comment", // closing comment
                regex: "\\*\\/",
                next: "start"
            }, {
                defaultToken: "comment"
            }
        ],
        "singleLineComment": [
            {
                token: "comment",
                regex: /\\$/,
                next: "singleLineComment"
            }, {
                token: "comment",
                regex: /$/,
                next: "start"
            }, {
                defaultToken: "comment"
            }
        ],
        "directive": [
            {
                token: "constant.other.multiline",
                regex: /\\/
            },
            {
                token: "constant.other.multiline",
                regex: /.*\\/
            },
            {
                token: "constant.other",
                regex: "\\s*<.+?>",
                next: "start"
            },
            {
                token: "constant.other", // single line
                regex: '\\s*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
                next: "start"
            },
            {
                token: "constant.other", // single line
                regex: "\\s*['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']",
                next: "start"
            },
            {
                token: "constant.other",
                regex: /[^\\\/]+/,
                next: "start"
            }
        ]
    };
    this.embedRules(DocCommentHighlightRules, "doc-", [DocCommentHighlightRules.getEndRule("start")]);
    this.normalizeRules();
};
oop.inherits(c_cppHighlightRules, TextHighlightRules);
exports.c_cppHighlightRules = c_cppHighlightRules;

});

ace.define("ace/mode/cuda_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var c_cppHighlightRules = require("./c_cpp_highlight_rules").c_cppHighlightRules;
var cudaHighlightRules = function () {
    c_cppHighlightRules.call(this);
    this.$rules.start.unshift({
        token: "keyword.operator",
        regex: /<<<|>>>/
    }, {
        token: "storage.modifier",
        regex: "\\b(?:__global__|__device__|__host__|__shared__|" +
            "__constant__|__managed__|__restrict__|__forceinline__|" +
            "__noinline__|__launch_bounds__)\\b"
    }, {
        token: "storage.type",
        regex: "\\b(?:dim3|uint3|float2|float3|float4|double2|double3|" +
            "double4|int2|int3|int4|cudaError_t|cudaStream_t|cudaEvent_t)\\b"
    }, {
        token: "support.function.cuda",
        regex: "(?:\\b(?:threadIdx|blockIdx|blockDim|gridDim)\\.(?:x|y|z|w)" +
            "\\b|\\b(?:warpSize|__syncthreads|__threadfence|" +
            "__threadfence_block|__threadfence_system|__syncwarp|" +
            "atomicAdd|atomicSub|atomicExch|atomicMin|atomicMax|atomicInc|" +
            "atomicDec|atomicCAS|atomicAnd|atomicOr|atomicXor)\\b)"
    });
};
oop.inherits(cudaHighlightRules, c_cppHighlightRules);
exports.cudaHighlightRules = cudaHighlightRules;

});

ace.define("ace/mode/annotated_cuda_highlight_rules",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var deepCopy = require("../lib/deep_copy").deepCopy;
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
var getSpecBodyRules = require("./spec_highlight_rules").getSpecBodyRules;
var annotated_cudaHighlightRules = function () {
    var CUDAHighlightRules = require("./cuda_highlight_rules").cudaHighlightRules;
    var cudaRules = new CUDAHighlightRules().getRules();
    this.$rules = cudaRules;
    var specBodyRules = getSpecBodyRules();
    this.$rules.start.unshift({
        token: "support.constant",
        regex: "//@",
        push: "spec-line-start"
    }, {
        token: "support.constant",
        regex: "/\\*@",
        push: "spec-block-start"
    });
    var specLineRules = deepCopy(cudaRules);
    this.embedRules(specLineRules, "spec-line-", [{
            token: "text",
            regex: /$/,
            next: "pop"
        }]);
    var specBlockRules = deepCopy(cudaRules);
    this.embedRules(specBlockRules, "spec-block-");
    this.$rules["spec-block-start"].unshift({
        token: "support.constant",
        regex: "\\s*@?\\*\\/",
        next: "pop"
    });
    this.$rules["spec-line-start"] = [this.$rules["spec-line-start"][0]].concat(specBodyRules, this.$rules["spec-line-start"].slice(1));
    this.$rules["spec-block-start"] = [this.$rules["spec-block-start"][0]].concat(specBodyRules, this.$rules["spec-block-start"].slice(1));
    this.normalizeRules();
};
oop.inherits(annotated_cudaHighlightRules, TextHighlightRules);
exports.annotated_cudaHighlightRules = annotated_cudaHighlightRules;
exports.HighlightRules = annotated_cudaHighlightRules;

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

ace.define("ace/mode/annotated_cuda",[], function(require, exports, module){"use strict";
var oop = require("../lib/oop");
var TextMode = require("./text").Mode;
var HighlightRules = require("./annotated_cuda_highlight_rules").annotated_cudaHighlightRules;
var FoldMode = require("./folding/annotated_cstyle").FoldMode;
var Mode = function () {
    this.HighlightRules = HighlightRules;
    this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);
(function () {
    this.lineCommentStart = "//";
    this.blockComment = { start: "/*", end: "*/" };
    this.$id = "ace/mode/annotated_cuda";
}).call(Mode.prototype);
exports.Mode = Mode;

});                (function() {
                    ace.require(["ace/mode/annotated_cuda"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            