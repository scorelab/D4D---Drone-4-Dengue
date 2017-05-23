angular.module('d4d')
.controller('ImageUpload', ['$log',
	function ImageUpload(vm, $log) {
        vm.upload_image = function (image) {
			if (!image.valid) return;

			var imagesRef, safename, imageUpload;
			
			image.isUploading = true;
			imageUpload = {
				isUploading: true,
				data: image.data,
				thumbnail: image.thumbnail,
				name: image.filename,
				author: {
					provider: vm.auth.user.provider,
					id: vm.auth.user.id
				}
			};

			safename = imageUpload.name.replace(/\.|\#|\$|\[|\]|-|\//g, "");
			imagesRef = new Firebase(vm.firebaseUrl + '/images');

			imagesRef.child(safename).set(imageUpload, function (err) {
				if (!err) {
					imagesRef.child(safename).child('isUploading').remove();
					vm.$apply(function () {
						vm.status = 'Your image "' + image.filename + '" has been successfully uploaded!';
						if (vm.uploaded_callback !== undefined) {
							vm.uploaded_callback(angular.copy(imageUpload));
						}
						image.isUploading = false;
						image.data = undefined;
						image.filename = undefined;
					});
				}else{
					vm.error = 'There was an error while uploading your image: ' + err;
				}
			});
		};
	}
]);