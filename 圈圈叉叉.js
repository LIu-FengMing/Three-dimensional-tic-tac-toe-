let sliderGroup = [];
let controlBtn = [];
let gameStageSpan;
let gameSizeStageSpan;
let X, Y, Z;
let centerX, centerY, centerZ;
let GroundSize = 10;
let GameSize = 3;
let GroundUnit = 20;
let GroundEdge = GroundUnit * GroundSize;
let h = 20;
let FrontPatten = "front", BackPatten = "back", LeftPatten = "left", RightPatten = "right", UpPatten = "up", DownPatten = "down";
let EnterPatten = "Enter", RestGamePatten = "RestGame", GameIntroductionPatten = "GameIntroduction", PreviousPatten = "Previous";
let threeSizeGamePatten = "sizeOfThree", fourSizeGamePatten = "sizeOfFour";
let hasGravity = true;

var controlName = [{
    key: "前(w,↑)",
    value: FrontPatten
}, {
    key: "後(s,↓)",
    value: BackPatten
}, {
    key: "左(a,←)",
    value: LeftPatten
}, {
    key: "右(d,→)",
    value: RightPatten
}, {
    key: "上(r)",
    value: UpPatten
}, {
    key: "下(f)",
    value: DownPatten
}, {
    key: "放置(space)",
    value: EnterPatten
}, {
    key: "返回上一步",
    value: PreviousPatten
}, {
    key: "重製遊戲",
    value: RestGamePatten
}, {
    key: "遊戲說明",
    value: GameIntroductionPatten
},
{
    key: "3*3*3",
    value: threeSizeGamePatten
},
{
    key: "4*4*4",
    value: fourSizeGamePatten
},]
var winGmaeFlag = false, winGmaeLineStart = [0, 0, 0], winGmaeLineEnd = [0, 0, 0];
var gameElement = [];
var targetPostion = [0, 0, 0]; //x,y,z
var drawType = 0;
var drawTypeShowText = ["輪到圈圈", "輪到叉叉"];
var winGmaeShowText = ["恭喜圈圈獲勝,請按重製遊戲開啟一場新局", "恭喜叉叉獲勝,請按重製遊戲開啟一場新局"];
function setup() {
    createCanvas(600, 600, WEBGL);

    for (var i = 0; i < 6; i++) {
        var sliderElement;
        if (i === 2) {
            sliderElement = createSlider(20, 600, 200);
        } else {
            sliderElement = createSlider(-400, 400, 0);
        }
        sliderGroup.push(sliderElement);
        h = map(i, 0, 7, 5, 600);
        sliderGroup[i].position(10 + h, height + 10);
        sliderGroup[i].style('width', '80px');
        sliderGroup[i].changed(changeCamera);
    }
    resetSetting();

    button = createButton('reset');
    button.position(10, height + 60);
    button.style('width', '80px');
    button.mouseClicked(resetSetting);


    gameStageSpan = createSpan('輪到圈圈');
    gameStageSpan.position(width + 10, 5);

    for (let index = 0; index < controlName.length; index++) {
        let element = createButton(controlName[index].key, controlName[index].value);
        element.position(width + 10, 10 + map(index, 0, controlName.length, 20, 400));
        element.style('width', '120px');
        element.mouseClicked(controlGameButton);

        controlBtn.push(element);
    }

    gameSizeStageSpan = createSpan('現在是 3 個連在一起就贏喔');
    gameSizeStageSpan.position(width + 10, 405);

}

function draw() {
    background(200);
    orbitControl();

    initGround();

    // createCircle(0, 0, 0);
    // createFork(1, 0, 0);

    createTargetElement(targetPostion[0], targetPostion[1], targetPostion[2]);
    for (let index = 0; index < gameElement.length; index++) {
        const element = gameElement[index];
        if (element.type == 0) {
            createCircle(element.pos[0], element.pos[1], element.pos[2]);
        }
        else if (element.type == 1) {
            createFork(element.pos[0], element.pos[1], element.pos[2]);
        }
    }
    if (winGmaeFlag) {
        push();
        strokeWeight(3);
        stroke(130, 3, 4);
        translate(-0.5 * GroundEdge, -0.5 * GroundEdge, 0);

        translate(0.5 * GroundUnit, 0.5 * GroundUnit, 0.5 * GroundUnit);

        var sx = winGmaeLineStart[0] * GroundUnit;
        var sy = winGmaeLineStart[1] * GroundUnit;
        var sz = winGmaeLineStart[2] * GroundUnit;
        var ex = winGmaeLineEnd[0] * GroundUnit;
        var ey = winGmaeLineEnd[1] * GroundUnit;
        var ez = winGmaeLineEnd[2] * GroundUnit;
        line(sx, sy, sz, ex, ey, ez);
        pop();
    }

}

