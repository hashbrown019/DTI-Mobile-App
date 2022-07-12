try{
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
		console.log(cordova.file);
		println(" * File Module Ready ================================");
	}
}catch(err){println(err)}

function _createNewFileEntry(file_name,file_data,func) {
	println("============cordova.file.externalDataDirectory===============")
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function success(dirEntry) {
		dirEntry.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
			writeFile(fileEntry, file_data, func);
		}, _onErrorCreateFile);
	}, _onErrorResolveUrl);
}

function writeFile(fileEntry, dataObj,func) {
	fileEntry.createWriter(function (fileWriter) {
		fileWriter.onwriteend = function() {console.log("Successful file write...");func()};
		fileWriter.onerror = function (e) {console.log("Failed file write: " + e.toString());};
		var _dataObj = new Blob([dataObj], { type: 'text/plain' });
		// var _dataObj = new Blob([dataObj], { type: 'timage/jpeg' });
		// if (!dataObj) {dataObj = new Blob(dataObj, { type: 'image/jpeg' });}
		// if (!dataObj) {dataObj = new Blob(dataObj, { type: 'text/plain' });}
		// fileWriter.write(dataObj);
		fileWriter.write(_dataObj);
	});
}

// -------------------------------
function _readFileEntry(file_name,func) {
	window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, function success(dirEntry) {
		dirEntry.getFile(file_name, { create: true, exclusive: false }, function (fileEntry) {
			// writeFile(fileEntry, JSON.parse(DATA_SYNC));
			readed_cont = readFile(fileEntry,func,file_name)
			// $print(" readed content ---- :" + readed_cont)
			return readed_cont
		}, _onErrorCreateFile);
	}, _onErrorResolveUrl);
}

function readFile(fileEntry,func,file_name) {

	fileEntry.file(function (file) {
		var reader = new FileReader();
		reader.onloadend = function() {
			func(this.result,file_name)
			return this.result
		};
		rdsa = reader.readAsText(file);
	}, onErrorReadFile);
}

// ---------------------------------------
function _onErrorResolveUrl(e){alert(" xx File Handling Error xx\n"+e);console.log("_onErrorResolveUrl xxxxxxxxxxxxxxxxxxxxxxxx");console.log(e);};
function _onErrorCreateFile(e){alert(" xx File Handling Error xx\n"+e);console.log("Create file fail xxxxxxxxxxxxxxxxxxxxxxxxx");console.log(e);};
function onErrorReadFile(e){alert(" xx File Handling Error xx\n"+e);$print(e)}



function FILES_IS_EXIST(file,fileExists,fileDoesNotExist){
	var PATH = cordova.file.externalDataDirectory+file
	println("-=-=-=- Locating File ["+PATH+"]")
	window.resolveLocalFileSystemURL(PATH,fileExists,fileDoesNotExist)
}
function getFSFail(evt) {
    console.log(evt.target.error.code);
    alert(evt.target.error.code);
}

// -------------------------------------------------------------------------------------------------
function FILES_GET_EXTERNALSTORAGE(func){
	var FILEASYNC = externalDataDirectory()
	FILEASYNC.start_scan(function(files){
		func(files)
	});
}
function externalDataDirectory() {
	let fff = undefined
	var errorHandler =  _defultErrorHandler;
	var fileHandler = _defultFileHandler;
	var path = cordova.file.externalDataDirectory

	return {
		start_scan:start_scan,
	};

	function start_scan(func) {
		fff = func
		window.resolveLocalFileSystemURL(path, _gotFiles, errorHandler );
	}


	function _gotFiles(entry) {
		if (entry.isFile) {}
		else {
			println("THIS is not a File : "+ JSON.stringify(entry) )
			var dirReader = entry.createReader();
			dirReader.readEntries( function(entryList) {
				fff(entryList)
			}, errorHandler );
		}
	}

	function _defultFileHandler(fileEntry){
		console.log( "FileEntry: " + fileEntry.name + " | " + fileEntry.fullPath );
	}
	function _defultErrorHandler(error){
		console.log( 'File System Error: ' + error.code );
	}
};


function getBase64(file,func) {
	 var reader = new FileReader();
	 reader.readAsDataURL(file);
	 reader.onload = function () {
		 // console.log(reader.result);
		 func(reader.result)
		 return reader.result
	 };
	 reader.onerror = function (error) {
		 // console.log('Error: ', error);
		 func("ERROR BASE64__")
		 return "ERROR BASE64__"
	 };
}