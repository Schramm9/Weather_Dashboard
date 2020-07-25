// f34065d01f9e6999f0e3f8b57847b0bc = API key
$(document).ready(function () {
  //*** This code is copyright 2002-2016 by Gavin Kistner, !@phrogz.net
  //*** It is covered under the license viewable at http://phrogz.net/JS/_ReuseLicense.txt
  Date.prototype.customFormat = function (formatString) {
    var YYYY,
      YY,
      MMMM,
      MMM,
      MM,
      M,
      DDDD,
      DDD,
      DD,
      D,
      hhhh,
      hhh,
      hh,
      h,
      mm,
      m,
      ss,
      s,
      ampm,
      AMPM,
      dMod,
      th;
    YY = ((YYYY = this.getFullYear()) + "").slice(-2);
    MM = (M = this.getMonth() + 1) < 10 ? "0" + M : M;
    MMM = (MMMM = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][M - 1]).substring(0, 3);
    DD = (D = this.getDate()) < 10 ? "0" + D : D;
    DDD = (DDDD = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ][this.getDay()]).substring(0, 3);
    th =
      D >= 10 && D <= 20
        ? "th"
        : (dMod = D % 10) == 1
        ? "st"
        : dMod == 2
        ? "nd"
        : dMod == 3
        ? "rd"
        : "th";
    formatString = formatString
      .replace("#YYYY#", YYYY)
      .replace("#YY#", YY)
      .replace("#MMMM#", MMMM)
      .replace("#MMM#", MMM)
      .replace("#MM#", MM)
      .replace("#M#", M)
      .replace("#DDDD#", DDDD)
      .replace("#DDD#", DDD)
      .replace("#DD#", DD)
      .replace("#D#", D)
      .replace("#th#", th);
    h = hhh = this.getHours();
    if (h == 0) h = 24;
    if (h > 12) h -= 12;
    hh = h < 10 ? "0" + h : h;
    hhhh = hhh < 10 ? "0" + hhh : hhh;
    AMPM = (ampm = hhh < 12 ? "am" : "pm").toUpperCase();
    mm = (m = this.getMinutes()) < 10 ? "0" + m : m;
    ss = (s = this.getSeconds()) < 10 ? "0" + s : s;
    return formatString
      .replace("#hhhh#", hhhh)
      .replace("#hhh#", hhh)
      .replace("#hh#", hh)
      .replace("#h#", h)
      .replace("#mm#", mm)
      .replace("#m#", m)
      .replace("#ss#", ss)
      .replace("#s#", s)
      .replace("#ampm#", ampm)
      .replace("#AMPM#", AMPM);
  };
  function retrieveWeather(citySearched) {
    $.ajax({
      type: "GET",
      url:
        "https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?q=" +
        citySearched +
        "&appid=f34065d01f9e6999f0e3f8b57847b0bc&units=imperial",
      dataType: "json",
      success: function (response) {
        prevCities(citySearched);
        getUV(response.coord.lat, response.coord.lon);
        console.log(response);

        let date = new Date(Number(response.dt) * 1000);
        console.log(date.customFormat("#MM#/#DD#/#YY#"));
        // grab values from the responses from website by creating vars
        $("#city").text(
          response.name + "     " + date.customFormat("(#MM#/#DD#/#YY#)")
        );

        $(".icon").html(
          "<img src='http://openweathermap.org/img/w/" +
            response.weather[0].icon +
            ".png' alt='Icon depicting current weather.'>"
        );
      },
    });
  }

  function getUV(lat, lon) {
    $.ajax({
      type: "GET",
      url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&
        exclude=minutely,hourly&appid=f34065d01f9e6999f0e3f8b57847b0bc&units=imperial`,
      dataType: "json",
      success: function (response) {
        console.log(response);
        $("#temp > span").text(response.current.temp.toPrecision(3));
        console.log(response.current.temp.toPrecision(3));
        $("#humidity > span").text(response.current.humidity);
        $("#windSpeed > span").text(response.current.wind_speed.toPrecision(2));
        let uvClass = " ";

        if (response.current.uvi <= 2) uvClass = "btn-success";
        else if (response.current.uvi > 2 && response.current.uvi <= 6)
          uvClass = "btn-warning";
        else if (response.current.uvi > 6 && response.current.uvi <= 7)
          uvClass = "orangeBtn";
        else if (response.current.uvi > 8 && response.current.uvi < 11)
          uvClass = "btn-danger";
        else if (response.current.uvi >= 11) uvClass = "violetBtn";

        $("#uvIndex").text(response.current.uvi).addClass(uvClass);

        console.log(response.current.uvi);

        let date = new Date(Number(response.daily[0].dt) * 1000);
        $("#day1").text(date.customFormat("(#MM#/#DD#/#YY#)"));

        for (let i = 1; i <= 5; i++) {
          let iconImg = $("<img>").attr(
            "src",
            `http://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`
          );
          let cardEl = $("<div>").addClass("card bg-primary text-white"); // make cards as element for 5day
          let cardBodyEl = $("<div>").addClass("card-body");
          let cardTemp = $("<p>")
            .addClass("card-text")
            .text(`Temp: ${response.daily[i].temp.max}`);
          let cardHumidity = $("<p>")
            .addClass("card-text text-left")
            .text(`Humidity: ${response.daily[i].humidity}`);
          let date = new Date(Number(response.daily[i].dt) * 1000); // convert from milliseconds
          let cardTitle = $("<h5>") // header for the date in the title position of the card
            .addClass("card-title")
            .text(date.customFormat("#MM#/#DD#/#YY#"));
          response.daily[i];
          cardBodyEl.append(cardTitle, iconImg, cardTemp, cardHumidity);
          cardEl.append(cardBodyEl);
          $("#forecast5D").append(cardEl);

          console.log(response.daily[i].dt); // Check correctness of cards of 5 day forecast
        }
        console.log(response.daily[0].dt); // make certain of forecast for current day
      },
    });
  }

  function cityHeader() {
    // Makes Header for most recently searched city
    let citySearched = $("<h2 >").text(citySearched);
    // citySearched is city last searched thru ajax call
  }

  // creates a row for the text denoting the "new" city to populate previously searched cities
  function createRow(citySearched) {
    let storedCity = $("<li> ")
      .addClass("list-group-item avoidRepeat list-group-item-action")
      .text(citySearched);
    $("#prevSearches").prepend(storedCity);
  }
  // determines if name of city typed into search field has been searched previously
  function prevCities(citySearched) {
    let allCities = retrieveCities();
    if (allCities.indexOf(citySearched) === -1) {
      allCities.unshift(citySearched);
      createRow(citySearched);
    }

    window.localStorage.setItem("myCities", JSON.stringify(allCities)); // prepare to send to server
  }
  // retrieves cities already used as previous searches for to display weather in that city
  function retrieveCities() {
    let myCities = JSON.parse(window.localStorage.getItem("myCities")) || [];
    $("#prevSearches").empty();
    myCities.forEach((citySearched) => {
      createRow(citySearched);
    });

    return myCities; // cities previously searched if one of those is clicked again- post loading of document
  }
  $("#searchWeather").on("click", function () {
    let citySearched = $("#citySearched").val();
    retrieveWeather(citySearched);
  });
  $("#prevSearches").on("click", "li", function () {
    //console.log($(this).text());
    retrieveWeather($(this).text());
  });
  retrieveCities();
});
