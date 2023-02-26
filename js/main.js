let stepsElements = document.querySelectorAll(".step");
let indicatorElements = document.querySelectorAll(".indicator-num");

let nameInput = document.querySelector("#name");
let nameWarning = document.querySelector("#name-warning");

let emailInput = document.querySelector("#email");
let emailWarning = document.querySelector("#email-warning");

let phoneInput = document.querySelector("#phone");
let phoneWarning = document.querySelector("#phone-warning");

let planCards = document.querySelectorAll(".plan label");
let plansInput = document.querySelectorAll(".plan label input");
let togglePlan = document.querySelector("#period");

let addsCards = document.querySelectorAll(".adds-container .add");
let addsOnInputs = document.querySelectorAll(".adds-container input");

let checkContainer = document.querySelector(".check-container");
let mainPlan = document.querySelector(".main-name");
let basicPrice = document.querySelector(".basic");
let totalPrice = document.querySelector(".four .total");

let nextBtn = document.querySelector("#next");
let prevBtn = document.querySelector("#prev");

let currentStep = 0;
let choosenPlan = {
  plan: "",
  period: "",
  addOns: [],
};
let finalPrice = 0;

const planPrices = {
  monthly: {
    arcade: 9,
    advanced: 12,
    pro: 15,
    addOns: {
      onlineService: 1,
      largerStorage: 2,
      customizableProfile: 2,
    },
  },
  yearly: {
    arcade: 90,
    advanced: 120,
    pro: 150,
    addOns: {
      onlineService: 10,
      largerStorage: 20,
      customizableProfile: 20,
    },
  },
};

function showStep(direction) {
  stepsElements[currentStep].classList.remove("active");
  indicatorElements[currentStep].classList.remove("active");
  if (direction === "next") {
    stepsElements[currentStep + 1].classList.add("active");
    indicatorElements[currentStep + 1].classList.add("active");
  } else if (direction === "prev") {
    stepsElements[currentStep - 1].classList.add("active");
    indicatorElements[currentStep - 1].classList.add("active");
  }
}

function checkNameInput() {
  if (nameInput.value === "") {
    nameWarning.classList.add("show");
    return false;
  } else {
    nameWarning.classList.remove("show");
    return true;
  }
}
function checkEmailInput() {
  if (emailInput.value === "" || !/\w+\@\w+\.\w+/gi.test(emailInput.value)) {
    emailWarning.classList.add("show");
    return false;
  } else {
    emailWarning.classList.remove("show");
    return true;
  }
}
function checkPhoneInput() {
  if (phoneInput.value === "" || !/\+\d{10}/g.test(phoneInput.value)) {
    phoneWarning.classList.add("show");
    return false;
  } else {
    phoneWarning.classList.remove("show");
    return true;
  }
}

function planOptions() {
  if (togglePlan.checked) {
    planCards.forEach((plan) => {
      plan.children[2].innerHTML = `$${
        planPrices["yearly"][plan.dataset.plan]
      }/yr`;
      let offer = document.createElement("span");
      offer.className = "offer";
      offer.appendChild(document.createTextNode("2 months free"));
      plan.appendChild(offer);
    });
  } else {
    planCards.forEach((plan) => {
      plan.children[2].innerHTML = `$${
        planPrices["monthly"][plan.dataset.plan]
      }/mo`;
      document.querySelector(".offer").remove();
    });
  }
}

nameInput.onblur = checkNameInput;
emailInput.onblur = checkEmailInput;
phoneInput.onblur = checkPhoneInput;

togglePlan.onclick = planOptions;

