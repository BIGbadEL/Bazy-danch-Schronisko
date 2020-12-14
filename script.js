const url = `http://leszczynskimichal.pl:3000`;

function onload() {}

async function get_all_cities(event) {
  event.preventDefault();
  try {
    const response = await fetch(url + "/api/v0/cities", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    });
    const content = document.querySelector("#content");
    const cities = await response.json();
    let table = '<table class="table">';
    table += `
            <thead>
                <tr>
                  <th scope="col">Nazwa</th>
                </tr>
            </thead>
            <tbody>
        `;

    cities.forEach((city) => {
      table += `
                <tr>
                <th scope="row">${city.name}</th>
                `;

      table += `</tr>`;
    });

    table += "</tbody></table>";
    content.innerHTML = table;
  } catch (error) {
    console.log(error);
  }
}

async function get_all_cerriers(event) {
  event.preventDefault();
  try {
    const response = await fetch(url + "/api/v0/connections", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "get",
    });
    const content = document.querySelector("#content");
    const carriers = await response.json();
    let table = '<table class="table">';
    table += `
              <thead>
                  <tr>
                    <th scope="col">Nazwa</th>
                    <th scope="col">Co ile minut odjazd</th>
                  </tr>
              </thead>
              <tbody>
          `;

    carriers.forEach((carrier) => {
      table += `
                  <tr>
                  <th scope="row">${carrier.name}</th>
                  <th scope="row">${carrier.intervals}</th>
                  `;

      table += `</tr>`;
    });

    table += "</tbody></table>";
    content.innerHTML = table;
  } catch (error) {
    console.log(error);
  }
}

async function add_city(event) {
  event.preventDefault();
  const city = {
    name: document.querySelector("#InputCityName").value
  };
  const response = await fetch(url + "/api/v0/cities", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(city),
  });
  console.log(response);
  if(response.status == 400){
    const email = document.querySelector("#InputCityName1");
    console.log(email);
    const html = email.innerHTML.toString();
    if(!html.includes("<small>")) {
        email.innerHTML = email.innerHTML + "\n" +
            "<small>Podane miasto jest już w bazie danych</small>";
    }
  } else {
    await get_all_cities(event);
  }
}

async function add_city_handler(event) {
  event.preventDefault();
  const content = document.querySelector("#content");
  try {
    let form = '<form onsubmit="add_city(event)">';
    form += `
            <div class="form-group" id="InputCityName1">
                <label for="InputCapacity1">Nazwa:</label>
                <input class="form-control" id="InputCityName" placeholder="wpisz nazwę miasta" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Dodaj miasto</button>
            </form>
            `;
    content.innerHTML = form;
  } catch (error) {
    console.log(error);
  }
}

async function add_carrier(event) {
  event.preventDefault();
  const carrier = {
    name: document.querySelector("#InputCarrierName").value,
    intervals: document.querySelector("#InputCarrierInt").value
  };
  const response = await fetch(url + "/api/v0/connections", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(carrier),
  });
  console.log(response);
  if(response.status == 400){
    const email = document.querySelector("#InputCarrierName1");
    console.log(email);
    const html = email.innerHTML.toString();
    if(!html.includes("<small>")) {
        email.innerHTML = email.innerHTML + "\n" +
            "<small>Podany przewoźnik jest już w bazie danych</small>";
    }
  } else {
    await get_all_cerriers(event);
  }
}

async function add_carrier_handler(event) {
  event.preventDefault();
  const content = document.querySelector("#content");
  try {
    let form = '<form onsubmit="add_carrier(event)">';
    form += `
            <div class="form-group" id="InputCarrierName1">
                <label for="InputCarrier1">Nazwa:</label>
                <input class="form-control" id="InputCarrierName" placeholder="wpisz nazwę przewoźnika" required="true">
            </div>
            <div class="form-group" id="InputCarrierInt1">
                <label for="InputCarrier1">Co ile minut odjazd:</label>
                <input class="form-control" id="InputCarrierInt" placeholder="minuty pomiędzy odjazdami" required="true">
            </div>
            <button type="submit" class="btn btn-primary" >Dodaj Przewnożnika</button>
            </form>
            `;
    content.innerHTML = form;
  } catch (error) {
    console.log(error);
  }
}

