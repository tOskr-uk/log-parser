// console.log(new Date(Date.now()));

    var currentDate = Date.now();
    console.log("Current date and time in milliseconds: ",currentDate);
    var numDate= new Date(currentDate).toUTCString();
    console.log("<br> Milliseconds converted to Date format: ",numDate);