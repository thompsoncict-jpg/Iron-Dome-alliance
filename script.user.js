// ==UserScript==
// @name         Torn Alliance Toolkit (Fixed)
// @version      1.1
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // CONFIG
    /////////////////////////////

    const BASE_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/torn-alliance-tool/main/";
    const CONFIG_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/refs/heads/main/alliance.json"
    const BADGE_URL  = BASE_URL + "alliance.png";

    /////////////////////////////
    // FETCH DATA
    /////////////////////////////

    function fetchAllianceData() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL,
                onload: res => {
                    try {
                        const json = JSON.parse(res.responseText);
                        resolve(json.factions || []);
                    } catch {
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    }

    /////////////////////////////
    // GET FACTION ID
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

        const target = document.querySelector('.profile-wrapper, .user-profile');
        if (!target) return;

        const div = document.createElement("div");
        div.id = "alliance-badge";
        div.style.textAlign = "center";
        div.style.marginBottom = "10px";

        div.innerHTML = `
            <img src="${BADGE_URL}" style="width:120px;border-radius:10px;">
            <div style="color:#4CAF50;font-weight:bold;">ALLIANCE MEMBER</div>
        `;

        target.prepend(div);
    }

    /////////////////////////////
    // ATTACK WARNING
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
    // MAIN LOOP (important fix)
    /////////////////////////////

    let lastFaction = null;

    async function run() {
        const factions = await fetchAllianceData();

        const interval = setInterval(() => {
            const factionId = getFactionId();

            if (!factionId || factionId === lastFaction) return;

            lastFaction = factionId;

            if (factions.includes(factionId)) {
                console.log("Alliance detected:", factionId);
                addBadge();
                attachWarning(factionId);
            }
        }, 1000); // keeps checking until page fully loads
    }

    run();

})();

