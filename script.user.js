// ==UserScript==
// @name         TID alliance
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fast warning for allied factions
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_addStyle
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
  "52484",, 
    ];

    function getFactionInfo() {
        let factionLink = document.querySelector('a[href*="factions.php"]');
        if (!factionLink) return null;

        let factionIdMatch = factionLink.href.match(/ID=(\d+)/);
        let factionName = factionLink.textContent.trim();

        return {
            id: factionIdMatch ? factionIdMatch[1] : null,
            name: factionName
        };
    }

    function showWarning(faction) {
        if (document.getElementById("alliance-warning")) return;

        let warning = document.createElement("div");
        warning.id = "alliance-warning";
        warning.innerHTML = `
            ⚠️ ALLIED FACTION ⚠️<br>
            <strong>${faction.name}</strong>
        `;

        Object.assign(warning.style, {
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#b30000",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            zIndex: "9999",
            fontSize: "16px"
        });

        document.body.appendChild(warning);
    }

    function waitForFaction() {
        let attempts = 0;

        const interval = setInterval(() => {
            let faction = getFactionInfo();

            if (faction) {
                if (ALLIED_FACTIONS.includes(faction.id)) {
                    showWarning(faction);
                }
                clearInterval(interval); // ✅ STOP once found
            }

            attempts++;
            if (attempts > 20) clearInterval(interval); // stop after ~10s
        }, 500); // check every 0.5s
    }

    // Run immediately
    waitForFaction();

})();





