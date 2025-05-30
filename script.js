let dashboard = document.getElementById("dash")
let ajouter1 = document.getElementById("ajouter1")
let ajouter2 = document.getElementById("ajouter2")
let c_division = document.getElementById("c-division")

let cards_mere = document.getElementById("cards-mere")
let cards_mere_sec = document.getElementById("cards-mere-sec")
let cards_fils = document.getElementById("cards-fils")
let cards_fils_Sec = document.getElementById("cards-fils-sec")
let cards_dets_sec = document.getElementById("cards-dets-sec")
let modifierComp = document.getElementById("modifierComp")

let nomComp
let typeComp
let descComp
let t_appr
let t_bloc

let currentComp = null
let currentBloc = null

let comps = []
let stored = localStorage.getItem('comps')
if (stored) { comps = JSON.parse(stored) }
afficher()

ajouter1.style.display = 'none'
ajouter2.style.display = 'none'
c_division.style.display = 'none'
cards_fils_Sec.style.display = 'none'
cards_dets_sec.style.display = 'none'
modifierComp.style.display = 'none'

function add() {
    dashboard.style.display = 'none'
    ajouter1.style.display = 'block'
    ajouter2.style.display = 'none'
    c_division.style.display = 'none'
}

function next1() {
    ajouter1.style.display = 'none'
    ajouter2.style.display = 'block'
    c_division.style.display = 'none'

    nomComp = document.getElementById("nomDeCompetence")
    typeComp = document.getElementById("typeDeCompetence")
    descComp = document.getElementById("descDeCompetence")
}
let nbrBlock = 0
function next2() {
    ajouter1.style.display = 'none'
    ajouter2.style.display = 'none'
    c_division.style.display = 'block'

    t_appr = document.getElementById("t-apprentissage")
    t_bloc = document.getElementById("t-bloc")

    nbrBlock = Math.ceil(Number(t_appr.value) / Number(t_bloc.value))

    let blocks = document.getElementById("blocks")

    text = ''
    let hours_total = Number(t_appr.value)
    let hours_per_bloc = Number(t_bloc.value)
    let bloc_time
    for (let i = 0; i < nbrBlock; i++) {
        if (hours_total > hours_per_bloc) {
            hours_total -= hours_per_bloc
            bloc_time = hours_per_bloc
        }
        else {
            bloc_time = hours_total
        }

        const totalSeconds = Math.floor(bloc_time * 3600);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        text += `
            <div class="bloc" id="bloc${i}">
                <h4 class="text-center">Bloc ${i + 1} (${h}h ${m}min ${s}s)</h4>
                <input type="text" class="c-title" name="title" placeholder="Titre" class="w-100">
                <input type="text" class="c-desc" name="desc" placeholder="Description" class="w-100">
                <input type="text" class="c-timeDone" name="timeDone" hidden value='0'>
                <input type="text" class="c-timeTotal" name="timeTotal" hidden value='${bloc_time}'>
            </div>
        `
    }
    blocks.innerHTML = text
}

function fini() {
    ajouter1.style.display = 'none'
    ajouter2.style.display = 'none'
    c_division.style.display = 'none'
    dashboard.style.display = 'block'

    let titles = document.querySelectorAll('.c-title')
    let descs = document.querySelectorAll('.c-desc')
    let timeDone = document.querySelectorAll('.c-timeDone')
    let timeTotal = document.querySelectorAll('.c-timeTotal')

    let a_blocks = []
    for (let i = 0; i < titles.length; i++) {
        let obj = {
            titre: titles[i].value,
            description: descs[i].value,
            timeDone: timeDone[i].value,
            timeTotal: timeTotal[i].value,
            status: "en cours"
        }
        a_blocks.push(obj)
    }

    let obj = {
        nomDeComp: nomComp.value,
        typeDeComp: typeComp.value,
        descDeComp: descComp.value,
        tempsDApprentissage: t_appr.value,
        tempsPerBloc: t_bloc.value,
        blocksDApprentissage: a_blocks,
        status: "en cours"
    }

    comps.push(obj)
    console.log(comps);

    nomComp.value = ''
    typeComp.value = ''
    descComp.value = ''
    t_appr.value = ''
    t_bloc.value = ''

    addToLocalStorage()
    afficher()
}



