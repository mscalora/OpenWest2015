<?php
    //header("Content-Type: application/json");

    $data = '{ "items": [ { "title": "DSC_3950", "media": { "m": "http://'.$_SERVER["SERVER_NAME"].'/flickr.jpg" }, "author": "nobody@flickr.com (benedict.tufnell)", } ] }';

    sleep(1);

    echo $_GET['jsoncallback'] . '(' . $data . ')';


