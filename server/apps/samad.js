var showDb = require('../../server/utilities.js').showDb;
var q = require('q');

function samad(id, resource) {
	//console.log('_+_+_+_+_+_+_+_+_+_+_+_+', id, '_+_+_+_+_+_+_+_+_+_+_+_+', resource, '_+_+_+_+_+_+_+_+__+_');
	var dfd = q.defer();

	dfd.resolve(true);


	if (resource == '/' || resource == '/favicon.ico' || resource.indexOf('/vendor/') > -1) {
		dfd.resolve(true);
		//return dfd.promise;
	} else {
		//else return false;
		//console.log('~~~~~~~~~~~~~~~', id, resource);
		var query = 'select permission from role_resource,user_roles,resources where  user_roles.roleid = role_resource.roleid AND role_resource.resourceid = resources.resource_id AND resources.resource_add = ' + '\'' + resource + '\'' + ' AND user_roles.userid = ' + id;
		//console.log('\n', query, '\n');
		showDb(query).then(function (result) {
			//console.log('samad result)))))))))))))))))))))))))))))', id, result, resource);
			//
			if (result[0] && result[0].permission == 0) {
				dfd.resolve(false);
				//sreturn dfd.promise;
			} else dfd.resolve(true);
			//console.log("~~~~~~~~~~~~~~~~~~~samad---------->>>>>>>>>>>>>>>", result, resource);
			/*if (result.permission == 0) {
				console.log('*********************');
				return false;
			} else return true;*/
		}).fail(function (err) {
			//console.log('@@@@@@@@@@@@@@@@@@@error@@@@@@@@@@@@@@@@', err);
		});
	}

	return dfd.promise;
}

exports.samad = samad;