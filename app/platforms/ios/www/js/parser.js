
// parser.js


/*APP.factory('FactoryName', function () {
            return {
            functionName: function () {}
            };
            });

*/


function parseStringToDimension(value) {
    value = value.toLowerCase();
    var array = value.split(" ");
    array = updateDigits(array);
    array = updateFirstTwoToM(array);
    array = updateCM(array);
    array = updateMs(array);
    array = updateM(array);
    array = updateMM(array);
    value = summAll(array);
    return value;
};


//helpers


function updateDigits(array) {
	for (var i =0; i < array.length; i++) {
		if (array[i] === "ноль") {
			array[i] = "0";
		}
        if (array[i] === "раз") {
            array[i] = "1";
        }
        if (array[i] === "один") {
            array[i] = "1";
        }
		if (array[i] === "два") {
			array[i] = "2";
		}
		if (array[i] === "три") {
			array[i] = "3";
		}
		if (array[i] === "четыре") {
			array[i] = "4";
		}
		if (array[i] === "пять") {
			array[i] = "5";
		}
		if (array[i] === "шесть") {
			array[i] = "6";
		}
		if (array[i] === "семь") {
			array[i] = "7";
		}
		if (array[i] === "восемь") {
			array[i] = "8";
		}
		if (array[i] === "девять") {
			array[i] = "9";
		}
	}
	return array;
}

function updateCM(array) {
	for (var i =0; i < array.length; i++) {
        if (array[i] === "и") {
            array[i] = "см";
        }

        
		if ((i > 0) && (array[i] === "см") && (isNumber(array[i - 1]))) {
			array[i - 1] = parseInt(array[i - 1]) * 10;
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMM(array) {
	for (var i =0; i < array.length; i++) {
		if ((i > 0) && (array[i] === "мм") && (isNumber(array[i - 1]))) {
			array.splice(i, 1);
		}
	}
	return array;
}

function updateMs(array) {
	for (var i =0; i < array.length; i++) {
		if (array[i] === "метр" || array[0] === "1м" || array[i] === "тыща" 
			|| array[i] === "тысяча") {
			array[i] = "м";
		}
	}
	return array;
}

function updateM(array) {
	for (var i =1; i < array.length; i++) {
		if ((array[i] === "м") && (isNumber(array[i - 1]))) {
			array[i - 1] = "" + parseInt(array[i - 1]) * 1000;
			array = upadtePostM(array, i);
			array.splice(i, 1);
		}
	}
	if (array[0] === "м") {
		array[0] = "1000";
		array = upadtePostM(array, 0);
	}

	return array;
}

function updateFirstTwoToM(array) {
	if (array.length == 2) {
		if ((isNumber(array[0])) && (isNumber(array[1]))) {
			array[2] = array[1];
			array[1] = "м";
			//array[0] = "" + parseInt(array[0]) * 1000;
			
			if (parseInt(array[2]) < 100) {
				array[3] = "см";
			} else {
				array[3] = "мм";
			}
		}
	}
	return array;
}

function upadtePostM(array, i) {
	if (i === array.length - 2) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1]) < 100)) {
			array[i + 1] = "" + parseInt(array[i + 1]) * 10;
		}
	} else if (i < array.length - 1) {
		if ((isNumber(array[i + 1])) && (parseInt(array[i + 1]) < 100) && (isNumber(array[i + 2]))) {
			array[i + 1] = "" + parseInt(array[i + 1]) * 10;
		}		
	}
	return array;
}
/*
function updateHalf(array) {
	for (var i =1; i < array.length - 2; i++) {
		if ((array[i] === "с") && (array[i + 1] === "половиной")) {
			array[i - 1] = "" + parseFloat(array[i -1]) + 0.5; 
			array.splice(i, 2);
		}
	}
	return array;
}

*/

function summAll(array) {
	var ret = 0;
	for (var i =0; i < array.length; i++) {
		ret += parseInt(array[i]); 
	}
	return "" + ret;
}



String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};


function isNumber(str) {
   return  ("" + parseInt(str) === str); 
};

