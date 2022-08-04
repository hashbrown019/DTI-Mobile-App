let page = window.location.pathname.split("/").pop().split(".")[0]
// println("Current page : "+page)
document.querySelector('title').textContent = page;

// ==================================================================
let selected_farmer_ = undefined


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(cordova.file);
	println(" * SAVE FORM Module Ready ===================");

	check_for_data(function(fname,DATA){
		println("--- Done Loading Data From >>> "+fname)
		println("--- Calling ONLOADDATA() function ")
		try{
			ONLOADDATA(DATA)
			println("--- ONLOADDATA() function Detected")

		}catch{
			println("xxx NO ONLOADDATA() function Detected")
		}
	})

}

function check_for_data(func){
	var form_name = url_args['farmer_id']+"@"+page+".txt"
	selected_farmer_ = url_args['farmer_id']
	println("Finding :::: "+form_name)
	FILES_IS_EXIST(
		form_name,
		function (res){
			println("data found :::: "+form_name)
			$ID("is_form_filled").innerHTML = "Profiling - Edit"
			refill_data_forms(form_name,func)

		},
		function (){
			println("not found :::: "+form_name)
			$ID("is_form_filled").innerHTML = "Profiling - New"

		}
	)
}

let RELOAD_FIELD = undefined
let ONLOAD_RE_EXEC = false
function refill_data_forms(file_name,func){ /////////// REFILLING FOR HAS DATA 
	_readFileEntry(file_name,function(res,fnmae){
		var form_data_refill = JSON.parse(res)
		var form_data = $CLASS("form_data")

		func(fnmae,form_data_refill) // CALLBACK FROM check_for_data() FUNCTION
		RELOAD_FIELD =function FILL_F(){
			for (var i = 0; i < form_data.length; i++) {
				if(form_data[i].type=='checkbox'){
					// form_data[i].checked = form_data_refill[form_data[i].id] // DIRECT VALUE Transfer 

					if(form_data_refill[form_data[i].id]){// Simulate Clicked
						println(" --- Clicking >>>> "+form_data[i].id) // Simulate Clicked
						form_data[i].click() // Simulate Clicked
					}
				}
				else{
					try{form_data[i].value = form_data_refill[form_data[i].id]}
					catch(e){println("ERROR in refill_data_forms :: "+e)}
				}
			}

			// -----------------For Image PROFILE--------------------
			try{
				$ID('preview_profile_img').src = form_data_refill['farmer_img_base64']
			}
			catch{
				println(" no image preview availble on this form")
			}
			// ------------------For Image add Profile--------------------
			try{
				var farm_img = JSON.parse(form_data_refill['farm-photo'])
				$ID('farm_photo-viewer').innerHTML = ""
				if(farm_img.length!=0){
					for (var i = 0; i < farm_img.length; i++) {
						$ID('farm_photo-viewer').innerHTML += `<img src="`+farm_img[i]+`" style="max-width:20%;" class="x-border x-round-large">` 
					}
	 			}
			}
			catch{
				println(" no image preview availble on this form")
			}
			// ------------------For Image POST Harvest--------------------
			try{
				var img_cv = 0
				for(key in form_data_refill){
					if(key.includes("post_harv-photo")){
						var pic_ls = JSON.parse(form_data_refill[key])

						println('oyeah has ['+pic_ls.length+']>>> '+key)
						$ID(key).parentNode.querySelectorAll(".img_viewer")[0].innerHTML = ""
						var img_prev =""
						for (var i = 0; i < pic_ls.length; i++) {
							img_prev += `<img src="`+pic_ls[i]+`" style="max-width:20%;" class="x-border x-round-large">`

						}
						$ID(key).parentNode.querySelectorAll(".img_viewer")[0].innerHTML += img_prev + pic_ls.length + " Photo/s"
						// document.querySelectorAll("div.img_viewer")[img_cv].innerHTML += img_prev
						img_cv+=1
					}
				}
			}
			catch(e){
				println(" no image preview availble on this form \n  "+e)
			}
			var smp_s = document.querySelectorAll("div.img_cc_asd")
			for (var i = 0; i < smp_s.length; i++) {
				println(smp_s[i].querySelector(".img_content").id)
			}
			if (ONLOAD_RE_EXEC) {
				println(" * ONLOADDATA Re Execute -----")
				func(fnmae,form_data_refill)
				ONLOAD_RE_EXEC = false
				println(" * ONLOADDATA Re Execute Fini-----")

			}
		}
		RELOAD_FIELD()
	})
}


