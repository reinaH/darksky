<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Register routes for an application.
| Tell Laravel the URIs it should respond to
| and give it the controller to call when requested.
|
*/

// use Cache;
use App\Util;
use GuzzleHttp\Pool;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;


//lumen microframework makes you generate your own api keys for your apps.
$app->get('/key', function() {
    return str_random(32);
});



// main view
$app->get('/', 'Controller@index');



// Geocode City from user input bc DarkSky call requires lat,long coordinates. 
// Mapquest API Key: 4nccYHBvah6USjDfNXyhKA0rMzh5qr00 


// Req for forecasted checkbox
$app->get('api/geocode/{locname}/forecasted', function ($locname) {
    $client = new Client();
    $request = new Request(
            "GET",
            "http://www.mapquestapi.com/geocoding/v1/address?key=4nccYHBvah6USjDfNXyhKA0rMzh5qr00&location=".$locname. "" 
            ,
                [],
            "");
        $response = $client->send($request);
        $bod = ($response->getBody());
        $bod = json_decode($bod, TRUE);
        
        $lat = ($bod["results"][0]["locations"][0]["latLng"]["lat"]);
        $lng = ($bod["results"][0]["locations"][0]["latLng"]["lng"]);

        $result = "";

        if ($response->getStatusCode() == 200){
            $request = new Request(
            "GET",
            "https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/".$lat. "," . $lng. ""
            ,
                [],
            "");
            $response = $client->send($request);
            $result = json_decode(($response->getBody()), TRUE);
        }
        else {
            return ("error");
        }
        return ($result);

});



// Req for observed checkbox
$app->get('api/geocode/{locname}/observed', function ($locname) {
    $client = new Client();
    $request = new Request(
            "GET",
            "http://www.mapquestapi.com/geocoding/v1/address?key=4nccYHBvah6USjDfNXyhKA0rMzh5qr00&location=".$locname. "" 
            ,
                [],
            "");
        $response = $client->send($request);
        $bod = ($response->getBody());
        $bod = json_decode($bod, TRUE);
        
        $lat = ($bod["results"][0]["locations"][0]["latLng"]["lat"]);
        $lng = ($bod["results"][0]["locations"][0]["latLng"]["lng"]);

        $result = "";

        if ($response->getStatusCode() == 200){
            
            $d = new DateTime();
            $d->sub(new DateInterval('P1D'));
            $result=array();

            // generate timestamps for past 30 days and today.
            $arr = array();
            array_push($arr, $d->format('U'));
            for ($x = 0; $x < 30; $x++) {
                $d->sub(new DateInterval('P1D'));
                array_push($arr, $d->format('U'));
            }

            // $arr = array_reverse($arr); //render dates newest to oldest

            // render dates oldest to newest- calendar style
            for ($x = 0; $x < 30; $x++) {
                $request = new Request(
                    "GET",
                    "https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/".$lat. "," . $lng. "," .(string)$arr[$x]. "?exclude=hourly,minutely,currently",[],"");
            
                $response = $client->send($request);
                $temp = json_decode(($response->getBody()), TRUE);
                // print_r($result);
                array_push($result, $temp);
            
            }

            return $result;
        }
        else {
            return ("error");
        }
        return ($result);
});



//DarkSky API call basic forecast
$app->get('api/forecast/{lat}/{long}', function ($lat, $long) {
    $client = new Client();
    $request = new Request(
            "GET",
                
            "https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/" .$lat. "," . $long. ""
            ,
                [],
            "");
        $response = $client->send($request);
        $bod = ($response->getBody());
        return ($bod);
});



//DarkSky API call historic forecast (observed checkbox)
$app->get('api/timemachine/{lat}/{long}/{time}', function ($lat, $long, $time) {
    $client = new Client();
    $request = new Request(
            "GET",
            "https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/".$lat. "," . $long. "" .$time. ""
            ,
                [],
            "");
        $response = $client->send($request);
        $bod = ($response->getBody());
        return ($bod);

});



// scratch below. 





// http://www.mapquestapi.com/geocoding/v1/address?key=4nccYHBvah6USjDfNXyhKA0rMzh5qr00&location=Washington,DC
// https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/42.3601,-71.0589,1526843458?exclude=hourly,minutely,currently


// // delete. 
// $app->get('/test', function() {
//     $client = new Client();
//     $d = new DateTime();
//     $d->sub(new DateInterval('P1D'));
//     $result=array();

//     // generate timestamps for past 30 days and today.
//     $arr = array();
//     array_push($arr, $d->format('U'));
//     for ($x = 0; $x < 30; $x++) {
//         $d->sub(new DateInterval('P1D'));
//         array_push($arr, $d->format('U'));
//     } 

//     for ($x = 0; $x < 30; $x++) {
//         $request = new Request(
//             "GET",
//             "https://api.darksky.net/forecast/52b1c376f969f7cf82d77c07c6fb7a27/42.3601,-71.0589," .(string)$arr[$x]. "?exclude=hourly,minutely,currently",[],"");
    
//         $response = $client->send($request);
//         $temp = json_decode(($response->getBody()), TRUE);
//         // print_r($result);
//         array_push($result, $temp);
    
//     }
//     return $result[0];

// }