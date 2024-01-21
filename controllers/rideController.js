const config = require('../config.js');
const db = require('../database/database.js');
const asyncHandler = require('express-async-handler');

const polyline = require('polyline');

// Display new ride page.
exports.new_ride = asyncHandler(async (req, res, next) => {
    res.render('new_ride', { key: config.directionsAPI });
});

// API call for new ride.
exports.get_directions = asyncHandler(async (req, res, next) => {

    heatMapArr = []
    heatMapIntensity = 3


    function findIndexOfMin(arr) {
        if (!arr.length) {
            return null;
        }

        const minValue = Math.min(...arr);
        const minIndex = arr.indexOf(minValue);

        return minIndex;
    }

    function apiToArr(routes) {
        const allCoordinatesArr = [];

        for (const route of routes) {
            const coordinatesArray = [];

            for (const leg of route) {
                for (const polylineLine of leg.steps) {
                    // const polylineLine = step.polyline.points;
                    const decodedCoordinates = polyline.decode(polylineLine);
                    for (const [lat, lng] of decodedCoordinates) {
                        coordinatesArray.push([lat, lng]);
                    }
                }
            }

            allCoordinatesArr.push(coordinatesArray);
        }
        return allCoordinatesArr;
    }

    const fs = require('fs');


    function readCollisionsCsvAndCreateArray(csvFile) {
        return new Promise((resolve, reject) => {
            const dataArray = [];
    
            db.serialize(() => {
                db.all(`SELECT * FROM collisions`, (err, rows) => {
                    if (err) {
                        console.error(err.message);
                        reject(err); // Reject the promise with the error
                        return;
                    }
                    rows.forEach((row) => {
                        dataArray.push([
                            row.LOC_LAT,
                            row.LOC_LONG,
                        ]);
                    });
                    resolve(dataArray); // Resolve the promise with the dataArray
                });
            });
        });
    }
    
    

    function readTrafficCsvAndCreateArray(csvFile) {
        const dataArray = [];
    
        db.serialize(() => {
            db.all(`SELECT * FROM traffic`, (err, rows) => {
                if (err) {
                    console.error(err.message);
                }
                rows.forEach((row) => {
                    dataArray.push([
                        row.Longitude,
                        row.Latitude,
                        row.total,
                    ]);
                });
            });
        });
    
        // Return the dataArray (optional)
        return dataArray;
    }
    

    function closeToCollision(coordPair, collisionDataArr) {
        const [longA, longB] = coordPair;

        for (const collCoordPair of collisionDataArr) {
            // console.log("1")
            console.log(collCoordPair)
            console.log(longA, longB)
            console.log("A")
            if (
                Math.abs(longA - collCoordPair[0]) < 0.0001 ||
                Math.abs(longB - collCoordPair[1]) < 0.0001
            ) {
                console.log("here")
                a = { lat: longA, lng: longB, intensity: heatMapIntensity }
                heatMapArr.push(a);                
                return true;
            }
        }

        return false;
    }

    function trafficAdjustment(coordPair, trafficDataArray) {
        const [longA, longB] = coordPair;

        for (const tripleTuple of trafficDataArray) {
            // console.log("2")


            if (
                Math.abs(longA - tripleTuple[0]) < 0.0001 ||
                Math.abs(longB - tripleTuple[1]) < 0.0001
            ) {
                a = [longA, longB, heatMapIntensity]
                heatMapArr.push(a);
                return tripleTuple[2];
            }
        }

        return 0;
    }

    function findClearestRoadsRoute(allRouteDataArray, trafficDataArray) {
        const trafficScoreArray = [];

        for (let i = 0; i < allRouteDataArray.length; i++) {
            let trafficScore = 0;
            for (const coordPair of allRouteDataArray[i]) {
                trafficScore += trafficAdjustment(coordPair, trafficDataArray);
            }
            trafficScoreArray.push(trafficScore);
        }

        return findIndexOfMin(trafficScoreArray);
    }

    function findSafestRoute(allRouteDataArr, collisionDataArr) {
        const collisionScoreArr = [];

        for (let i = 0; i < allRouteDataArr.length; i++) {
            let collisionCounter = 0;
            for (const coordPair of allRouteDataArr[i]) {
                if (closeToCollision(coordPair, collisionDataArr)) {
                    collisionCounter++;
                }
            }
            collisionScoreArr.push(collisionCounter);
        }

        return findIndexOfMin(collisionScoreArr);
    }

    try {
        const allRouteDataArr = apiToArr(req.body);
        const collisionCsvFileName = 'collisions.csv';
        const trafficCsvFileName = 'traffic.csv';
        const trafficDataArr = readTrafficCsvAndCreateArray(trafficCsvFileName);
        
        console.log(trafficDataArr)
        
        const collisionDataArr =
            await readCollisionsCsvAndCreateArray(collisionCsvFileName);
        console.log(collisionDataArr)
        const safestRouteIndex = findSafestRoute(
            allRouteDataArr,
            collisionDataArr
        );
        const clearestRoadsIndex = findClearestRoadsRoute(
            allRouteDataArr,
            trafficDataArr
        );
        console.log(safestRouteIndex);
        console.log(clearestRoadsIndex);
        rankings = {
            safest: safestRouteIndex,
            leastTraffic: clearestRoadsIndex,
        };
        res.json(rankings);

        console.log(heatMapArr)


    } catch (error) {
        console.log(error);
    }
});


