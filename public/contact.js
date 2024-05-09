const map = L.map('map').setView([41, -74], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);

const markers = [];

const init = async () => {
    console.log('Initializing...');

    mask( 'block', 'none', 'none', 'none', 'block', 'none');

    const contacts = await axios.get('/list');
    const tbody = document.querySelector('tbody');
    const p = document.querySelector('#alertp');

    if(p) p.remove();

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    for (var i = 0; i < markers.length; i++) { 
        map.removeLayer(markers[i]); 
    }

    if(contacts && contacts.data && contacts.data.contacts) {
        for(const c of contacts.data.contacts) {
            if(c.lat && c.lng) {
                const marker = L.marker([c.lat, c.lng]).addTo(map).bindPopup(`<b>${c.title} ${c.firstname} ${c.lastname}</b><br/>${c.address}`);
                markers.push(marker);
            }

            const tr = document.createElement('tr');
            tr.setAttribute('data-lat', c.lat);
            tr.setAttribute('data-lng', c.lng);
            tr.onclick = on_row_click;

            let contactMail;
            let contactPhone;
            let contactEmail;

            if(c.contact_by_mail == 1) {
                contactMail = `
                    <input type="checkbox" name="contactMail" checked disabled/>
                    <label for="contactMail">Mail</label>
                    <br>
                `;
            } else {
                contactMail = `
                    <input type="checkbox" name="contactMail" disabled/>
                    <label for="contactMail">Mail</label>
                    <br>
                `;
            }

            if(c.contact_by_phone == 1) {
                contactPhone = `
                    <input type="checkbox" name="contactPhone" checked disabled/>
                    <label for="contactPhone">Call</label>
                    <br>
                `;
            } else {
                contactPhone = `
                    <input type="checkbox" name="contactPhone" disabled/>
                    <label for="contactPhone">Call</label>
                    <br>
                `;
            }


            if(c.contact_by_email == 1) {
                contactEmail = `
                    <input type="checkbox" name="contactEmail" checked disabled/>
                    <label for="contactEmail">Email</label>
                    <br>
                `;
            } else {
                contactEmail = `
                    <input type="checkbox" name="contactEmail" disabled/>
                    <label for="contactEmail">Email</label>
                    <br>
                `;
            }

            tr.innerHTML = `
                <td>
                    <p> ${c.title} ${c.firstname} ${c.lastname} </p>
                    <a href="/edit/${c.id}" class="btn btn-sm btn-outline-dark">Edit <i class="fa fa-edit" style="font-size:14px"></i></a>
                    <br>
                    <a href="/delete/${c.id}" class="btn btn-sm btn-outline-danger mt-1">Delete <i class="fa fa-trash" style="font-size:14px"></i></a>
                </td>
                <td>${c.address}</td>
                <td>${c.email}</td>
                <td>${c.phone}</td>
                <td>` + contactMail + `
                ` + contactPhone + `
                ` + contactEmail + `
                </td>`;

            tbody.appendChild(tr);
        }
    }
}

const on_row_click = (e) => {
    let row = e.target; 

    if (e.target.tagName.toUpperCase() === 'TD') {
        row = e.target.parentNode;
    }

    const lat = row.dataset.lat;
    const lng = row.dataset.lng;

    map.flyTo(new L.LatLng(lat, lng));
}

const loadCreate = async () => {
    const user = await axios.get('/login');

    if(user.data.user) {
        mask( 'none', 'block', 'none', 'none', 'none', 'block');
    } else {
        mask(  'none', 'block', 'none', 'none', 'none', 'block');
    }
}

const loadLogin = async () => {
    mask( 'none', 'block', 'none', 'block', 'none', 'none');
}

