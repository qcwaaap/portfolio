(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/loader/Bicycle.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "chain": "Bicycle-module__ouwH5G__chain",
  "fill": "Bicycle-module__ouwH5G__fill",
  "ground": "Bicycle-module__ouwH5G__ground",
  "svg": "Bicycle-module__ouwH5G__svg",
});
}),
"[project]/src/components/loader/Bicycle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Bicycle",
    ()=>Bicycle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sketch.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/loader/Bicycle.module.css [app-client] (css module)");
;
;
;
;
/**
 * Нарисованный от руки велосипед.
 *
 * Каждый штрих сам объявляет, В КАКОЙ МОМЕНТ прогресса он рисуется:
 *   data-draw  → штрих «дорисовывается» (stroke-dashoffset 1 → 0)
 *   data-fade  → объект проявляется (opacity 0 → 1)
 *   data-at / data-dur → начало и длительность в долях прогресса (0..1)
 * Loader собирает из этих атрибутов один scrub-таймлайн. Хочешь поменять порядок
 * рисования — правишь числа здесь, а не логику анимации.
 *
 * Части, которыми Loader управляет напрямую (data-part):
 *   bike · rear-wheel · spokes · blur · notes
 */ // ── ключевые точки рамы (viewBox 660×380, начало по y = 40) ──────────────────
