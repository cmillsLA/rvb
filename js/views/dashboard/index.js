define([
    'jquery',
    'underscore',
    'backbone',
		'jquery.ui',
		'jquery.validate',
		'collections/getResults',
    'text!templates/dashboard/index.html'
], function($, _, Backbone, jui, Validate, getResults, template) {
    var homeView = Backbone.View.extend({

        initialize: function() {
            $(this.el).html(template);
						this.render();
						this.setupElements();
						this.getCurrentMortgageRates();
        },
				
				events: {
					'click #btnGetData':'getAPIData',
					'click #btnEnterData':'showRvbCalc',
					'click #calculateRBV':'calculateRBV',
					'blur #rvbCalculator input': 'calculateRVB',
					'change #rvbCalculator select': 'calculateRVB',
					'keyup #rvbDP': 'calculateDP',
					'keyup #rvbBuy':'calculateDP',
					'click #resetRBV':'resetCalc',
					'click .valuesManual':'toggleValues',
					'click .valuesAddress':'toggleValues'
				},
				
				getAPIData: function() {
					var _this = this;
					$('#btnGetData').val('Loading...').prop('disabled',true);
					var addressString = encodeURIComponent($('#rvbAddress').val() + $('#rvbAddress2').val());
					$.ajax({
						contentType: "application/json; charset=utf-8",
						method: "GET",
						url:'/controllers/getResults.php?address=' + addressString + '&cityStateZip=' + $('#rvbZip').val(),
						success: function(data) {
							var _rvbRent = $(data).find('rentzestimate amount').text();
							var _rvbBuy = $(data).find('zestimate amount').text();
							if(_rvbRent) {
								$('#rvbRent').val(_rvbRent);
							}
							if(_rvbBuy) {
								$('#rvbBuy').val(_rvbBuy);
							}
							$('#rvbCalc').fadeIn(500);
							// Message
							if(_rvbRent && _rvbBuy) {
								$('#messages').html('<div class="alert alert-block alert-success">Success, your address was found, see your home estimated value and rent value below.<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
								_this.calculateDP();
								_this.calculateRBV();
							} else if(_rvbRent || _rvbBuy) {
									$('#messages').html('<div class="alert alert-block">Success, but your rent or home value was unavailable, please manually enter this value.<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
							} else {
								$('#messages').html('<div class="alert alert-block alert-error">We are unable to find a rent estimate or home value for that address at this time, please manually enter these values.<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
							}
							$('#btnGetData').val('Get Data').prop('disabled',false);
						},
						error: function() {
							$('#messages').html('<div class="alert alert-block alert-error">There was a problem with your request, please try again or enter values manually.<button type="button" class="close" data-dismiss="alert">&times;</button></div>');
							$('#btnGetData').val('Get Data').prop('disabled',false);
						}
					});
				},
				
				buildGraph: function(d) {
					// build graph based on calculator values
					console.log('build graph');
					console.log(d);
					$('#rvbGraph').highcharts({
						title: {
							text: 'Rent vs. Buy Comparison',
							x: -20
						},
						subtitle: {
							text: '',
							x: -20
						},
						xAxis: {
							categories: [
								'Rent', 'Own'
							]
						},
						yAxis: {
							title: {
								text: 'Total Cost ($)'
							}
						}
					});
				},
				
				// Calculate mortgage based on selected values
				calculateRBV: function() {
					var _this = this;
					// Make sure the correct downpayment is displaying
					_this.calculateDP();
					var _calcRent = $('#rvbRent').val();
					var _calcVal = $('#rvbBuy').val();
					var _calcDpPercent = $('#rvbDP').val()/100;
					var _calcDpAmt = _calcVal * _calcDpPercent;
					var _calcFinanced = _calcVal - _calcDpAmt;
					var _calcLength = $('#rvbTerm').val() * 12;
					var _calcRate = $('#rvbRate').val()/100/12;
					var _calcTaxes = $('#rvbTaxes').val();
					var _calcHpChange = $('#rvRentChangeVal').val();
					var _calcRentChange = $('#rvRentChangeVal').val();
					var _monthlyPayment = Math.floor((_calcFinanced*_calcRate)/(1-Math.pow(1+_calcRate,(-1*_calcLength)))*100)/100;
					var _totalPayments = _monthlyPayment * _calcLength;
					var _totalInterest = _totalPayments - _calcVal;
					var _totalRent = _calcRent * _calcLength;
					$('#rvbMonthly span').html(_this.formatNumber(_monthlyPayment));
					$('#rvbTotal span').html(_this.formatNumber(_totalPayments));
					$('#rvbInterest span').html(_this.formatNumber(_totalInterest));
					_this.buildAmortizationChart(_calcFinanced, _monthlyPayment, _calcLength, _calcRate);
					$('#rvbGraph').stop().slideDown(250);
					$('#amortizationChart').stop().slideDown(250);
				},
				
				// Build Amortization Chart
				buildAmortizationChart: function(total, monthlyPayment, months, rate) {
					var _this = this;
					$('#amortizationChart tbody').html(''); // clear previous
					var _total = total;
					var _monthlyPayment = monthlyPayment;
					var _months = months;
					var _rate = rate;
					for(var i=1; i<=months; i++) {
						var _interest = _total * _rate;
						var _principal = _monthlyPayment - _interest;
						_total = _total - _principal;
						var aRow = '';
						aRow += '<tr>';
						aRow += '<td width="20%">';
						aRow += i;
						aRow += '</td>';
						aRow += '<td width="20%">';
						aRow += '$' + _monthlyPayment;
						aRow += '</td>';
						aRow += '<td width="20%">';
						aRow += '$' + _this.formatNumber(_principal);
						aRow += '</td>';
						aRow += '<td width="20%">';
						aRow += '$' + _this.formatNumber(_interest);
						aRow += '</td>';
						aRow += '<td width="20%">';
						aRow += '$' + _this.formatNumber(_total);
						aRow += '</td>';
						aRow += '</tr>';
						$('#amortizationChart tbody').append(aRow);
					}
				},
				
				// Format decimals
				formatNumber: function(num) {
					var _num = parseFloat(Math.round(num * 100) / 100).toFixed(2);
					return _num;
				},
				
				// Calculate downpayment
				calculateDP: function() {
					var _this = this;
					var _calcVal = $('#rvbBuy').val();
					var _calcDpPercent = $('#rvbDP').val();
					if(_calcVal > 0 && _calcDpPercent > 0) {
						var _calcDp = _calcDpPercent/100;
						var _calcDpRound = _calcVal * _calcDp;
						$('#rvbDPLabel span').html('$' + _this.formatNumber(_calcDpRound));
					}
				},
				
				// Reset RvB Calulator Values
				resetCalc: function() {
					$('#rvbRent').val('');
					$('#rvbBuy').val('');
					$('#rvbDPLabel span').html('');
					$('.rvbResult span').html('');
					$('#amortizationChart tbody').html('');
					$('#rvbGraph').stop().slideUp(250).html('');
					$('#amortizationChart').stop().slideUp(250);
				},
				
				// Show RvB Calulator
				showRvbCalc: function() {
					this.resetCalc();
					$('#rvbCalc').fadeIn(500);
				},
				
				// Bind jquery ui elements and plugins
				setupElements: function() {
					this.$('#rvHpChange').slider({
						value: 3,
						max: 10,
						min: -10,
						slide: function(event, ui) {
							$('#rvRentChangeVal').val(ui.value);
							$('#rvHpChangeLabel span').html(ui.value + '%');
						}
					});
					this.$('#rvRentChange').slider({
						value: 3,
						max: 10,
						min: 0,
						slide: function(event, ui) {
							$('#rvRentChangeVal').val(ui.value);
							$('#rvRentChangeLabel span').html(ui.value + '%');
						}
					});
					this.$('#rvbTerm').change(function() {
						if($(this).val() == 'rvb30') {
							$('#rvbRate').val($('#rvbRate30').val());
						} else {
							$('#rvbRate').val($('#rvbRate15').val());
						}
					});
					$('#rvbCalculator').validate({
						
					});
				},
				
				// Load todays mortgage rates from Zillow API
				getCurrentMortgageRates: function() {
					$.ajax({
						contentType: "application/json; charset=utf-8",
						url: '/controllers/getRates.php',
						method: "GET",
						success: function(result) {
							var _30Fixed = $(result).find('rate[loanType=thirtyYearFixed]').text().substring(0,4);
							var _15Fixed = $(result).find('rate[loanType=fifteenYearFixed]').text().substring(0,4);
							$('#rvbRate').val(_30Fixed); // set default
							$('#rvbRate30').val(_30Fixed);
							$('#rvbRate15').val(_15Fixed);
						}
					});
				},
				
				toggleValues: function(e) {
					$('.tab-nav li').removeClass('active');
					if($(e.currentTarget).hasClass('valuesManual')) {
						$('.tab-nav .valuesManual').addClass('active');
						$('#valuesZillow').slideUp(250);
					} else {
						$('.tab-nav .valuesAddress').addClass('active');
						$('#valuesZillow').slideDown(250);
					}
					this.resetCalc();
				},

        render: function() {
						console.log('render called');
						_.bindAll(this, 'render');
            return this;
        }
    
    });
    return new homeView;
});