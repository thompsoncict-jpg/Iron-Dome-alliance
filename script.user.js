// ==UserScript==
// @name         Torn Alliance Toolkit (Stable Instant)
// @version      3.1
// @match        https://www.torn.com/*
// ==/UserScript==

(function() {
    'use strict';

    const BASE_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/main/";
    const CONFIG_URL = BASE_URL + "alliance.json";
    const BADGE_URL  = BASE_URL + "alliance.png";

    let allianceFactions = [];
    let dataLoaded = false;

    /////////////////////////////
    // FETCH (RELIABLE)
    /////////////////////////////

    async function loadAllianceData() {
        try {
            const res = await fetch(CONFIG_URL + "?t=" + Date.now());
            const json = await res.json();

            allianceFactions = json.factions || [];
            dataLoaded = true;

            console.log("✅ Loaded factions:", allianceFactions);
        } catch (e) {
            console.log("❌ Fetch failed, retrying...", e);

            // retry after 2s
            setTimeout(loadAllianceData, 2000);
        }
    }

    /////////////////////////////
    // GET FACTION
    /////////////////////////////

    function getFactionId() {
        const link = document.querySelector('a[href*="factions.php?step=profile&ID="]');
        if (!link) return null;

        const url = new URL(link.href);
        return parseInt(url.searchParams.get("ID"));
    }

    /////////////////////////////
    // BADGE
    /////////////////////////////

    function addBadge() {
        if (document.getElementById("alliance-badge")) return;

        const container =
            document.querySelector('.profile-wrapper') ||
            document.querySelector('.user-profile') ||
            document.querySelector('[class*="profile"]');

        if (!container) return;

        const badge = document.createElement("div");
        badge.id = "alliance-badge";
        badge.style.textAlign = "center";
        badge.style.marginBottom = "10px";

        badge.innerHTML = `
            <img src="${BADGE_URL}" style="width:100px;border-radius:8px;">
            <div style="color:#4CAF50;font-weight:bold;">ALLIANCE MEMBER</div>
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
    // MAIN CHECK
    /////////////////////////////

    function runCheck() {
        if (!dataLoaded) return; // wait until data is ready

        const factionId = getFactionId();
        if (!factionId) return;

        if (allianceFactions.includes(factionId)) {
            addBadge();
            attachWarning(factionId);
        }
    }

    /////////////////////////////
    // OBSERVER
    /////////////////////////////

    function startObserver() {
        const observer = new MutationObserver(runCheck);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /////////////////////////////
    // INIT
    /////////////////////////////

    async function init() {
        await loadAllianceData();
        runCheck();
        startObserver();

        // keep data fresh every 30s
        setInterval(loadAllianceData, 30000);
    }

    init();

})();
