$(document).ready(function() {
  /* Input form for front and back of card */
  var frontInput = $('#FrontContent');
  var backInput = $('#BackContent');
  var createButton = $('#CreateButton');

  var successDisplay = $('#SuccessMessage');
  var errorDisplay = $('#ErrorMessage');

  /* Display form for front and back of card */
  var frontOut = $('.frontText');
  var backOut = $('.backText');

  frontInput.keyup(function() {
    var newFront = frontInput.val();

    if (newFront.length > 0) {
      frontOut.text(newFront);
    } else {
      frontOut.text("Term");
    }
  });

  backInput.keyup(function() {
    var newBack = backInput.val();

    if (newBack.length > 0) {
      backOut.text(newBack);
    } else {
      backOut.text("Definition");
    }
  });

  createButton.click(function() {
    /* Hide all alerts first */
    hideAlerts();

    var id = $('#deckId').val();
    var front = frontInput.val();
    var back = backInput.val();


    if (front.length != 0 && back.length != 0) {
      $.ajax({
        url: "/api/cards/",
        method: "POST",
        dataType: "json",
        data: {
          "deck": id,
          "front": front,
          "back": back
        },
        headers: {
          "X-CSRFToken": getCookie("csrftoken")
        },
        success: function(data, status, jq) {
          successDisplay.text("Created card: " + data["front"]);
          successDisplay.show();
          frontInput.val("");
          backInput.val("");

          frontInput.focus();

          $('.flashcard').hide("slide", { direction: "right" }, 300, function() {
            frontOut.text("Term");
            backOut.text("Definition");

            $('.flashcard').show("slide", { direction: "left"}, 200);

          });
        },
        error: function(jq, status, error) {
          errorDisplay.text("Error: " + jq["statusText"]);
          errorDisplay.show();
        }

      });
    }

  });

  /* Helper functions */
  /* Get cookie. From stack overflow */
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

  /* Hide alerts */
  function hideAlerts() {
    successDisplay.hide();
    errorDisplay.hide();
  }
});