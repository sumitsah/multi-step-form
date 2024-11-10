const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const planRadioBtn = document.querySelectorAll('.plan-radio');
const addonCheckmark = document.querySelectorAll('.addon-checkmark');
const monthYearSwitch = document.querySelector('#month-year-switch');
const monthlyPlan = document.querySelectorAll('.monthly-plan');
const yearlyPlan = document.querySelectorAll('.yearly-plan');
const planContainer = document.querySelectorAll('.plan-container');
const finish = document.querySelector('.finish');
const submitBtn = document.querySelector('#submit');
const form = document.querySelector('form');
const buttonContainer = document.querySelector('.button-container');
const summaryHeadingDT = document.querySelector('.summary-heading dt');
const summaryHeadingDD = document.querySelector('.summary-heading dd');
const summaryHeading = document.querySelector('.summary-heading');
const finalStep = document.querySelector('.final-step');
const totalAmount = document.querySelector('.total-amount');
const tab = document.getElementsByClassName("tab");
const inputs = document.querySelectorAll(".input-text");
const planError = document.querySelector(".plan");
const plans = document.getElementsByName("plan");

let currentTab = 1; // Current tab is set to be the first tab (0)
let selectedYearPlan = false;
const plan = {
    arcade: 9,
    advanced: 12,
    pro: 15
}

const addOn = {
    'Online service': 1,
    'Larger storage': 2,
    'Customizable profile': 2
}

showTab(currentTab); // Display the current tab

function showTab(n) {
    // This function will display the specified tab of the form...
    if (tab[n].classList.contains('tab')) {
        tab[n].classList.add('show-tab');
    }

    if (n == 0) {
        prevBtn.classList.add('hide-btn')
    } else {
        prevBtn.classList.remove('hide-btn')
        prevBtn.classList.add('show-btn')
    }
    if (n == (tab.length) - 1) {
        submitBtn.classList.add('primary-button-submit');
        nextBtn.classList.add('hide');
        if (nextBtn.classList.contains('show')) {
            nextBtn.classList.remove('show');
        }
        submitBtn.classList.add('show');
        showConfirmation();
    }
    if ((n < (tab.length) - 1) && submitBtn.classList.contains('show')) {
        nextBtn.classList.add('show');
        submitBtn.classList.remove('show');
    }
    fixStepIndicator(n)
}

const hideTab = () => tab[currentTab].classList.contains('show-tab') ? tab[currentTab].classList.remove('show-tab') : '';

const derecementTab = () => { hideTab(); currentTab--; showTab(currentTab); }
const incrementTab = () => { hideTab(); currentTab++; showTab(currentTab); }

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class on the current step:
    x[n].className += " active";
}

const getStringWithNumbersOnly = (str) => [...str].filter((v) => Number.isInteger(+v) && v !== ' ').join('');

const formatString = (str) => {
    const numStr = getStringWithNumbersOnly(str);
    return numStr.length > 2 ? '+(' + numStr.substring(0, 2) + ') - ' + numStr.substring(2) : numStr;
};

function showConfirmation() {
    let checkedPlan, planAmount, addOnAmount = [], addOnList = [], checkedAddons = [...document.getElementsByName("add-on")].filter(c => c.checked);
    [...plans].some(c => { if (c.checked) checkedPlan = c.getAttribute('id'); });
    let selectedPlan = selectedYearPlan ? 'Yearly' : 'Monthly';
    for (const [key, value] of Object.entries(plan)) {
        if (checkedPlan === key) planAmount = value;
    }

    checkedAddons.forEach(check => {
        let addOn = check.getAttribute('id');
        addOnList.push(addOn.replace('-', ' ').replace(/^./, addOn[0].toUpperCase()))
    });

    for (const [key, value] of Object.entries(addOn)) {
        addOnList.forEach(item => {
            if (item === key) addOnAmount.push(value);
        })
    }

    let addOnAmountList = [];
    if (selectedYearPlan) {
        selectedPlan = 'Yearly';
        planAmount = planAmount * 10;
        addOnAmountList = addOnAmount?.map(val => val * 10);
    } else {
        selectedPlan = 'Monthly'
        addOnAmountList = addOnAmount;
    }

    summaryHeadingDT.innerText = `${checkedPlan?.replace(/^./, checkedPlan[0]?.toUpperCase())} (${selectedPlan})`;
    summaryHeadingDD.innerText = `$${planAmount}/${selectedYearPlan ? 'yr' : 'mo'}`;

    [...finalStep.children].forEach(child => { !child.classList.contains('summary-heading') ? child.remove() : '' })

    for (let i = 0; i < addOnList.length; i++) {
        const dd = document.createElement('dd');
        dd.innerText = `+$${addOnAmountList[i]}/${selectedYearPlan ? 'yr' : 'mo'}`
        const dt = document.createElement('dt');
        dt.classList.add('summary-result');
        dt.innerText = addOnList[i];
        const dl = document.createElement('dl');
        dl.classList.add('d-flex');
        dl.append(dt, dd);
        finalStep.append(dl);
    }

    totalAmount.children[0]?.remove();

    let total = addOnAmountList.reduce((sum, i) => { sum += i; return sum; }, 0)
    total += planAmount;

    const dd = document.createElement('dd');
    dd.classList.add('total-amount-result');
    dd.innerText = `+$${total}/${selectedYearPlan ? 'yr' : 'mo'}`

    const dt = document.createElement('dt');
    dt.classList.add('summary-result');
    dt.innerText = `Total (per ${selectedYearPlan ? 'year' : 'month'})`

    const dl = document.createElement('dl');
    dl.classList.add('d-flex');

    dl.append(dt, dd);
    totalAmount.append(dl);
}

