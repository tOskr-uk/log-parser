// const str = "(1668370795)[Sun Nov 13 20:19:55 2022] YOUR Fiery Annihilation hits Chief Char'Nik for 1,063 heat damage.\r"
const str = "(1668370795)[Sun Nov 13 20:19:55 2022] YOU hit a Sandscrawler shamanite for 1,037 crushing damage.\r"




console.log(str.slice(str.indexOf('hit')+4,str.lastIndexOf('for')));

if(str.includes('YOU' && 'hit' && 'for')) console.log(1);
