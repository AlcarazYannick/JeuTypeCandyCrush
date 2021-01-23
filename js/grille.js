/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
class Grille {
  nbDeCookiesDifferents = 6;
  monScore = 0;
  tabCookies;
  tabCookiesCliquees = [];

  constructor(l, c) {
    this.nbLignes = l;
    this.nbColonnes = c;
    this.remplirTableauDeCookies(this.nbDeCookiesDifferents);
  }

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {

      

       let ligne = Math.floor(index / this.nbColonnes);
       let colonne = index % this.nbColonnes;

       //console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

       
      let img = this.tabCookies[ligne][colonne].htmlImage;

      img.onclick = (evt) => {   


        let imgCliquee = evt.target;
        let l = imgCliquee.dataset.ligne;
        let c = imgCliquee.dataset.colonne;
        let cookieCliquee = this.tabCookies[l][c];
        //console.log("coockieClique "+ cookieCliquee+ ", l"+ cookieCliquee.ligne + ", c"+ cookieCliquee.colonne);
        cookieCliquee.selectionnee();

        if(this.tabCookiesCliquees.length === 0){
          this.tabCookiesCliquees.push(cookieCliquee);
        }
        else if(this.tabCookiesCliquees.length === 1){

          this.tabCookiesCliquees.push(cookieCliquee);

          if(this.swapPossible()){
            console.log("swap");
            this.swapCookies();
          }
          else{
            console.log("SWAP PAS POSSIBLE");
          }

          this.tabCookiesCliquees[0].deselectionnee();
          this.tabCookiesCliquees[1].deselectionnee();
          this.tabCookiesCliquees = []

        } 
      };

      img.ondragstart = (evt) => { 
        console.log("dragstart"); 

        let imgDrag = evt.target;
        let l = imgDrag.dataset.ligne;
        let c = imgDrag.dataset.colonne;
        let cookieDragguee = this.tabCookies[l][c];

        this.tabCookiesCliquees = [];
        this.tabCookiesCliquees.push(cookieDragguee);
        cookieDragguee.selectionnee();
      }

      img.ondragover = (evt) => { 
        console.log("dragover"); 
        evt.preventDefault();
      }

      img.ondragenter = (evt) => { 
        console.log("dragenter"); 
      }

      img.ondragleave = (evt) => { 
        console.log("dragleave"); 
      }

      img.ondrop = (evt) => {
        console.log("ondrop");

        let imgDrop = evt.target;
        let l = imgDrop.dataset.ligne;
        let c = imgDrop.dataset.colonne;
        let cookieSurZoneDrop = this.tabCookies[l][c];

        this.tabCookiesCliquees.push(cookieSurZoneDrop);

        if(this.swapPossible()){
          console.log("swap");
          this.swapCookies();
        }
        else{
          console.log("SWAP PAS POSSIBLE");
        }

        this.tabCookiesCliquees[0].deselectionnee();
        this.tabCookiesCliquees[1].deselectionnee();
        this.tabCookiesCliquees = []
      }

      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.append(img);
    });
  }

  //Permet de savoir si un swap entre deux cookies est possible
  swapPossible(){
    let cookie1 = this.tabCookiesCliquees[0];
    let cookie2 = this.tabCookiesCliquees[1];

    /*
    let diffLignes = Math.abs(cookie1.ligne - cookie2.ligne);
    let diffColonnes = Math.abs(cookie1.colonne - cookie2.colonne);

    return (diffLignes === 1) || (diffColonnes === 1);
    */


    return (Cookie.distance(cookie1, cookie2) === 1);
  }

  //Réalisation du swap
  swapCookies(){
      let animationid;
        let cookie1 = this.tabCookiesCliquees[0];
        let cookie2 = this.tabCookiesCliquees[1];

        let tmpType = cookie1.type;
        let tmpImgSrc = cookie1.htmlImage.src;

        cookie1.type = cookie2.type;
        cookie1.htmlImage.src = cookie2.htmlImage.src;

        cookie2.type = tmpType;
        cookie2.htmlImage.src = tmpImgSrc;

        this.faireDisparaitreTousLesAlignements();
        this.chute();
        this.remplissage(this.nbDeCookiesDifferents);
        this.autoAlignementsCookies();

  }
  
  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    this.tabCookies = create2DArray(this.nbLignes);


    do{
      console.log("GRILLE AVEC ALIGNEMENT GENERE");
      for(let i=0; i<this.nbColonnes; i++){
        for(let j=0; j<this.nbLignes; j++){
          let type = Math.floor(Math.random()*(nbDeCookiesDifferents));
          this.tabCookies[i][j] = new Cookie(type, i, j);
          //console.log("cookie rempli à la colonne: "+j+", ligne: "+i+", et type: "+ type);
        }
      }
    }while(this.faireDisparaitreTousLesAlignements())

    console.log("GRILLE SANS ALIGNEMENT GENERE");
    
  }

  //Permet de rendre visible 3 (ou plus) cookies alignés en ligne et en colonne
  detecteTousLesAlignements(){
    for(let i=0; i<this.nbColonnes; i++){
      this.detecterMatch3Lignes(i);
    }
    
    for(let j=0; j<this.nbColonnes; j++){
      this.detecterMatch3Colonnes(j);
    }
  }

  //Permet de faire disparaitre 3 (ou plus) cookies alignés en ligne et en colonne
  faireDisparaitreTousLesAlignements(){
    this.nbAlignements = 0;
    for(let i=0; i<this.nbColonnes; i++){
      this.faireDisparaitreMatch3Lignes(i);
    }
    
    for(let j=0; j<this.nbColonnes; j++){
      this.faireDisparaitreMatch3Colonnes(j);
    }

    return(this.nbAlignements !== 0);
  }

  //Permet de rendre visible 3 (ou plus) cookies alignés en ligne
  detecterMatch3Lignes(i){

      for(let j=0; j<7; j++){
        if((this.tabCookies[i][j].type == this.tabCookies[i][j+1].type) && (this.tabCookies[i][j+1].type == this.tabCookies[i][j+2].type)){
          this.tabCookies[i][j].selectionnee();
          this.tabCookies[i][j].htmlImage.dataset.disparition = "false";
          this.tabCookies[i][j].htmlImage.classList.remove("invisible");

          this.tabCookies[i][j+1].selectionnee();
          this.tabCookies[i][j+1].htmlImage.dataset.disparition = "false";
          this.tabCookies[i][j+1].htmlImage.classList.remove("invisible");

          this.tabCookies[i][j+2].selectionnee();
          this.tabCookies[i][j+2].htmlImage.dataset.disparition = "false";
          this.tabCookies[i][j+2].htmlImage.classList.remove("invisible");
          
        }
      }
  }
  //Permet de rendre visible 3 (ou plus) cookies alignés en colonne
  detecterMatch3Colonnes(j){
      for(let i=0; i<7; i++){
        if((this.tabCookies[i][j].type == this.tabCookies[i+1][j].type) && (this.tabCookies[i+1][j].type == this.tabCookies[i+2][j].type)){
          this.tabCookies[i][j].selectionnee();
          this.tabCookies[i][j].htmlImage.dataset.disparition = "false";
          this.tabCookies[i][j].htmlImage.classList.remove("invisible");

          this.tabCookies[i+1][j].selectionnee();
          this.tabCookies[i+1][j].htmlImage.dataset.disparition = "false";
          this.tabCookies[i+1][j].htmlImage.classList.remove("invisible");

          this.tabCookies[i+2][j].selectionnee();
          this.tabCookies[i+2][j].htmlImage.dataset.disparition = "false";
          this.tabCookies[i+2][j].htmlImage.classList.remove("invisible");
        }
    }
  }

  //Permet de faire disparaitre 3 (ou plus) cookies alignés en ligne
  faireDisparaitreMatch3Lignes(i){
      for(let j=0; j<7; j++){
        if((this.tabCookies[i][j].type == this.tabCookies[i][j+1].type) && (this.tabCookies[i][j+1].type == this.tabCookies[i][j+2].type)){
          this.tabCookies[i][j].htmlImage.dataset.disparition = "true";
          this.tabCookies[i][j].htmlImage.classList.add("invisible");

          this.tabCookies[i][j+1].htmlImage.dataset.disparition = "true";
          this.tabCookies[i][j+1].htmlImage.classList.add("invisible");

          this.tabCookies[i][j+2].htmlImage.dataset.disparition = "true";
          this.tabCookies[i][j+2].htmlImage.classList.add("invisible");
          this.nbAlignements++;
        }
      }
  }

  //Permet de faire disparaitre 3 (ou plus) cookies alignés en colonne
  faireDisparaitreMatch3Colonnes(j){
      for(let i=0; i<7; i++){
        if((this.tabCookies[i][j].type == this.tabCookies[i+1][j].type) && (this.tabCookies[i+1][j].type == this.tabCookies[i+2][j].type)){
          this.tabCookies[i][j].htmlImage.dataset.disparition = "true";
          this.tabCookies[i][j].htmlImage.classList.add("invisible");

          this.tabCookies[i+1][j].htmlImage.dataset.disparition = "true";
          this.tabCookies[i+1][j].htmlImage.classList.add("invisible");

          this.tabCookies[i+2][j].htmlImage.dataset.disparition = "true";
          this.tabCookies[i+2][j].htmlImage.classList.add("invisible");
          this.nbAlignements++;
        }
      }
  }


  //Permet de gérer la chute
  chute(){
    
    for(let j=0; j<this.nbColonnes; j++){
      for(let i=this.nbLignes-1; i>-1; i--){

        if(this.tabCookies[i][j].htmlImage.dataset.disparition == "true"){

          if(i != 0){
            let cpt = 0;
            do{
              cpt++;
            }while((i-cpt>0) && this.tabCookies[i - cpt][j].htmlImage.dataset.disparition == "true")

            if(this.tabCookies[i - cpt][j].htmlImage.dataset.disparition == "false"){

              this.tabCookies[i][j].type = this.tabCookies[i - cpt][j].type;
              this.tabCookies[i][j].htmlImage.classList.remove("invisible");
              this.tabCookies[i][j].htmlImage.src = Cookie.urlsImagesNormales[this.tabCookies[i - cpt][j].type];
              this.tabCookies[i][j].htmlImage.dataset.disparition = "false";
              this.tabCookies[i][j].htmlImage.classList.remove("cookies-selected");

              this.tabCookies[i - cpt][j].htmlImage.dataset.disparition = "true";
              this.tabCookies[i - cpt][j].htmlImage.classList.add("invisible");
              
              console.log("Chute(s)");

            }
          } 
          
          //animationid = setInterval(A, 300);
          //clearInterval(animationid)
        }
      }
    }
  }

  //gestion du score :  augmente le score de 1 a chaque fois que la methode est appelé
  score(){
    this.monScore = this.monScore + 1;
    let nouveauScore = "Score :"+ this.monScore;
    document.querySelector("#score").textContent = nouveauScore;
  }

  //Permet de remplir l'ensembmle des cookies après une chute de cookies
  remplissage(nbDeCookiesDifferents) {

    for(let j=0; j<this.nbColonnes; j++){
      for(let i=this.nbLignes-1; i>-1; i--){
        if(this.tabCookies[i][j].htmlImage.dataset.disparition == "true"){

          this.tabCookies[i][j].type = Math.floor(Math.random()*(nbDeCookiesDifferents));
          this.tabCookies[i][j].htmlImage.classList.remove("invisible");
          this.tabCookies[i][j].htmlImage.src = Cookie.urlsImagesNormales[this.tabCookies[i][j].type];
          this.tabCookies[i][j].htmlImage.dataset.disparition = "false";
          this.tabCookies[i][j].htmlImage.classList.remove("cookies-selected");

          console.log("Remplissage(s)");
          this.score(); 
        
        }
      }
    }
  
  }

  /*Permet de faire disparaitre les cookies qui se sont formés indirectement 
    lors d'une chute et d'un remplissage de cookies,
    permet de gérer également la chute et le remplissage des cookies
   */
  autoAlignementsCookies(){
    do{
      this.faireDisparaitreTousLesAlignements();
      this.chute();
      this.remplissage(this.nbDeCookiesDifferents);
    }while(this.faireDisparaitreTousLesAlignements())
  }


}


