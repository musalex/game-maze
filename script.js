setTimeout(function() {scrollTo(0,0)}, 1);		

		const TD_SIZE = 45;
		const MAP_SIZE = 6;
		if(!localStorage.getItem('settings')) {
			localStorage.setItem('settings', 
			JSON.stringify({'moveLeft'  : 37,
			'moveRight' : 39,
			'moveUp'    : 38,
			'moveDown'  : 40,
			'getMap'    : 77,
			'dropBomb'  : 32
			}))
		}
		var settingsObj = JSON.parse(localStorage.getItem('settings'));
		var table = document.querySelector('#main').firstElementChild.children;
		for(var i = 0, cells = []; i < table.length; i++) { 
			cells[i] = table[i].children;
		}

		var size1 = cells.length, size2 = cells[0].length;
		var arr = new Array(size1).fill(0).map(e=>new Array(size2).fill('.'));
		for(var i = 0; i < size1; i++) {
			for (var j = 0; j < size2; j++) 
				if (!(i < 3 && j < 3) && Math.random() > 0.64) {
						arr[i][j] = 'W';
						cells[i][j].classList.add('wall');
				} else {
					cells[i][j].classList.add('void');
				}
		}

		cells[0][0].style.backgroundImage = 'url("textures/turnRight.png")';
		cells[0][0].classList.remove('void')
		cells[0][0].classList.add('hero');

		for(var i = 0, count = 0; i < size1; i++) 
			for (var j = 0; j < size2; j++) {
				count = 0;
				if (arr[i][j] == 'W') {
					for (var k = i-1; k < i+2; k++)
						for (var t = j -1; t < j+2; t++)
							if (arr[k] != undefined && arr[k][t] != undefined && arr[k][t] == 'W' && !(k==i && t==j))
								count++;
			if (count == 0) {
				arr[i][j] = '.';
				cells[i][j].classList.remove('wall');
				cells[i][j].classList.add('void');
			}
		}

		}

		var key = document.createElement('div');
		key.className = 'key';
		var magentaKey = key.cloneNode(false);
		var redKey = key.cloneNode(false);
		var whiteKey = key.cloneNode(false);
		//cells[0][1].append(key);
		var keyColor = ['red', 'magenta', 'white'];

		

		var tableSize = size2 * TD_SIZE;

		var table = document.querySelector('#main');
		table.style.width = tableSize + 'px';

		var bombCounter = 0;

		for(var i = 0; i < cells.length; i++) {
			for (var j = 0; j < cells[0].length; j++) {
				if (arr[i][j] != 'W' && Math.random() > 0.9993) {
						arr[i][j] = 'bomb';
						cells[i][j].classList.add('bomb');
						cells[i][j].classList.remove('void');
						bombCounter++;
				}
			}
		}
		console.log(bombCounter)
		function renderKeys(bombs, keyColor, key) {
			for (var i = 0; i < size1 && keyColor.length; i++) {
				for (var j = 0; j < size2 && keyColor.length; j++) {
					if (!(i < 20 && j < 20)) {
						if (arr[i][j] == '.' && Math.random() > 0.99999) {
							var tmp = key.cloneNode(false);
							tmp.style.background = keyColor.pop();
							cells[i][j].append(tmp)
							cells[i][j].classList.remove('void');
							console.log(i, j)
							bombs++;
						}
					}
				}
			}
			if (bombs < 3)
				renderKeys(bombs, keyColor, key);
		}

		renderKeys(0, keyColor, key)

		function playSound(src) {
			let song = new Audio(src);
			song.volume = 0.6;
			song.play();
		}

		arr[size1-1][size2-1] = 'finish';
		cells[size1-1][size2-1].classList.remove('void');
		cells[size1-1][size2-1].className = 'finish';

		cells[size1 - 2][size2 - 2].className = 'lastWall magWall';
		cells[size1 - 2][size2 - 2].classList.remove('void');

		cells[size1 - 2][size2 - 1].className = 'lastWall redWall';
		cells[size1 - 2][size2 - 1].classList.remove('void');

		cells[size1 - 1][size2 - 2].className = 'lastWall whiteWall';
		cells[size1 - 1][size2 - 2].classList.remove('void');

		arr[size1 - 2][size2 - 2] = 'W';
		arr[size1 - 2][size2 - 1] = 'W';
		arr[size1 - 1][size2 - 2] = 'W';



