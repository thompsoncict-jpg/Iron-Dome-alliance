// ==UserScript==
// @name         Torn Alliance Toolkit (Fast)
// @version      2.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // CONFIG
    /////////////////////////////

    const BASE_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/main/";
    const CONFIG_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/refs/heads/main/alliance.json";
    const BADGE_URL  = "https://github.com/thompsoncict-jpg/Iron-Dome-alliance/blob/main/alliance.png?raw=true";

    /////////////////////////////
    // CACHE (important)
    /////////////////////////////

       async function loadAllianceData() {
        try {
            // Force fresh request every time
            const res = await fetch(CONFIG_URL + "?t=" + Date.now());
            const json = await res.json();
            allianceFactions = json.factions || [];

            console.log("✅ Alliance data loaded:", allianceFactions);
        } catch (e) {
            console.log("❌ Failed to fetch alliance data", e);
        }
    }

    /////////////////////////////
    // DETECT FACTION
    /////////////////////////////

    function getFactionId() {
        const link = document.querySelector('a[href*="factions.php?step=profile&ID="]');
        if (!link) return null;

        const url = new URL(link.href);
        return parseInt(url.searchParams.get("ID"));
    }

    /////////////////////////////
    // ADD BADGE
    /////////////////////////////

    function addBadge() {
        if (document.getElementById("alliance-badge")) return;

        const container = document.querySelector('.profile-wrapper, .user-profile');
        if (!container) return;

        const badge = document.createElement("div");
        badge.id = "alliance-badge";

        badge.innerHTML = `
            <div style="text-align:center; margin-bottom:10px;">
                <img src="${BADGE_URL}" style="width:120px;border-radius:10px;">
                <div style="color:#4CAF50;font-weight:bold;">ALLIANCE MEMBER</div>
            </div>
        `;

        container.prepend(badge);
    }

    /////////////////////////////
    // WARNING
    /////////////////////////////

    function attachWarning(factionId) {
        const btn = document.querySelector('a[href*="loader.php?sid=attack"]');
        if (!btn) return;

        btn.onclick = function(e) {
            if (!confirm(`⚠️ Alliance member (${factionId}) — attack anyway?`)) {
                e.preventDefault();
            }
        };
    }

    /////////////////////////////
    // MAIN
    /////////////////////////////

   function runCheck() {
    const factionId = getFactionId();
    if (!factionId) return;

    if (allianceFactions.includes(factionId)) {
        addBadge();
        attachWarning(factionId);
            }
    }

    /////////////////////////////
    // INIT (FAST LOAD)
    /////////////////////////////

    loadAllianceData().then(() => {
        runCheck();

        // React instantly to page changes
        const observer = new MutationObserver(runCheck);
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
