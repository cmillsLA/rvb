<?php
	$url = 'http://www.zillow.com/webservice/GetRateSummary.htm?zws-id=X1-ZWz1bebhmym3gr_5qhl2';
	$curl = curl_init($url);

	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$curl_response = curl_exec($curl);
	
	print $curl_response;
	
?>