// ************************************* STATS ****************************************8
		function updateStats(stats, hero) {
			stats.innerHTML =   `Bombs : ${hero.bombs} <br>   Health: ${hero.health}`
		}
		var stats = document.querySelector('#stats');
// ************************************************************************************



// *************************** HERO ***********************************************************************
		 function drop(x, y, cells, arr, hero, stats) {
            	if (cells[y] && cells[y][x] && !cells[y][x].classList.contains('void')) {
					return arr;
				}
					hero.bombs--;
                    cells[y][x].className = 'bomb';
                    setTimeout(()=> {
                        cells[y][x].className = 'droppedBomb'
					}, 10)
					setTimeout(() => {
						playSound('sounds/explosion.mp3');
					}, 1500)
                    setTimeout(()=> {
                        for (var i = y - 1; i < y + 2; i++)
                            for (var j = x - 1; j < x + 2; j++)
                                if (arr[i] && arr[i][j]) {
                                    if (cells[i][j].classList.contains('wall')) {
                                        arr[i][j] = '.';
										cells[i][j].className = 'void';
										mapArr[i][j].className = 'void';
                                    } else if(cells[i][j].classList.contains('hero')) {
                                        hero.kill();
                                    }
								}
                        cells[y][x].className = 'void';
                        arr[y][x] = '.'
                        updateStats(stats, hero);
                    },1900)
					arr[y][x] = 'W';
					return arr;				
        }
		var hero = {
			x : 0,
			y : 0,
			bombs : 2,
			health : 100,
			kill() {
				var div = document.createElement('div');
				var back = document.createElement('div');
				back.className = 'finish-back';
				div.className = 'finish-block';
				div.textContent = 'GAME OVER';
				div.style.display = 'block';
				document.body.append(back);
				document.body.append(div);
				setTimeout(function(){back.style.opacity = 1}, 100)
				document.onkeydown = null;
				setTimeout(function(){div.style.opacity = 1}, 100)
			},
			dropBomb() {
				var cell = cells[hero.y][hero.x].style.backgroundImage;
				var face = cell.slice(cell.indexOf('turn')+4, cell.indexOf('.png')).toLowerCase(), x, y;
				switch(face) {
					case 'right' :	arr = drop(hero.x + 1, hero.y, cells, arr, hero, stats); break;
					case 'up' 	 : 	arr = drop(hero.x, hero.y - 1, cells, arr, hero, stats); break; 
					case 'left'  :  arr = drop(hero.x - 1, hero.y, cells, arr, hero, stats); break; 
					case 'down'  :  arr = drop(hero.x, hero.y + 1, cells, arr, hero, stats); break; 
				}
			}
		}

// *********************************************************************************************************

		function Zombie(x, y) {
			this.x = x;
			this.y = y;
			this.health = 30;
			this.damage = 30;
		}

	
		updateStats(stats, hero)
		


// **************************** MAP ***************************************
		var mapTableEl = document.querySelector('#main').cloneNode(true);
		var mapTable = mapTableEl.firstElementChild.children;
		for (var i = 0, mapArr = []; i < size1; i++) {
			mapArr[i] = mapTable[i].children;
			for (var j = 0,cell; j < size2; j++) {
				cell = mapArr[i][j];
				cell.classList.remove('void');
				cell.style.backgroundImage = '';
				if (cell.firstElementChild && cell.firstElementChild.classList.contains('key')) {
					cell.classList.remove('key');
					cell.firstElementChild.remove();
				}
				cell.classList.add('notExplored')
				cell.style.width = MAP_SIZE + 'px';
				cell.style.height = MAP_SIZE + 'px';
			}
		}

		var map = document.querySelector('#map');
		var mapHeight = getComputedStyle(mapTableEl).height;
		var mapWidth = tableSize / TD_SIZE * MAP_SIZE;
		mapTableEl.style.width = mapWidth + 'px'; 
		map.style.left = (document.documentElement.clientWidth - mapWidth) / 2 + 'px';

	
		//mapTableEl.classList.add('closed');	
		map.append(mapTableEl);

		var screenSizeX = parseInt(document.documentElement.clientWidth)  / TD_SIZE | 0;
		var screenSizeY = parseInt(document.documentElement.clientHeight) / TD_SIZE | 0;

		for (var i = 0; i <=screenSizeY; i++) {
			for (var j = 0; j <=screenSizeX; j++) {
				mapArr[i][j].classList.remove('notExplored')
			}
		}