function back_to_home(){
	goto("../home_screen.html?tab_index=1&selected_farmer_="+selected_farmer_)
}

function create_formdata(FILE_NAME,func){
	var form_data = $CLASS("form_data")
	var form_data_ = {}
	for (var i = 0; i < form_data.length; i++) {
		if(!form_data[i].id.includes("[]")){
			if(form_data[i].type=='file'){
				form_data_[form_data[i].id]=form_data[i].files
			}
			if(form_data[i].type=='checkbox'){
				form_data_[form_data[i].id]=form_data[i].checked
			}
			else{
				form_data_[form_data[i].id] =form_data[i].value
			}
		}
		else{
			if(form_data_[form_data[i].id]==undefined){
				form_data_[form_data[i].id] = []
			}

			if(form_data[i].type=='file'){
				form_data_[form_data[i].id].push(form_data[i].files)
			}
			if(form_data[i].type=='checkbox'){
				form_data_[form_data[i].id].push(form_data[i].checked)
			}
			else{
				form_data_[form_data[i].id].push(form_data[i].value)
			}
		}
	}
	form_data['USER_ID'] = url_args['user_id']
	form_data_['USER_ID'] = url_args['user_id']
	try{
		_createNewFileEntry(FILE_NAME,JSON.stringify(form_data_),function(){
			println("========_createNewFileEntry CALLED=====")
			func()
		})
	}catch{
		alert("Failed in saving data\nplease restart the application")		
	}
	println(form_data_)
	println(FILE_NAME)
}

function hashCode(string){
	var hash = 0;
	for (var i = 0; i < string.length; i++) {
		var code = string.charCodeAt(i);
		hash = ((hash<<5)-hash)+code;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
 
// -------------------

let watchID = undefined
let mymap = undefined
let wait_location_interval = 0
let geoloc = undefined
function get_location(){
	geoloc= navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 30000 });
}

function onSuccess(position) {
	$ID('geolocation').innerHTML = 
		'Latitude: ' + 
		position.coords.latitude + 
		'<br />Longitude: ' + 
		position.coords.longitude
	$ID('farmer-coords_long').value = position.coords.longitude
	$ID('farmer-coords_lat').value = position.coords.latitude
}
// onError Callback receives a PositionError object
//
function onError(error) {
	alert('code: '    + error.code    + '\n' +
			'message: ' + error.message + '\n');
}

// =================================================
// function get_location(){
// 	println("******* Getting Location ******* ")
// 	navigator.geolocation.watchPosition(onSuccess, onError, {  maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
// 	wait_location_interval = 0
// }

// function onSuccess(position) {
// 	if(wait_location_interval <1){
// 		if(marker != undefined){mymap.removeLayer(marker)}
// 		marker = L.marker({"lat":position.coords.latitude,"lng":position.coords.longitude}).addTo(mymap);
// 		mymap.setView([position.coords.latitude, position.coords.longitude], 13);
// 		get_address_(position.coords.latitude, position.coords.longitude)

// 		println("DONE GETTING LOCATION")

// 	}
// 	wait_location_interval += 1
// };
// function onError(error) {
// 	alert('code: ' + error.code + ' | ' + 'message: ' + error.message )
// }

// --------------------------------------


function ip_names(el){
	_autocomplete(el,IP_NAMES)
	// println(JSON.stringify(IP_NAMES))
}

function get_dip_ls(el){
	_autocomplete(el,DIP_LIST)
	// println(JSON.stringify(IP_NAMES))
}

function get_fo_ls(el){
	_autocomplete(el,FO_LIST)
	// println(JSON.stringify(IP_NAMES))
}

function region_sel(el){
	var arrs = []
	for (const [key, value] of Object.entries(ALL_LOCATION)) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}

function ls_prov(el){
	var selregion = $ID('addr_region').value.toUpperCase();
	var arrs = []
	for (const [key, value] of Object.entries(ALL_LOCATION[selregion]['province_list'])) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}


function ls_city(el){
	var arrs = []
	var region = $ID("addr_region").value.toUpperCase();
	var prov = $ID("addr_prov").value.toUpperCase();

	for (const [key, value] of Object.entries(ALL_LOCATION[region]['province_list'][prov]['municipality_list'])) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}


