<script setup>
import { onMounted } from 'vue'
import anime from 'animejs'

onMounted(() => {
    //#region 网页背景特效代码 akat
    var ff = navigator.userAgent.indexOf('Firefox') > 0
    var tap =
        'ontouchstart' in window || navigator.msMaxTouchPoints
            ? 'touchstart'
            : 'mousedown'

    var fireworks = (function () {
        var getFontSize = function () {
            return parseFloat(
                getComputedStyle(document.documentElement).fontSize
            )
        }

        var canvas = document.getElementById('fireworks')
        var ctx = canvas.getContext('2d')
        var numberOfParticules = 24
        var distance = 200
        var x = 0
        var y = 0
        var animations = []

        var setCanvasSize = function () {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        var updateCoords = function (e) {
            x = e.clientX || e.touches[0].clientX
            y = e.clientY || e.touches[0].clientY
        }

        var colors = ['#FF324A', '#31FFA6', '#206EFF', '#FFFF99']

        var createCircle = function (x, y) {
            var p = {}
            p.x = x
            p.y = y
            p.color = colors[anime.random(0, colors.length - 1)]
            p.color = '#FFF'
            p.radius = 0
            p.alpha = 1
            p.lineWidth = 6
            p.draw = function () {
                ctx.globalAlpha = p.alpha
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
                ctx.lineWidth = p.lineWidth
                ctx.strokeStyle = p.color
                ctx.stroke()
                ctx.globalAlpha = 1
            }
            return p
        }

        var createParticule = function (x, y) {
            var p = {}
            p.x = x
            p.y = y
            p.color = colors[anime.random(0, colors.length - 1)]
            p.radius = anime.random(getFontSize(), getFontSize() * 2)
            p.draw = function () {
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true)
                ctx.fillStyle = p.color
                ctx.fill()
            }
            return p
        }

        var createParticles = function (x, y) {
            var particules = []
            for (var i = 0; i < numberOfParticules; i++) {
                var p = createParticule(x, y)
                particules.push(p)
            }
            return particules
        }

        var removeAnimation = function (animation) {
            var index = animations.indexOf(animation)
            if (index > -1) animations.splice(index, 1)
        }

        var animateParticules = function (x, y) {
            setCanvasSize()
            var particules = createParticles(x, y)
            var circle = createCircle(x, y)
            var particulesAnimation = anime({
                targets: particules,
                x: function (p) {
                    return p.x + anime.random(-distance, distance)
                },
                y: function (p) {
                    return p.y + anime.random(-distance, distance)
                },
                radius: 0,
                duration: function () {
                    return anime.random(1200, 1800)
                },
                easing: 'easeOutExpo',
                complete: removeAnimation
            })
            var circleAnimation = anime({
                targets: circle,
                radius: function () {
                    return anime.random(
                        getFontSize() * 8.75,
                        getFontSize() * 11.25
                    )
                },
                lineWidth: 0,
                alpha: {
                    value: 0,
                    easing: 'linear',
                    duration: function () {
                        return anime.random(400, 600)
                    }
                },
                duration: function () {
                    return anime.random(1200, 1800)
                },
                easing: 'easeOutExpo',
                complete: removeAnimation
            })
            animations.push(particulesAnimation)
            animations.push(circleAnimation)
        }

        var mainLoop = anime({
            duration: Infinity,
            update: function () {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                animations.forEach(function (anim) {
                    anim.animatables.forEach(function (animatable) {
                        animatable.target.draw()
                    })
                })
            }
        })

        document.addEventListener(
            tap,
            function (e) {
                updateCoords(e)
                animateParticules(x, y)
            },
            false
        )

        window.addEventListener('resize', setCanvasSize, false)

        return {
            boom: animateParticules
        }
    })()

    var logoAnimation = function () {
        document.body.classList.add('ready')

        var setDashoffset = function (el) {
            var l = el.getTotalLength()
            el.setAttribute('stroke-dasharray', l)
            return [l, 0]
        }

        var letters = anime({
            targets: '#lines path',
            strokeDashoffset: {
                value: setDashoffset,
                duration: 700,
                easing: 'easeOutQuad'
            },
            transform: ['translate(0 128)', 'translate(0 0)'],
            delay: function (el, i) {
                return 750 + i * 120
            },
            duration: 1400
        })

        var letterI = anime({
            targets: '#line-i-1',
            strokeDashoffset: {
                value: setDashoffset,
                duration: 700,
                easing: 'easeOutQuad'
            },
            transform: function () {
                return ff
                    ? ['rotate(360)', 'rotate(0)']
                    : ['rotate(360 240 64)', 'rotate(0 240 64)']
            },
            duration: 2500,
            delay: letters.duration - 780
        })

        var JSletters = anime({
            targets: ['#line-j', '#line-s'],
            strokeDashoffset: setDashoffset,
            duration: 1400,
            delay: function (el, i) {
                return letterI.duration - 1400 + i * 60
            },
            easing: 'easeInOutQuart'
        })

        var showDescription = anime({
            targets: ['.description', '.links', 'footer'],
            opacity: {
                value: 1,
                easing: 'linear',
                duration: 1000
            },
            translateY: ['1.5rem', '0rem'],
            delay: function (el, i, l) {
                return (l - i) * 100 + (letterI.duration - 600)
            },
            duration: 2250,
            easing: 'easeOutExpo'
        })
    }

    window.onload = logoAnimation
    //#endregion akaw
})
</script>

