function getClassName(eventType) {



    if (eventType === "WorkItemEvent") {

        return "workitem-request-bar circle-of-death";

    }

    else if (eventType === "PullRequestedEvent") {

        return "pull-request-bar circle-of-death";

    }

    else if (eventType === "WorkItemCompletedEvent") {

        return "workitem-request-bar circle-of-death";

    }

}



function addMinutes(date, minutes) {
    var dateObject = new Date(date);
    return new Date(dateObject.getTime() + minutes * 60000);

}



function convertDataToVISData(data) {



    var groups = new vis.DataSet();

    var items = new vis.DataSet();



    var startIndex = 0;



    for (var index = 0; index < data.length; index++) {

        groups.add({ id: data[index].id, content: data[index].name });



        var events = data[index].events;

        // Sort events by start time.
        events.sort(function(a, b) {
            return new Date( a.startTime ) > new Date( b.startTime );
        });

        var firstEvent = events[0];

        var endTime = data[index].endTime ? data[index].endTime : getTodayLastTime();
        // if (true || events[events.length - 1].type === "WorkItemCompletedEvent") {
        //     endTime = addMinutes(events[events.length - 1].startTime, 0);
        // }

        items.add({

            id: startIndex++,

            group: data[index].id,

            content: '',

            start: firstEvent.startTime,

            end: endTime,

            className: "workitem-container"

        });



        for (var eIndex = 0; eIndex < events.length; eIndex++) {



            var event = events[eIndex];



            items.add({

                id: startIndex++,

                group: data[index].id,

                content: getContentData(event.type),

                title: getTitleHtml(event.type, event, data[index].name),

                start: event.startTime,

                end: addMinutes(event.startTime, 30),

                className: getClassName(event.type)

            });

        }

    }



    items = getMettingSchedules(items);

    // items.add(...schedules);
    return {

        items: items,

        groups: groups

    }

}



function getMettingSchedules(items) {



    //  var items = new vis.DataSet();
    var date = new Date();


    items.add({

        id: "A",

        content: "Team Scrum",

        type: "background",

        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0, 0),

        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 11, 30, 0)

    });



    items.add({

        id: "B",

        content: "Bug Bash",

        type: "background",

        start: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 30, 0),

        end: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 30, 0)

    });

    return items;

}

function getTodayLastTime(){
    var date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()+1);
}

function getContentData(eventType, url) {

    if (eventType === "WorkItemEvent" || eventType === "WorkItemCompletedEvent") {

        return "W";

    }

    else if (eventType === "PullRequestedEvent") {

        return "P";

    }

}



function getTitleHtml(eventType, event, workitemName) {



    if (eventType === "WorkItemEvent" || eventType === "WorkItemCompletedEvent") {

        var html = '<div class="workitem-card">'+ 

                       '<div class="workitem-card-name">'+workitemName + '</div>'+

                       '<div class="workitem-card-event-type">Event:'+ event.name + '</div>'+

                     '</div>'  

        return html;

    }

    else {

        return event.name;

    }



}



function getMockDataSet() {

    return [

        {

            id: 1,

            url: "http://www.mseng.visualstudio.com",

            name: "Task Item 1",

            type: "Task",

            events: [

                {

                    type: "WorkItemEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 1 created",

                    startTime: new Date(2017, 7, 25, 10, 0, 0)

                },

                {

                    type: "WorkItemEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 1 move to in progress",

                    startTime: new Date(2017, 7, 25, 10, 30, 0)

                },

                {

                    type: "PullRequestedEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "Pull request 1 created",

                    startTime: new Date(2017, 7, 25, 12, 0, 0)

                },

                {

                    type: "PullRequestedEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "pull request 1 completed",

                    startTime: new Date(2017, 7, 25, 15, 0, 0)

                },

                {

                    type: "WorkItemEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 1 completed",

                    startTime: new Date(2017, 7, 25, 18, 0, 0)

                },



            ]

        },

        {

            id: 2,

            url: "http://www.mseng.visualstudio.com",

            name: "Task Item 2",

            type: "Task",

            events: [

                {

                    type: "WorkItemEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 2 created",

                    startTime: new Date(2017, 7, 25, 9, 0, 0)

                },

                {

                    type: "WorkItemEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 2 move to in progress",

                    startTime: new Date(2017, 7, 25, 9, 30, 0)

                },

                {

                    type: "PullRequestedEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "Pull request 2 created",

                    startTime: new Date(2017, 7, 25, 11, 0, 0)

                },

                {

                    type: "PullRequestedEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "pull request 2 completed",

                    startTime: new Date(2017, 7, 25, 14, 0, 0)

                },

                {

                    type: "WorkItemCompletedEvent",

                    url: "http://www.mseng.visualstudio.com",

                    name: "User story 2 completed",

                    startTime: new Date(2017, 7, 25, 17, 0, 0)

                },

            ]

        }

    ];

}