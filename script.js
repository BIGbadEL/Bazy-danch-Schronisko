
function onload() {
    const request = new XMLHttpRequest();
    const url = `https://stormy-scrubland-09004.herokuapp.com/books`;
    request.open('GET', url);
    request.onload = function () {
        const data = JSON.parse(this.response);
        console.log(data);
        //document.getElementById('xdd').innerHTML = data[0].id + " " + data[0].author;
    };
    request.send();
    //console.log(res);
}

function to_registration() {
    
}