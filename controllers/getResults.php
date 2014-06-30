<?php
	$address = urlencode($_GET['address']);
	$cityStateZip = urlencode($_GET['cityStateZip']);

	$url = 'http://www.zillow.com/webservice/GetSearchResults.htm?zws-id=X1-ZWz1bebhmym3gr_5qhl2&address=' . $address. '&citystatezip=' . $cityStateZip . '&rentzestimate=true';
	$curl = curl_init($url);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$curl_response = curl_exec($curl);
	
	print $curl_response;
	
?>