const PUZZLES = [
  {id:1,fen:'6k1/5ppp/8/8/8/8/8/4R2K w - - 0 1',solution:['e1e8'],difficulty:'easy',label:'1 harakatda mat'},
  {id:2,fen:'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5Q2/PPPP1PPP/RNB1K1NR w KQkq - 0 1',solution:['f3f7'],difficulty:'easy',label:'Scholars mat'},
  {id:3,fen:'4k3/8/4K3/8/8/8/8/7R w - - 0 1',solution:['h1h8'],difficulty:'easy',label:'1 harakatda mat'},
  {id:4,fen:'6k1/6pp/8/8/8/8/6PP/5RK1 w - - 0 1',solution:['f1f8'],difficulty:'easy',label:'Rook kuchi'},
  {id:5,fen:'k7/8/1K6/8/8/8/8/R7 w - - 0 1',solution:['a1a8'],difficulty:'easy',label:'1 harakatda mat'},
  {id:6,fen:'7k/6pp/8/8/8/8/8/R5K1 w - - 0 1',solution:['a1a8'],difficulty:'easy',label:'Tezkor mat'},
  {id:7,fen:'2r3k1/5ppp/p7/1p6/8/1P6/P4PPP/3R2K1 w - - 0 1',solution:['d1d8'],difficulty:'easy',label:'Rooklar almashish'},
  {id:8,fen:'r1bqkb1r/ppp2ppp/2np1n2/4p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1',solution:['f3g5','f6e4','g5f7'],difficulty:'medium',label:'Ot vilkasi'},
  {id:9,fen:'r3k2r/ppp2ppp/2n5/3qp3/3P4/2N2N2/PPP2PPP/R2QKB1R w KQkq - 0 1',solution:['d1d5','c6d4','f3d4'],difficulty:'medium',label:'Malika yutish'},
  {id:10,fen:'6k1/ppp2ppp/8/3n4/3N4/8/PPP2PPP/6K1 w - - 0 1',solution:['d4f5','g7g6','f5h6'],difficulty:'medium',label:'Ot kombinatsiyasi'},
  {id:11,fen:'r1b1kb1r/pppp1ppp/2n1pn2/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1',solution:['d4c6','d7c6','d1d8'],difficulty:'medium',label:'Malika maydonga kiradi'},
  {id:12,fen:'2r3k1/5ppp/p7/1p6/3B4/1P3P2/P4PPP/3R2K1 w - - 0 1',solution:['d4g7','g8g7','d1d8'],difficulty:'medium',label:'Fil qurbonligi'},
  {id:13,fen:'r4rk1/ppp2ppp/2n5/3p4/3P4/2N2N2/PPP2PPP/R3K2R w KQ - 0 1',solution:['f3e5','c6e5','d4e5'],difficulty:'medium',label:'Markaziy nazorat'},
  {id:14,fen:'r1b2rk1/ppp1qppp/2n5/3pp3/1b1PP3/2NB1N2/PPP2PPP/R1BQK2R w KQ - 0 1',solution:['d3h7','g8h7','f3g5','h7g8','d1h5'],difficulty:'hard',label:'Greko hujumi'},
  {id:15,fen:'2rr2k1/pp3ppp/2n5/3p4/3P4/2N1PN2/PP3PPP/2RR2K1 w - - 0 1',solution:['d1d5','c6d4','e3d4','d8d5','c1c8'],difficulty:'hard',label:'Murakkab taktika'},
  {id:16,fen:'r3r1k1/ppp2ppp/2n5/3p1b2/3P1B2/2N2N2/PPP2PPP/R3R1K1 w - - 0 1',solution:['f4d6','c6d4','f3d4','f5d3','e1e8'],difficulty:'hard',label:'Fil qurbonligi'},
  {id:17,fen:'r4rk1/pp1qbppp/2n1pn2/3p4/2PP4/2N1PN2/PPQ2PPP/R1B1K2R w KQ - 0 1',solution:['c4d5','e6d5','c3d5','f6d5','e3d5'],difficulty:'hard',label:'Ketma-ket almashinuvlar'},
  {id:18,fen:'1r4k1/p4ppp/2p5/8/8/2P3P1/P4P1P/1R4K1 w - - 0 1',solution:['b1b7','b8b7'],difficulty:'hard',label:'Endshpil texnikasi'},
  {id:19,fen:'3qk3/8/8/8/8/8/8/4K2R w K - 0 1',solution:['h1h8'],difficulty:'easy',label:'1 harakatda mat'},
  {id:20,fen:'5rk1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',solution:['d1d8','f8d8'],difficulty:'medium',label:'Rook almashinuvi'}
];

function getSortedPuzzles(){
  const order={easy:1,medium:2,hard:3};
  return[...PUZZLES].sort((a,b)=>order[a.difficulty]-order[b.difficulty]||a.id-b.id);
}
function getDifficultyLabel(d){
  const m={easy:{text:'Oson',cls:'easy'},medium:{text:"O'rta",cls:'medium'},hard:{text:'Qiyin',cls:'hard'}};
  return m[d]||m.easy;
}