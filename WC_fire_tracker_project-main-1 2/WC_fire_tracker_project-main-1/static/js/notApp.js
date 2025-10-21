let slideIndex = 1,
  showWelcome = 0;
function add_loader() {
  $("#loading_indicator").length <= 0 &&
    $("body").prepend('<div style="" id="loading_indicator"></div>');
}
function removeLoader() {
  $("#loading_indicator").fadeOut(1e3, function () {
    $("#loading_indicator").remove();
  });
}
function search_for_evid(e) {
  add_loader(),
    app.findList("full"),
    console.log("GET EQ From Server", e),
    com.eqinfo(e).then(function (o) {
      console.log("here is the info eq for id ", e, o);
      var t = new list({ type: "search", tabs: [o] }),
        n = $("#searchlist .list-overf");
      t.getlist().forEach((e, o) => {
        n.append(app.createEQbox2(evids[e]));
      }),
        $("body").trigger("loaded"),
        $(".c_" + e)
          .first()
          .click(),
        removeLoader();
    });
}
function copyToClipboard(e) {
  if (window.clipboardData && window.clipboardData.setData)
    return clipboardData.setData("Text", e);
  if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var o = document.createElement("textarea");
    (o.textContent = e),
      (o.style.position = "fixed"),
      document.body.appendChild(o),
      o.select();
    try {
      return document.execCommand("copy");
    } catch (t) {
      return console.warn("Copy to clipboard failed.", t), !1;
    } finally {
      document.body.removeChild(o);
    }
  }
}
function plusSlides(e) {
  showSlides((slideIndex += e));
}
function currentSlide(e) {
  showSlides((slideIndex = e));
}
function showSlides(e) {
  let o,
    t = document.getElementsByClassName("welcome_slides"),
    n = document.getElementsByClassName("dot_slides");
  for (
    e > t.length && (slideIndex = 1), e < 1 && (slideIndex = t.length), o = 0;
    o < t.length;
    o++
  )
    t[o].style.display = "none";
  for (o = 0; o < n.length; o++)
    n[o].className = n[o].className.replace(" active_dot", "");
  slideIndex - 1 >= 0 && (t[slideIndex - 1].style.display = "block"),
    slideIndex - 1 >= 0 && (n[slideIndex - 1].className += " active_dot");
}
function getXhr() {
  var e = null;
  if (window.XMLHttpRequest) e = new XMLHttpRequest();
  else if (window.ActiveXObject)
    try {
      e = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (o) {
      e = new ActiveXObject("Microsoft.XMLHTTP");
    }
  else e = !1;
  return e;
}
function hide_element_by_class_name(e, o) {
  var t = document.getElementsByClassName(e);
  for (i = 0; i < t.length; i++) t[i].id !== o && (t[i].style.display = "none");
}
function show_element_by_class_name(e, o) {
  var t = document.getElementsByClassName(e);
  for (i = 0; i < t.length; i++)
    t[i].id !== o && (t[i].style.display = "block");
}
function show_hide_element(e, o, t, n) {
  hide_element_by_class_name(o, e);
  var a = document.getElementById(e),
    s = document.getElementById(t);
  if ("none" === a.style.display || "" === a.style.display)
    (a.style.display = "block"), "level1" === o && $(".header h1").text(n);
  else if (((a.style.display = "none"), "level1" === o)) {
    var r = n.split("/");
    Array.isArray(r) && (n = r[0]),
      console.info("hide_element" + n),
      $(".header h1").text(n);
  }
  s.scrollIntoView({ block: "start", behavior: "smooth", inline: "nearest" });
}
function log_donate(e, o, t) {
  var n = "0";
  t && (n = "1"), console.log("send info to PaypalMobile V2");
  var a = getXhr();
  a.open("post", "/webapp/callingPaypal.php", !1),
    a.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
    a.send("amount=" + escape(e) + "&comm=" + escape(o) + "&withname=" + n),
    (document.getElementById("encrypted").value = a.responseText);
}
function isGPSLocationAvailable() {
  return !!(
    "object" == typeof app &&
    app.device.hasOwnProperty("coord") &&
    app.device.coord.accuracy &&
    (app.device.coord.hasOwnProperty("lat") ||
      app.device.coord.hasOwnProperty("lon"))
  );
}
function log_geolocation_acceptation(e, o, t) {
  $.ajax({
    type: "POST",
    url: "https://m.emsc.eu/webapp/log_geolocV2.php",
    data: { accept: t, ssid: o, origin: e },
    success: function (n) {
      console.log(
        "success on logging address accept=" + t + "&ssid=" + o + "&origin=" + e
      );
    },
  });
}
function validate(e) {
  var o = parseInt($('#donate input[name="don"]:checked').val());
  if ((0 == o && (o = parseFloat($("#dona").val())), o < 1 || isNaN(o))) {
    alert("You must contribute at least 1 €");
    return;
  }
  $("#amount").val(o),
    log_donate(document.getElementById("amount").value, "", !1);
}
function convertActualCoordToPosition(e) {
  return {
    coords: { latitude: e.lat, longitude: e.lon, accuracy: e.accuracy },
    timestamp: e.timestamp,
  };
}
function GPSLocIsOld() {
  return (
    !("object" == typeof app && app.device.hasOwnProperty("coord")) ||
    (console.log(
      "Loc old:",
      app.device.coord.timestamp < Date.now() - EmscConfig.coord.maxtime,
      app.device.coord.timestamp,
      Date.now() - 6e5
    ),
    app.device.coord.timestamp < Date.now() - EmscConfig.coord.maxtime)
  );
}
function sendLocation(e, o) {
  var t = window.localStorage.getItem("wsid");
  null === t && (t = "");
  var n = !0,
    a = GPSLocIsOld();
  !a && e.coords.accuracy >= app.device.coord.accuracy && (n = !1),
    console.log(
      "SendLocation - " +
        JSON.stringify(e) +
        " - tosend" +
        n +
        " - old_location" +
        a +
        " not force" +
        (!0 !== o)
    );
  var s = app.device.isNewapp;
  if (!1 != n || !0 === o) {
    var r = e.coords.latitude,
      l = e.coords.longitude,
      c = e.coords.accuracy,
      d = e.timestamp;
    console.log(
      "SendLocation - OK to send wsid=" +
        t +
        "&firstuse=" +
        s +
        "&lat=" +
        r +
        "&lon=" +
        l +
        "&accuracy=" +
        c +
        "&timestamp=" +
        d
    ),
      $.ajax({
        type: "POST",
        url: "/webapp/send_locationV2.php",
        data: {
          wsid: t,
          firstuse: s,
          lat: r,
          lon: l,
          accuracy: c,
          timestamp: d,
          "url ": window.location.href,
        },
        success: function (e) {
          console.log("success on sending geolocation " + t + " lat " + r);
        },
        error: function (e, o, n) {
          console.log(
            "error on sending geolocation on " +
              t +
              JSON.stringify(e, null, 4) +
              " - status: " +
              o +
              " - error: " +
              JSON.stringify(n, null, 4)
          );
        },
      });
  }
}
function log_address_error(e, o, t, n, a, s) {
  $.ajax({
    type: "POST",
    url: "/webapp/log_addressLocationRequestV2.php",
    data: {
      uuid_mobile: e,
      value_address: o,
      status: t,
      output_counter: n,
      postfilter_counter: a,
      error: s,
    },
    success: function (t) {
      console.log("success on logging address " + e + " value_address " + o);
    },
    error: function (o, t, n) {
      console.log(
        "error on logging address on " +
          e +
          JSON.stringify(o, null, 4) +
          " - status: " +
          t +
          " - error: " +
          JSON.stringify(n, null, 4)
      );
    },
  });
}
function log_welcome_choice(e, o) {
  var t = Date.now();
  $.ajax({
    type: "POST",
    url: "/webapp/log_welcome_choice.php",
    data: { uuid_mobile: e, choice: o, date_evt: t },
    success: function (n) {
      console.log(
        "success on logging address " + e + " choice " + o + "date_evt" + t
      );
    },
    error: function (o, t, n) {
      console.log(
        "error on logging address on " +
          e +
          JSON.stringify(o, null, 4) +
          " - status: " +
          t +
          " - error: " +
          JSON.stringify(n, null, 4)
      );
    },
  });
}
function log_questio_error(e, o, t) {
  $.ajax({
    type: "POST",
    url: "/webapp/log_questioErrorV2.php",
    data: { uuid_mobile: e, type_error: o, detail_message_value: t },
    success: function (t) {
      console.log("success on logging questio " + e + " type_error " + o);
    },
    error: function (o, t, n) {
      console.log(
        "error on logging questio on " +
          e +
          JSON.stringify(o, null, 4) +
          " - status: " +
          t +
          " - error: " +
          JSON.stringify(n, null, 4)
      );
    },
  });
}
function geosearch() {
  let e = document.getElementById("address");
  var o = e.value;
  e.value = o.trim();
  let t = document.getElementById("city");
  if (!t.reportValidity()) return;
  var n = t.value;
  console.log(n);
  let a = document.getElementById("state");
  var s = a.value;
  let r = document.getElementById("zip");
  var l = r.value;
  let c = document.getElementById("country");
  if (c.reportValidity()) {
    var d = c.value,
      u = [];
    null != o && "" != o && u.push(o),
      null != n && "" != n && u.push(n),
      null != s && "" != s && u.push(s),
      null != l && "" != l && u.push(l),
      null != d && "" != d && u.push(d);
    var p = u.join(", ");
    console.log(p),
      console.log(JSON.stringify({ address: p }, null, "    ")),
      (document.getElementById("location_result").innerHTML = "Please wait! "),
      getLocations(p, function (e) {
        console.log("getLocations=>" + e), (auMoinUn = !1);
        var o = 0,
          t = 0,
          n = [],
          a = "",
          s = JSON.parse(e);
        document.getElementById("location_result").innerHTML = "";
        for (var r = []; s[0][o]; )
          console.log(r),
            console.log(
              ">Processs Address API value for index " +
                o +
                " - " +
                JSON.stringify(s[0][o], null, "    ")
            ),
            (location[o] = {}),
            null != s[0][o].city
              ? (location[o].city = s[0][o].city)
              : null != s[0][o].town
              ? (location[o].city = s[0][o].town)
              : null != s[0][o].village
              ? (location[o].city = s[0][o].village + " (Village)")
              : null != s[0][o].county &&
                (location[o].city = s[0][o].county + " (County)"),
            null != s[0][o].country && (location[o].country = s[0][o].country),
            (location[o].state = ""),
            null != s[0][o].state && (location[o].state = s[0][o].state),
            (location[o].sub_state = ""),
            null != s[0][o].sub_state &&
              (location[o].sub_state = s[0][o].sub_state),
            (location[o].lat = s[0][o].lat),
            (location[o].lon = s[0][o].lon),
            (new_entry =
              "city" +
              location[o].city +
              "region" +
              location[o].state +
              "country" +
              location[o].country),
            console.log(" address index => " + new_entry),
            null === location[o].city || null === location[o].country
              ? (console.log(
                  "Reject-- Address API value for index " +
                    o +
                    " - " +
                    JSON.stringify(location[o], null, "    ") +
                    " => Empty value for 'pays' or 'ville'!! "
                ),
                o++)
              : -1 !== r.indexOf(new_entry)
              ? (console.log(
                  "Reject-- Address API value for index " +
                    o +
                    " - " +
                    JSON.stringify(location[o], null, "    ") +
                    o +
                    "=> Already exist!!"
                ),
                o++)
              : (r.push(new_entry),
                (data_location = location[o]),
                console.log(
                  "OK to display - Address API value for index " +
                    o +
                    " - " +
                    JSON.stringify(location[o], null, "    ") +
                    " concat : " +
                    r
                ),
                (n[t] = data_location),
                createRes(data_location, t, p),
                (auMoinUn = !0),
                o++,
                t++);
        t > 0 && (a = JSON.stringify(n)),
          auMoinUn ||
            ((document.getElementById("location_result").innerHTML =
              "No location found. Please, enter a new location such as 'city, country'."),
            console.log("No return address location !!"),
            $("#user_address").addClass("blinkborder")),
          console.log(
            app.device._UUID +
              " => JSON QUESTIO: " +
              JSON.stringify(app.device, null, "    ") +
              " - JSON GEO RESP: " +
              a
          ),
          log_address_error(app.device._UUID, p, e.whole_address_str, o, t, a);
      });
  }
}
function getErrorMessage(e, o, t) {
  return 0 === e
    ? "Not connect. Verify Network."
    : 404 == e
    ? "Requested page not found. [404]"
    : 500 == e
    ? "Internal Server Error [500]."
    : "parsererror" === o
    ? "Requested JSON parse failed."
    : "timeout" === o
    ? "Time out error."
    : "abort" === o
    ? "Ajax request aborted."
    : "Uncaught Error. " + t;
}
function getAddressDisplay(e) {
  return (
    (value = "  " + e.city + ", "),
    null != e.sub_state && (value = value + e.sub_state + ", "),
    null != e.state && (value = value + e.state + ", "),
    (value += e.country)
  );
}
function createRes(e, o, t) {
  console.log("createRes" + e + "index " + o);
  var n,
    a = document.getElementById("location_result");
  ((n = document.createElement("input")).type = "radio"),
    (n.id = "A" + o),
    (n.className = "setbradio"),
    (n.name = "result_address"),
    (n.value = JSON.stringify(e)),
    (n.onclick = function () {
      var e = JSON.parse(this.value);
      (document.getElementById("city").value = e.city),
        (document.getElementById("country").value = e.country),
        (document.getElementById("region").value = e.state),
        (document.getElementById("sub_region").value = e.sub_state),
        (document.getElementById("lat_address").value = e.lat),
        (document.getElementById("lon_address").value = e.lon),
        setUserLocation(
          t,
          e.lat,
          e.lon,
          e.city,
          e.country,
          e.state,
          e.sub_state
        ),
        $("#bt_felt").trigger("click"),
        console.log(
          " Selected Userlocation" +
            JSON.stringify(app.device.coord, null, "    ")
        );
    }),
    a.appendChild(n),
    a.appendChild(document.createTextNode(getAddressDisplay(e))),
    a.appendChild(document.createElement("br"));
}
function getLocations(e, o) {
  (com.R_locations = function (e) {
    o(e);
  }),
    com.mysend({
      label: "location",
      data: { address: e },
      resp: "R_locations",
    });
}
function setUserLocation(e, o, t, n, a, s, r) {
  (app.device.coord.user_address = e),
    (app.device.coord.lat = parseFloat(o)),
    (app.device.coord.lon = parseFloat(t)),
    (app.device.coord.city = n),
    (app.device.coord.country = a),
    (app.device.coord.sub_region = r),
    (app.device.coord.region = s),
    (app.device.coord.timestamp = Date.now()),
    (app.device.coord.accuracy = null),
    console.log("Send User location", [
      e,
      o,
      t,
      n,
      a,
      s,
      r,
      isGPSLocationAvailable(),
    ]);
}
function setCookie(e, o, t) {
  var n = "";
  if (t) {
    var a = new Date();
    a.setTime(a.getTime() + 864e5 * t), (n = "; expires=" + a.toUTCString());
  }
  document.cookie = e + "=" + (o || "") + n + "; path=/";
}
function getCookie(e) {
  for (
    var o = e + "=", t = document.cookie.split(";"), n = 0;
    n < t.length;
    n++
  ) {
    for (var a = t[n]; " " == a.charAt(0); ) a = a.substring(1, a.length);
    if (0 == a.indexOf(o)) return a.substring(o.length, a.length);
  }
  return null;
}
function redirect_to_classic_site(e) {
  $.ajax({
    type: "POST",
    url: "https://www.emsc-csem.org/ForceOkMobile.php",
    data: { loc: e },
    success: function (o) {
      console.log("success on reaching " + e);
    },
    error: function (o, t, n) {
      console.log(
        "error on reaching " +
          e +
          JSON.stringify(o, null, 4) +
          " - status: " +
          t +
          " - error: " +
          JSON.stringify(n, null, 4)
      );
    },
  });
}
function subscribeToNotifications() {
  let e = document.getElementById("subscribe_distance"),
    o = parseInt(e.value);
  o > 1e3 &&
    ((o = 1e3),
    (e.value = o),
    alert(
      "Maximum observation distance cannot exceed 1000 kilometers. Setting distance to 1000 kilometers."
    )),
    o < 100 &&
      ((o = 100),
      (e.value = o),
      alert(
        "Minimum observation distance cannot be less than 100 kilometers. Setting distance to 100 kilometers."
      )),
    navigator.geolocation.getCurrentPosition(
      function (e) {
        Notification.requestPermission().then((t) => {
          "granted" === t
            ? navigator.serviceWorker.ready.then((t) => {
                t.pushManager
                  .subscribe({
                    userVisibleOnly: !0,
                    applicationServerKey:
                      "BLjltCpzM-g4H_sqBam-HxzTdOCKPbL-CfWFSHaJo2PidWPENIBU-MpRCHum-8qCxyCAqht2r2aowI3eucnTFcI",
                  })
                  .then((t) => {
                    console.log(JSON.stringify(t)),
                      com.mysend({
                        label: "webpush_data_subscribe",
                        data: {
                          subscription: t,
                          location: {
                            latitude: e.coords.latitude,
                            longitude: e.coords.longitude,
                          },
                          distance: o,
                          uuid: app.device._UUID,
                          site: "mobile",
                        },
                      }),
                      alert(
                        "You will now receive notifications about felt seismic event within your observation area!"
                      ),
                      (window.location.href = "");
                  })
                  .catch((e) => {
                    console.error("Error subscribing to notifications:", e),
                      alert(
                        "Error subscribing to notifications. Please try again."
                      ),
                      location.reload();
                  });
              })
            : "denied" === t
            ? alert("You have denied permission to receive notifications.")
            : alert("Notification permission was not granted or denied.");
        });
      },
      function (e) {
        console.error("Error getting geolocation:", e),
          alert(
            "Geolocation permission was not granted or is unavailable. Please enable geolocation to subscribe to notifications."
          );
      }
    );
}
function registerServiceWorker() {
  navigator.serviceWorker
    .register("./webpush_service_worker_LQ.js")
    .then(() => {
      console.log("Service worker registered successfully");
    })
    .catch((e) => {
      console.error("Failed to register service worker:", e);
    });
}
function unsubscribeFromNotifications() {
  navigator.serviceWorker.ready.then((e) => {
    e.pushManager.getSubscription().then((e) => {
      e
        ? e
            .unsubscribe()
            .then((o) => {
              alert("You have been unsubscribed from notifications."),
                com.mysend({
                  label: "webpush_data_unsubscribe",
                  data: { subscription: e },
                }),
                (window.location.href = "");
            })
            .catch((e) => {
              console.error("Unsubscribing failed:", e),
                alert(
                  "Failed to unsubscribe from notifications. Please try again."
                );
            })
        : (console.warn("No subscription found"),
          alert("No subscription found!"));
    });
  });
}
$(document).ready(function () {
  $("head").append(
    '<link rel="stylesheet" href="Css/mob_style.css" type="text/css" />'
  );
  var e = getCookie("cookieConsentMobile"),
    o = new window.URLSearchParams(window.location.search);
  $("body").prepend(
    '<div class="confirm0"><div></div><div><div id="confirmMessage">I wish to continue on the site</div><div><input id="confirmYes" type="button" value="Desktop" /><input id="confirmNo" type="button" value="Mobile" /></div></div></div>'
  );
  let t = { confirm: async (e) => n(e) },
    n = (e) =>
      new Promise((o, t) => {
        $("#confirmMessage").text(e),
          $("#confirmYes").off("click"),
          $("#confirmNo").off("click"),
          $("#confirmYes").on("click", () => {
            $(".confirm0").remove(), o(!0);
          }),
          $("#confirmNo").on("click", () => {
            $(".confirm0").remove(), o(!1);
          }),
          $(".confirm0").show(),
          console.log("LA LA");
      }),
    a = async (e, o) => {
      (e = e || function () {}), (o = o || function () {});
      let n = await t.confirm("I wish to continue on the site");
      n ? e() : o();
    };
  var s = function () {
      var e = $("#channel_info .inf_chs.desktop").parent().attr("href"),
        t = $(
          '<form action="' +
            e +
            '" method="post"><input type="text" name="loc" value="' +
            o.get("urif") +
            '" /></form>'
        );
      $("body").append(t), t.submit();
    },
    r = function () {
      console.log(o.get("urif")),
        o.get("urif").indexOf("/Earthquake_information/earthquake.php?id=") >= 0
          ? (window.history.replaceState(
              {},
              "",
              location.pathname +
                o
                  .get("urif")
                  .replace("/Earthquake_information/earthquake.php", "")
            ),
            (o = new window.URLSearchParams(window.location.search)),
            console.log(window.location.search, o, o.get("id")),
            search_for_evid(o.get("id")))
          : window.history.replaceState({}, "", location.pathname),
        $("body").trigger("hasConsent");
    };
  o.get("urif")
    ? setTimeout(function () {
        a(s, r);
      }, 50)
    : setTimeout(function () {
        $("body").trigger("hasConsent");
      }, 50);
  var l = $(".bt-foot.bt-settings a"),
    c = $(".bt-foot .b_-icsett2"),
    d =
      "object" == typeof app &&
      app.hasOwnProperty("_lang") &&
      app._lang.hasOwnProperty("menu")
        ? app._lang.menu.donate
        : "";
  l.attr("href", "#donate"),
    l
      .find('[data-lng="foot.settings"]')
      .attr("data-lng", "menu.donate")
      .text(d),
    c.attr("class", "donate_icon-24"),
    $('#menu a[href="#sponsor"]').parent().remove(),
    $(
      '<div id="ffeltlocation"><form style="" class="spesc" action="#" method="post"><div data-role="fieldcontain"><span  data-lng="location.text_2">Otherwise, please enter your location manually (such as city, country, etc..).</span><span data-lng="location.text_3">This data is used for scientific purposes only.</span></div><div data-role="fieldcontain"><table class="setb"><tr><td class="right0" style=" text-align: center;"><input type="text" id="address" data-lng-pholder="location.address" placeholder="Street address " ><input type="text" id="city" data-lng-pholder="location.city" placeholder="City*" required><input type="text" id="state" data-lng-pholder="location.state" placeholder="State/ Province/ Region" ><input type="text" id="zip" data-lng-pholder="location.zip" placeholder="ZIP/Postal code" ><input type="text" id="country" data-lng-pholder="location.country" placeholder="Country*" required><br><br><button  type="submit" id="search_button" class="search_location" onclick="geosearch(); return false;"><span data-lng="location.search_button">Find your location</span></button></td></tr></table><input type="hidden" name="city" id="city" placeholder="City" data-local="feelit0.city_placeholder"/><input type="hidden" name="country" id="country" placeholder="Country" data-local="feelit0.co_placeholder"/><input type="hidden" name="region" id="region" /><input type="hidden" name="sub_region" id="sub_region"/><input type="hidden" name="lat_address" id="lat_address" /><input type="hidden" name="lon_address" id="lon_address" /></div><div data-role="fieldcontain" id="location_result"></div><br></form></div>'
    ).insertBefore(".qucomm"),
    $(window).on("load", function () {
      "object" != typeof app.device && (app.device = {}),
        (app.device.packagename = "m2.emsc.eu"),
        (app.device.app_version = "3.0.5"),
        app.device._UUID || ((isNew = !0), app._setNewMyUUID()),
        (app.device.uuid = app.device._UUID);
    }),
    $("body").on("all_listner_load", function () {
      console.log("LA LOAD"),
        $(".b_-icshare")
          .off("click")
          .on("click", function () {
            var e = $("#earthquake").attr("data-id"),
              o = evids[e];
            console.log("share", evids[e]);
            var t = app._lang.eq0 + " M" + o.mag + " " + o.reg,
              n = t + ", " + o.timef + " UTC";
            $("body").trigger("share", [n, t, "https://m.emsc.eu/?id=" + e]);
          });
    }),
    $("body").on("search_id", function () {
      if (o.get("id")) {
        add_loader();
        var e = o.get("id");
        window.history.replaceState({}, "", location.pathname);
        var t = function () {
            console.log("launch check exist evid"), search_for_evid(e);
          },
          n = function () {
            setTimeout(function () {
              "undefined" == typeof com
                ? setTimeout(n, 5)
                : (console.log(" Wait for loading "), com._waited.push(t));
            }, 5);
          };
        n();
      } else {
        add_loader();
        var a = function () {
          setTimeout(function () {
            "undefined" == typeof com
              ? setTimeout(a, 5)
              : com._waited.push(removeLoader);
          }, 5);
        };
        a();
      }
    }),
    $("body").trigger("search_id");
  var u = window.location.hash;
  if (
    document.location.href.indexOf("#earthquake") > -1 ||
    document.location.href.indexOf("#pictures") > -1 ||
    document.location.href.indexOf("#comments") > -1
  ) {
    var p = $(location.hash).attr("data-id");
    void 0 === p &&
      (console.log(
        "hashtag with undefined id=> go home",
        location.hash,
        $(location.hash).attr("data-id")
      ),
      (window.location.href = ""));
  }
  if (document.location.href.indexOf("#maps") > -1) {
    var p = $(location.hash).attr("data-ori");
    void 0 === p &&
      (console.log(
        "hashtag with undefined id=> go home",
        location.hash,
        $(location.hash).attr("data-id")
      ),
      (window.location.href = ""));
  }
  (window.onhashchange = function e() {
    ("#tou" === location.hash ||
      "#pictures" === location.hash ||
      "#faq" === location.hash) &&
      ($("body").prepend('<div style="" id="loading_indicator"></div>'),
      setTimeout(removeLoader, 100),
      console.log("content" + (0 == $.trim($("div.terms").text()).length)));
  }),
    $("#earthquake, #comments, #pictures ").on("beforepageshow", function () {
      var e = $(this).attr("data-id");
      console.log(location.hash, e),
        void 0 === e &&
          (console.log(
            "Pages with undefined id=> go home",
            location.hash,
            $(location.hash).attr("data-id")
          ),
          (window.location.href = ""));
    });
  var u = window.location.hash;
  if (
    ($("#safetycheck").remove(),
    "#safetycheck" == u && (window.location.href = ""),
    "#tou" == u)
  ) {
    var g = function () {
        console.log("launch check com"),
          com.getPage("terms_of_use", function (e) {
            console.log(e.html),
              e.hasOwnProperty("html") && $("#tou").append($(e.html));
          });
      },
      f = function () {
        setTimeout(function () {
          "undefined" == typeof com
            ? setTimeout(f, 5)
            : (console.log(" Wait for loading "), com._waited.push(g));
        }, 5);
      };
    f();
  }
  console.log("cookieConsent" + e),
    $("body").on("hasConsent", function () {
      e || $("body").trigger("cookie_consent");
    }),
    $("body").on("cookie_consent", function () {
      $("body").prepend('<div id="splashscreen" class="fade_out_50"></div>'),
        $("body").prepend(
          '<div class="cookie_container"><table class="cookie_table"><tr><td colspan=2><p data-lng="cookie.description">We use some cookies to ensure you get the best experience on our website.</p><a class="cookie_a" href="webapp/cookiePolicy.php"><span data-lng="cookie.link_text">Learn more!</span></a></td><tr></tr><tr><td width="50%"></td><td align="right"><button class="cookie_button"><span data-lng="cookie.agree_bt">I agree</span></button></td></tr></table></div>'
        ),
        $("body").prepend(
          '<div class="welcome_container" style="display: none;"><div id=\'close_button_welcome\' class=\'close-button\'></div><div class="welcome_head"><h1 data-lng="welcome.title">Welcome</h1></div><table  class="welcome_table"><tr><td><p data-lng="welcome.description">This is the new version of LastQuake!</p><br><br><div align="left"><button class="discover_new_version_button"><span data-lng="welcome.discover_app">Discover the new version</span></button></div><br><br><div align="left"><a class="cookie_a" href="../previous_website/"><button class="back_to_previous_version_button"><span data-lng="welcome.back_to_previous">Back to previous version</span></button></a></div></td><td align="right"><span class="lg_welcome_lastquake"></span></td></tr></table></div>'
        ),
        $("body").prepend(
          '<div class="slideshow-container welcome_row" style="display: none;    "><div  id=\'close_button_slide\' class=\'close-button\'></div><div class="slides"><div class="welcome_slides"><h1 data-lng="welcome.slide1Title">Access to earthquakes list</h1><p data-lng="welcome.slide1TopDescription">The latest significant earthquakes are displayed at the top of your screen. </p><p> <span data-lng="welcome.slide1BottomDescription">To access the full list of earthquakes, click on \'See More\' or on \'Earthquake Lists\'. </span>&nbsp;<span class="icon24 icone_earth" style=""></span>&nbsp;<span class="icon24 icone_bookmark"></span> </p></div><div class="welcome_slides"><h1 data-lng="welcome.slide2Title">Share a testimony</h1><p> <span data-lng="welcome.slide2TopDescription">To share a testimony of an earthquake you\'ve felt, click on the icon "I felt an earthquake"  </span>&nbsp;<span class="lg_felt_report"></span> </p><p data-lng="welcome.slide2BottomDescription">This button is displayed continuously on the Home page. </p></div><div class="welcome_slides"><h1 data-lng="welcome.slide3Title">Save earthquakes</h1><p> <span  data-lng="welcome.slide3TopDescription">You can save earthquakes by clicking on the icon </span>&nbsp;<span class="lg_bookmark"></span>  </p><p data-lng="welcome.slide3BottomDescription">Your saved earthquakes will appear in the "My earthquakes" section. </p></div><div class="welcome_slides"><h1 data-lng="welcome.slide4Title">Search for an earthquake</h1><p> <span  data-lng="welcome.slide4TopDescription">You can now search for earthquakes in the Earthquakes lists by clicking on the icon </span>&nbsp;<span class="icon16 icone_search"></span> </p><p data-lng="welcome.slide4BottomDescription">All you have to do is enter some or all of the parameters. </p></div></div><a class="prev_slide" onclick="plusSlides(-1)">❮</a><a class="next_slide" onclick="plusSlides(1)">❯</a><div class="dot-container"><span class="dot_slides" onclick="currentSlide(1)"></span>  <span class="dot_slides" onclick="currentSlide(2)"></span> <span class="dot_slides" onclick="currentSlide(3)"></span> <span class="dot_slides" onclick="currentSlide(4)"></span></div></div>'
        ),
        $("#splashscreen").show(),
        $(".cookie_container").show(),
        $(".cookie_button").on("click", function () {
          console.log("welcome_activation"),
            $(".cookie_container").remove(),
            showWelcome && $(".welcome_container").show(),
            setCookie("cookieConsentMobile", "1", 365),
            showWelcome ||
              ($(".welcome_container").remove(),
              $(".slideshow-container").remove(),
              $("#splashscreen").hide(1e3),
              $("#splashscreen").remove()),
            console.log("cookieConsent" + getCookie("cookieConsentMobile")),
            $(".discover_new_version_button").on("click", function () {
              var e = $(this).attr("class");
              console.log("welcome " + e),
                log_welcome_choice(app.device._UUID, e),
                $(".welcome_container").remove(),
                $(".slideshow-container").show(),
                showSlides(slideIndex);
              let o = 0,
                t = 0,
                n = document.querySelector(".slides");
              n.addEventListener(
                "touchstart",
                function (e) {
                  o = e.changedTouches[0].screenX;
                },
                !1
              ),
                n.addEventListener(
                  "touchend",
                  function (e) {
                    (t = e.changedTouches[0].screenX) < o && plusSlides(1),
                      t > o && plusSlides(-1);
                  },
                  !1
                ),
                $("#close_button_slide").on("click", function () {
                  console.log("button_slideshow_close"),
                    $(".slideshow-container").remove(),
                    $("#splashscreen").hide(1e3),
                    $("#splashscreen").remove();
                  var e = $(this).attr("id");
                  console.log("welcome " + e),
                    log_welcome_choice(app.device._UUID, e);
                });
            }),
            $(".back_to_previous_version_button").on("click", function () {
              var e = $(this).attr("class");
              console.log("welcome " + e),
                log_welcome_choice(app.device._UUID, e);
            }),
            $("#close_button_welcome").on("click", function () {
              $(".welcome_container").remove(),
                $(".slideshow-container").remove(),
                $("#splashscreen").hide(1e3),
                $("#splashscreen").remove();
              var e = $(this).attr("id");
              console.log("welcome " + e),
                log_welcome_choice(app.device._UUID, e);
            });
        });
    }),
    $("#quest").on("step2", function (e) {
      console.log("felt step2" + JSON.stringify(app.device)),
        log_geolocation_acceptation(
          "#quest step2",
          app.device._UUID,
          isGPSLocationAvailable()
        ),
        app.device.coord.hasOwnProperty("lat")
          ? log_questio_error(app.device._UUID, "LocationInfo.OK", "")
          : log_questio_error(
              app.device._UUID,
              "LocationError.UndefinedLocation",
              "Is GPS activated?" +
                isGPSLocationAvailable() +
                "-locationToSend:" +
                JSON.stringify(app.device, null, "    ") +
                " -GPS Coord: " +
                JSON.stringify(app.device.coord, null, "    ")
            );
    }),
    $("body").on("share", function (e, o, t, n) {
      navigator.share &&
        navigator
          .share({ title: t, text: o, url: n })
          .then(() => console.log(o + t + n + "Successful share"))
          .catch((e) => console.log(o + t + n + "Error sharing", e));
    }),
    $("body").on("askCoord", function (e) {
      var o = arguments[1] || function () {};
      isGPSLocationAvailable() &&
        !GPSLocIsOld() &&
        ((pos = convertActualCoordToPosition(app.device.coord)),
        app.setUserCoords(pos)),
        (!isGPSLocationAvailable() ||
          (GPSLocIsOld() && isGPSLocationAvailable())) &&
          navigator.geolocation &&
          navigator.geolocation.getCurrentPosition(
            function (e) {
              var t = function () {
                app && void 0 !== app.setUserCoords
                  ? (app.setUserCoords(e),
                    o(),
                    console.log("actual position askcoord " + app.device.coord))
                  : setTimeout(function () {
                      t();
                    }, 10);
              };
              t();
            },
            function (e) {
              var o = "";
              switch (e.code) {
                case e.PERMISSION_DENIED:
                  o = "User denied the request for Geolocation.";
                  break;
                case e.POSITION_UNAVAILABLE:
                  o = "Location information is unavailable.";
                  break;
                case e.TIMEOUT:
                  o = "The request to get user location timed out.";
                  break;
                case e.UNKNOWN_ERROR:
                  o = "An unknown error occurred.";
              }
              isGPSLocationAvailable() &&
                ((pos = convertActualCoordToPosition(app.device.coord)),
                app.setUserCoords(pos));
            }
          ),
        "object" == typeof app &&
          log_geolocation_acceptation(
            "askCoord",
            app.device._UUID,
            isGPSLocationAvailable()
          );
    }),
    $("body").on("notifDist", function (e, o) {
      com.ask("notifDist", { mag: o }).then((e) => {
        console.log("Dist", e),
          (EmscConfig.notif = e),
          $("body").trigger("ShowNotifmap");
      });
    }),
    $("body").on("Notifmap", function (e) {
      if ((console.log("ici", app.device.coord), !arguments[1])) {
        $("#NotifMap").hide();
        return;
      }
      if (
        app.device.hasOwnProperty("coord") &&
        app.device.coord.hasOwnProperty("lat")
      ) {
        console.log("la");
        var o = $("#notminmag").val(),
          t = 3;
        o == EmscConfig.notifvals.notminmag && (t = o),
          $("body").trigger("notifDist", [t]);
      }
    }),
    $("body").on("ShowNotifmap", function () {
      $("#NotifMap").remove();
      var e = parseInt($("#notmaxdist").attr("data-km")),
        o = $("#notminmag").val(),
        t = app.device.coord.lat,
        n = app.device.coord.lon;
      $("#profile").append($("<div>", { id: "NotifMap" }));
      var a = new Fredmap("NotifMap", null, [t, n]).addGroup().addMyMarker();
      $("#NotifMap .leaflet-control-container").append(
        $("<div>", {
          class: "rlegend relegend2 ucf",
          "data-lng": "prof.area",
        }).text(app._lang.prof.area)
      );
      var s = 0,
        r = [
          "white",
          "white",
          "white",
          "white",
          "yellow",
          "#FF9633",
          "#FF6433",
          "red",
        ],
        l = [],
        c = 0;
      for (var [d, u] of Object.entries(EmscConfig.notif))
        if (
          (console.log(d, u, EmscConfig.notif[o]),
          e != EmscConfig.notifvals.notmaxdist && u >= e && (u = e),
          o == EmscConfig.notifvals.notminmag || !(u <= EmscConfig.notif[o]))
        ) {
          var p = "M <=" + d;
          o != EmscConfig.notifvals.notminmag && o > c && (c = o),
            (p = c + ">= " + p);
          var g = {
            color: r[d],
            fillColor: r[d],
            fillOpacity: 0.3,
            radius: 1e3 * u,
          };
          if (
            o != EmscConfig.notifvals.notminmag &&
            EmscConfig.notif.hasOwnProperty(o)
          ) {
            (g.innerRadius = 1e3 * EmscConfig.notif[o]),
              console.log(g, o, EmscConfig.notif);
            var f = new L.Donut([t, n], g).bindPopup(p);
          } else var f = L.circle([t, n], g).bindPopup(p);
          l.push(f), s++, (c = d);
        }
      a.addToGroup(l.reverse()), a.goBounds();
    }),
    $("body").on("askFiles", function (e, o) {
      o();
    }),
    $("body").on("save_file", function (e, o, t) {
      $("#inpfiles").trigger("fileReady", [o, o]);
    }),
    $("body").trigger("askCoord"),
    $('a[data-lng="menu.safcheck"]').parent("li").remove(),
    $("#profile #NotifMap").hide(),
    $('#profile h2[data-lng="prof.t21"]').parent("div").hide(),
    $('#profile label[data-lng="prof.tts"]').parents("table.setb").hide(),
    $("body")
      .off("ShowNotifmap")
      .on("ShowNotifmap", function () {}),
    (document.getElementById("lang").onchange = (e) => {
      var o = e.target.value;
      $("#profile .save").show(), console.log(o);
    }),
    ($('#profile input[name="unit"]:checked').onchange = (e) => {
      var o = e.target.value;
      $("#profile .save").show(), console.log(o);
    }),
    ($('#profile input[type="email"]').onchange = (e) => {
      var o = $('#profile input[type="email"]');
      $("#profile .save").show(), console.log(inputText);
      var t = !1;
      "" == $(o).val() ? (t = !0) : $(o).get(0).reportValidity() && (t = !0),
        t && $("#profile .save").show();
    }),
    $("body").on("NoCoord", function () {
      console.log("NoCoord" + JSON.stringify(app.device)),
        $("#ffeltlocation").show(),
        $("#location_result").empty();
    }),
    $("body").on("WithCoord", function () {
      console.log("WithCoord" + JSON.stringify(app.device)),
        $("#ffeltlocation").hide(),
        $("body").trigger("askCoord");
    }),
    $("#donate").on("valid", function (e, o) {
      com.getAny(
        "paypal",
        function (e) {
          $("#encrypted").val(e), $("#fpaypal").submit();
        },
        { amount: o }
      );
    });
});
