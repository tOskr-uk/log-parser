# EQ2-Parser

Assumptions
-----------
1) app will have to continuously monitor the combat log for changes but the frequency of the check (interval) should be less than the processing time.

Test 1 - interval set to 100ms
New log file processing time is 1ms.
medium log file (950kB, approx 5000 entries) takes 14ms
verylarge log file (66MB, apporx 66k entries) takes 967ms and crashes the application.

conclusion: Its still missing entries as some appear to be logged in blocks with the same time stamp so relying on a change event to trigger each new update isnt going to work. Am going to have to think of a way to watch for an event then loop back through the log to find the time stamp of a combat event start point then again to determione a combat event end point then process the code inbetween.

I may still get away without the need for a async function as the combat log itself will never miss an event as its updated by the game engine.