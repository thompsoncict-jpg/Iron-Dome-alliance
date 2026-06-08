// ==UserScript==
// @name         TID alliance
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Instant allied faction warning
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    const ALLIED_FACTIONS = [
        "51447",
  "48251",
  "53128",
  "52835",
  "53032",
  "51855",
  "43545",
  "35090",
  "51536",
  "50274",
  "52701",
  "54843",
  "18560",
  "53857",
  "54366",
  "54120",
  "52484",
    ];

    function getFactionFromProfile() {
        // 🔥 TARGET ONLY profile info area (much faster)
        let factionLink = document.querySelector('.profile-wrapper a[href*="factions.php"]');

        if (!factionLink) return null;

        let match = factionLink.href.match(/ID=(\d+)/);

        return {
            id: match ? match[1] : null,
            name: factionLink.textContent.trim()
        };
    }

    function showWarning(faction) {
        if (document.getElementById("alliance-warning")) return;

        let box = document.createElement("div");
        box.id = "alliance-warning";
        box.innerHTML = `⚠️ ALLIED: ${faction.name}`;

        Object.assign(box.style, {
            position: "fixed",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#b30000",
            color: "#fff",
            padding: "10px 15px",
            borderRadius: "6px",
            zIndex: "9999",
            fontWeight: "bold"
        });

        document.body.appendChild(box);
    }

    function runCheck() {
        let faction = getFactionFromProfile();

        if (!faction) return false;

        if (ALLIED_FACTIONS.includes(faction.id)) {
            showWarning(faction);
        }

        return true;
    }

    // 🔥 FAST LOOP (stops immediately when found)
    let tries = 0;
    let fastCheck = setInterval(() => {
        if (runCheck() || tries > 25) {
            clearInterval(fastCheck);
        }
        tries++;
    }, 100); // every 0.1s

})();
