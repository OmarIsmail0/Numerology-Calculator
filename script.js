function normalize_char(number) {
  return String.fromCharCode(number).toUpperCase();
}

let _type;
let _vaild;

(function ($) {
  $.fn.caret = function (pos) {
    var target = this[0];
    var isContentEditable = target.contentEditable === "true";
    //get
    if (arguments.length == 0) {
      //HTML5
      if (window.getSelection) {
        //contenteditable
        if (isContentEditable) {
          target.focus();
          var range1 = window.getSelection().getRangeAt(0),
            range2 = range1.cloneRange();
          range2.selectNodeContents(target);
          range2.setEnd(range1.endContainer, range1.endOffset);
          return range2.toString().length;
        }
        //textarea
        return target.selectionStart;
      }
      //IE<9
      if (document.selection) {
        target.focus();
        //contenteditable
        if (isContentEditable) {
          var range1 = document.selection.createRange(),
            range2 = document.body.createTextRange();
          range2.moveToElementText(target);
          range2.setEndPoint("EndToEnd", range1);
          return range2.text.length;
        }
        //textarea
        var pos = 0,
          range = target.createTextRange(),
          range2 = document.selection.createRange().duplicate(),
          bookmark = range2.getBookmark();
        range.moveToBookmark(bookmark);
        while (range.moveStart("character", -1) !== 0) pos++;
        return pos;
      }
      //not supported
      return 0;
    }
    //set
    if (pos == -1) pos = this[isContentEditable ? "text" : "val"]().length;
    //HTML5
    if (window.getSelection) {
      //contenteditable
      if (isContentEditable) {
        target.focus();
        window.getSelection().collapse(target.firstChild, pos);
      }
      //textarea
      else target.setSelectionRange(pos, pos);
    }
    //IE<9
    else if (document.body.createTextRange) {
      var range = document.body.createTextRange();
      range.moveToElementText(target);
      range.moveStart("character", pos);
      range.collapse(true);
      range.select();
    }
    if (!isContentEditable) target.focus();
    return pos;
  };
})(jQuery);

function add_symbol(code, callback, i) {
  if (code == 121 || code == 89) {
    ask_y(callback, i);
  } else if ((code >= 65 || code <= 90) && (code >= 97 || code <= 122)) callback(normalize_char(code), i);
}

function ask_y(callback, i) {
  var wait_timer_ask = setInterval(function () {
    if ($("#name").css("display") != "none") {
      clearInterval(wait_timer_ask);
      $("#notify").show();
      $("#name").hide();
      var wait_timer = setInterval(function () {
        if (window.y_or_Y != undefined) {
          callback(window.y_or_Y, i);
          window.y_or_Y = undefined;
          clearInterval(wait_timer);
        }
      }, 100);
    }
  }, 100);
}

$(document).ready(function () {
  window.y_list = [];

  if (typeof $.cookie("type") == "undefined") $.cookie("type", "chald");
  _type = "chald";
  //else
  //$('#email_cont').show();

  $("#data input").val("");
  $("#data input").attr("disabled", "true");
  $("#name").removeAttr("disabled");
  $("#birthdate").removeAttr("disabled");
  var type = $.cookie("type");
  if (type == "pyth") {
    $('input[name="small"]').show();
    $("#switch").html("to Chaldean");
    $("#title").html("Pythagorean");
  } else {
    $('input[name="small"]').hide();
    $("#switch").html("to Pythagorean");
    $("#title").html("Chaldean");
  }

  $("#switch").click(function () {
    $("#vowels").val("");
    $("#consonant").val("");
    $("#number_total").val("");
    $("#vowels_total").val("");
    $("#total").val("");
    $("#desc_content").html("");
    $("#desc").hide();
    $("#stat").html("");
    if ($.cookie("type") == "chald") {
      $.removeCookie("type");
      $.cookie("type", "pyth");
      $('input[name="small"]').show();
      $("#title").html("Pythagorean");
      $("#switch").html("to Chaldean");
      $("#calculate").click();
    } else {
      $.removeCookie("type");
      $('input[name="small"]').hide();
      $.cookie("type", "chald");
      $("#title").html("Chaldean");
      $("#switch").html("to Pythagorean");
      $("#calculate").click();
    }
  });

  $("#name").keypress(function (event) {
    if (event.which != 8) {
      add_symbol(event.which, function (chr, i) {
        $("#name").val($("#name").val() + chr);
      });
      event.preventDefault();
    }
  });

  $("#clear").click(function () {
    $("#name").val("");
    $("#total").val("");
    $("#vowels").val("");
    $("#consonant").val("");
    $("#vowels_total").val("");
    $("#consonant_total").val("");
    $("#number_total").val("");
  });

  $("#name").bind("paste", function (event) {
    var text_before = $("#name").val();
    var code = 0;

    var caret_before = $(this).caret();

    setTimeout(function () {
      var text = $("#name").val();
      var caret_after = caret_before + text.length - text_before.length;
      // Removing pasted text, because it should be parsed
      // Validating symbols
      console.log(caret_before, caret_after);
      if (
        caret_before >= caret_after ||
        text_before.slice(0, caret_before).valueOf() != text.slice(0, caret_before).valueOf()
      ) {
        caret_before = 0;
        caret_after = text.length;
      }

      for (var i = caret_before; i < caret_after; i++) {
        code = text[i].charCodeAt(0);
        add_symbol(
          code,
          function (chr, i) {
            var new_t = $("#name").val();
            $("#name").val(new_t.slice(0, i) + chr + new_t.slice(i + 1, new_t.length));
          },
          i
        );
      }
      // 100 delay before taking new  value. Just according to standard.
    }, 100);
  });

  $("#as_vowel").click(function () {
    window.y_or_Y = "Y";
    $("#notify").hide();
    $("#name").show();
  });

  $("#as_consonant").click(function () {
    window.y_or_Y = "y";
    $("#notify").hide();
    $("#name").show();
  });
});

