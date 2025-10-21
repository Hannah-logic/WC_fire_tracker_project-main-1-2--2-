var com,
  map,
  map2,
  t0,
  hash,
  oldHash,
  confL = [
    { name: "home.signif", id: "signif", liste: "risk" },
    { name: "all.title", id: "full", liste: "full" },
    { name: "home.nearme", id: "nearme", liste: "nearme" },
    { name: "home.myeq", id: "myeqlist", liste: "myeq" },
    { name: "home.searchlist", id: "searchlist", liste: "search" },
  ];
function freports(t) {
  var e = [
      "",
      "rgb(128,128,128)",
      "rgb(191,204,255)",
      "rgb(170,220,255)",
      "rgb(128,255,255)",
      "rgb(122,255,147)",
      "rgb(255,255,0)",
      "rgb(255,200,0)",
      "rgb(255,145,0)",
      "rgb(255,0,0)",
      "rgb(200,0,0)",
    ],
    a = [];
  for (var i in t.tokeep)
    if (t.tokeep[i]) {
      var s = L.circleMarker([t.lat[i], t.lon[i]], {
        radius: 6,
        fillColor: e[t.intensity[i]],
        color: "#000000",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9,
      });
      a.push(s);
    }
  0 == a.length
    ? app.EvidNoReports(
        t.hasOwnProperty("evid")
          ? t.evid
          : t.hasOwnProperty("noid")
          ? t.noid
          : null
      )
    : (map2.addToGroup(a), map2.goBounds(), map2.add_rep_legend(a.length));
}
$(document).ready(function () {
  (void 0 !== EmscConfig && EmscConfig.logger) ||
    (console.log = function () {}),
    console.log("Doc ready"),
    (t0 = Date.now()),
    (window.onerror = function (t, e, a) {
      try {
        com.mysend({ label: "js_error", data: arguments }),
          console.log("Error: " + t + " in " + e + " at line " + a);
      } catch (i) {}
    }),
    $("#bt_felt").attr("class", "bt_felt"),
    $("#list").append($("#bt_felt").clone().attr("id", "bt_felt2"));
  for (var intAgo, maplist, minm = [], i = 0; i < 8; i++)
    minm.push($("<option>", { value: i, text: i }));
  $("#notminmag").append(minm),
    $("#safetymsg0 .safe-b").append($('#home a[href="#settsaftips"]').clone()),
    $('input[type="date"]').attr("max", new Date().toISOString().split("T")[0]);
  var userLang = navigator.language || navigator.userLanguage;
  (app.device.browser_lng = userLang),
    console.log("browser lng", userLang, userLang.substr(0, 2)),
    app._loadConf(),
    setTimeout(function () {
      app.loadLanguage();
    }, 50),
    app.loadAllMyEq(),
    (com = new comm()),
    (map = new Fredmap("gmap")).addRecenter();
  var d,
    tbdi = [];
  [100, 200, 300, 400, 500, 1e3, 1500, 2e3, 5e3].forEach(function (t, e) {
    tbdi.push(
      $("<option>", {
        value: t,
        text: dist.kmTogoodUnit(t) + " " + app._lang.unit[dist.unit],
      })
    );
  }),
    $("#distnearme").append(tbdi),
    $('#distnearme option[value="' + app._nearme + '"]').attr(
      "selected",
      "selected"
    );
  var lists = [],
    l2 = [];
  confL.forEach(function (t, e) {
    console.log(e, t),
      lists.push(
        $("<div>", { id: t.id, class: "list" }).append(
          $("<div>", { class: "list-overf" })
        )
      ),
      l2.push(
        $("<tr>")
          .append($("<td>", { "data-lng": t.name }))
          .append(
            $("<td>").append(
              $("<input>", { type: "radio", value: t.id, name: "eqlist" })
            )
          )
      );
  }),
    $("#eqlistsett .boxcenter2").append($("<table>").append(l2)),
    $("#list .lists").append(lists),
    $("#list").attr("data-li", "signif"),
    $("#searchlist").hide(),
    $("#list").on("setsize", function () {
      console.log("SET SIZE ", arguments);
      var t = $("#list .lists").offset().top,
        e = $("#footer").offset().top;
      console.log("listes", t, $("#list .lists").position().top, e),
        $("#list .lists .list, #list .lists .list-overf").css({
          width: $(".sch2").width(),
          height: e - t,
        }),
        $("#list .lists").css({ height: e - t });
    }),
    $("#list").on("changeTitle", function () {
      confL.every(function (val, key) {
        return (
          console.log(
            "liste posiiton",
            $("#" + val.id).offset().left,
            $("#" + val.id).position().left,
            val.name,
            eval("app._lang." + val.name)
          ),
          !($("#" + val.id).offset().left >= 0) ||
            ($("#eqlistsett").trigger("check_List", val.id),
            $("#list").attr("data-li", val.id),
            $("#list h1")
              .attr("data-lng", val.name)
              .text(eval("app._lang." + val.name)),
            !1)
        );
      });
    }),
    $("#list").on("golist0", function () {
      console.log("GOLISTE0"), $("#" + $(this).attr("data-li")).show();
      var t = $("#" + $(this).attr("data-li")).position().left,
        e = $(this).attr("data-li2");
      void 0 !== e &&
        !1 !== e &&
        ((t = $("#" + e).position().left), $(this).removeAttr("data-li2")),
        t < 0 && (t = 0),
        console.log("scrollTo", t, $(this).attr("data-li")),
        $("#list .sch2").scrollLeft(t),
        $("#list").trigger("changeTitle"),
        setTimeout(function () {
          $("#list").trigger("changeTitle");
        }, 100);
    }),
    $("#list").on("golist", function (t, e) {
      console.log("GOLIST", e, hash),
        $(this).attr("data-li", e),
        "#list" != hash
          ? (window.location.href = "#list")
          : (console.log("list golist0 gotlist0"), $(this).trigger("golist0"));
    }),
    $("body").on("debug", function (t, e) {
      console.log(arguments),
        $("#debug").append($("<p>").text(JSON.stringify(e)));
    }),
    $("body").on("loading", function () {
      $(this).append($("<div>", { class: "floader" }));
    }),
    $("body").on("end-loading", function () {
      $(".floader").remove();
    }),
    $('a[href="#signif"]')
      .attr("href", "javascript:void(0)")
      .on("click", function () {
        $("#list").removeAttr("data-li2").trigger("golist", "signif");
      }),
    $('a[href="#myeqlist"]')
      .attr("href", "javascript:void(0)")
      .on("click", function () {
        $("#list").removeAttr("data-li2").trigger("golist", "myeqlist");
      }),
    $("#list").one("pageshow", function () {
      $(this).trigger("setsize");
    }),
    $("#list").on("pageshow", function () {
      $(".bt-eqs").trigger("click"),
        setTimeout(function () {
          console.log("list page show gotlist0"),
            $("#list").trigger("golist0"),
            $("#list .sch2")
              .off("scrollend scrollstop touchend")
              .on("scrollend scrollstop touchend", function (t) {
                console.log("tend", t.type, t.target, arguments),
                  $("#list").trigger("changeTitle"),
                  setTimeout(function () {
                    $("#list").trigger("changeTitle");
                  }, 100);
              });
        }, 200),
        $("#bt_felt2 .bt_felt_lab").show(),
        $("#bt_felt2").removeClass("reduce"),
        $("#list .list-overf")
          .off("scroll")
          .one("scroll", function (t) {
            console.log("list scroll"),
              $("#bt_felt2 .bt_felt_lab").hide("slow"),
              $("#bt_felt2").addClass("reduce");
          }),
        0 == $("#full").width() && $(this).trigger("setsize");
    }),
    $("#list").on("beforepageleave", function () {
      $(this).attr("data-li2", $(this).attr("data-li"));
    }),
    $(".nav0").on("click", function () {
      window.location.href = "#home";
    }),
    $("body").on("FRscroll_bottom", function () {
      $("#home").one("scroll", function (t) {
        $("#bt_felt .bt_felt_lab").hide("slow"),
          $("#bt_felt").addClass("reduce"),
          $("body").trigger("FRscroll_top");
      });
    }),
    $("body").on("FRscroll_top", function () {
      $("#home")
        .off("scroll")
        .on("scroll", function (t) {
          0 == $(this).scrollTop() &&
            ($("#bt_felt .bt_felt_lab").show("slow"),
            $("#bt_felt").removeClass("reduce"),
            $("body").trigger("FRscroll_bottom"));
        });
    }),
    $("body").trigger("FRscroll_bottom"),
    $("#about").one("beforepageshow", function () {
      console.log("about beforepage"),
        com.getAny("translators", function (t) {
          $("#about").trigger("tranlsators", [t]);
        });
    }),
    $("#about").on("tranlsators", function (t, e) {
      console.log("TRANSLATORS", arguments);
      var a = [];
      for (let [i, s] of Object.entries(e)) {
        var n = [];
        s.forEach(function (t) {
          n.push($("<span>").text(t));
        }),
          a.push(
            $("<div>", { class: "section2" })
              .append($("<span>", { class: "_1 _2" }).text(i))
              .append(n)
          );
      }
      $("#about .section1").append(a);
    }),
    (hash = location.hash),
    (oldHash = ""),
    "" == hash && (hash = "#home"),
    $('[data-role="page"]').not(hash).hide(),
    "#list" == hash &&
      ($("#list").trigger("pageshow"), $(".bt-eqs").trigger("click")),
    "#about" == hash &&
      $("#about").trigger("beforepageshow").trigger("pageshow"),
    $(window).on("hashchange", function (t) {
      if (
        ((hash = location.hash),
        (oldHash = (oldurl = t.originalEvent.oldURL || oldHash).substring(
          oldurl.lastIndexOf("#") + 1
        )),
        "" == hash && (hash = "#home"),
        $(hash).length)
      ) {
        var e;
        $('div[data-role="page"]')
          .not('[style*="display: none"]')
          .trigger("beforepageleave")
          .fadeOut(60, function () {
            console.log(
              new Date().toISOString() + " fadeout " + oldHash + " --> " + hash
            );
            var t = $(this);
            $(hash).trigger("beforepageshow", [oldHash]),
              $(hash).attr("data-head")
                ? ($(".head0 .nav").hide(),
                  $(".head0 ." + $(hash).attr("data-head")).show())
                : ($(".head0 .nav").hide(), $(".head0 .nav0").show()),
              $(hash).fadeIn(60, function () {
                $(this).trigger("pageshow"),
                  $(t).trigger("pageleaveend"),
                  (oldHash = hash);
              }),
              $(this).trigger("pageleave");
          });
      }
    }),
    $(".bt-foot").on("click fredsel", function () {
      console.log("bt-foot click"),
        $(".bt-foot").removeClass("actif"),
        $(this).addClass("actif"),
        $(this).hasClass("bt-settings") && $("#profile").attr("data-head", "");
    }),
    $(".nav1 a").on("click", function () {
      history.back();
    }),
    $("#home").on("beforepageshow", function () {
      $(".bt-home").trigger("fredsel");
    }),
    $("#earthquake,#full,#signif,#myeqlist,#maps").on(
      "beforepageshow",
      function () {
        $(".bt-eqs").trigger("fredsel");
      }
    ),
    $("body").on("loaded", function (t) {
      console.log("Body LOADED");
      var e = Date.now();
      $("#earthquake")
        .off("click.my")
        .on("click.my", ".eqs2 .mag .after", function (t) {
          t.preventDefault(), t.stopPropagation();
          var e = $(t.target);
          if (e.hasClass("after") && e.parent().hasClass("mag")) {
            var a = $(this).parents(".eqs2"),
              i = a.attr("data-id");
            console.log("Save this eq", a, i),
              a.toggleClass("my"),
              app.toggleMy(i);
            return;
          }
        }),
        $("#home,.lists,#maps")
          .off("click.eq")
          .on("click.eq", ".eqs1,.eqs2", function (t) {
            t.preventDefault(),
              t.stopPropagation(),
              console.log(t, t.target, $(t.target), $(t.target).parent());
            var e = $(t.target),
              a = $(this),
              i = a.attr("data-id");
            if (e.hasClass("after") && e.parent().hasClass("mag")) {
              console.log("Save this eq", a, i),
                a.toggleClass("my"),
                app.toggleMy(i);
              return;
            }
            a.hasClass("banner") ||
              (a.find(".mag").hasClass("my") && com.askEq(i),
              $("#earthquake").attr("data-id", i),
              (location.href = "#earthquake"),
              console.log("open earthquake", i));
          }),
        $("#earthquake a.disab")
          .off()
          .on("click", function (t) {
            t.stopPropagation(),
              t.preventDefault(),
              console.log(
                $(this).parents(".eqs"),
                $(this).parents("[data-id]")
              );
            var e = $(this).parents("[data-id]").attr("data-id");
            console.log("ID", e),
              $("#quest").attr("data-id", e),
              $("#bt_felt").trigger("click");
          }),
        $(".banner")
          .off("click.ba")
          .on("click.ba", function (t) {
            t.stopPropagation(), t.preventDefault();
            var e = $(this).attr("data-id");
            console.log("ID", e),
              $("#quest").attr("data-id", e),
              $("#bt_felt").trigger("click");
          }),
        console.log("Body loaded TIME:", Date.now() - e);
    }),
    $("#full").on("loaded", function (t) {
      console.log("Full LOADED"), t.stopPropagation(), t.preventDefault();
    }),
    $(".plist").on("beforepageleave", function () {
      console.log("scroll", $(this).scrollTop(), $(window).scrollTop()),
        $(this).attr("data-scroll", $(window).scrollTop());
    }),
    $(".plist").on("pageshow", function () {
      var t = $(this).find(".list-overf");
      $(t).css({
        height:
          $("#footer").offset().top -
          $(t).offset().top -
          parseFloat($(t).css("padding-top")),
      }),
        console.log("padding", $(t).css("padding-top")),
        $(this).attr("data-scroll") &&
          $(window).scrollTop(parseInt($(this).attr("data-scroll"))),
        console.log("scroll", parseInt($(this).attr("data-scroll")));
    }),
    $(".head0 .menu").on("click", function () {
      $("#menu").show();
    }),
    $(".h1menu,#menu a").on("click", function () {
      $("#menu").hide();
    }),
    $(".popclose").on("click", function () {
      $(this).parents('div[data-role="popup"]').trigger("close").hide();
    }),
    $(".myeq,#myeqlist .list-overf").on("sortByTime", function () {
      var t = $(this).find(".eqs");
      $(this).append(
        $.makeArray(t).sort(function (t, e) {
          return (
            parseFloat($(e).attr("data-time")) -
            parseFloat($(t).attr("data-time"))
          );
        })
      );
    }),
    $("#earthquake").on("beforepageshow", function () {
      var t = $(this).attr("data-id"),
        e = parseFloat($(this).attr("data-topen")) || Date.now();
      if (
        (console.log("topen", e, "diff", Date.now() - e),
        !(
          $(this).attr("data-currentid") == t &&
          Date.now() - e < EmscConfig.cachetime
        ))
      ) {
        $(".safena,.lcheck,.b_-icshare").hide(),
          $(".eqts").remove(),
          $(this).find(".eqs,#mapsim img,#cntcomms,#cntpics").remove(),
          $("#comms,#pics").empty(),
          $(this)
            .find(
              'h2[data-lng="eq.pics"], a[href="#pictures"], a[href="#comments"]'
            )
            .parent()
            .show();
        var a = app.findList("full");
        void 0 === a ||
        ("function" == typeof a.hasid && a.hasid(t)) ||
        app._reloaded.includes(t.toString())
          ? $("#earthquake").trigger("eqdata", evids[t])
          : (console.log("GET EQ From Server", t),
            com.eqinfo(t).then(function (t) {
              console.log(app);
              var e = app.updateMyevid(t);
              $("#earthquake").trigger("eqdata", e);
            }));
      }
    }),
    $("#earthquake").on("eqdata", function (t, e) {
      var a = e.id;
      if (
        (console.log("argus", arguments),
        e.isNoid || $(".b_-icshare").show(),
        $(this).find("h1").text(e.reg),
        $("#earthquake .ideqt").after(
          $(".plist .eqs.c_" + a)
            .first()
            .clone(!0, !0)
            .addClass("eqdetail")
        ),
        $(this).find(".mag").off("click"),
        com.getComms(a, function (t) {
          var i = t.features.length,
            s = t.meta.nb,
            n = parseInt($("#earthquake .nbcomm").attr("data-nbcomm"));
          if (
            (console.log("NB COMMS", i, s, n),
            i != n && app.CorrectEq(a, "comm", n, s),
            (evids[a].comms = t),
            $('h2[data-lng="eq.comms"]').after(
              $('<span id="cntcomms">').text(s)
            ),
            0 == i)
          ) {
            $("#earthquake").find('a[href="#comments"]').parent().hide();
            return;
          }
          $("#cntcomms")
            .off("click")
            .on("click", function () {
              location.href = "#comments";
            });
          for (var o = i < 3 ? i : 2, r = $("#comms"), l = 0; l < o; l++)
            r.append(app.createCommBox(e, t.features[l]));
          $("#earthquake").trigger("readyTranslate");
        }),
        com.getPics(a, function (t) {
          var i = t.features.length,
            s = t.meta && t.meta.nb ? t.meta.nb : i;
          if (
            ((evids[a].pics = t),
            $('h2[data-lng="eq.pics"]').after($('<span id="cntpics">').text(s)),
            0 == i)
          ) {
            $("#earthquake")
              .find('h2[data-lng="eq.pics"], a[href="#pictures"]')
              .parent()
              .hide();
            return;
          }
          $("#cntpics")
            .off("click")
            .on("click", function () {
              location.href = "#pictures";
            });
          for (var n = i < 3 ? i : 2, o = $("#pics"), r = 0; r < n; r++)
            o.append(app.createPicBox(e, t.features[r]));
          console.log("EQ", e);
        }),
        $("#mapsim").append(
          $("<img>", { src: e.getMap("seismicity"), class: "mapsim" })
        ),
        e.hasIntensityMap &&
          $("#mapsim").append(
            $("<img>", { src: e.getMap("intensity"), class: "mapsim" })
          ),
        e.safe_enable && $(".safena").show(),
        e.SafeEnable &&
          ($(".lcheck").show(),
          $(".lcheck")
            .off()
            .on("click", function (t) {
              t.stopPropagation(),
                t.preventDefault(),
                $("#safe-msg")
                  .attr("data-evid", a)
                  .attr("data-info", "M" + e.mag + " " + e.reg),
                $("#safetymsg").trigger("beforepageshow").show();
            })),
        "" != e.tsunami &&
          ["NO", "INFORMATION", "WARNING"].indexOf(e.tsunami) >= 0)
      ) {
        var i = (tr0 = ""),
          s = "",
          n = [];
        for (var o in e.tsunami_links)
          n.push($("<a>", { href: e.tsunami_links[o] }).text(o));
        (s = $("<span>").append(n)),
          "NO" == e.tsunami
            ? ((i = "ts.tsno"), (tr0 = app._lang.ts.tsno))
            : "INFORMATION" == e.tsunami
            ? ((i = "ts.tsinfo"), (tr0 = app._lang.ts.tsinfo))
            : "WARNING" == e.tsunami &&
              ((i = "ts.tswarn"), (tr0 = app._lang.ts.tswarn)),
          $(this)
            .find(".eqs")
            .after(
              $("<div>", { class: "mbox eqts" })
                .append(
                  $("<span>", { class: "eq_ " + app.getEQTsClass(e.tsunami) })
                )
                .append($("<span>", { class: "ti", "data-lng": i }).text(tr0))
                .append(
                  $("<span>", { class: "ucf", "data-lng": "ts.linkptwc" }).text(
                    app._lang.ts.linkptwc
                  )
                )
                .append(s)
            );
      }
    }),
    $("#earthquake").on("pageshow", function () {
      var t = $(this).attr("data-id"),
        e = parseFloat($(this).attr("data-topen")) || Date.now();
      if (
        !(
          $(this).attr("data-currentid") == t &&
          Date.now() - e < EmscConfig.cachetime
        )
      ) {
        $(this).scrollTop(0);
        var a = app.findEq(t, !0);
        if ((console.log(a), a.hasOwnProperty("isNoid"))) {
          var i = a.isNoid ? [0, 0] : [a.lat, a.lon];
          if (
            ((map2 = new Fredmap("fereport_map", null, i).addGroup()),
            a.isSignif && com.fereports(t),
            !a.isNoid)
          ) {
            var s = L.marker([a.lat, a.lon], {
              icon: L.divIcon({ className: "myEpicenter" }),
            }).bindPopup($(app.getPopup(a)).html(), {
              className: "pop_" + a.id,
            });
            map2.addToGroup(s), map2.drawStar("myEpicenter", 15, 15, 10, "red");
          }
          $(this).attr("data-currentid", t).attr("data-topen", Date.now()),
            $("#comments, #pictures").attr("data-id", t),
            $("#mapsim img").on("click", function () {
              var t = $(this).clone();
              $("#piczoom").trigger("open", [
                t,
                "#mapsim",
                ".mapsim",
                $(this).index(),
              ]);
            });
        }
      }
    }),
    $(".b_-icshare").on("click", function () {
      var t = $("#earthquake").attr("data-id"),
        e = evids[t];
      console.log("share", evids[t]);
      var a = app._lang.eq0 + " M" + e.mag + " " + e.reg,
        i = a + ", " + e.timef + " UTC https://m.emsc.eu/?id=" + t;
      $("body").trigger("share", [i, a]);
    }),
    $("#comments").on("orderreverse", function () {
      var t = $("#comments .comment").detach().toArray();
      t.reverse(), $("#allcomm").append(t), console.log("sort comment reverse");
      let e = app._storage.getItem("commOrder") || "";
      var a = e.split(",");
      (a[1] = "asc" == a[1] ? "desc" : "asc"),
        app._storage.setItem("commOrder", a);
    }),
    $("#comments").on("order", function (t, e) {
      console.log(arguments);
      var a = e.indexOf("desc") >= 0 ? "desc" : "asc",
        i = "time";
      e.indexOf("ord_dist") >= 0 && (i = "dist"),
        e.indexOf("ord_note") >= 0 && (i = "note"),
        console.log("order", i, a);
      var s = $("#comments .comment").detach();
      if (
        (console.log("sort comment"),
        s.sort(function (t, e) {
          var a = parseFloat($(e).attr("data-" + i)),
            s = parseFloat($(t).attr("data-" + i));
          return a < s ? 1 : a > s ? -1 : 0;
        }),
        "asc" == a && (s = s.toArray().reverse()),
        $("#allcomm").append(s),
        app._storage.setItem("commOrder", ["ord_" + i, a]),
        "note" == i && "desc" == a)
      ) {
        $("#comments .ord_note").trigger("click");
        return;
      }
    }),
    $("#comments .order span").on("click", function (t) {
      if ($(this).hasClass("actif")) {
        if ($(this).hasClass("asc") && $(this).hasClass("ord_note")) {
          t.stopPropagation();
          return;
        }
        $(this).toggleClass("asc").toggleClass("desc"),
          t.stopPropagation(),
          $("#comments").trigger("orderreverse");
        return;
      }
      $("#comments .actif").removeClass(["actif", "asc", "desc"]),
        $(this).addClass(["actif", "desc"]),
        $("#comments").trigger("order", [$(this).attr("class").split(" ")]);
    }),
    $("#comments").on("pageshow", function () {
      $("#allcomm").css({
        height:
          $("#footer").offset().top -
          $("#allcomm").offset().top -
          parseFloat($("#allcomm").css("padding-top")),
      });
    }),
    $("#comments").on("beforepageshow", function () {
      var t = this,
        e = app._storage.getItem("commOrder");
      console.log(e),
        (e = null == e ? ["ord_time", "desc"] : e.split(",")),
        $("#comments .order span").removeClass(["actif", "desc", "asc"]),
        $("#comments .order ." + e[0]).addClass(["actif", e[1]]);
      var a = $(this).attr("data-id"),
        i = $(this).attr("data-currentid"),
        s = $(this).find(".comment"),
        n = s.length;
      if ((console.log(a, i, "nb:" + n), i != a || !(n > 0))) {
        s.remove();
        var o = app.findEq(a, !0);
        o.hasOwnProperty("reg")
          ? ($(this).find("h1").text(o.reg), console.log("EQ", o))
          : com.mysend({
              label: "js_error",
              data: { from: "comms_before", error: "no reg", id: a, eq: o },
            }),
          setTimeout(function () {
            if (
              o.hasOwnProperty("comms") &&
              o.comms.hasOwnProperty("features")
            ) {
              var a = $("#allcomm");
              o.comms.features.forEach((t, e) => {
                a.append(app.createCommBox(o, t));
              }),
                console.log("end comment");
            }
            $("#comments").trigger("readyTranslate"),
              $(t).trigger("order", [e]);
          }, 1),
          $(this).attr("data-currentid", a);
      }
    }),
    $("#pictures").on("beforepageshow", function () {
      var t = $(this).attr("data-id"),
        e = $(this).attr("data-currentid"),
        a = $(this).find(".pic"),
        i = a.length;
      if ((console.log(t, e, "nb:" + i), e != t || !(i > 0))) {
        a.remove();
        var s = app.findEq(t, !0);
        $(this).find("h1").text(s.reg),
          setTimeout(function () {
            if (s.hasOwnProperty("pics") && s.pics.hasOwnProperty("features")) {
              var t = $("#pictures").find(".pics");
              s.pics.features.forEach((e, a) => {
                setTimeout(function () {
                  t.append(app.createPicBoxv2(s, e));
                }, 1);
              });
            }
            setTimeout(function () {
              $("#pictures").trigger("readyTranslate"),
                console.log(".pic", $(".pic").length, $(".pic"));
            }, 800);
          }, 1),
          $(this).attr("data-currentid", t);
      }
    }),
    $("#piczoom").on("imgadd", function () {
      $(this)
        .find("img,video")
        .off("load")
        .on("load", function () {
          console.log("loaded", $(this));
        });
    }),
    $("#piczoom .imgs").on("imgFull", function (t, e) {
      $(e).attr("data-src") && $(e).attr("src", $(e).attr("data-src")),
        "video" == $(e).prop("tagName").toLowerCase() &&
          $(e).attr("controls", !0);
    }),
    $("#piczoom").on("prependimg", function (t, e, a, i) {
      console.log("prepend", i);
      var s = 0;
      if (0 == i && $(e + " " + a).length > 1) s = $(e + " " + a).length - 1;
      else {
        if (!(i >= 1)) return;
        s = i - 1;
      }
      console.log(s, $(e + " " + a).length, $(e + " " + a + ":eq(" + s + ")"));
      var n = $(e + " " + a + ":eq(" + s + ")").clone();
      $(n).attr("data-src") &&
        $(n)
          .attr("src", $(n).attr("data-src"))
          .css("max-width", $("#piczoom").css("width")),
        $(this).find(".imgs").prepend($("<div>").append(n)).trigger("imgadd");
    }),
    $("#piczoom").on("appendimg", function (t, e, a, i) {
      console.log("append", i);
      var s = 0;
      i < $(e + " " + a).length - 1 && (s = i + 1),
        console.log(
          s,
          $(e + " " + a).length,
          $(e + " " + a + ":eq(" + s + ")")
        );
      var n = $(e + " " + a + ":eq(" + s + ")").clone();
      $(n).attr("data-src") &&
        $(n)
          .attr("src", $(n).attr("data-src"))
          .css("max-width", $("#piczoom").css("width")),
        $(this).find(".imgs").append($("<div>").append(n)).trigger("imgadd");
    }),
    $("#piczoom").on("open", function (t, e, a, i, s) {
      console.log(arguments),
        $("#piczoom").css("display", "flex"),
        $("#piczoom").find(".imgs").animate({ scrollLeft: 0 }, 500);
      var n = $("#piczoom .imgs");
      $(a + " " + i).each(function (t) {
        var e = $(this).clone();
        n.append($("<div>").append(e)).trigger("imgFull", e);
      });
      var o = $(".imgs div:eq(" + s + ")").offset().left;
      $("#piczoom .imgs").animate({ scrollLeft: o }, 500),
        $(".zclose")
          .off("click")
          .on("click", function () {
            $("#piczoom").hide(), $(".imgs div").remove();
          }),
        $("#piczoom").trigger("ready");
    }),
    $("#earthquake,#comments").on("beforepageleave", function () {
      var t = $(this).attr("data-id");
      if (app._rating.pos.length > 0 || app._rating.neg.length > 0) {
        var e = {};
        (e[t] = app._rating),
          com.sendRate(e),
          (app._rating = { pos: [], neg: [] });
      }
    }),
    $("#earthquake,#comments,#pictures").on("readyTranslate", function () {
      $("#earthquake,#comments,#pictures")
        .off("click.trans")
        .on("click.trans", ".comment .thecomm", function (t) {
          if (
            (console.log("comment click"),
            t.preventDefault(),
            t.stopPropagation(),
            !$(this).parent().find(".thetranslate").length)
          ) {
            var e = $(this),
              a = $(e).text();
            console.log("trans", a),
              com.translate(a).then((t) => {
                if ((t = JSON.parse(t)).status) {
                  var a = app._lang,
                    i = [
                      $("<div>", {
                        class: "less",
                        "data-lng": "comm.trans",
                      }).text(a.comm.trans),
                      $("<div>", {
                        class: "more",
                        "data-lng": "comm.ori",
                      }).text(a.comm.ori),
                    ];
                  $(e)
                    .after(i)
                    .after(
                      $("<div>", { class: "thetranslate" }).text(
                        t.translatedText
                      )
                    ),
                    $(e).hide();
                }
              });
          }
        }),
        $("#earthquake,#comments,#pictures")
          .off("click.ori")
          .on("click.ori", ".comment .more,.comment .less", function (t) {
            t.stopPropagation(),
              $(this)
                .parent()
                .find(".more,.less,.thetranslate,.thecomm")
                .toggle();
          }),
        $("#earthquake,#comments")
          .off("click.rate")
          .on("click.rate", ".posneg", function (t) {
            var e = $(this).hasClass("pos") ? "pos" : "neg",
              a = "pos" == e ? "neg" : "pos";
            if (
              !$(this)
                .parent()
                .find("." + a)
                .hasClass("use")
            ) {
              $(this).toggleClass("use");
              var i = parseInt($(this).parent(".comment").attr("data-id"));
              if ($(this).hasClass("use")) app._rating[e].push(i);
              else {
                var s = app._rating[e].indexOf(i);
                s > -1 && app._rating[e].splice(s, 1);
              }
              app._rating[e] = app._rating[e].filter(
                (t, e, a) => a.indexOf(t) === e
              );
            }
          }),
        $("#pictures")
          .off("click.pic")
          .on("click.pic", ".dpic", function (t) {
            console.log("click", t);
            var e = $(this).find("video").get(0);
            if ((console.log(e), void 0 !== e && !e.paused)) {
              console.log("pause", e.paused);
              return;
            }
            var a = $(this).clone();
            $("#piczoom").trigger("open", [
              a,
              "#pictures",
              ".pic",
              $(this).index(),
            ]);
          });
    }),
    $(".help").on("click", function () {
      $("#" + $(this).attr("data-go")).show();
    }),
    $("#profile").on("disabled", function (t, e) {
      console.log(arguments),
        e
          ? ($(".notfelt").addClass("disabled"),
            $(".notfelt").find("input,select").prop("disabled", !0),
            $("body").trigger("Notifmap", !1))
          : ($(".notfelt").removeClass("disabled"),
            $(".notfelt").find("input,select").prop("disabled", !1),
            $("body").trigger("Notifmap", !0));
    }),
    $("#profile").on("beforepageshow", function () {
      console.log($('[data-lng="prof.email"]')),
        $("#profile .save").hide(),
        $("#lang").val(app.device.lng),
        $('#profile input[type="email"]').val(app.device.mail),
        $('input[name="unit"][value="' + dist.unit + '"]').prop("checked", !0),
        $("#notdestrcuct").prop("checked", app.device.notif.destruct),
        $("#notfelt").prop("checked", app.device.notif.felt),
        $("#nottts").prop("checked", app.device.notif.notiftts),
        console.log(app.device.notif.felt),
        $("#notminmag").val(app.device.notif.notminmag);
      var t =
        "mi" == dist.unit
          ? dist.tomiles(app.device.notif.notmaxdist)
          : app.device.notif.notmaxdist;
      $("#notmaxdist").attr("data-km", app.device.notif.notmaxdist).val(t),
        app.device.notif.felt || $("#profile").trigger("disabled", !0),
        $("#distnearme").val(app._nearme),
        $("#homep").val(app._home),
        $("#theme").prop("checked", "dark" === app._theme),
        $("#distnearme option").each(function (t) {
          $(this).text(
            dist.kmTogoodUnit($(this).val()) + " " + app._lang.unit[dist.unit]
          );
        });
    }),
    $("#profile").on("pageshow", function () {
      $(".nsp.unit")
        .attr("data-lng", "unit2." + dist.unit)
        .text(app._lang.unit2[dist.unit]),
        $(this)
          .find("input,select")
          .off("change")
          .on("change", function () {
            var t = $('#profile input[type="email"]'),
              e = !1;
            "" == $(t).val()
              ? (e = !0)
              : $(t).get(0).reportValidity() && (e = !0),
              e &&
                ($("#profile .save").show(),
                $("#profile").scrollTop($("#profile .save").offset().top));
          }),
        $("#notfelt")
          .off("change.A")
          .on("change.A", function () {
            $(this).prop("checked")
              ? $("#profile").trigger("disabled", !1)
              : $("#profile").trigger("disabled", !0);
          }),
        $("#notmaxdist")
          .off("change.A")
          .on("change.A", function () {
            var t =
              "mi" == dist.unit ? dist.tokm($(this).val(), !0) : $(this).val();
            $(this).attr("data-km", t);
          }),
        $("#notmaxdist,#notminmag")
          .off("change.B")
          .on("change.B", function () {
            $("body").trigger("Notifmap", !0);
          }),
        app.device.notif.felt && $("body").trigger("Notifmap", !0),
        $('input[name="unit"]')
          .off("change.f")
          .on("change.f", function () {
            console.log("CHANGE", $(this).val());
            let t = $(this).val();
            $("#distnearme option").each(function (e) {
              "km" == t
                ? $(this).text($(this).val() + " " + app._lang.unit[t])
                : $(this).text(
                    dist.tomiles($(this).val(), !0) + " " + app._lang.unit[t]
                  );
            });
            var e,
              a = $("#notmaxdist").val();
            "km" == t
              ? ((e = dist.tokm(a, !0)),
                $(".nsp.unit").text(app._lang.unit2.km))
              : ((e = dist.tomiles(a, !0)),
                $(".nsp.unit").text(app._lang.unit2.mi)),
              $("#notmaxdist").val(e);
          });
    }),
    $("#profile .save").on("click", function () {
      if ($("#notmaxdist").get(0).reportValidity()) {
        var t = $("#lang").val(),
          e = $('input[name="unit"]:checked').val(),
          a = $("#distnearme").val(),
          i = parseInt($("#notmaxdist").attr("data-km")),
          s = $("#notminmag").val();
        e != dist.unit &&
          ((dist.unit = e),
          setTimeout(function () {
            $("body").trigger("UnitChange");
          }, 100)),
          console.log("debug", a, app._nearme),
          a != app._nearme &&
            ((app._nearme = a),
            setTimeout(function () {
              $("body").trigger("NearmeChange");
            }, 100)),
          t != app.device.lng &&
            ((app.device.lng = t),
            setTimeout(function () {
              $("body").trigger("LngChange");
            }, 100)),
          (app.device.notif != i ||
            app.device.notif != s ||
            app.device.notif.felt != $("#notfelt").prop("checked")) &&
            setTimeout(function () {
              $("body").trigger("NotifValsChange");
            }, 100),
          (app.device.lng = t),
          (app.device.notif = {
            felt: $("#notfelt").prop("checked"),
            notiftts: $("#nottts").prop("checked"),
            notmaxdist: i,
            notminmag: s,
          }),
          (dist.unit = e),
          (app.device.mail = $('#profile input[type="email"]').val()),
          (app._home = $("#homep").val()),
          (app._theme = $("#theme").prop("checked") ? "dark" : "normal"),
          "dark" == app._theme
            ? $("body").addClass("dark")
            : $("body").removeClass("dark"),
          app._saveConf(),
          com.mysend({ label: "new_params", data: app.device }),
          history.back();
      }
    }),
    $("#profile").on("pageleave", function () {
      $(this).attr("data-head", "nav1");
    }),
    $(".eqsett").on("click", function () {
      $("#eqlistsett").trigger("beforepageshow").show();
    }),
    $(".loupe").on("click", function () {
      $("#searcheq").show();
    }),
    $(".b_-icmap").on("click", function () {
      var t = $('div[data-role="page"]:visible'),
        e = $(t).find("h1");
      $("#maps").attr("data-ori", $(t).attr("id")),
        $("#maps h1").text($(e).text()),
        (location.href = "#maps");
    }),
    $("#mapfull").on("click", function () {
      $("#maps").attr("data-ori", "signif").trigger("changeTitle");
    }),
    $(".b_-iclist").on("click", function () {
      console.log(
        "from maps go to list:",
        $('#eqlistsett input[name="eqlist"]'),
        $('#eqlistsett input[name="eqlist"]:checked').val()
      ),
        $("#list")
          .removeAttr("data-li2")
          .trigger(
            "golist",
            $('#eqlistsett input[name="eqlist"]:checked').val()
          );
    }),
    $("#eqlistsett").on("beforepageshow", function () {
      0 == $("#searchlist .eqs").length
        ? $(this).find("tr:last-child").hide()
        : $(this).find("tr:last-child").show();
      var t = $('div[data-role="page"]:visible').attr("id");
      console.log(t), $("#eqlistsett").trigger("check_List", [t]);
    }),
    $("#eqlistsett").on("check_List", function (t, e) {
      $('input[name="eqlist"][value="' + e + '"]').prop("checked", !0);
    }),
    $('#eqlistsett input[name="eqlist"]').on("change", function () {
      var t = $(this).val();
      $(this).parents('div[data-role="popup"]').hide(),
        console.log(t, $("#list").is(":visible"), $("#maps").is(":visible")),
        $("#maps").is(":visible")
          ? $("#maps")
              .trigger("beforepageshow")
              .trigger("pageshow")
              .trigger("changeTitle")
          : $("#list").trigger("golist", t);
    }),
    $("#datemin,#datemax")
      .not(".filled")
      .on("input", function () {
        $(this).addClass("filled"), console.log("date change", this.value);
      }),
    $("#flynn").on("keyup", function () {
      $(this).val().length < 3 ||
        $(this).val().indexOf("|") >= 0 ||
        com
          .ask("flynn_region", { flynn_region: $(this).val().toUpperCase() })
          .then(function (t) {
            $("#prop").trigger("data", [t]);
          });
    }),
    $("#prop").on("clean", function () {
      $(this).children().remove();
    }),
    $("#prop").on("data", function (t, e) {
      if (!1 !== e && 0 != e.length) {
        console.log(
          "data",
          $("#flynn").offset(),
          $('td[data-lng="search.flynn"]').offset(),
          $('td[data-lng="search.flynn"]').position(),
          $("#searcheq .boxcenter").offset(),
          $("#searcheq").height()
        );
        var a = $('td[data-lng="search.flynn"]').offset().top,
          i =
            $("#searcheq").height() -
            2 * $("#searcheq .boxcenter").offset().top -
            a -
            20;
        $(this).css({ top: a, height: i }), $("#prop").trigger("clean");
        var s = [];
        e.forEach(function (t, e) {
          console.log(t, e),
            s.push(
              $('<tr class="re">')
                .append(
                  $("<td>").append(
                    $("<input>", {
                      class: "res-reg",
                      id: "Fche" + e,
                      type: "checkbox",
                      value: t.REGION,
                    })
                  )
                )
                .append($("<td>", { class: "ln-reg" }).text(t.REGION))
            );
        }),
          $(this).append($("<table>").append(s)),
          $(this).show(),
          $(this)
            .off("click")
            .on("click", function (t) {
              t.stopPropagation();
            }),
          $("#searcheq")
            .off("click")
            .one("click", function () {
              console.log("searcheq clicked");
              var t = [];
              $(".res-reg:checked").each(function (e, a) {
                console.log(e, a, this, "**", this.value, "**", a.value),
                  t.push(this.value);
              }),
                console.log("FLYNN", t),
                $("#flynn").val(t.join("|")),
                $("#prop").trigger("clean").hide();
            });
      }
    }),
    $("#searcheq .savepop").on("click", function () {
      $("#searcheq").click(), console.log($("#searcheq").find("input"));
      var t = { limit: EmscConfig.search.limit, offset: 0 };
      $("#searcheq")
        .find("input")
        .each(function (e, a) {
          console.log($(a).val()), (t[$(a).attr("id")] = $(a).val());
        }),
        ["magmin", "magmax"].forEach((e, a) => {
          t[e] = parseFloat(t[e]);
        }),
        (t.felt = $("#felt").is(":checked")),
        console.log(t),
        $("body").trigger("loading"),
        com.search(t).then(function (t) {
          if ((console.log(t), t.hasOwnProperty("features"))) {
            $("#searchlist .list-overf .eqs").remove();
            var e = new list({ type: "search", tabs: t.features }),
              a = app.findListIndex("search");
            a >= 0 ? (app._list[a] = e) : app._list.push(e);
            var i = $("#searchlist .list-overf");
            e.getlist().forEach((t, e) => {
              i.append(app.createEQbox2(evids[t]));
            }),
              $("body").trigger("loaded"),
              $("#list").trigger("golist", "searchlist"),
              $("#searcheq").hide();
          }
          $("body").trigger("end-loading");
        });
    }),
    $("#maps").on("getori", function () {
      var t = $(this).attr("data-ori");
      console.log("map data-ori: ", t),
        ("list" == t || void 0 == t) &&
          (t = $('#eqlistsett input[name="eqlist"]:checked').val()),
        void 0 == t && (t = "signif"),
        $(this).data("mori", t),
        console.log("map ori:", t);
    }),
    $("#maps").on("changeTitle", function () {
      var ori = $(this).trigger("getori").data("mori"),
        val = confL.find((t, e) => t.id == ori);
      $("#maps h1")
        .attr("data-lng", val.name)
        .text(eval("app._lang." + val.name));
    }),
    $("#maps").on("beforepageshow", function () {
      $(".eqmap").remove();
    }),
    $("#maps").on("pageshow", function () {
      var t = $(this).offset().top,
        e = $("#footer").offset().top;
      console.log(t, $(this).offset().top, e, $("#footer").offset().top),
        $(this).height(e - t),
        $("#map2").height(e - $("#map2").offset().top),
        console.log($("#map2").position().top, $("#map2").offset().top, e);
      var a = $(this).trigger("getori").data("mori");
      console.log("new roi", a),
        console.log(maplist, !maplist),
        maplist
          ? maplist.resetGroup()
          : (maplist = new Fredmap("map2", "terrain").addGroup()),
        console.log("find", app._find_list_Byid(a));
      var i = app.findList(app._find_list_Byid(a));
      if (i) {
        $("#eqlistsett").trigger("check_List", [a]);
        var s = [];
        console.log("MAP liste:", i.getlist()),
          i.getlist().forEach((t, e) => {
            var a = evids[t];
            if (
              (a._marker || a.isNoid || (a._marker = app.makemarker(a)),
              a._marker)
            ) {
              a._marker._id = t;
              var i = jQuery.extend({}, a._marker);
              s.push(i);
            }
          }),
          console.log(s),
          maplist.addToGroup(s),
          maplist.featureGroup.on("click", function (t) {
            console.log(arguments),
              t.originalEvent.preventDefault(),
              t.originalEvent.stopPropagation(),
              t.layer.closePopup(),
              $("#maps .eqmap").remove(),
              $("#maps").append(
                $(".eqs.eqs2.c_" + t.layer._id)
                  .first()
                  .clone(!0)
                  .removeClass("eqs")
                  .addClass("eqmap")
              ),
              console.log("click marker", t),
              console.log($(".eqs.eqs2.c_" + t.layer._id).get(0)),
              console.log(
                "foot top",
                $("body").height(),
                $("#footer").position().top,
                $("#maps .eqmap").height()
              ),
              $("#map2")
                .off("click.pop")
                .on("click.pop", function (t) {
                  $("#maps .eqmap").remove();
                });
          });
      }
      $(this).removeAttr("data-ori");
    }),
    $(".cc").on("click", function () {
      $("#cc").trigger("click");
    }),
    $(".vign00,.elev00").on("scrollend", function (t) {
      console.log("scrollend");
      var e = { vign00: "vign0", elev00: "elev0" },
        a = null;
      for (let [i, s] of Object.entries(e)) $(this).hasClass(i) && (a = s);
      console.log(a);
      var n = $("body").width() / 2;
      $("." + a + " div.sel").removeClass("sel"),
        console.log("INTENS", $(".vign0 .sel").attr("data-intens")),
        $("." + a + " div").each(function (t, e) {
          if (
            (console.log(
              t,
              $(e).offset().left,
              n,
              $(e).offset().left + $(e).width()
            ),
            $(e).offset().left <= n && n <= $(e).offset().left + $(e).width())
          )
            return $(e).addClass("sel"), !1;
        }),
        $(".elev00").is(":visible") && $('[data-elev="inside"]').hasClass("sel")
          ? $(".floor").show()
          : $(".floor").hide();
    }),
    $(".vign00,.elev00").on("scroll", function (t) {
      var e = this;
      clearTimeout($.data(this, "scrollTimer")),
        $.data(
          this,
          "scrollTimer",
          setTimeout(function () {
            $(e).trigger("scrollend");
          }, 250)
        );
    }),
    $(".bt_felt").on("click", function () {
      if (
        (console.log("click"),
        $("#quest .save").hide(),
        $("#repcoord").remove(),
        !app.device.coord.hasOwnProperty("timestamp") ||
          app.device.coord.timestamp + EmscConfig.coord.maxtime < Date.now())
      ) {
        console.log("NO COORD"),
          $("#repp0,.vign00").hide(),
          $("#repp0").after(
            $("<p>", { class: "ucf", id: "repcoord" }).text(app._lang.rep.loc)
          );
        var t = function () {
          $("#bt_felt").trigger("click");
        };
        setTimeout(function () {
          $("body").trigger("askCoord", [t]);
        }, 3e3),
          $("body").trigger("NoCoord"),
          $("#quest").show();
        return;
      }
      $("body").trigger("WithCoord");
      var e = $("body").hasClass("rtl") ? -350 : 350;
      $("#quest,#repp0,.vign00").show(),
        console.log(
          "scrollto",
          $(".vign0 div:first-child").width() + 50,
          $(".vign0 div:first-child").width(),
          $(".vign0 .spint").width()
        ),
        $(".vign00").scrollLeft(e),
        console.log(window.screen.width, window.screen.width / 2),
        $(".vign0 div").each(function (t, e) {
          console.log(
            $(e).position(),
            $(e).offset(),
            $(e).offset().left + $(".vign0 div:first-child").width() / 2
          );
        }),
        $(".vign00").trigger("scrollend"),
        setTimeout(function () {
          $(".vign00").one("scroll", function () {
            console.log("show next bt"), $("#quest .save").show();
          });
        }, 500);
    }),
    $("#quest").on("close", function () {
      console.log("close"),
        $(this).attr("data-id", 0),
        $(".qucomm,#thank,.elev00").hide(),
        $("#quest .save").text(app._lang.rep.next),
        $("#quest .save").removeAttr("data-intens"),
        $(".vign00 ,.popbot,#quest .titl span[data-lng]").show(),
        $(".boxcenter0").css({ height: "90%" }),
        $("#re-cpt").attr("data-sel", "1"),
        $(".cpt.on").removeClass("on"),
        $("#cpt-1").addClass("on"),
        $("#files ._f, #files img, #files video").remove(),
        (app._postpic = []),
        $("#comm").val(""),
        $("#floor").val(0),
        $('.elev0 [data-elev="inside"]').attr("data-floor", 0),
        $(".floor").hide(),
        $("#quest .rm").remove();
    }),
    $("#quest").on("post", function () {
      var t =
          $(".vign0 .sel").attr("data-intens") ||
          $("#quest .save").attr("data-intens"),
        e = $(this).attr("data-id"),
        a = {
          evid: (e = 0 == e.indexOf("N") ? e : parseInt(e)),
          intensity: parseInt(t),
          comments: $("#comm").val(),
        };
      app.sendQuest(a);
    }),
    $("#cpt-1").on("click", function () {
      1 != parseInt($("#re-cpt").attr("data-sel")) &&
        ($(".vign00").show(),
        $(".qucomm").hide(),
        $("#re-cpt").attr("data-sel", 1),
        $("#quest .save").text(app._lang.rep.next));
    }),
    $("#cpt-2").on("click", function () {
      $(this).hasClass("on") &&
        2 != parseInt($("#re-cpt").attr("data-sel")) &&
        $("#quest .save").trigger("click");
    }),
    $("#quest .save").on("click", function () {
      var t =
        $(".vign0 .sel").attr("data-intens") || $(this).attr("data-intens");
      if ((console.log("intens", t), 0 != t && void 0 !== t && !1 !== t)) {
        $(this).attr("data-intens", t), $("body").hasClass("rtl");
        var e = parseInt($("#re-cpt").attr("data-sel")),
          a = e + 1;
        $("#repp0,.floor").hide(),
          console.log(e),
          $(".cpt.on").removeClass("on"),
          $("#cpt-" + a).addClass("on"),
          $("#re-cpt").attr("data-sel", a),
          1 == e &&
            ($(".vign00").hide(),
            $(".qucomm").show(),
            $("#quest .save").text(app._lang.submit),
            $("#quest").trigger("step2")),
          2 == e &&
            ($(".qucomm,.popbot,#quest .titl span[data-lng]").hide(),
            $("#quest").trigger("post"),
            $("#thank").show(),
            $(".boxcenter0").css({ height: "auto" }));
      }
    }),
    $("#addapic").on("click", function () {
      console.log("add pic");
      var t = function () {
        console.log("open access files"), $("#inpfiles").trigger("click");
      };
      $("body").trigger("askFiles", [t]);
    }),
    $("#inpfiles").on("change", function (t) {
      console.log($(this)[0].files, $(this));
      var e = $("#files");
      [].forEach.call($(this)[0].files, (t, a) => {
        e.append(
          $("<div>", { class: "imloader" }).append(
            $("<span>", { class: "loader" })
          )
        );
        var i = new FileReader();
        (i.onload = function (e) {
          var a = e.target.result;
          $("body").trigger("save_file", [t, a]);
        }),
          i.readAsArrayBuffer(t);
      });
    }),
    $("#inpfiles").on("fileReady", function (t, e, a) {
      app._postpic.push(e);
      var i = new FileReader();
      (i.onload = function (t) {
        console.log(t);
        var e = t.target.result;
        e.indexOf("video/") > 0
          ? $("#files .imloader:eq(0)").replaceWith(
              $("<div>", { class: "_f" })
                .append($("<video controls>").append($("<source>", { src: e })))
                .append($("<div>", { class: "rm" }).text("-"))
            )
          : $("#files .imloader:eq(0)").replaceWith(
              $("<div>", { class: "_f" })
                .append($("<img>", { src: e }))
                .append($("<div>", { class: "rm" }).text("-"))
            ),
          $("#quest").trigger("refresh");
      }),
        i.readAsDataURL(e);
    }),
    $("#quest").on("refresh", function (t) {
      $("#files .rm")
        .off()
        .on("click", function (t) {
          $(this).addClass("test");
          var e = this;
          $("#quest .rm").each(function (t, a) {
            $(a).hasClass("test") &&
              (app._postpic.splice(t, 1), $(e).parent().remove());
          });
        });
    }),
    $("#floor").on("change", function () {
      $('.elev0 [data-elev="inside"]').attr("data-floor", $(this).val());
    }),
    $("#safetymsg0").on("beforepageshow", function () {
      $("#safetymsg0 .safeId").text($(this).attr("data-info"));
    }),
    $("#safetymsg0 .green").on("click", function () {
      $("#safe-msg")
        .attr("data-evid", $("#safetymsg0").attr("data-evid"))
        .attr("data-info", $("#safetymsg0").attr("data-info")),
        $("#safetymsg").trigger("beforepageshow").show(),
        $("#safetymsg0").trigger("close").hide();
    }),
    $("#safetymsg0 .neutre,#safetymsg0 a").on("click", function () {
      $("#safetymsg0").trigger("close").hide();
    }),
    $("#settsaftips h2").on("click", function () {
      $(this).hasClass("notact") &&
        ($("#settsaftips h2").toggleClass("notact"),
        $(".dostep,.dostep2").toggle());
    }),
    $(".tiptsu").on("click", function () {
      $("#settsaftips h2:nth-child(2)").trigger("click");
    }),
    $(".tipeq").on("click", function () {
      $("#settsaftips h2:nth-child(1)").trigger("click");
    }),
    $("#safetymsg").on("beforepageshow", function () {
      $("#safe-gps").prop("checked", !1);
      var t = app.safety_ids.length;
      t > 0 ? $("#sms-send").show() : $("#sms-send").hide(),
        app.device.coord.hasOwnProperty("lat")
          ? $("#safe-gps,#safe-gps-span").show()
          : $("#safe-gps,#safe-gps-span").hide(),
        $(".nbcontact").text(app._lang.safe.cont + " (" + t + ")"),
        $("#safe-msg").text(
          app._lang.eq0 +
            " " +
            $("#safe-msg").attr("data-info") +
            " : " +
            app._lang.safe.q0
        );
    }),
    $("#safe-gps").on("click", function () {
      if ($(this).is(":checked")) {
        if (!app.device.coord.hasOwnProperty("lat")) {
          $(this).prop("checked", !1);
          return;
        }
        var t = $("#safe-msg").text();
        $("#safe-msg").text(
          t + "\n - GPS: " + app.device.coord.lat + " ; " + app.device.coord.lon
        );
      }
    }),
    $(".nbcontact").on("click", function () {
      $("#safetycheck").attr("data-from", "safetymsg"),
        (window.location.href = "#safetycheck"),
        $("#safetymsg").trigger("close").hide();
    }),
    $("#sms-send").on("click", function () {
      $("body").trigger("sendSMS", [$("#safe-msg").text()]);
    }),
    $("#bug").on("beforepageshow", function () {
      if ("TEXTAREA" == $("#bug-detail").prop("tagName")) {
        var t = $("<div>", {
          id: "bug-detail",
          contenteditable: "true",
          class: "textarea",
          placeholder: $("#bug-detail").attr("data-placeholder"),
          "data-lng-pholder": "bug.pholder",
        });
        $("#bug-detail").replaceWith(t);
      }
      $('#bug input[type="email"]').val(app.device.mail),
        $("#bug-detail")
          .addClass("phold")
          .text($("#bug-detail").attr("placeholder")),
        $("#bug .save").hide(),
        $("#bug-detail")
          .off("focus")
          .one("focus", function () {
            console.log("tetxarea"), $(this).removeClass("phold").text("");
            var t = $("<textarea>", {
              id: "bug-detail",
              class: "textarea",
              "data-placeholder": $("#bug-detail").attr("placeholder"),
              "data-lng-pholder": "bug.pholder",
            });
            $(this).replaceWith(t),
              $("#bug-detail").focus(),
              $("#bug-detail")
                .off("keydown")
                .one("keydown", function () {
                  $("#bug .save").show();
                });
          });
    }),
    $("#bug .save").on("click", function () {
      if ($('#bug input[type="email"]').get(0).reportValidity()) {
        var t = {
          text: $("#bug-detail").val(),
          mail: $('#bug input[type="email"]').val(),
          user: app.device,
        };
        com.mysend({ label: "send_bug", data: t }), history.back();
      }
    }),
    $("#tou").one("beforepageshow", function () {
      var t = this;
      com.getPage("terms_of_use", function (e) {
        e.hasOwnProperty("html") && $(t).append($(e.html));
      });
    }),
    $("#faq").one("beforepageshow", function () {
      var t = this;
      com.getPage("faq", function (e) {
        e.hasOwnProperty("html") && $(t).append($(e.html));
      });
    }),
    $("#manual").on("beforepageshow", function () {
      $(this)
        .find("h2")
        .each(function (t, e) {
          var a = $(e).text();
          $(e).text(
            a.substring(0, 3).toLowerCase() +
              a[3].toUpperCase() +
              a.substring(4).toLowerCase()
          );
        });
    }),
    $('#donate input[name="don"]').on("change", function () {
      (0 == parseInt($(this).val()) || $("#dona").is(":visible")) &&
        $(".tog").toggle();
    }),
    $("#donate_submit").on("click", function () {
      var t = parseInt($('#donate input[name="don"]:checked').val());
      if ((0 == t && (t = parseFloat($("#dona").val())), t < 1 || isNaN(t))) {
        alert("You must contribute at least 1 €");
        return;
      }
      $("#amount").val(t), $("#donate").trigger("valid", [t]);
    });
  for (var i = 1; i < 6; i++)
    $(".fearresp").append(
      '<div class="fresp" data-v="' + i + '">' + i + "</div>"
    );
  $(".fearresp").append('<div class="resptxt"></div>');
  var fear = app._lang.fear;
  setTimeout(function () {
    app._lang.hasOwnProperty("fear") ||
      ((app._lang.fear = fear),
      setTimeout(function () {
        app.loadLanguage();
      }, 5e3));
  }, 5e3),
    $("#quest").on("post", function () {
      var t = $(this).attr("data-id");
      0 != t.indexOf("N") &&
        0 != parseInt(t) &&
        ($("#fear").attr("data-id", t),
        $("#thank")
          .append(
            $("<div>", { class: "thankt ucf tfear", "data-lng": "fear.thank0" })
          )
          .append(
            $("<div>", { class: "thank ucf tfear", "data-lng": "fear.thank1" })
          )
          .append(
            $("<div>", { class: "save tfear", "data-lng": "fear.start" })
          ),
        app._lang.hasOwnProperty("fear") &&
          ($('#thank .ucf[data-lng="fear.thank0"]').text(app._lang.fear.thank0),
          $('#thank .ucf[data-lng="fear.thank1"]').text(app._lang.fear.thank1),
          $('#thank .save[data-lng="fear.start"]').text(app._lang.fear.start)),
        $("#thank .save.tfear").one("click", function () {
          (window.location.href = "#fear"),
            $("#quest .popclose").trigger("click");
        }));
    }),
    $("#quest").on("close", function () {
      $("#thank .tfear").remove();
    }),
    $("#fear").on("beforepageshow", function () {
      $("#fear .save").hide(),
        $("#fear .fresp").removeClass("sel"),
        $("#fear .resptxt").text("");
    }),
    $(".fresp").on("click", function () {
      var t = ["r0", "r1", "r2", "r3", "r4"];
      $(this).parent().find(".fresp").removeClass("sel"),
        $(this).addClass("sel");
      var e = $(this).index();
      app._lang.hasOwnProperty("fear") &&
        $(this).parent().find(".resptxt").text(app._lang.fear[t[e]]),
        7 == $("#fear .sel").length && $("#fear .save").show();
    }),
    $("#fear .save").on("click", function () {
      if (7 == $("#fear .sel").length) {
        var t = [];
        $(".fearresp").each(function (e) {
          $(this)
            .find(".fresp")
            .each(function (e) {
              $(this).hasClass("sel") &&
                t.push(parseInt($(this).attr("data-v")));
            });
        }),
          $("#fear").trigger("post", [t]);
      }
    }),
    $("#fear").on("post", function (t, e) {
      var a = $(this).attr("data-id"),
        i = { evid: (a = 0 == a.indexOf("N") ? a : parseInt(a)), quest: e };
      app.sendFear(i), history.back();
    }),
    $("body").on("Loadend", function (t) {
      console.log("body LOAD END"),
        console.log("LOAD TIME=", Date.now() - t0),
        app.my.forEach((t, e) => {
          $('.eqs[data-id="' + t + '"]:not(.my)').addClass("my");
        }),
        intAgo && clearInterval(intAgo),
        (intAgo = setInterval(function () {
          da.refreshAgo();
        }, 6e4)),
        $("body").trigger("OpenEQ"),
        $("#app_version").text(app.device.app_version);
    }),
    $("body").on("UnitChange", function (t) {
      console.log(map);
      var e = "mi" == dist.unit;
      $(".mydist,.depth,.cdepth").each(function (t) {
        var e,
          a,
          i,
          s = $(this).text().split(" ");
        "?" == (e = s[0].replace(/[\s,.]/g, ""))
          ? (i = e)
          : ((a = parseFloat(e)),
            (i =
              "km" == s[1]
                ? dist.format(dist.tomiles(a))
                : dist.format(dist.tokm(a)))),
          console.log(s[0], a, i, dist.unit),
          $(this).text(i + " " + app._lang.unit[dist.unit]);
      });
      var a = parseInt($("#notmaxdist").val()),
        i = e ? dist.tomiles(a) : dist.tokm(a);
      $("#notmaxdist").val(i);
    }),
    $("body").on("NearmeChange", function (t) {
      app.reloadNearMe();
    }),
    $("body").on("ChkLn", function (t) {
      app.lng_rtl.includes(app.device.lng)
        ? ($(this).addClass("rtl"),
          $(".right").removeClass("right").addClass("left"),
          setTimeout(function () {
            $(".after").addClass("rtl");
          }, 500))
        : ($(this).removeClass("rtl"),
          $(".left").removeClass("left").addClass("right"),
          $(".after").removeClass("rtl"));
    }),
    $("body").on("LngChange", function (t) {
      console.log("LngChange", app.device.lng, app.lng_rtl), app.LoadNewLng();
    }),
    $("body").on("OpenEQ", function () {
      var t = $(this).attr("data-OpenEQ");
      void 0 !== t &&
        !1 !== t &&
        (console.log("try open EQ", t),
        $(".c_" + t).length &&
          ($(".c_" + t + " .mag")
            .first()
            .trigger("click"),
          $("body").attr("data-OpenEQ", "")));
    }),
    $("body").on("mapSel", function (t, e) {
      app._storage.setItem("mapSel", JSON.stringify(e));
    }),
    $("body").trigger("all_listner_load"),
    $(window).on("resize", function () {
      console.log("resize: hash:", hash),
        "#list" != hash
          ? $("#list")
              .off("pageshow.RS")
              .one("pageshow.RS", function () {
                $(this).trigger("setsize");
              })
          : setTimeout(function () {
              $("#list").trigger("setsize");
            }, 800),
        $("#home")
          .off("pageshow.RS")
          .one("pageshow.RS", function () {
            map.map.invalidateSize();
          });
    });
});
class Fredmap {
  constructor(t) {
    (this.lname = arguments[1] || "satellite"),
      (this.featureGroup = null),
      (this.markers = []),
      (this.marks = []),
      (this.mymarker = null),
      (this.div = t);
    var e = arguments[2] || [0, 0];
    $("#" + t).hasClass("leaflet-container") &&
      $("#" + t).replaceWith($("<div>", { id: t })),
      (this.lcontrol = null),
      (this.map = L.map(t, {
        center: e,
        zoom: 1,
        worldCopyJump: !0,
        dragging: !0,
        preferCanvas: !0,
      }));
    var a = this;
    return (
      this.map.on("dragend", function (t) {
        var e = a.map.getBounds();
        console.log(e, t);
        var i = 0;
        e._southWest.lng <= -180
          ? (i = -360)
          : e._northEast.lng >= 180 && (i = 360),
          a.map.eachLayer(function (t) {
            if (t.hasOwnProperty("_popup")) {
              var a = e.contains(t._latlng);
              console.log("Z", a, t),
                !a &&
                  (t._latlng <= -180
                    ? t.setLatLng(
                        new L.LatLng(t._latlng.lat, t._latlng.lng + 360)
                      )
                    : t._latlng >= 180 &&
                      t.setLatLng(
                        new L.LatLng(t._latlng.lat, t._latlng.lng - 360)
                      ));
            }
          }),
          "gmap" == a.div &&
            1 == t.target._zoom &&
            (e._northEast.lat < 80 &&
              ((e._northEast.lat = 80),
              a.map.fitBounds(e),
              console.log("change", e)),
            e._southWest.lat > -80 &&
              ((e._southWest.lat = -80),
              a.map.fitBounds(e),
              console.log("change", e)));
      }),
      this.updateControlLayers(),
      this
    );
  }
  resetGroup() {
    this.featureGroup &&
      (this.map.removeLayer(this.featureGroup), (this.markers = [])),
      this.addGroup();
  }
  addGroup() {
    return (this.featureGroup = L.featureGroup().addTo(this.map)), this;
  }
  addOneMarkerToGroup(t) {
    this.featureGroup.addLayer(t), this.markers.push(t);
  }
  addToGroup(t) {
    Array.isArray(t)
      ? t.forEach((t, e) => {
          this.addOneMarkerToGroup(t);
        })
      : this.addOneMarkerToGroup(t),
      console.log(this.markers);
  }
  addMyMarker() {
    return (
      null != this.mymarker &&
        this.map.hasLayer(this.mymarker) &&
        this.map.removeLayer(this.mymarker),
      (this.mymarker = L.marker([app.device.coord.lat, app.device.coord.lon], {
        icon: L.divIcon({
          className: "my-icon-class",
          iconSize: [25, 41],
          iconAnchor: [12.5, 41],
        }),
      })),
      this.mymarker.addTo(this.map),
      this
    );
  }
  addMarker(t, e) {
    var a = L.marker(t, e).addTo(this.map);
    return this.marks.push(a), a;
  }
  addCircleMarker(t, e) {
    var a = L.circleMarker(t, e).addTo(this.map);
    return this.marks.push(a), a;
  }
  goBounds() {
    if (this.featureGroup)
      this.map.fitBounds(this.featureGroup.getBounds(), {
        maxZoom: 12,
        padding: [10, 10],
      });
    else if (this.marks.length > 0) {
      var t = this.marks[0].getLatLng().toBounds(1e4);
      this.map.fitBounds(t);
    }
    console.log("fitBounds", this.featureGroup, this.marks.length);
  }
  addTo(t) {
    return t.map;
  }
  drawStar(t, e, a, i, s) {
    var n = 3,
      o = document.getElementsByClassName(t)[0];
    if (o) {
      var r = document.createElement("canvas");
      (r.style = "margin-left:-15px;margin-top:-10px;"), o.appendChild(r);
      var l = r.getContext("2d");
      l.translate(e, a + n), l.rotate((1 * Math.PI) / 10), (l.lineWidth = n);
      for (var d = 5; d--; )
        l.lineTo(0, i),
          l.translate(0, i),
          l.rotate((2 * Math.PI) / 10),
          l.lineTo(0, -i),
          l.translate(0, -i),
          l.rotate(-((6 * Math.PI) / 10));
      l.lineTo(0, i), l.closePath(), l.stroke(), (l.fillStyle = s), l.fill();
    }
  }
  deleteMarkerById(t) {
    this.map.eachLayer(function (e) {
      console.log(e),
        e.hasOwnProperty("_popup") &&
          e._popup.hasOwnProperty("options") &&
          e._popup.options.hasOwnProperty("className") &&
          e._popup.options.className == "pop_" + t &&
          e.remove();
    });
  }
  addRecenter() {
    var t = this;
    let e =
      '<svg id="vcenter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 109.78"><title>arrows-center</title><path d="M28.94,13.7l.09-.09,5.65-5.67.15-.13c2.61-2.4,5.24-1.62,6.76,1.44a1.59,1.59,0,0,1,.16.54c1.25,10.35,2.1,20.29,3.34,30.64.25,3.42-2.08,4.84-5.24,4.47l-28.21-3c-4.92-.58-7.36-3.84-3.42-7.78,1.78-1.77,3.54-3.58,5.34-5.32l-13-13a2,2,0,0,1,0-2.8L13,.58a2,2,0,0,1,2.81,0L28.94,13.7Zm32.5,27.58A13.61,13.61,0,1,1,47.83,54.89,13.61,13.61,0,0,1,61.44,41.28Zm32.5,54.8-.09.09-5.66,5.67a.86.86,0,0,1-.14.13c-2.61,2.4-5.24,1.62-6.76-1.44a1.58,1.58,0,0,1-.16-.55C79.88,89.64,79,79.7,77.79,69.35c-.25-3.42,2.07-4.84,5.24-4.47l28.21,3c4.92.58,7.36,3.84,3.42,7.78-1.78,1.77-3.54,3.58-5.34,5.32l13,13a2,2,0,0,1,0,2.8l-12.42,12.43a2,2,0,0,1-2.81,0L93.94,96.08Zm-65,0,.09.09,5.65,5.67.15.13c2.61,2.4,5.24,1.62,6.76-1.44a1.58,1.58,0,0,0,.16-.55C43,89.64,43.85,79.7,45.09,69.35c.25-3.42-2.08-4.84-5.24-4.47l-28.21,3c-4.92.58-7.36,3.84-3.42,7.78C10,77.44,11.76,79.25,13.56,81L.58,94a2,2,0,0,0,0,2.8L13,109.21a2,2,0,0,0,2.81,0L28.94,96.08Zm65-82.38-.09-.09L88.19,7.94a.86.86,0,0,0-.14-.13c-2.61-2.4-5.24-1.62-6.76,1.44a1.59,1.59,0,0,0-.16.54C79.88,20.14,79,30.08,77.79,40.43c-.25,3.42,2.07,4.84,5.24,4.47l28.21-3c4.92-.58,7.36-3.84,3.42-7.78-1.78-1.77-3.54-3.58-5.34-5.32l13-13a2,2,0,0,0,0-2.8L109.88.58a2,2,0,0,0-2.81,0L93.94,13.7Z"/></svg>';
    (L.Control.Button = L.Control.extend({
      options: { position: "topleft" },
      onAdd: function (e) {
        var a = L.DomUtil.create("div", "leaflet-bar leaflet-control"),
          i = L.DomUtil.create("a", "leaflet-control-button fsvg", a);
        return (
          L.DomEvent.disableClickPropagation(i),
          L.DomEvent.on(i, "click", function () {
            t.map.setView([0, 0], 1);
          }),
          (a.title = "Reset map"),
          a
        );
      },
      onRemove: function (t) {},
    })),
      new L.Control.Button().addTo(this.map),
      $(".fsvg").attr("id", "fsvg").append(e);
  }
  updateControlLayers(t = !1) {
    t &&
      null != this.lcontrol &&
      (this.lcontrol.remove(this.map), (this.lcontrol = null)),
      console.log("MAP", EmscConfig.map);
    var e = EmscConfig.map.layers;
    for (var a in e) this.addLayer(e[a]);
    if (EmscConfig.map.hasOwnProperty("overlays")) {
      var i = EmscConfig.map.overlays;
      for (var a in i) this.addOverlay(i[a]);
    }
    var s = JSON.parse(app._storage.getItem("mapSel"));
    (null != s && s.hasOwnProperty(0)) || (s = [[0]]),
      console.log(s, this.lcontrol);
    var n = [
      "#" +
        this.div +
        " .leaflet-control-layers-base .leaflet-control-layers-selector",
      "#" +
        this.div +
        " .leaflet-control-layers-overlays .leaflet-control-layers-selector",
    ];
    s.hasOwnProperty(0) &&
      s[0].forEach(function (t, e) {
        $(n[0] + ":eq(" + t + ")").trigger("click");
      }),
      s.hasOwnProperty(1) &&
        s[1].forEach(function (t, e) {
          $(n[1] + ":eq(" + t + ")").trigger("click");
        });
    for (var o = 0; o < 2; o++)
      $(n[o])
        .off()
        .on("click." + o, function (t) {
          var e = [],
            a = parseInt(t.handleObj.namespace);
          $(n[a]).each(function (t) {
            this.checked && e.push(t);
          }),
            0 == s.length ? s.splice(a, 1) : (s[a] = e),
            $("body").trigger("mapSel", [s]);
        });
  }
  addOverlay(t) {
    this.lcontrol.addOverlay(this.buildLayer(t), t.name);
  }
  addLayer(t) {
    if (null == this.lcontrol) {
      var e = {};
      (e[t.name] = this.buildLayer(t)),
        (this.lcontrol = L.control.layers(e).addTo(this.map));
    } else this.lcontrol.addBaseLayer(this.buildLayer(t), t.name);
  }
  buildLayer(t) {
    return new L.tileLayer(t.url, {
      id: t.name,
      maxZoom: t.maxZoom,
      minZoom: t.minZoom,
      attribution: t.attribution || "",
      subdomains: t.subdomains,
      scheme: t.sheme,
      continuousWorld: !1,
    });
  }
  add_rep_legend(t) {
    var e = L.control({ position: "bottomright" });
    (e.onAdd = function (t) {
      var e = L.DomUtil.create("div", "relegend");
      return (
        (e.innerHTML =
          '<table style="width:100%;"><tr><td>Not felt</td><td>Felt</td><td>Largely felt</td><td>Damaging</td></tr></table>'),
        e
      );
    }),
      e.addTo(this.map),
      console.log(this.map),
      $(".relegend").css({
        width: this.map._size.x - (2 * this.map._size.x) / 100,
        margin: "0 1%",
      }),
      $(".relegend").before(
        $("<div>", { class: "relegend2" }).text(t + " felt reports on this map")
      );
  }
}
class comm {
  constructor() {
    (this._ws_binary = !0),
      (this._newconnect = !0),
      (this.isVolunter = !1),
      (this._msgQ = []),
      (this._waited = []),
      (this._lnloaded = !1),
      (this._eqloaded = !1),
      (this._chunk = 500),
      (this.version = "3.0.0"),
      (this.device = { appversion: this.version, binary: this._ws_binary }),
      (this._encoder = function t(e) {
        return btoa(
          encodeURIComponent(e).replace(/%([0-9A-F]{2})/g, function (t, e) {
            return String.fromCharCode(parseInt(e, 16));
          })
        );
      }),
      (this._decoder = function t(e) {
        return decodeURIComponent(
          Array.prototype.map
            .call(atob(e), function (t) {
              return "%" + ("00" + t.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );
      }),
      this.initObjComp(),
      this.init();
  }
  initObjComp() {
    this.obj_decomp = {
      tab: [],
      encours: !1,
      _com: null,
      _fail: function () {},
      set: function (t, e) {
        arguments[2], (this._com = t), this.tab.push(e), this.decompress();
      },
      decompress: function () {
        if (this.encours || 0 == this.tab.length) return;
        this.encours = !0;
        var t = this,
          e = Object.assign({}, this.tab[0]);
        this.tab.shift();
        let a = e.obj.stream().pipeThrough(new DecompressionStream("gzip"));
        new Response(a)
          .blob()
          .then((e) =>
            e.text().then((e) => {
              (t.encours = !1),
                setTimeout(function () {
                  t.next();
                }, 1),
                setTimeout(function () {
                  t._com.dispatch(e);
                }, 0);
            })
          )
          .catch((a) => {
            (t.encours = !1),
              setTimeout(function () {
                t.next();
              }, 1),
              setTimeout(function () {
                t._fail(e.obj);
              }, 0);
          });
      },
      next: function () {
        this.decompress();
      },
    };
  }
  init() {
    console.log("try connect"), (this.ws = new WebSocket(EmscConfig.ws));
    var t = this;
    (this.ws.onopen = function () {
      console.log("connected"),
        app.setConnected(!0),
        t.mysend({
          label: "compress",
          data: { data: "function" == typeof DecompressionStream },
        });
      var e = {
        "X-Requested-With": app.device.packagename,
        "X-App-Uuid": app.device.uuid,
        "X-App-LQUUID": app.device._UUID,
        "X-App-Version": app.device.app_version,
        binary: t._ws_binary,
        asHWA: app.docAsHWA(),
      };
      t.mysend({ label: "device", data: e }),
        t.new_connect(),
        (t._newconnect = !1),
        t._msgQ.length > 0 &&
          (t._msgQ.forEach(function (e, a) {
            t.mysend(e);
          }),
          (t._msgQ = []));
    }),
      (this.ws.onmessage = function (e) {
        function a(e) {
          t.dispatch(t._decoder(e));
        }
        if ("object" == typeof e.data)
          try {
            t.obj_decomp.set(t, { obj: e.data, id: Date.now() }, a);
          } catch (i) {
            a(e.data);
          }
        else if (t._ws_binary)
          try {
            a(e.data);
          } catch (s) {
            t.dispatch(e.data);
          }
        else t.dispatch(e.data);
      }),
      (this.ws.onerror = function (t) {
        console.log("ws error", t);
      }),
      (this.ws.onclose = function (e) {
        console.log(
          "Socket is closed. Reconnect will be attempted in 1 second.",
          e.reason
        ),
          app.setConnected(!1),
          t.isVolunter ||
            setTimeout(function () {
              com.init();
            }, 1e3);
      });
  }
  dispatch(t) {
    var e = JSON.parse(t);
    console.log("RCV data:", e),
      e.label && e.data && e.list && this[e.label]
        ? this[e.label](e.data, e.list)
        : e.label && e.data && this[e.label] && this[e.label](e.data);
  }
  mysend(t) {
    if (!app._status.connected) {
      this._msgQ.push(t);
      return;
    }
    this._ws_binary, this.ws.send(JSON.stringify(t));
  }
  send(t) {
    this.ws.send(t);
  }
  _ws_post_data(t, e, a, i) {
    var s = t.MyQid;
    (this[s] = function (e) {
      console.log("send OK chunk", s, t, e), a.call(i);
    }),
      console.log("send chunk...", t),
      this.mysend({ label: "datainfo", data: t, resp: "resp_datainfo" }),
      this.send(e);
  }
  new_connect() {
    this._lnloaded ||
      this.mysend({
        label: "languages2.php",
        data: "version=" + app.device.app_version,
        resp: "resp_languages2",
      }),
      this._eqloaded ||
        (app.delAll(),
        this.mysend({ label: "get.geojson", data: { chunk: this._chunk } })),
      setTimeout(function () {
        app.UploadInWaiting();
      }, 2);
  }
  debugonline(t) {
    var e = this;
    console.log = function () {
      var t = [].slice.call(arguments);
      t.unshift(Date.now());
      for (var a = 0; a < t.length; a++)
        if ("object" == typeof t[a])
          try {
            t[a] = JSON.stringify(t[a]).substring(0, 100);
          } catch (i) {
            t[a] = "object";
          }
      e.mysend({ label: "debugonline", data: t });
    };
  }
  conf(t) {
    (app.lng_rtl = t.lng_rtl),
      (da._agoBefore = t.agoBefore),
      (da._agoDisp = t.agoDisp),
      t.hasOwnProperty("map") &&
        ((EmscConfig.map = t.map), map.updateControlLayers(!0)),
      t.hasOwnProperty("coord") && (EmscConfig.coord = t.coord),
      t.hasOwnProperty("notif") && (EmscConfig.notif = t.notif),
      t.hasOwnProperty("allowRating") &&
        (EmscConfig.allowRating = t.allowRating),
      t.hasOwnProperty("cachetime") && (EmscConfig.cachetime = t.cachetime),
      t.hasOwnProperty("sendrcvnotif") &&
        "undefined" != typeof NativeStorage &&
        NativeStorage.setItem("sendrcvnotif", t.sendrcvnotif),
      setTimeout(function () {
        $("body").trigger("openAppRate");
      }, 1e4);
  }
  getLng(t) {
    this.mysend({ label: "getLng", data: t });
  }
  newLng(t) {
    (app._lang = t),
      setTimeout(function () {
        app.saveLn(app.device.lng, t);
      }, 200),
      setTimeout(function () {
        app.loadLanguage();
      }, 50);
  }
  risk(t) {
    console.log(t),
      app._list.push(new list({ type: "risk", tabs: t.features })),
      app.load("risk");
  }
  full(t) {
    app._list.push(new list({ type: "full", tabs: t.features })),
      app.load("full");
  }
  full_json(t) {
    app._list.push(new list({ type: "full", tabs: t.features }));
    var e = app.getSignifsFromFull();
    app._list.push(new list({ type: "risk", tabs: e })),
      app.load("risk"),
      app.load("full"),
      setTimeout(function () {
        $("body").trigger("Loadend");
      }, 10),
      (app._status.loaded = !0),
      this._waited.forEach(function (t, e) {
        t();
      }),
      (this._waited = []),
      setTimeout(function () {
        app.CheckUpdateMy();
      }, 1);
  }
  full_json0(t) {
    if (
      (console.log(new Date().toString() + " RCV geojson"),
      t.hasOwnProperty("features"))
    ) {
      console.log(app.lists, app._list);
      var e = t.features.length;
      if (-1 == app.findListIndex("full")) {
        app._list.push(
          new list({ type: "full", tabs: t.features, chunked: !0 })
        ),
          app.loadChunk("full", e),
          app._list.push(new list({ type: "risk", tabs: [], chunked: !0 }));
        var a = app.getSignifsFromFull();
        console.log("SIGNIF", a),
          app.findList("risk").addMore(a),
          app.loadChunk("risk", a.length),
          setTimeout(function () {
            $("body").trigger("loaded");
          }, 1);
      } else {
        app.findList("full").addMore(t.features);
        var a = app.getSignifsFromFull(e);
        a.length > 0 &&
          (app.findList("risk").addMore(a), app.loadChunk("risk", a.length)),
          app.loadChunk("full", e);
      }
    } else
      (this._eqloaded = !0),
        app.findList("full")._ChunkEnd(),
        app.findList("risk")._ChunkEnd(),
        setTimeout(function () {
          $("#full").trigger("loaded"),
            $("body").trigger("loaded").trigger("Loadend");
        }, 5),
        (app._status.loaded = !0),
        this._waited.forEach(function (t, e) {
          t();
        }),
        (this._waited = []),
        setTimeout(function () {
          app.CheckUpdateMy();
        }, 5);
  }
  resp_languages2(t) {
    console.log(app.device),
      (this._lnloaded = !0),
      (app._allLng = t),
      app.loadLn();
    var e = app.device.browser_lng.substr(0, 2),
      a = [];
    Object.entries(t).forEach((t) => {
      let [i, s] = t;
      a.push($("<option>", { value: i }).text(s.name)),
        app.device.isNewapp &&
          e == i &&
          ((app.device.lng = e), app._saveConf());
    }),
      $("#lang").append(a).val(app.device.lng),
      app.LoadNewLng(app.device.lng);
  }
  list_insert_update(t) {
    var e = function () {
      app._relace_evid(t), app.insertOrUpdateEvid(t.id);
    };
    app._status.loaded ? e() : this._waited.push(e);
  }
  list_del(t) {
    var e = function () {
      app.delEvid(t);
    };
    app._status.loaded ? e() : this._waited.push(e);
  }
  async eqinfo(t) {
    var e = this,
      a = await new Promise(function (a, i) {
        (e.R_eqinfo = function (t) {
          console.log(t), a(t);
        }),
          e.mysend({ label: "evid_noid.geojson", data: t, resp: "R_eqinfo" });
      });
    return console.log("h", a), a;
  }
  fereports(t) {
    (this.R_fereports = function (t) {
      freports(t);
    }),
      this.mysend({
        label: "feltreport.geojson",
        data: t,
        resp: "R_fereports",
      });
  }
  getComms(t, e) {
    (this.R_comms = function (t) {
      e(t);
    }),
      this.mysend({ label: "comments.geojson", data: t, resp: "R_comms" });
  }
  getPics(t, e) {
    (this.R_pics = function (t) {
      e(t);
    }),
      this.mysend({ label: "pics.geojson", data: t, resp: "R_pics" });
  }
  async ask(t, e) {
    var a = this,
      i = await new Promise(function (i, s) {
        (a["R_" + t] = function (t) {
          console.log(t), i(t);
        }),
          a.mysend({ label: t, data: e, resp: "R_" + t });
      });
    return console.log("h", i), i;
  }
  async translate(t) {
    var e = this,
      a = await new Promise(function (a, i) {
        (e.R_trans = function (t) {
          console.log(t), a(t);
        }),
          e.mysend({
            label: "translate",
            data: { txt: t, lng: app.device.lng },
            resp: "R_trans",
          });
      });
    return console.log("h", a), a;
  }
  async search(t) {
    var e = this;
    return await new Promise(function (a, i) {
      (e.R_search = function (t) {
        console.log(t), a(t);
      }),
        e.mysend({ label: "search", data: t, resp: "R_search" });
    });
  }
  getAny(t, e, a = {}) {
    (this["R_" + t] = function (t) {
      e(t);
    }),
      this.mysend({ label: t, data: a, resp: "R_" + t });
  }
  getPage(t, e) {
    this.getAny(t, e);
  }
  newbandeau(t) {
    if (t.hasOwnProperty("banner_status") && !t.banner_status) {
      t.hasOwnProperty("id")
        ? $(".banner.c_" + t.id).remove()
        : $(".banner").remove(),
        $("#list").trigger("setsize");
      return;
    }
    t.hasOwnProperty("id") &&
      ($(".banner.c_" + t.id).remove(),
      $("#home, #list").prepend(app.createBandeauBox(new evid(t))),
      $("body").trigger("loaded"),
      console.log("abndeau"));
  }
  endbandeau(t) {
    t.hasOwnProperty("id") &&
      ($(".banner.c_" + t.id).remove(), $("#list").trigger("setsize"));
  }
  sendRate(t) {
    this.mysend({ label: "rate_save", data: t });
  }
}
(Date.prototype.setTimeZoneOffset = function (t) {
  return new Date(this.getTime() + 6e4 * t);
}),
  (Date.prototype.utc = function () {
    return new Date(
      this.setTime(this.getTime() + 6e4 * this.getTimezoneOffset())
    );
  });
var app = {
  _status: { loaded: !1, connected: !1 },
  _confLoaded: !1,
  _list: [],
  safety_ids: [],
  safety_num: {},
  device: {
    uuid: "",
    _UUID: "",
    isNewapp: !1,
    push: null,
    packagename: "",
    app_version: "3.0.0",
    lng: "en",
    browser_lng: "",
    mail: "",
    notif: { felt: !0, notminmag: 0, notmaxdist: 2e4, notiftts: !0 },
    coord: {},
  },
  my: [],
  myEq: [],
  _lang: {},
  _reloaded: [],
  _postpic: [],
  _rating: { pos: [], neg: [] },
  lng_rtl: [],
  _saveLng: {},
  _allLng: {},
  _nearme: 500,
  _home: "home",
  _theme: "normal",
  _storage: window.localStorage,
  setConnected: function (t) {
    (this._status.connected = t),
      t ? $(".menu").addClass("connect") : $(".menu").removeClass("connect");
  },
  findListIndex: function (t) {
    for (var e = 0; e < this._list.length; e++)
      if (this._list[e].type == t) return e;
    return -1;
  },
  findList: function (t) {
    return this._list.find((e, a) => e.type == t);
  },
  load: function (t) {
    var e = this.findList(t),
      a = this;
    setTimeout(function () {
      var i = $(".signif"),
        s = $("#full .list-overf"),
        n = $("#signif .list-overf");
      e.getlist().forEach((e, o) => {
        var r = evids[e];
        "risk" == t
          ? (i.append(a.createEQbox(r)),
            a.setmarker(r),
            n.append(a.createEQbox2(r)))
          : s.append(a.createEQbox2(r)),
          20 == o &&
            setTimeout(function () {
              $("#full").trigger("loaded"), console.log("list:" + t);
            }, 1);
      }),
        "full" == t &&
          setTimeout(function () {
            $("#full").trigger("loaded"), console.log("list:" + t);
          }, 1);
    }, 1);
  },
  loadChunk: function (t, e) {
    var a = this.findList(t),
      i = a.getlist().length,
      s = i < e ? 0 : i - e,
      n = a.getlist().slice(s, i),
      o = this;
    setTimeout(function () {
      var e = $(".signif"),
        a = $("#full .list-overf"),
        i = $("#signif .list-overf");
      n.forEach((s, n) => {
        var r = evids[s];
        "risk" == t
          ? (e.append(o.createEQbox(r)),
            setTimeout(function () {
              o.setmarker(r);
            }, 0),
            i.append(o.createEQbox2(r)))
          : a.append(o.createEQbox2(r));
      });
    }, 0);
  },
  getSignifsFromFull: function (t = 0) {
    var e = [],
      a = app.findList("full"),
      i = a.getlist();
    if (t > 0) {
      var s = a.getlist().length,
        n = s < t ? 0 : s - t;
      i = a.getlist().slice(n, s);
    }
    return (
      i.forEach((t, a) => {
        var i = evids[t];
        i.is_signif() && e.push(i.obj);
      }),
      e
    );
  },
  getEqClass: function (t) {
    var e = [],
      a = [];
    if ("" != t.evtyp) {
      var i = this.getEQtypClass(t.evtyp);
      "" != i && e.push(i);
    }
    if ("" != t.tsunami) {
      var s = this.getEQTsClass(t.tsunami);
      "" != s && e.push(s);
    }
    return e.length > 0
      ? (e.forEach((t, e) => {
          a.push($("<span>", { class: "eq_ " + t }));
        }),
        $("<div>", { class: "eqtyp" }).append(a))
      : [];
  },
  createEQbox: function (t) {
    var e = da.ago(t.timestr),
      a = this.getEqClass(t);
    return $("<div>", {
      "data-id": t.id,
      "data-time": t.time,
      "data-tstr": t.timestr,
      class: "eqs eqs1 c_" + t.id + (t.isNoid ? " noid" : ""),
    })
      .append(
        $("<div>", { class: "mag" })
          .css({ "background-color": t.color })
          .text(t.mag)
          .append($("<span>", { class: "after" }))
      )
      .append(
        $("<div>", { class: "eqinfo" })
          .append(
            $("<div>", { class: "p1" })
              .append($("<div>", { class: "reg" }).text(t.reg))
              .append(a)
          )
          .append(
            $("<div>", { class: "p2" })
              .append($("<div>", { class: "dat b_ic16 b_-icdat" }).text(e))
              .append(
                $("<div>", { class: "dist b_ic16 b_-icposi mydist" }).text(
                  t.distance()
                )
              )
          )
      );
  },
  createEQbox2: function (t) {
    var e = this._lang,
      a = t.distance(),
      i = this.getEqClass(t),
      s = [];
    return (
      t.getCities().forEach((t, e) => {
        s.push($("<span>", { class: "cities br" }).text(t));
      }),
      $("<div>", {
        "data-id": t.id,
        "data-time": t.time,
        "data-tstr": t.timestr,
        class: "eqs eqs2 c_" + t.id + (t.isNoid ? " noid" : ""),
      })
        .append(
          $("<div>", { class: "mag" })
            .css({ "background-color": t.color })
            .append($("<span>", { class: "after" }))
            .append($("<span>").text(t.mag))
            .append($("<div>", { class: "reg" }).text(t.reg))
        )
        .append(
          $("<div>", { class: "eqinfo" })
            .append(
              $("<div>", { class: "p1" })
                .append(
                  $("<div>", { class: "shinb dat b_ic16 b_-icdat" }).text(
                    da.ago(t.timestr)
                  )
                )
                .append(
                  $("<div>", { class: "dat2 b_ic16 b_-icdat" })
                    .append($("<span>", { class: "ymd br" }).text(t.date_f0()))
                    .append(
                      $("<span>", { class: "his br" }).text(
                        t.date_f1() + " UTC"
                      )
                    )
                    .append(
                      $("<span>", { class: "his_local br" }).text(
                        t.date_f1_loc() + " " + e.eq.localtime
                      )
                    )
                )
                .append(
                  $("<div>", {
                    class: "shinb dist b_ic16 b_-icposi mydist",
                  }).text(a)
                )
                .append(
                  $("<div>", { class: "dist2 b_ic16 b_-icposi" })
                    .append(
                      $("<span>", { class: "lat br" }).text(
                        t.latstr + " | " + t.lonstr
                      )
                    )
                    .append($("<span>", { class: "mydist br" }).text(a))
                    .append(
                      $("<span>", { "data-lng": "eq.mydist" }).text(e.eq.mydist)
                    )
                    .append(s)
                )
                .append(
                  $("<div>", { class: "depth b_ic16 b_-icdepth" })
                    .text(t.depthst())
                    .append(
                      $("<span>", { "data-lng": "eq.depth" }).text(e.eq.depth)
                    )
                )
                .append(
                  $("<div>", {
                    class: "shinb nbcomm b_ic16 b_-iccomm",
                    "data-nbcomm": t.nb_comm,
                  })
                    .text(t.nb_comm)
                    .append(
                      $("<span>", { "data-lng": "comm.def" }).text(e.comm.def)
                    )
                )
                .append(
                  $("<div>", { class: "shb more", "data-lng": "eq.more" }).text(
                    e.eq.more
                  )
                )
                .append(
                  $("<div>", { class: "less", "data-lng": "eq.less" }).text(
                    e.eq.less
                  )
                )
            )
            .append(i)
            .append(
              $("<div>", { class: "ifelt ucf", "data-lng": "eq.ifelt" }).text(
                e.eq.ifelt
              )
            )
        )
    );
  },
  createBandeauBox: function (t) {
    var e = da.ago(t.timestr),
      a = this._lang;
    return $("<div>", {
      id: "e_" + t.id,
      "data-id": t.id,
      "data-time": t.time,
      "data-tstr": t.timestr,
      class: "eqs banner c_" + t.id + (t.isNoid ? " noid" : ""),
    })
      .append($("<div>", { class: "mag" }).text(t.mag))
      .append(
        $("<div>", { class: "eqinfo" })
          .append($("<div>", { class: "reg" }).text(t.reg))
          .append($("<div>", { class: "dat b_ic16 b_-icdat" }).text(e))
          .append(
            $("<div>", { class: "dist b_ic16 b_-icposi mydist" }).text(
              t.distance()
            )
          )
          .append(
            $("<div>", { class: "ifelt", "data-lng": "eq.ifelt" }).text(
              a.eq.ifelt
            )
          )
      );
  },
  delAll: function () {
    $(".eqs").remove(),
      (evids = []),
      (this._list = []),
      map.resetGroup(),
      this.loadAllMyEq();
  },
  delEvid: function (t) {
    this._list.forEach((e, a) => {
      e._delete(t);
    }),
      $(".eqs.c_" + t).remove(),
      delete evids[t],
      map.deleteMarkerById(t);
  },
  _find_list_id: function (t) {
    return confL.find((e, a) => e.liste == t).id;
  },
  _find_list_Byid: function (t) {
    return console.log("search ", t), confL.find((e, a) => e.id == t).liste;
  },
  _isGoodForList: function (t, e, a, i) {
    if ("full" == e.type) return !0;
    if ("risk" == e.type) return evids[t].isSignif;
    if ("myeq" == e.type) return e.hasid(t);
    if ("nearme" == e.type) {
      if (this.device.coord.hasOwnProperty("lat")) {
        var a = this.device.coord.lat,
          i = this.device.coord.lon,
          s = evids[t];
        return (
          dist.getDistanceFromLatLonInKm(s.lat, s.lon, a, i) <= app._nearme
        );
      }
      return !1;
    }
    if ("search" == e.type) return e.hasid(t);
  },
  insertOrUpdateEvid: function (t) {
    var e = this,
      a = this.createEQbox2(evids[t]),
      i = this.createEQbox(evids[t]);
    this._list.forEach((s, n) => {
      var o = e._isGoodForList(t, s),
        r = s.hasid(t),
        l = e._find_list_id(s.type);
      if (
        (console.log(
          "insertorupdate",
          "Liste=",
          s.type,
          "id",
          l,
          "id",
          t,
          "hasid",
          r,
          "isgood",
          o
        ),
        r && !o)
      )
        s._delete(t), $("#" + l + " .c_" + t, ".eqs1.c_" + t).remove();
      else if (r && o)
        $(".eqs2.c_" + t + ":not(.eqdetail)").replaceWith(a.clone()),
          console.log("BOX2", a),
          "risk" == s.type
            ? $("#home .signif .c_" + t).replaceWith(i.clone())
            : "myeq" == s.type &&
              $("#home .myeq .c_" + t).replaceWith(i.clone());
      else if (!r && o) {
        var d = s._insert(t);
        if (0 == d)
          $("#" + l + " .list-overf").prepend(a.clone()),
            "risk" == s.type && $(".signif").prepend(i.clone());
        else if (d > -1) {
          var c = $("#" + l + " .eqs").index();
          console.log("st", c),
            $("#" + l + " .list-overf > div:nth-child(" + (c + d) + ")").after(
              a.clone()
            ),
            "risk" == s.type &&
              $(".signif > div:nth-child(" + d + ")").after(i.clone());
        }
      }
    }),
      this._updateMyIndicator(),
      $("body").trigger("loaded");
  },
  _relace_evid: function (t) {
    var e = Object.assign({}, evids[t.id]);
    (evids[t.id] = new evid(t)),
      e.hasOwnProperty("comms") &&
        (evids[t.id].comms = Object.assign({}, e.comms)),
      e.hasOwnProperty("pics") &&
        (evids[t.id].pics = Object.assign({}, e.pics));
  },
  getPopup: function (t) {
    return $("<div>", { class: "leaf-evid" })
      .append($("<div>", { class: "leaf-evid-mag" }).text("M " + t.mag))
      .append($("<div>", { class: "leaf-evid-reg" }).text(t.reg))
      .append($("<div>", { class: "leaf-evid-date" }).text(t.timestr))
      .append(
        $("<div>", { class: "leaf-evid-dep" }).text(
          "Depth: " + dist.kmTogoodUnit(t.depth) + " " + dist.unit
        )
      );
  },
  getgeojsonMarkerOptions: function (t) {
    return {
      radius: 2 * t.mag,
      fillColor: t.color,
      color: t.color,
      opacity: 0.7,
      fillOpacity: 0.6,
    };
  },
  makemarker: function (t) {
    var e = this.getgeojsonMarkerOptions(t);
    return L.circleMarker([t.lat, t.lon], e);
  },
  setmarker: function (t) {
    if (!t.isNoid) {
      var e = this.getPopup(t),
        a = this.getgeojsonMarkerOptions(t);
      t._marker = map
        .addCircleMarker([t.lat, t.lon], a)
        .bindPopup($(e).html(), { className: "pop_" + t.id });
    }
  },
  setUserCoords: function (t, e = !1) {
    console.log("Send User coord", t),
      "undefined" != typeof NativeStorage &&
        NativeStorage.setItem("ucoord", {
          lat: t.coords.latitude,
          lon: t.coords.longitude,
          accuracy: t.coords.accuracy,
          timestamp: t.timestamp,
        }),
      (this.device.coord = {}),
      (this.device.coord.lat = t.coords.latitude),
      (this.device.coord.lon = t.coords.longitude),
      (this.device.coord.accuracy = t.coords.accuracy),
      (this.device.coord.timestamp = t.timestamp);
    var a = function () {
      app._confLoaded
        ? app._saveConf()
        : setTimeout(function () {
            a();
          }, 100);
    };
    a();
    var i = function () {
      app._status.connected && com && void 0 !== com._waited
        ? com.mysend({ label: "new_coords", data: app.device })
        : setTimeout(function () {
            i();
          }, 10);
    };
    if ((i(), !e)) {
      var s = function () {
        app._status.loaded
          ? (app.loadNearMe(), map.addMyMarker())
          : setTimeout(function () {
              s();
            }, 10);
      };
      console.log("launch F2"), s();
    }
    this.updateDistance();
  },
  updateDistance: function () {
    var t = Date.now();
    setTimeout(function () {
      for (let [e, a] of Object.entries(evids))
        setTimeout(function () {
          try {
            "function" == typeof evids[e].distance &&
              $(".eqs.c_" + e + " .mydist").text(evids[e].distance());
          } catch (t) {}
        }, 1);
      console.log("DIST TIME=", Date.now() - t);
    }, 0);
  },
  loadLanguage: function () {
    (traverse2 = function (t, e, a = {}) {
      return (
        null !== (a = t.hasOwnProperty(e[0]) ? t[e[0]] : null) &&
          (e.shift(), e.length > 0 && (a = traverse2(a, e, a))),
        a
      );
    }),
      Date.now(),
      setTimeout(function () {
        $("[data-lng]").each(function () {
          var t = this;
          setTimeout(function () {
            var e = traverse2(app._lang, $(t).attr("data-lng").split("."));
            "string" == typeof e && $(t).html(e);
          }, 0);
        });
      }, 0),
      setTimeout(function () {
        $("[data-lng-pholder]").each(function () {
          var t = this,
            e = traverse2(app._lang, $(t).attr("data-lng-pholder").split("."));
          "string" == typeof e && $(t).attr("placeholder", e);
        });
      }, 1),
      this.saveTTS();
  },
  saveTTS: function () {
    var t = { eq: app._lang.eq0, mag: app._lang.mag };
    (t.tts_enable = app.device.notif.notiftts ? "on" : "off"),
      (t.appLng = app.device.lng),
      (t.phoneLng = "undefined" != typeof device ? device.lngcode : "en-EN"),
      "undefined" != typeof NativeStorage && NativeStorage.setItem("tts", t);
  },
  findMyEq: function (t) {
    var e = null;
    return (
      this.myEq.some((a, i) => {
        var s = t == a.id;
        return s && (e = a), s;
      }),
      e
    );
  },
  findEq: function (t, e = !1) {
    return evids[t];
  },
  EvidNoReports: function (t) {
    this.findEq(t, !0).setNoreports();
  },
  rmMyEq: function (t) {
    $(
      '.myeq .eqs[data-id="' + t + '"], #myeqlist .eqs[data-id="' + t + '"]'
    ).remove(),
      $('.eqs[data-id="' + t + '"]').removeClass("my");
  },
  addMyEq: function (t) {
    $(".nomyeq").hide(),
      $(".myeq").append(this.createEQbox(t)),
      $("#myeqlist .list-overf").append(this.createEQbox2(t)),
      $('.eqs[data-id="' + t.id + '"]').addClass("my"),
      $(".myeq,#myeqlist .list-overf").trigger("sortByTime"),
      $('.myeq .eqs[data-id="' + t.id + '"] .dat').text(t.timef + " UTC");
  },
  toggleMy: function (t) {
    console.log(t),
      (t = "string" == typeof t && t.indexOf("N") >= 0 ? t : parseInt(t));
    var e = this.my.indexOf(t);
    if (e >= 0)
      this.my.splice(e, 1),
        this.myEq.splice(e, 1),
        this.rmMyEq(t),
        this.findList("myeq").tabE.splice(e, 1);
    else {
      this.my.push(t);
      var a = this.findEq(t);
      console.log(a, t),
        this.myEq.push(a.obj),
        this.addMyEq(a),
        this.findList("myeq").tabE.push(t);
    }
    this._saveConf(), console.log("MY", this.my, this.findList("myeq"));
  },
  loadMy: function (t) {
    this.my.push(t.id), this.myEq.push(t), this.addMyEq(t);
  },
  updateMyevid: function (t) {
    console.log("Update My eq", t), (evids[t.id] = new evid(t));
    var e = this.my.indexOf(t.id);
    (this.myEq[e] = t), this._reloaded.push(t.id.toString());
    var a = this;
    return (
      setTimeout(function () {
        a._saveConf();
      }, 50),
      $(".eqs2.c_" + t.id + ":not(.eqdetail)").replaceWith(
        this.createEQbox2(evids[t.id]).clone()
      ),
      $(".eqs1.c_" + t.id).replaceWith(this.createEQbox(evids[t.id]).clone()),
      $(".c_" + t.id + ":not(.my)").addClass("my"),
      evids[t.id]
    );
  },
  _updateMyIndicator: function () {
    this.my.forEach((t, e) => {
      $(".eqs.c_" + t + ":not(.my)").addClass("my");
    });
  },
  CheckUpdateMy: function () {
    var t = !1,
      e = this;
    this.my.forEach((a, i) => {
      console.log("my", a, i),
        evids.hasOwnProperty(a) &&
          JSON.stringify(evids[a].obj) !== JSON.stringify(e.myEq[i]) &&
          ((t = !0),
          (e.myEq[i] = Object.assign({}, evids[a].obj)),
          $(".eqs2.c_" + a + ":not(.eqdetail)").replaceWith(
            e.createEQbox2(evids[a]).clone()
          ),
          $(".eqs1.c_" + a).replaceWith(e.createEQbox(evids[a]).clone()),
          $(".c_" + a).addClass("my"),
          console.log(JSON.stringify(evids[a].obj), " updated"));
    }),
      console.log("UPDATE"),
      t &&
        setTimeout(function () {
          e._saveConf();
        }, 50);
  },
  loadAllMyEq: function () {
    var t = this;
    let e = new list({ type: "myeq", tabs: this.myEq });
    this._list.push(e),
      e.getlist().forEach((e, a) => {
        t.addMyEq(evids[e]);
      }),
      console.log(e);
  },
  _guid: function () {
    function t() {
      return Math.floor((1 + Math.random()) * 65536)
        .toString(16)
        .substring(1);
    }
    return t() + t() + "-" + t() + t() + "-" + t() + t();
  },
  _setNewMyUUID: function () {
    (this.device._UUID = this._guid()),
      (this.device.isNewapp = !0),
      this._storage.setItem("MyUUID", this.device._UUID);
  },
  _saveConf: function () {
    var t = {
      my: this.my,
      myEq: this.myEq,
      device: this.device,
      unit: dist.unit,
      comOrder: this.comOrder,
      safety_ids: this.safety_ids,
      safety_num: this.safety_num,
      nearme: this._nearme,
      home: this._home,
      theme: this._theme,
    };
    console.log("Save Conf", t),
      this._storage.setItem("EMSC_LQ_Settings", JSON.stringify(t)),
      $("body").trigger("SettingsSave"),
      this.saveTTS();
  },
  _loadConf: function () {
    var t = !1;
    (this.device._UUID = this._storage.getItem("MyUUID")),
      console.log("UUID", this.device._UUID),
      this.device._UUID || ((t = !0), this._setNewMyUUID());
    var e = JSON.parse(this._storage.getItem("EMSC_LQ_Settings"));
    console.log("load Cond", e),
      null != e &&
        (e.my && (this.my = e.my),
        e.myEq && (this.myEq = e.myEq),
        e.device && (this.device = e.device),
        e.unit && (dist.unit = e.unit),
        e.nearme && (this._nearme = e.nearme),
        e.safety_ids && (this.safety_ids = e.safety_ids),
        e.safety_num && (this.safety_num = e.safety_num),
        (this.device.isNewapp = t),
        e.home &&
          ((this._home = e.home),
          "home" != e.home &&
            ($(".bt-foot.bt-eqs").trigger("click"),
            setTimeout(function () {
              console.log("Go to list:", e.home),
                $("#list").trigger("golist", e.home);
            }, 200))),
        e.hasOwnProperty("theme") &&
          ((this._theme = e.theme),
          "dark" == e.theme && $("body").addClass("dark")),
        (this._confLoaded = !0));
  },
  LoadNewLng: function () {
    console.log("ici LNG", app._allLng, app._saveLng),
      this._saveLng.hasOwnProperty(this.device.lng) &&
      this._allLng.hasOwnProperty(this.device.lng) &&
      this._saveLng[this.device.lng].lastupdate >=
        this._allLng[this.device.lng].lastupdate
        ? ((this._lang = this._saveLng[this.device.lng]),
          setTimeout(function () {
            app.loadLanguage();
          }, 50))
        : com.getLng(this.device.lng),
      $("body").trigger("ChkLn");
  },
  saveLn: function (t, e) {
    (this._saveLng[t] = e),
      (this._saveLng[t].lastupdate = Date.now() / 1e3),
      this._storage.setItem("EMSC_LNG", JSON.stringify(this._saveLng)),
      this.saveTTS();
  },
  loadLn: function () {
    var t = JSON.parse(this._storage.getItem("EMSC_LNG"));
    this._saveLng = null == t ? {} : t;
  },
  createCommBox: function (t, e) {
    var a = new comment(e),
      i = this._lang;
    (a.dist_epi = dist
      .getDistanceFromLatLonInKm(t.lat, t.lon, a.lat, a.lon)
      .toFixed(0)),
      (a.T0 = da.ago2(t.timestr, a.timestr, !1));
    var s = t.isNoid
      ? ""
      : [
          " (",
          $("<span>", { class: "cdepth" }).text(
            dist.kmTogoodUnit(a.dist_epi) + " " + i.unit2[dist.unit]
          ),
          " ",
          $("<span>", { "data-lng": "eq.dist" }).text(i.eq.dist),
          ") ",
        ];
    return $("<div>", {
      id: "comm_" + a.id,
      "data-id": a.id,
      "data-time": a.time,
      "data-dist": a.dist_epi,
      "data-note": a.posdif,
      class: "comment",
    })
      .append(
        $("<div>", { class: "city" })
          .append($("<span>").text(a.city + ", " + a.country))
          .append(s)
      )
      .append($("<div>", { class: "thecomm" }).text(a.comm))
      .append($("<span>", { class: "posneg pos" }).text(a.posdif))
      .append($("<span>", { class: "posneg neg" }))
      .append($("<span>", { class: "ctime" }).text("T0 + " + a.T0));
  },
  createPicBox: function (t, e) {
    console.log(e);
    var a = new Pic(e),
      i = a.url;
    return a.isVideo
      ? $("<video>", {
          class: "pic",
          controls: "true",
          playsinline: "true",
        }).append($("<source>", { src: i, type: "video/" + a.ext }))
      : $("<img>", { class: "pic", src: a.url_th, "data-src": a.url });
  },
  createPicBoxv2: function (t, e) {
    console.log(e);
    var a,
      i = new Pic(e),
      s = i.url;
    return (
      (a = i.isVideo
        ? $("<video>", {
            class: "pic",
            controls: "true",
            playsinline: "true",
          }).append($("<source>", { src: s, type: "video/" + i.ext }))
        : $("<img>", { class: "pic", src: i.url_th, "data-src": i.url })),
      $("<div>", { class: "dpic" })
        .append(a)
        .append(
          $("<div>", { class: "dpiccomm" }).append(
            $("<div>", { class: "comment" })
              .append(
                $("<div>", { class: "city" }).append(
                  $("<span>").text(i.city + ", " + i.country)
                )
              )
              .append($("<div>", { class: "thecomm" }).text(i.comm))
          )
        )
    );
  },
  _stURL: function (t) {
    try {
      var e = new URL(t);
      return EmscConfig._static + e.pathname;
    } catch (a) {
      return console.log("error_url", t), t;
    }
  },
  addData: function (t) {
    return (
      (t.coords = this.device.coord),
      (t.questid = app.device.uuid + "_" + Date.now()),
      (t.quest_time = Date.now()),
      (t.cookie = app.device.packagename),
      (t.cookie2 = app.device.uuid),
      (t.email = app.device.mail),
      t
    );
  },
  sendFear: function (t) {
    (t = this.addData(t)), com.mysend({ label: "post_fear", data: t });
  },
  sendQuest: function (t) {
    ((t = this.addData(t)).with_media = app._postpic.length > 0),
      console.log(t),
      com.mysend({ label: "post_quest", data: t }),
      app._postpic.length > 0 && app.sendPics(t);
  },
  sendPics: function (t) {
    setTimeout(function () {
      app._postpic.forEach((e, a) => {
        console.log(e, a), new Capture(e, t, Date.now() + "_" + a).upload();
      });
    }, 2);
  },
  UploadInWaiting: function () {
    var t = JSON.parse(app._storage.getItem("EmscMedia")) || {};
    for (var e in (console.log("upload waiting", JSON.stringify(t)), t))
      setTimeout(function () {
        var a = new File([""], t[e].Thefile.name, { type: t[e].Thefile.type });
        new Capture(a, t[e].data, e)._goto(t[e].NextUpdPart).upload();
      }, 2);
    0 == Object.keys(t).length &&
      setTimeout(function () {
        $("body").trigger("delete_existing_files");
      }, 500);
  },
  sendRate: function (t) {
    console.log(t), com.mysend({ label: "rate_save", data: t });
  },
  getEQtypClass: function (t) {
    if ("sonic" == t) return "eq_-sonic";
    if ("volcano" == t) return "eq_-volcan";
    if ("explosion" == t) return "eq_-explosion";
    if ("landslide" == t) return "eq_-landslide";
    if ("induced" == t) return "eq_-forage";
    else return "";
  },
  getEQTsClass: function (t) {
    return "NO" == t
      ? "eq_-tsunami_no"
      : "INFORMATION" == t
      ? "eq_-tsunami_yesno"
      : "WARNING" == t
      ? "eq_-tsunami"
      : "";
  },
  CorrectEq: function (t, e, a, i) {
    console.log("Correct Evid", t, arguments),
      "comm" == e &&
        ($(".c_" + t + " .eqinfo .nbcomm").attr("data-nbcomm", i),
        $(".c_" + t + " .eqinfo .nbcomm").html(
          $(".c_" + t + " .eqinfo .nbcomm")
            .html()
            .replace(a, i)
        ));
  },
  registerSafetyToOpen: function () {
    $("#safetymsg0").show();
  },
  getNearMeFromFull: function () {
    var t = [],
      e = this.findList("full");
    if (void 0 === e || "function" != typeof e.getlist) return t;
    var a = e.getlist(),
      i = this.device.coord.lat,
      s = this.device.coord.lon;
    return (
      a.forEach((e, a) => {
        var n = evids[e];
        dist.getDistanceFromLatLonInKm(n.lat, n.lon, i, s) <= app._nearme &&
          t.push(n.obj);
      }),
      t
    );
  },
  loadNearMe: function () {
    if ((console.log("Load Near ME"), -1 == this.findListIndex("nearme"))) {
      var t = this.getNearMeFromFull(),
        e = new list({ type: "nearme", tabs: t });
      this._list.push(e),
        setTimeout(function () {
          var t = $("#nearme .list-overf");
          e.getlist().forEach((e, a) => {
            t.append(app.createEQbox2(evids[e]));
          }),
            console.log("Fin nearme");
        }, 0),
        $("body").trigger("loaded");
    }
    console.log(this._list);
  },
  reloadNearMe: function () {
    $("#nearme .list-overf").empty();
    let t = this.findListIndex("nearme");
    t >= 0 && this._list.splice(t, 1),
      console.log(this._list.length),
      this.loadNearMe(),
      console.log(this._list);
  },
  docAsHWA: function () {
    let t = (() => {
      let t = (t = !1) => {
        let e = document.createElement("canvas"),
          a = e.getContext("2d", { willReadFrequently: t });
        return (
          a.moveTo(0, 0),
          a.lineTo(120, 121),
          a.stroke(),
          a.getImageData(0, 0, 200, 200).data.join()
        );
      };
      return t(!0) !== t(!1);
    })();
    return console.log({ hasHWA: t }), t;
  },
};
class Capture {
  constructor(t = {}, e = {}, a, i = !1) {
    return (
      (this.file = t),
      (this.data = Object.assign({}, e)),
      (this.id = a),
      (this.Live = i),
      (this.chunk = 0),
      (this.chunkSize = 4194304),
      (this.chunks = Math.ceil(this.file.size / this.chunkSize)),
      (this._file = { name: t.name, type: t.type, size: t.size }),
      t.hasOwnProperty("fullPath") && (this._file.fullPath = t.fullPath),
      (this.data.MyQid = a),
      (this.data.params = {
        portion: this.chunk,
        portionL: this.chunks,
        type: this.file.type,
        name: this.file.name,
        Live: this.Live,
        uuid: app.device.uuid,
        lq_uuid: app.device._UUID,
      }),
      console.log("init upload", a, Object.assign({}, this.data), this.data),
      this._save(),
      this
    );
  }
  _goto(t) {
    return (this.chunk = t), this;
  }
  upload() {
    console.log("upload", this, Object.assign({}, this)),
      (this.data.params.portion = this.chunk),
      (this._start = this.chunk * this.chunkSize),
      (this._end =
        this.start + this.chunkSize >= this.file.size
          ? this.file.size
          : this._start + this.chunkSize);
    var t =
        "slice" in this.file
          ? this.file.slice(this._start, this._end)
          : this.file,
      e = this;
    Object.assign({}, this.data);
    var a = new FileReader();
    (a.onloadend = function () {
      var t = this.result;
      e._sendData(t);
    }),
      console.log("f0", t);
    try {
      a.readAsArrayBuffer(t);
    } catch (i) {
      console.log("error reading file"), this._remove();
    }
  }
  _sendData(t) {
    console.log(
      "send upload0",
      Object.assign({}, this.data),
      JSON.stringify(this.data),
      this
    ),
      com._ws_post_data(this.data, t, this._success, this);
  }
  _success() {
    console.log("success", this),
      console.log("upload success", arguments),
      this.chunk++,
      this.chunk > this.chunks - 1
        ? (console.log("upload finished", this.id, this.file), this._remove())
        : (this._save(), this.upload());
  }
  _save() {
    var t = JSON.parse(app._storage.getItem("EmscMedia")) || {};
    (t[this.id] = {
      NextUpdPart: this.chunk,
      Thefile: this._file,
      data: this.data,
    }),
      app._storage.setItem("EmscMedia", JSON.stringify(t)),
      console.log("SAVu save: " + JSON.stringify(t)),
      console.log("******************");
  }
  _remove() {
    var t = JSON.parse(app._storage.getItem("EmscMedia")) || {};
    console.log(typeof t + "  " + JSON.stringify(t) + " " + this.id),
      delete t[this.id],
      app._storage.setItem("EmscMedia", JSON.stringify(t));
  }
  dispose() {
    for (var t in this) this[t] = null;
  }
}
class Pic {
  constructor(t = {}) {
    (this.obj = t), (this.id = t.id);
    var e = t.properties;
    (this.ext = e.url.split(".").slice(-1)[0]),
      console.log("EXT", this.ext),
      (this.url = app._stURL(e.url)),
      (this.url_th = "" != e.url_th ? app._stURL(e.url_th) : ""),
      (this.isVideo =
        0 >
        $.inArray(this.ext.toLowerCase(), [
          "png",
          "jpg",
          "jpeg",
          "bmp",
          "tiff",
        ])),
      (this.comm = e.comm
        .replace(/&amp;/g, "")
        .replace(/&nbsp;/g, "")
        .replace(/nbsp;/g, "")),
      (this.city = e.city),
      (this.country = e.country);
  }
}
class comment {
  constructor(t = {}) {
    (this.obj = t), (this.id = t.id);
    var e = t.properties;
    (this.time = e.time.time),
      (this.timestr = e.time.time_str),
      (this.dist_epi = e.dist_epi),
      (this.city = e.city),
      (this.country = e.country),
      (this.comm = e.comm),
      (this.pos = e.rate.pos),
      (this.neg = e.rate.neg),
      (this.posdif = this.pos - this.neg),
      (this.lat = t.geometry.coordinates[1]),
      (this.lon = t.geometry.coordinates[0]);
  }
}
class evid {
  constructor(t = {}) {
    (this.obj = t), (this.id = t.id);
    var e = t.properties;
    (this.url = "/Earthquake_information/earthquake.php?id=" + this.id),
      (this.time = e.time.time),
      (this.tz = e.time.tz),
      (this.timestr = e.time.time_str),
      (this.timef = this.date_format(this.time)),
      (this.mag =
        null == e.magnitude.mag ? e.magnitude.mag : e.magnitude.mag.toFixed(1)),
      (this.depth = e.depth.depth),
      (this.reg = e.place.region),
      (this.cities = e.place.cities),
      (this.lat = e.location.lat),
      (this.lon = e.location.lon),
      (this.latstr =
        this.lat < 0 ? Math.abs(this.lat) + " S" : this.lat + " N"),
      (this.lonstr =
        this.lon < 0 ? Math.abs(this.lon) + " W" : this.lon + " E"),
      null == this.lat && ((this.latstr = ""), (this.lonstr = "")),
      (this.maps = e.maps),
      (this.color = e.effects.pref_color.hexa),
      (this.nb_comm = e.effects.nb_comm),
      (this.nb_pics = e.effects.nb_pics),
      (this.isNoid = e.hasOwnProperty("noid")),
      (this.isSignif = "grey" != e.effects.pref_color.string),
      (this.SafeEnable = e.hasOwnProperty("safe_enable") && 1 == e.safe_enable),
      (this.hasIntensityMap = e.maps.hasOwnProperty("intensity")),
      (this.evtyp = e.hasOwnProperty("evtyp") ? e.evtyp : ""),
      (this.tsunami = e.tsunami.state),
      (this.tsunami_links = e.tsunami.link),
      "NONE" == this.tsunami && (this.tsunami = ""),
      (this.safe_enable = 0 != e.safe_enable),
      (this.distkm = null);
  }
  is_signif() {
    return this.isNoid || this.isSignif;
  }
  date_f0() {
    var t = new Date(1e3 * this.time).utc() || arguments[0],
      e = t.getFullYear(),
      a = t.getMonth() + 1,
      i = t.getDate();
    return e + "-" + (a < 10 ? "0" + a : a) + "-" + (i < 10 ? "0" + i : i);
  }
  date_f1() {
    var t = new Date(1e3 * this.time).utc() || arguments[0],
      e = t.getHours(),
      a = t.getMinutes(),
      i = t.getSeconds();
    return (
      (e < 10 ? "0" + e : e) +
      ":" +
      (a < 10 ? "0" + a : a) +
      ":" +
      (i < 10 ? "0" + i : i)
    );
  }
  date_f1_loc() {
    var t = new Date(1e3 * this.time).utc() || arguments[0];
    t = new Date(1e3 * this.time + 6e4 * this.tz);
    var e = (t = new Date(1e3 * this.time)
        .utc()
        .setTimeZoneOffset(this.tz)).getHours(),
      a = t.getMinutes(),
      i = t.getSeconds();
    return (
      (e < 10 ? "0" + e : e) +
      ":" +
      (a < 10 ? "0" + a : a) +
      ":" +
      (i < 10 ? "0" + i : i)
    );
  }
  date_format() {
    var t = new Date(1e3 * this.time).utc();
    return this.date_f0(t) + " " + this.date_f1(t);
  }
  depthst() {
    return dist.kmTogoodUnit(this.depth) + " " + app._lang.unit2[dist.unit];
  }
  distance() {
    return !this.isNoid &&
      (!this.distkm &&
        app.device.coord.hasOwnProperty("lat") &&
        (this.distkm = Math.round(
          dist.getDistanceFromLatLonInKm(
            this.lat,
            this.lon,
            app.device.coord.lat,
            app.device.coord.lon
          )
        )),
      this.distkm)
      ? "km" == dist.unit
        ? dist.format(this.distkm) + " " + dist.unitToLocal()
        : dist.format(dist.tomiles(this.distkm)) + " " + dist.unitToLocal()
      : "? " + dist.unitToLocal();
  }
  getCities() {
    var t = [];
    return (
      this.obj.properties.place.cities.forEach((e, a) => {
        t.push(dist.convert(e.dist));
      }),
      t
    );
  }
  setNoreports() {
    this.hasIntensityMap = !1;
  }
  getMap(t) {
    var e = this.maps.hasOwnProperty(t) ? this.maps[t] : "";
    return app._stURL(e);
  }
  addComms(t) {
    this.comms = t;
  }
}
var evids = {};
class list {
  constructor({ type: t, tabs: e = [], chunked: a = !1 }) {
    (this.tabE = []),
      (this._chunked = a),
      (this.waited = []),
      (this.type = t),
      (this.tabJ = e),
      this.load(e);
  }
  getlist() {
    return this.tabE;
  }
  load(t) {
    t.forEach((t, e) => {
      var a = new evid(t);
      (evids[a.id] = a), this.tabE.push(a.id.toString());
    });
  }
  addMore(t) {
    (this.tabJ = this.tabJ.concat(t)), this.load(t);
  }
  _ChunkEnd() {
    this._chunked = !1;
    var t = this;
    this.waited.forEach((e, a) => {
      t[e.f].apply(t, e.args);
    }),
      (this.waited = []);
  }
  _wait(t, e) {
    this.waited.push({ f: t, args: e });
  }
  hasid(t) {
    return this.tabE.includes(t.toString());
  }
  _find(t) {
    for (var e = 0; e < this.tabE.length; e++)
      if (this.tabE[e] == t.toString()) return e;
  }
  _delete(t) {
    if (this.hasid(t)) {
      var e = this._find(t);
      console.log("delete", t, this.type, "index", e),
        e >= 0 && (this.tabJ.splice(e, 1), this.tabE.splice(e, 1));
    }
  }
  _update(t) {}
  _insertOrUpdate(t) {
    if (this._chunked) {
      this._wait("_insertOrUpdate", Array.from(arguments));
      return;
    }
    var e = arguments[1] || function () {},
      a = new evid(t),
      i = a.id,
      s = this._find(i);
    if (s >= 0) {
      var n = this.tabE[s];
      this.is_goodFor_List(a)
        ? (this._update(a, t, s), e(a, "update", s, n))
        : (this._delete(i), e(a, "remove", s));
    } else (s = this._insert(a, t)), e(a, "insert", s);
  }
  _insert(t) {
    for (var e = evids[t].time, a = 0; a < this.tabE.length; a++)
      if (e > evids[this.tabE[a]].time)
        return (
          console.log("insert", t, this.type, "index", a),
          this.tabE.splice(a, 0, t.toString()),
          this.tabJ.splice(a, 0, evids[t].obj),
          a
        );
    return -1;
  }
  is_goodFor_List(t) {
    return !!("risk" == this.type && t.is_signif()) || "full" == this.type;
  }
}
var dist = {
  unit: "km",
  format: function (t) {
    return this.formate(t, app.device.lng);
  },
  unitToLocal: function () {
    var t = arguments[0] || this.unit;
    return app._lang.unit[t];
  },
  getDistanceFromLatLonInKm: function (t, e, a, i) {
    var s = 6371,
      n = this.deg2rad(a - t),
      o = this.deg2rad(i - e),
      r =
        Math.sin(n / 2) * Math.sin(n / 2) +
        Math.cos(this.deg2rad(t)) *
          Math.cos(this.deg2rad(a)) *
          Math.sin(o / 2) *
          Math.sin(o / 2);
    return s * (2 * Math.atan2(Math.sqrt(r), Math.sqrt(1 - r)));
  },
  deg2rad: function (t) {
    return t * (Math.PI / 180);
  },
  rad2deg: function (t) {
    return t * (180 / Math.PI);
  },
  todeg_bearing: function (t) {
    return (this.rad2deg(t) + 360) % 360;
  },
  getAngle: function (t, e, a, i) {
    var s = this.deg2rad(i - e),
      n = Math.log(
        Math.tan(this.deg2rad(a) / 2 + Math.PI / 4) /
          Math.tan(this.deg2rad(t) / 2 + Math.PI / 4)
      );
    return (
      Math.abs(s) > Math.PI &&
        (s = s > 0 ? -(2 * Math.PI - s) : 2 * Math.PI + s),
      this.todeg_bearing(Math.atan2(s, n))
    );
  },
  getDirection: function () {
    var t =
        4 == arguments.length
          ? this.getAngle(
              arguments[0],
              arguments[1],
              arguments[2],
              arguments[3]
            )
          : arguments[0],
      e = [];
    (e.N = 0),
      (e.NE = 45),
      (e.E = 90),
      (e.SE = 135),
      (e.S = 180),
      (e.SW = 225),
      (e.W = 270),
      (e.NW = 315);
    var a = 1e3,
      i = "";
    for (var s in e) {
      var n = e[s] - t;
      Math.abs(n) < a && ((a = Math.abs(n)), (i = s));
    }
    return i;
  },
  kmTogoodUnit: function (t) {
    return this.tomiles(t);
  },
  tomiles: function (t, e = !1) {
    return "mi" == this.unit || e ? Math.round(0.62137 * t) : t;
  },
  tokm: function (t, e = !1) {
    return "km" == this.unit || e ? Math.round(t / 0.62137) : t;
  },
  formate: function (t, e) {
    return e ? Number(t).toLocaleString(e) : t;
  },
  convert: function (t) {
    var e = arguments[1] || null,
      a = this;
    return t.replace(/(\d+\s?\.?\d*)\W(km|mi)/, function (t, i, s) {
      return ((i = i.replace(/\s/g, "")), "km" == s && s != a.unit)
        ? a.formate(a.tomiles(i), e) + " " + a.unitToLocal("mi")
        : "mi" == s && s != a.unit
        ? a.formate(a.tokm(i), e) + " " + a.unitToLocal("km")
        : t;
    });
  },
};
String.prototype.replaceArray = function (t, e) {
  for (var a = this, i = 0; i < t.length; i++)
    a = a.replace(RegExp("\\b" + t[i] + "\\b", "i"), e[i]);
  return a;
};
var da = {
  _d: new Date(),
  _labels: ["Yesterday", "just now", "days", "weeks", "ago", "hr", "min"],
  _agoBefore: ["ar", "sr"],
  _agoDisp: ["sw"],
  set: function (t) {
    return (this._d = new Date(t)), this;
  },
  setTimeZoneOffset: function (t) {
    return this.set(this.getTime() + 6e4 * t);
  },
  isoTimezone: function (t) {
    var e = Math.abs(t),
      a = parseInt(e / 60, 10),
      i = e % 60;
    return [
      t < 0 ? "-" : "+",
      a < 10 ? "0" : "",
      a,
      ":",
      i < 10 ? "0" : "",
      i,
    ].join("");
  },
  formatAgo: function (t) {
    return t < 10 ? "0" + t : t;
  },
  formatDate: function (t) {
    return [
      t.getUTCFullYear(),
      this.formatAgo(t.getUTCMonth() + 1),
      this.formatAgo(t.getUTCDate()),
    ].join("-");
  },
  _ago: function (t) {
    var e = arguments[2] ? " ago" : "",
      a = arguments[1] ? new Date(arguments[1]) : new Date(),
      i = new Date(t || ""),
      s = (a.getTime() - i.getTime()) / 1e3,
      n = Math.floor(s / 86400);
    return n >= 31
      ? this.formatDate(i)
      : isNaN(n) || n < 0
      ? ""
      : (0 == n &&
          ((s < 60 && "just now") ||
            (s < 120 && "1 min" + e) ||
            (s < 3600 && Math.floor(s / 60) + " min" + e) ||
            (s < 86400 &&
              Math.floor(s / 3600) +
                " hr " +
                this.formatAgo(Math.floor(s / 60 - 60 * Math.floor(s / 3600))) +
                " min" +
                e))) ||
        (1 == n && "Yesterday") ||
        (n < 7 && n + " days" + e) ||
        (n < 31 && Math.ceil(n / 7) + " weeks" + e);
  },
  ago: function (t) {
    var e = arguments[1] || null,
      a = !1 !== arguments[2],
      i = app.device.lng,
      s = app._lang.ago
        ? this._ago(t, e, a).replaceArray(this._labels, app._lang.ago)
        : this._ago(t, e, a);
    return this.formatLng(i, s);
  },
  ago2: function (t) {
    var e = arguments[1] || null;
    arguments[2];
    var a = this._ago(t, e, !1);
    "just now" == a && (a = "1 min");
    var i = app._lang.ago ? a.replaceArray(this._labels, app._lang.ago) : a;
    return this.formatLng(app.device.lng, i);
  },
  refreshAgo: function () {
    var t = this;
    $(".dat").each(function () {
      $(this).text(t.ago($(this).parents(".eqs").attr("data-tstr")));
    });
  },
  formatLng: function (t, e) {
    var a = e;
    if (
      $.inArray(t, this._agoBefore) > -1 &&
      app._lang.ago &&
      e.endsWith(app._lang.ago[4])
    )
      a = app._lang.ago[4] + " " + e.replace(app._lang.ago[4], "");
    else if ($.inArray(t, this._agoDisp) > -1) {
      var i = /(\d+) (\w+)/gm,
        s = "$2 $1";
      a = e.replace(i, s);
    }
    return a;
  },
};
app._lang = {
  ago: ["yesterday", "just now", "days", "weeks", "ago", "hr", "min"],
  unit2: { km: "km", mi: "mi" },
  unit: { title: "unit", km: "kilometers", mi: "miles" },
  submit: "submit",
  min: "min",
  max: "max",
  send: "send",
  eq0: "earthquake",
  mag: "magnitude",
  home: {
    btfelt: "i felt an earthquake",
    signif: "significants earthquakes",
    viewall: "see more",
    gmap: "global map",
    expmap: "explore the map",
    saftips: "safety tips",
    myeq: "my earthquakes",
    nearme: "earthquakes near me",
    searchlist: "search results",
    faq: "FAQ",
    nomyeq: "You don't have saved earthquakes.",
  },
  foot: { home: "home", eqs: "earthquakes lists", settings: "settings" },
  all: { title: "all Earthquakes", save: "save" },
  comm: { def: "comments", ori: "show original", trans: "show translation" },
  eq: {
    more: "see more details",
    less: "see less details",
    ifelt: "i felt this earthquake",
    mydist: "of your location",
    dist: "from epicenter",
    depth: "deep",
    map: "maps",
    comms: "comments",
    pics: "pictures",
    lnall: "see more",
    search: "search",
    searchbt: "search",
    listsett: "earthquake view settings",
    did: "did you feel this earthquake?",
    help: "help others by sharing your experience and uploading images",
    localtime: "local time",
  },
  ts: {
    linkptwc: "more info at: ",
    tsno: "no tsunami expected. ",
    tsinfo: "tsunami evaluation in progress. ",
    tswarn: "tsunami warning. ",
  },
  menu: {
    menu: "menu",
    profile: "settings",
    myeq: "saved earthquakes",
    searchlist: "search results",
    safcheck: "safety check",
    saftips: "safety tips",
    manual: "user manual",
    faq: "frequently asked questions",
    tou: "terms of use",
    ch_info: "information channels",
    about: "about",
    bug: "report a bug",
    saftipseq: "earthquake",
    saftiptsu: "tsunami",
    donate: "donate",
    sponsor: "sponsors",
  },
  prof: {
    title: "settings",
    ti1: "your settings",
    ti2: "notifications",
    email: "email (optional)",
    lang: "language",
    home: "home page",
    notif2: "felt earthquakes near me",
    notif2_1: "magnitude min",
    notif2_2: "distance max",
    tts: "voice notification",
    help0:
      "we will only use your e-mail address to contact you if we have a scientific question or to help you if you have a technical problem with the app.",
    help1:
      "by default you receive notifications for small magnitude  earthquakes close to you, and for larger earthquakes at longer distance.",
    help2:
      "you will not receive notification for earthquake with magnitude inferior at this value, even if it is very close of you.",
    help3:
      "you will not receive notification for earthquake at distance superior at this value, even if magnitude is very high.",
    restrict: "restrict number of notifications",
    area: "notification areas",
    theme: "dark mode",
  },
  safe: {
    s0: "in case of destructive earthquake, inform your friends and family that you are out of danger by sending them an SMS.",
    ti1: "your contacts",
    edit: "edit",
    warn: "safety check",
    title: "safety check",
    title1: "inform your relatives that you are out of danger",
    title2: "you appear to be in the area affected by the earthquake",
    gps: "include my GPS position",
    cont: "contacts",
    cost: "according to the operator and the country, sending an SMS may incur additional charges.",
    p1: "are you safe?",
    q0: "I'm safe",
    q1: "I'm not in the area",
  },
  search: { date: "date", mag: "magnitude", felt: "felt", flynn: "region" },
  rep: {
    title: "i felt an earthquake",
    next: "next",
    lvcomm: "leave a comment",
    lvhelp:
      "share your testimony to help others and the scientific community, and if relevant add a picture of damages.",
    pic: "add a photo to show damage",
    thank: "thank you for your testimony",
    thank2:
      "your testimonies help other people affected by earthquakes and EMSC seismologists track earthquakes around the world.",
    floor: "which floor ?",
    p0: "Please click on the picture that resembles how you experienced the earthquake",
    loc: "Your location is essential to provide a valid scientific testimony about the shaking you experienced. Please authorise location sharing.",
  },
  tips: {
    title: "safety tips",
    eq: "earthquake",
    tsu: "tsunami",
    incase: "in case of an earthquake",
    sure: "make sure you are in safe place and review precautions.",
  },
  faq: {
    title: "frequently asked questions",
    incase: "have a question?",
    sure: "make sure to check out our rich base of frequently asked questions. You can even use this sections to learn more about earthquakes!",
  },
  tou: { title: "terms of use" },
  bug: {
    email: "email",
    title: "report a bug",
    pholder: "describe here the bug you encountered",
  },
  about: {
    title: "about",
    vers: "application version",
    design: "Designed by",
    made: "developed by",
    translated_by: "translated by",
  },
  manual: {
    t1: "1. The earthquakes in the LastQuake app are categorized by color:",
    t2: "2. Pics and videos of interest",
    t3: "3. Geolocation and notifications",
    c0: "Earthquake not known to be felt.",
    c1: "Earthquake felt locally and/or low shaking level. No damage expected.",
    c2: "Earthquake felt at larger distances. Shaking can be locally strong. No significant damage expected.",
    c3: "Widely felt earthquake with strong local shaking. Possibility of local and/or minor damage.",
    c4: "Major felt earthquake and strong shaking level. Damage to be expected at short epicentral distances and/or for sub-standard buildings.",
    c5: "Earthquake known to be destructive.",
    c6: "Earthquake not known to be felt and Tsunami Information issued.",
    c7: "Earthquake not known to be felt and Tsunami Warning issued.",
    c8: "Tsunami Information or Tsunami Warning issued by the Pacific Tsunami Warning Center. The icon can be associated to any of the above colors.",
    c80: "The icon can be associated to any of the above colors.",
    c82: "Tsunami evaluation in progress.",
    c83: "More information to come.",
    c84: "No tsunami risk.",
    p1: "For any information about tsunamis, please report to the PTWC website:",
    p20: "We are looking for pictures about earthquakes' impacts:",
    p21: "Please send only images that you take yourself. The EMSC respects copyright laws.",
    p30: "The geolocation used by our notification service is your geolocation from the last time you opened the LastQuake app. In order to offer you a better service, don't forget to launch the app when traveling.",
    li0: "Damage within its context (buildings, bridges, roads,... not too up close);",
    li1: "Effects on landscapes (landslides, liquefactions, ground's failures...);",
    li2: "While respecting people's dignity.",
    c9_0: "Felt earthquake.",
    c9_1: "No location and no magnitude yet.",
    c9: "Shaking triggered by explosion.",
    c10: "Shaking triggered by drilling.",
    c11: "Shaking triggered by landslide.",
    c12: "Shaking triggered by meteorite.",
    c13: "Shaking triggered by sonic boom.",
    c14: "Shaking triggered by volcano eruption.",
  },
  chann: {
    twitter_desc:
      "Official EMSC X channel where to find rapid earthquake information as well as educational tweets about seismology and earthquake preparedness.",
    bsky_desc:
      "Official EMSC BlueSky channel where to find rapid earthquake information as well as educational tweets about seismology and earthquake preparedness.",
    telegram_desc:
      "The EMSC now operates a Telegram Bot; it is free and ad-free, and will allow you to receive personalized information about felt earthquakes around you! - Join the service @LastQuake at https://t.me/lastquake_bot.",
    desktop_desc:
      "EMSC website for desktop where to find rapid earthquake information and testimonies from the eyewitnesses, as well as in-depth information about the EMSC.",
    mobile_desc:
      "EMSC website for mobile devices where to find rapid earthquake information. The mobile device also gathers eyewitnesses' testimonies when an earthquake occurs.",
    app_desc:
      "Free and ad-free mobile application informing citizens in case of an earthquake and gathering their testimonies in the aftermath via comments, pictures, and videos.",
    telegram_tl: "Telegram Bot",
    desktop_tl: "Desktop",
    mobile_tl: "Mobile",
    app_tl: "LastQuake app",
  },
  donate: {
    title: "Would you like to support us?",
    description:
      "We are a non-profit, non governmental organization. We offer free and ad-free services. Thanks to your help we can further the collective knowledge on earthquake and their mitigation.",
    select: "Select your gift amount",
    more: "more",
    make_payment: "Make your payment by CB card or PayPal!",
    donor_privacy: "Donor Privacy Policy",
    description_privacy:
      "We do not share, sell, or trade your personal information with anyone.",
    thanks: "Thank you for your donation",
  },
  fear: {
    thank0: "Earthquake Fear Survey",
    thank1:
      "Answer this short survey to help us understand the emotional impact of earthquakes",
    start: "Start Survey",
    title: "Earthquake Fear Survey",
    t2: "Share your experience",
    p0: "Earthquakes affect people both physically and emotionally. By completing this short survey, you'll help us understand the psychological effects, such as fear and anxiety, that earthquakes cause. The data will contribute to research into how seismic events affect mental health and well-being. Your participation is key to finding solutions to better support those affected emotionally by earthquakes.",
    q1: "1. I am very fearful about earthquake",
    q2: "2. Thinking about the earthquake disturbs me",
    q3: "3. My hands shake when I think about the earthquake",
    q4: "4. I am very afraid of losing my life in an earthquake",
    q5: "5. I get anxious and worried when I watch news and stories about earthquakes in the media",
    q6: "6. Worry about being caught in an earthquake keeps me awake",
    q7: "7. My heartbeat speeds up when I think about being caught in an earthquake",
    r0: "strongly disagree",
    r1: "disagree",
    r2: "neutral",
    r3: "agree",
    r4: "strongly agree",
    exp: "Please rate each statement from 1 to 5",
    exp2: "1 = Strongly disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly agree",
    ref: "Reference (Prizmić-Larsen et al., 2023): ",
  },
};
