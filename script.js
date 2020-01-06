const url = `http://localhost:3002`;
// const url = `https://shelter-api-bd-2020.herokuapp.com`;

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
            content.innerHTML =  '<div align="center"> <h4>' + client[0].imie + " " + client[0].nazwisko + '</h4>' + "\n" +
                "<p>" + "<i class=\"glyphicon glyphicon-envelope\"></i>" + client[0].mail +
                "<br />" + client[0].telefon +
                "</p></div>";
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

async function add_feed_to_database(event) {
    event.preventDefault();
    const newFeed = {
        name: document.querySelector("#InputName1").value,
        amount: document.querySelector("#InputAmount1").value,
        g_id: document.querySelector("#InputSpecies").value
    };
    console.log(newFeed);
    try {
        const response = await fetch(url + '/add_feed',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newFeed)
            });
    } catch (error) {
        console.log(error);
    }
}

async function donate_feed_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_species")
        const Species = await response.json();
        let form = '<form onsubmit="add_feed_to_database(event)">';
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
                <label for="InputAmount1">Ilość:</label>
                <input type="number" class="form-control" id="InputAmount1" placeholder="wpisz ilość w kg" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Przekaż Karmę</button>
            </form>
            `;
        content.innerHTML = form;
    } catch(error) {
        console.log(error);
    }
}

async function add_animal_to_database(event) {
    event.preventDefault();
    const sex_select = document.querySelector("#InputSex").value;
    let sex = '';
    if(sex_select === '1'){
        sex = 'meski';
    } else if (sex_select === '2'){
        sex = 'zenski';
    } else if (sex_select === '3'){
        sex = 'sterylizowany';
    } else {
        return;
    }
    const newAnimal = {
        name: document.querySelector("#InputName1").value,
        g_id: document.querySelector("#InputSpecies").value,
        c_id: document.querySelector("#InputCenter").value,
        sex: sex,
        age: document.querySelector("#InputAge1").value,
        weight: document.querySelector("#InputWeight1").value
    };
    console.log(newAnimal);
    try {
        const response = await fetch(url + '/add_animal',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newAnimal)
            });
    } catch (error) {
        console.log(error);
    }
}

async function give_animal_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_species");
        const Species = await response.json();
        const response_centers = await fetch(url + "/get_all_centers");
        const Centers = await response_centers.json();
        let form = '<form onsubmit="add_animal_to_database(event)">';

        console.log(Centers);
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
            <select class=\"browser-default custom-select\" id="InputSpecies" required="true">
                    <option selected>Wybierz Rasę</option>
            `;

        for (const spec of Species) {
            form += "\n";
            form += `<optgroup label="${spec.nazwa}">`;
            const temp_response = await fetch(url + `/get_breed_by_id/${spec.G_ID}`);
            const breeds = await temp_response.json();
            breeds.forEach(breed => {
               form += "\n";
               form += `<option value="${breed.R_ID}"> ${breed.nazwa} </option>`;
            });
            form += `</optgroup>`;
        }
        form += `
            </select>
            <select class=\"browser-default custom-select\" id="InputSex">
                    <option selected>Płeć</option>
                    <option value="1"> męska </option>
                    <option value="2"> żeńska </option>
                    <option value="3"> sterylizowana </option>
            </select>
            <div class="form-group">
                <label for="InputName1">Imię:</label>
                <input class="form-control" id="InputName1" placeholder="wpisz imię" required="true">
            </div>
            <div class="form-group">
                <label for="InputAge1">Wiek:</label>
                <input type="number" class="form-control" id="InputAge1" placeholder="wpisz wiek" required="true">
            </div>
            <div class="form-group">
                <label for="InputWeight1">Wiek:</label>
                <input type="number" class="form-control" id="InputWeight1" placeholder="wpisz wagę" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Oddaj zwierzę</button>
            </form>
            `;
        content.innerHTML = form;
    } catch(error) {
        console.log(error);
    }
}

async function load_species(event) {
    const spec = document.querySelector("#InputSpecies").value;
    const response = await fetch(url + `/get_breed_by_id/${spec}`);
    const breeds = await response.json();
    const species = document.querySelector("#species");
    let select = '';
    breeds.forEach(breed => {
        select += `
            <div class="custom-control custom-checkbox custom-control-inline">
              <input type="checkbox" value="${breed.R_ID}" class="custom-control-input" id="defaultInline${breed.R_ID}">
              <label class="custom-control-label" for="defaultInline${breed.R_ID}" >${breed.nazwa}</label>
            </div>
        `;
    });
    species.innerHTML = select;
}

async function add_adoption_to_database(event) {
    event.preventDefault();
    const breeds = [];
    const elements = document.querySelectorAll(".custom-control-input");
    elements.forEach(el => {
        if(el.checked)
            breeds.push(parseInt(el.value));
    });
    const sex_select = document.querySelector("#InputSex").value;
    let sex = '';
    if(sex_select === '1'){
        sex = 'meski';
    } else if (sex_select === '2'){
        sex = 'zenski';
    } else if (sex_select === '3'){
        sex = 'sterylizowany';
    } else {
        return;
    }
    const newAdoption = {
        c_id: parseInt(sessionStorage.getItem("userID")),
        g_id: parseInt(document.querySelector("#InputSpecies").value),
        breeds: breeds,
        sex: sex,
        min_age: parseInt(document.querySelector("#InputAge1").value),
        max_age: parseInt(document.querySelector("#InputAge2").value)
    };
    try {
        const response = await fetch(url + '/add_adoption',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',
                body: JSON.stringify(newAdoption)
            });
    } catch (error) {
        console.log(error);
    }
}

