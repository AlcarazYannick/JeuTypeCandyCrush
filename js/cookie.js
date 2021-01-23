class Cookie {
  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.htmlImage = document.createElement("img");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    this.htmlImage.height = 80;
    this.htmlImage.width = 80;
    this.htmlImage.dataset.ligne = ligne;
    this.htmlImage.dataset.colonne = colonne;

    //PERMET DE SAVOIR SI UN COOKIE EST VISIBLE OU PAS (utile pour la gestion de chute et de remplissage)
    this.htmlImage.dataset.invisible = "false";

    this.htmlImage.classList.add("cookies");
  }

  selectionnee() {
    this.htmlImage.classList.add("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
  }

  deselectionnee() {
    this.htmlImage.classList.remove("cookies-selected");
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
  }

  static swapCookies(c1, c2) {
    console.log("SWAP C1 C2");
    // On échange leurs images et types
  

    // et on remet les désélectionne
  }

  /** renvoie la distance entre deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    //console.log("Cookie 1: ligne"+ l1+ "colonne"+ c1 );
    //console.log("Cookie 2: ligne"+ l2+ "colonne"+ c2 );
    return distance;
  }
}
