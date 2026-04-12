function validiraj(podaci) {
    if (!podaci || !Array.isArray(podaci.projekcije) || podaci.projekcije.length === 0) return false;
    const validni = ['slobodno', 'zauzeto', 'rezervisano'];
    for (const p of podaci.projekcije) {
        for (const s of p.sjedista) {
            if (!validni.includes(s.status)) return false;
        }
    }
    return true;
}

function prikaziSalu(podaci, trenutni) {
    const kontejner = document.getElementById('sala');
    kontejner.innerHTML = '';

    const projekcija = podaci.projekcije[trenutni];

    const infoFilma = document.createElement('info-filma');
    const redNaziv = document.createElement('red-info');
    redNaziv.innerHTML = 'Naziv filma: <span>' + projekcija.film + '</span>';
    infoFilma.appendChild(redNaziv);
    const redVrijeme = document.createElement('red-info');
    redVrijeme.innerHTML = 'Vrijeme projekcije: <span>' + projekcija.vrijeme + '</span>';
    infoFilma.appendChild(redVrijeme);
    kontejner.appendChild(infoFilma);

    const sadrzajSale = document.createElement('sadrzaj-sale');

    const panelInfo = document.createElement('panel-info');
    const ukupno = projekcija.sjedista.length;
    const rezervisana = projekcija.sjedista.filter(s => s.status === 'rezervisano').length;
    panelInfo.innerHTML = 'Broj mjesta: <span>' + ukupno + '</span>Ukupna cijena: <span>' + (rezervisana * 10) + ' KM</span>';
    sadrzajSale.appendChild(panelInfo);

    const rasporedSale = document.createElement('raspored-sale');
    const platno = document.createElement('platno');
    platno.textContent = 'Platno';
    rasporedSale.appendChild(platno);

    const redovi = {};
    for (const sj of projekcija.sjedista) {
        if (!redovi[sj.red]) redovi[sj.red] = [];
        redovi[sj.red].push(sj);
    }

    for (const oznakaReda of Object.keys(redovi).sort()) {
        const redEl = document.createElement('red-sjedista');
        const oznaka = document.createElement('oznaka-reda');
        oznaka.textContent = oznakaReda;
        redEl.appendChild(oznaka);

        for (const sj of redovi[oznakaReda]) {
            const el = document.createElement('sjediste');
            el.className = sj.status;
            if (sj.status === 'slobodno') {
                el.addEventListener('click', () => {
                    sj.status = 'rezervisano';
                    snimiPodatke(podaci).then(() => prikaziSalu(podaci, trenutni));
                });
            }
            redEl.appendChild(el);
        }

        rasporedSale.appendChild(redEl);
    }

    const legenda = document.createElement('legenda-sale');
    for (const [klasa, tekst] of [['slobodno', 'Slobodno'], ['zauzeto', 'Zauzeto'], ['rezervisano', 'Rezervisano']]) {
        const stavka = document.createElement('stavka-legende');
        const boja = document.createElement('oznaka-boje');
        boja.className = klasa;
        stavka.appendChild(boja);
        stavka.appendChild(document.createTextNode(' ' + tekst));
        legenda.appendChild(stavka);
    }
    rasporedSale.appendChild(legenda);

    sadrzajSale.appendChild(rasporedSale);
    kontejner.appendChild(sadrzajSale);

    const navigacija = document.createElement('div');
    navigacija.className = 'navigacija-projekcija';

    const btnPrethodna = document.createElement('button');
    btnPrethodna.textContent = 'Prethodna projekcija';
    if (trenutni === 0) {
        btnPrethodna.disabled = true;
    } else {
        btnPrethodna.addEventListener('click', () => prikaziSalu(podaci, trenutni - 1));
    }

    const btnSljedeca = document.createElement('button');
    btnSljedeca.textContent = 'Sljedeća projekcija';
    if (trenutni === podaci.projekcije.length - 1) {
        btnSljedeca.disabled = true;
    } else {
        btnSljedeca.addEventListener('click', () => prikaziSalu(podaci, trenutni + 1));
    }

    navigacija.appendChild(btnPrethodna);
    navigacija.appendChild(btnSljedeca);
    kontejner.appendChild(navigacija);
}

function snimiPodatke(podaci) {
    return fetch('/api/projekcije', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(podaci)
    });
}
