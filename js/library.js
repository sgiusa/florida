function extensions(t) {
    return {
        initialize: function(i) {
            t.prototype.initialize.call(this, i), this._originalLayers = [], this._visibleLayers = [], this._staticLayers = [], this._rbush = [], this._cachedRelativeBoxes = [], this._margin = i.margin || 0, this._rbush = null
        },
        addLayer: function(i) {
            return "options" in i && "icon" in i.options ? (this._originalLayers.push(i), void(this._map && this._maybeAddLayerToRBush(i))) : (this._staticLayers.push(i), void t.prototype.addLayer.call(this, i))
        },
        removeLayer: function(i) {
            this._rbush.remove(this._cachedRelativeBoxes[i._leaflet_id]), delete this._cachedRelativeBoxes[i._leaflet_id], t.prototype.removeLayer.call(this, i);
            var e;
            e = this._originalLayers.indexOf(i), -1 !== e && this._originalLayers.splice(e, 1), e = this._visibleLayers.indexOf(i), -1 !== e && this._visibleLayers.splice(e, 1), e = this._staticLayers.indexOf(i), -1 !== e && this._staticLayers.splice(e, 1)
        },
        clearLayers: function() {
            this._rbush = rbush(), this._originalLayers = [], this._visibleLayers = [], this._staticLayers = [], this._cachedRelativeBoxes = [], t.prototype.clearLayers.call(this)
        },
        onAdd: function(t) {
            this._map = t;
            for (var i in this._staticLayers) t.addLayer(this._staticLayers[i]);
            this._onZoomEnd(), t.on("zoomend", this._onZoomEnd, this)
        },
        onRemove: function(i) {
            for (var e in this._staticLayers) i.removeLayer(this._staticLayers[e]);
            i.off("zoomend", this._onZoomEnd, this), t.prototype.onRemove.call(this, i)
        },
        _maybeAddLayerToRBush: function(i) {
            var e = (this._map.getZoom(), this._rbush),
                n = this._cachedRelativeBoxes[i._leaflet_id],
                o = !1;
            if (!n) {
                t.prototype.addLayer.call(this, i);
                var o = !0,
                    r = this._getIconBox(i._icon);
                n = this._getRelativeBoxes(i._icon.children, r), n.push(r), this._cachedRelativeBoxes[i._leaflet_id] = n
            }
            n = this._positionBoxes(this._map.latLngToLayerPoint(i.getLatLng()), n);
            for (var s = !1, a = 0; a < n.length && !s; a++) s = e.search(n[a]).length > 0;
            s ? t.prototype.removeLayer.call(this, i) : (o || t.prototype.addLayer.call(this, i), this._visibleLayers.push(i), e.load(n))
        },
        _getIconBox: function(t) {
            if (isMSIE8) return [0, 0, t.offsetWidth, t.offsetHeight];
            var i = window.getComputedStyle(t);
            return [parseInt(i.marginLeft), parseInt(i.marginTop), parseInt(i.marginLeft) + parseInt(i.width), parseInt(i.marginTop) + parseInt(i.height)]
        },
        _getRelativeBoxes: function(t, i) {
            for (var e = [], n = 0; n < t.length; n++) {
                var o = t[n],
                    r = [o.offsetLeft, o.offsetTop, o.offsetLeft + o.offsetWidth, o.offsetTop + o.offsetHeight];
                if (r = this._offsetBoxes(r, i), e.push(r), o.children.length) {
                    var s = i;
                    if (!isMSIE8) {
                        var a = window.getComputedStyle(o).position;
                        ("absolute" === a || "relative" === a) && (s = r)
                    }
                    e = e.concat(this._getRelativeBoxes(o.children, s))
                }
            }
            return e
        },
        _offsetBoxes: function(t, i) {
            return [t[0] + i[0], t[1] + i[1], t[2] + i[0], t[3] + i[1]]
        },
        _positionBoxes: function(t, i) {
            for (var e = [], n = 0; n < i.length; n++) e.push(this._positionBox(t, i[n]));
            return e
        },
        _positionBox: function(t, i) {
            return [i[0] + t.x - this._margin, i[1] + t.y - this._margin, i[2] + t.x + this._margin, i[3] + t.y + this._margin]
        },
        _onZoomEnd: function() {
            for (var i = 0; i < this._visibleLayers.length; i++) t.prototype.removeLayer.call(this, this._visibleLayers[i]);
            this._rbush = rbush();
            for (var i = 0; i < this._originalLayers.length; i++) this._maybeAddLayerToRBush(this._originalLayers[i])
        }
    }
}! function() {
    "use strict";

    function t(i, e) {
        return this instanceof t ? (this._maxEntries = Math.max(4, i || 9), this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)), e && this._initFormat(e), void this.clear()) : new t(i, e)
    }

    function i(t, i) {
        t.bbox = e(t, 0, t.children.length, i)
    }

    function e(t, i, e, r) {
        for (var s, a = n(), h = i; e > h; h++) s = t.children[h], o(a, t.leaf ? r(s) : s.bbox);
        return a
    }

    function n() {
        return [1 / 0, 1 / 0, -1 / 0, -1 / 0]
    }

    function o(t, i) {
        return t[0] = Math.min(t[0], i[0]), t[1] = Math.min(t[1], i[1]), t[2] = Math.max(t[2], i[2]), t[3] = Math.max(t[3], i[3]), t
    }

    function r(t, i) {
        return t.bbox[0] - i.bbox[0]
    }

    function s(t, i) {
        return t.bbox[1] - i.bbox[1]
    }

    function a(t) {
        return (t[2] - t[0]) * (t[3] - t[1])
    }

    function h(t) {
        return t[2] - t[0] + (t[3] - t[1])
    }

    function l(t, i) {
        return (Math.max(i[2], t[2]) - Math.min(i[0], t[0])) * (Math.max(i[3], t[3]) - Math.min(i[1], t[1]))
    }

    function u(t, i) {
        var e = Math.max(t[0], i[0]),
            n = Math.max(t[1], i[1]),
            o = Math.min(t[2], i[2]),
            r = Math.min(t[3], i[3]);
        return Math.max(0, o - e) * Math.max(0, r - n)
    }

    function c(t, i) {
        return t[0] <= i[0] && t[1] <= i[1] && i[2] <= t[2] && i[3] <= t[3]
    }

    function f(t, i) {
        return i[0] <= t[2] && i[1] <= t[3] && i[2] >= t[0] && i[3] >= t[1]
    }

    function d(t, i, e, n, o) {
        for (var r, s = [i, e]; s.length;) e = s.pop(), i = s.pop(), n >= e - i || (r = i + Math.ceil((e - i) / n / 2) * n, p(t, i, e, r, o), s.push(i, r, r, e))
    }

    function p(t, i, e, n, o) {
        for (var r, s, a, h, l, u, c, f, d; e > i;) {
            for (e - i > 600 && (r = e - i + 1, s = n - i + 1, a = Math.log(r), h = .5 * Math.exp(2 * a / 3), l = .5 * Math.sqrt(a * h * (r - h) / r) * (0 > s - r / 2 ? -1 : 1), u = Math.max(i, Math.floor(n - s * h / r + l)), c = Math.min(e, Math.floor(n + (r - s) * h / r + l)), p(t, u, c, n, o)), f = t[n], s = i, d = e, _(t, i, n), o(t[e], f) > 0 && _(t, i, e); d > s;) {
                for (_(t, s, d), s++, d--; o(t[s], f) < 0;) s++;
                for (; o(t[d], f) > 0;) d--
            }
            0 === o(t[i], f) ? _(t, i, d) : (d++, _(t, d, e)), n >= d && (i = d + 1), d >= n && (e = d - 1)
        }
    }

    function _(t, i, e) {
        var n = t[i];
        t[i] = t[e], t[e] = n
    }
    t.prototype = {
        all: function() {
            return this._all(this.data, [])
        },
        search: function(t) {
            var i = this.data,
                e = [],
                n = this.toBBox;
            if (!f(t, i.bbox)) return e;
            for (var o, r, s, a, h = []; i;) {
                for (o = 0, r = i.children.length; r > o; o++) s = i.children[o], a = i.leaf ? n(s) : s.bbox, f(t, a) && (i.leaf ? e.push(s) : c(t, a) ? this._all(s, e) : h.push(s));
                i = h.pop()
            }
            return e
        },
        load: function(t) {
            if (!t || !t.length) return this;
            if (t.length < this._minEntries) {
                for (var i = 0, e = t.length; e > i; i++) this.insert(t[i]);
                return this
            }
            var n = this._build(t.slice(), 0, t.length - 1, 0);
            if (this.data.children.length)
                if (this.data.height === n.height) this._splitRoot(this.data, n);
                else {
                    if (this.data.height < n.height) {
                        var o = this.data;
                        this.data = n, n = o
                    }
                    this._insert(n, this.data.height - n.height - 1, !0)
                } else this.data = n;
            return this
        },
        insert: function(t) {
            return t && this._insert(t, this.data.height - 1), this
        },
        clear: function() {
            return this.data = {
                children: [],
                height: 1,
                bbox: n(),
                leaf: !0
            }, this
        },
        remove: function(t) {
            if (!t) return this;
            for (var i, e, n, o, r = this.data, s = this.toBBox(t), a = [], h = []; r || a.length;) {
                if (r || (r = a.pop(), e = a[a.length - 1], i = h.pop(), o = !0), r.leaf && (n = r.children.indexOf(t), -1 !== n)) return r.children.splice(n, 1), a.push(r), this._condense(a), this;
                o || r.leaf || !c(r.bbox, s) ? e ? (i++, r = e.children[i], o = !1) : r = null : (a.push(r), h.push(i), i = 0, e = r, r = r.children[0])
            }
            return this
        },
        toBBox: function(t) {
            return t
        },
        compareMinX: function(t, i) {
            return t[0] - i[0]
        },
        compareMinY: function(t, i) {
            return t[1] - i[1]
        },
        toJSON: function() {
            return this.data
        },
        fromJSON: function(t) {
            return this.data = t, this
        },
        _all: function(t, i) {
            for (var e = []; t;) t.leaf ? i.push.apply(i, t.children) : e.push.apply(e, t.children), t = e.pop();
            return i
        },
        _build: function(t, e, n, o) {
            var r, s = n - e + 1,
                a = this._maxEntries;
            if (a >= s) return r = {
                children: t.slice(e, n + 1),
                height: 1,
                bbox: null,
                leaf: !0
            }, i(r, this.toBBox), r;
            o || (o = Math.ceil(Math.log(s) / Math.log(a)), a = Math.ceil(s / Math.pow(a, o - 1))), r = {
                children: [],
                height: o,
                bbox: null
            };
            var h, l, u, c, f = Math.ceil(s / a),
                p = f * Math.ceil(Math.sqrt(a));
            for (d(t, e, n, p, this.compareMinX), h = e; n >= h; h += p)
                for (u = Math.min(h + p - 1, n), d(t, h, u, f, this.compareMinY), l = h; u >= l; l += f) c = Math.min(l + f - 1, u), r.children.push(this._build(t, l, c, o - 1));
            return i(r, this.toBBox), r
        },
        _chooseSubtree: function(t, i, e, n) {
            for (var o, r, s, h, u, c, f, d;;) {
                if (n.push(i), i.leaf || n.length - 1 === e) break;
                for (f = d = 1 / 0, o = 0, r = i.children.length; r > o; o++) s = i.children[o], u = a(s.bbox), c = l(t, s.bbox) - u, d > c ? (d = c, f = f > u ? u : f, h = s) : c === d && f > u && (f = u, h = s);
                i = h
            }
            return i
        },
        _insert: function(t, i, e) {
            var n = this.toBBox,
                r = e ? t.bbox : n(t),
                s = [],
                a = this._chooseSubtree(r, this.data, i, s);
            for (a.children.push(t), o(a.bbox, r); i >= 0 && s[i].children.length > this._maxEntries;) this._split(s, i), i--;
            this._adjustParentBBoxes(r, s, i)
        },
        _split: function(t, e) {
            var n = t[e],
                o = n.children.length,
                r = this._minEntries;
            this._chooseSplitAxis(n, r, o);
            var s = {
                children: n.children.splice(this._chooseSplitIndex(n, r, o)),
                height: n.height
            };
            n.leaf && (s.leaf = !0), i(n, this.toBBox), i(s, this.toBBox), e ? t[e - 1].children.push(s) : this._splitRoot(n, s)
        },
        _splitRoot: function(t, e) {
            this.data = {
                children: [t, e],
                height: t.height + 1
            }, i(this.data, this.toBBox)
        },
        _chooseSplitIndex: function(t, i, n) {
            var o, r, s, h, l, c, f, d;
            for (c = f = 1 / 0, o = i; n - i >= o; o++) r = e(t, 0, o, this.toBBox), s = e(t, o, n, this.toBBox), h = u(r, s), l = a(r) + a(s), c > h ? (c = h, d = o, f = f > l ? l : f) : h === c && f > l && (f = l, d = o);
            return d
        },
        _chooseSplitAxis: function(t, i, e) {
            var n = t.leaf ? this.compareMinX : r,
                o = t.leaf ? this.compareMinY : s,
                a = this._allDistMargin(t, i, e, n),
                h = this._allDistMargin(t, i, e, o);
            h > a && t.children.sort(n)
        },
        _allDistMargin: function(t, i, n, r) {
            t.children.sort(r);
            var s, a, l = this.toBBox,
                u = e(t, 0, i, l),
                c = e(t, n - i, n, l),
                f = h(u) + h(c);
            for (s = i; n - i > s; s++) a = t.children[s], o(u, t.leaf ? l(a) : a.bbox), f += h(u);
            for (s = n - i - 1; s >= i; s--) a = t.children[s], o(c, t.leaf ? l(a) : a.bbox), f += h(c);
            return f
        },
        _adjustParentBBoxes: function(t, i, e) {
            for (var n = e; n >= 0; n--) o(i[n].bbox, t)
        },
        _condense: function(t) {
            for (var e, n = t.length - 1; n >= 0; n--) 0 === t[n].children.length ? n > 0 ? (e = t[n - 1].children, e.splice(e.indexOf(t[n]), 1)) : this.clear() : i(t[n], this.toBBox)
        },
        _initFormat: function(t) {
            var i = ["return a", " - b", ";"];
            this.compareMinX = new Function("a", "b", i.join(t[0])), this.compareMinY = new Function("a", "b", i.join(t[1])), this.toBBox = new Function("a", "return [a" + t.join(", a") + "];")
        }
    }, "function" == typeof define && define.amd ? define("rbush", function() {
        return t
    }) : "undefined" != typeof module ? module.exports = t : "undefined" != typeof self ? self.rbush = t : window.rbush = t
}();
var isMSIE8 = !("getComputedStyle" in window && "function" == typeof window.getComputedStyle);
L.LayerGroup.Collision = L.LayerGroup.extend(extensions(L.LayerGroup)), L.FeatureGroup.Collision = L.FeatureGroup.extend(extensions(L.FeatureGroup)), L.GeoJSON.Collision = L.GeoJSON.extend(extensions(L.GeoJSON)), L.LayerGroup.collision = function(t) {
    return new L.LayerGroup.Collision(t || {})
}, L.FeatureGroup.collision = function(t) {
    return new L.FeatureGroup.Collision(t || {})
}, L.GeoJSON.collision = function(t) {
    return new L.GeoJSON.Collision(t || {})
}, L.layerGroup.collision = function(t) {
    return new L.LayerGroup.Collision(t || {})
}, L.featureGroup.collision = function(t) {
    return new L.FeatureGroup.Collision(t || {})
}, L.geoJson.collision = function(t) {
    return new L.GeoJSON.Collision(t || {})
};