prevBtn.addEventListener('click', () => derecementTab())

nextBtn.addEventListener('click', () => {
    let checkedPlan = [...plans].some(c => c.checked);
    if (currentTab === 0 && validateInput()) {
        incrementTab();
    } else if ((currentTab === 1 || currentTab === 2)) {
        if (checkedPlan) {
            incrementTab();
        } else {
            planError.classList.remove('hide');
        }
    } else {
        return;
    }
})

function validateInput() {
    let validInput = true;
    inputs.forEach((input) => {
        if (input.value === '') {
            input.classList.add('error');
            input.previousElementSibling.children[0].classList.remove('hide')
            validInput = false;
        } else if (input.getAttribute('id') === 'email') {
            var validRegex = /^[^@]+@[^@]+\.[^@]+$/;
            if (input.value.match(validRegex)) {
                input.focus();
                input.classList.remove('error');
                input.previousElementSibling.children[0].classList.add('hide')
            } else {
                input.classList.add('error');
                input.previousElementSibling.children[0].classList.remove('hide')
                validInput = false;
            }
        }
    })
    if (validInput) {
        return validInput;
    }
    return validInput;
}

form.addEventListener('submit', (e) => {
    hideTab();
    buttonContainer.classList.add('hide');
    e.preventDefault();
    finish.classList.add('thank-you');
})

planRadioBtn.forEach(planRadio => {
    planRadio.addEventListener('click', (e) => {
        if (e.target.checked) {
            e.target.parentElement.parentElement.classList.add('selected-radio');
            planRadioBtn.forEach(planRadio => {
                if (planRadio.getAttribute('id') !== e.target.getAttribute('id')) {
                    planRadio.parentElement.parentElement.classList.remove('selected-radio')
                }
            })
        }
    })
})

addonCheckmark.forEach(checkmark => {
    checkmark.addEventListener('click', (e) => {
        if (e.target.checked) {
            e.target.parentElement.parentElement.classList.add('selected-radio');
        } else {
            e.target.parentElement.parentElement.classList.remove('selected-radio');
        }
    })
})

monthYearSwitch.addEventListener('click', (e) => {
    selectedYearPlan = e.target.checked;
    yearlyPlan.forEach(yearPlan => yearPlan.classList.toggle('hide'))
    monthlyPlan.forEach(monthPlan => monthPlan.classList.toggle('hide'))
})

inputs.forEach((input) => {
    input.addEventListener('change', () => {
        if (!input.checkValidity()) {
            input.classList.add('error');
            input.previousElementSibling.children[0].classList.remove('hide')
        } else {
            input.classList.remove('error');
            input.previousElementSibling.children[0].classList.add('hide')
        }
    })
    input.addEventListener('input', () => {
        if (!input.checkValidity()) {
            input.classList.add('error');
            input.previousElementSibling.children[0].classList.remove('hide')
        } else {
            input.classList.remove('error');
            input.previousElementSibling.children[0].classList.add('hide')
        }
        if (input.getAttribute('id') === 'phone') {
            input.value = formatString(input.value)
        }
        // expression to validate email but does not work always
        // /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    })
});

plans.forEach(plan => {
    plan.addEventListener('click', () => {
        [...plans].some(c => c.checked) ? planError.classList.add('hide') : planError.classList.remove('hide');
    })
});