const login = async () => {
    const username = document.querySelector('#usernameLogin').value;
    const password = document.querySelector('#passwordLogin').value;
    
    const status = await axios.put('/login', { username: username, password: password });

    document.getElementById('usernameLogin').value = '';
    document.getElementById('passwordLogin').value = '';

    if(status.data.user) {
        location.reload(true);

        await init();
    } else {
        const prevP = document.querySelector('#alertp');
        if(prevP) prevP.remove();

        const p = document.createElement('p');
        const fg = document.querySelector('#fgLogin');
        const alert = document.createTextNode("Invalid username or password. Please try again.");

        p.appendChild(alert);
        p.setAttribute('class', 'alert alert-warning mt-2');
        p.setAttribute('id', 'alertp');
        fg.appendChild(p);

        await loadLogin();
    }
}

const logout = async () => {
    const status = await axios.get('/login');

    if(status.data.user == undefined) {
        location.reload(true);

        await init();
    }
}

const loadSignup = async () => {
    mask('none', 'none', 'block', 'none', 'none', 'none', 'none');
}

const signup = async () => {
    const firstname = document.querySelector('#userFirst').value;
    const lastname = document.querySelector('#userLast').value;
    const username = document.querySelector('#userUser').value;
    const p1 = document.querySelector('#passwordUser1').value;
    const p2 = document.querySelector('#passwordUser2').value;

    const status = await axios.put('/signup', { 
        firstname: firstname, 
        lastname: lastname, 
        username: username, 
        password: p1, 
        password2: p2 
    });

    const prevP = document.querySelector('#alertpSignup');
    if(prevP) prevP.remove();

    if(status.data.status == 'match') {
        const p = document.createElement('p');
        const fg = document.querySelector('#fgSignup');
        const alert = document.createTextNode("Passwords do not match. Please try again.");

        p.appendChild(alert);
        p.setAttribute('class', 'alert alert-warning mt-2');
        p.setAttribute('id', 'alertpSignup');
        fg.appendChild(p);

        await loadSignup();
    } else if (status.data.status == 'exists') {
        const p = document.createElement('p');
        const fg = document.querySelector('#fgSignup');
        const alert = document.createTextNode("An account under this username already exists. Please try again.");

        p.appendChild(alert);
        p.setAttribute('class', 'alert alert-warning mt-2');
        p.setAttribute('id', 'alertpSignup');
        fg.appendChild(p);

        await loadSignup();
    } else {
        location.reload(true);

        await init();
    }
}

const createContact = async () => {
    const first = document.querySelector('#first').value;
    const last = document.querySelector('#last').value;
    const title = document.querySelector('#title').value;
    const address = document.querySelector('#address').value;
    const phone = document.querySelector('#phone').value;
    const email = document.querySelector('#email').value;

    const canMail = document.querySelector('#canMail').checked;
    const canCall = document.querySelector('#canCall').checked;
    const canEmail = document.querySelector('#canEmail').checked;

    const response = await axios.put('/list', 
    { 
        first: first, 
        last: last, 
        title: title,
        address: address,
        phone: phone,
        email: email,
        canMail: canMail,
        canCall: canCall,
        canEmail: canEmail
    });

    if(response.data.error == "Invalid address") {
        const prevP = document.querySelector('#alertpCreate');
        if(prevP) prevP.remove();

        const p = document.createElement('p');
        const fg = document.querySelector('#fgCreate');
        const alert = document.createTextNode("Invalid address. Please try again.");

        p.appendChild(alert);
        p.setAttribute('class', 'alert alert-warning mt-2');
        p.setAttribute('id', 'alertpCreate');
        fg.appendChild(p);

        await loadCreate();
    } else {
        await init();
    }
}

const mask = (createbutton, cancelbutton, signup, login, all, create) => {
    let page = document.getElementById('createbutton');
    page.style.display = createbutton;

    page = document.getElementById('cancelbutton');
    page.style.display = cancelbutton;

    page = document.getElementById('signup');
    page.style.display = signup;
    
    page = document.getElementById('login');
    page.style.display = login;

    page = document.getElementById('all');
    page.style.display = all;

    page = document.getElementById('create');
    page.style.display = create;
}