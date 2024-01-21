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
    function findIndexOfMin(arr) {
        if (!arr.length) {
            return null;
        }

        const minValue = Math.min(...arr);
        const minIndex = arr.indexOf(minValue);

        return minIndex;
    }

    function apiToArr(routeses) {
        const allCoordinatesArr = [];

        for (const routes of routeses) {
            const coordinatesArray = [];

            for (const route of routes) {
                for (const leg of route.legs) {
                    for (const step of leg.steps) {
                        const polylineLine = step.polyline.points;
                        const decodedCoordinates =
                            polyline.decode(polylineLine);
                        for (const [lat, lng] of decodedCoordinates) {
                            coordinatesArray.push([lat, lng]);
                        }
                    }
                }
            }

            allCoordinatesArr.push(coordinatesArray);
        }
        return allCoordinatesArr;
    }

    const fs = require('fs');

    console.log('Swag');

    function readCollisionsCsvAndCreateArray(csvFile) {
        const dataArray = [];
        db.serialize(() => {
            db.serialize(() => {
                db.all(`SELECT * FROM collisions`, (err, rows) => {
                    if (err) {
                        console.error(err.message);
                    }
                    rows.forEach((row) => {
                        dataArray.push([row.LOC_LONG, row.LOC_LAT]);
                    });
                });
            });
        });
        return dataArray;
    }

    function readTrafficCsvAndCreateArray(csvFile) {
        const dataArray = [];
        db.serialize(() => {
            db.serialize(() => {
                db.all(`SELECT * FROM traffic`, (err, rows) => {
                   if (err) {
                     console.error(err.message);
                   }
                   rows.forEach((row) => {
                    dataArray.push([ row.Longitude, row.Latitude, row.total ]);
                   })
                });
               });
        });
        return dataArray;
    }
    
    
    
    function closeToCollision(coordPair, collisionDataArr) {
        const [longA, longB] = coordPair;

        for (const collCoordPair of collisionDataArr) {
            if (
                Math.abs(longA - collCoordPair[0]) < 0 ||
                Math.abs(longB - collCoordPair[1]) < 0.0001
            ) {
                return true;
            }
        }

        return false;
    }

    function trafficAdjustment(coordPair, trafficDataArray) {
        const [longA, longB] = coordPair;
    
        for (const tripleTuple of trafficDataArray) {
            if (Math.abs(longA - tripleTuple[0]) < 0.0001 || Math.abs(longB - tripleTuple[1]) < 0.0001) {
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
        console.log('1');
        const allRouteDataArr = apiToArr(req.body);
        console.log('2');
        const collisionCsvFileName = 'collisions.csv';
        const trafficCsvFileName = 'traffic.csv';
        const trafficDataArr = readTrafficCsvAndCreateArray(trafficCsvFileName)
        const collisionDataArr = readCollisionsCsvAndCreateArray(collisionCsvFileName);
        const safestRouteIndex = findSafestRoute(allRouteDataArr,collisionDataArr);
        const clearestRoadsIndex = findClearestRoadsRoute(allRouteDataArr, trafficDataArr)
        console.log(safestRouteIndex);
        console.log(clearestRoadsIndex);
        rankings = { safest: safestRouteIndex, leastTraffic: clearestRoadsIndex };
        res.json(rankings);


    } catch (error) {
        console.log(error);
    }
});
