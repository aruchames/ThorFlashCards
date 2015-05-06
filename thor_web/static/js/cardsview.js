
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

  $(document).on('click','.card', function (e) {
      front = $(this).find('.front');
      back = $(this).find('.back');
      card = $(this);

      front.toggle();
      back.toggle();
      card.toggleClass('flipped');
  });

  $('.zoom-btn').click(function() {
    var frontText = $(this).parent().find('.card-front').text();
    var backText = $(this).parent().find('.card-back').text();

    $('#ModalFront').show();
    $('#ModalBack').hide();

    $('#ModalFront').text(frontText);
    $('#ModalBack').text(backText);
    $('.card').removeClass('flipped');

    $('#ViewModal').modal('toggle');
  });

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
	  var numCards = $(".deck-app-text").text().split(" ")[0];
	  numCards = numCards - 1;
	  $(".deck-app-text").text(numCards + " cards");
          card.hide("slide", { direction: "left" }, 300);
      }
    })
  });

});