async function add_connection(event) {
  event.preventDefault();
  //const response = ;
  const Cities = await (await fetch(url + "/api/v0/cities")).json();
  const response1 = await fetch(url + "/api/v0/connections");
  const Connections = await response1.json();
  const conn = {
    start: Cities[parseInt(document.querySelector("#InputStart").value)].name,
    carrier: Connections[parseInt(document.querySelector("#InputCarrier").value)].name,
    end: Cities[parseInt(document.querySelector("#InputEnd").value)].name
  };
  console.log(conn);
  
  const response = await fetch(url + "/api/v0/connections/create", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(conn),
  });
  location.reload();
}

async function add_connection_handler(event) {
  event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/api/v0/cities");
        const Cities = await response.json();
        const response1 = await fetch(url + "/api/v0/connections");
        const Connections = await response1.json();
        let form = '<form onsubmit="add_connection(event)">';
        form += `
            <div id="selector">
            <select class=\"browser-default custom-select\" id="InputStart">
                    <option selected>Miasto odjazdu</option>
            `;
        let id = 0;
        Cities.forEach(city => {
           form += "\n";
           form += `<option value="${id++}">` + city.name + `</option>`;
        });

        form += "</select></div>";

        form += `
            <div id="selector">
            <select class=\"browser-default custom-select\" id="InputCarrier">
                    <option selected>Przewoźnik</option>
            `;
        id = 0;
        Connections.forEach(conn => {
           form += "\n";
           form += `<option value="${id++}">` + conn.name + `</option>`;
        });

        form += "</select></div>";

        form += `
            <div id="selector">
            <select class=\"browser-default custom-select\" id="InputEnd">
                    <option selected>Miasto docelowe</option>
            `;
        id = 0;
        Cities.forEach(city => {
           form += "\n";
           form += `<option value="${id++}">` + city.name + `</option>`;
        });

        form += "</select></div>";

        form += `
            <button type="submit" class="btn btn-primary"  >Dodaj połączenie</button>
            </form>
            `;
        content.innerHTML = form;
    } catch (error) {
        console.log(error)
    }
}

async function find_connection(event) {
  event.preventDefault();
  const Cities = await (await fetch(url + "/api/v0/cities")).json();
  const data = {
    start: Cities[parseInt(document.querySelector("#InputStart").value)].name,
    end: Cities[parseInt(document.querySelector("#InputEnd").value)].name
  };
  const response = await fetch(url + "/api/v0/connections/get", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify(data),
  });

  const content = document.querySelector("#content");
  const connections = await response.json();
  console.log(connections);
  let table = '<table class="table">';
  table += `
            <thead>
                <tr>
                  <th scope="col">Numer przesiadki</th>
                  <th scope="col">Miejsce odjazdu</th>
                  <th scope="col">Przewoźnik</th>
                  <th scope="col">Miejsce dojazdu</th>
                </tr>
            </thead>
            <tbody>
        `;
  let start_id = 0;
  let carr_id = 1;
  let id = 0;
  console.log(connections.result.length);
  for(let end_id = 2; end_id < connections.result.length; end_id += 2) {
    table += `
    <tr>
    <th scope="row">${id}.</th>
    <th scope="row">${connections.result[start_id]}</th>
    <th scope="row">${connections.result[carr_id]}</th>
    <th scope="row">${connections.result[end_id]}</th>
    `;

    table += `</tr>`;
    start_id += 2;
    carr_id += 2;
    id += 1;
  }

  table += "</tbody></table>";
  content.innerHTML = table;
}

async function find_way_form(event) {
  event.preventDefault();
    const content = document.querySelector("#content");
    try {
        const response = await fetch(url + "/api/v0/cities");
        const Cities = await response.json();
        let form = '<form onsubmit="find_connection(event)">';
        form += `
            <div id="selector">
            <select class=\"browser-default custom-select\" id="InputStart">
                    <option selected>Miasto odjazdu</option>
            `;
        let id = 0;
        Cities.forEach(city => {
           form += "\n";
           form += `<option value="${id++}">` + city.name + `</option>`;
        });

        form += "</select></div>";

        form += `
            <div id="selector">
            <select class=\"browser-default custom-select\" id="InputEnd">
                    <option selected>Miasto docelowe</option>
            `;
        id = 0;
        Cities.forEach(city => {
           form += "\n";
           form += `<option value="${id++}">` + city.name + `</option>`;
        });

        form += "</select></div>";

        form += `
            <button type="submit" class="btn btn-primary"  >Szukaj połączenia</button>
            </form>
            `;
        content.innerHTML = form;
    } catch (error) {
        console.log(error)
    }
}