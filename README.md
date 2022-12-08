# EQ2-Parser

An application to parse the EQ2 log file and extract key data for performance analysis.

## Observation
* Log timer uses 1 second units.
* Many entries can exists sharing the same timer stamp




1) app will have to continuously monitor the combat log for changes but the frequency of the check (interval) should be less than the processing time.

Test 1 - interval set to 100ms
New log file processing time is 1ms.
medium log file (950kB, approx 5000 entries) takes 14ms
verylarge log file (66MB, apporx 66k entries) takes 967ms and crashes the application.

conclusion: Its still missing entries as some appear to be logged in blocks with the same time stamp so relying on a change event to trigger each new update isnt working. Am going to have to think of a way to watch for an event then loop back through the log to find the time stamp of a combat event start point then again to determione a combat event end point then process the code inbetween.

I may still get away without the need for a async function as the combat log itself will never miss an event as its updated by the game.


# log analysis
The char being played features in the combat log as YOU and YOUR. All other poi's (persons of interest) feature by their name. Including pets.


You start fighting.
You send your pet in for the attack!
You stop fighting.




## Damage input
Damage the player receives features as 'YOU'.
Damage other players receive features by their name.
* a Thulian lifestealer tries to disease YOU with Bloodcloud, but YOU resist.
* a Thulian torturer's Hemotoxin hits YOU for 30 poison damage.
* Konartik tries to pierce YOU, but misses.


## Health and mana input
* YOUR Corruption of the Elements heals YOU for 48 hit points.
* YOUR Corruption of the Elements refreshes YOU for 48 mana points.
* YOUR Lambent Rejuvenation heals YOU for 35 hit points.
* Adohi's Manatap refreshes YOU for 14 mana points.
* Adohi's Manatap refreshes Adohi for 14 mana points.

## Damage output
Damage the player outputs features as 'YOU' and 'YOUR' Some samples include...
* YOUR Flameshield hits a Thulian lifestealer for 78 heat damage.
* YOUR Earthquake hits Jonekn for 1,628 magic damage.
* YOUR Crystal Blast hits a Thulian torturer for 1,218 magic damage.
* YOU hit a Thulian torturer for 691 crushing damage.
* YOU try to burn Konartik with Flameshield, but Konartik resists.
* YOUR Shattered Earth hits a Thulian torturer for 315 magic damage.
* Garn's Blooming Flames hits a Thulian torturer for 319 heat damage.
* Garn's Wisp Blade hits a Thulian torturer for 1,908 cold damage.
* Garn's Thunderous Attack hits a Thulian torturer for 1,013 cold damage.
* Garn's Shout increases THEIR hate with a Thulian torturer for 1,529 threat.
* Garn's Aery Whip hits a Thulian torturer for 327 cold damage.
* Garn tries to pierce a Thulian torturer, but misses.


# TODO
|Status |Task |Update |
|-|-|-|
_|Check a players pet with the same name as the player is parsed by their name also.||
Done |Parse sample log file and save ouputs filtered for the following keywords. [YOU, you, You, YOUR, Garn (pet name), Garn's, Adohi, Adohi's]|export.js module created to to this. Added optional params that default to the test environment. See module for details|
_|Ensure '\aNPC' entries are exluded. These appear to be chat entries which could be exploited to influence the parse if keywords are included. Maybe check other parsers see if this works... ||
_|Replace the readFileSync method with async version to address processing time issues with busy log (Live file processing on large log file with 66k entries, over 6 million chars currently takes 1300ms. Need to monitor manualy and adjust the interval value to better accomodate the processing time until async methods are tested. need to investigate methods to improve on this if its posible) ||
_|Need to accomodate riposte damage. I dont currently have any log data showing this event type but from what I have seen the riposte event and the damage associated with it are on seperate entries. See sample below. Need to look into it and accomodate it.  ||

    


riposte event...

(1668106272)[Thu Nov 10 19:51:12 2022] a sandfang prowler tries to slash X, but Y ripostes.

(1668106272)[Thu Nov 10 19:51:12 2022] Y hits a sandfang prowler for 160 piercing damage.

another event...

(1668106361)[Thu Nov 10 19:52:41 2022] Y tries to crush a Dunefury mystic, but a Dunefury mystic ripostes. 

(1668106361)[Thu Nov 10 19:52:41 2022] a Dunefury mystic hits Y for 235 slashing damage.
