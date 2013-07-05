/*
 * Javascript code for the application
 * 
 */

var mapdata = null;
var cachedData = null;
var currentBusinessData = null;
var apikey = "AIzaSyApZUme2o9nlqwirFOxzIdGY3HyNGxmqtA";
/**
 * Fetch the details of a place/business. This function is called before user
 * navigates to details page
 * 
 * @param {Object}
 *          reference
 */
function fetchDetails(entry) {
  currentBusinessData = null;
  $.mobile.showPageLoadingMsg();
  var detailsUrl = "https://maps.googleapis.com/maps/api/place/details/json?reference="
      + entry.reference
      + "&sensor=true&key=" + apikey;
  $("#name").html("");
  $("#address").html("");
  $("#phone").html("");
  $("#rating").html("");
  $("#homepage").attr("href", "");
  $.getJSON(detailsUrl, function(data) {
    if (data.result) {
      currentBusinessData = data.result;
      isFav(currentBusinessData, function(isPlaceFav) {
        console.log(currentBusinessData.name + " is fav " + isPlaceFav);
        if (!isPlaceFav) {
          $("#add").show();
          $("#remove").hide();
        } else {
          $("#add").hide();
          $("#remove").show();
        }
        $("#name").html(data.result.name);
        $("#address").html(data.result.formatted_address);
        $("#phone").html(data.result.formatted_phone_number);
        $("#rating").html(data.result.rating);
        $("#homepage").attr("href", data.result.url);
        
      });
    }
  }).error(function(err) {
    console.log("Got Error while fetching details of Business " + err);
  }).complete(function() {
    $.mobile.hidePageLoadingMsg();
  });
  $("#homepage").on("tap", function() {
    console.log("Tap that to: " + $(this).attr("href"));
    navigator.app.loadUrl($(this).attr("href"), { openExternal:true });
    return false;
  })
  
}
// -------------------------------
/**
 * Called to initiate Map page
 */

function plotMarkers() {
  $(cachedData.results).each(
      function(index, entry) {
        console.log("index : " + index);

        $('#map_canvas').gmap(
            'addMarker',
            {
              'position' : new google.maps.LatLng(entry.geometry.location.lat,
                  entry.geometry.location.lng),
              'animation' : google.maps.Animation.DROP
            });
      });
}

function initiateMap() {
    $('#map').on("pageshow", function() {
      console.log("refreshing map");
      $('#map_canvas').gmap('refresh');
    });
    
    $("#map").on(
      "pageinit",
      function() {
        try {
         console.log("mapdata: " + mapdata[0]);
          $('#map_canvas').gmap({
                'center' : mapdata,
                'zoom' : 13
              });
          $('#map_canvas').gmap('refresh');
          plotMarkers();
          console.log("Map initialized");
        } catch (err) {
          console.log("Got error while initializing map " + err);
        }
      });
}
// --------------------------------------------------------------------------------
/**
 * Called to bind the "Add to Favorite" Button
 */
function initiateFavButton() {
  $("#removefav").click(
      function() {
        try {
          if (currentBusinessData != null) {
            removeFromFavorite(currentBusinessData);
            $("#add").show();
            $("#remove").hide();
          }
        } catch (err) {
          console.log("Got Error while removing " + currentBusinessData.name
              + " error " + err);
        }
      });
  $("#addfav").click(
      function() {
        try {
          if (currentBusinessData != null) {
            addToFavorite(currentBusinessData);
            $("#add").hide();
            $("#remove").show();
          }
        } catch (err) {
          console.log("Got Error while adding " + currentBusinessData.name
              + " error " + err);
        }
      });
}
// --------------------------------------------------------------------------------------
/**
 * Called each time before user navigates to Favorites
 */
function initiateFavorites() {
  $("#fav").on(
      "pagebeforeshow",
      function() {
        var db = window.openDatabase("Favorites", "1.0", "Favorites", 200000);
        try {
          db.transaction(function(tx) {
            tx.executeSql('SELECT * FROM Favorite', [], function(tx, results) {
              $("#fav-list").html("");
              if (results != null && results.rows != null) {
                for ( var index = 0; index < results.rows.length; index++) {
                  var entry = results.rows.item(index)
                  var htmlData = "<a href=\"#details\" id=\"" + entry.reference
                      + "\"><img src=\"" + entry.icon
                      + "\" class=\"ui-li-icon\"></img><h3>&nbsp;" + entry.name
                      + "</h3><p><strong>&nbsp;vicinity:" + entry.vicinity
                      + "</strong></p></a>";
                  var liElem = $(document.createElement('li'));
                  $("#fav-list").append(liElem.html(htmlData));
                  $(liElem).bind("tap", function(event) {
                    event.stopPropagation();
                    fetchDetails(entry);
                    return true;
                  });
                }
                $("#fav-list").listview('refresh');
              }
            }, function(error) {
              console.log("Got error fetching Favorites " + error.code + " "
                  + error.message);
            });
          });
        } catch (err) {
          console.log("Got error while reading Favorites " + err);
        }
      });
}
// --------------------------------------------------------------------------------
/**
 * Ensure we have the table before we use it
 * 
 * @param {Object}
 *          tx
 */
function ensureTableExists(tx) {
  tx
      .executeSql('CREATE TABLE IF NOT EXISTS Favorite (id unique, reference, name,address,phone,rating,icon,vicinity)');
}
// -----------------------------------------------------------------------
/**
 * Add current business data to Favorite
 * 
 * @param {Object}
 *          data
 */
