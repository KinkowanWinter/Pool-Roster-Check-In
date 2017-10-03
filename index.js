//jshint esnext: true
let today = new Date(),
    dateFormattingOptions = {weekday: "long", year: "numeric", month: "long", day: "numeric"},
    dayOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let pswd = "Harper17";
let memberId = 0;

const dates = [];
let now = today.toLocaleDateString("en-US", dateFormattingOptions);
if(!(now in dates)){
    dates.push(now);
}

//Member
class Member {
    static setId() {
        return memberId++;
    }
    constructor(name, isCheckingIn = false){
        this.name = name;
        this.isCheckedIn = false;
        this.checkInDay = now;
        this.dayOfTheWeek = null;
        this.checkInDates = [];
        this.memberId = Member.setId();
        if (isCheckingIn === true) {
            this.checkIn();
        }
    }
    //if (now in dates) {
        //this.checkInDates.push(this.displayStatus());
    //}
    checkIn(){
        let rNow = new Date(), dayOfWeek = rNow.getDay();
        if (!this.isWeekday(dayOfWeek)) {
            displayError(103);
        } else {
            this.isCheckedIn = true;
            this.dayOfTheWeek = this.getProperDayName(dayOfWeek);
            this.memberRow();
        }
    }
    checkOut(){
        if (prompt("Password:") == pswd) {
            this.isCheckedIn = false;
            this.dayOfTheWeek = null;
            this.memberRow();
        } else {
            displayError(102);
        }
    }
    displayStatus(){
        return `${this.name} | ${this.checkInDay} | Checked In: ${getProperBool(this.isCheckedIn)}`;
    }
    //Note: 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
    getFormattedDate(x){
        if (x !== now) {
            return x.toLocaleDateString("en-US", dateFormattingOptions);
        }
    }
    isWeekday(dayIndex){
        return dayIndex >= 1 && dayIndex <= 5;
    }
    getProperDayName(dayIndex){
        return dayOfWeekNames[dayIndex];
    }
    displayName(){
        return `${this.name}`;
    }
    displayHistory(){
        for (let n = 0; n < dates.length; n++) {
            if (dates[n] == now) {
                this.checkInDates[n] = this.displayStatus();
            }
        }
        alert(getProperArray(this.checkInDates));
    }
    memberRow(){
        const roster = document.querySelector("#roster");
        let tr = document.getElementById(`${this.memberId}`);
        tr.children[0].append(document.createTextNode(""));
        tr.children[0].innerText = `${this.name}`;
        tr.children[3].append(document.createTextNode(""));
        tr.children[3].innerText = `${getProperBool(this.isCheckedIn)}`;
        const rosterHandler = e => {
            let target = getEventTarget(e);
            switch (target) {
                case tr.children[0]:
                    break;
                case tr.children[1].firstElementChild:
                    this.checkIn();
                    break;
                case tr.children[2].firstElementChild:
                    this.checkOut();
                    break;
                case tr.children[3]:
                    break;
                case tr.children[4].firstElementChild:
                    this.displayHistory();
                    break;
                default:
                    break;
            }
        };
        tr.addEventListener("click", rosterHandler);
    }
}

//Dates & Errors
function displayToday(){
    return "Today's date: " + today.toLocaleDateString("en-US", dateFormattingOptions) + ".";
}

function storeDates() {
    let dates = [];
    let thisDay = today.toLocaleDateString("en-US", dateFormattingOptions);
    for (let i = 0; i < dates.length; i++) {
        if (!(thisDay in dates)) {
            dates.push(thisDay);
        }
    }
}

function getProperBool(bool) {
    if (bool === true) {
        bool = "Yes";
    } else if (bool === false) {
        bool = "No";
    } else {
        displayError(104);
    }
    return bool;
}

function getProperArray(array){
    let nArray = "";
    for (let i = 0; i < array.length; i++) {
        nArray += `${array[i]} \n`;
    }
    return nArray;
}

function displayError(code){
    console.log("Error", code);
    let msg = "";
    if (code === 101) {
        msg = "You are already checked in.";
    } else if (code === 102) {
        msg = "Incorrect Password";
    } else if (code === 103) {
        msg = "Sorry, check-in is only allowed on weekdays.";
    } else if (code === 104) {
        msg = "An unspecified error has occured.";
    } else if (code === 105) {
        msg = "You can't check out if you haven't checked in.";
    }
    console.log(msg);
    alert(msg);
}

//Roster
const poolRoster = [];

function addMember(name, checkIn){
    let member = new Member(name, checkIn);
    poolRoster.push(member);
    member.memberRow();
}

function displayRoster(){
    for (let n = 0; n < poolRoster.length; n++) {
        console.log(poolRoster[n].displayStatus());
    }
}

function newRoster(){
    if (prompt("Password:") == pswd) {
        for (let k = 0; k < 15; k++) {
            let name = prompt("Name:");
            addMember(name, false);
        }
        displayRoster();
    } else {
        displayError(102);
    }
}

function runInstance(bool){
    if (prompt("Password:") == pswd) {
        let name = prompt("Name:");
        addMember(name, bool);
        displayRoster();
    } else {
        displayError(102);
    }
}

function clearRoster(){
    poolRoster.length = 0;
    dates.length = 0;
}

//Event Listeners
const buttons = document.querySelector("#buttons");

const getEventTarget = e => {
    e = e || window.event;
    return e.target || e.srcElement;
};

const buttonHandler = e => {
    let target = getEventTarget(e);
    switch (target) {
        case buttons.children[0]:
            newRoster();
            break;
        case buttons.children[1]:
            runInstance(false);
            break;
        case buttons.children[2]:
            runInstance(true); 
            break;
        case buttons.children[3]: 
            clearRoster();
    }
};

buttons.addEventListener("click", buttonHandler);