var calculate_chald = function (valid) {
  var name = $("#name").val();
  if (name.length != 0) {
    $.post(
      "http://www.professionalnumerology.com/desc_chald.php",
      { name: name },
      function (output) {
        $("#vowels").val(output.vowels);
        $("#consonant").val(output.consonant);
        $("#total").val(output.summ);
        $("#number_desc").html(output.description_number);
        $("#desc_content").html(output.description);
        var number = $("#name")
          .val()
          .replace(/[^A-Za-z]/gi, "").length;
        $("#stat").html(
          "You entered: " +
            $("#name")
              .val()
              .replace(/[^A-Za-z\s]/gi, "") +
            "<br>There are " +
            number +
            " letters in your name.<br>" +
            "Those " +
            number +
            " letters total to " +
            output.summ +
            "<br>" +
            "There are " +
            output.vowels.replace(/\s+/g, "").length +
            " vowels and " +
            output.consonant.replace(/\s+/g, "").length +
            " consonants in your name."
        );
        $("#stat").fadeIn();
        $("#desc").fadeIn();
        if (!valid) {
          $("#email_cont").fadeIn();
        }
      },
      "json"
    );
  } else {
    $("#data input").val("");
  }
};

var calculate_pyth = function (valid) {
  var name = $("#name").val();
  if (name.length != 0) {
    $.post(
      "http://www.professionalnumerology.com/desc_pyth.php",
      { name: name },
      function (output) {
        $("#vowels").val(output.vowels);
        $("#consonant").val(output.consonant);
        $("#total").val(output.summ);
        $("#number_total").val(output.summ_total);
        $("#desc_content").html(output.description);
        $("#vowels_total").val(output.vowels_total);
        $("#number_desc").html(output.description_number);
        $("#consonant_total").val(output.consonant_total);
        var number = $("#name")
          .val()
          .replace(/[^A-Za-z]/gi, "").length;
        $("#stat").html(
          "You entered: " +
            $("#name")
              .val()
              .replace(/[^A-Za-z\s]/gi, "") +
            "<br>There are " +
            number +
            " letters in your name.<br>" +
            "Those " +
            number +
            " letters total to " +
            output.summ +
            "<br>" +
            "There are " +
            output.vowels.replace(/\s+/g, "").length +
            " vowels and " +
            output.consonant.replace(/\s+/g, "").length +
            " consonants in your name."
        );
        $("#stat").fadeIn();
        $("#desc").fadeIn();
        if (!valid) $("#email_cont").fadeIn();
      },
      "json"
    );
  } else {
    $("#data input").val("");
  }
};

function processCookie() {}

var isemail = function (email) {
  var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
};

var makevalid = function () {
  $.cookie("valid", 1, { expires: 365 });
  $("#email_cont").hide();
  $("#desc").fadeIn();
};

