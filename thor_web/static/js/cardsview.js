
function getCookie(c_name) {
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start != -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start,c_end));
    }
  }
  return "";
}

$(document).ready(function() {
  var pk = $("#deckId").val();
  var url = "/api/decks/" + pk;

  $("#DeleteButton").click(function() {
    $.ajax({
      "url": url,
      "method": "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken")
      },
      success: function() {
        window.location.replace("/decks/");
      },
      error: function(jq) {
        console.log(jq);
      }
    })
  });

  $(".del-card-btn").click(function(e) {
    var cardpk = this.id.substring(3);
    var card = $(this).parent();
    var url = "/api/cards/" + cardpk;
    $.ajax({
      "url": url,
      "method": "DELETE",
      headers: {
        "X-CSRFToken": getCookie("csrftoken")
      },
      success: function() {
        card.hide("slide", { direction: "left" }, 300);
      }
    })
  });

});
