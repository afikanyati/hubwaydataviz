// ====== Data Visualization IV ======
//
// When during the day is Hubway most popular?

function buildVizFour(yearData) {
    
    for (let i = 0 ; i < yearData.length; i++){
        var mapdayhrs = {};  //maps days to 24 hours
        var dayhrs = [];             //new storage
        
        var startdayhr = yearData[i]['starttime'];
        startdayhr = startdayhr.split(' ');     //split by spaces
        dayhrs.push(startdayhr.shift());    //add the number
        dayhrs.push(startdayhr.join(' '));  //and the rest of the string
        
        firstchartime = dayhrs[1][0]  // first and 2nd                                         character of time
        secondchartime = dayhrs[1][1]
        
        if dayhrs[0] not in mapdayhrs{
            if (secondchartime is not ":"){  /// ie 10am & after
                mapdayhrs[dayhrs[0]][parseInt(firstchartime + secondchartime)] += 1    //set index of where you will put this count      
            }
            
            else{     // btw 0am and 9am
                mapdayhrs[dayhrs[0]][firstchartime] += 1    //set index of where you will put this count   
            }        
            }
        }
        console.log(dayhrs)  
    } 