function afficher(filter = 'tout') {
    cards_mere.innerHTML = ""
    text = ''
    let img

    let filteredComps = comps

    if(filter == 'en cours'){
        filteredComps = comps.filter(comp => comp.status == 'en cours')
    }
    else if(filter == 'fini'){
        filteredComps = comps.filter(comp => comp.status == 'fini')
    }

    for (let i = 0; i < filteredComps.length; i++) {
        let totalHours = 0
        let totalHoursDone = 0
        for (let x = 0; x < filteredComps[i].blocksDApprentissage.length; x++) {
            totalHours += Number(filteredComps[i].blocksDApprentissage[x].timeTotal)
            totalHoursDone += Number(filteredComps[i].blocksDApprentissage[x].timeDone)
        }

        let totalProgressPercentage = (totalHoursDone / totalHours) * 100

        if (filteredComps[i].typeDeComp == "competenceGenerale") {
            img = '<img src="./writing.jpg" class="card-img-top">'
        }
        else {
            img = '<img src="./reading.jpg" class="card-img-top">'
        }

        let cs
        if (filteredComps[i].status == 'en cours') { cs = `<p class="compStatus">en cours</p>` }
        else { cs = `<p class="compStatus bg-success">fini</p>` }
        text += `
            <div class="card col-3 width24" onclick="showFils(${i})">
                ${img}
                <div class="card-body">
                    <h5 class="card-title">${filteredComps[i].nomDeComp + "(" + totalHours.toFixed(2) + "h" + ")"}</h5>
                    <p class="card-text text-truncate">${filteredComps[i].descDeComp}</p>

                    <div class="dropdown">
                        <button class="btn p-0 border-0 threeDotsMenu" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" onclick="event.stopPropagation()">
                            <i class="bi bi-three-dots-vertical text-light fs-3"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button class="dropdown-item" href="#" onclick="event.stopPropagation(); modiferCompInfo(${i})" >Edit</button></li>
                            <li><button class="dropdown-item" onclick="supprimerComp(${i}); event.stopPropagation()">Delete</button></li>
                        </ul>
                    </div>

                    ${cs}
                </div>
                <div class="progress" role="progressbar" aria-valuenow="${totalProgressPercentage}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: ${totalProgressPercentage}%">${totalProgressPercentage.toFixed(2)}%</div>
                </div>
            </div>
        `
    }
    cards_mere.innerHTML = text
    addToLocalStorage()
}

function modiferCompInfo(index) {
    cards_mere_sec.style.display = 'none'
    modifierComp.style.display = 'block'

    currentComp = index
    let newCompName = document.getElementById("newCompName")
    let newCompDesc = document.getElementById("newCompDesc")

    newCompName.value = comps[currentComp].nomDeComp
    newCompDesc.value = comps[currentComp].descDeComp
}

function modifierCompValues() {
    let newCompName = document.getElementById("newCompName")
    let newCompDesc = document.getElementById("newCompDesc")

    comps[currentComp].nomDeComp = newCompName.value
    comps[currentComp].descDeComp = newCompDesc.value

    backToCardsMere2()
}

function supprimerComp(x) {
    comps.splice(x, 1)
    afficher()
}

function supprimerBloc(event, x, z) {
    event.stopPropagation()
    comps[z].blocksDApprentissage.splice(x, 1)
    showFils(z)
}

function showFils(x) {
    currentComp = x
    cards_fils.innerHTML = ""
    text = ''
    let cblocs = comps[x].blocksDApprentissage
    for (let i = 0; i < comps[x].blocksDApprentissage.length; i++) {
        let timeDonePercent = (cblocs[i].timeDone / cblocs[i].timeTotal) * 100

        const totalSeconds = Math.floor(cblocs[i].timeTotal * 3600);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;

        text += `
            <div class="card col-3 width24" onclick="showFilsDetails(${x}, ${i})">
                <div class="card-body">
                    <h5 class="card-title">${cblocs[i].titre} (${h}h ${m}min ${s}s)</h5>
                    <p class="card-text">${cblocs[i].description}</p>
                </div>
                <div class="progress" role="progressbar" aria-valuenow="${timeDonePercent}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar" style="width: ${timeDonePercent}%">${timeDonePercent.toFixed(2)}%</div>
                </div>
                <button class="btn btn-danger deleteCompBtn" onclick="supprimerBloc(event, ${i}, ${x})">X</button>
            </div>
        `
    }
    cards_fils.innerHTML = text

    cards_mere_sec.style.display = "none"
    cards_fils_Sec.style.display = "flex"
    addToLocalStorage()
}

let timerStart = null
let timerInterval = null


function showFilsDetails(comp, bloc) {
    currentBloc = bloc
    currentComp = comp

    cards_fils_Sec.style.display = "none"
    cards_dets_sec.style.display = 'block'

    let blocName = document.getElementById("NomDeBloc")
    let blocDesc = document.getElementById("descDeBloc")
    let blocDur = document.getElementById("durDeBloc")

    blocName.value = comps[comp].blocksDApprentissage[bloc].titre
    blocDesc.value = comps[comp].blocksDApprentissage[bloc].description
    blocDur.value = comps[comp].blocksDApprentissage[bloc].timeTotal
    addToLocalStorage()
}

