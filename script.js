const url = `http://localhost:3002`;
function onload() {
    // const request = new XMLHttpRequest();
    // const url_local = url + "/klienci";
    // request.open('GET', url);
    // request.onload = function () {
    //     const data = JSON.parse(this.response);
    //     console.log(data);
    // };
    // request.send();
    // console.log(res);
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
        //     <p>
        //     <i class="glyphicon glyphicon-envelope"></i>email@example.com
        //         <br />
        //         <i class="glyphicon glyphicon-gift"></i>June 02, 1988</p>"
            console.log(client[0]);
        }
    } catch (error) {
        console.log(error)
    }

}