// ******************************************************************************************


		function move(side, dx, dy, arr, cells, hero, mapArr, e) {
			if (arr[hero.y+dy] && arr[hero.y + dy][hero.x + dx] && arr[hero.y + dy][hero.x + dx] != 'W') {
				if (e.shiftKey) {
					cells[hero.y][hero.x].style.backgroundImage = `url("textures/turn${side[0].toUpperCase() + side.slice(1)}.png")`;
					return false;
				}
				cells[hero.y][hero.x].classList.add('void');
				mapArr[hero.y][hero.x].classList.add('void');
				cells[hero.y][hero.x].classList.remove('hero');
				mapArr[hero.y][hero.x].classList.remove('heroMap');
				cells[hero.y][hero.x].style.backgroundImage = 'none';
				hero.x += dx;
				hero.y += dy;
				cells[hero.y][hero.x].classList.remove('void');
				mapArr[hero.y][hero.x].classList.remove('void');
				mapArr[hero.y][hero.x].classList.add('heroMap');
				cells[hero.y][hero.x].classList.add('hero');
			}
		}
		var mainHandleKeydown = function(e) {
			var code = e.keyCode;
			//console.log(code);
			let x = hero.x, y = hero.y;
			switch(code) {
				case settingsObj['moveLeft'] : // Move left
					if (move('left', -1, 0, arr, cells, hero, mapArr,e) === false) {
						return false;
					}
					if (arr[y][x - 1] && arr[y][x - 1] != 'W') {
						if (x < arr[0].length - 15) {
							scrollBy(-TD_SIZE, 0);
							let b = y < 7, c = y > arr.length - 6;
							for (var i = b ? 0 : c ? arr.length - screenSizeY : y - 7; i < (b ? screenSizeY+1 : c ? arr.length : screenSizeY + y - 6); i++) {
								if (mapArr[i] && mapArr[i][x-8]) mapArr[i][x-8].classList.remove('notExplored');
							}
						}
					};
					cells[hero.y][hero.x].style.backgroundImage = 'url("textures/turnLeft.png")'
					break;
				case settingsObj['moveUp'] : // Move up
					if (move('up', 0, -1, arr, cells, hero, mapArr,e) === false) {
						return false;
					}
					if (arr[y - 1] && arr[y - 1][x] != 'W') {
						if (y < arr.length - 6) {
							scrollBy(0,-TD_SIZE);
							let b = x < 11, c = x > size2 - 10;
							for (var i = b ? 0 : c ? size2 - screenSizeX : x - 10; 
							i < (b ? screenSizeX+1 : c ? size2 : screenSizeX + x - 9); i++) {
								if (mapArr[y-7] && mapArr[y-7][i]) mapArr[y-7][i].classList.remove('notExplored');
							}
						}
					};
					cells[hero.y][hero.x].style.backgroundImage = 'url("textures/turnUp.png")'
					break;

				case settingsObj['moveRight'] : // Move right
					if (move('right', 1, 0, arr, cells, hero, mapArr,e) === false) {
						return false;
					}
					if (arr[y][x+1] && arr[y][x+1] != 'W') {
						if (x > 10 && x < arr[0].length - 10) {
							scrollBy(TD_SIZE, 0);
							let b = y < 7, c = y > arr.length - 6;
							for (var i = b ? 0 : c ? arr.length - screenSizeY : y - 7;
							i < (b ? screenSizeY : c ? arr.length : screenSizeY + y - 7); i++) 	{
								if (mapArr[i] && mapArr[i][screenSizeX + x-10]) 
									mapArr[i][screenSizeX + x-10].classList.remove('notExplored');
							}
						};
					}
					cells[hero.y][hero.x].style.backgroundImage = 'url("textures/turnRight.png")'
					break;

				case settingsObj['moveDown'] : // Move down
					if (move('down', 0, 1, arr, cells, hero, mapArr,e) === false) {
						return false;
					}
					if (arr[y + 1] && arr[y + 1][x] != 'W') {
						if (y > 7 && y < arr.length - 4) {
							scrollBy(0,TD_SIZE);
							let b = x < 11, c = x > size2 - 10;
							for (var i = b ? 0 : c ? size2 - screenSizeX : x - 11;
							i < (b ? screenSizeX+1 : c ? size2 : screenSizeX + x - 10); i++) {
								if (mapArr[screenSizeY+ y-8] && mapArr[screenSizeY + y-8][i]) 
									mapArr[screenSizeY+ y-8][i].classList.remove('notExplored');
							}
						}
					};
					cells[hero.y][hero.x].style.backgroundImage = 'url("textures/turnDown.png")'
					break;

				case settingsObj['dropBomb'] :
					if (hero.bombs) {
						hero.dropBomb();
					}
				break;
				
				case settingsObj['getMap'] :
					map.classList.toggle('closed');
					// map.classList.remove('closed');
					// document.onkeydown = (e)=>{
					// 	if (e.keyCode == settingsObj['getMap']) {
					// 		map.classList.add('closed');
					// 		document.onkeydown = mainHandleKeydown;
					// 	}
					// };
				break;

				case 27 : 
					settings.classList.toggle('closed');
					settings.style.left = (document.documentElement.clientWidth - settings.offsetWidth) / 2 + 'px';
				break;

			}
			
			if (cells[hero.y][hero.x].classList.contains('bomb')) {
				cells[hero.y][hero.x].classList.remove('bomb');
				mapArr[hero.y][hero.x].classList.remove('bomb');
				hero.bombs++;
				updateStats(stats, hero);
			 } else if (cells[hero.y][hero.x].firstElementChild && cells[hero.y][hero.x].firstElementChild.className == 'key') {
				hero[cells[hero.y][hero.x].firstElementChild.style.background + 'Key'] = true;
				cells[hero.y][hero.x].firstElementChild.remove();
				if (hero['magentaKey'] && hero['redKey'] && hero['whiteKey']) {
					cells[size1 - 2][size2 - 2].className = ''
					cells[size1 - 2][size2 - 1].className = '';
					cells[size1 - 1][size2 - 2].className = '';
					arr[size1 - 2][size2 - 2] = '.';
					arr[size1 - 2][size2 - 1] = '.';
					arr[size1 - 1][size2 - 2] = '.';
				}
			} else if (cells[hero.y][hero.x].classList.contains('finish')) {
				var div = document.querySelector('.finish-block');
				div.style.display = 'block';
				playSound('sounds/vika.mp3')
				var back = document.createElement('div');
				setTimeout(function() {
					song.pause();
				}, 28000)
				back.className = 'finish-back';
				document.body.append(back);
				setTimeout(function(){back.style.opacity = 1}, 1500)
				document.onkeydown = null;
				setTimeout(function(){div.style.opacity = 1}, 100)
			}
		}

		document.onkeydown = mainHandleKeydown;

