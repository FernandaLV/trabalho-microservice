// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/sprints',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(projectId, name, description) {
            let ajax_options = {
                type: 'POST',
                url: 'api/sprints',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'name': name,
                    'description': description,
                    'projectId': projectId
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(name, description, timestamp_end) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/sprints/' + name,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'description': description,
                    'timestamp_end': timestamp_end
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(name) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/sprints/' + name,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $projectId = $('#projectId'),
        $name = $('#name'),
        $description = $('#description'),
        $end_sprint = $('#end_sprint');

    // return the API
    return {
        reset: function() {
            $projectId.val('');
            $name.val('');
            $description.val('').focus();
            $end_sprint.prop("checked", false);
        },
        update_editor: function(projectId, name, description, timestamp_end) {
            $projectId.val(projectId);
            $name.val(name);
            $description.val(description).focus();
            if (timestamp_end != '') {
                $end_sprint.prop("checked", true);
            } else {
                $end_sprint.prop("checked", false);
            }
        },
        build_table: function(sprint) {
            let rows = ''

            // clear the table
            $('.conteudo table > tbody').empty();

            // did we get a people array?
            if (sprint) {
                for (let i=0, l=sprint.length; i < l; i++) {
                    rows += `<tr><td class="projectId">${sprint[i].projectId}</td><td class="name">${sprint[i].name}</td><td class="description">${sprint[i].description}</td><td>${sprint[i].timestamp_start}</td><td class="timestamp_end">${sprint[i].timestamp_end}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $projectId = $('#projectId'),
        $name = $('#name'),
        $description = $('#description'),
        $end_sprint = $('#end_sprint');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(projectId, name, description) {
        return projectId !== "" && name !== "" && description !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let name = $name.val(),
            description = $description.val(),
            projectId = $projectId.val();

        e.preventDefault();

        if (validate(projectId, name, description)) {
            model.create(projectId, name, description)
        } else {
            alert('Problema com os parâmetros: projeto, nome ou descrição');
        }
    });

    $('#update').click(function(e) {
        let name = $name.val(),
            description = $description.val();

        if ($end_sprint.prop('checked') == true) {
            var currentdate = new Date(); 
            var timestamp_end = currentdate.getFullYear() + "-" 
                        + (currentdate.getMonth()+1)  + "-" 
                        + currentdate.getDate() + " "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
        } else {
            timestamp_end = '';
        }

        e.preventDefault();

        if (validate('placeholder', name, description)) {
            model.update(name, description, timestamp_end)
        } else {
            alert('Problema com os parâmetros: nome ou descrição');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let name = $name.val();

        e.preventDefault();

        if (validate('placeholder', name)) {
            model.delete(name)
        } else {
            alert('Problema com os parâmetros: nome');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        //location.reload();
        //model.read();
        window.location.reload();
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            projectId,
            name,
            description,
            timestamp_end;

        projectId = $target
            .parent()
            .find('td.projectId')
            .text();

        name = $target
            .parent()
            .find('td.name')
            .text();

        description = $target
            .parent()
            .find('td.description')
            .text();

        timestamp_end = $target
            .parent()
            .find('td.timestamp_end')
            .text();

        view.update_editor(projectId, name, description, timestamp_end);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = "Msg de Erro:" + textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
