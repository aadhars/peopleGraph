//module 
define(["require", "exports", "VSS/Authentication/Services"], function (require, exports, Services) {
    return {
        workItemObjects: [],
        getWorkItemData: function (url) {
            var deferred = $.Deferred();
            var that = this;
            $.ajax({

                url: url,

                type: "GET",

                contentType: "application/json",

                success: function (workItemDetails) {

                    //console.log(c.dashboardEntries);

                    deferred.resolve(workItemDetails);

                },

                error: function (e) {

                    //TelemetryClient.getClient().trackException(e.response);

                }

            });

            deferred.promise().then(function (workItemDetails) {
                //Convert to JSON to extract link wise data
                let workItemObject = {
                    "url": workItemDetails.url,
                    "id": workItemDetails.id,
                    "name": workItemDetails.fields["System.Title"],
                    "type": workItemDetails.fields["System.WorkItemType"],
                    "events": []
                }

                //Get updates data
                $.ajax({
                    url: workItemDetails._links.workItemUpdates.href,

                    type: "GET",

                    contentType: "application/json",

                    success: function (workItemUpdates) {

                        //console.log(c.dashboardEntries);
                        workItemUpdates.value.forEach(function (workItemUpdateValue) {
                            let workItemEvent = "WorkItemEvent";
                            if (workItemUpdateValue.fields["System.State"]) {
                                if (workItemUpdateValue.fields["System.State"].newValue === "Closed") {
                                    workItemEvent = "WorkItemCompletedEvent";
                                }
                            }
                            let reason = workItemUpdateValue.fields["System.Reason"];
                            if (reason) {
                                //IF reason exists, then only capture the event, else ignore the event
                                workItemObject.events.push({
                                    "type": workItemEvent,
                                    "startTime": workItemUpdateValue.fields["System.ChangedDate"].newValue,
                                    "name": reason.newValue,
                                    "url": workItemDetails.url
                                });
                            }
                        });

                        that.workItemObjects.push(workItemObject);
                        console.log(that.workItemObjects);
                    },

                    error: function (e) {


                    }
                });

            });
        },

        dataLoader: function () {
            var deferred = $.Deferred();
            //Get the Access token from SDK
            let authTokenManager = Services.authTokenManager;
            VSS.getAccessToken().then(function (token) {
                //Get bearer token
                let header = authTokenManager.getAuthorizationHeader(token);
                $.ajaxSetup({

                    headers: { 'Authorization': header }

                });

                var collectionUri = VSS.getWebContext().collection.uri;
                var apiURL = collectionUri + VSS.getWebContext().project.id + "/" + VSS.getWebContext().team.id + "/_apis/wit/wiql?api-version=1.0";
                var postData = { "query": `SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.AssignedTo] = @me AND [System.WorkItemType] IN ("Task", "User Story") AND [State] IN ("Active", "Closed")` };

                console.log(apiURL);
                $.ajax({

                    url: apiURL,

                    type: "POST",

                    contentType: "application/json",

                    data: JSON.stringify(postData),

                    success: function (c) {

                        deferred.resolve(c.workItems);

                    },

                    error: function (e) {
                    }

                });

            });

            var that = this;
            deferred.promise().then(function (workItems) {
                //Convert to JSON to extract link wise data
                workItems.forEach(function (workItem) {
                    that.getWorkItemData(workItem.url);
                }, this);

            });
        },
        showData: function (serverData) {
            var container = document.getElementById('visualization');

            var data = convertDataToVISData(serverData);



            // Options

            var options = {

                width: '100%',

                margin: {

                    item: 20

                },

                orientation: {

                    axis: "top"

                },

                stack: false

            };



            // Timeline

            var timeline = new vis.Timeline(container, data.items, data.groups, options);

        }
    };
}
);