document.addEventListener("DOMContentLoaded", function () {
  // Life Path Number calculation function
  function calculateLifePathNumber(birthDate) {
    const [year, month, day] = birthDate.split("-").map(Number);

    const reduceToSingleDigit = (num) => {
      let steps = [];

      while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        steps.push(num);
        num = num
          .toString()
          .split("")
          .reduce((sum, digit) => sum + Number(digit), 0);
      }
      steps.push(num);

      return { final: num, steps: steps };
    };

    const reducedDay = reduceToSingleDigit(day);
    const reducedMonth = reduceToSingleDigit(month);
    const reducedYear = reduceToSingleDigit(year);

    const totalSum = reducedDay.final + reducedMonth.final + reducedYear.final;
    const lifePathResult = reduceToSingleDigit(totalSum);

    return {
      lifePathNumber: lifePathResult.final,
      dayReduction: reducedDay,
      monthReduction: reducedMonth,
      yearReduction: reducedYear,
      totalSum: totalSum,
      totalReductionSteps: lifePathResult.steps,
    };
  }

  // Event listener for the calculate button
  document.getElementById("calculateButton").addEventListener("click", function () {
    const birthDate = document.getElementById("birthdate").value;
    if (birthDate) {
      console.log(birthDate);
      const result = calculateLifePathNumber(birthDate);

      // document.getElementById("birthDay").value = `${result.dayReduction.final}`;
      // document.getElementById("birthDays_total").value = result.dayReduction.steps
      //   .map((step, index, array) => {
      //     return index === array.length - 1 ? step : step + " / ";
      //   })
      //   .join("");

      // document.getElementById("birthMonth").value = `${result.monthReduction.final}`;
      // document.getElementById("birthMonths_total").value = result.monthReduction.steps
      //   .map((step, index, array) => {
      //     return index === array.length - 1 ? step : step + " / ";
      //   })
      //   .join("");

      // console.log(result);
      // document.getElementById("birthYear").value = `${result.yearReduction.final}`;
      // document.getElementById("birthYears_total").value = result.yearReduction.steps
      //   .map((step, index, array) => {
      //     return index === array.length - 1 ? step : step + " / ";
      //   })
      //   .join("");

      // document.getElementById("birthTotal").value = `${result.totalSum}`;
      // document.getElementById("birthTotals_total").value = result.totalReductionSteps
      //   .map((step, index, array) => {
      //     return index === array.length - 1 ? step : step + " / ";
      //   })
      //   .join("");

      const resultContainer = document.getElementById("birthdate_desc");

      var type = $.cookie("type");

      if (type == "pyth") {
        resultContainer.innerHTML = `
            <div >
                <p><strong>Your Life Path is:</strong> ${result.lifePathNumber}</p>
                <p><strong>Your Attitude is:</strong> ${result.monthReduction.final}</p>
                <p><strong>Your Birth Number is:</strong> ${result.dayReduction.final}</p>
                <br />
            </div>
          `;
      } else {
        resultContainer.innerHTML = `
        <div>
            <p><strong>Your Karmic Number is:</strong> ${result.lifePathNumber}</p>
            <p><strong>Your Birth Number is:</strong> ${result.dayReduction.final}</p>
            <br />
        </div>
      `;
      }
    } else {
      document.getElementById("result").innerText = "Please select a birthdate.";
    }
  });
});

// Event listener for the button click
document.getElementById("calculateButton").addEventListener("click", () => {
  const birthDate = document.getElementById("birthdate").value;

  if (birthDate) {
    const lifePathNumber = calculateLifePathNumber(birthDate);
    document.getElementById("result").textContent = `Your Life Path Number is: ${lifePathNumber}`;
  } else {
    document.getElementById("result").textContent = "Please select a birthdate.";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Event listener for the "keydown" event on the "name" input field
  document.getElementById("name").addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      var valid = getCookie("valid");
      var type = getCookie("type");

      document.getElementById("email_cont").style.display = "block";
      if (type === "chald" || typeof type === "undefined") {
        calculate_chald(valid);
      } else {
        calculate_pyth(valid);
      }
    }
  });

  document.getElementById("switch").addEventListener("click", function () {
    var type = getCookie("type");
    console.log(type);
    if (type != "pyth") document.getElementById("title__calcuation").textContent = "Pythagorean";
    else document.getElementById("title__calcuation").innerHTML = "Chaldean";
  });

  // Event listener for the "click" event on the "calculate" button
  document.getElementById("calculate").addEventListener("click", function () {
    var valid = getCookie("valid");
    var type = getCookie("type");

    document.getElementById("email_cont").style.display = "block";
    if (type === "chald" || typeof type === "undefined") {
      calculate_chald(valid);
    } else {
      calculate_pyth(valid);
    }
  });

  // Helper function to get a cookie value by name
  function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
