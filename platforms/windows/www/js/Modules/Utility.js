try{
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		println("UTILITY MODULE READY-------")
	}
}catch(err){println(err)}

function SYNC_DATA(){
	// $ID("modal_login_loading").style.display = "block"
	// FILES_GET_EXTERNALSTORAGE(function(files){
	// 	var lll_ = files.length
	// 	for (var i = 0; i < files.length; i++) {s
	// 		if(files[i].name != "user_info.txt"){
	// 			_readFileEntry(files[i].name,function(res){
	// 				var farmer_info  = JSON.parse(res)
	// 				var FARMER_ID = farmer_info.farmer_code
	// 				send_data(FARMER_ID,JSON.stringify(farmer_info),i,lll_)
	// 			})
	// 		}

	// 	}
	// 	$ID("modal_login_loading").style.display = "none"
	// 	$ID("modal_done").style.display = "block"
	// })

	alert("this Button is under Maintence. please stay tuned")
}


function send_data(f_name,data_,func){
	var loop__ = 0
	println()
	$send({
		action : DOMAIN+"/api/upload_data",
		method : POST,
		data : $DATA({'data':data_,"f_name":f_name}),
		func : function(res_file){
			// println(res)
			// println(loop+"/"+lll)
			_readFileEntry(res_file+".txt",function(res,fnames_){
				// println("-----upload "+fnames_+" complete----")
				var _new_data = JSON.parse(res)

				_new_data.is_synced = 1 
				loop__+=1
				// alert("Loop ["+loop__+"]")
				_createNewFileEntry(fnames_,JSON.stringify(_new_data),function(){
					// populate_file_ls()
					// println("Loop :"+loop__)
					func(loop__)
				})
			})
		}
	})
}
			
function calcu(ids,class_){
	var amounts_ = $CLASS(class_)
	var total_ = 0
	for (var i = 0; i < amounts_.length; i++) {
		var val_ =parseInt(amounts_[i].value)
		if(amounts_[i].value==""){val_=0}
		total_ += val_
	}
	$ID(ids).innerHTML = Money(total_)
	return total_
	// $ID("av_gross_year_hh_income").innerHTML = total_
}

// <span class="x-text-red">*</span>