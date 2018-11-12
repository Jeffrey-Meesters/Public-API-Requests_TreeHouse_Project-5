$('document').ready(function() {

    // Use ajax to do make a request to the ranomuser api
    // In the docs I found that I can use the 'results' as a query string
    // to set a limit on the amount of random users I want for this
    // project we need 12 users
    $.ajax({
        url: 'https://randomuser.me/api/?results=12',
        dataType: 'json',
        success: function(data) {
            console.log(data);
        }
    });
}); // end ready
