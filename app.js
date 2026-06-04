let board=null,game=null,puzzles=[],currentIdx=0,solveStep=0,streakCount=0,skipUsed=false,gameActive=false,moveHistory=[];

const $=s=>document.getElementById(s);
const splashScreen=$('splash-screen'),gameScreen=$('game-screen'),gameoverScreen=$('gameover-screen');

function showScreen(name){
  [splashScreen,gameScreen,gameoverScreen].forEach(s=>s.classList.remove('active'));
  $(name+'-screen').classList.add('active');
}

function initGame(){
  puzzles=getSortedPuzzles();currentIdx=0;streakCount=0;skipUsed=false;gameActive=true;moveHistory=[];
  $('streak-count').textContent='0';
  $('skip-btn').disabled=false;$('skip-count').textContent='(1)';
  $('moves-list').innerHTML='';
  showScreen('game');loadPuzzle(currentIdx);
}

function loadPuzzle(idx){
  if(idx>=puzzles.length){triggerGameOver(true);return;}
  solveStep=0;
  const pz=puzzles[idx];
  game=new Chess(pz.fen);
  const playerIsWhite=game.turn()==='w';
  const orientation=playerIsWhite?'white':'black';

  $('top-player-name').textContent=playerIsWhite?'Qora (Raqib)':'Oq (Raqib)';
  $('bottom-player-name').textContent=playerIsWhite?'Oq (Siz)':'Qora (Siz)';

  if(board)board.destroy();
  board=Chessboard('board',{
    position:pz.fen,orientation:orientation,draggable:true,
    onDragStart:onDragStart,onDrop:onDrop,onSnapEnd:onSnapEnd,
    pieceTheme:'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  });

  $('puzzle-number').textContent='Zadacha #'+(idx+1);
  const diff=getDifficultyLabel(pz.difficulty);
  $('puzzle-difficulty').textContent=diff.text;
  $('puzzle-difficulty').className='difficulty-badge '+diff.cls;
  setStatus('thinking',"Yurish navbatingiz!");
  $('board-wrapper').classList.remove('correct-flash','wrong-flash');
  updateProgress();
}

function onDragStart(source,piece){
  if(!gameActive||game.game_over())return false;
  const t=game.turn();
  if((t==='w'&&piece.startsWith('b'))||(t==='b'&&piece.startsWith('w')))return false;
  return true;
}

function onDrop(source,target){
  if(!gameActive)return'snapback';
  const move=game.move({from:source,to:target,promotion:'q'});
  if(!move)return'snapback';
  const pz=puzzles[currentIdx];
  const expected=pz.solution[solveStep];
  const played=source+target;
  if(played===expected){handleCorrect(move);}
  else{handleWrong(move);return'snapback';}
}

function onSnapEnd(){if(board&&game)board.position(game.fen());}

function handleCorrect(move){
  addMove(move.san,true);solveStep++;
  const pz=puzzles[currentIdx];
  if(solveStep<pz.solution.length){
    setStatus('correct',"To'g'ri! Raqib javob bermoqda...");
    $('board-wrapper').classList.add('correct-flash');
    setTimeout(()=>{$('board-wrapper').classList.remove('correct-flash');playOpponent();},700);
  }else{puzzleSolved();}
}

function playOpponent(){
  const pz=puzzles[currentIdx];
  const oppMove=pz.solution[solveStep];
  const from=oppMove.substring(0,2),to=oppMove.substring(2,4);
  const move=game.move({from,to,promotion:'q'});
  if(move){board.position(game.fen());addMove(move.san,false);solveStep++;setStatus('thinking',"Yurish navbatingiz!");}
}

function handleWrong(move){
  game.undo();
  $('board-wrapper').classList.add('wrong-flash');
  setTimeout(()=>$('board-wrapper').classList.remove('wrong-flash'),500);
  setStatus('wrong',"Noto'g'ri! O'yin tugadi.");
  gameActive=false;
  setTimeout(()=>triggerGameOver(false),1200);
}

function puzzleSolved(){
  streakCount++;$('streak-count').textContent=streakCount;updateProgress();
  setStatus('correct',"Zo'r! Keyingi zadacha...");
  $('board-wrapper').classList.add('correct-flash');
  setTimeout(()=>{
    $('board-wrapper').classList.remove('correct-flash');
    currentIdx++;$('moves-list').innerHTML='';moveHistory=[];
    loadPuzzle(currentIdx);
  },1000);
}

function useSkip(){
  if(skipUsed||!gameActive)return;
  skipUsed=true;$('skip-btn').disabled=true;$('skip-count').textContent='(0)';
  setStatus('skipped',"Zadacha o'tkazildi!");
  setTimeout(()=>{currentIdx++;$('moves-list').innerHTML='';moveHistory=[];loadPuzzle(currentIdx);},800);
}

function triggerGameOver(completed){
  gameActive=false;$('final-streak').textContent=streakCount;
  if(completed){$('gameover-icon').textContent='🏆';$('gameover-title').textContent='Tabriklaymiz!';$('gameover-message').textContent='Barcha zadachalar yechildi!';}
  else if(streakCount===0){$('gameover-icon').textContent='😅';$('gameover-title').textContent="O'yin tugadi!";$('gameover-message').textContent='Qayta urining!';}
  else if(streakCount<5){$('gameover-icon').textContent='💪';$('gameover-title').textContent='Yaxshi!';$('gameover-message').textContent=streakCount+" ta zadacha yechdingiz.";}
  else{$('gameover-icon').textContent='🔥';$('gameover-title').textContent='Ajoyib!';$('gameover-message').textContent=streakCount+" ta streak!";}
  showScreen('gameover');
}

function setStatus(type,msg){const el=$('status-message');el.textContent=msg;el.className='status-message status-'+type;}
function updateProgress(){const t=puzzles.length;const pct=Math.round((currentIdx/t)*100);$('progress-bar').style.width=pct+'%';$('progress-text').textContent=currentIdx+' / '+t;}
function addMove(san,isPlayer){moveHistory.push({san,isPlayer});renderMoves();}
function renderMoves(){const el=$('moves-list');el.innerHTML='';moveHistory.forEach(m=>{const d=document.createElement('div');d.className='move-entry '+(m.isPlayer?'correct':'opponent');d.textContent=m.san;el.appendChild(d);});}

$('start-btn').addEventListener('click',initGame);
$('retry-btn').addEventListener('click',initGame);
$('skip-btn').addEventListener('click',useSkip);
document.addEventListener('DOMContentLoaded',()=>showScreen('splash'));