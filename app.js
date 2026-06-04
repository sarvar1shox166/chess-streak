// ============================================================
//  SHAXMAT STREAK - Asosiy o'yin logikasi + Panellar
// ============================================================

let board=null,game=null,puzzles=[],currentIdx=0,solveStep=0,streakCount=0,skipUsed=false,gameActive=false,moveHistory=[];

const $=s=>document.getElementById(s);

// ─── NAVIGATSIYA ─────────────────────────────────────────
function navigateTo(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
  $(page+'-page').classList.add('active');
  const link=document.querySelector('[data-page="'+page+'"]');
  if(link)link.classList.add('active');
  if(page==='home')updateHomeStats();
  if(page==='leaderboard')updateLeaderboard();
  if(page==='profile')updateProfile();
}

document.querySelectorAll('.nav-link').forEach(link=>{
  link.addEventListener('click',e=>{
    e.preventDefault();
    navigateTo(link.dataset.page);
  });
});

// ─── LOCAL STORAGE ───────────────────────────────────────
function getStats(){
  return JSON.parse(localStorage.getItem('chess-streak-stats')||'{"bestStreak":0,"totalSolved":0,"totalGames":0,"totalAttempts":0,"history":[]}');
}
function saveStats(stats){localStorage.setItem('chess-streak-stats',JSON.stringify(stats));}
function getProfile(){return JSON.parse(localStorage.getItem('chess-streak-profile')||'{"name":""}');}
function saveProfileData(data){localStorage.setItem('chess-streak-profile',JSON.stringify(data));}
function getSettings(){return JSON.parse(localStorage.getItem('chess-streak-settings')||'{"theme":"brown","sound":true}');}
function saveSettings(s){localStorage.setItem('chess-streak-settings',JSON.stringify(s));}

// ─── HOME STATS ──────────────────────────────────────────
function updateHomeStats(){
  const s=getStats();
  $('home-best-streak').textContent=s.bestStreak;
  $('home-total-solved').textContent=s.totalSolved;
  $('home-total-games').textContent=s.totalGames;
  const acc=s.totalAttempts>0?Math.round((s.totalSolved/s.totalAttempts)*100):0;
  $('home-accuracy').textContent=acc+'%';
}

// ─── LEADERBOARD ─────────────────────────────────────────
function updateLeaderboard(){
  const fakeData=[
    {name:'Abdulloh',streak:18,games:25},
    {name:'Sardor',streak:15,games:30},
    {name:'Malika',streak:14,games:20},
    {name:'Bobur',streak:12,games:18},
    {name:'Kamola',streak:11,games:22},
    {name:'Jasur',streak:10,games:15},
    {name:'Dilnoza',streak:9,games:12},
    {name:'Otabek',streak:8,games:16}
  ];
  const stats=getStats();
  const profile=getProfile();
  const myName=profile.name||'Siz';
  const allData=[...fakeData,{name:myName,streak:stats.bestStreak,games:stats.totalGames,isYou:true}];
  allData.sort((a,b)=>b.streak-a.streak);

  const list=$('leaderboard-list');
  list.innerHTML='';
  let yourRank='-';
  allData.forEach((item,i)=>{
    const rank=i+1;
    if(item.isYou)yourRank=rank;
    const medals=['','&#129351;','&#129352;','&#129353;'];
    const rankText=rank<=3?medals[rank]:rank;
    const row=document.createElement('div');
    row.className='lb-row'+(rank<=3?' top-3':'')+(item.isYou?' you':'');
    row.innerHTML='<span class="lb-rank">'+rankText+'</span><span class="lb-name">'+(item.isYou?'&#11088; '+item.name:item.name)+'</span><span class="lb-score">'+item.streak+'</span><span class="lb-games">'+item.games+'</span>';
    list.appendChild(row);
  });
  $('your-rank').textContent='#'+yourRank;
}