nextBtn.onclick = function (e) {
  e.preventDefault();
  if (currentStep === 0) {
    if (checkNameInput() && checkEmailInput() && checkPhoneInput()) {
      showStep("next");
      currentStep++;
      prevBtn.classList.add("active");
    }
  } else if (currentStep === 1) {
    plansInput.forEach((input) => {
      if (input.checked) {
        choosenPlan.plan = input.dataset.plan;
      }
    });
    if (togglePlan.checked) {
      choosenPlan.period = "yearly";
      choosenPlan.price = planPrices[choosenPlan.period][choosenPlan.plan];
      addsCards.forEach((card) => {
        card.children[2].innerHTML = `+$${
          planPrices[choosenPlan.period]["addOns"][card.dataset.adds]
        }/yr`;
      });
    } else {
      choosenPlan.period = "monthly";
      choosenPlan.price = planPrices[choosenPlan.period][choosenPlan.plan];
      addsCards.forEach((card) => {
        card.children[2].innerHTML = `+$${
          planPrices[choosenPlan.period]["addOns"][card.dataset.adds]
        }/mo`;
      });
    }
    showStep("next");
    currentStep++;
  } else if (currentStep === 2) {
    addsOnInputs.forEach((add) => {
      if (add.checked) {
        let planDetails = document.createElement("div");
        planDetails.classList.add("extra", "plan-details");
        let addOnsElement = document.createElement("p");
        addOnsElement.className = "add-ons";
        addsCards.forEach((card) => {
          if (card.dataset.adds === add.dataset.adds) {
            let addOnsElementTxt = document.createTextNode(
              card.children[1].children[0].innerHTML
            );
            addOnsElement.appendChild(addOnsElementTxt);
          }
        });
        planDetails.appendChild(addOnsElement);
        let price = document.createElement("span");
        price.className = "price";
        if (choosenPlan.period === "monthly") {
          price.innerHTML = `+$${
            planPrices[choosenPlan.period]["addOns"][add.dataset.adds]
          }/mo`;
          finalPrice +=
            planPrices[choosenPlan.period]["addOns"][add.dataset.adds];
        } else if (choosenPlan.period === "yearly") {
          price.innerHTML = `+$${
            planPrices[choosenPlan.period]["addOns"][add.dataset.adds]
          }/yr`;
          finalPrice +=
            planPrices[choosenPlan.period]["addOns"][add.dataset.adds];
        }
        planDetails.appendChild(price);
        checkContainer.appendChild(planDetails);
      }
    });
    mainPlan.innerHTML = `${choosenPlan.plan} (${choosenPlan.period})`;
    if (choosenPlan.period === "monthly") {
      basicPrice.innerHTML = `$${
        planPrices[choosenPlan.period][choosenPlan.plan]
      }/mo`;
      finalPrice += planPrices[choosenPlan.period][choosenPlan.plan];
      totalPrice.children[0].innerHTML = "Total (per month)";
      totalPrice.children[1].innerHTML = `+$${finalPrice}/mo`;
    } else if (choosenPlan.period === "yearly") {
      basicPrice.innerHTML = `$${
        planPrices[choosenPlan.period][choosenPlan.plan]
      }/yr`;
      finalPrice += planPrices[choosenPlan.period][choosenPlan.plan];
      totalPrice.children[0].innerHTML = "Total (per year)";
      totalPrice.children[1].innerHTML = `+$${finalPrice}/yr`;
    }
    nextBtn.innerHTML = "confirm";
    nextBtn.classList.add("confirm");
    showStep("next");
    currentStep++;
  } else if (currentStep === 3) {
    nextBtn.parentElement.remove();
    stepsElements[currentStep].classList.remove("active");
    stepsElements[currentStep + 1].classList.add("active");
  }
};

prevBtn.onclick = function (e) {
  e.preventDefault();
  if (currentStep === 1) {
    showStep("prev");
    currentStep--;
    prevBtn.classList.remove("active");
  } else if (currentStep === 3) {
    let extraAdds = document.querySelectorAll(".extra");
    if (extraAdds.length > 0) {
      extraAdds.forEach((add) => {
        add.remove();
      });
    }
    finalPrice = 0;
    nextBtn.innerHTML = "next step";
    nextBtn.classList.remove("confirm");
    showStep("prev");
    currentStep--;
  } else {
    showStep("prev");
    currentStep--;
  }
};
