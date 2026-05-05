// ==UserScript==
// @name         Torn Alliance Toolkit (FINAL FIXED)
// @version      6.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    /////////////////////////////
    // CONFIG
    /////////////////////////////

    const CONFIG_URL = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/refs/heads/main/alliance.json";
    const BADGE_URL  = "https://raw.githubusercontent.com/thompsoncict-jpg/Iron-Dome-alliance/main/alliance.png";

    let allianceFactions = [];

    /////////////////////////////
    // FETCH DATA
    /////////////////////////////

    function loadAllianceData() {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "GET",
                url: CONFIG_URL + "?t=" + Date.now(),
                onload: res => {
                    try {
                        allianceFactions = JSON.parse(res.responseText).factions || [];
                        console.log("✅ Alliance list:", allianceFactions);
                    } catch (e) {
                        console.log("❌ JSON error", e);
                    }
                    resolve();
                },
                onerror: () => {
                    console.log("❌ Fetch failed");
                    resolve();
                }
            });
        });
    }

    /////////////////////////////
    // FIXED FACTION DETECTION
    /////////////////////////////

    function getFactionId() {
        // ONLY look inside profile header
        const profile = document.querySelector('[class*="profile"]');
        if (!profile) return null;

        const link = profile.querySelector('a[href*="factions.php"][href*="ID="]');
        if (!link) return null;

        try {
            const id = new URL(link.href).searchParams.get("ID");
            if (id) {
                console.log("🎯 Player faction:", id);
                return parseInt(id);
            }
        } catch {}

        return null;
    }

    /////////////////////////////
    // ADD BADGE
    /////////////////////////////

    function addBadge() {
        if (document.getElementById("alliance-badge")) return;

        const badge = document.createElement("div");
        badge.id = "alliance-badge";

        badge.style.position = "fixed";
        badge.style.top = "120px";
        badge.style.right = "20px";
        badge.style.zIndex = "999999";
        badge.style.background = "#111";
        badge.style.padding = "12px";
        badge.style.borderRadius = "10px";
        badge.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

        badge.innerHTML = `
            <img src="${BADGE_URL}" style="width:80px; display:block; margin:auto;">
            <div style="color:#4CAF50;font-weight:bold;text-align:center;margin-top:5px;">
                ALLIANCE
            </div>
        `;

        document.body.appendChild(badge);
    }

    /////////////////////////////
    // REMOVE BADGE (important)
    /////////////////////////////

    function removeBadge() {
        const badge = document.getElementById("alliance-badge");
        if (badge) badge.remove();
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
    // MAIN CHECK
    /////////////////////////////

    function runCheck() {
        const factionId = getFactionId();
        if (!factionId) return;

        console.log("Checking:", factionId);

        if (allianceFactions.includes(factionId)) {
            console.log("🟢 ALLY DETECTED");
            addBadge();
            attachWarning(factionId);
        } else {
            removeBadge(); // FIXES false positives
        }
    }

    /////////////////////////////
    // INIT
    /////////////////////////////

    async function init() {
        await loadAllianceData();

        setInterval(runCheck, 1500);
        setInterval(loadAllianceData, 30000);
    }

    init();

})();