<template lang="">
    <div class="click-bg">
        <canvas id="fireworks"></canvas>
        <section>
            <svg
                class="logo"
                width="25rem"
                height="12rem"
                viewBox="0 0 800 384"
            >
                <defs>
                    <radialGradient
                        cx="50%"
                        cy="0%"
                        fx="50%"
                        fy="0%"
                        r="50%"
                        id="radialGradient-1"
                    >
                        <stop stop-color="#329FFF" offset="0%"></stop>
                        <stop stop-color="#206EFF" offset="100%"></stop>
                    </radialGradient>
                    <radialGradient
                        cx="50%"
                        cy="0%"
                        fx="50%"
                        fy="0%"
                        r="50%"
                        id="radialGradient-2"
                    >
                        <stop stop-color="#FF7894" offset="0%"></stop>
                        <stop stop-color="#FF324A" offset="100%"></stop>
                    </radialGradient>
                    <radialGradient
                        cx="50%"
                        cy="0%"
                        fx="50%"
                        fy="0%"
                        r="100%"
                        id="radialGradient-3"
                    >
                        <stop stop-color="#FF7894" offset="0%"></stop>
                        <stop stop-color="#FF324A" offset="100%"></stop>
                    </radialGradient>
                    <radialGradient
                        cx="50%"
                        cy="0%"
                        fx="50%"
                        fy="0%"
                        r="100%"
                        id="radialGradient-4"
                    >
                        <stop stop-color="#359FFC" offset="0%"></stop>
                        <stop stop-color="#206EFF" offset="100%"></stop>
                    </radialGradient>
                    <radialGradient
                        cx="50%"
                        cy="0%"
                        fx="50%"
                        fy="0%"
                        r="50%"
                        id="radialGradient-5"
                    >
                        <stop stop-color="#5FFFD2" offset="0%"></stop>
                        <stop stop-color="#31FFA6" offset="100%"></stop>
                    </radialGradient>
                </defs>
            </svg>
        </section>
    </div>
</template>
<style lang="css">
.click-bg {
    position: fixed;
    z-index: 5;
    width: 100%;
    height: 100%;
}
:root {
    font-size: 14px;
}
@media (min-width: 350px) {
    :root {
        font-size: 16px;
    }
}
@media (min-width: 640px) {
    :root {
        font-size: 18px;
    }
}
@media (min-width: 1440px) {
    :root {
        font-size: 20px;
    }
}

section {
    position: relative;
    z-index: 1;
    width: 18.5rem;
}

.description {
    line-height: 1.25rem;
}

.links {
    line-height: 1.125rem;
}

.description,
.links {
    opacity: 0;
    margin-bottom: 1.25rem;
}

.links {
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: auto;
}

.link {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 8.75rem;
    height: 3.5rem;
    border: 1px solid #3a5685;
    border-radius: 2px;
    color: white;
    text-decoration: none;
    text-align: center;
    transition: border-color 0.1s ease, background-color 0.1s ease;
}

.link:hover {
    border-color: #647899;
    background: rgba(255, 255, 255, 0.06);
}

.link.primary {
    border: none;
    background-image: linear-gradient(-180deg, #2796f8 0%, #206eff 100%);
}

.link.primary:hover {
    border: none;
    background: linear-gradient(-180deg, #4da7f7 0%, #3577f3 100%);
}

.small {
    font-size: 0.75rem;
}

body:not(.iOS) #lines * {
    mix-blend-mode: lighten;
}

#fills * {
    opacity: 0;
    mix-blend-mode: lighten;
}

#line-i-1 {
    transform-origin: 30em 8em;
}

.fireworks {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 25;
}

footer {
    opacity: 0;
    color: #96a9c3;
}

footer a {
    color: #96a9c3;
    text-decoration: none;
}

footer a:hover {
    color: #fff;
    text-decoration: underline;
}

/*网页背景特效代码*/

blockquote,
q {
    quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
    content: none;
}
@font-face {
    font-family: 'Circular';
    src: url('../fonts/Circular-Book.woff') format('woff');
    font-weight: normal;
}

@font-face {
    font-family: 'Circular';
    src: url('../fonts/Circular-Bold.woff') format('woff');
    font-weight: bold;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

section {
    min-width: 18rem;
}

.red {
    background-color: #ff324a;
}

.green {
    background-color: #31ffa6;
}

.blue {
    background-color: #206eff;
}

.yellow {
    background-color: #ffff99;
}
</style>
