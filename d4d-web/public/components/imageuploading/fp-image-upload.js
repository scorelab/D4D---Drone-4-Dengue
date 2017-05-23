angular.module('d4d')
.directive('fbImageUpload', [function() {
	return {
		link: function(scope, element, attrs) {
			// Modified from https://developer.mozilla.org/en-US/docs/Web/API/FileReader
			var fileReader = new FileReader();
			var fileFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
			var wasUploading = false;

			scope.image = {valid: false};

			scope.$watch('image.isUploading', function () {
				var isUploading = scope.image.isUploading;
				if (isUploading && !wasUploading) {
					wasUploading = true;
				}else if (!isUploading && wasUploading) {
					wasUploading = false;
					element.parent().parent()[0].reset();
				}
			});

			fileReader.onload = function (fileReaderEvent) {
				scope.$apply(function () {
					scope.image.data = fileReaderEvent.target.result;
				});
			};

			var load_image = function(imageInput) {
				if (imageInput.files.length === 0) { 
					return;
				}

				var file = imageInput.files[0];

				scope.image.filename = file.name;

				if (!fileFilter.test(file.type)) { 
					scope.error = 'You must select a valid image!';
					scope.image.valid = false;
					scope.$apply();
					return; 
				}else{
					scope.error = '';
					scope.image.valid = true;
				}

				fileReader.readAsDataURL(file);
				scope.$apply();
			};

			element[0].onchange = function() {
				load_image(element[0]);
			};
		},
		restrict: 'A'
	};
}]);