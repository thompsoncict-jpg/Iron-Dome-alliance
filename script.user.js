// ==UserScript==
// @name         Torn Alliance Toolkit (Browser)
// @version      4.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/refs/heads/main/alliance.json";
    const BADGE_URL  = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/main/alliance.png";

    let allianceFactions = [];

    /////////////////////////////
    // FETCH
    /////////////////////////////

    function loadAllianceData() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL + "?t=" + Date.now(),
                onload: res => {
                    try {
                        allianceFactions = JSON.parse(res.responseText).factions || [];
                        console.log("Browser factions:", allianceFactions);
                    } catch {}
                    resolve();
                },
                onerror: () => resolve()
            });
        });
    }

    /////////////////////////////
    // DETECT FACTION
    /////////////////////////////

    function getFactionId() {
        const links = document.querySelectorAll('a[href*="factions.php"]');

        for (let link of links) {
            try {
                const id = new URL(link.href).searchParams.get("ID");
                if (id) return parseInt(id);
            } catch {}
        }

        return null;
    }

    /////////////////////////////
    // BADGE
    /////////////////////////////

    function addBadge() {
        if (document.getElementById("alliance-badge")) return;

        const badge = document.createElement("div");
        badge.id = "alliance-badge";

        badge.style.position = "fixed";
        badge.style.top = "100px";
        badge.style.right = "20px";
        badge.style.zIndex = "9999";
        badge.style.background = "#111";
        badge.style.padding = "10px";
        badge.style.borderRadius = "10px";

        badge.innerHTML = `
            <img src="${BADGE_URL}" style="width:80px;">
            <div style="color:#4CAF50;font-weight:bold;text-align:center;">ALLY</div>
        `;

        document.body.appendChild(badge);
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
    // RUN
    /////////////////////////////

    function runCheck() {
        const id = getFactionId();
        if (!id) return;

        if (allianceFactions.includes(id)) {
            addBadge();
            attachWarning(id);
        }
    }

    /////////////////////////////
    // INIT
    /////////////////////////////

    async function init() {
        await loadAllianceData();

        setInterval(runCheck, 1000);
        setInterval(loadAllianceData, 30000);
    }

    init();

})();


    init();

})();
