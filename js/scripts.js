$('document').ready(function() {
    $('.search-container').html(`
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>
    `);

    $('#gallery').html(`
        <div class="card">
            <div class="card-img-container">
                <img class="card-img" src="https://placehold.it/90x90" alt="profile picture">
            </div>
            <div class="card-info-container">
                <h3 id="name" class="card-name cap">first last</h3>
                <p class="card-text">email</p>
                <p class="card-text cap">city, state</p>
            </div>
        </div>
    `);

    $('body').append(`
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                    <h3 id="name" class="modal-name cap">name</h3>
                    <p class="modal-text">email</p>
                    <p class="modal-text cap">city</p>
                    <hr>
                    <p class="modal-text">(555) 555-5555</p>
                    <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                    <p class="modal-text">Birthday: 10/21/2015</p>
                </div>
            </div>

            // IMPORTANT: Below is only for exceeds tasks
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `);

    // Use ajax to do make a request to the ranomuser api
    // In the docs I found that I can use the 'results' as a query string
    // to set a limit on the amount of random users I want for this
    // project we need 12 users
    $.ajax({
        url: 'https://randomuser.me/api/?results=12',
        dataType: 'json',
        success: function(data) {
            var response = data.results;
            $.each(response, function(index, user) {
                var image = user.picture.medium;
                var fullName = `${user.name.first} ${user.name.last}`;
                var email = user.email;
                var location = user.location;
                console.log(image, fullName, email, location);
            });
        }
    });
}); // end ready
