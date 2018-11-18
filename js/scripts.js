$('document').ready(function() {
    $('.search-container').html(`
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>
    `);


    $('body').append(`
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
           </div>
           // IMPORTANT: Below is only for exceeds tasks
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
    `);

    function createDob(date) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8, 10);
        return `${year}-${month}-${day}`;
    }

    function addEventListeners(data) {
        $('.card').click(function(event) {
            var clickedCard = event.target.closest('.card');
            var userName = $(clickedCard).find('#name')[0].innerText.toLowerCase();

            $.each(data, function(index, user) {
                if (userName === `${user.name.first} ${user.name.last}`) {
                    var dob = createDob(user.dob.date);
                    var modalInner = `<div class="modal-info-container">
                                        <img class="modal-img" src=${user.picture.large} alt="profile picture">
                                        <h3 id="name" class="modal-name cap">${user.name.first}</h3>
                                        <p class="modal-text">${user.email}</p>
                                        <p class="modal-text cap">${user.location.city}</p>
                                        <hr>
                                        <p class="modal-text">${user.phone}</p> <!--(555) 555-5555-->
                                        <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.postcode}</p>
                                        <p class="modal-text">Birthday: ${dob}</p>
                                    </div>`;
                    // http://api.jquery.com/insertafter/
                    $(modalInner).insertAfter( "#modal-close-btn" );
                    $('#modal-prev').attr('data-prev', (index - 1));
                    $('#modal-next').attr('data-next', (index + 1));
                    $('.modal-container').show();
                }
            })
        })
    }

    function buildUserCard(data) {
        var cards = '';
        $.each(data, function (index, user) {
            var card = `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src=${user.picture.large} alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city} ${user.location.state}</p>
                            </div>
                        </div>`;

            cards += card;
        });

        $('.gallery').html(cards);

        // ass the cards are now loaded we are ready to append event listeners
        addEventListeners(data);
    }

    // Use ajax to do make a request to the ranomuser api
    // In the docs I found that I can use the 'results' as a query string
    // to set a limit on the amount of random users I want for this
    // project we need 12 users
    function requestRandomUsers(callback) {
        $.ajax({
            url: 'https://randomuser.me/api/?results=12',
            dataType: 'json',
            success: function (data) {
                var response = data.results;
                callback(response);
            }
        });
    }

    //I forgot how to use a callback pattern with ajax:
    // https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call/14220323#14220323?newreg=8eafe58d038840dcb9cf8920995f83f9
    requestRandomUsers(buildUserCard);

    function resetModal() {
        $('.modal-info-container').remove();
        $('.modal-container').hide();
    };

    function triggerClickOnCard(number) {
        console.log(number);
    }

    $('#modal-close-btn').click(function() {
        resetModal();
    });

    $('#modal-prev').click(function(event){
        triggerClickOnCard(event.target.dataset.prev);
    });

    $('#modal-next').click(function(event){
        triggerClickOnCard(event.target.dataset.next);
    });
}); // end ready
