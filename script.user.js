// ==UserScript==
// @name         TID alliance
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Warn before attacking allied factions in Torn
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
  "52484",
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
            ⚠️ ALLIED FACTION WARNING ⚠️<br>
            <strong>${faction.name}</strong><br>
            Do NOT attack!
        `;

        warning.style.position = "fixed";
        warning.style.top = "20px";
        warning.style.left = "50%";
        warning.style.transform = "translateX(-50%)";
        warning.style.background = "#b30000";
        warning.style.color = "white";
        warning.style.padding = "15px";
        warning.style.borderRadius = "10px";
        warning.style.zIndex = "9999";
        warning.style.fontSize = "16px";

        document.body.appendChild(warning);
    }

    function checkAlliance() {
        let faction = getFactionInfo();
        if (!faction) return;

        if (ALLIED_FACTIONS.includes(faction.id)) {
            showWarning(faction);
        }
    }

    // 🔥 KEY FIX: keep checking until it finds faction
    const observer = new MutationObserver(() => {
        checkAlliance();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();




