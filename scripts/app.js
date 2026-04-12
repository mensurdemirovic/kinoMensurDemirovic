fetch('/api/projekcije')
    .then(res => res.json())
    .then(podaci => {
        if (!validiraj(podaci)) {
            document.getElementById('sala').innerHTML = '<p class="greska">Podaci nisu validni!</p>';
        } else {
            prikaziSalu(podaci, 0);
        }
    });
