document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const doodler = document.createElement('div')
    let doodlerLeft = 50
    let startPoint = 150
    let doodlerBottom = startPoint
    let isGameOver = false
    let platformCount = 5
    let platforms = []
    let upTimerID
    let downTimerID
    let isJumping = true
    let isGoingLeft = false
    let isGoingRight = false
    let leftTimerID
    let rightTimerID
    let score = 0

    function createDoodler() {
        grid.appendChild(doodler)
        doodler.classList.add('doodler')
        doodlerLeft = platforms[0].left
        doodler.style.left = doodlerLeft + 'px'
        doodler.style.bottom = doodlerBottom + 'px'
    }

    class Platform {
        constructor(newPlatBottom) {
            this.bottom = newPlatBottom
            this.left = Math.random() * 315
            this.visual = document.createElement('div')

            const visual = this.visual
            visual.classList.add('platform')
            visual.style.left = this.left + 'px'
            visual.style.bottom = this.bottom + 'px'
            grid.appendChild(visual)
        }
    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platformGap = 600 / platformCount
            let newPlatBottom = 100 + i * platformGap
            let newPlatform = new Platform(newPlatBottom)
            platforms.push(newPlatform)
            console.log(platforms)
        }
    }

    function movePlatforms() {
        if (doodlerBottom > 200) {
            platforms.forEach(platform => {
                platform.bottom -= 4
                let visual = platform.visual
                visual.style.bottom = platform.bottom + 'px'

                if (platform.bottom < 10) {
                    let firstPlatform = platforms[0].visual
                    firstPlatform.classList.remove('platform')
                    platforms.shift()
                    console.log(platforms)
                    score++
                    let newPlatform = new Platform(600)
                    platforms.push(newPlatform)
                }
            })
        }
    }

    function fall() {
        clearInterval(upTimerID)
        isJumping = false
        downTimerID = setInterval(function () {
            doodlerBottom -= 5
            doodler.style.bottom = doodlerBottom + 'px'
            if (doodlerBottom <= 0) {
                gameOver()
            }
            platforms.forEach(platform => {
                if (
                    (doodlerBottom >= platform.bottom) &&
                    (doodlerBottom <= (platform.bottom + 15)) &&
                    ((doodlerLeft + 60 ) >= platform.left) &&
                    (doodlerLeft <= (platform.left + 85)) && 
                    !isJumping
                ) {
                    console.log('landed')
                    startPoint = doodlerBottom
                    jump()
                    console.log('start', startPoint)
                    isJumping = true
                }
            })
        }, 30)
    }

    function jump() {
        clearInterval(downTimerID)
        isJumping = true
        upTimerID = setInterval(function () {
            console.log(startPoint)
            console.log('1', doodlerBottom)
            doodlerBottom += 20
            doodler.style.bottom = doodlerBottom + 'px'
            console.log('2', doodlerBottom)
            console.log('s', startPoint)
            if (doodlerBottom > (startPoint + 200)) {
                fall()
                isJumping = false
            }
        }, 30)
    }

    function moveLeft() {
        if (isGoingRight) {
            clearInterval(rightTimerID)
            isGoingRight = false
        }
        isGoingLeft = true
        leftTimerID = setInterval(function () {
            if (doodlerLeft >= 0) {
                console.log('going left')
                doodlerLeft -= 5
                doodler.style.left = doodlerLeft + 'px'
            } else moveRight()
        }, 20)
    }

    function moveRight() {
        if (isGoingLeft) {
            clearInterval(leftTimerID) 
            isGoingLeft = false
        }
        isGoingRight = true
        rightTimerID = setInterval(function () {
            if (doodlerLeft <= 313) {
                console.log('going right')
                doodlerLeft += 5
                doodler.style.left = doodlerLeft + 'px'
            } else moveLeft()
        }, 20)
    }

    function moveStraight() {
        isGoingRight = false
        isGoingLeft = false
        clearInterval(rightTimerID)
        clearInterval(leftTimerID)
    }

    function control(e) {
        doodler.style.bottom = doodlerBottom + 'px'
        if (e.key === "ArrowLeft") {
            moveLeft()
        } else if (e.key === "ArrowRight") {
            moveRight()
        } else if (e.key === "ArrowUp") {
            moveStraight()
        }
    }

    function gameOver() {
        isGameOver = true
        while (grid.firstChild) {
            console.log('remove') 
            grid.removeChild(grid.firstChild)
        }
        grid.innerHTML = score
        clearInterval(upTimerID)
        clearInterval(downTimerID)
        clearInterval(leftTimerID)
        clearInterval(rightTimerID)
    }

    function start() {
        if (!isGameOver) {
            createPlatforms()
            createDoodler()
            setInterval(movePlatforms, 30)
            jump(startPoint)
            document.addEventListener('keyup', control)
        }
    }
    start()
})