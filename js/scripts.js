$('document').ready(function() {
    // append search template to the search container
    // added an extra button to be able to reset the search
    $('.search-container').html(`
        <button id="reset-btn" class="reset-btn">reset</button>
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" name="name" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="serach-submit" class="search-submit">
        </form>`);

    // append the modal to the body
    // the data is appended later
    $('body').append(`
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
           </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>`);

    // The response data holds a data format which is not user friendly
    // I looked up how I could get parts of a string and finally found the substring method
    function createDob(date) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substring
        const year = date.substring(0, 4);
        const month = date.substring(5, 7);
        const day = date.substring(8, 10);
        return `${year}-${month}-${day}`;
    }

    function addModalData(data) {
        // When a card is clicked build the modal:
        $('.card').click(function(event) {
            // find the closest class called card and store that element
            const clickedCard = event.target.closest('.card');
            // now we can use find (traverses down in the DOM) to find the element
            // with ID name and get the clicked users name, also convert it to lowercase.
            const userName = $(clickedCard).find('#name')[0].innerText.toLowerCase();

            // loop over the data
            $.each(data, function(index, user) {
                // if the clicked userName equals the first and last name use that data to build
                // the modal template
                if (userName === `${user.name.first} ${user.name.last}`) {
                    // call createDob to make the data more user friendly
                    const dob = createDob(user.dob.date);
                    // The modal data template
                    const modalInner = `<div class="modal-info-container">
                                            <img class="modal-img" src=${user.picture.large} alt="profile picture">
                                            <h3 id="name" class="modal-name cap">${user.name.first}</h3>
                                            <p class="modal-text">${user.email}</p>
                                            <p class="modal-text cap">${user.location.city}</p>
                                            <hr>
                                            <p class="modal-text">${user.phone}</p> <!--(555) 555-5555-->
                                            <p class="modal-text">${user.location.street}, ${user.location.city}, ${user.location.postcode}</p>
                                            <p class="modal-text">Birthday: ${dob}</p>
                                        </div>`;

                    // Insert the modal info AFTER the close button
                    // http://api.jquery.com/insertafter/
                    $(modalInner).insertAfter( "#modal-close-btn" );

                    // I'm using the current index of te loop to determine if the next or previous button
                    // should be disabled or enabled.
                    // Also I set a data attribute with an offset of index of 1 for later use
                    // to be able to show the next or previous user

                    // if the index of the current loop minus 1 equals -1 disable the previous button
                    if ((index -1) === -1) {
                        $('#modal-prev').prop('disabled', true);

                    // else enable the button and set an data attribute equal to it's index - 1
                    } else {
                        $('#modal-prev').prop('disabled', false);
                        $('#modal-prev').attr('data-prev', (index - 1));
                    }

                    // if the index of the current loop plus 1 equals 12 disable the next button
                    if ((index + 1) === 12) {
                        $('#modal-next').prop('disabled', true);
                        // else enable the button and set an data attribute equal to it's index + 1
                    } else {
                        $('#modal-next').prop('disabled', false);
                        $('#modal-next').attr('data-next', (index + 1));
                    }

                    // now show the modal container
                    $('.modal-container').show();
                }
            })
        })
    }

    function buildUserCard(data) {
        // declare cards and an empty string to prevent an undefined being printed to the screen
        let cards = '';
        // loop over the data:
        $.each(data, function (index, user) {
            // card template
            const card = `<div class="card">
                            <div class="card-img-container">
                                <img class="card-img" src=${user.picture.large} alt="profile picture">
                            </div>
                            <div class="card-info-container">
                                <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                                <p class="card-text">${user.email}</p>
                                <p class="card-text cap">${user.location.city} ${user.location.state}</p>
                            </div>
                        </div>`;
            // every iteration add the new card to the cards string
            cards += card;
        });

        // when the loop is finished append the cards to the gallery
        $('.gallery').html(cards);

        // ass the cards are now loaded we are ready to append event listeners
        // for the modal
        addModalData(data);
    }

    // Use ajax to do make a request to the randomuser api
    // In the docs I found that I can use the 'results' as a query string
    // to set a limit on the amount of random users I want for this
    // project we need 12 users
    // for the search functionality I added 'nat' to set it to NL
    // So hopefully we get only English alpabeth characters
    // NL = The Netherlands
    // this function has a parameter to be able to do a callback
    function requestRandomUsers(callback) {
        $.ajax({
            url: 'https://randomuser.me/api/?nat=nl&results=12',
            dataType: 'json',
            success: function (data) {
                const response = data.results;
                if (callback) {
                    callback(response);
                } else {
                    return response;
                }
            }
        });
    }

    //I forgot how to use a callback pattern with ajax:
    // https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call/14220323#14220323?newreg=8eafe58d038840dcb9cf8920995f83f9
    // So when this script loads we do the api request and give it the buildUserCard as callback
    // In this way, if needed, we can reuse the requestRandomUsers for other function in the future
    requestRandomUsers(buildUserCard);

    // af function to reset the modal
    // if hideModal is true then also close it
    function resetModal(hideModal) {
        $('.modal-info-container').remove();

        if (hideModal) {
            $('.modal-container').hide();
        }
    }

    // triggerClickOnCard is used to cycle trough the user
    // with the next and previous button
    // it receives 1 argument so it can decide which card should receive the click
    function triggerClickOnCard(number) {
        // convert the number to an actual number
        const cardNumber = Number(number);
        // get all the cards
        const cards = $('.card');

        // if the cardNumber is bigger then -1 but lower then 12 then proceed:
        if (cardNumber > -1 && cardNumber < 12) {
            // call resetModal and pass it the value: false
            // resetModal will now remove the old date
            // but not close the modal
            resetModal(false);
            // trigger a click on the card element on the index which is the cardNumber
            // now the next modalinfo will be loaded
            // and the new info will be appended to the modal
            $(cards[cardNumber]).trigger('click');
        }
    }

    // close the modal when clicked on the close button
    $('#modal-close-btn').click(function() {
        // Give resetModal the value: true
        // so it wil remove the old info
        // and also hide the modal
        resetModal(true);
    });

    // click on the previous button in the modal:
    $('#modal-prev').click(function(event) {
        // in the addModalData function I've placed a data attribute on the button
        // The event target has a key which value is an object with a key which I specified
        // when creating this data attribute: data-prev
        // that key has the value I gave it when adding the data attribute
        // now we can call triggerClickOnCard which will update the data in the modal
        triggerClickOnCard(event.target.dataset.prev);
    });

    $('#modal-next').click(function(event) {
        // in the addModalData function I've placed a data attribute on the button
        // The event target has a key which value is an object with a key which I specified
        // when creating this data attribute: data-next
        // that key has the value I gave it when adding the data attribute
        // now we can call triggerClickOnCard which will update the data in the modal
        triggerClickOnCard(event.target.dataset.next);
    });

    // search-form submit:
    $('form').submit(function(event) {
        // prevent default as the page should not reload
        event.preventDefault();

        // get the user name and set it to lower case
        // I looked this syntax up from a previous assignment: Interactive Forms
        const user_name = $("input[name~='name']").val().toLowerCase();
        // get all elements with the class card-name
        const cardNameElements = $('.card-name');

        // show the reset button
        $('#reset-btn').show();

        // loop over all elements
        $.each(cardNameElements, function(i, nameElement) {
            // name is set to the current elements innerText and transformed to lower case
            let name = nameElement.innerText.toLowerCase();
            // if the name (or some letters) does not match the searched name:
            if (!name.match(user_name)) {
                // get the highest ancestor with the class card
                const card = nameElement.closest('.card');
                // hide this card
                $(card).hide();
            }

        // now if something is left the user will only see that card
        })
    });

    // click search reset button:
    $('#reset-btn').click(function() {
        // get all card elements
        const cardElements = $('.card');
        // hide the reset button
        $('#reset-btn').hide();
        // loop over all card elements
        $.each(cardElements, function(i, card) {
            // show the cards
            $(card).show();
        })
    })
}); // end ready
