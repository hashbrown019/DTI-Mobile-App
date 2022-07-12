let SEL_IMG = []
let __SEL_IMG = []



var _temp_name = []

function imageCapture() {
	println(" * CAMERA Start")
	var options = {
		limit: 1
	};
	navigator.device.capture.captureImage(onSuccess, onError, options);

	function onSuccess(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			var path = mediaFiles[i].fullPath;
			console.log(path);
			var file__name = path.split("/")[path.split("/").length-1]

			SEL_IMG.push(file__name)
			save_img_name(path)
			println()
			console.log(mediaFiles);
		}
	}

	function onError(error) {
		println(" * CAMERA ERROR")
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	}
}



// ---------------------------------------------
function _imageCapture(input_id_basem,preview) {
	println(" * CAMERA Start")
	// preview_profile_img
	navigator.device.capture.captureImage(onSuccess, onError, {limit: 1});

	function onSuccess(mediaFiles) {
		var i, path, len;
		for (i = 0, len = mediaFiles.length; i < len; i += 1) {
			var s_img = mediaFiles[i].fullPath
			println(JSON.stringify(s_img))

			getFileContentAsBase64(s_img,function(base64Image){
			  //window.open(base64Image);
				console.log(base64Image); 
				// INDET = "data:image/png;base64, "
				INDET = ""
				$ID(input_id_basem).value = INDET+base64Image
				$ID(preview).src = INDET+base64Image
			  // Then you'll be able to handle the myimage.png file as base64
			});
		}
	}

	function onError(error) {
		println(" * CAMERA ERROR")
		navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
	}
	// 
}

// ------------------------------------------------------------------
function getFileContentAsBase64(path,callback){
	window.resolveLocalFileSystemURL(path, gotFile, fail);
			
	function fail(e) {
		  alert('Cannot found requested file');
	}

	function gotFile(fileEntry) {
		   fileEntry.file(function(file) {
			  var reader = new FileReader();
			  reader.onloadend = function(e) {
				   var content = this.result;
				   callback(content);
			  };
			  // The most important point, use the readAsDatURL Method from the file plugin
			  reader.readAsDataURL(file);
		   });
	}
}