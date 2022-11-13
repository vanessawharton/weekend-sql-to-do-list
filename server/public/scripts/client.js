console.log( 'js' );

$( document ).ready( function(){
    console.log( 'JQ' );

  // Establish Click Listeners
    setupClickListeners();

  // load existing tasks on page load
    getTasks();

}); // end doc ready

function setupClickListeners() {
    $('#viewTasks').on('click', '.priorityButton', markPriority);
    $('#viewTasks').on('click', '.doneButton', completeTask);
    $('#viewTasks').on('click', '.deleteButton', deleteTask);
    $( '#addButton' ).on( 'click', function(){
    console.log( 'in addButton on click' );

    // get user input and put in an object
    let taskToSend = {
        name: $( '#nameIn' ).val(),
        priority: $( '#priorityIn' ).val(),
    };

    // call saveTask with the new object
    saveTask( taskToSend );
}); 

  //click listener for filter field
    $('#inputFilter').on('keyup', getFilteredTask);
}

function getTasks(){
    console.log( 'in getTasks' );

  // ajax call to server to get tasks
    $.ajax({
    method: 'GET',
    url: '/tasks'
    })
    .then(function (response) {
        console.log('AJAX GET successful');
        console.log(response.rows);
        renderTable(response.rows);
    })
    .catch(function (error) {
        console.log('error', error);
    })
} // end getTasks

function saveTask( newTask ){
    console.log( 'in saveTask', newTask );
    
    if (!checkInputs(newTask)) { // if this function returns false,
        return false; // fail input.
    }

        $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
        }).then(function(response) {
            console.log('Response from server.', response);
            $('#nameIn').val('');
            $('#priorityIn').val('');

            getTasks();
        }).catch(function(error) {
            console.log('Error in POST', error)
            alert('Unable to add task at this time. Please try again later.');
        });
}  // end saveTask

function checkInputs(newTask) {
    let inputs = Object.values(newTask); 

    // if any input is empty:
    if (inputs.some((e) => e == '')) {
        alert('All inputs are required.');
        return false; 
    }
    else { return true } 
} // end checkInputs

function markPriority () {
    console.log('Marking Task as Priority/Not');
    const id = $(this).data('id');
    const priorityStatus = $(this).data('priority');


    $.ajax({
        method: 'PUT',
        url: '/tasks/' + id,
        data: {
        priority: priorityStatus
        }
    })
    .then(function() {
        getTasks();
    })
    .catch(function(error) {
        alert('Uh oh! Error!', error);
    })
} // end markPriority

function completeTask () {
    console.log('Marking Task as Complete/Not');
    const id = $(this).data('id');
    const doneStatus = $(this).data('complete');

    $.ajax({
        method: 'PUT',
        url: '/tasks/complete/' + id,
        data: {
        complete: doneStatus
        }
    })
    .then(function() {
        getTasks();
    })
    .catch(function(error) {
        alert('Uh oh! Error marking complete!', error);
    })
} // end completeTask


function deleteTask (){
    const taskId = $(this).data('id');
    console.log('Deleting Task', taskId);

    //add in sweetAlert, .ifConfirmed, then proceed
    swal({
        title: "Are you sure you want to delete this task?",
        icon: 'warning',
        buttons: true,
    })
    .then(function(result) {
        if (result === true) {
            console.log('in deleteTask and is confirmed', result.isConfirmed)

            swal("All gone! Isn't that a neat magic trick?", {
                icon: 'success',
            });
            $.ajax({
            method: 'DELETE',
            url: `/tasks/remove/${taskId}`
            })
            .then(function() {
            getTasks();
            })
            .catch(function(error) {
            alert(`Oh no! We couldn't delete this task!, error: ${error}`);
            });
        } else {
            console.log('in cancel delete button')
            swal("Not to worry. Your task is still on the list.");
            return false;
        };
    });  
} // end deleteTask


// below function does get API request on keyup from input filter field
function getFilteredTask() {
    const searchValue = $('#inputFilter').val();

    // if blank input, refresh DOM and skip this function
    if (searchValue == '') {
        getTasks();
        return false;
    };

    $.ajax({
        type: 'GET',
        url: '/tasks/' + searchValue
    }).then(function (response) {

        console.log('get /filter/:search response', response);
        renderTable(response);
    }).catch(function (error) {
        alert('error getting filtered data', error);
    });
};

// show task table on the DOM
function renderTable (tasks) {
    $('#viewTasks').empty();

    const buttonStatus = {
        true: 'Priority',
        false: 'Not Priority'
    }

    const doneStatus = {
        true: 'Completed',
        false: 'Incomplete'
    }

    for (let task of tasks) {
        $('#viewTasks').append(`
        <tr class = "${(task.complete) === true ? 'cross-out' : 'cross-in'}">
            <td>${task.name}</td>
            <td>${task.priority}</td>
            <td>
            <button class="priorityButton" data-id="${task.id}" data-priority="${task.priority}">${buttonStatus[task.priority]}</button>
            </td>
            <td>${task.complete}</td>
            <td>
            <button class="doneButton" data-id="${task.id}" data-complete="${task.complete}">${doneStatus[task.complete]}</button>
            <td id = "dateComplete"></td>
            <td>
            <button class="deleteButton" data-id="${task.id}">Delete</button>
            </td>
        </tr>
        `);
    };
} // end renderTable