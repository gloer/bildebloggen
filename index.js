// HTML-elementer
const inpBilde = document.querySelector("#inpBilde");
const inpTekst = document.querySelector("#inpTekst");
const skjema = document.querySelector("#skjema");
const overlay = document.querySelector("#overlay");

const main = document.querySelector("main");

// Firebase
const db = firebase.database();
const storage = firebase.storage();

const bloggen = db.ref("bloggen");


// Funksjon som lagrer bilde i databasen
function lagreBilde(evt) {
    evt.preventDefault();

    // Viser overlay
    overlay.style.display = "flex";

    // Bilde som skal lastes opp
    const bilde = inpBilde.files[0];

    // Hvor skal vi lagre bildet
    const lagringsplass = storage.ref("bloggbilder/" + ( +new Date() ) + bilde.name);

    // Vi laster opp bildet til storage
    lagringsplass.put(bilde)
        .then( bilde => bilde.ref.getDownloadURL() )
        .then( url => {
            bloggen.push({
                url: url,
                tekst: inpTekst.value
            });
            skjema.reset();
            overlay.style.display = "none";
        } );

}

function visBilde(snap) {
    const key = snap.key;
    const data = snap.val();

    main.innerHTML = `
        <article>
            <img src="${data.url}">
            <p>${data.tekst}</p>
        </article>
    ` + main.innerHTML;
}


// Event Listeners
skjema.addEventListener("submit", lagreBilde);
bloggen.on("child_added", visBilde);