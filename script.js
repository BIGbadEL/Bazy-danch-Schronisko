const url = `http://localhost:3002`;
function onload() {

}

async function login_handler(event) {
    event.preventDefault();
    const Customer = {
        email: document.querySelector("#InputEmail1").value,
        password: document.querySelector("#InputPassword1").value
    };
    try {
        const response = await fetch(url + '/customer_log',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(Customer)
            });
        const client = await response.json();
        if(client.length === 1){
            sessionStorage.setItem('userID', client[0].K_ID);
            sessionStorage.setItem('isCustomer', true);
            sessionStorage.setItem('isWorker', false);
            window.location.href = "user.html";
        }
    } catch (error) {
        console.log(error)
    }
}

async function registration_handler(event) {
    event.preventDefault();
    const newCustomer = {
        name: document.querySelector("#InputName1").value,
        surname: document.querySelector("#InputSurname1").value,
        number: document.querySelector("#InputPhoneNumber1").value,
        email: document.querySelector("#InputEmail1").value,
        password: document.querySelector("#InputPassword1").value
    };
    console.log(newCustomer);
    try {
        const response = await fetch(url + '/customer_reg', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(newCustomer),
        });

        console.log(response.status);
        if(response.status === 409) {
            const email = document.querySelector("#InputEmail");
            const html = email.innerHTML.toString();
            if(!html.includes("<small>")) {
                email.innerHTML = email.innerHTML + "\n" +
                    "<small>Konto z podanym adresem email już istnieje</small>";
            }
        } else {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.log(error);
    }
}

async function user_info_handler(event) {
    event.preventDefault();
    const Customer = {
        k_id: sessionStorage.getItem('userID'),
    };
    try {
        const response = await fetch(url + '/customer_info',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(Customer)
            });
        const client = await response.json();
        if(client.length === 1){
            const content = document.querySelector("#content");
            content.innerHTML =  '<h4>' + client[0].imie + " " + client[0].nazwisko + '</h4>' + "\n" +
                "<p>" + "<i class=\"glyphicon glyphicon-envelope\"></i>" + client[0].mail +
                "<br />" + client[0].telefon +
                "</p>";
            console.log(client[0]);
        }
    } catch (error) {
        console.log(error)
    }
}

async function login_worker_handler(event) {
    event.preventDefault();
    const Info = {
        email: document.querySelector("#InputEmail1").value,
        password: document.querySelector("#InputPassword1").value
    };

    try {
        const response = await fetch(url + '/worker_log',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(Info)
            });
        const worker = await response.json();
        console.log(worker);
        if(worker.length === 1){
            sessionStorage.setItem('workerID', worker[0].PR_ID);
            sessionStorage.setItem('isCustomer', false);
            sessionStorage.setItem('isWorker', true);
            window.location.href = "worker.html";
        }
    } catch (error) {
        console.log(error)
    }
}

async function worker_info_handler(event) {
    event.preventDefault();
    const Worker = {
        p_id: sessionStorage.getItem('workerID'),
    };
    try {
        const response = await fetch(url + '/worker_info',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(Worker)
            });
        const worker = await response.json();
        if(worker.length === 1){
            const content = document.querySelector("#content");
            content.innerHTML =  '<div align="center"><h4>' + worker[0].imie + " " + worker[0].nazwisko + '</h4>' + "\n" +
                "<p>" + worker[0].stanowisko +
                "<br />" +"<i class=\"glyphicon glyphicon-envelope\"></i>" + worker[0].mail +
                "<br />" + worker[0].telefon +
                "</p></div>";
            console.log(worker[0]);
        }
    } catch (error) {
        console.log(error)
    }
}

async function add_room_to_database(event){
    event.preventDefault();
    const Room = {
        o_id: document.querySelector("#InputCenter").value,
        capacity: document.querySelector("#InputCapacity1").value,
        number: document.querySelector("#InputNumber1").value
    };
    console.log(Room);
    const response = await fetch(url + '/add_room',
        {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'post',
            body: JSON.stringify(Room)
        });
}

async function add_room_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_centers")
        const Centers = await response.json();

        console.log(Centers);
        let form = '<form>';
        form += `
            <select class=\"browser-default custom-select\" id="InputCenter">
                    <option selected>Wybierz Ośrodek</option>
            `;

        Centers.forEach(center => {
           form += "\n";
           form += `<option value="${center.O_ID}">` + center.miasto + " ul. " + center.adres + `</option>`;
        });

        form += "</select>";
        form += `
            <div class="form-group">
                <label for="InputCapacity1">Pojemność:</label>
                <input class="form-control" id="InputCapacity1" placeholder="wpisz pojemność pomieszczenia">
            </div>
            <div class="form-group">
                <label for="InputNumber1">Numer pomieszczenia:</label>
                <input class="form-control" id="InputNumber1" placeholder="wpisz numer pomieszczenia">
            </div>
            <button type="submit" class="btn btn-primary" onclick="add_room_to_database(event)" >Dodaj Pomieszczenie</button>
            </form>
            `;
        content.innerHTML = form;
    } catch (error) {
        console.log(error)
    }

}

async function add_center_to_database(event) {
    event.preventDefault();
    const newCenter = {
        city: document.querySelector("#InputCity1").value,
        address: document.querySelector("#InputAddress1").value
    };
    console.log(newCenter);
    try {
        const response = await fetch(url + '/add_center',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newCenter)
            });
    } catch (error) {
        console.log(error)
    }
}