function initGround() {
    push();

    // fill(255, 102, 94);

    ambientLight(255, 255, 255);
    ambientMaterial(255, 102, 94);

    translate(0, 0, -5);
    strokeWeight(1);
    stroke(0);
    box(GroundEdge, GroundEdge, 10);
    pop();

    push();
    strokeWeight(1);
    stroke(0);
    translate(-0.5 * GroundEdge, -0.5 * GroundEdge, 0);
    for (let index = 1; index < GroundSize; index++) {
        var temp = index * GroundUnit;
        line(temp, 0, 0, temp, GroundEdge, 0);
        line(0, temp, 0, GroundEdge, temp, 0);
    }
    pop();
}


//TODO 明顯一點
function createTargetElement(dx, dy, dz) {
    push();
    translate(-0.5 * GroundEdge, -0.5 * GroundEdge, 0);

    var rx = (dx + 0.5) * GroundUnit;
    var ry = (dy + 0.5) * GroundUnit;
    var rz = (dz + 0.5) * GroundUnit;
    // translate(20, 0, 0);
    translate(rx, ry, rz);

    noFill();
    strokeWeight(2);
    stroke(100, 100, 240);
    box(GroundUnit, GroundUnit, GroundUnit);
    pop();
}

function createCircle(dx, dy, dz) {
    push();
    stroke(0, 0, 0);
    ambientMaterial(255);
    translate(-0.5 * GroundEdge, -0.5 * GroundEdge, 0);

    var rx = (dx + 0.5) * GroundUnit;
    var ry = (dy + 0.5) * GroundUnit;
    var rz = (dz + 0.5) * GroundUnit;
    translate(rx, ry, rz);
    box(GroundUnit);
    pop();
}

function createFork(dx, dy, dz) {
    push();
    stroke(255, 255, 255);
    ambientMaterial(0);
    translate(-0.5 * GroundEdge, -0.5 * GroundEdge, 0);

    var rx = (dx + 0.5) * GroundUnit;
    var ry = (dy + 0.5) * GroundUnit;
    var rz = (dz + 0.5) * GroundUnit;
    translate(rx, ry, rz);
    box(GroundUnit);
    pop();
}

function resetSetting() {
    sliderGroup[0].value(0);
    sliderGroup[1].value(200);
    sliderGroup[2].value(200);
    sliderGroup[3].value(0);
    sliderGroup[4].value(0);
    sliderGroup[5].value(0);
    changeCamera();
}

function changeCamera() {

    // assigning sliders' value to each parameters
    X = sliderGroup[0].value();
    Y = sliderGroup[1].value();
    Z = sliderGroup[2].value();
    centerX = sliderGroup[3].value();
    centerY = sliderGroup[4].value();
    centerZ = sliderGroup[5].value();
    camera(X, Y, Z, centerX, centerY, centerZ, 0, 1, 0);
}

function keyPressed() {
    if (key == "w" || keyCode == UP_ARROW) {
        controlTargetElement(FrontPatten);
    }
    else if (key == "s" || keyCode == DOWN_ARROW) {
        controlTargetElement(BackPatten);
    }
    else if (key == "a" || keyCode == LEFT_ARROW) {
        controlTargetElement(LeftPatten);
    }
    else if (key == "d" || keyCode == RIGHT_ARROW) {
        controlTargetElement(RightPatten);
    }
    else if (key == "r") {
        controlTargetElement(UpPatten);
    }
    else if (key == "f") {
        controlTargetElement(DownPatten);
    }
    else if (key.toLowerCase() == "enter" || keyCode == 12 || keyCode == 32) {
        putPlayerElement();
    }
}

function controlGameButton(e) {
    e.target.blur();
    if (e.target.value == EnterPatten) {
        putPlayerElement();
    }
    else if (e.target.value == PreviousPatten) {
        previousPutPlayerElement();
    }
    else if (e.target.value == RestGamePatten) {
        restGame();
    }
    else if (e.target.value == GameIntroductionPatten) {
        gameIntroduction();
    }
    else if (e.target.value == threeSizeGamePatten) {
        if (gameElement.length > 0) {
            var r = confirm("遊戲還在進行,確定要重製遊戲並更換遊戲大小嗎?");
            if (r != true) {
                return;
            }
        }
        GameSize = 3;
        restGame();
    }
    else if (e.target.value == fourSizeGamePatten) {
        if (gameElement.length > 0) {
            var r = confirm("遊戲還在進行,確定要重製遊戲並更換遊戲大小嗎?");
            if (r != true) {
                return;
            }
        }
        GameSize = 4;
        restGame();
    }
    else {
        controlTargetElement(e.target.value);
    }
}

