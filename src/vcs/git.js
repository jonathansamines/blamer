var exec = require('child_process').exec;
var path = require('path');
var Promise = require('bluebird');

function convertStringToObject(line) {
    var commit = {};
    var matches = line.match(/(.+) \((.+) (\d{4}-\d{2}-\d{2} .+) (\d+)\) (.*)/);
    if (!matches) {
        console.log('Wrong format');
    }
    commit.rev = matches[1];
    commit.author = matches[2];
    commit.date = matches[3];
    commit.line = matches[4];
    commit.content = matches[5];
    return commit;
}

module.exports = function (file) {
    var realFile = path.basename(file);
    var cwd = path.dirname(file);
    return new Promise(function (resolve, reject) {
        exec('git blame ' + realFile, {cwd: cwd}, function (error, stdout, stderr) {
            var result = {}, lines;
            if (error) {
                reject({
                    error: error,
                    message: stderr
                });
            } else {
                lines = stdout.split("\n");
                lines.forEach(function (line) {
                    if (line !== '') {
                        line = convertStringToObject(line);
                        result[line.line] = line;
                    }
                });
                resolve(result);
            }
        });
    });

};