function ls_brgy(el){
	var arrs = []
	var region = $ID("addr_region").value.toUpperCase();
	var prov = $ID("addr_prov").value.toUpperCase();
	var municipality = $ID("addr_city").value.toUpperCase();

	for (var i = 0; i < ALL_LOCATION[region]['province_list'][prov]['municipality_list'][municipality]['barangay_list'].length; i++) {
		var key = ALL_LOCATION[region]['province_list'][prov]['municipality_list'][municipality]['barangay_list'][i]
		arrs.push(key)
	}
	_autocomplete(el,arrs)

}


// ====================================================
function _autocomplete(inp, arr) {
	var currentFocus;
	inp.addEventListener("input", function(e) {
			var a, b, i, val = this.value;
			println(a)
			closeAllLists();
			if (!val) { return false;}
			currentFocus = -1;
			a = document.createElement("DIV");
			a.setAttribute("id", this.id + "autocomplete-list");
			a.setAttribute("class", "autocomplete-items");
			this.parentNode.appendChild(a);
			for (i = 0; i < arr.length; i++) {
				if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
					b = document.createElement("DIV");
					b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
					b.innerHTML += arr[i].substr(val.length);
					b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
					println(arr[i])
					b.addEventListener("click", function(e) {
							inp.value = this.getElementsByTagName("input")[0].value;
							// closeAllLists();
					});
					a.appendChild(b);
					// if(i >=5){
					// 	break
					// }
				}

			}
	});
	
	inp.addEventListener("keydown", function(e) {
			var x = document.getElementById(this.id + "autocomplete-list");
			if (x) x = x.getElementsByTagName("div");
			if (e.keyCode == 40) {
				currentFocus++;
				addActive(x);
			} else if (e.keyCode == 38) { //up
				currentFocus--;
				addActive(x);
			} else if (e.keyCode == 13) {
				e.preventDefault();
				if (currentFocus > -1) {
					if (x) x[currentFocus].click();
				}
			}
	});

	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}

	document.addEventListener("click", function (e) {
			closeAllLists(e.target);
	});
}

function trigger_check(chbox,_ids){
	if (chbox.checked) {$ID(_ids).style.display = "block"}
	else{$ID(_ids).style.display = "none"}
}


// ==============================Temporary Solutionfor Duplication field in prod_cost address

function __region_sel(el){
	var arrs = []
	for (const [key, value] of Object.entries(ALL_LOCATION)) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}

function __ls_prov(el){
	println(el.parentNode.parentNode.querySelectorAll(".reg"))
	var selregion = el.parentNode.parentNode.querySelectorAll(".reg")[0].value.toUpperCase();
	// var selregion = $ID('addr_region').value.toUpperCase();
	var arrs = []
	for (const [key, value] of Object.entries(ALL_LOCATION[selregion]['province_list'])) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}


function __ls_city(el){
	var arrs = []
	var region = el.parentNode.parentNode.querySelectorAll(".reg")[0].value.toUpperCase();
	var prov = el.parentNode.parentNode.querySelectorAll(".prov")[0].value.toUpperCase();

	// var region = $ID("addr_region").value.toUpperCase();
	// var prov = $ID("addr_prov").value.toUpperCase();

	for (const [key, value] of Object.entries(ALL_LOCATION[region]['province_list'][prov]['municipality_list'])) {
		arrs.push(key)
	}
	_autocomplete(el,arrs)
}


function __ls_brgy(el){
	var arrs = []

	var region = el.parentNode.parentNode.querySelectorAll(".reg")[0].value.toUpperCase();
	var prov = el.parentNode.parentNode.querySelectorAll(".prov")[0].value.toUpperCase();
	var municipality = el.parentNode.parentNode.querySelectorAll(".city")[0].value.toUpperCase();

	// var region = $ID("addr_region").value.toUpperCase();
	// var prov = $ID("addr_prov").value.toUpperCase();
	// var municipality = $ID("addr_city").value.toUpperCase();

	for (var i = 0; i < ALL_LOCATION[region]['province_list'][prov]['municipality_list'][municipality]['barangay_list'].length; i++) {
		var key = ALL_LOCATION[region]['province_list'][prov]['municipality_list'][municipality]['barangay_list'][i]
		arrs.push(key)
	}
	_autocomplete(el,arrs)

}