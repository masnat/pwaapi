$(document).ready(function() {
    let _url = "https://my-json-server.typicode.com/masnat/pwaapi/products";

    let dataResults = "";
    let catResults = "<option value='all'>Semua</option>";
    let categories = [];
    let networkDataReceived = false;
    // fresh data from online
    let networkUpdate = fetch(_url).then(function(response) {
            return response.json();
        }).then(function(data) {
            networkDataReceived = true;
            renderPage(data);
        })
        // return data from cache
    caches.match(_url).then(function(response) {
        if (!response) throw Error("No data on cache");
        return response.json();
    }).then(function(data) {
        if (!networkDataReceived) {
            renderPage(data);
        }
    }).catch(function() {
        return networkUpdate;
    })

    function renderPage(data) {
        $.each(data, function(key, items) {
            let _cat = items.category;
            dataResults += `<div>
                <h3>${items.name}</h3>
                <p>${_cat}</p>
            </div>`;

            if ($.inArray(_cat, categories) == -1) {
                categories.push(_cat);
                catResults += `<option value="${_cat}">${_cat}</option>`;
            }
        });
        $("#products").html(dataResults);
        $("#category").html(catResults);
    }

    $("#category").on("change", function() {
        updateProduct($(this).val());
    })

    function updateProduct(cat) {
        dataResults = "";
        let _newurl = _url;
        if (cat !== 'all') {
            _newurl = _url + "?category=" + cat;
        }
        $.get(_newurl, function(data) {
            $.each(data, function(key, items) {
                let _cat = items.category;
                dataResults += `<div>
                    <h3>${items.name}</h3>
                    <p>${_cat}</p>
                </div>`;
            });
            $("#products").html(dataResults);
        });
    }
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function() { console.log("Service Worker Registered"); });
}