function addToFavorite(data) {
  var db = window.openDatabase("Favorites", "1.0", "Favorites", 20000000);
  db
      .transaction(
          function(tx) {
            ensureTableExists(tx);
            var id = (data.id != null) ? ('"' + data.id + '"') : ('""');
            var reference = (data.reference != null)
                ? ('"' + data.reference + '"')
                : ('""');
            var name = (data.name != null) ? ('"' + data.name + '"') : ('""');
            var address = (data.formatted_address != null) ? ('"'
                + data.formatted_address + '"') : ('""');
            var phone = (data.formatted_phone_number != null) ? ('"'
                + data.formatted_phone_number + '"') : ('""');
            var rating = (data.rating != null)
                ? ('"' + data.rating + '"')
                : ('""');
            var icon = (data.icon != null) ? ('"' + data.icon + '"') : ('""');
            var vicinity = (data.vicinity != null)
                ? ('"' + data.vicinity + '"')
                : ('""');
            var insertStmt = 'INSERT INTO Favorite (id,reference, name,address,phone,rating,icon,vicinity) VALUES ('
                + id
                + ','
                + reference
                + ','
                + name
                + ','
                + address
                + ','
                + phone + ',' + rating + ',' + icon + ',' + vicinity + ')';
            tx.executeSql(insertStmt);
          }, function(error) {
            console.log("Data insert failed " + error.code + " "
                + error.message);
          }, function() {
            console.log("Data insert successful");
          });

}
// ----------------------------------------------------------------------------------
/**
 * Remove current business data from Favorite
 * 
 * @param {Object}
 *          data
 */
function removeFromFavorite(data) {
  try {
    var db = window.openDatabase("Favorites", "1.0", "Favorites", 20000000);
    db.transaction(function(tx) {
      ensureTableExists(tx);
      var deleteStmt = "DELETE FROM Favorite WHERE id = '" + data.id + "'";
      console.log(deleteStmt);
      tx.executeSql(deleteStmt);
    }, function(error) {
      console.log("Data Delete failed " + error.code + " " + error.message);
    }, function() {
      console.log("Data Delete successful");
    });
  } catch (err) {
    console.log("Caught exception while deleting Favorite " + data.name);
  }
}
// --------------------------------------------------------------------
/**
 * 
 * @param {Object}
 *          reference
 * @return true if place is Favorite else false
 */
function isFav(data, callback) {
  var db = window.openDatabase("Favorites", "1.0", "Favorites", 200000);
  try {
    db
        .transaction(function(tx) {
          ensureTableExists(tx);
          var sql = "SELECT * FROM Favorite where id='" + data.id + "'";
          tx
              .executeSql(
                  sql,
                  [],
                  function(tx, results) {
                    var result = (results != null && results.rows != null && results.rows.length > 0);
                    callback(result);
                  }, function(tx, error) {
                    console.log("Got error in isFav error.code =" + error.code
                        + "error.message = " + error.message);
                    callback(false);
                  });
        });
  } catch (err) {
    console.log("Got error in isFav " + err);
    callback(false);
  }
}
// -------------------------------------------------------------------------------
/**
 * Binding Search button handler to go and fetch place results
 */
function initiateSearch() {
  $("#search")
      .click(
          function() {
            try {
              $.mobile.showPageLoadingMsg();
              navigator.geolocation
                  .getCurrentPosition(
                      function(position) {
                        var radius = $("#range").val() * 1000;
                        mapdata = new google.maps.LatLng(
                            position.coords.latitude, position.coords.longitude);
                        var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="
                            + position.coords.latitude
                            + ","
                            + position.coords.longitude
                            + "&radius="
                            + radius
                            + "&name="
                            + $("#searchbox").val()
                            + "&sensor=true&key=" + apikey ;
                        console.log("url : " + url);
                        $.getJSON(
                                url,
                                function(data) {
                                  cachedData = data;
                                  $("#result-list").html("");
                                  try {
                                    $(data.results)
                                        .each(
                                            function(index, entry) {
                                              console.log("entry --" + entry);
                                              var htmlData = "<a href=\"#details\" id=\""
                                                  + entry.reference
                                                  + "\"><img src=\""
                                                  + entry.icon
                                                  + "\" class=\"ui-li-icon\"></img><h3>&nbsp;"
                                                  + entry.name
                                                  + "</h3><p><strong>&nbsp;vicinity:"
                                                  + entry.vicinity
                                                  + "</strong></p></a>";
                                              var liElem = $(document
                                                  .createElement('li'));
                                              $("#result-list").append(
                                                  liElem.html(htmlData));
                                              $(liElem).bind("tap",
                                                  function(event) {
                                                    event.stopPropagation();
                                                    fetchDetails(entry);
                                                    return true;
                                                  });
                                            });
                                    $("#result-list").listview('refresh');
                                  } catch (err) {
                                    console
                                        .log("Got error while putting search result on result page "
                                            + err);
                                  }
                                  //$.mobile.changePage("list");
                                  $.mobile.hidePageLoadingMsg();
                                })
                            .error(
                                function(xhr, textStatus, errorThrown) {
                                  console
                                      .log("Got error while fetching search result : xhr.status="
                                          + xhr.status);
                                }).complete(function(error) {
                              $.mobile.hidePageLoadingMsg();
                            });
                      }, function(error) {
                        console.log("Got Error fetching geolocation " + error);
                      });
            } catch (err) {
              console.log("Got error on clicking search button " + err);
            }
          });
}
// --------------------------------------------------------------

function bind() {
  initiateMap();
  initiateFavorites();
  initiateSearch();
  initiateFavButton();
}
// ---------------------------------------------------

// -------------------------

