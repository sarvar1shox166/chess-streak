// Tayyor zadachalar yo'q — faqat foydalanuvchi yaratganlari ishlatiladi
const PUZZLES = [];

function getSortedPuzzles(){
  const order={easy:1,medium:2,hard:3};
  // Faqat custom (foydalanuvchi yaratgan) zadachalar
  const custom=JSON.parse(localStorage.getItem('chess-streak-custom')||'[]');
  return[...custom].sort((a,b)=>order[a.difficulty]-order[b.difficulty]||a.id-b.id);
}
function getDifficultyLabel(d){
  const m={easy:{text:'Oson',cls:'easy'},medium:{text:"O'rta",cls:'medium'},hard:{text:'Qiyin',cls:'hard'}};
  return m[d]||m.easy;
}