async function add_center_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    content.innerHTML = `<form onsubmit="add_center_to_database(event)">
            <div class="form-group">
                <label for="InputCity1">Miasto:</label>
                <input class="form-control" id="InputCity1" placeholder="wpisz nazwę miejscowości" required="true">
            </div>
            <div class="form-group">
                <label for="InputAddress1">Dokładny adres:</label>
                <input class="form-control" id="InputAddress1" placeholder="ulica i numer budynku">
            </div>
            <button type="submit" class="btn btn-primary">Dodaj Ośrodek</button>
            </form>
            `;
}

async function add_worker_to_database(event) {
    event.preventDefault();
    const newWorker  = {
        o_id: document.querySelector("#InputCenter").value,
        name: document.querySelector("#InputName1").value,
        surname: document.querySelector("#InputSurname1").value,
        email: document.querySelector("#InputEmail1").value,
        password: document.querySelector("#InputPassword1").value,
        address: document.querySelector("#InputAddress1").value,
        number: document.querySelector("#InputNumber1").value,
        position: document.querySelector("#InputPosition1").value,
        salary: document.querySelector("#InputSalary1").value
    };
    console.log(newWorker);
    try {
        const response = await fetch(url + '/add_worker',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newWorker)
            });
    } catch (error) {
        console.log(error);
    }
}

async function add_worker_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_centers")
        const Centers = await response.json();
        let form = '<form onsubmit="add_worker_to_database(event)">';
        form += `
            <select class=\"browser-default custom-select\" id="InputCenter" required="true">
                    <option selected>Wybierz Ośrodek</option>
            `;

        Centers.forEach(center => {
            form += "\n";
            form += `<option value="${center.O_ID}">` + center.miasto + " ul. " + center.adres + `</option>`;
        });

        form += "</select>";
        form += `
            <div class="form-group">
                <label for="InputName1">Imię:</label>
                <input class="form-control" id="InputName1" placeholder="wpisz imię" required="true">
            </div>
            <div class="form-group">
                <label for="InputSurname1">Imię:</label>
                <input class="form-control" id="InputSurname1" placeholder="wpisz nazwisko" required="true">
            </div>
            <div class="form-group">
                <label for="InputEmail1">Adres email</label>
                <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp" placeholder="wpisz adres email" required="true">
            </div>
            <div class="form-group">
                <label for="InputPassword1">Hasło</label>
                <input type="password" class="form-control" id="InputPassword1" placeholder="wpisz hasło" required="true">
            </div>
            <div class="form-group">
                <label for="InputAddress1">Adres:</label>
                <input class="form-control" id="InputAddress1" placeholder="wpisz adres" required="true">
            </div>
            <div class="form-group">
                <label for="InputNumber1">Numer telefonu:</label>
                <input type="number" class="form-control" id="InputNumber1" placeholder="wpisz numer telefonu" required="true">
            </div>
            <div class="form-group">
                <label for="InputPosition1">Stanowisko:</label>
                <input class="form-control" id="InputPosition1" placeholder="wpisz stanowisko" required="true">
            </div>
            <div class="form-group">
                <label for="InputSalary1">Pensja:</label>
                <input type="number" class="form-control" id="InputSalary1" placeholder="wpisz pensję" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Dodaj Pracownika</button>
            </form>
            `;
        content.innerHTML = form;
    } catch (error) {
        console.log(error)
    }
}

async function add_species_to_database(evnet){
    evnet.preventDefault();
    const newSpecies = {
        name: document.querySelector("#InputName1").value
    };
    console.log(newSpecies);
    try {
        const response = await fetch(url + '/add_species',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newSpecies)
            });
    } catch (error) {
        console.log(error);
    }
}

async function add_species_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        let form = '<form onsubmit="add_species_to_database(event)">';
        form += `
            <div class="form-group">
                <label for="InputName1">Nazwa:</label>
                <input class="form-control" id="InputName1" placeholder="wpisz nazwę" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Dodaj Gatunek</button>
            </form>
            `;
        content.innerHTML = form;
    } catch (error) {
        console.log(error)
    }
}

async function add_breed_to_database(event) {
    event.preventDefault();
    const newBreed = {
        name: document.querySelector("#InputName1").value,
        description: document.querySelector("#InputDesc1").value,
        g_id: document.querySelector("#InputSpecies").value
    };
    console.log(newBreed);
    try {
        const response = await fetch(url + '/add_breed',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newBreed)
            });
    } catch (error) {
        console.log(error);
    }
}

async function add_breed_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_species")
        const Species = await response.json();
        let form = '<form onsubmit="add_breed_to_database(event)">';
        form += `
            <select class=\"browser-default custom-select\" id="InputSpecies" required="true">
                    <option selected>Wybierz Gatunek</option>
            `;

        Species.forEach(spec => {
            form += "\n";
            form += `<option value="${spec.G_ID}"> ${spec.nazwa} </option>`;
        });
        form += `
            </select>
            <div class="form-group">
                <label for="InputName1">Nazwa:</label>
                <input class="form-control" id="InputName1" placeholder="wpisz nazwę" required="true">
            </div>
            <div class="form-group">
                <label for="InputDesc1">Opis lub link do strony z opisem:</label>
                <input class="form-control" id="InputDesc1" placeholder="opis" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Dodaj Rasę</button>
            </form>
            `;
        content.innerHTML = form;
    } catch(error) {
        console.log(error);
    }

}