const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);
const teamsListEl = $('#teamsList'), searchEl = $('#search');
const teamTitleEl = $('#teamTitle'), teamShortEl = $('#teamShort');
const optionsArea = $('#optionsArea'), contentInner = $('#contentInner');
const asgardSound = $('#asgardSound');
const simulatorContainer = $('#simulatorContainer');

let currentDefenseTeam = null;

function scrollToSection(id){
  const section = document.getElementById(id);
  if(section){
    window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
  }
}

document.querySelectorAll('.nav-item').forEach(item=>{
  // Only add scroll listener to divs, not anchor tags
  if (item.tagName.toLowerCase() === 'div') {
    item.addEventListener('click', ()=>{
      const target = item.getAttribute('data-target');
      scrollToSection(target);
    });
  }
});

const teamsData = [
  { id:"vigilantes", name:"Vigilantes", tags:["Habilidade", "Dano"], description:"Força de resposta urbana, tática e furtiva.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/6/6b/Punisher_Netflix.jpg/250px-Punisher_Netflix.jpg", members:["Sabre de Prata","Assasímio","Demolidor Moderno","Justiceiro","Elektra"], powerScore: 78, attackers:[{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0},{name:"Aniquiladores e Knul/Odin", attackerPower: 0, defenderPower: 0}], strategy: { text: "O time Vigilantes utiliza furtividade e dano massivo em um alvo único.", positioning: ["Elektra", "Justiceiro", "Sabre de Prata", "Assasímio", "Demolidor Moderno"], buffs: ["Furtividade (Inicial)", "Aumento de Dano (Sabre)"] }},
  { id:"clube do Inferno", name:"Clube do Inferno", tags:["Mutante", "Controle"], description:"Conclave esotérico e caos controlado.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/c/c1/Emma_Frost_%28Modern%29.webp.png/250px-Emma_Frost_%28Modern%29.webp.png", members:["Emma Frost","Madelyne Pryor","Azazel","Sebastian Shaw","Rachel Summer"], powerScore: 92, attackers:[{name:"Submundo e Kestrel", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Imortais e Gorr Treinador/Knul/Knul Ares/Quasar", attackerPower: 0, defenderPower: 0},{name:"Imortais e Vampira", attackerPower: 6099197, defenderPower: 5131408},{name:"Força V", attackerPower:9287728 , defenderPower:7881511 }], strategy: { text: "Esta é uma defesa de controle de combate (CC).", positioning: ["Rachel Summer", "Emma Frost", "Azazel", "Madelyne Pryor", "Sebastian Shaw"], buffs: ["Lentidão (Inicial - Rachel)", "Barreira (Sebastian Shaw)"] }},
  { id:"UCM", name:"UCM", tags:["Bio", "Tech", "Sinergia"], description:"Unidos pelo destino, imparáveis na batalha!", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fantastic_Four_logo_%28blue_and_white%29.svg/250px-Fantastic_Four_logo_%28blue_and_white%29.svg.png", members:["Tocha Humana","Mulher Invisivel","O coisa","Franklin Richards","Senhor Fantastico"], powerScore: 88, attackers:[{name:"Mercenarios Pagos e Scarlet Zumbi", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos e Quasar", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos Quasar e Ares", attackerPower: 0, defenderPower: 0},{name:"Ares Mef Apo Kang Quasar", attackerPower: 0, defenderPower: 0}]},
  { id:"Amaldiçoados", name:"Amaldiçoados", tags:["Místico", "Sustentação"], description:"Da sombras surgimos... e nelas deixamos nossos inimigos!", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/2/29/Bloodborne_capa.png/330px-Bloodborne_capa.png", members:["Juggernaut","Mordo","Capuz","Satana","hellverine"], powerScore: 95, attackers:[{name:"Submundo", attackerPower: 0, defenderPower: 0},{name:"Submundo daken(nobu)", attackerPower: 0, defenderPower: 0},{name:"Força A", attackerPower: 0, defenderPower: 0},{name:"Knowhere Quasar", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva e Knul", attackerPower: 0, defenderPower: 0},{name:"Cabal com Apo e kang", attackerPower: 0, defenderPower: 0},{name:"cabal com apo e mefisto", attackerPower: 0, defenderPower: 0},{name:"mercenarios pagos", attackerPower: 0, defenderPower: 0},{name:"fora do tempo", attackerPower: 0, defenderPower: 0},{name:"orquidea", attackerPower: 0, defenderPower: 0},{name:"imortais e ares", attackerPower: 0, defenderPower: 0},{name:"força v", attackerPower: 0, defenderPower: 0},{name:"poderosos vingadores", attackerPower: 0, defenderPower: 0},{name:"fabulosos vingadores", attackerPower: 0, defenderPower: 0},{name:"liberdade", attackerPower: 0, defenderPower: 0},{name:"perseguidores noturno", attackerPower: 0, defenderPower: 0},{name:"ucm", attackerPower: 0, defenderPower: 0},{name:"clube do inferno", attackerPower: 0, defenderPower: 0}], strategy: { text: "Defesa com foco em Dano com o HELLVERINE.", positioning: ["Satana", "hellverine", "Juggernaut", "Mordo", "Capuz"], buffs: ["Provocação (Juggernaut)", "Cura (Mordo)", "Regeneração (Hellverine)"] }},
  { id:"Amaldiçoados Blaastar", name:"Amaldiçoados Blaastar", tags:["Místico", "Sustentação"], description:"Condenados pela fúria, fortalecidos pela destruição.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/2/29/Bloodborne_capa.png/330px-Bloodborne_capa.png", members:["Juggernaut","Blaastar","Capuz","Satana","hellverine"], powerScore: 95, attackers:[{name:"Liberdade", attackerPower: 10510763, defenderPower: 5923481}] },

  { id:"Thunderbolts", name:"Thunderbolts", tags:["Habilidade", "Dano", "Controle"], description:"Os thunderbolts entram em cena - caos, força e rendenção em cada golpe!", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/a/a3/Thunderbolts_Vol_2_1.jpg/250px-Thunderbolts_Vol_2_1.jpg", members:["Hiperion","Treinador","Victoria Hand","Fantasma","Soprano"], powerScore: 82, attackers:[{name:"Iluminati e odin", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Imortais Ares", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 6266707, defenderPower: 7039770},{name:"Fabulosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Clube do Inferno", attackerPower: 0, defenderPower: 0},]},
  { id:"Liberdade", name:"Liberdade", tags:["Habilidade", "Tech"], description:"Lutamos por Justiça, vencemos pela união.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Captain_America_Shield.svg/250px-Captain_America_Shield.svg.png", members:["Peggy Carter","Patriota","Falcão Joaquin","Capitão America Sam","Maquina de Combate"], powerScore: 75, attackers:[{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Sociedade Aranha", name:"Sociedade Aranha", tags:["Bio", "Esquiva"], description:"Conectados pela teia, imparáveis na batalha.", image:"https://upload.wikimedia.org/wikipedia/pt/5/52/Mulher-Aranha_%28Gwen_Stacy%29_em_Aranhaverso_2.png", members:["Peter B. Parker","Pavitr","Peni Parker","Aranha Fantasma","Noir"], powerScore: 80, attackers:[{name:"Arma-x23", attackerPower: 0, defenderPower: 0},{name:"Gama Apo", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva skrul", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva e Knul", attackerPower: 0, defenderPower: 0},{name:"Def sec APO", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Fora do tempo", attackerPower: 0, defenderPower: 0},{name:"Aniquiladores e mefisto", attackerPower: 0, defenderPower: 0},{name:"imortais Venom/wheave/negativo", attackerPower: 0, defenderPower: 0},{name:"Imortais Doom/Dormu", attackerPower: 0, defenderPower: 0},{name:"Astral", attackerPower: 0, defenderPower: 0},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"Clube do inferno", attackerPower: 0, defenderPower: 0}]},
  { id:"Iluminati", name:"Iluminati", tags:["Tech", "Controle", "Sinergia"], description:"O poder do conhecimento molda o destino do universo.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/9/91/New_Avengers_Vol_3_31.jpg/250px-New_Avengers_Vol_3_31.jpg", members:["Hank Pym","Raio Negro","Pantera Shuri","Senhor Fantastico","Capitão Britania"], powerScore: 90, attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Iluminati Quasar", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra/macabro(mysterio)", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Fora do tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais wheave/dormu/quasar", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 10034666, defenderPower: 4970150}]},
  { id:"Aniquiladores", name:"Aniquiladores", tags:["Cósmico", "Dano"], description:"Onde chegamos nada sobrevive.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos Ultimato","Gorr","Gladiador","Ultimus","Surfista Prateado"], powerScore: 98, attackers:[{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Eternos Apo Kestrel Nick", attackerPower: 0, defenderPower: 0},{name:"Arma x Ares", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Def sec Apo/Odin", attackerPower: 0, defenderPower: 0},{name:"Iluminati ou com Apo", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra", attackerPower: 0, defenderPower: 0},{name:"Xtremo odin", attackerPower: 0, defenderPower: 0},{name:"cabal e kang emma/Apo Quasar", attackerPower: 0, defenderPower: 0},{name:"Mercenarios pagos", attackerPower: 0, defenderPower: 0},{name:"Fora do tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais Ares/Dormu/Quasar", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 0, defenderPower: 0},{name:"Perseguidores noturno", attackerPower: 0, defenderPower: 0},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Clube do inferno Odin", attackerPower: 0, defenderPower: 0}]},
  { id:"Mente Coletiva", name:"Mente Coletiva", tags:["Bio", "Sustentação", "Sinergia"], description:"Uma só consciência, mil formas de vencer.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Venom_cosplay_madrid.jpg/250px-Venom_cosplay_madrid.jpg", members:["Duende Vermelho","Cavaleiro do Vazio","Carnificina","Gwenon","Venom"], powerScore: 85, attackers:[{name:"Submundo", attackerPower: 0, defenderPower: 0},{name:"Força A", attackerPower: 0, defenderPower: 0},{name:"Arma-x23", attackerPower: 0, defenderPower: 0},{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva e Skrul", attackerPower: 0, defenderPower: 0},{name:"knowhere", attackerPower: 0, defenderPower: 0},{name:"Def sec Quik/wheave", attackerPower: 0, defenderPower: 0},{name:"iluminati", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Fora do tempo", attackerPower: 0, defenderPower: 0},{name:"Perseguidores noturno", attackerPower: 0, defenderPower: 0}]},
  { id:"Bifrost", name:"Bifrost", tags:["Místico", "Cósmico"], description:"Abrindo portais, trazendo a fúria dos Deuses!", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Ring17.jpg/250px-Ring17.jpg", members:["Vahl","Loki","Bill Raio","Loki Teen","Sylvie"], attackers:[{name:"Submundo", attackerPower: 0, defenderPower: 0},{name:"Eternos e doom dormu/wheave emma 2099", attackerPower: 0, defenderPower: 0},{name:"Darkhold Quik", attackerPower: 0, defenderPower: 0},{name:"Força A", attackerPower: 0, defenderPower: 0},{name:"Arma-x23 quik/doom", attackerPower: 0, defenderPower: 0},{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Semente da Morte", attackerPower: 0, defenderPower: 0},{name:"Mente coletiva", attackerPower: 0, defenderPower: 0},{name:"Def sec e quik/quasar", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra", attackerPower: 0, defenderPower: 0},{name:"Cabal doom kang", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu", attackerPower: 0, defenderPower: 0},{name:"Amaldiçoados", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa", name:"Tropa Alfa", tags:["Mutante", "Sinergia"], description:"Justiça cósmica na velocidade da luz", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Wolverine","Solaris"], attackers:[{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos ", attackerPower: 0, defenderPower: 0},{name:"Fora do tempo com e sem cav/quasar", attackerPower: 0, defenderPower: 0},{name:"Imortais Quasar", attackerPower: 0, defenderPower: 0},{name:"UCM3", attackerPower: 0, defenderPower: 0},{name:"Guerreiros Secreto", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa Mefisto Blaastar", name:"Tropa Alfa Mefisto Blaastar", tags:["Mutante", "Sinergia"], description:"Pode estelar,fúria e maldição em guerra pelo cosmos", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Mefisto","Blaastar"], attackers:[{name:"Liberdade", attackerPower: 11235193, defenderPower: 5345314}]},

  { id:"X-tremo", name:"X-tremo", tags:["Mutante", "Dano"], description:"Poder sem limites, ação sem medo.", image:"https://upload.wikimedia.org/wikipedia/pt/a/ac/Gambit.jpg", members:["Gambit","Noturno","Ciclope","Mancha Solar","Forge"], powerScore: 78, attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Def sec Apo", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra", attackerPower: 0, defenderPower: 0},{name:"Sociedade aranha", attackerPower: 0, defenderPower: 0},{name:"Mercenarios pagos", attackerPower: 0, defenderPower: 0},{name:"Imortais Knul", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Perseguidores noturno", attackerPower: 0, defenderPower: 0}]},
  { id:"Orquidea", name:"Orquidea", tags:["Tech", "Anti-Mutante"], description:"Beleza letal, florescendo em meio ao caos.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nim-logo.png/330px-Nim-logo.png", members:["Nimrod","Sentinela Omega","Lady letal","Sentienela","Cientista Suprema"], powerScore: 92, attackers:[{name:"Mente coletiva e Skrul", attackerPower: 0, defenderPower: 0},{name:"Def sec Apo", attackerPower: 0, defenderPower: 0},{name:"Iluminati e com skrul/odin", attackerPower: 0, defenderPower: 0},{name:"Cabal Ares Apo", attackerPower: 0, defenderPower: 0},{name:"Mercenarios pagos", attackerPower: 0, defenderPower: 0},{name:"Mercenarios pagos Apo", attackerPower: 5382706, defenderPower: 7691375},{name:"Fora do tempo Quasar", attackerPower: 0, defenderPower: 0},{name:"Imortais venom/mancha/emma/vampira/vahl", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu/Quasar/Odin", attackerPower: 0, defenderPower: 0},{name:"Força V e com odin", attackerPower: 0, defenderPower: 0},{name:"Astral", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 0, defenderPower: 0},{name:"Perseguidores noturno", attackerPower: 0, defenderPower: 0},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Clube do inferno", attackerPower: 0, defenderPower: 0}]},
  { id:"Pegasus", name:"Pegasus", tags:["Tech", "Sinergia"], description:"Voamos alto, lutamos com honra celestial.", image:"https://upload.wikimedia.org/wikipedia/wikipedia/pt/thumb/1/19/Iron_Man_3_poster.jpg/250px-Iron_Man_3_poster.jpg", members:["Kestrel","Homem de ferro Guerra Infinita","Resgate","Coração de Ferro","Falcão de Aço"], powerScore: 84, attackers:[{name:"Eternos wheave emma 2099", attackerPower: 0, defenderPower: 0},{name:"Força A", attackerPower: 0, defenderPower: 0},{name:"Arma-x23", attackerPower: 0, defenderPower: 0},{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"War dogs", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Def sec e wheave", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Imortais wheave", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0}]},
  { id:"X-men Imortais", name:"X-men imortais", tags:["Mutante", "Sustentação"], description:"Mutantes eternos, a esperança nunca morre!.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/e/ea/All_new_x-men.jpeg/250px-All_new_x-men.jpeg", members:["Jean gray","Tempestade","Fera","Polaris","Cable"], powerScore: 87, attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores odin", attackerPower: 0, defenderPower: 0},{name:"Sexteto de guerra", attackerPower: 0, defenderPower: 0},{name:"Cabal kang Apo", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Orquidea", attackerPower: 6375600, defenderPower: 6668381},{name:"Imortais kang/ares/knul", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Astral sem serpente lua", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Força Fênix odin wheave 2099", attackerPower: 0, defenderPower: 0},{name:"Piratas Sideral Apo", attackerPower: 0, defenderPower: 0},{name:"Perseguidores noturno", attackerPower: 0, defenderPower: 0},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"Clube Inferno ou com skrul(rachel)", attackerPower: 0, defenderPower: 0},{name:"Insiduosos Vulture Lagarto", attackerPower: 0, defenderPower: 0}]},
  { id:"Astral", name:"Astral", tags:["Místico", "Controle"], description:"Além do corpo, acima da mente, dominamos o universo.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Doutor Destino","Serpente da Lua","Emma Frost x","shadowking","Anciã"], attackers:[{name:"Cabal Kang Apo", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago e Apo/Odin", attackerPower: 0, defenderPower: 0},{name:"Imortais Apo/Quasar/Odin/Tempestade Emma Frost", attackerPower: 0, defenderPower: 0},{name:"Ares Quasar Apo Odin Emma Frost", attackerPower: 0, defenderPower: 0}]},
  { id:"Astral Motoqueiro Cosmico", name:"Astral Motoqueiro Cosmico", tags:["Místico", "Controle"], description:"Espírito vingador cruzando as estrelas com fogo eterno.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Doutor Destino","Motoqueiro Cosmico","Emma Frost x","shadowking","Anciã"], attackers:[{name:"Liberdade", attackerPower: 10461189, defenderPower: 6419967},{name:"Quasar Apo Blaastar Gata Ares", attackerPower: 7296860, defenderPower: 6273485}]},

  { id:"Perseguidores Noturno", name:"Perseguidores Noturno", tags:["Místico", "Sustentação"], description:"Caçamos nas Sombras, vencemos no silêncio.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mercury%2C_Venus_and_the_Moon_Align.jpg/250px-Mercury%2C_Venus_and_the_Moon_Align.jpg", members:["Blade","Profana","Homem Coisa","Cavaleiro Lua","Agatha Harkeness"], attackers:[{name:"Arma-x23", attackerPower: 0, defenderPower: 0},{name:"Mente Coletiva", attackerPower: 0, defenderPower: 0},{name:"Iluminati Odin", attackerPower: 0, defenderPower: 0},{name:"Cabal Apo Dormu", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais wheave/vampira/ares/omega/odin/knul/blaastar dormu", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 0, defenderPower: 0},{name:"UCM Mefisto", attackerPower: 0, defenderPower: 0},{name:"Clube do inferno Mefisto", attackerPower: 0, defenderPower: 0}]},
  { id:"Sexteto Superior", name:"Sexteto Superior", tags:["Bio", "Tech", "Dano"], description:"Seis mentes, um caos sem limites.", image:"https://upload.wikimedia.org/wikipedia/pt/b/bc/Dr._Octopus_Marvel.jpg", members:["Lagarto","Esmaga-Aranha","Kraven","Duende Verde Classico","Doutor Octopus"], powerScore: 78, attackers:[{name:"Iluminati Skrul", attackerPower: 0, defenderPower: 0},{name:"X-tremo", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Imortais Vahl", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0}]},
  { id:"Jovens Vingadores", name:"Jovens Vingadores", tags:["Bio", "Habilidade"], description:"Coragem Nova, legado eterno.", image:"https://upload.wikimedia.org/wikipedia/pt/b/b1/Garota_Esquilo.jpg", members:["","Garota Esquilo","America Chavez","Eco","Ms. Marvel"], attackers:[{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Imortais Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Invasores", name:"Invasores", tags:["Habilidade", "Sinergia"], description:"Atacamos primeiro, vencemos sempre.", image:"https://upload.wikimedia.org/wikipedia/pt/d/d2/Us_agent.jpg", members:["Nicky Fury","Capitão America 2GM","Union Jack","Bucky Barnes","Punfo de Ferro 2GM"], attackers:[{name:"Ordem Negra", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores", attackerPower: 0, defenderPower: 0}]},
  { id:"Defensores Secreto", name:"Defensores Secreto", tags:["Místico", "Dano"], description:"Protegemos nas sombras, Vencemos na luz.", image:"https://protocolosx3.wordpress.com/wp-content/uploads/2025/03/defensoressecretos-drestranho-falcaonoturno-juliacarpenter-nomade.jpg", members:["Motoqueiro Fantasma Robbie","Gata Negra","Foton","Doutor Estranho","Ms. Marvel Luz Dura"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Novos Vingadores", name:"Novos Vingadores", tags:["Habilidade", "Sinergia"], description:"Novos heróis, mesma determinação de salvar o mundo.", image:"https://seriesemcena.com.br/wp-content/uploads/2019/01/Dw_9XoLVYAEvC23.jpg", members:["Agente Coulson","Tigresa","Ronin","O Coisa","Harpia"], attackers:[{name:"Cabal Apo Ultimus", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais Vahl/Apo", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 4722034, defenderPower: 4648646}]},
  { id:"Gama", name:"Gama", tags:["Bio", "Dano"], description:"Pura fúria irradiada, impossível de deter.", image:"https://upload.wikimedia.org/wikipedia/pt/a/aa/Hulk_%28circa_2019%29.png", members:["Hulk","Hulk Vermelho","Abominavel","She-Hulk","Brawn"], attackers:[{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0}]},
  { id:"Infestação", name:"Infestação", tags:["Bio", "Debuff"], description:"Quanto mais tentam nos deter, mais nos multiplicamos.", image:"https://preview.redd.it/37ighsq9jr031.jpg?auto=webp&s=5b336efab8ddb4a717cf1cf0479e143720c50252", members:["Big Time","Enxame","Viuva Negra","Homem Formiga","Jaqueta Amarela"], attackers:[{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Imortais Wheave/Ares", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno Ares", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Insiduosos Shocker Lagarto", attackerPower: 6487899, defenderPower: 9177350}]},
  { id:"Herois de Aluguel", name:"Herois de aluguel", tags:["Habilidade", "Defesa"], description:"Lutamos por contrato,vencemos por honra.", image:"https://upload.wikimedia.org/wikipedia/pt/3/39/Luke_Cage_%28Terra-616%29.jpg", members:["Luke Cage","Shang-Shi","Misty knight","Coleen wing","Punfo de Ferro"], attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0}]},
  { id:"Arma-x23", name:"Arma-x23", tags:["Habilidade", "Dano"], description:"Criados para matar, lutando para sobreviver!.", image:"https://upload.wikimedia.org/wikipedia/pt/5/5d/Wolverine_%28James_%27Logan%27_Howlett%29.png", members:["Lady Letal","Omega Vermelho","Dentes de sabre","x-23","Samurai de prata"], powerScore: 70, attackers:[{name:"Força A", attackerPower: 0, defenderPower: 0},{name:"Gama", attackerPower: 0, defenderPower: 0}]},
  { id:"Poderosos Vingadores", name:"Poderosos Vingadores", tags:["Sinergia"], description:"Força em cada golpe, glória em cada vitória.", image:"https://www.boletimnerd.com.br/wp-content/uploads/2025/05/os-novos-vingadores-conheca-a-equipe-de-herois.jpg", members:["Falcão","Hercules","Vision","Feiticeira escarlate","Mulher Invisivel"], attackers:[{name:"Arma-x23", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Fabulosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno", attackerPower: 0, defenderPower: 0}]},
  { id:"Submundo", name:"Submundo", tags:["Habilidade", "Controle"], description:"Nas sombras da cidade, nós fazemos as regras.", image:"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjzjKanLoo8KLnoSewf917P369wvNrQ6l7IK2dolNMCS-xAou_UN59BGsgmy3-Bi-izEdF6I_dHznsSBR8kCuvX05AUTodVn6O4L_4x4J7tS6yNFowMobLJOEk8aD8SPKKC4pNjvtgwwJTQ/s1600/Marvel+diversity.jpg", members:["Kingpin","Nobu","Senhor Negativo","Duende Verde","Treinador"], attackers:[{name:"Knowhere", attackerPower: 0, defenderPower: 0}]},
  { id:"Ordem Negra", name:"Ordem Negra", tags:["Cósmico", "Dano", "Sinergia"], description:"Servimos Thanos, trazemos o fim.", image:"https://upload.wikimedia.org/wikipedia/commons/9/94/Ster_en_Grootkruisvan_de_Orde_van_de_Zwarte_Ster.jpg", members:["Thanos","Midnight","Corvus Glaive","Ebony Maw","Cull Obsidian"], attackers:[{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Def Sec Apo", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores", attackerPower: 0, defenderPower: 0}]},
  { id:"Cabala Dormu Kang", name:"Cabal Dormu Kang", tags:["Místico", "Controle"], description:"O tempo e o caos curvam-se diante do nosso poder.", image:"https://upload.wikimedia.org/wikipedia/pt/7/78/Kang-Young_Avengers.jpg", members:["Namor","Patriota de Ferro","Lider","Dormammu","Kang"], attackers:[{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0}]},
  { id:"Piratas Sideral", name:"Piratas Sideral", tags:["Cósmico", "Dano"], description:"Saqueando estrelas, conquistando galáxias.", image:"https://static.wikia.nocookie.net/xmen-comics/images/a/a4/Hellions_Vol_1_4_Textless.jpg/revision/latest/smart/width/250/height/250?cb=20200619011935&path-prefix=pt-br", members:["Lilandra","Rocket Raccon","Groot","Havok","Howard o Pato"], attackers:[{name:"Mente Coletiva Mefisto/Knul", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Cabala Apo Skrul", attackerPower: 0, defenderPower: 0},{name:"Orquidea", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu/Quasar", attackerPower: 0, defenderPower: 0},{name:"Força V ou com Odin", attackerPower: 0, defenderPower: 0},{name:"Astral Quasar(SK)", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno", attackerPower: 0, defenderPower: 0},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"Amaldiçoados Quasar", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Clube do Inferno", attackerPower: 0, defenderPower: 0},{name:"Guerreiros Secreto", attackerPower: 0, defenderPower: 0},{name:"Insiduosos Schoker Ares", attackerPower: 0, defenderPower: 0}]},
  { id:"Piratas Sideral Prof X", name:"Piratas Sideral Prof X", tags:["Cósmico", "Dano"], description:"Mentes brilhantes navegando pelas estrelas do caos.", image:"https://static.wikia.nocookie.net/xmen-comics/images/a/a4/Hellions_Vol_1_4_Textless.jpg/revision/latest/smart/width/250/height/250?cb=20200619011935&path-prefix=pt-br", members:["Lilandra","Rocket Raccon","Groot","Havok","Professor X"], attackers:[{name:"Liberdade Mefisto", attackerPower: 11517398, defenderPower: 7553095},]},
  { id:"Fora do Tempo", name:"Fora do Tempo", tags:["Cósmico", "Místico", "Habilidade"], description:"Ninguem escapa do que já foi e do que ainda será.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/GPB_circling_earth.jpg/250px-GPB_circling_earth.jpg", members:["Cavaleiro Negro","Motoqueiro Fantama Cosmico","Capitão America","Estigma","Capitã Carter"], attackers:[{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Thanos e Gladiador", attackerPower: 0, defenderPower: 0},{name:"Imortais Quasar", attackerPower: 0, defenderPower: 0},{name:"Força V3", attackerPower: 0, defenderPower: 0},{name:"Imortais Vahl", attackerPower: 3135405, defenderPower: 3602010}]},
  { id:"Fora do Tempo Dormammu", name:"Fora do Tempo Dormammu", tags:["Cósmico", "Místico", "Habilidade"], description:"O quando o tempo cessa, só as trevas reinam.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/GPB_circling_earth.jpg/250px-GPB_circling_earth.jpg", members:["Cavaleiro Negro","Motoqueiro Fantama Cosmico","Capitão America","Dormammu","Capitã Carter"], attackers:[{name:"Mercenarios Pago", attackerPower: 4402883, defenderPower: 4601589}]},
  { id:"Fora do Tempo Skrul", name:"Fora do Tempo skrul", tags:["Cósmico", "Místico", "Habilidade"], description:"Mudamos o passado,moldamos o futuro,dominamos o agora.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/GPB_circling_earth.jpg/250px-GPB_circling_earth.jpg", members:["Cavaleiro Negro","Motoqueiro Fantama Cosmico","Capitão America","Skrul","Capitã Carter"], attackers:[{name:"Mercenarios Pago", attackerPower: 3907517, defenderPower: 4357421}]},

  { id:"Força V", name:"Força V", tags:["Sinergia", "Bio"], description:"Cinco heróis, uma força imparável!.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_the_Brazilian_Air_Force.svg/250px-Coat_of_arms_of_the_Brazilian_Air_Force.svg.png", members:["Kahhori","Medusa","Ms. Marvel Classica","Vespa","Coração de Ferro"], attackers:[{name:"Cabala Odin Mefisto", attackerPower: 0, defenderPower: 0}]},
  { id:"Knowhere", name:"Knowhere", tags:["Cósmico", "Sinergia"], description:"No vazio do cosmos, somos tudo e nada.", image:"https://upload.wikimedia.org/wikipedia/pt/0/0e/Rocket_Raccoon.jpg", members:["Nova","Korg","Cosmo","Thor","Star lord Aniquilação"], attackers:[{name:"Imortais Vespa", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0}]},
  { id:"UCM Prof X", name:"UCM Prof X", tags:["Sinergia", "Controle"], description:"Mente, poder e ciêcia unidos pelo destino do universo.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fantastic_Four_logo_%28blue_and_white%29.svg/250px-Fantastic_Four_logo_%28blue_and_white%29.svg.png", members:["Franklin Richards","Senhor Fantastico UCM","Mulher Invisivel UCM","Tocha Humana","Professor X"], attackers:[{name:"UCM Prof X", attackerPower: 0, defenderPower: 0}]},
  { id:"UCM Prof X Odin", name:"UCM Prof X Odin", tags:["Sinergia", "Controle", "Cósmico"], description:"Quando mente, ciência e divindade se unem, o impossivel se curva.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fantastic_Four_logo_%28blue_and_white%29.svg/250px-Fantastic_Four_logo_%28blue_and_white%29.svg.png", members:["Franklin Richards","Senhor Fantastico UCM","Mulher Invisivel UCM","Professor X","Odin"], attackers:[{name:"Prof X Quasar Odin Apo Ares", attackerPower: 0, defenderPower: 0}]},
  { id:"UCM Prof X Knul", name:"UCM Prof X Knul", tags:["Sinergia", "Controle", "Cósmico"], description:"Luz, mente e trevas em um só propósito: dominar o cosmos.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fantastic_Four_logo_%28blue_and_white%29.svg/250px-Fantastic_Four_logo_%28blue_and_white%29.svg.png", members:["Franklin Richards","Senhor Fantastico UCM","Mulher Invisivel UCM","Professor X","Knul"], attackers:[{name:"UCM Prof X Emma", attackerPower: 0, defenderPower: 0}]},
  { id:"Sociedade Aranha Wheave", name:"Sociedade Aranha Wheave", tags:["Bio", "Esquiva"], description:"Unidos pela teia, imparáveis na batalha.", image:"https://upload.wikimedia.org/wikipedia/pt/5/52/Mulher-Aranha_%28Gwen_Stacy%29_em_Aranhaverso_2.png", members:["Spider Wheave","Noir","Pavitr","","Peni Parker"], attackers:[{name:"Mente Coletiva Skrul/Knul", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago ou com Apo", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu/Quasar", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Poderosos Vingadores", attackerPower: 6304231, defenderPower: 4766476}]},
  { id:"Aniquiladores Ares", name:"Aniquiladores Ares", tags:["Cósmico", "Dano"], description:"Força divina e destruição implacável em um só golpe.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos","Gladiador","Ares","Gorr","Ultimus"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Cabala Skrul Emma", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Imortais Ares", attackerPower: 0, defenderPower: 0},{name:"Astral Mefisto", attackerPower: 0, defenderPower: 0}]},
  { id:"Mente Coletiva Knul", name:"Mente Coletiva Knul", tags:["Bio", "Sustentação", "Cósmico"], description:"Uma Consciência sombria, espalhando caos pelo universo.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Venom_cosplay_madrid.jpg/250px-Venom_cosplay_madrid.jpg", members:["Knul","Cavaleiro do Vazio","Duende vermelho","Gwenon","Carnage"], attackers:[{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu/Apo/Knul/Odin", attackerPower: 0, defenderPower: 0},{name:"Força V3 Skrul", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0}]},
  { id:"Mente Coletiva Knul Gorr", name:"Mente Coletiva Knul Gorr", tags:["Bio", "Sustentação", "Cósmico"], description:"A escuridão pensa, os Deuses caem, o universo silencia.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Venom_cosplay_madrid.jpg/250px-Venom_cosplay_madrid.jpg", members:["Cavaleiro do vazio","Duende Vermelho","Gwenon","Knul","Gorr"], attackers:[{name:"Iluminati Skrul", attackerPower: 0, defenderPower: 0},{name:"Iluminati Odin", attackerPower: 5521639, defenderPower: 5018702},{name:"Imortais Odin/Quasar", attackerPower: 0, defenderPower: 0},{name:"Mente Coletiva Quasar", attackerPower: 0, defenderPower: 0},{name:"Vigilantes", attackerPower: 10887122, defenderPower: 5856834},{name:"Apo Noturno Hank Prof Logan", attackerPower: 5728420, defenderPower: 5797718}]},
  { id:"Astral Knul Cav Negro", name:"Astral Knul Cav Negro", tags:["Místico", "Controle", "Cósmico"], description:"Das sombras do cosmos nasce o poder absoluto.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Anciã","Shadowking","Emma Frost X","Knul","Cavalheiro Negro"], attackers:[{name:"UCM Quasar", attackerPower: 0, defenderPower: 0}]},
  { id:"UCM Odin", name:"UCM Odin", tags:["Sinergia", "Cósmico"], description:"Ciência, poder e divindade unidos para proteger os nove reinos.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Fantastic_Four_logo_%28blue_and_white%29.svg/250px-Fantastic_Four_logo_%28blue_and_white%29.svg.png", members:["Franklin Richards","Mulher Invisivel UCM","Senhor Fantastico UCM","Tocha Humana","Odin"], attackers:[{name:"UCM Quasar Emma", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa Ares", name:"Tropa Alfa Ares", tags:["Mutante", "Dano"], description:"A fúria dos Deuses com o poder das estrelas.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Solaris","Ares"], attackers:[{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 9798722, defenderPower: 6615239},{name:"Thunderbolts", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa Ares Chavez", name:"Tropa Alfa Ares Chavez", tags:["Mutante", "Dano"], description:"Força,guerra e poder multiversal unidos por um mesmo propósito.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","America Chavez","Ares"], attackers:[{name:"Fora do Tempo", attackerPower: 4858903, defenderPower: 5387699}]},
  { id:"Tropa Alfa Skrul", name:"Tropa Alfa Skrul", tags:["Mutante", "Controle"], description:"Quando a Força estelar encontra a astúcia das sombras.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Solaris","Skrul"], attackers:[{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Imortais Ares/Doom/Mefisto/Knul/Quasar", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa Força Fênix", name:"Tropa Alfa Força Fênix", tags:["Mutante", "Controle"], description:"Renascidos em chamas, unidos pela fúria e pela esperança.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Omega","Fênix"], attackers:[{name:"Poderosos Vingadores", attackerPower: 5629253, defenderPower: 5458544}]},

  { id:"X-tremo Vampira", name:"X-tremo Vampira", tags:["Mutante", "Dano", "Sustentação"], description:"Poder roubado, força sem limites.", image:"https://upload.wikimedia.org/wikipedia/pt/a/ac/Gambit.jpg", members:["Noturno","Gambit","Forge","Mancha Solar","Vampira"], attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Def Sec Apo ou Def Sec Omega Knul", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Cabala Kang Apo", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Liberdade", attackerPower: 6212607, defenderPower: 4344239},{name:"UCM", attackerPower: 0, defenderPower: 0}]},
  { id:"Sociedade Aranha Quasar", name:"Sociedade Aranha Quasar", tags:["Bio", "Esquiva", "Cósmico"], description:"Teias e energia cósmica unidas contra qualquer ameaça.", image:"https://upload.wikimedia.org/wikipedia/pt/5/52/Mulher-Aranha_%28Gwen_Stacy%29_em_Aranhaverso_2.png", members:["Quasar","Noir","Pavitr","","Peni Parker"], attackers:[{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0}]},
  { id:"Aniquiladores Odin", name:"Aniquiladores Odin", tags:["Cósmico", "Dano"], description:"Força imortal e fúria divina em cada golpe.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos","Gladiador","Odin","Gorr","Ultimus"], attackers:[{name:"Astral Mefisto", attackerPower: 0, defenderPower: 0},{name:"Odin Quasar Blaastar Omega Prof X", attackerPower: 0, defenderPower: 0}]},
  { id:"Aniquiladores Skrul Ares", name:"Aniquiladores Skrul Ares", tags:["Cósmico", "Dano"], description:"Conquista,força e guerra movendo o imperio das estrelas.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos","Gladiador","Skrul","Gorr","Ares"], attackers:[{name:"Vigilantes", attackerPower: 10853249, defenderPower: 6248347}]},

  { id:"Aniquiladores Odin Mot Cos", name:"Aniquiladores Odin Mot Cos", tags:["Cósmico", "Dano"], description:"Divindade, destruição e velocidade imparável pelo universo.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos","Gladiador","Odin","Gorr","Motoqueiro Cosmico"], attackers:[{name:"Força V Mefisto", attackerPower: 0, defenderPower: 0},{name:"Prof X Ares Noturno Cable Polaris", attackerPower: 0, defenderPower: 0}]},
  { id:"Orquidea Dormu", name:"Orquidea Dormu", tags:["Tech", "Anti-Mutante", "Místico"], description:"Beleza letal e poder das trevas em perfeita harmonia.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nim-logo.png/330px-Nim-logo.png", members:["Nimrod","Lady Letal","Sentinela","Sentinela Omega","Dormu"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo Area", attackerPower: 0, defenderPower: 0},{name:"Imortais Wheave/Ares", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno ou com Apo", attackerPower: 0, defenderPower: 0}]},
  { id:"Orquidea Mefisto", name:"Orquidea Mefisto", tags:["Tech", "Anti-Mutante", "Místico"], description:"Charme mortal, maldade eterna.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nim-logo.png/330px-Nim-logo.png", members:["Nimrod","Lady Letal","Sentinela","Sentinela Omega","Mefisto"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Cabala Apo Knul", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago Odin", attackerPower: 0, defenderPower: 0},{name:"Aniquiladores Odin/Skrul Knul/Mefisto Knul", attackerPower: 0, defenderPower: 0},{name:"Astral Quasar", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Orquidea Skrul", name:"Orquidea Skrul", tags:["Tech", "Anti-Mutante", "Místico"], description:"Beleza disfarçada, letalidade oculta entre as estrelas.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nim-logo.png/330px-Nim-logo.png", members:["Nimrod","Lady Letal","Sentinela","Sentinela Omega","Skrul"], attackers:[{name:"Perseguidores Noturno Kestrel", attackerPower: 7700818, defenderPower: 8181853}]},

  { id:"Astral Mefisto", name:"Astral Mefisto", tags:["Místico", "Controle"], description:"Poder cósmico e maldade infernal unidos.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Anciã","Shadowking","Emma Frost X","Mefisto","Doutor Destino"], attackers:[{name:"Cabala Apo Knul", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago Quasar", attackerPower: 0, defenderPower: 0},{name:"Imortais Quasar/Knul", attackerPower: 0, defenderPower: 0},{name:"Astral Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Astral Odin", name:"Astral Odin", tags:["Místico", "Controle", "Cósmico"], description:"Sabedoria celestial e poder cósmico guiando os Deuses e as estrelas.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Anciã","Shadowking","Emma Frost X","Odin","Doutor Destino"], attackers:[{name:"Força Fenix Mefisto Tempestade Noturno", attackerPower: 0, defenderPower: 0}]},
  { id:"Astral Skrul", name:"Astral Skrul", tags:["Místico", "Controle", "Cósmico"], description:"Mentes que viajam entre estrelas e formas,dominando o cosmos em silêncio.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/4/4f/Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg/250px-Doctor_Strange_Vol_4_2_Ross_Variant_Textless.jpg", members:["Anciã","Shadowking","Emma Frost X","Skrul","Doutor Destino"], attackers:[{name:"Força V Blaastar Dormu", attackerPower: 7803599, defenderPower: 7686491}]},

  { id:"Perseguidores Noturno Odin", name:"Perseguidores Noturno Odin", tags:["Místico", "Sustentação", "Cósmico"], description:"Caçadores das sombras abençoados pelo poder dos Deuses.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mercury%2C_Venus_and_the_Moon_Align.jpg/250px-Mercury%2C_Venus_and_the_Moon_Align.jpg", members:["Blade","Profana","Odin","Homem Coisa","Agatha Harkness"], attackers:[{name:"Imortais e Knul", attackerPower: 0, defenderPower: 0},{name:"Força V Odin", attackerPower: 0, defenderPower: 0}]},
  { id:"Piratas Sideral Odin", name:"Piratas Sideral Odin", tags:["Cósmico", "Dano"], description:"Saqueando estrelas com a fúria dos Deuses.", image:"https://static.wikia.nocookie.net/xmen-comics/images/a/a4/Hellions_Vol_1_4_Textless.jpg/revision/latest/smart/width/250/height/250?cb=20200619011935&path-prefix=pt-br", members:["Hoaward o pato","lilandra","havok","Groot","Odin"], attackers:[{name:"Força V", attackerPower: 0, defenderPower: 0}]},
  { id:"Perseguidores Noturno Mefisto", name:"Perseguidores Noturno Mefisto", tags:["Místico", "Sustentação"], description:"Das trevas viemos, com o inferno ao nosso lado.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mercury%2C_Venus_and_the_Moon_Align.jpg/250px-Mercury%2C_Venus_and_the_Moon_Align.jpg", members:["Blade","Profana","Mefisto","Homem Coisa","Agatha Harkness"], attackers:[{name:"Cabala Apo Knul", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago Knul", attackerPower: 0, defenderPower: 0},{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Aniquiladores Knul/Knul Skrul", attackerPower: 0, defenderPower: 0},{name:"Imortais Quasar", attackerPower: 0, defenderPower: 0},{name:"Força fenix Odin Quasar Knul", attackerPower: 0, defenderPower: 0},{name:"UCM OU UCM Odin", attackerPower: 0, defenderPower: 0},{name:"Odin Quasar Ares Wheave 2099", attackerPower: 0, defenderPower: 0}]},

  { id:"Infestação Escorpião", name:"Infestação Escorpião", tags:["Bio", "Debuff"], description:"Veneno letal, e caos multiplicado em cada ataque.", image:"https://preview.redd.it/37ighsq9jr031.jpg?auto=webp&s=5b336efab8ddb4a717cf1cf0479e143720c50252", members:["Big Time","Escorpião","Viuva Negra","Homem Formiga","Jaqueta Amarela"], attackers:[{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 6086981, defenderPower: 7133405},{name:"Sexteto de Sinistro", attackerPower: 4403163, defenderPower: 3638680},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais Quasar/Blaastar Dormu", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Insiduosos Shocker Lagarto/Shocker Duende Classico", attackerPower: 0, defenderPower: 0}]},
  { id:"Força Fênix Mutantes", name:"Força Fênix Mutantes", tags:["Mutante", "Dano", "Controle"], description:"Renascendo das cinzas, poder ilimitado em nossas maõs.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Nuremberg_chronicles_-_Phoenix_%28CIIIIv%29.jpg/250px-Nuremberg_chronicles_-_Phoenix_%28CIIIIv%29.jpg", members:["Fênix","Omega","Mutantes"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Novos Vingadores", attackerPower: 0, defenderPower: 0},{name:"Sexteto de Guerra", attackerPower: 0, defenderPower: 0},{name:"Sociedade Aranha Skrul", attackerPower: 0, defenderPower: 0},{name:"Mercenarios Pago", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo", attackerPower: 0, defenderPower: 0},{name:"Imortais Treinador Gorr", attackerPower: 0, defenderPower: 0},{name:"Iluminati", attackerPower: 0, defenderPower: 0},{name:"Orquidea", attackerPower: 0, defenderPower: 0},{name:"Força V", attackerPower: 0, defenderPower: 0},{name:"Perseguidores Noturno", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0}]},
  { id:"Força V Prof X Dormammu", name:"Força V Prof X Dormammu", tags:["Sinergia", "Cósmico"], description:"A mente e o caos unidos para reescrever a realidade.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_the_Brazilian_Air_Force.svg/250px-Coat_of_arms_of_the_Brazilian_Air_Force.svg.png", members:["Kahhori","Medusa","Ms. Marvel Classica","Professor X","Dormammu"], attackers:[{name:"Liberdade Mefisto", attackerPower: 10985127, defenderPower: 7678736}]},

  { id:"Força V Odin Mot Cos", name:"Força V Odin Mot Cos", tags:["Sinergia", "Cósmico"], description:"Justiça divina guiada pelo fogo das estrelas.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_the_Brazilian_Air_Force.svg/250px-Coat_of_arms_of_the_Brazilian_Air_Force.svg.png", members:["Kahhori","Medusa","Ms. Marvel Classica","Odin","Motoqueiro Cosmico"], attackers:[{name:"Força V Mefisto Emma", attackerPower: 0, defenderPower: 0}]},
  { id:"Força V Odin Mefisto", name:"Força V Odin Mefisto", tags:["Sinergia", "Cósmico", "Místico"], description:"Entre o divino e o inferno, o poder absoluto desperta.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_the_Brazilian_Air_Force.svg/250px-Coat_of_arms_of_the_Brazilian_Air_Force.svg.png", members:["Kahhori","Medusa","Ms. Marvel Classica","Odin","Mefisto"], attackers:[{name:"Força V Odin Prof X", attackerPower: 0, defenderPower: 0}]},
  { id:"Força V Odin Skrul", name:"Força V Odin Skrul", tags:["Sinergia", "Cósmico", "Controle"], description:"Deuses e metamorfos unidos pela conquista cósmica.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Coat_of_arms_of_the_Brazilian_Air_Force.svg/250px-Coat_of_arms_of_the_Brazilian_Air_Force.svg.png", members:["Kahhori","Medusa","Ms. Marvel Classica","Odin","Skrul"], attackers:[{name:"UCM Knul Gorr", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0},{name:"Quasar Tocha Gladiador Coisa Apo", attackerPower: 7876759, defenderPower: 7154180}]},
  { id:"Sociedade Aranha Mefisto", name:"Sociedade Aranha Mefisto", tags:["Bio", "Esquiva", "Místico"], description:"Teias do inferno tecidas com almas e destruição.", image:"https://upload.wikimedia.org/wikipedia/pt/5/52/Mulher-Aranha_%28Gwen_Stacy%29_em_Aranhaverso_2.png", members:["Mefisto","Noir","Pavitr","","Peni Parker"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Iluminati Mefisto", name:"Iluminati Mefisto", tags:["Tech", "Controle", "Místico"], description:"Conhecimento proibido e poder infernal moldando o destino.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/9/91/New_Avengers_Vol_3_31.jpg/250px-New_Avengers_Vol_3_31.jpg", members:["Hank Pym","Raio Negro","Pantera Shuri","Senhor Fantastico","Capitão Britania"], attackers:[{name:"Astral Knul sem Sk", attackerPower: 0, defenderPower: 0}]},
  { id:"Aniquiladores Mefisto", name:"Aniquiladores Mefisto", tags:["Cósmico", "Dano", "Místico"], description:"A destruição ganhou uma alma... e ela veio do inferno.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/0/03/Thanos_por_Jim_Starlin.png/330px-Thanos_por_Jim_Starlin.png", members:["Thanos","Gladiador","Mefisto","Gorr","Ultimus"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0},{name:"Fora do Tempo Knul", attackerPower: 0, defenderPower: 0},{name:"UCM", attackerPower: 0, defenderPower: 0}]},
  { id:"Sexteto de Guerra", name:"Sexteto de Guerra", tags:["Bio", "Tech"], description:"Cinco Forças, um só propósito: conquistar pelo caos.", image:"https://upload.wikimedia.org/wikipedia/pt/b/bc/Dr._Octopus_Marvel.jpg", members:["Doctor Octopus","Vulture","Mysterio","Duende Classico","Kraven"], attackers:[{name:"Imortais Odin", attackerPower: 0, defenderPower: 0},{name:"Insiduosos Gladiador Big Time", attackerPower: 0, defenderPower: 0}]},
  { id:"Mente Coletiva Skrul", name:"Mente Coletiva Skrul", tags:["Bio", "Sustentação", "Controle"], description:"Uma consciêcia, mil rostos, um império invisivel.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Venom_cosplay_madrid.jpg/250px-Venom_cosplay_madrid.jpg", members:["Skrul","Cavaleiro do Vazio","Carnage","Duende Vermelho","Gwenon"], attackers:[{name:"Mercenarios Pagos", attackerPower: 0, defenderPower: 0},{name:"Imortais Dormu", attackerPower: 0, defenderPower: 0},{name:"Força V Skrul", attackerPower: 0, defenderPower: 0}]},
  { id:"Bifrost Dormu", name:"Bifrost Dormu", tags:["Místico", "Cósmico"], description:"A ponte entre reinos agora leva direto ao inferno.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Ring17.jpg/250px-Ring17.jpg", members:["Vahl","Dormammu","Bill Raio","Loki Teen","Sylvie"], attackers:[{name:"Gama", attackerPower: 0, defenderPower: 0},{name:"Knowhere", attackerPower: 0, defenderPower: 0},{name:"Def Sec Eternos", attackerPower: 0, defenderPower: 0},{name:"Imortais Vahl", attackerPower: 0, defenderPower: 0}]},
  { id:"Tropa Alfa Skrul Mefisto", name:"Tropa Alfa Skrul Mefisto", tags:["Mutante", "Controle", "Místico"], description:"Mutação, disfarce e inferno unidos sob uma mesma bandeira.", image:"https://upload.wikimedia.org/wikipedia/pt/thumb/3/31/TrpAlfa.jpg/250px-TrpAlfa.jpg", members:["Estrela Polar","Sasquatch","Guardião","Skrul","Mefisto"], attackers:[{name:"Força V Odin Quasar", attackerPower: 0, defenderPower: 0}]},
  { id:"X-tremo Mefisto", name:"X-tremo Mefisto", tags:["Mutante", "Dano", "Místico"], description:"Poder sem limites, forjado nas chamas do inferno.", image:"https://upload.wikimedia.org/wikipedia/pt/a/ac/Gambit.jpg", members:["Noturno","Gambit","Forge","Mancha Solar","Mefisto"], attackers:[{name:"Mente Coletiva Knul", attackerPower: 0, defenderPower: 0}]},
  { id:"Perseguidores Noturno Mefisto Ares", name:"Perseguidores Noturno Mefisto Ares", tags:["Místico", "Sustentação", "Dano"], description:"Das trevas e da guerra nasce o verdadeiro terror.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Mercury%2C_Venus_and_the_Moon_Align.jpg/250px-Mercury%2C_Venus_and_the_Moon_Align.jpg", members:["Blade","Profana","Homem Coisa","Mefisto","Ares"], attackers:[{name:"Skrul Apo Odin Quasar Agatha", attackerPower: 0, defenderPower: 0}]},
];

function renderTeams(list){
  teamsListEl.innerHTML='';
  list.forEach(t=>{
    const li=document.createElement('li');
    li.className='team-card';
    li.dataset.id=t.id;
    const power = t.powerScore || Math.floor(Math.random()*30+70);
    const powerColor = getColorForPower(power);
    li.innerHTML=`<img src="${t.image}" alt="${t.name}">
                  <div class="team-info">
                    <strong>${t.name}</strong>
                    <small>${t.members.join(' • ')}</small>
                  </div>
                  <div class="team-power" style="background-color:${powerColor}; color:#071022;">
                    ⚡${power}%
                  </div>`;
    li.onclick=()=>selectTeam(t.id);
    teamsListEl.appendChild(li);
  });
}

function selectTeam(id){
  asgardSound.currentTime=0; asgardSound.play();
  $$('.team-card').forEach(c=>c.classList.remove('active'));
  const card=document.querySelector(`[data-id="${id}"]`);
  if(card) card.classList.add('active');
  const team=teamsData.find(x=>x.id===id);
  if(!team) return;

  currentDefenseTeam = team;
  teamTitleEl.textContent=team.name;
  teamShortEl.textContent=team.description;

  optionsArea.innerHTML='';
  const opts=['Ataques','Visão Geral','Estratégia','Notas'];
  opts.forEach((o,i)=>{
    const b=document.createElement('button');
    b.className='options-btn'; b.textContent=o;
    if(o === 'Ataques')b.classList.add('active');
    b.addEventListener('click',()=>{
      $$('.options-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      if(o==='Visão Geral') showOverview(team);
      if(o==='Ataques') showAttackers(team);
      if(o==='Estratégia') showStrategy(team);
      if(o==='Notas') showNotes(team);
    });
    optionsArea.appendChild(b);
  });

  showAttackers(team);
  renderSimulator();
}

function getColorForPower(power) {
    const p = parseInt(power);
    if (p >= 66) return '#2ecc71';
    if (p >= 45) return '#ffd166';
    return '#f75555';
}

function showOverview(team){
  const teamCard = document.querySelector(`[data-id="${team.id}"]`);
  let power = '??';
  if (teamCard) {
    const powerEl = teamCard.querySelector('.team-power');
    if (powerEl) {
      power = powerEl.textContent.replace('⚡', '').replace('%', '');
    }
  }

  contentInner.innerHTML=`
    <h3>${team.name} — Visão Geral</h3>
    <div class="overview-grid">
        <div class="stat-card-improved">
            <div class="stat-icon">⚡</div>
            <div class="stat-content">
                <strong>Força Estimada</strong>
                <span class="stat-value power-rating" style="--power-color:${getColorForPower(parseInt(power))}">${power}%</span>
            </div>
        </div>
        <div class="stat-card-improved">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
                <strong>Nº de Integrantes</strong>
                <span class="stat-value">${team.members.length}</span>
            </div>
        </div>
        <div class="stat-card-improved wide-card">
            <div class="stat-icon">🎯</div>
            <div class="stat-content">
                <strong>Descrição Tática</strong>
                <span class="strategy-text">${team.description}</span>
            </div>
        </div>
    </div>

    <h4 style="margin-top: 20px; color: var(--accent-2);">Tags do Time:</h4>
    <div class="tags-grid">
      ${team.tags.map(t => `<div class="tag-chip">${t}</div>`).join('')}
    </div>

    <h4 style="margin-top: 20px; color: var(--accent-2);">Integrantes Principais:</h4>
    <div class="members-grid">
      ${team.members.map(m=>`<div class="member-chip">${m}</div>`).join('')}
    </div>
  `;
}


function showStrategy(team){
    const strategy = team.strategy;
    let content = `<h3>${team.name} — Estratégia Defensiva</h3>`;
    if (!strategy || !strategy.text) {
        content += `<p style="color:var(--muted); margin-top:15px;">A estratégia detalhada para este time ainda não foi definida.</p>`;
    } else {
        content += `<p style="margin-top:15px; font-size:15px; line-height:1.5;">${strategy.text}</p>`;
        if (strategy.positioning && strategy.positioning.length === 5) {
            content += `<h4 style="margin-top: 20px; color: var(--accent-2);">Posicionamento Recomendado:</h4>`;
            content += `<small style="color:var(--muted); display:block; text-align:center;">(Da Esquerda para a Direita)</small>`;
            content += `<div class="position-grid">`;
            strategy.positioning.forEach((member, index) => {
                content += `<div class="pos-slot">P${index + 1}<small>${member}</small></div>`;
            });
            content += `</div>`;
        }
        if (strategy.buffs && strategy.buffs.length > 0) {
            content += `<h4 style="margin-top: 20px; color: var(--accent-2);">Buffs/Mecânicas Chave:</h4>`;
            content += `<div class="members-grid">`;
            strategy.buffs.forEach(buff => {
                content += `<div class="member-chip" style="background:rgba(255,209,102,0.1); border-color:var(--accent-2); color:var(--accent-2);">${buff}</div>`;
            });
            content += `</div>`;
        }
    }
    contentInner.innerHTML = content;
}

function showAttackers(team){
  const atk = team.attackers || [];
  if (atk.length === 0) {
      contentInner.innerHTML=`<h3>${team.name} — Ataques</h3><p class="hint" style="margin-top:15px;">Nenhum counter registrado para este time ainda.</p>`;
      return;
  }
  
  const bars = atk.map(a => {
    let percentContent = '';
    
    if (a.attackerPower > 0 && a.defenderPower > 0) {
        const ratio = (a.attackerPower / a.defenderPower);
        const percentageDiff = (ratio - 1) * 100;
        const color = ratio >= 0.9 ? '#2ecc71' : '#ffd166';
        const sign = percentageDiff >= 0 ? '+' : '';
        percentContent = `<div class="percent" style="background:${color};color:#071022">${sign}${percentageDiff.toFixed(0)}%</div>`;
    } else {
        percentContent = `<div class="percent" style="background:var(--muted);color:#071022">N/A</div>`;
    }
    
    return `<li class="attack-item">
                <div class="attacker-name">${a.name}</div>
                ${percentContent}
            </li>`;
  }).join('');

  contentInner.innerHTML=`<h3>${team.name} — Counters Conhecidos</h3><ul class="attack-list">${bars}</ul><p class="hint" style="margin-top:15px;">Use o simulador para calcular a força necessária para estes confrontos.</p>`;
}

function showNotes(team){
  const key='notes_'+team.id;
  const saved=localStorage.getItem(key)||'';

  contentInner.innerHTML=`
    <div class="notes-container">
      <h4 class="notes-header">📝 Notas Pessoais sobre ${team.name}</h4>
      <textarea id="noteBox" class="note-box" placeholder="Escreva suas observações, estratégias de counter, ou pontos fracos do time...">${saved}</textarea>
      <div class="notes-toolbar">
        <span id="noteStatus" class="note-status">Pronto para editar.</span>
        <div class="note-actions">
          <button id="clearNote" class="note-clear-btn">Limpar</button>
          <button id="saveNote" class="note-save">💾 Salvar Notas</button>
        </div>
      </div>
    </div>
  `;

  const noteBox = $('#noteBox');
  const saveBtn = $('#saveNote');
  const clearBtn = $('#clearNote');
  const statusEl = $('#noteStatus');
  let saveTimeout;

  saveBtn.onclick = () => {
    if (saveBtn.classList.contains('is-saving')) return;

    saveBtn.classList.add('is-saving');
    saveBtn.textContent = 'Salvando...';
    statusEl.textContent = 'Salvando suas anotações...';
    clearTimeout(saveTimeout);

    setTimeout(() => {
      localStorage.setItem(key, noteBox.value);

      saveBtn.classList.remove('is-saving');
      saveBtn.classList.add('is-saved');
      saveBtn.textContent = '✅ Salvo!';
      statusEl.style.color = '#2ecc71';
      statusEl.textContent = `Salvo em ${new Date().toLocaleTimeString()}.`;

      setTimeout(() => {
        saveBtn.classList.remove('is-saved');
        saveBtn.textContent = '💾 Salvar Notas';
      }, 2000);

    }, 500);
  }

  clearBtn.onclick = () => {
    if (confirm(`Tem certeza que deseja apagar todas as notas de ${team.name}?`)) {
      noteBox.value = '';
      localStorage.removeItem(key);
      statusEl.textContent = 'Notas apagadas.';
      statusEl.style.color = '#f75555';
      setTimeout(() => {
          statusEl.textContent = 'Pronto para editar.';
          statusEl.style.color = 'var(--muted)';
      }, 2000);
    }
  }

  noteBox.addEventListener('input', () => {
    statusEl.textContent = 'Digitando...';
    statusEl.style.color = 'var(--muted)';
    saveBtn.classList.remove('is-saved');
    saveBtn.textContent = '💾 Salvar Notas';

    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
      saveBtn.click();
    }, 2000);
  });
}

function renderSimulator() {
  if (!currentDefenseTeam) {
    simulatorContainer.innerHTML = '<p id="simStatus">⚠️ Selecione um **Time de Defesa** para começar.</p>';
    return;
  }

  const availableAttackers = teamsData.filter(t => t.id !== currentDefenseTeam.id);
  const teamOptions = availableAttackers.map(t => `<option value="${t.id}">${t.name}</option>`).join('');

  simulatorContainer.innerHTML = `
    <h3>Análise de Força vs ${currentDefenseTeam.name}</h3>
    <div class="sim-controls">
      <strong>Time Atacante de Referência:</strong>
      <select id="attackerSelect">
        ${teamOptions}
      </select>
      
      <strong style="margin-top:10px; display:block;">Poder do Time Defensor (que você vai atacar):</strong>
      <input type="number" id="defenderPowerInput" placeholder="Ex: 1200000" />
      
      <strong style="margin-top:10px; display:block;">Poder do SEU Time Atacante:</strong>
      <input type="number" id="yourAttackerPowerInput" placeholder="Ex: 1100000" />

      <button id="runSimBtn">📊 Analisar Força</button>
    </div>

    <div id="simResultArea" class="sim-result" style="display:none;">
      <h4>Resultado da Análise</h4>
      <div id="battleBreakdown" class="battle-breakdown"></div>
    </div>
  `;

  $('#runSimBtn').onclick = runSimulation;
}

function runSimulation() {
  const resultArea = $('#simResultArea');
  const breakdownEl = $('#battleBreakdown');
  
  if (!currentDefenseTeam) return;

  const selectedAttackerId = $('#attackerSelect').value;
  const attacker = teamsData.find(t => t.id === selectedAttackerId);
  const defenderPower = parseInt($('#defenderPowerInput').value);
  const yourAttackerPower = parseInt($('#yourAttackerPowerInput').value);

  if (!defenderPower || !yourAttackerPower || defenderPower <= 0 || yourAttackerPower <= 0) {
    resultArea.style.display = 'block';
    resultArea.className = 'sim-result';
    breakdownEl.innerHTML = `⚠️ Por favor, insira valores de poder válidos para o atacante e o defensor.`;
    return;
  }

  const knownAttack = currentDefenseTeam.attackers && currentDefenseTeam.attackers.find(atk => atk.name === attacker.name);

  resultArea.style.display = 'block';

  if (knownAttack && knownAttack.defenderPower > 0 && knownAttack.attackerPower > 0) {
    const baseRatio = knownAttack.attackerPower / knownAttack.defenderPower;
    const requiredPower = defenderPower * baseRatio;
    const powerDifferencePct = ((yourAttackerPower / requiredPower) - 1) * 100;
    
    let resultText = '';
    let adviceText = '';
    
    if (powerDifferencePct >= 5) {
      resultArea.className = 'sim-result is-good';
      resultText = `Você está <strong class="good">${powerDifferencePct.toFixed(0)}% ACIMA</strong> da força recomendada.`;
      adviceText = `Alta probabilidade de vitória.`;
    } else if (powerDifferencePct < -5) {
      resultArea.className = 'sim-result is-bad';
      resultText = `Você está <strong class="bad">${Math.abs(powerDifferencePct).toFixed(0)}% ABAIXO</strong> da força recomendada.`;
      adviceText = `Batalha muito arriscada. Considere fortalecer seu time.`;
    } else {
      resultArea.className = 'sim-result';
      resultText = `Sua força é <strong>COMPATÍVEL</strong> com a mínima recomendada.`;
      adviceText = `A batalha será equilibrada. O resultado dependerá da estratégia (RNG).`;
    }

    breakdownEl.innerHTML = `
      Com base na vitória de referência (<span style="color:var(--accent-2);">${(knownAttack.attackerPower/1000).toFixed(0)}k</span> vs ${(knownAttack.defenderPower/1000).toFixed(0)}k), o poder mínimo recomendado para seu atacante seria de <strong>~${(requiredPower/1000).toFixed(0)}k</strong>.
      <hr style="border-color:rgba(255,255,255,0.1); margin:10px 0;">
      ${resultText}<br>
      <small>${adviceText}</small>
    `;
    
  } else {
    resultArea.className = 'sim-result';
    breakdownEl.innerHTML = `
      <strong class="bad">Confronto Não Listado.</strong><br>
      Não há dados de referência para ${attacker.name} atacando ${currentDefenseTeam.name}.<br>
      É necessário adicionar os dados de poder de uma batalha de referência na aba "Ataques" para este confronto.
    `;
  }
}


searchEl.addEventListener('input', e => {
  const v = e.target.value.trim().toLowerCase();
  const filtered = teamsData.filter(t => t.name.toLowerCase().includes(v) || t.members.join(' ').toLowerCase().includes(v));
  renderTeams(filtered.length ? filtered : teamsData);
});

if (teamsData.length > 0) {
    renderTeams(teamsData);
    selectTeam(teamsData[0].id);
}

/* ===== LÓGICA DO FORMULÁRIO DE CONTATO (MANTIDO IDÊNTICO) ===== */
(function(){
  const form = document.getElementById('contactForm');
  const clearBtn = document.getElementById('contactClear');
  const feedback = document.getElementById('contactFeedback');
  if(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      feedback.style.display = 'block';
      feedback.style.color = 'var(--muted)';
      feedback.textContent = 'Enviando mensagem...';
      setTimeout(()=>{
        feedback.style.color = '#2ecc71';
        feedback.textContent = '✅ Mensagem enviada com sucesso! Responderei em breve.';
        form.reset();
        setTimeout(()=>{ feedback.style.display='none'; }, 4500);
      },700);
    });
  }
  if(clearBtn){
    clearBtn.addEventListener('click', ()=>{ form.reset(); });
  }
})();

/* ===== LÓGICA DO CARROSSEL META (MANTIDO IDÊNTICO) ===== */
(function() {
    const carousel = document.getElementById('metaCarousel');
    const prevBtn = document.getElementById('metaPrevBtn');
    const nextBtn = document.getElementById('metaNextBtn');
    if (!carousel) return;
    let isDown = false, startX, scrollLeft;
    carousel.addEventListener('mousedown', (e) => { isDown = true; startX = e.pageX - carousel.offsetLeft; scrollLeft = carousel.scrollLeft; });
    carousel.addEventListener('mouseleave', () => { isDown = false; });
    carousel.addEventListener('mouseup', () => { isDown = false; });
    carousel.addEventListener('mousemove', (e) => { if (!isDown) return; e.preventDefault(); const x = e.pageX - carousel.offsetLeft; const walk = (x - startX) * 2; carousel.scrollLeft = scrollLeft - walk; });
    const scrollAmount = () => { const slide = carousel.querySelector('.carousel-slide'); return slide ? slide.offsetWidth + 15 : 300; };
    prevBtn.addEventListener('click', () => { carousel.scrollLeft -= scrollAmount(); });
    nextBtn.addEventListener('click', () => { carousel.scrollLeft += scrollAmount(); });
    const updateButtons = () => { if (!carousel.offsetParent) return; const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth; prevBtn.disabled = carousel.scrollLeft <= 0; nextBtn.disabled = carousel.scrollLeft >= maxScrollLeft - 1; };
    carousel.addEventListener('scroll', updateButtons);
    new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { updateButtons(); } }).observe(carousel);
})();