//TODO 自動跳到最上層的元素
function controlTargetElement(value) {
    var vector = [0, 0, 0];
    switch (value) {
        case FrontPatten:
            vector = [0, -1, 0];
            break;
        case BackPatten:
            vector = [0, 1, 0];
            break;
        case LeftPatten:
            vector = [-1, 0, 0];
            break;
        case RightPatten:
            vector = [1, 0, 0];
            break;
        case UpPatten:
            vector = [0, 0, 1];
            break;
        case DownPatten:
            vector = [0, 0, -1];
            break;
    }

    let canMoveTarget = true;
    if (hasGravity) {
        let tryMoveTargetDownPostion = [0, 0, 0];
        canMoveTarget = false;
        for (let index = 0; index < targetPostion.length; index++) {
            var temp = targetPostion[index] + vector[index];
            if ((temp >= 0 && temp < GroundSize)) {
                tryMoveTargetDownPostion[index] = temp;
            }
            else {
                tryMoveTargetDownPostion[index] = targetPostion[index];
            }
        }
        // z 軸
        if (tryMoveTargetDownPostion[2] > 0) {
            for (let index = 0; index < gameElement.length; index++) {
                const element = gameElement[index];
                if (tryMoveTargetDownPostion[0] == element.pos[0]
                    && tryMoveTargetDownPostion[1] == element.pos[1]
                    && tryMoveTargetDownPostion[2] - 1 == element.pos[2]) {
                    canMoveTarget = true;
                    break;
                }
            }
        }
        else {
            canMoveTarget = true;
        }

    }

    if (canMoveTarget) {
        for (let index = 0; index < targetPostion.length; index++) {
            var temp = targetPostion[index] + vector[index];
            if (temp >= 0 && temp < GroundSize) {
                targetPostion[index] += vector[index];
            }
        }
    }
    else {
        gameStageSpan.html("你的控制向不能懸空");
    }

}

function putPlayerElement() {
    if (!winGmaeFlag) {
        var isCanPut = true;
        for (let index = 0; index < gameElement.length; index++) {
            const element = gameElement[index];
            var x, y, z;
            [x, y, z] = [element.pos[0], element.pos[1], element.pos[2]];
            var xF = false, yF = false, zF = false;
            if (x == targetPostion[0]) {
                xF = true;
            }
            if (y == targetPostion[1]) {
                yF = true;
            }
            if (z == targetPostion[2]) {
                zF = true;
            }
            if (xF && yF && zF) {
                isCanPut = false;
                break;
            }
        }
        if (isCanPut) {
            gameElement.push({
                pos: CopyObject(targetPostion),
                type: drawType
            })

            checkIsWinGame();
            if (winGmaeFlag) {
                gameStageSpan.html(winGmaeShowText[drawType]);
            }
            else {
                drawType += 1;
                gameStageSpan
                drawType %= 2;
                gameStageSpan.html(drawTypeShowText[drawType]);
            }
        }
        else {
            gameStageSpan.html("已經有人放在這了");
        }
    }
}