async function add_adoption_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_species");
        const Species = await response.json();
        let form = '<form onsubmit="add_adoption_to_database(event)">';
        form += `
            <select class=\"browser-default custom-select\" id="InputSpecies" onchange="load_species(event)" required="true">
                    <option selected>Wybierz Gatunek</option>
            `;

        Species.forEach(spec => {
            form += "\n";
            form += `<option value="${spec.G_ID}"> ${spec.nazwa} </option>`;
        });
        form += `
            </select>
            <div id="species"></div>
            <select class=\"browser-default custom-select\" id="InputSex">
                    <option selected>Płeć</option>
                    <option value="1"> męska </option>
                    <option value="2"> żeńska </option>
                    <option value="3"> sterylizowana </option>
            </select>
            <div class="form-group">
                <label for="InputAge1">minimalny Wiek:</label>
                <input type="number" class="form-control" id="InputAge1" placeholder="wpisz min. wiek" required="true">
            </div>
            <div class="form-group">
                <label for="InputAge2">maksymalny Wiek:</label>
                <input type="number" class="form-control" id="InputAge2" placeholder="wpisz max. wiek" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Oddaj zwierzę</button>
            </form>
            `;
        content.innerHTML = form;
    } catch(error) {
        console.log(error);
    }
}

async function Adopt(event, id) {
    event.preventDefault();
    const data = {
        c_id: sessionStorage.getItem("userID"),
        a_id: id
    };
    console.log(data);
    try {
        const response = await fetch(url + '/add_ready_adoption',
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                method: 'post',

                body: JSON.stringify(data)
            });
    } catch (error) {
        console.log(error);
    }
}

async function show_animals_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/get_all_animals");
        const Animals = await response.json();
        console.log(Animals);

        let table = '<table class="table">';
        table += `
            <thead>
                <tr>
                  <th scope="col">Imię</th>
                  <th scope="col">Rasa</th>
                  <th scope="col">Płeć</th>
                  <th scope="col">Waga [kg]</th>
                  <th scope="col">Wiek</th>
                  <th scope="col">Adopcja</th>
                </tr>
            </thead>
            <tbody>
        `;

        Animals.forEach(animal => {
            table += `
                <tr>
                <th scope="row">${animal.imie}</th>
                <th>${animal.nazwa}</th>
                <th>${animal.Z_plec}</th>
                <th>${animal.waga}</th>
                <th>${animal.wiek}</th>
                <th><button type="submit" class="btn btn-primary" onclick="Adopt(event, ${animal.Z_ID})">Adoptuj</button></th>
                </tr>
            `;
        });

        table += '</tbody></table>';
        content.innerHTML = table;
    } catch (error) {
        console.log(error);
    }
}

async function finalize_adoption(event, ad_id) {
    event.preventDefault();

}

async function show_adoptions_handler(event) {
    event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + `/get_adoptions/${sessionStorage.getItem("userID")}`);
        const Adoptions = await response.json();
        console.log(Adoptions);

        let table = '<table class="table">';
        table += `
            <thead>
                <tr>
                  <th scope="col" colspan="3">Poszukiwane Zwierzęta</th>
                </tr>   
                <tr>
                  <th scope="col">Rasa</th>
                  <th scope="col">Przedział wiekowy</th>
                  <th scope="col">Płeć</th>
                </tr>
            </thead>
            <tbody>
        `;

        Adoptions.forEach(ad => {
            table += `
                <tr>
                <th scope="row">${ad.nazwa}</th>
                <th>${ad.min_wiek} - ${ad.max_wiek}</th>
                <th>${ad.A_plec}</th>
                </tr>
            `;
        });
    // <th><button type="submit" class="btn btn-primary" onclick="Adopt(event, ${animal.Z_ID})">Adoptuj</button></th>

        const response1 = await fetch(url + `/get_ready_adoption/${sessionStorage.getItem("userID")}`);
        const readyAdoptions = await response1.json();
        console.log(readyAdoptions);
        table += '</tbody></table>';
        table += '<table class="table">';
        table += `
            <thead>
                <tr>
                  <th scope="col" colspan="6">Dopasowane Zwierzęta</th>
                </tr>
                <tr>
                  <th scope="col">Imię</th>
                  <th scope="col">Rasa</th>
                  <th scope="col">Płeć</th>
                  <th scope="col">Waga [kg]</th>
                  <th scope="col">Wiek</th>
                  <th scope="col">Finalizuj</th>
                </tr>
            </thead>
            <tbody>
        `;
        readyAdoptions.forEach(ad => {
            table += `
                <tr>
                <th scope="row">${ad.imie}</th>
                <th>${ad.nazwa}</th>
                <th>${ad.Z_plec}</th>
                <th>${ad.waga}</th>
                <th>${ad.wiek}</th>
                <th><button type="submit" class="btn btn-primary" onclick="finalize_adoption(event, ${ad.AD_ID})">Finalizuj Adopcję</button></th>
                </tr>
            `;
        });
        table += '</tbody></table>';
        content.innerHTML = table;
    } catch (error) {
        console.log(error);
    }
}