//****************************************************************************************************************** */

// *********************** SETTINGS ******************************************************************************
	var settings = document.querySelector('#settings');
	settings.style.left = (document.documentElement.clientWidth - settings.offsetWidth) / 2 + 'px';
	const CHARS = {
		13 : 'Enter',
		32: 'Space',
		37: 'Left arrow',
		38: 'Up arrow',
		39: 'Right arrow',
		40: 'Down arrow',
	}
	var btnArr =  settings.querySelectorAll('.settBtn');
	for (let i = 0, code, char; i < btnArr.length; i++) {
		code = settingsObj[btnArr[i].getAttribute('name')];
		char = !code ? 'Nothing' : CHARS[code] || String.fromCharCode(code);
		btnArr[i].textContent = char || 'Nothing';
	}
	settings.onclick = function() {
		var oldTarget = null;
		return function(e) {
			if (!e.target.classList.contains('settBtn')) return;
			
			let name = e.target.getAttribute('name');
			if (oldTarget) {
				oldTarget.classList.remove('chosen');
			}

			let handlePress = function(name, target) {
				return function(e) {
					if (e.keyCode == 27) {
						document.onkeydown = mainHandleKeydown;
						target.classList.remove('chosen')
						return;
					}
					let char = String.fromCharCode(e.keyCode);
					for (var k in settingsObj) {
						if (settingsObj[k] == e.keyCode) {
							settingsObj[k] = null;
							settings.querySelector(`[name="${k}"]`).textContent = 'Nothing';
							break;
						}
					}
						var btn = settings.querySelector(`[name="${name}"]`);
						settingsObj[name] = e.keyCode;
						btn.textContent = CHARS[e.keyCode] || char;
						localStorage.setItem('settings', JSON.stringify(settingsObj))
						document.onkeydown = mainHandleKeydown;
						target.classList.remove('chosen');
						console.log(oldTarget)
				}
			}
			oldTarget = e.target;
			e.target.classList.add('chosen');
			document.onkeydown = handlePress(name, e.target);
		}
	}()
		