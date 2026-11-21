/* Val Thorens gaps model: one source for the gaps checklist (gaps.html) and the visual apartment interface.
   Data: Firebase inspections (Ops) + gapChecks (who marked what) + Frank's repair marks (/api/frank).
   Rule: a gap from an inspection saved before the baseline cutoff counts as done, except bedding
   (mattresses, blankets, pillows) in apartments that are new this season. A manual mark wins only if it is
   newer than the inspection; a later inspection that still reports the gap reopens it. */
(function (root) {
  var DB = "https://val-thorens-ops-default-rtdb.europe-west1.firebasedatabase.app";
  var DATA = {"apts": [{"id": "altineige-203", "name": "Altineige 203", "b": "altineige", "cap": 5, "new": false}, {"id": "altineige-208", "name": "Altineige 208", "b": "altineige", "cap": 4, "new": false}, {"id": "le-serac-j10", "name": "Le Sérac J10", "b": "le-serac", "cap": 2, "new": false}, {"id": "le-serac-k10", "name": "Le Sérac K10", "b": "le-serac", "cap": 6, "new": false}, {"id": "neves-67", "name": "Neves 67", "b": "neves", "cap": 5, "new": false}, {"id": "neves-194", "name": "Neves 194", "b": "neves", "cap": 6, "new": false}, {"id": "olympiades-112", "name": "Olympiades 112", "b": "olympiades", "cap": 2, "new": false}, {"id": "la-vanoise-473", "name": "La Vanoise 473", "b": "la-vanoise", "cap": 3, "new": false}, {"id": "dome-de-polset-315", "name": "Dome 315", "b": "dome-polset", "cap": 3, "new": false}, {"id": "machu-801", "name": "Machu 801", "b": "temple-soleil", "cap": 5, "new": false}, {"id": "machu-803", "name": "Machu 803", "b": "temple-soleil", "cap": 5, "new": false}, {"id": "machu-603", "name": "Machu 603", "b": "temple-soleil", "cap": 5, "new": false}, {"id": "pichu-408", "name": "Pichu 408", "b": "temple-soleil", "cap": 5, "new": false}, {"id": "cusco-h26", "name": "Cuzco 26H", "b": "temple-soleil", "cap": 6, "new": false}, {"id": "cusco-e18", "name": "Cuzco E18", "b": "temple-soleil", "cap": 6, "new": false}, {"id": "cusco-e19", "name": "Cuzco E19", "b": "temple-soleil", "cap": 6, "new": false}, {"id": "cusco-e20", "name": "Cuzco E20", "b": "temple-soleil", "cap": 6, "new": false}, {"id": "cusco-k4", "name": "Cuzco 4K", "b": "temple-soleil", "cap": 6, "new": false}, {"id": "cime-de-caron-1304", "name": "Cime de Caron 1304", "b": "cime-caron", "cap": 5, "new": false}, {"id": "arcelle-304", "name": "Arcelle 304", "b": "arcelle", "cap": 6, "new": false}, {"id": "joker-16", "name": "Joker 16", "b": "joker", "cap": 6, "new": false}, {"id": "joker-c3", "name": "Joker C3", "b": "joker", "cap": 6, "new": false}, {"id": "joker-c4", "name": "Joker C4", "b": "joker", "cap": 6, "new": false}, {"id": "joker-c8", "name": "Joker C8", "b": "joker", "cap": 6, "new": false}, {"id": "lauzieres-612", "name": "L'Auzière 612", "b": "lauzieres", "cap": 6, "new": false}, {"id": "cusco-d1", "name": "Cuzco D1", "b": "temple-soleil", "cap": 6, "new": true}, {"id": "cusco-d2", "name": "Cuzco D2", "b": "temple-soleil", "cap": 6, "new": true}, {"id": "cusco-e10", "name": "Cuzco E10", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "cusco-e15", "name": "Cuzco E15", "b": "temple-soleil", "cap": 4, "new": true}, {"id": "cusco-f3", "name": "Cuzco F3", "b": "temple-soleil", "cap": 6, "new": true}, {"id": "cusco-f4", "name": "Cuzco F4", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "cusco-g19", "name": "Cuzco G19", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "cusco-g20", "name": "Cuzco G20", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "cusco-k14", "name": "Cuzco K14", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "nazca-c7", "name": "Nazca C7", "b": "temple-soleil", "cap": 6, "new": true}, {"id": "machu-514", "name": "Machu 514", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "pichu-705", "name": "Pichu 705", "b": "temple-soleil", "cap": 5, "new": true}, {"id": "la-vanoise-154", "name": "La Vanoise 154", "b": "la-vanoise", "cap": 4, "new": true}, {"id": "lauzieres-003", "name": "L'Auzière 003", "b": "lauzieres", "cap": 5, "new": true}, {"id": "lauzieres-521", "name": "L'Auzière 521", "b": "lauzieres", "cap": 4, "new": true}], "buildings": {"temple-soleil": "Le Temple du Soleil", "joker": "Joker", "altineige": "Altineige", "le-serac": "Le Sérac", "glaciers": "Les Glaciers", "neves": "Néves", "olympiades": "Olympiades", "la-vanoise": "La Vanoise", "dome-polset": "Dôme de Polset", "cime-caron": "Cime de Caron", "arcelle": "Arcelle", "lauzieres": "Lauzières"}, "labels": {"knives": ["סכיני אוכל", 2.0, 0], "forks": ["מזלגות", 2.0, 0], "spoons": ["כפות", 2.0, 0], "smallSpoons": ["כפיות", 2.0, 0], "plates": ["צלחות", 2.0, 0], "bowls": ["קערות", 2.0, 0], "glasses": ["כוסות שתייה", 2.0, 0], "wineGlasses": ["כוסות יין", 1.0, 0], "coffeeMugs": ["כוסות קפה", 1.0, 0], "fridge": ["מקרר", 0, 0], "oven": ["תנור", 0, 0], "stove": ["כיריים", 0, 0], "microwave": ["מיקרוגל", 0, 0], "dishwasher": ["מדיח כלים", 0, 0], "kettle": ["קומקום", 0, 0], "pans": ["מחבתות", 0, 2], "pots": ["סירים", 0, 2], "chefKnife": ["סכין שף לחיתוך", 0, 0], "cuttingBoard": ["קרש חיתוך", 0, 0], "cookingSpoons": ["כפות בישול", 0, 2], "strainer": ["מסננת", 0, 0], "opener": ["פותחן/חולץ", 0, 0], "potHolders": ["תרבדים", 0, 2], "peeler": ["קולפן", 0, 0], "trashBin": ["פח אשפה", 0, 0], "diningTable": ["שולחן אוכל", 0, 0], "chairs": ["כיסאות", 1.0, 0], "sofa": ["ספה", 0, 0], "coffeeTable": ["שולחן קפה", 0, 0], "tv": ["טלוויזיה", 0, 0], "tvRemote": ["שלט טלוויזיה", 0, 0], "lights": ["תאורת אוכל", 0, 0], "shower": ["מקלחת", 0, 0], "showerScreen": ["מסך/וילון מקלחת", 0, 0], "toilet": ["אסלה", 0, 0], "sink": ["כיור", 0, 0], "mirror": ["מראה", 0, 0], "hairDryer": ["מייבש שיער", 0, 0], "ventilation": ["איוורור", 0, 0], "soapDispenser": ["מתקן סבון", 0, 0], "mattresses": ["מזרנים", 1.0, 0], "pillows": ["כריות", 1.0, 0], "pillowCases": ["כיסויי כריות", 1.0, 0], "blankets": ["שמיכות", 1.0, 0], "sheets": ["סדינים", 1.0, 0], "wardrobe": ["ארון בגדים", 0, 0], "hangers": ["קולבים", 0, 6], "bedsideLamp": ["מנורות שידה", 0, 0], "heating": ["חימום", 0, 0], "bulbs": ["נורות", 0, 0], "curtains": ["וילונות", 0, 0], "keys": ["מפתחות / שלט", 0, 0], "vacuum": ["שואב אבק", 0, 0], "cleanliness": ["בדיקת ניקיון סופית", 0, 0], "foodRemoved": ["הוצאת כל המזון מהדירה", 0, 0], "fridgeOpen": ["מקרר נשאר פתוח", 0, 0], "windowsClosed": ["כל החלונות סגורים", 0, 0], "waterShut": ["מים סגורים / אין נזילות", 0, 0], "electricityOff": ["חשמל / תאורה כבויים", 0, 0], "towels": ["מגבות", 0, 0], "handTowels": ["מגבות ידיים", 0, 0], "bathmat": ["שטיחון אמבטיה", 0, 0], "toiletBrush": ["מברשת אסלה", 0, 0], "kitchenTowels": ["מגבות מטבח", 0, 0], "spices": ["תבלינים", 0, 0], "rug": ["שטיח", 0, 0], "toaster": ["טוסטר", 0, 0], "coffeeMachine": ["מכונת קפה", 0, 0], "wifi": ["WiFi", 0, 0], "safe": ["כספת", 0, 0], "skiRack": ["מתלה סקי", 0, 0], "iron": ["מגהץ", 0, 0], "bootDryer": ["מייבש נעליים", 0, 0]}};
  var ROOMS = [["kitchen", "מטבח"], ["dining", "סלון"], ["bathroom", "חדר רחצה"], ["general", "חדרי שינה"]];
  var BEDDING = { mattresses: 1, blankets: 1, pillows: 1 };
  var STATUS_HE = { ok: "תקין", partial: "חלקי", missing: "חסר", pending: "לא נבדק" };

  function hash(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); }
  function need(apt, key) { var l = DATA.labels[key]; if (!l) return 0; if (l[1]) return Math.ceil(l[1] * apt.cap); return l[2] || 1; }
  function qtyText(apt, key, it) {
    var n = need(apt, key), have = it && typeof it.presentCount === "number" ? it.presentCount : null;
    if (it && it.status === "missing" && have == null) return n > 1 ? "חסר, צריך " + n : "חסר";
    if (have != null && n) return "יש " + have + " מתוך " + n;
    return it ? STATUS_HE[it.status] || "" : "";
  }
  function effective(check, inspAt, baselineDone, cutoff) {
    if (check && typeof check.at === "number" && (!inspAt || check.at >= inspAt)) return !!check.done;
    if (inspAt && inspAt > cutoff) return false;
    return baselineDone;
  }
  // Returns {apt, inspectedAt, items:[...], faults:[...], frank:[...], open, done}
  function computeApartment(apt, insp, checks, cutoff, frankTasks, frankMarks) {
    checks = checks || {}; insp = insp || null;
    var inspAt = insp && typeof insp.updatedAt === "number" ? insp.updatedAt : 0;
    var items = [];
    ROOMS.forEach(function (r) {
      var sec = (insp && insp[r[0]]) || {};
      Object.keys(sec).forEach(function (k) {
        var it = sec[k]; if (!it || typeof it !== "object") return;
        var gap = it.status === "missing" || it.status === "partial";
        var bedNew = apt.new && r[0] === "general" && BEDDING[k];
        if (!gap && !bedNew) return;
        var id = r[0] + "~" + k;
        var base = bedNew ? false : true;
        items.push({ id: id, room: r[1], key: k, label: (DATA.labels[k] || [k])[0], qty: gap ? qtyText(apt, k, it) : "בבדיקה: " + (STATUS_HE[it.status] || it.status),
          note: it.note || "", bedding: !!bedNew, done: effective(checks[id], inspAt, base, cutoff), check: checks[id] || null });
      });
    });
    if (apt.new) Object.keys(BEDDING).forEach(function (k) {
      var id = "general~" + k;
      if (items.some(function (x) { return x.id === id; })) return;
      items.push({ id: id, room: "חדרי שינה", key: k, label: DATA.labels[k][0], qty: "לא נבדק, צריך " + need(apt, k), note: "", bedding: true,
        done: effective(checks[id], inspAt, false, cutoff), check: checks[id] || null });
    });
    var faults = [];
    var ren = insp && insp.maintenance && typeof insp.maintenance.renovations === "string" ? insp.maintenance.renovations : "";
    ren.split("\n").map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (line) {
      var id = "fault~" + hash(line);
      var c = checks[id];
      faults.push({ id: id, label: line, done: !!(c && c.done && (!inspAt || c.at >= inspAt)), check: c || null });
    });
    var marks = {}; (frankMarks || []).forEach(function (m) { marks[m.task_id] = m; });
    var frank = (frankTasks || []).filter(function (t) { return t.apt === apt.id; }).map(function (t) {
      var m = marks[t.id]; return { id: t.id, label: t.he, status: m ? m.status : "open", note: m && m.note || "", at: m && m.updated_at || null };
    });
    var open = items.filter(function (x) { return !x.done; }).length;
    var openFaults = faults.filter(function (x) { return !x.done; }).length;
    var frankOpen = frank.filter(function (f) { return f.status !== "done"; }).length;
    return { apt: apt, inspectedAt: inspAt || null, items: items, faults: faults, frank: frank, open: open, openFaults: openFaults, frankOpen: frankOpen };
  }
  function fetchJSON(url) { return fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(url + " " + r.status); return r.json(); }); }
  // Loads everything. frankUrl: absolute URL of /api/frank (or null to skip).
  function loadAll(frankUrl) {
    return Promise.all([
      fetchJSON(DB + "/inspections.json"),
      fetchJSON(DB + "/gapChecks.json"),
      frankUrl ? fetchJSON(frankUrl).catch(function () { return { state: "unavailable", tasks: [], marks: [] }; }) : Promise.resolve({ state: "skipped", tasks: [], marks: [] })
    ]).then(function (r) {
      var insp = r[0] || {}, gc = r[1] || {}, fr = r[2] || {};
      var cutoff = gc.meta && typeof gc.meta.cutoff === "number" ? gc.meta.cutoff : 0;
      var state = fr.state || "unavailable", marks = fr.marks || [], frankAt = null;
      // Without a live read, fall back to the last saved snapshot of Frank's marks (shown with its date).
      if (state !== "ok" && gc.frankSnapshot && Array.isArray(gc.frankSnapshot.marks)) { state = "snapshot"; marks = gc.frankSnapshot.marks; frankAt = gc.frankSnapshot.at || null; }
      var apts = DATA.apts.map(function (a) { return computeApartment(a, insp[a.id], (gc.items || {})[a.id], cutoff, fr.tasks, marks); });
      return { apts: apts, cutoff: cutoff, frankState: state, frankAt: frankAt, loadedAt: Date.now() };
    });
  }
  function saveCheck(aptId, itemId, done) {
    var body = JSON.stringify({ done: !!done, at: Date.now() });
    return fetch(DB + "/gapChecks/items/" + encodeURIComponent(aptId) + "/" + encodeURIComponent(itemId) + ".json", { method: "PUT", body: body })
      .then(function (r) { if (!r.ok) throw new Error("save " + r.status); return r.json(); });
  }
  var api = { DATA: DATA, DB: DB, computeApartment: computeApartment, loadAll: loadAll, saveCheck: saveCheck, buildingName: function (b) { return DATA.buildings[b] || b; } };
  if (typeof module === "object" && module.exports) module.exports = api; else root.GapsModel = api;
})(typeof window !== "undefined" ? window : globalThis);
