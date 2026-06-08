// ==UserScript==
// @name         TID alliance
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Instant allied faction warning
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Use a Set for O(1) faction lookups
    const ALLIED_FACTIONS = new Set([
        "51447", "48251", "53128", "52835", "53032", "51855",
        "43545", "35090", "51536", "50274", "52701", "54843",
        "18560", "53857", "54366", "54120", "52484", "49473",
    ]);

    function getFactionFromProfile() {
        // Updated selector to match current Torn City HTML structure
        const factionLink = document.querySelector('a.t-blue[href*="factions.php"]');
        if (!factionLink) return null;

        // Extract faction ID from URL (ID=54843&referredFrom=...)
        const match = factionLink.href.match(/ID=(\d+)/);
        if (!match || !match[1]) return null;

        return {
            id: match[1],
            name: factionLink.textContent.trim()
        };
    }

    function showWarning(faction) {
        if (document.getElementById("alliance-warning")) return;

        const box = document.createElement("div");
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
            fontWeight: "bold",
            fontFamily: "Arial, sans-serif"
        });

        document.body?.appendChild(box);
    }

    function runCheck() {
        const faction = getFactionFromProfile();
        if (!faction) return false;

        if (ALLIED_FACTIONS.has(faction.id)) {
            showWarning(faction);
        }
        return true;
    }

    // Check up to 10 times, every 100ms (1 second total)
    let tries = 0;
    const fastCheck = setInterval(() => {
        if (runCheck() || tries >= 10) {
            clearInterval(fastCheck);
        }
        tries++;
    }, 100);
})();