const R = [
    172,
    278
]; // задняя втулка
const F = [
    468,
    278
]; // передняя втулка
const BB = [
    302,
    296
]; // каретка
const S = [
    262,
    152
]; // верх подседельной трубы
const SS = [
    260,
    168
]; // крепление верхнего пера
const H1 = [
    412,
    146
]; // верх рулевой
const H2 = [
    424,
    178
]; // низ рулевой
const WHEEL_R = 108;
function Stroke({ d, at, dur, w = 4, opacity }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
        d: d,
        pathLength: 1,
        strokeWidth: w,
        strokeOpacity: opacity,
        "data-draw": "",
        "data-at": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(at),
        "data-dur": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(dur)
    }, void 0, false, {
        fileName: "[project]/src/components/loader/Bicycle.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c = Stroke;
/** Труба: основной жирный штрих + тонкий «призрак» рядом — как будто обвели дважды */ function Tube({ a, b, seed, at, dur, w }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])(a, b, seed, {
                    wobble: 1.2,
                    overshoot: 3
                }),
                at: at,
                dur: dur,
                w: w
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
                    a[0] + 1.4,
                    a[1] - 1.1
                ], [
                    b[0] - 1,
                    b[1] + 1.3
                ], seed + 101, {
                    wobble: 1.8,
                    overshoot: 4
                }),
                at: at + 0.004,
                dur: dur,
                w: w * 0.38,
                opacity: 0.6
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/loader/Bicycle.tsx",
        lineNumber: 48,
        columnNumber: 5
    }, this);
}
_c1 = Tube;
const TUBES = [
    {
        a: S,
        b: BB,
        at: 0.16,
        dur: 0.045,
        w: 5.5
    },
    {
        a: S,
        b: H1,
        at: 0.18,
        dur: 0.05,
        w: 5.5
    },
    {
        a: H2,
        b: BB,
        at: 0.2,
        dur: 0.055,
        w: 6
    },
    {
        a: BB,
        b: R,
        at: 0.22,
        dur: 0.035,
        w: 4.5
    },
    {
        a: SS,
        b: R,
        at: 0.23,
        dur: 0.035,
        w: 3.5
    },
    {
        a: H2,
        b: F,
        at: 0.245,
        dur: 0.035,
        w: 4.5
    },
    {
        a: H1,
        b: H2,
        at: 0.255,
        dur: 0.02,
        w: 8
    },
    {
        a: S,
        b: [
            257,
            124
        ],
        at: 0.265,
        dur: 0.015,
        w: 4
    },
    {
        a: H1,
        b: [
            408,
            120
        ],
        at: 0.265,
        dur: 0.015,
        w: 4
    },
    {
        a: BB,
        b: [
            284,
            334
        ],
        at: 0.28,
        dur: 0.015,
        w: 4
    },
    {
        a: BB,
        b: [
            320,
            258
        ],
        at: 0.285,
        dur: 0.015,
        w: 4
    }
];
/** Колесо. Всё нарисовано вокруг (0,0) — родитель переносит в центр втулки. */ function Wheel({ seed, at, rotating = false }) {
    const rand = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rng"])(seed);
    // 12 спиц с «перекрёстной» шнуровкой: начало смещено по касательной, конец на ободе
    const spokes = Array.from({
        length: 12
    }, (_, i)=>{
        const ang = (i * 30 + (rand() - 0.5) * 5) * Math.PI / 180;
        const a0 = ang + (i % 2 ? 0.6 : -0.6);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
            Math.cos(a0) * 8,
            Math.sin(a0) * 8
        ], [
            Math.cos(ang) * 103,
            Math.sin(ang) * 103
        ], seed * 7 + i, {
            wobble: 1,
            overshoot: 1
        });
    });
    // Дуги-«смазывание»: проступают на большой скорости, когда спицы уже не различить
    const blur = [
        40,
        55,
        62,
        80,
        90,
        96
    ].map((r, i)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleCircle"])(0, 0, r, seed + 40 + i, {
            sweep: 0.13 + i % 3 * 0.04,
            jitter: 0.008,
            drift: 0.01,
            start: i * 1.7
        }));
    const teeth = Array.from({
        length: 9
    }, (_, i)=>{
        const a = i / 9 * Math.PI * 2;
        const c = Math.cos(a);
        const s = Math.sin(a);
        return `M${(c * 11).toFixed(1)} ${(s * 11).toFixed(1)}L${(c * 15.5).toFixed(1)} ${(s * 15.5).toFixed(1)}`;
    }).join('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        "data-part": rotating ? 'rear-wheel' : undefined,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-part": rotating ? 'spokes' : undefined,
                children: spokes.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: d,
                        at: at + 0.05 + i * 0.004,
                        dur: 0.03,
                        w: 1.7
                    }, i, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 105,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            rotating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-part": "blur",
                opacity: 0,
                children: blur.map((d, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: d,
                        strokeWidth: 2.6,
                        strokeOpacity: 0.55
                    }, i, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 112,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleCircle"])(1.6, -1.1, WHEEL_R, seed),
                at: at,
                dur: 0.09,
                w: 5.5
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 118,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleCircle"])(-1.3, 1.4, WHEEL_R - 3.5, seed + 3, {
                    sweep: 1.06
                }),
                at: at + 0.02,
                dur: 0.08,
                w: 2.2,
                opacity: 0.6
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            rotating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-fade": "",
                "data-at": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(at + 0.1),
                "data-dur": "0.03",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        r: 11,
                        strokeWidth: 2.6
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 123,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: teeth,
                        strokeWidth: 2.4
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 124,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 122,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                r: 6,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].fill,
                "data-fade": "",
                "data-at": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(at + 0.1),
                "data-dur": "0.03"
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/loader/Bicycle.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
_c2 = Wheel;
/** Подписи-аннотации от руки: «этот крутится / этот нет». */ function Notes() {
    const a1 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleArrow"])([
        92,
        136
    ], [
        128,
        130
    ], [
        118,
        172
    ], 11);
    const a2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleArrow"])([
        572,
        98
    ], [
        604,
        138
    ], [
        556,
        178
    ], 12);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
        "data-part": "notes",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-fade": "",
                "data-at": "0.3",
                "data-dur": "0.05",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 22,
                        y: 118,
                        transform: "rotate(-5 22 118)",
                        children: "this one spins"
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 139,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: a1.shaft,
                        strokeWidth: 2.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 142,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: a1.head,
                        strokeWidth: 2.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-fade": "",
                "data-at": "0.38",
                "data-dur": "0.05",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                        x: 448,
                        y: 86,
                        transform: "rotate(4 448 86)",
                        children: "this one doesn't"
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: a2.shaft,
                        strokeWidth: 2.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 149,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: a2.head,
                        strokeWidth: 2.2
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/loader/Bicycle.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_c3 = Notes;
const Bicycle = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(/*#__PURE__*/ _c5 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c4 = function Bicycle({ className }, ref) {
    const ground = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribblePoly"])([
        [
            60,
            394
        ],
        [
            190,
            384
        ],
        [
            168,
            398
        ],
        [
            330,
            383
        ],
        [
            312,
            397
        ],
        [
            470,
            382
        ],
        [
            452,
            396
        ],
        [
            590,
            386
        ]
    ], 5, 1.4);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        ref: ref,
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].svg} ${className ?? ''}`,
        viewBox: "-10 40 660 380",
        role: "img",
        "aria-label": "Hand-drawn bicycle",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: ground,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].ground,
                strokeWidth: 8,
                pathLength: 1,
                "data-draw": "",
                "data-at": "0",
                "data-dur": "0.07"
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                "data-part": "bike",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: `translate(${R[0]} ${R[1]})`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Wheel, {
                            seed: 21,
                            at: 0.04,
                            rotating: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/loader/Bicycle.tsx",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        transform: `translate(${F[0]} ${F[1]})`,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Wheel, {
                            seed: 34,
                            at: 0.1
                        }, void 0, false, {
                            fileName: "[project]/src/components/loader/Bicycle.tsx",
                            lineNumber: 194,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this),
                    TUBES.map((t, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Tube, {
                            ...t,
                            seed: 50 + i * 3
                        }, i, false, {
                            fileName: "[project]/src/components/loader/Bicycle.tsx",
                            lineNumber: 198,
                            columnNumber: 13
                        }, this)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: "M230 121Q264 110 300 118",
                        at: 0.268,
                        dur: 0.015,
                        w: 9
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: "M394 119Q418 106 446 112Q458 119 453 135",
                        at: 0.268,
                        dur: 0.02,
                        w: 4.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 203,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleCircle"])(BB[0], BB[1], 26, 77, {
                            sweep: 1.07
                        }),
                        at: 0.27,
                        dur: 0.03,
                        w: 3.5
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 206,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
                            270,
                            337
                        ], [
                            298,
                            334
                        ], 80),
                        at: 0.288,
                        dur: 0.01,
                        w: 6
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Stroke, {
                        d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
                            307,
                            255
                        ], [
                            335,
                            258
                        ], 81),
                        at: 0.29,
                        dur: 0.01,
                        w: 6
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 208,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                        "data-fade": "",
                        "data-at": "0.28",
                        "data-dur": "0.02",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
                                    BB[0] + 3,
                                    BB[1] - 26
                                ], [
                                    R[0] + 2,
                                    R[1] - 11
                                ], 90, {
                                    wobble: 1
                                }),
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chain,
                                strokeWidth: 3
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Bicycle.tsx",
                                lineNumber: 210,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
                                    BB[0] - 2,
                                    BB[1] + 26
                                ], [
                                    R[0],
                                    R[1] + 11
                                ], 91, {
                                    wobble: 1
                                }),
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].chain,
                                strokeWidth: 3
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Bicycle.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/loader/Bicycle.tsx",
                        lineNumber: 209,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 186,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Notes, {}, void 0, false, {
                fileName: "[project]/src/components/loader/Bicycle.tsx",
                lineNumber: 215,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/loader/Bicycle.tsx",
        lineNumber: 176,
        columnNumber: 7
    }, this);
}));
_c6 = Bicycle;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Stroke");
__turbopack_context__.k.register(_c1, "Tube");
__turbopack_context__.k.register(_c2, "Wheel");
__turbopack_context__.k.register(_c3, "Notes");
__turbopack_context__.k.register(_c4, "Bicycle$memo$forwardRef");
__turbopack_context__.k.register(_c5, "Bicycle$memo");
__turbopack_context__.k.register(_c6, "Bicycle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/loader/Doodles.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StarDoodle",
    ()=>StarDoodle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sketch.ts [app-client] (ecmascript)");
;
;
function StarDoodle({ className, color = 'var(--ink)', seed = 1, at = 0.04, dur = 0.05 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 48 48",
        "aria-hidden": true,
        "data-fade": "",
        "data-at": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(at),
        "data-dur": (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["n3"])(dur),
        style: {
            overflow: 'visible'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleStar"])(24, 25, 18, seed),
            fill: "none",
            stroke: color,
            strokeWidth: 3,
            strokeLinecap: "round",
            strokeLinejoin: "round"
        }, void 0, false, {
            fileName: "[project]/src/components/loader/Doodles.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/loader/Doodles.tsx",
        lineNumber: 15,
        columnNumber: 5
    }, this);
}
_c = StarDoodle;
var _c;
__turbopack_context__.k.register(_c, "StarDoodle");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/loader/Loader.module.css [app-client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bar": "Loader-module__uyoLiW__bar",
  "bikeWrap": "Loader-module__uyoLiW__bikeWrap",
  "caption": "Loader-module__uyoLiW__caption",
  "edge": "Loader-module__uyoLiW__edge",
  "pct": "Loader-module__uyoLiW__pct",
  "pctRow": "Loader-module__uyoLiW__pctRow",
  "pctSign": "Loader-module__uyoLiW__pctSign",
  "progress": "Loader-module__uyoLiW__progress",
  "root": "Loader-module__uyoLiW__root",
  "rpm": "Loader-module__uyoLiW__rpm",
  "scrap": "Loader-module__uyoLiW__scrap",
  "shadow": "Loader-module__uyoLiW__shadow",
  "sheet": "Loader-module__uyoLiW__sheet",
  "stage": "Loader-module__uyoLiW__stage",
  "starInk": "Loader-module__uyoLiW__starInk",
  "starPink": "Loader-module__uyoLiW__starPink",
  "tr": "Loader-module__uyoLiW__tr",
  "track": "Loader-module__uyoLiW__track",
});
}),
"[project]/src/components/loader/Loader.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Loader",
    ()=>Loader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sketch.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/loader/Bicycle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Doodles$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/loader/Doodles.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/loader/loaderMath.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$tear$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/loader/tear.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$useAssetProgress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/loader/useAssetProgress.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/components/loader/Loader.module.css [app-client] (css module)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
const BAR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["scribbleLine"])([
    6,
    9
], [
    254,
    7
], 3, {
    wobble: 2
});
const num = (el, key)=>Number(el.dataset[key] ?? 0);
function Loader({ assets, minDuration = 4200, onExitStart, onComplete }) {
    _s();
    const rootRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const svgRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const pctRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const barRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const rpmRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const captionRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [done, setDone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const assetProgress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$useAssetProgress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssetProgress"])(assets);
    // колбэки держим в ref, чтобы эффект с анимацией не перезапускался при смене пропсов
    const callbacks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        onExitStart,
        onComplete
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Loader.useEffect": ()=>{
            callbacks.current = {
                onExitStart,
                onComplete
            };
        }
    }["Loader.useEffect"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Loader.useEffect": ()=>{
            const root = rootRef.current;
            const svg = svgRef.current;
            const pct = pctRef.current;
            const bar = barRef.current;
            const rpm = rpmRef.current;
            const caption = captionRef.current;
            if (!root || !svg || !pct || !bar || !rpm || !caption) return;
            const html = document.documentElement;
            html.classList.add('is-loading');
            const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            const bike = svg.querySelector('[data-part="bike"]');
            const wheel = svg.querySelector('[data-part="rear-wheel"]');
            const spokes = svg.querySelector('[data-part="spokes"]');
            const blur = svg.querySelector('[data-part="blur"]');
            const notes = svg.querySelector('[data-part="notes"]');
            let shown = 0; // сглаженный прогресс 0..1 — единственный источник правды для всего
            let angle = 0; // накопленный угол заднего колеса
            let exiting = false;
            let lastPct = -1;
            let lastRpm = -1;
            let lastStage = 0;
            let tickFn = null;
            const start = performance.now();
            let last = start;
            const ctx = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].context({
                "Loader.useEffect.ctx": ()=>{
                    const q = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].utils.selector(root);
                    // ── 1. Мастер-таймлайн длиной ровно 1: время таймлайна = прогресс загрузки ──
                    const tl = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline({
                        paused: true
                    });
                    q('[data-draw]').forEach({
                        "Loader.useEffect.ctx": (el)=>{
                            const at = num(el, 'at');
                            tl.set(el, {
                                opacity: 1
                            }, at).to(el, {
                                strokeDashoffset: 0,
                                duration: num(el, 'dur'),
                                ease: 'power1.inOut'
                            }, at);
                        }
                    }["Loader.useEffect.ctx"]);
                    q('[data-fade]').forEach({
                        "Loader.useEffect.ctx": (el)=>{
                            tl.fromTo(el, {
                                opacity: 0
                            }, {
                                opacity: 1,
                                duration: num(el, 'dur') || 0.04,
                                ease: 'power1.out'
                            }, num(el, 'at'));
                        }
                    }["Loader.useEffect.ctx"]);
                    // 95–100%: велосипед чуть подаётся вперёд (переднее колесо при этом НЕ вращается)
                    tl.to(bike, {
                        x: 26,
                        duration: 0.05,
                        ease: 'power2.in'
                    }, 0.95);
                    const setBob = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].quickSetter(bike, 'y', 'px');
                    // ── 2. Выход: рывок вперёд → лист бумаги рвётся и уезжает вверх ──
                    const startExit = {
                        "Loader.useEffect.ctx.startExit": ()=>{
                            exiting = true;
                            const exit = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].timeline({
                                onComplete: finish
                            });
                            if (reduced) {
                                exit.to(root, {
                                    opacity: 0,
                                    duration: 0.4
                                });
                                callbacks.current.onExitStart?.();
                                return;
                            }
                            exit.to(notes, {
                                opacity: 0,
                                duration: 0.25
                            }).to(bike, {
                                x: '+=54',
                                duration: 0.7,
                                ease: 'power3.out'
                            }, 0).call({
                                "Loader.useEffect.ctx.startExit": ()=>callbacks.current.onExitStart?.()
                            }["Loader.useEffect.ctx.startExit"], undefined, '>+0.12').to(root, {
                                y: {
                                    "Loader.useEffect.ctx.startExit": ()=>-(root.offsetHeight + 140)
                                }["Loader.useEffect.ctx.startExit"],
                                rotation: -0.7,
                                transformOrigin: '0% 100%',
                                duration: 1,
                                ease: 'power3.inOut'
                            }, '<');
                        }
                    }["Loader.useEffect.ctx.startExit"];
                    // ── 3. Один тикер на всё: прогресс → таймлайн, колесо, счётчик ──
                    const tick = {
                        "Loader.useEffect.ctx.tick": ()=>{
                            const now = performance.now();
                            const dt = Math.min(0.05, (now - last) / 1000);
                            last = now;
                            const elapsed = (now - start) / 1000;
                            // не быстрее реальной загрузки и не быстрее «сценария» по времени
                            const target = Math.min(assetProgress.current, (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["timeToProgress"])(elapsed / (minDuration / 1000)));
                            shown += (target - shown) * (1 - Math.exp(-dt * 9));
                            if (target >= 1 && shown > 0.9985) shown = 1;
                            if (!exiting) tl.time(shown);
                            // колесо: угол интегрируем из скорости, поэтому оно не «прыгает» при смене стадии
                            let speed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["wheelSpeed"])(shown);
                            if (reduced) speed = Math.min(speed, 90);
                            angle = (angle + speed * dt) % 360;
                            wheel.setAttribute('transform', `rotate(${angle.toFixed(2)})`);
                            // на большой скорости спицы сливаются (иначе — эффект «колеса в кино»), проступают дуги
                            spokes.style.opacity = String(1 - (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])((speed - 450) / 400));
                            blur.style.opacity = String((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["smoothstep"])((speed - 350) / 550) * 0.85);
                            // лёгкая вибрация рамы, растёт со скоростью
                            if (!reduced) setBob(Math.sin(elapsed * 23) * (speed / 1000) * 1.7);
                            // ── HUD ──
                            const p = Math.floor(shown * 100);
                            if (p !== lastPct) {
                                lastPct = p;
                                pct.textContent = String(p);
                            }
                            bar.style.strokeDashoffset = String(1 - shown);
                            const r = Math.round(speed / 6);
                            if (r !== lastRpm) {
                                lastRpm = r;
                                rpm.textContent = String(r);
                            }
                            const stage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["stageAt"])(shown);
                            if (stage !== lastStage) {
                                lastStage = stage;
                                caption.textContent = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGES"][stage].label;
                                if (!reduced) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].fromTo(caption, {
                                    y: 6,
                                    opacity: 0
                                }, {
                                    y: 0,
                                    opacity: 1,
                                    duration: 0.25,
                                    overwrite: true
                                });
                            }
                            if (shown >= 1 && !exiting) ctx.add(startExit);
                        }
                    }["Loader.useEffect.ctx.tick"];
                    const finish = {
                        "Loader.useEffect.ctx.finish": ()=>{
                            if (tickFn) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].ticker.remove(tickFn);
                            root.style.display = 'none';
                            html.classList.remove('is-loading');
                            setDone(true);
                            callbacks.current.onComplete?.();
                        }
                    }["Loader.useEffect.ctx.finish"];
                    tickFn = tick;
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].ticker.add(tick);
                }
            }["Loader.useEffect.ctx"], root);
            return ({
                "Loader.useEffect": ()=>{
                    if (tickFn) __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"].ticker.remove(tickFn);
                    ctx.revert();
                    html.classList.remove('is-loading');
                }
            })["Loader.useEffect"];
        // minDuration/assetProgress стабильны на время жизни лоадера
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Loader.useEffect"], []);
    if (done) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: rootRef,
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].root,
        "data-loader": "",
        role: "status",
        "aria-label": "Loading",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].shadow
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].edge,
                style: {
                    clipPath: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$tear$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEAR"].edge
                }
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].sheet} paper-surface`,
                style: {
                    clipPath: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$tear$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TEAR"].sheet
                }
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Doodles$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarDoodle"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].starInk,
                seed: 3,
                at: 0.03
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].tr,
                "data-fade": "",
                "data-at": "0.05",
                "data-dur": "0.05",
                children: [
                    "SPB / REMOTE",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 199,
                        columnNumber: 9
                    }, this),
                    "2026"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].stage,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bikeWrap,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Bicycle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Bicycle"], {
                        ref: svgRef
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/loader/Loader.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Doodles$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StarDoodle"], {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].starPink,
                color: "var(--pink)",
                seed: 9,
                at: 0.24
            }, void 0, false, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].scrap,
                "data-fade": "",
                "data-at": "0.02",
                "data-dur": "0.06",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        ref: captionRef,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].caption,
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$loaderMath$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["STAGES"][0].label
                    }, void 0, false, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 212,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pctRow,
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: pctRef,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pct,
                                children: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Loader.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].pctSign,
                                children: "%"
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Loader.tsx",
                                lineNumber: 219,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 215,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].progress,
                        viewBox: "0 0 260 16",
                        "aria-hidden": true,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: BAR,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].track
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Loader.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                ref: barRef,
                                d: BAR,
                                pathLength: 1,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].bar
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Loader.tsx",
                                lineNumber: 223,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$Loader$2e$module$2e$css__$5b$app$2d$client$5d$__$28$css__module$29$__["default"].rpm,
                        children: [
                            "rear wheel: ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                ref: rpmRef,
                                children: "0"
                            }, void 0, false, {
                                fileName: "[project]/src/components/loader/Loader.tsx",
                                lineNumber: 226,
                                columnNumber: 23
                            }, this),
                            " rpm"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/loader/Loader.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/loader/Loader.tsx",
                lineNumber: 211,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/loader/Loader.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_s(Loader, "eQ1pv3LdkF4bd+Gqmwh75JaE7jE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$loader$2f$useAssetProgress$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAssetProgress"]
    ];
});
_c = Loader;
var _c;
__turbopack_context__.k.register(_c, "Loader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/loader/loaderMath.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Чистая математика загрузчика: прогресс → скорость колеса, стадии, время. */ __turbopack_context__.s([
    "STAGES",
    ()=>STAGES,
    "clamp01",
    ()=>clamp01,
    "lerp",
    ()=>lerp,
    "smoothstep",
    ()=>smoothstep,
    "stageAt",
    ()=>stageAt,
    "timeToProgress",
    ()=>timeToProgress,
    "wheelSpeed",
    ()=>wheelSpeed
]);
const clamp01 = (n)=>Math.min(1, Math.max(0, n));
const lerp = (a, b, t)=>a + (b - a) * t;
const smoothstep = (t)=>{
    const x = clamp01(t);
    return x * x * (3 - 2 * x);
};
/**
 * Время → «желаемый» прогресс. Кусочно-линейно, чтобы каждая стадия получила своё время:
 * появление велосипеда (0–30%) ≈ 28% времени, раскрутка колеса (30–70%) ≈ 36%,
 * разгон (70–95%) ≈ 24%, финальный рывок (95–100%) ≈ 12%.
 */ const TIME_KEYS = [
    [
        0,
        0
    ],
    [
        0.28,
        0.3
    ],
    [
        0.64,
        0.7
    ],
    [
        0.88,
        0.95
    ],
    [
        1,
        1
    ]
];
function timeToProgress(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    for(let i = 1; i < TIME_KEYS.length; i++){
        const [t1, p1] = TIME_KEYS[i];
        const [t0, p0] = TIME_KEYS[i - 1];
        if (t <= t1) return lerp(p0, p1, (t - t0) / (t1 - t0));
    }
    return 1;
}
function wheelSpeed(p) {
    if (p < 0.3) return 0; //            велосипед ещё рисуется
    if (p < 0.7) return lerp(0, 150, Math.pow((p - 0.3) / 0.4, 1.4)); //  медленно трогается
    if (p < 0.95) return lerp(150, 620, Math.pow((p - 0.7) / 0.25, 2)); // разгоняется
    return lerp(620, 1000, smoothstep((p - 0.95) / 0.05)); //             финальный рывок
}
const STAGES = [
    {
        from: 0,
        label: 'unfolding the bike'
    },
    {
        from: 0.3,
        label: 'warming up the back wheel'
    },
    {
        from: 0.7,
        label: 'pedalling a bit harder'
    },
    {
        from: 0.95,
        label: 'nearly there'
    },
    {
        from: 1,
        label: 'go'
    }
];
function stageAt(p) {
    let idx = 0;
    STAGES.forEach((s, i)=>{
        if (p >= s.from) idx = i;
    });
    return idx;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/loader/tear.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TEAR",
    ()=>TEAR
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/sketch.ts [app-client] (ecmascript)");
;
const TEAR = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$sketch$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["tornClips"])(7);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/loader/useAssetProgress.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAssetProgress",
    ()=>useAssetProgress
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const NONE = [];
function useAssetProgress(urls = NONE) {
    _s();
    const progress = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAssetProgress.useEffect": ()=>{
            progress.current = 0;
            let cancelled = false;
            let done = 0;
            const total = urls.length + 2;
            const track = {
                "useAssetProgress.useEffect.track": (p)=>p.catch({
                        "useAssetProgress.useEffect.track": ()=>undefined
                    }["useAssetProgress.useEffect.track"]) // битая картинка не должна вешать загрузку
                    .finally({
                        "useAssetProgress.useEffect.track": ()=>{
                            if (cancelled) return;
                            done += 1;
                            progress.current = Math.min(1, done / total);
                        }
                    }["useAssetProgress.useEffect.track"])
            }["useAssetProgress.useEffect.track"];
            track(document.fonts?.ready ?? Promise.resolve());
            track(document.readyState === 'complete' ? Promise.resolve() : new Promise({
                "useAssetProgress.useEffect": (resolve)=>window.addEventListener('load', resolve, {
                        once: true
                    })
            }["useAssetProgress.useEffect"]));
            urls.forEach({
                "useAssetProgress.useEffect": (src)=>track(new Promise({
                        "useAssetProgress.useEffect": (resolve, reject)=>{
                            const img = new Image();
                            img.onload = resolve;
                            img.onerror = reject;
                            img.src = src;
                        }
                    }["useAssetProgress.useEffect"]))
            }["useAssetProgress.useEffect"]);
            return ({
                "useAssetProgress.useEffect": ()=>{
                    cancelled = true;
                }
            })["useAssetProgress.useEffect"];
        }
    }["useAssetProgress.useEffect"], [
        urls
    ]);
    return progress;
}
_s(useAssetProgress, "dh9QVNKwuuwkPYuqX7bVx3ZhR68=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/sketch.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Генераторы «нарисованной от руки» геометрии для SVG.
 * Всё детерминировано (seed) — на сервере и клиенте получается один и тот же путь,
 * поэтому hydration mismatch невозможен.
 */ __turbopack_context__.s([
    "n3",
    ()=>n3,
    "rng",
    ()=>rng,
    "scribbleArrow",
    ()=>scribbleArrow,
    "scribbleCircle",
    ()=>scribbleCircle,
    "scribbleLine",
    ()=>scribbleLine,
    "scribblePoly",
    ()=>scribblePoly,
    "scribbleStar",
    ()=>scribbleStar,
    "tornClips",
    ()=>tornClips
]);
function rng(seed) {
    let a = seed >>> 0;
    return ()=>{
        a = a + 0x6d2b79f5 >>> 0;
        let t = a;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}
const n1 = (n)=>Math.round(n * 10) / 10;
const n3 = (n)=>Math.round(n * 1000) / 1000;
const pt = (p)=>`${n1(p[0])} ${n1(p[1])}`;
/** Catmull-Rom сплайн через точки → цепочка кубических Безье */ function spline(pts) {
    const P = (i)=>pts[Math.min(pts.length - 1, Math.max(0, i))];
    let d = `M${pt(P(0))}`;
    for(let i = 0; i < pts.length - 1; i++){
        const p0 = P(i - 1);
        const p1 = P(i);
        const p2 = P(i + 1);
        const p3 = P(i + 2);
        const c1 = [
            p1[0] + (p2[0] - p0[0]) / 6,
            p1[1] + (p2[1] - p0[1]) / 6
        ];
        const c2 = [
            p2[0] - (p3[0] - p1[0]) / 6,
            p2[1] - (p3[1] - p1[1]) / 6
        ];
        d += `C${pt(c1)} ${pt(c2)} ${pt(p2)}`;
    }
    return d;
}
function scribbleCircle(cx, cy, r, seed, opts = {}) {
    const rand = rng(seed);
    const { sweep = 1.09, jitter = 0.012, drift = 0.025 } = opts;
    const start = opts.start ?? rand() * Math.PI * 2;
    const n = Math.max(8, Math.round(16 * Math.min(1, sweep) + 4));
    const pts = [];
    for(let i = 0; i <= n; i++){
        const t = i / n;
        const a = start + t * sweep * Math.PI * 2;
        const rr = r * (1 + drift * (t - 0.5) + (rand() - 0.5) * 2 * jitter);
        pts.push([
            cx + Math.cos(a) * rr,
            cy + Math.sin(a) * rr
        ]);
    }
    return spline(pts);
}
function scribbleLine(a, b, seed, { wobble = 1.4, overshoot = 0 } = {}) {
    const rand = rng(seed);
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const nx = -uy;
    const ny = ux;
    const s = [
        a[0] - ux * overshoot * rand(),
        a[1] - uy * overshoot * rand()
    ];
    const e = [
        b[0] + ux * overshoot * rand(),
        b[1] + uy * overshoot * rand()
    ];
    const k = Math.max(2, Math.round(len / 60));
    const pts = [
        s
    ];
    for(let i = 1; i < k; i++){
        const t = i / k;
        const off = (rand() - 0.5) * 2 * wobble;
        pts.push([
            s[0] + (e[0] - s[0]) * t + nx * off,
            s[1] + (e[1] - s[1]) * t + ny * off
        ]);
    }
    pts.push(e);
    return spline(pts);
}
function scribblePoly(points, seed, wobble = 1.5) {
    const rand = rng(seed);
    return points.map((p, i)=>{
        const q = [
            p[0] + (rand() - 0.5) * 2 * wobble,
            p[1] + (rand() - 0.5) * 2 * wobble
        ];
        return `${i ? 'L' : 'M'}${pt(q)}`;
    }).join('');
}
function scribbleArrow(from, ctrl, to, seed, size = 11) {
    const rand = rng(seed);
    const shaft = `M${pt(from)}Q${pt(ctrl)} ${pt(to)}`;
    const ang = Math.atan2(to[1] - ctrl[1], to[0] - ctrl[0]);
    const wing = (spread)=>{
        const l = size * (0.9 + rand() * 0.25);
        return [
            to[0] - Math.cos(ang + spread) * l,
            to[1] - Math.sin(ang + spread) * l
        ];
    };
    const head = `M${pt(wing(0.5))}L${pt(to)}L${pt(wing(-0.5))}`;
    return {
        shaft,
        head
    };
}
function scribbleStar(cx, cy, r, seed) {
    const rand = rng(seed);
    const order = [
        0,
        2,
        4,
        1,
        3,
        0,
        2
    ];
    return order.map((k, i)=>{
        const a = -Math.PI / 2 + k * (Math.PI * 2 / 5);
        const rr = r * (1 + (rand() - 0.5) * 0.12);
        return `${i ? 'L' : 'M'}${pt([
            cx + Math.cos(a) * rr,
            cy + Math.sin(a) * rr
        ])}`;
    }).join('');
}
function tornClips(seed, steps = 52) {
    const rand = rng(seed);
    const sheet = [];
    const edge = [];
    let y = 0;
    for(let i = 0; i <= steps; i++){
        y = y * 0.6 + (rand() - 0.5) * 20; // коррелированный шум — крупные «зубцы»
        const jag = (rand() - 0.5) * 6; // мелкая зазубренность
        sheet.push(y + jag);
        edge.push(y + jag * 0.5 + 4 + rand() * 4); // бахрома выступает на 4–8px
    }
    const build = (ys, base)=>{
        const pts = [
            '0 0',
            '100% 0'
        ];
        for(let i = steps; i >= 0; i--){
            pts.push(`${n1(i / steps * 100)}% calc(100% - ${n1(base - ys[i])}px)`);
        }
        return `polygon(${pts.join(',')})`;
    };
    return {
        sheet: build(sheet, 30),
        edge: build(edge, 30)
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0wiy6g7._.js.map