document.getElementById("modifierBloc").addEventListener("click", () => {
    if (confirm("Vous etes sure vous voulez changer les informations de ce bloc ?")) {
        let blocName = document.getElementById("NomDeBloc")
        let blocDesc = document.getElementById("descDeBloc")
        let blocDur = document.getElementById("durDeBloc")

        comps[currentComp].blocksDApprentissage[currentBloc].titre = blocName.value
        comps[currentComp].blocksDApprentissage[currentBloc].description = blocDesc.value
        comps[currentComp].blocksDApprentissage[currentBloc].timeTotal = blocDur.value
        showFils(currentComp)
        showFilsDetails(currentComp, currentBloc)
        validerProgress()
        addToLocalStorage()
    }
})

document.getElementById("startTimer").addEventListener('click', startTimer)
function startTimer() {
    const inputHours = Number(comps[currentComp].blocksDApprentissage[currentBloc].timeTotal) - Number(comps[currentComp].blocksDApprentissage[currentBloc].timeDone);
    if (isNaN(inputHours) || inputHours <= 0) {
        return;
    }

    let remainingTime = inputHours * 3600000;
    timerStart = Date.now();

    timerInterval = setInterval(() => {
        const elapsed = Date.now() - timerStart;
        // const hoursElapsed = elapsed / 3600000;
        const timeLeft = remainingTime - elapsed;

        if (timeLeft <= 0) {
            comps[currentComp].blocksDApprentissage[currentBloc].timeDone = comps[currentComp].blocksDApprentissage[currentBloc].timeTotal
            comps[currentComp].blocksDApprentissage[currentBloc].status = "fini"
            comps[currentComp].status = "fini"
            stopTimerFunc()

            document.getElementById("timerDisk").textContent = "Terminee!🎉"

            confetti({
                particleCount: 400,
                spread: 1000,
                origin: { x: 1, y: 0.9 },
            });
            confetti({
                particleCount: 400,
                spread: 1000,
                origin: { x: 0, y: 0.9 },
            });

            comps[currentComp].blocksDApprentissage.forEach(element => {
                if (element.status == "en cours") { comps[currentComp].blocksDApprentissage[currentBloc].status = "en cours" }
            });

            return
        }
        // comps[currentComp].blocksDApprentissage[currentBloc].timeDone = Number(comps[currentComp].blocksDApprentissage[currentBloc].timeDone) + hoursElapsed
        comps[currentComp].blocksDApprentissage[currentBloc].timeDone = (Number(comps[currentComp].blocksDApprentissage[currentBloc].timeTotal) - timeLeft / 3600000).toFixed(4);


        const totalSeconds = Math.floor(timeLeft / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        document.getElementById("timerDisk").textContent = hours + " h " + minutes + "min " + seconds + "s";
    }, 1000);
    addToLocalStorage()
}

document.getElementById("stopTimer").addEventListener('click', stopTimerFunc)
function stopTimerFunc() {
    if (!timerInterval) { return }

    console.log(comps);


    clearInterval(timerInterval);
    timerInterval = null
    timerStart = null


    const timeDone = Number(comps[currentComp].blocksDApprentissage[currentBloc].timeDone);
    const remaining = Number(comps[currentComp].blocksDApprentissage[currentBloc].timeTotal) - timeDone;

    const totalSeconds = Math.floor(remaining * 3600);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;


    document.getElementById("timerDisk").textContent = hours + " h " + minutes + "min " + seconds + "s";
    addToLocalStorage()
}

function validerProgress() {
    comps.forEach(comp => {
        comp.blocksDApprentissage.forEach(bloc => {
            if (bloc.timeDone >= bloc.timeLeft) { bloc.status = "fini"; comp.status = "fini" }
            else { bloc.status = "en cours"; comp.status = "en cours" }
        });
    });
}

function addNewEmptyBloc() {
    console.log(currentComp);
    comps[currentComp].blocksDApprentissage.push(
        {
            titre: '',
            description: '',
            timeDone: 0,
            timeTotal: 1,
            status: "en cours"
        }
    )

    showFils(currentComp)

}

function addToLocalStorage() {
    localStorage.setItem('comps', JSON.stringify(comps))
}

//Go back buttons
function backToCardsMere() {
    cards_mere_sec.style.display = "flex"
    cards_fils_Sec.style.display = "none"

    afficher()
}
function backToCardsMere2() {
    cards_mere_sec.style.display = "flex"
    modifierComp.style.display = "none"

    afficher()
}
function backToDashboard() {
    dashboard.style.display = 'block'
    ajouter1.style.display = 'none'
}
function backToAjouter1() {
    ajouter1.style.display = 'block'
    ajouter2.style.display = 'none'
}
function backToAjouter2() {
    ajouter2.style.display = 'block'
    c_division.style.display = 'none'
}
function backToCardsFils() {
    cards_dets_sec.style.display = 'none'
    cards_fils_Sec.style.display = "flex"
    showFils(currentComp)
}