// ─── PROFILE ─────────────────────────────────────────────
function updateProfile(){
  const stats=getStats();
  const profile=getProfile();
  $('profile-name').value=profile.name||'';
  $('prof-streak').textContent=stats.bestStreak;
  $('prof-solved').textContent=stats.totalSolved;
  $('prof-games').textContent=stats.totalGames;

  const histList=$('game-history-list');
  histList.innerHTML='';
  const history=stats.history||[];
  history.slice(-10).reverse().forEach(h=>{
    const div=document.createElement('div');
    div.className='history-item';
    div.innerHTML='<span class="history-streak">&#128293; Streak: '+h.streak+'</span><span class="history-date">'+h.date+'</span>';
    histList.appendChild(div);
  });
  if(history.length===0){
    histList.innerHTML='<p style="color:var(--dim);font-size:14px;">Hali o\'yin o\'ynalmagan</p>';
  }
}

function saveProfile(){
  const name=$('profile-name').value.trim();
  saveProfileData({name});
  alert('Profil saqlandi!');
}

// ─── SETTINGS ────────────────────────────────────────────
function initSettings(){
  const s=getSettings();
  $('sound-toggle').checked=s.sound;
  document.querySelectorAll('.color-option').forEach(opt=>{
    opt.classList.toggle('active',opt.dataset.theme===s.theme);
    opt.addEventListener('click',()=>{
      document.querySelectorAll('.color-option').forEach(o=>o.classList.remove('active'));
      opt.classList.add('active');
      applyTheme(opt.dataset.theme);
      s.theme=opt.dataset.theme;
      saveSettings(s);
    });
  });
  $('sound-toggle').addEventListener('change',()=>{
    s.sound=$('sound-toggle').checked;
    saveSettings(s);
  });
  applyTheme(s.theme);
}

function applyTheme(theme){
  const themes={
    brown:{light:'#f0d9b5',dark:'#b58863'},
    green:{light:'#ffffdd',dark:'#86a666'},
    blue:{light:'#dee3e6',dark:'#8ca2ad'},
    purple:{light:'#e8dff5',dark:'#7b61a6'}
  };
  const t=themes[theme]||themes.brown;
  document.documentElement.style.setProperty('--board-light',t.light);
  document.documentElement.style.setProperty('--board-dark',t.dark);
  // Apply to chessboard squares
  const style=document.getElementById('board-theme-style')||document.createElement('style');
  style.id='board-theme-style';
  style.textContent='.white-1e1d7{background:'+t.light+' !important}.black-3c85d{background:'+t.dark+' !important}';
  document.head.appendChild(style);
}

function clearAllData(){
  if(confirm('Barcha ma\'lumotlarni o\'chirmoqchimisiz?')){
    localStorage.removeItem('chess-streak-stats');
    localStorage.removeItem('chess-streak-profile');
    localStorage.removeItem('chess-streak-settings');
    alert('Barcha ma\'lumotlar o\'chirildi!');
    updateHomeStats();
    updateProfile();
  }
}

// ─── O'YIN LOGIKASI ──────────────────────────────────────
function showScreen(name){
  document.querySelectorAll('#game-page .screen').forEach(s=>s.classList.remove('active'));
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
    pieceTheme: function(piece) {
      var pieces = {
        wK:'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
        wQ:'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
        wR:'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
        wB:'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
        wN:'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
        wP:'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
        bK:'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
        bQ:'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
        bR:'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
        bB:'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
        bN:'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
        bP:'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg'
      };
      return pieces[piece];
    }
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
  // Update stats
  const stats=getStats();
  stats.totalSolved++;
  stats.totalAttempts++;
  saveStats(stats);
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
  // Save stats
  const stats=getStats();
  stats.totalGames++;
  if(!completed)stats.totalAttempts++;
  if(streakCount>stats.bestStreak)stats.bestStreak=streakCount;
  const now=new Date();
  stats.history.push({streak:streakCount,date:now.toLocaleDateString('uz-UZ')});
  if(stats.history.length>50)stats.history=stats.history.slice(-50);
  saveStats(stats);

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

// ─── EVENT LISTENERS ─────────────────────────────────────
$('start-btn').addEventListener('click',initGame);
$('retry-btn').addEventListener('click',initGame);
$('skip-btn').addEventListener('click',useSkip);

// ─── INIT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  navigateTo('home');
  initSettings();
});
