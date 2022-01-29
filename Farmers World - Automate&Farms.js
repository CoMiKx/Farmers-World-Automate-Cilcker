// ==UserScript==
// @name         Farmers World - Automate&Farms
// @namespace    https://play.farmersworld.io/
// @version      1.0.3
// @description  Farmers World - Automate&Farms
// @author       CoMiKx
// @match        https://play.farmersworld.io/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://farmersworld.io&size=16
// @icon64       https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://farmersworld.io&size=64
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==

window.automateEnable = true;

window.storedMiningEnable = true;

window.interval = 5000;

var now = new Date().getTime();

var nextHour = new Date().getTime() + 1800E3;

window.sleep = function (ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

window.waitForModal = async function () {
    while ($(".modal-wrapper").length == 0) {
        await window.sleep(100);
    }
    await window.sleep(1000);
    if ($("#loadingModal").length > 0) {
        do {
            await window.sleep(1000);
        } while ($("#loadingModal").length > 0);
        await window.sleep(2000);
    }
}

window.automateMining = async function () {
    if ($(".navbar-container .active img[Alt='Home']").length > 0) {
        $(".navbar-container img[Alt='Home']").click();
        $(".navbar-container img[Alt='Home']").click();
    }
    var items = $("section .carousel__img--item");
    var activeItem = $("section .carousel__img--item.active");
    if (items.length > 0) {
        for (var i = 0; i < items.length; i++) {
            items.get(i).click();
            var itemName = $(".info-section .info-title-name").get(0).innerText;
            var itemType = $(".info-section .info-title-level").get(0) != undefined ? "tools" : "memberships";
            var itemStoredMining = itemType == "tools" ? $(".info-section .info-title-level").get(0).innerText.split("/").map(Number) : [1, 1];
            var itemDurability = itemType == "tools" ? $(".card-section .card-number .content").text().split("/ ").map(Number) : [0, 0];
            var energyConsumed = itemType == "tools" ? parseFloat($(".info-section .info-label:contains('Energy Consumed:') .info-description").get(0).innerText) : 100;
            var durabilityConsumed = itemType == "tools" ? parseFloat($(".info-section .info-label:contains('Durability Consumed:') .info-description").get(0).innerText) : 0;
            var remainingGold = parseFloat($(".resource-number > div").get(0).innerText);
            var remainingFood = parseFloat($(".resource-number > div").get(2).innerText);
            var remainingEnergy = parseFloat($(".resource-number > div").get(3).innerText);
            if ((itemStoredMining[0] == itemStoredMining[1]) || (!window.storedMiningEnable && itemStoredMining[0] > 0)) {
                if (remainingEnergy < (energyConsumed * itemStoredMining[0])) {
                    if ((remainingEnergy + (remainingFood * 5.0)) >= (energyConsumed * itemStoredMining[0])) {
                        $(".resource-energy .resource-energy--plus").click();
                        do {
                            var energyValue = $(".modal-wrapper .modal-input").val();
                            $(".modal-wrapper img[alt='Plus Icon']").click();
                        } while (energyValue != $(".modal-wrapper .modal-input").val());
                        $(".modal-wrapper .plain-button:contains('Exchange')").click();
                        await window.waitForModal();
                        break;
                    }
                } else if (itemDurability[0] < (durabilityConsumed * itemStoredMining[0])) {
                    if ((itemDurability[0] + (remainingGold * 5.0)) >= itemDurability[1]) {
                        $(".info-section .plain-button:contains('Repair')").get(0).click();
                        await window.waitForModal();
                        break;
                    }
                } else if ($(".info-section .plain-button:contains('" + (itemType == "tools" ? "Mine" : "Claim") + "')").get(0) != undefined) {
                    $(".info-section .plain-button:contains('" + (itemType == "tools" ? "Mine" : "Claim") + "')").get(0).click();
                    await window.waitForModal();
                }
            }
        }
        activeItem.get(0).click();
        $(".navbar-container img[Alt='Map']").click();
        $("body > div.modal-wrapper > div > section > div.modal-map-content > div:nth-child(3) > span").click();
        await window.sleep(1500);
        var itemsFarms = $("section .carousel__img--item");
        var activeItemFarm = $("section .carousel__img--item.active");
        for (var j = 0; j < itemsFarms.length; j++){
            $("section .carousel__img--item").get(j).click();
            if (remainingEnergy <= 30 ||
                ($(".info-section > div.info-text__section > div.info-title > div.info-title-name").get(0).innerText == "Barley Seed" && $(".card-section .card-number .content").text().split("/ ").map(Number)[0] == 41
                 ? remainingEnergy <= 230 :
                 $(".info-section > div.info-text__section > div.info-title > div.info-title-name").get(0).innerText == "Corn Seed" && $(".card-section .card-number .content").text().split("/ ").map(Number)[0] == 41
                 ? remainingEnergy <= 230 : false)) {
                if ((remainingEnergy + (remainingFood * 5.0)) >= 500) {
                    $(".resource-energy .resource-energy--plus").click();
                    do {
                        energyValue = $(".modal-wrapper .modal-input").val();
                        $(".modal-wrapper img[alt='Plus Icon']").click();
                    } while (energyValue != $(".modal-wrapper .modal-input").val());
                    $(".modal-wrapper .plain-button:contains('Exchange')").click();
                    await window.sleep(1000);
                    break;
                }
            } else if ($(".card-section .card-number .content").text().split("/ ").map(Number)[0] == 41 && $(".info-section > div.info-time > div").get(0).innerText == "00:00:00") {
                $(".info-section > div.home-card-button__group > div:nth-child(1) > button > div").click();
                await window.sleep(1000);
                break;
            } else if ($(".info-section > div.home-card-button__group > div:nth-child(1) > button > div").get(0) != undefined) {
                $(".info-section > div.home-card-button__group > div:nth-child(1) > button > div").click();
                await window.sleep(1000);
            }
        }
        activeItemFarm.get(0).click();
        $("#root > div > div > div.game-content > section.navbar-container > div:nth-child(5) > img").click();
        $("body > div.modal-wrapper > div > section > div.modal-map-content > div:nth-child(1) > span").click();
        await window.sleep(1000);
    }
    if(now >= nextHour){
        window.location.reload();
    }
    now = new Date().getTime();
}

window.automateInterval = setInterval(async function () {
    if (window.automateEnable) {
        await window.automateMining();
    }
}, window.interval);
//$(".navbar-container .active img[Alt='Home']").length .. don't need to click "Home" btn to start

window.loginInterval = setInterval(function () {
    if ($(".login-button").length > 0 && $("#RPC-Endpoint").val() != null) {
        $(".login-button").click();
        $(".login-modal-button:contains('Wax Wallet Account')").click();
        clearInterval(window.loginInterval);
    }
}, 100);
