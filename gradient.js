function e(e) {
    return [(e >> 16 & 255) / 255, (e >> 8 & 255) / 255, (255 & e) / 255]
}
["SCREEN", "LINEAR_LIGHT"].reduce((e,t,n)=>Object.assign(e, {
    [t]: n
}), {});
class n {
    constructor(e, t, n, i=!1) {
        const d = this
          , s = -1 !== document.location.search.toLowerCase().indexOf("debug=webgl")
          , a = (d.canvas = e,
        d.gl = d.canvas.getContext("webgl", {
            antialias: !0
        }),
        d.meshes = [],
        d.gl);
        t && n && this.setSize(t, n),
        d.lastDebugMsg,
        d.debug = i && s ? function(e) {
            var t = new Date;
            1e3 < t - d.lastDebugMsg && console.log("---"),
            console.log(t.toLocaleTimeString() + Array(Math.max(0, 32 - e.length)).join(" ") + e + ": ", ...Array.from(arguments).slice(1)),
            d.lastDebugMsg = t
        }
        : ()=>{}
        ,
        Object.defineProperties(d, {
            Material: {
                enumerable: !1,
                value: class {
                    constructor(e, t, n={}) {
                        var i = this;
                        function s(e, t) {
                            e = a.createShader(e);
                            return a.shaderSource(e, t),
                            a.compileShader(e),
                            a.getShaderParameter(e, a.COMPILE_STATUS) || console.error(a.getShaderInfoLog(e)),
                            d.debug("Material.compileShaderSource", {
                                source: t
                            }),
                            e
                        }
                        function o(e, n) {
                            return Object.entries(e).map(([e,t])=>t.getDeclaration(e, n)).join("\n")
                        }
                        i.uniforms = n,
                        i.uniformInstances = [];
                        var r = "\n              precision highp float;\n            ";
                        i.vertexSource = `
              ${r}
              attribute vec4 position;
              attribute vec2 uv;
              attribute vec2 uvNorm;
              ${o(d.commonUniforms, "vertex")}
              ${o(n, "vertex")}
              ${e}
            `,
                        i.Source = `
              ${r}
              ${o(d.commonUniforms, "fragment")}
              ${o(n, "fragment")}
              ${t}
            `,
                        i.vertexShader = s(a.VERTEX_SHADER, i.vertexSource),
                        i.fragmentShader = s(a.FRAGMENT_SHADER, i.Source),
                        i.program = a.createProgram(),
                        a.attachShader(i.program, i.vertexShader),
                        a.attachShader(i.program, i.fragmentShader),
                        a.linkProgram(i.program),
                        a.getProgramParameter(i.program, a.LINK_STATUS) || console.error(a.getProgramInfoLog(i.program)),
                        a.useProgram(i.program),
                        i.attachUniforms(void 0, d.commonUniforms),
                        i.attachUniforms(void 0, i.uniforms)
                    }
                    attachUniforms(n, e) {
                        const i = this;
                        void 0 === n ? Object.entries(e).forEach(([e,t])=>{
                            i.attachUniforms(e, t)
                        }
                        ) : "array" == e.type ? e.value.forEach((e,t)=>i.attachUniforms(n + `[${t}]`, e)) : "struct" == e.type ? Object.entries(e.value).forEach(([e,t])=>i.attachUniforms(n + "." + e, t)) : (d.debug("Material.attachUniforms", {
                            name: n,
                            uniform: e
                        }),
                        i.uniformInstances.push({
                            uniform: e,
                            location: a.getUniformLocation(i.program, n)
                        }))
                    }
                }
            },
            Uniform: {
                enumerable: !1,
                value: class {
                    constructor(e) {
                        this.type = "float",
                        Object.assign(this, e),
                        this.typeFn = {
                            float: "1f",
                            int: "1i",
                            vec2: "2fv",
                            vec3: "3fv",
                            vec4: "4fv",
                            mat4: "Matrix4fv"
                        }[this.type] || "1f",
                        this.update()
                    }
                    update(e) {
                        void 0 !== this.value && a["uniform" + this.typeFn](e, 0 === this.typeFn.indexOf("Matrix") ? this.transpose : this.value, 0 === this.typeFn.indexOf("Matrix") ? this.value : null)
                    }
                    getDeclaration(t, n, i) {
                        var s = this;
                        if (s.excludeFrom !== n) {
                            if ("array" === s.type)
                                return s.value[0].getDeclaration(t, n, s.value.length) + `
const int ${t}_length = ${s.value.length};`;
                            if ("struct" !== s.type)
                                return `uniform ${s.type} ${t}${0 < i ? `[${i}]` : ""};`;
                            {
                                let e = t.replace("u_", "");
                                return `uniform struct ${e = e.charAt(0).toUpperCase() + e.slice(1)} 
                                  {
` + Object.entries(s.value).map(([e,t])=>t.getDeclaration(e, n).replace(/^uniform/, "")).join("") + `
} ${t}${0 < i ? `[${i}]` : ""};`
                            }
                        }
                    }
                }
            },
            PlaneGeometry: {
                enumerable: !1,
                value: class {
                    constructor(e, t, n, i, s) {
                        a.createBuffer(),
                        this.attributes = {
                            position: new d.Attribute({
                                target: a.ARRAY_BUFFER,
                                size: 3
                            }),
                            uv: new d.Attribute({
                                target: a.ARRAY_BUFFER,
                                size: 2
                            }),
                            uvNorm: new d.Attribute({
                                target: a.ARRAY_BUFFER,
                                size: 2
                            }),
                            index: new d.Attribute({
                                target: a.ELEMENT_ARRAY_BUFFER,
                                size: 3,
                                type: a.UNSIGNED_SHORT
                            })
                        },
                        this.setTopology(n, i),
                        this.setSize(e, t, s)
                    }
                    setTopology(e=1, t=1) {
                        var n = this;
                        n.xSegCount = e,
                        n.ySegCount = t,
                        n.vertexCount = (n.xSegCount + 1) * (n.ySegCount + 1),
                        n.quadCount = n.xSegCount * n.ySegCount * 2,
                        n.attributes.uv.values = new Float32Array(2 * n.vertexCount),
                        n.attributes.uvNorm.values = new Float32Array(2 * n.vertexCount),
                        n.attributes.index.values = new Uint16Array(3 * n.quadCount);
                        for (let t = 0; t <= n.ySegCount; t++)
                            for (let e = 0; e <= n.xSegCount; e++) {
                                var i = t * (n.xSegCount + 1) + e;
                                if (n.attributes.uv.values[2 * i] = e / n.xSegCount,
                                n.attributes.uv.values[2 * i + 1] = 1 - t / n.ySegCount,
                                n.attributes.uvNorm.values[2 * i] = e / n.xSegCount * 2 - 1,
                                n.attributes.uvNorm.values[2 * i + 1] = 1 - t / n.ySegCount * 2,
                                e < n.xSegCount && t < n.ySegCount) {
                                    const d = t * n.xSegCount + e;
                                    n.attributes.index.values[6 * d] = i,
                                    n.attributes.index.values[6 * d + 1] = i + 1 + n.xSegCount,
                                    n.attributes.index.values[6 * d + 2] = i + 1,
                                    n.attributes.index.values[6 * d + 3] = i + 1,
                                    n.attributes.index.values[6 * d + 4] = i + 1 + n.xSegCount,
                                    n.attributes.index.values[6 * d + 5] = i + 2 + n.xSegCount
                                }
                            }
                        n.attributes.uv.update(),
                        n.attributes.uvNorm.update(),
                        n.attributes.index.update(),
                        d.debug("Geometry.setTopology", {
                            uv: n.attributes.uv,
                            uvNorm: n.attributes.uvNorm,
                            index: n.attributes.index
                        })
                    }
                    setSize(e=1, n=1, i="xz") {
                        var s = this;
                        s.width = e,
                        s.height = n,
                        s.orientation = i,
                        s.attributes.position.values && s.attributes.position.values.length === 3 * s.vertexCount || (s.attributes.position.values = new Float32Array(3 * s.vertexCount));
                        const o = e / -2
                          , r = n / -2
                          , a = e / s.xSegCount
                          , l = n / s.ySegCount;
                        for (let t = 0; t <= s.ySegCount; t++) {
                            const n = r + t * l;
                            for (let e = 0; e <= s.xSegCount; e++) {
                                const r = o + e * a
                                  , l = t * (s.xSegCount + 1) + e;
                                s.attributes.position.values[3 * l + "xyz".indexOf(i[0])] = r,
                                s.attributes.position.values[3 * l + "xyz".indexOf(i[1])] = -n
                            }
                        }
                        s.attributes.position.update(),
                        d.debug("Geometry.setSize", {
                            position: s.attributes.position
                        })
                    }
                }
            },
            Mesh: {
                enumerable: !1,
                value: class {
                    constructor(e, t) {
                        const n = this;
                        n.geometry = e,
                        n.material = t,
                        n.wireframe = !1,
                        n.attributeInstances = [],
                        Object.entries(n.geometry.attributes).forEach(([e,t])=>{
                            n.attributeInstances.push({
                                attribute: t,
                                location: t.attach(e, n.material.program)
                            })
                        }
                        ),
                        d.meshes.push(n),
                        d.debug("Mesh.constructor", {
                            mesh: n
                        })
                    }
                    draw() {
                        a.useProgram(this.material.program),
                        this.material.uniformInstances.forEach(({uniform: e, location: t})=>e.update(t)),
                        this.attributeInstances.forEach(({attribute: e, location: t})=>e.use(t)),
                        a.drawElements(this.wireframe ? a.LINES : a.TRIANGLES, this.geometry.attributes.index.values.length, a.UNSIGNED_SHORT, 0)
                    }
                    remove() {
                        d.meshes = d.meshes.filter(e=>e != this)
                    }
                }
            },
            Attribute: {
                enumerable: !1,
                value: class {
                    constructor(e) {
                        this.type = a.FLOAT,
                        this.normalized = !1,
                        this.buffer = a.createBuffer(),
                        Object.assign(this, e),
                        this.update()
                    }
                    update() {
                        void 0 !== this.values && (a.bindBuffer(this.target, this.buffer),
                        a.bufferData(this.target, this.values, a.STATIC_DRAW))
                    }
                    attach(e, t) {
                        t = a.getAttribLocation(t, e);
                        return this.target === a.ARRAY_BUFFER && (a.enableVertexAttribArray(t),
                        a.vertexAttribPointer(t, this.size, this.type, this.normalized, 0, 0)),
                        t
                    }
                    use(e) {
                        a.bindBuffer(this.target, this.buffer),
                        this.target === a.ARRAY_BUFFER && (a.enableVertexAttribArray(e),
                        a.vertexAttribPointer(e, this.size, this.type, this.normalized, 0, 0))
                    }
                }
            }
        });
        e = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        d.commonUniforms = {
            projectionMatrix: new d.Uniform({
                type: "mat4",
                value: e
            }),
            modelViewMatrix: new d.Uniform({
                type: "mat4",
                value: e
            }),
            resolution: new d.Uniform({
                type: "vec2",
                value: [1, 1]
            }),
            aspectRatio: new d.Uniform({
                type: "float",
                value: 1
            })
        }
    }
    setSize(e=640, t=480) {
        this.width = e,
        this.height = t,
        this.canvas.width = e,
        this.canvas.height = t,
        this.gl.viewport(0, 0, e, t),
        this.commonUniforms.resolution.value = [e, t],
        this.commonUniforms.aspectRatio.value = e / t,
        this.debug("MiniGL.setSize", {
            width: e,
            height: t
        })
    }
    setOrthographicCamera(e=0, t=0, n=0, i=-2e3, s=2e3) {
        this.commonUniforms.projectionMatrix.value = [2 / this.width, 0, 0, 0, 0, 2 / this.height, 0, 0, 0, 0, 2 / (i - s), 0, e, t, n, 1],
        this.debug("setOrthographicCamera", this.commonUniforms.projectionMatrix.value)
    }
    render() {
        this.gl.clearColor(0, 0, 0, 0),
        this.gl.clearDepth(1),
        this.meshes.forEach(e=>e.draw())
    }
}
function t(e, t, n) {
    return t in e ? Object.defineProperty(e, t, {
        value: n,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = n,
    e
}
(new class {
    constructor() {
        t(this, "el", void 0),
        t(this, "cssVarRetries", 0),
        t(this, "maxCssVarRetries", 200),
        t(this, "angle", 0),
        t(this, "isLoadedClass", !1),
        t(this, "isScrolling", !1),
        t(this, "scrollingTimeout", void 0),
        t(this, "scrollingRefreshDelay", 200),
        t(this, "isIntersecting", !1),
        t(this, "shaderFiles", void 0),
        t(this, "vertexShader", void 0),
        t(this, "sectionColors", void 0),
        t(this, "computedCanvasStyle", void 0),
        t(this, "conf", void 0),
        t(this, "uniforms", void 0),
        t(this, "t", 1253106),
        t(this, "last", 0),
        t(this, "width", void 0),
        t(this, "minWidth", 1111),
        t(this, "height", 600),
        t(this, "xSegCount", void 0),
        t(this, "ySegCount", void 0),
        t(this, "mesh", void 0),
        t(this, "material", void 0),
        t(this, "geometry", void 0),
        t(this, "minigl", void 0),
        t(this, "scrollObserver", void 0),
        t(this, "amp", 320),
        t(this, "seed", 5),
        t(this, "freqX", 14e-5),
        t(this, "freqY", 29e-5),
        t(this, "freqDelta", 1e-5),
        t(this, "activeColors", [1, 1, 1, 1]),
        t(this, "isMetaKey", !1),
        t(this, "isGradientLegendVisible", !1),
        t(this, "isMouseDown", !1),
        t(this, "handleScroll", ()=>{
            clearTimeout(this.scrollingTimeout),
            this.scrollingTimeout = setTimeout(this.handleScrollEnd, this.scrollingRefreshDelay),
            this.isGradientLegendVisible && this.hideGradientLegend(),
            this.conf.playing && (this.isScrolling = !0,
            this.pause())
        }
        ),
        t(this, "handleScrollEnd", ()=>{
            this.isScrolling = !1,
            this.isIntersecting && this.play()
        }
        ),
        t(this, "resize", ()=>{
            this.width = window.innerWidth,
            this.minigl.setSize(this.width, this.height),
            this.minigl.setOrthographicCamera(),
            this.xSegCount = Math.ceil(this.width * this.conf.density[0]),
            this.ySegCount = Math.ceil(this.height * this.conf.density[1]),
            this.mesh.geometry.setTopology(this.xSegCount, this.ySegCount),
            this.mesh.geometry.setSize(this.width, this.height),
            this.mesh.material.uniforms.u_shadow_power.value = this.width < 600 ? 5 : 6
        }
        ),
        t(this, "handleMouseDown", e=>{
            this.isGradientLegendVisible && (this.isMetaKey = e.metaKey,
            !(this.isMouseDown = !0) === this.conf.playing) && requestAnimationFrame(this.animate)
        }
        ),
        t(this, "handleMouseUp", ()=>{
            this.isMouseDown = !1
        }
        ),
        t(this, "animate", e=>{
            if (!this.shouldSkipFrame(e) || this.isMouseDown) {
                if (this.t += Math.min(e - this.last, 1e3 / 15),
                this.last = e,
                this.isMouseDown) {
                    let e = 160;
                    this.isMetaKey && (e = -160),
                    this.t += e
                }
                this.mesh.material.uniforms.u_time.value = this.t,
                this.minigl.render()
            }
            0 !== this.last && this.isStatic ? (this.minigl.render(),
            this.disconnect()) : (this.conf.playing || this.isMouseDown) && requestAnimationFrame(this.animate)
        }
        ),
        t(this, "addIsLoadedClass", ()=>{
            this.isLoadedClass || (this.isLoadedClass = !0,
            this.el.classList.add("isLoaded"),
            setTimeout(()=>{
                this.el.parentElement.classList.add("isLoaded")
            }
            , 3e3))
        }
        ),
        t(this, "pause", ()=>{
            this.conf.playing = !1
        }
        ),
        t(this, "play", ()=>{
            requestAnimationFrame(this.animate),
            this.conf.playing = !0
        }
        ),
        t(this, "initGradient", e=>(this.el = document.querySelector(e),
        this.connect(),
        this))
    }
    async connect() {
        this.shaderFiles = {
            vertex: "varying vec3 v_color;\n\nvoid main() {\n  float time = u_time * u_global.noiseSpeed;\n\n  vec2 noiseCoord = resolution * uvNorm * u_global.noiseFreq;\n\n  vec2 st = 1. - uvNorm.xy;\n\n  //\n  // Tilting the plane\n  //\n\n  // Front-to-back tilt\n  float tilt = resolution.y / 2.0 * uvNorm.y;\n\n  // Left-to-right angle\n  float incline = resolution.x * uvNorm.x / 2.0 * u_vertDeform.incline;\n\n  // Up-down shift to offset incline\n  float offset = resolution.x / 2.0 * u_vertDeform.incline * mix(u_vertDeform.offsetBottom, u_vertDeform.offsetTop, uv.y);\n\n  //\n  // Vertex noise\n  //\n\n  float noise = snoise(vec3(\n    noiseCoord.x * u_vertDeform.noiseFreq.x + time * u_vertDeform.noiseFlow,\n    noiseCoord.y * u_vertDeform.noiseFreq.y,\n    time * u_vertDeform.noiseSpeed + u_vertDeform.noiseSeed\n  )) * u_vertDeform.noiseAmp;\n\n  // Fade noise to zero at edges\n  noise *= 1.0 - pow(abs(uvNorm.y), 2.0);\n\n  // Clamp to 0\n  noise = max(0.0, noise);\n\n  vec3 pos = vec3(\n    position.x,\n    position.y + tilt + incline + noise - offset,\n    position.z\n  );\n\n  //\n  // Vertex color, to be passed to fragment shader\n  //\n\n  if (u_active_colors[0] == 1.) {\n    v_color = u_baseColor;\n  }\n\n  for (int i = 0; i < u_waveLayers_length; i++) {\n    if (u_active_colors[i + 1] == 1.) {\n      WaveLayers layer = u_waveLayers[i];\n\n      float noise = smoothstep(\n        layer.noiseFloor,\n        layer.noiseCeil,\n        snoise(vec3(\n          noiseCoord.x * layer.noiseFreq.x + time * layer.noiseFlow,\n          noiseCoord.y * layer.noiseFreq.y,\n          time * layer.noiseSpeed + layer.noiseSeed\n        )) / 2.0 + 0.5\n      );\n\n      v_color = blendNormal(v_color, layer.color, pow(noise, 4.));\n    }\n  }\n\n  //\n  // Finish\n  //\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n}",
            noise: "//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\n\nvec4 permute(vec4 x) {\n    return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat snoise(vec3 v)\n{\n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //   x0 = x0 - 0.0 + 0.0 * C.xxx;\n  //   x1 = x0 - i1  + 1.0 * C.xxx;\n  //   x2 = x0 - i2  + 2.0 * C.xxx;\n  //   x3 = x0 - 1.0 + 3.0 * C.xxx;\n  vec3 x1 = x0 - i1 + C.xxx;\n  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y\n  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y\n\n// Permutations\n  i = mod289(i);\n  vec4 p = permute( permute( permute(\n            i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n          + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\n          + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients: 7x7 points over a square, mapped onto an octahedron.\n// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)\n  float n_ = 0.142857142857; // 1.0/7.0\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;\n  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\n                                dot(p2,x2), dot(p3,x3) ) );\n}",
            blend: "//\n// https://github.com/jamieowen/glsl-blend\n//\n\n// Normal\n\nvec3 blendNormal(vec3 base, vec3 blend) {\n\treturn blend;\n}\n\nvec3 blendNormal(vec3 base, vec3 blend, float opacity) {\n\treturn (blendNormal(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Screen\n\nfloat blendScreen(float base, float blend) {\n\treturn 1.0-((1.0-base)*(1.0-blend));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend) {\n\treturn vec3(blendScreen(base.r,blend.r),blendScreen(base.g,blend.g),blendScreen(base.b,blend.b));\n}\n\nvec3 blendScreen(vec3 base, vec3 blend, float opacity) {\n\treturn (blendScreen(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Multiply\n\nvec3 blendMultiply(vec3 base, vec3 blend) {\n\treturn base*blend;\n}\n\nvec3 blendMultiply(vec3 base, vec3 blend, float opacity) {\n\treturn (blendMultiply(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Overlay\n\nfloat blendOverlay(float base, float blend) {\n\treturn base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend) {\n\treturn vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));\n}\n\nvec3 blendOverlay(vec3 base, vec3 blend, float opacity) {\n\treturn (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Hard light\n\nvec3 blendHardLight(vec3 base, vec3 blend) {\n\treturn blendOverlay(blend,base);\n}\n\nvec3 blendHardLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Soft light\n\nfloat blendSoftLight(float base, float blend) {\n\treturn (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend) {\n\treturn vec3(blendSoftLight(base.r,blend.r),blendSoftLight(base.g,blend.g),blendSoftLight(base.b,blend.b));\n}\n\nvec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color dodge\n\nfloat blendColorDodge(float base, float blend) {\n\treturn (blend==1.0)?blend:min(base/(1.0-blend),1.0);\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend) {\n\treturn vec3(blendColorDodge(base.r,blend.r),blendColorDodge(base.g,blend.g),blendColorDodge(base.b,blend.b));\n}\n\nvec3 blendColorDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Color burn\n\nfloat blendColorBurn(float base, float blend) {\n\treturn (blend==0.0)?blend:max((1.0-((1.0-base)/blend)),0.0);\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend) {\n\treturn vec3(blendColorBurn(base.r,blend.r),blendColorBurn(base.g,blend.g),blendColorBurn(base.b,blend.b));\n}\n\nvec3 blendColorBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendColorBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Vivid Light\n\nfloat blendVividLight(float base, float blend) {\n\treturn (blend<0.5)?blendColorBurn(base,(2.0*blend)):blendColorDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend) {\n\treturn vec3(blendVividLight(base.r,blend.r),blendVividLight(base.g,blend.g),blendVividLight(base.b,blend.b));\n}\n\nvec3 blendVividLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendVividLight(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Lighten\n\nfloat blendLighten(float base, float blend) {\n\treturn max(blend,base);\n}\n\nvec3 blendLighten(vec3 base, vec3 blend) {\n\treturn vec3(blendLighten(base.r,blend.r),blendLighten(base.g,blend.g),blendLighten(base.b,blend.b));\n}\n\nvec3 blendLighten(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLighten(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear burn\n\nfloat blendLinearBurn(float base, float blend) {\n\t// Note : Same implementation as BlendSubtractf\n\treturn max(base+blend-1.0,0.0);\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendSubtract\n\treturn max(base+blend-vec3(1.0),vec3(0.0));\n}\n\nvec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear dodge\n\nfloat blendLinearDodge(float base, float blend) {\n\t// Note : Same implementation as BlendAddf\n\treturn min(base+blend,1.0);\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend) {\n\t// Note : Same implementation as BlendAdd\n\treturn min(base+blend,vec3(1.0));\n}\n\nvec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));\n}\n\n// Linear light\n\nfloat blendLinearLight(float base, float blend) {\n\treturn blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend) {\n\treturn vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));\n}\n\nvec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {\n\treturn (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));\n}",
            fragment: "varying vec3 v_color;\n\nvoid main() {\n  vec3 color = v_color;\n  if (u_darken_top == 1.0) {\n    vec2 st = gl_FragCoord.xy/resolution.xy;\n    color.g -= pow(st.y + sin(-12.0) * st.x, u_shadow_power) * 0.4;\n  }\n  gl_FragColor = vec4(color, 1.0);\n}"
        },
        this.conf = {
            presetName: "",
            wireframe: !1,
            density: [.06, .16],
            zoom: 1,
            rotation: 0,
            playing: !0
        },
        document.querySelectorAll("canvas").length < 1 ? console.log("DID NOT LOAD HERO STRIPE CANVAS") : (this.minigl = new n(this.el,null,null,!0),
        requestAnimationFrame(()=>{
            this.el && (this.computedCanvasStyle = getComputedStyle(this.el),
            this.waitForCssVars())
        }
        ))
    }
    disconnect() {
        this.scrollObserver && (window.removeEventListener("scroll", this.handleScroll),
        window.removeEventListener("mousedown", this.handleMouseDown),
        window.removeEventListener("mouseup", this.handleMouseUp),
        window.removeEventListener("keydown", this.handleKeyDown),
        this.scrollObserver.disconnect()),
        window.removeEventListener("resize", this.resize)
    }
    initMaterial() {
        this.uniforms = {
            u_time: new this.minigl.Uniform({
                value: 0
            }),
            u_shadow_power: new this.minigl.Uniform({
                value: 5
            }),
            u_darken_top: new this.minigl.Uniform({
                value: "" === this.el.dataset.jsDarkenTop ? 1 : 0
            }),
            u_active_colors: new this.minigl.Uniform({
                value: this.activeColors,
                type: "vec4"
            }),
            u_global: new this.minigl.Uniform({
                value: {
                    noiseFreq: new this.minigl.Uniform({
                        value: [this.freqX, this.freqY],
                        type: "vec2"
                    }),
                    noiseSpeed: new this.minigl.Uniform({
                        value: 5e-6
                    })
                },
                type: "struct"
            }),
            u_vertDeform: new this.minigl.Uniform({
                value: {
                    incline: new this.minigl.Uniform({
                        value: Math.sin(this.angle) / Math.cos(this.angle)
                    }),
                    offsetTop: new this.minigl.Uniform({
                        value: -.5
                    }),
                    offsetBottom: new this.minigl.Uniform({
                        value: -.5
                    }),
                    noiseFreq: new this.minigl.Uniform({
                        value: [3, 4],
                        type: "vec2"
                    }),
                    noiseAmp: new this.minigl.Uniform({
                        value: this.amp
                    }),
                    noiseSpeed: new this.minigl.Uniform({
                        value: 10
                    }),
                    noiseFlow: new this.minigl.Uniform({
                        value: 3
                    }),
                    noiseSeed: new this.minigl.Uniform({
                        value: this.seed
                    })
                },
                type: "struct",
                excludeFrom: "fragment"
            }),
            u_baseColor: new this.minigl.Uniform({
                value: this.sectionColors[0],
                type: "vec3",
                excludeFrom: "fragment"
            }),
            u_waveLayers: new this.minigl.Uniform({
                value: [],
                excludeFrom: "fragment",
                type: "array"
            })
        };
        for (let e = 1; e < this.sectionColors.length; e += 1)
            this.uniforms.u_waveLayers.value.push(new this.minigl.Uniform({
                value: {
                    color: new this.minigl.Uniform({
                        value: this.sectionColors[e],
                        type: "vec3"
                    }),
                    noiseFreq: new this.minigl.Uniform({
                        value: [2 + e / this.sectionColors.length, 3 + e / this.sectionColors.length],
                        type: "vec2"
                    }),
                    noiseSpeed: new this.minigl.Uniform({
                        value: 11 + .3 * e
                    }),
                    noiseFlow: new this.minigl.Uniform({
                        value: 6.5 + .3 * e
                    }),
                    noiseSeed: new this.minigl.Uniform({
                        value: this.seed + 10 * e
                    }),
                    noiseFloor: new this.minigl.Uniform({
                        value: .1
                    }),
                    noiseCeil: new this.minigl.Uniform({
                        value: .63 + .07 * e
                    })
                },
                type: "struct"
            }));
        return this.vertexShader = [this.shaderFiles.noise, this.shaderFiles.blend, this.shaderFiles.vertex].join("\n\n"),
        new this.minigl.Material(this.vertexShader,this.shaderFiles.fragment,this.uniforms)
    }
    initMesh() {
        this.material = this.initMaterial(),
        this.geometry = new this.minigl.PlaneGeometry,
        this.mesh = new this.minigl.Mesh(this.geometry,this.material)
    }
    shouldSkipFrame(e) {
        return !!window.document.hidden || !this.conf.playing || parseInt(e, 10) % 2 == 0 || void 0
    }
    updateFrequency(e) {
        this.freqX += e,
        this.freqY += e
    }
    toggleColor(e) {
        this.activeColors[e] = 0 === this.activeColors[e] ? 1 : 0
    }
    showGradientLegend() {
        this.width > this.minWidth && (this.isGradientLegendVisible = !0,
        document.body.classList.add("isGradientLegendVisible"))
    }
    hideGradientLegend() {
        this.isGradientLegendVisible = !1,
        document.body.classList.remove("isGradientLegendVisible")
    }
    init() {
        this.initGradientColors(),
        this.initMesh(),
        this.resize(),
        requestAnimationFrame(this.animate),
        window.addEventListener("resize", this.resize)
    }
    waitForCssVars() {
        this.computedCanvasStyle && -1 !== this.computedCanvasStyle.getPropertyValue("--gradient-color-1").indexOf("#") ? (this.init(),
        this.addIsLoadedClass()) : (this.cssVarRetries += 1,
        this.cssVarRetries > this.maxCssVarRetries ? (this.sectionColors = [16711680, 16711680, 16711935, 65280, 255],
        this.init()) : requestAnimationFrame(()=>this.waitForCssVars()))
    }
    initGradientColors() {
        this.sectionColors = ["--gradient-color-1", "--gradient-color-2", "--gradient-color-3", "--gradient-color-4"].map(e=>{
            let t = this.computedCanvasStyle.getPropertyValue(e).trim();
            if (4 === t.length) {
                const e = t.substr(1).split("").map(e=>e + e).join("");
                t = "#" + e
            }
            return t && "0x" + t.substr(1)
        }
        ).filter(Boolean).map(e)
    }
}
).initGradient("#gradient-canvas");