function previousPutPlayerElement() {
    if (gameElement.length > 0) {
        gameElement.pop();
        winGmaeFlag = false;
        drawType += 1;
        drawType %= 2;
        gameStageSpan.html(drawTypeShowText[drawType]);
    }

}
function checkIsWinGame() {
    var checkThreeDimensionalList = [];
    for (let indexZ = 0; indexZ < GroundSize; indexZ++) {
        var tempListZ = [];
        for (let indexY = 0; indexY < GroundSize; indexY++) {
            var tempListY = [];
            for (let indexX = 0; indexX < GroundSize; indexX++) {
                tempListY.push(0);
            }
            tempListZ.push(tempListY);
        }
        checkThreeDimensionalList.push(tempListZ);
    }

    for (let index = 0; index < gameElement.length; index++) {
        const element = gameElement[index];
        var x, y, z;
        [x, y, z] = [element.pos[0], element.pos[1], element.pos[2]];
        element.canOutSee = true;
        checkThreeDimensionalList[z][y][x] = (element.type + 1); // 0 -> 1,1->2
    }

    //被包住的點不算 8個面都有東西
    //將被包住的點的 canOutSee 改為 false 並把 checkThreeDimensionalList[z][y][x] 設為 0
    // 3*3*3 27-1 = 26 
    var outSeeCheckVectorList = [
        // 基本的 6 塊  
        // 前 後 左
        // 右 上 下
        [0, -1, 0], [0, 1, 0], [-1, 0, 0],
        [1, 0, 0], [0, 0, 1], [0, 0, -1],
    ];
    var x, y, z;
    [x, y, z] = [0, 0, 0];
    for (let indexCheck = 0; indexCheck < outSeeCheckVectorList.length; indexCheck++) {
        const unitVector = outSeeCheckVectorList[indexCheck];
        x = x + unitVector[0];
        y = y + unitVector[1];
        z = z + unitVector[2];
    }
    //透過每一點去做檢查有沒有被包住
    for (let index = 0; index < gameElement.length; index++) {
        const element = gameElement[index];
        var x, y, z;
        [x, y, z] = [element.pos[0], element.pos[1], element.pos[2]];

        var canOutSee = false;
        for (let indexCheck = 0; indexCheck < outSeeCheckVectorList.length && !canOutSee; indexCheck++) {
            const unitVector = outSeeCheckVectorList[indexCheck];
            var tempx, tempy, tempz;
            tempx = x + unitVector[0];
            tempy = y + unitVector[1];
            tempz = z + unitVector[2];
            var checkPoint = [tempx, tempy, tempz];
            
            if(tempz > -1){
                if(tempx > -1 && tempy > -1){
                    //假設他不存在 或 =0
                    if(!checkThreeDimensionalList[tempz][tempy][tempx] || checkThreeDimensionalList[tempz][tempy][tempx] == 0){
                        canOutSee =true;
                    }
                }
            }
        }

        if(!canOutSee){
            element.canOutSee = false;
            checkThreeDimensionalList[z][y][x] = 0;
        }
    }

    //透過每一點去做檢查
    for (let index = 0; index < gameElement.length; index++) {
        const element = gameElement[index];
        if (!element.canOutSee) {
            continue;
        }
        var x, y, z, eleType;
        [x, y, z] = [element.pos[0], element.pos[1], element.pos[2]];
        eleType = element.type + 1;
        var winUnitVectorList = [
            [1, 0, 0], [0, 1, 0], [1, 1, 0], [1, -1, 0], //一維平面
            [0, 0, 1], [1, 1, 1], [1, -1, -1], [1, -1, 1], [-1, -1, 1], // 垂直和四個最斜的斜線　　　1 0 2,1 1 1,  
            [1, 0, 1], [0, 1, 1], [0, 1, -1], [-1, 0, 1], [1, 1, 0], [1, -1, 0]// 左右兩邊的斜線
        ];

        for (let indexCheck = 0; indexCheck < winUnitVectorList.length; indexCheck++) {
            const unitVector = winUnitVectorList[indexCheck];
            var isWin = true;
            var tempx, tempy, tempz;
            for (let continueCount = 1; continueCount < GameSize; continueCount++) {
                tempx = x + unitVector[0] * continueCount;
                tempy = y + unitVector[1] * continueCount;
                tempz = z + unitVector[2] * continueCount;
                var checkPoint = [tempx, tempy, tempz];

                for (let edgeCheck3D = 0; edgeCheck3D < 3; edgeCheck3D++) {
                    const elementCheck = checkPoint[edgeCheck3D];
                    if (elementCheck < 0 || elementCheck >= GroundSize) {
                        isWin = false;
                        break;
                    }
                }
                if (!isWin) {
                    break;
                }

                if (checkThreeDimensionalList[tempz][tempy][tempx] != eleType) {
                    isWin = false;
                    break;
                }
            }
            if (isWin) {
                winGmaeLineStart = [x, y, z];
                winGmaeLineEnd = [tempx, tempy, tempz];
                winGmaeFlag = true;
                break;
            }
        }
    }
}

function restGame() {
    gameElement = [];
    drawType = 0;
    winGmaeFlag = false;
    targetPostion = [0, 0, 0];
    GroundEdge = GroundUnit * GroundSize;

    if (GameSize == 3) {
        gameSizeStageSpan.html("現在是 3 個連在一起就贏喔");
    }
    else {
        gameSizeStageSpan.html("現在是 4 個連在一起就贏喔");
    }

}

// TODO　修改遊戲說明
function gameIntroduction() {
    var textContext = "　　這是一款立體的3D圈圈叉叉，可以透過下方按鈕來決定要玩3*3*3或4*4*4。\n" +
        "　　遊玩方式是透過旁邊的前後左右上下按鈕或鍵盤上的wsadrf(方別與前面對照)和只有前後左右的方向健決定要放的位置。\n" +
        '　　每個單位格子只能放一種圖形當完成連線便能獲勝，並會以一條線顯示獲勝的路徑並且需透過"重製遊戲"的按鈕才能開啟新的一局。\n' +
        '　　可用滑鼠及下方的控制選項控制遊戲視角，祝你玩的愉快~';
    alert(textContext);
}

function CopyObject(object) {
    return JSON.parse(JSON.stringify(object));
}

